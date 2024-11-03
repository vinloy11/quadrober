import { Inject, Injectable, signal, WritableSignal } from '@angular/core';
import { LngLat, YMap, YMapListener, YMapLocationRequest } from 'ymaps3';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { debounceTime, Subject, switchMap, map, filter, withLatestFrom, BehaviorSubject, take } from 'rxjs';
import { GeocoderResponse, Point } from '../models/geocoder-response';
import { ToastService } from './toast.service';
import { Address } from '../models/meeting/address';
import { Meeting } from '../models/meeting/meeting';
import { Nullable } from '../models/nullable';
import { YMapUpdateResponse } from '../models/y-map-update-response-location';
import { MeetingService } from './meeting.service';
import { MeetingSearchCriteria } from '../models/meeting/meeting-search-criteria';
import { Router } from '@angular/router';
import { YMapDefaultMarker } from '@yandex/ymaps3-types/packages/markers';

export enum MapState {
  INITIAL,
  FILLING_FORM_ADDRESS,
  FILLING_FORM_DATETIME,
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  static DEFAULT_ZOOM = 15;

  mapState = signal(MapState.INITIAL);
  editableMeeting: WritableSignal<Nullable<Meeting>> = signal(null);
  yandexPath = 'https://geocode-maps.yandex.ru/1.x/';
  apiKey = '3aa9f3c7-cef8-4674-8143-9764dfe005ea';
  pointCoordinates$ = new Subject<LngLat>();
  preparedCoordinates$ = this.pointCoordinates$.asObservable().pipe(
    debounceTime(250),
    switchMap((coordinates) => {
      return this.http.get<GeocoderResponse>(this.yandexPath, { params: { apikey: this.apiKey, geocode: coordinates.join(','), format: 'json' } });
    }),
    map((response): Address => {
      return this.geocoderResponseToAddress(response, true);
    })
  );
  meetingCriteria: WritableSignal<Nullable<MeetingSearchCriteria>> = signal(null);

  // Следим за состоянием обновления карты
  // В случае, если карта обновляется, подтягиваем список встреч
  private yMapUpdateResponse$ = new Subject<YMapUpdateResponse>();
  private lastYMapUpdateResponse: Nullable<YMapUpdateResponse> = null;
  private actualMeetingPoints$ = new BehaviorSubject<Map<string, Meeting>>(new Map());
  actualMeetingPointsObservable$ = this.actualMeetingPoints$.asObservable();
  private points: {[key: string]: YMapDefaultMarker} = {};
  private meetingPoints$ = this.yMapUpdateResponse$.asObservable()
    .pipe(
      debounceTime(250),
      filter(yMapUpdateResponse => !!yMapUpdateResponse),
      switchMap((response) => {
        this.lastYMapUpdateResponse = response;
        const bounds = response.location.bounds.map(bound => bound.join(',')).join(';');
        const criteria: MeetingSearchCriteria = { bounds };
        const meetingCriteria = this.meetingCriteria();
        if (meetingCriteria?.date) {
          criteria.date = meetingCriteria.date;
        }

        return this.meetingService.getMeetings(criteria);
      }),
      withLatestFrom(this.actualMeetingPointsObservable$),
      map(([meetings, actualMeetings]) => {
        const meetingMap = new Map(meetings.map(meeting => [`${meeting.id}`, meeting]));

        if (actualMeetings) {
          meetingMap.forEach((value, key) => {
            if (this.map && !actualMeetings.has(`${value.id}`)) {
              this.addPoint({
                coordinates: value.address.point as LngLat,
                draggable: false,
                hasTitle: false,
                hasSubtitle: false,
                pointId: value.id,
              });
            }

            actualMeetings.set(key, value);
          });

          this.actualMeetingPoints$.next(actualMeetings);
        } else {
          this.actualMeetingPoints$.next(meetingMap);
        }

        return meetings;
      }),
    ).subscribe();

  map: YMap | undefined;

  // Не разобрался с типами.
  // Сохраняю в переменную, чтобы потом удалять,
  // когда хочу добавить новую точку для встречи
  meetingPoint: any;

  constructor(
    private readonly http: HttpClient,
    private readonly toastService: ToastService,
    private readonly meetingService: MeetingService,
    private readonly router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.initMap();
    this.showHintToast();
  }

  /**
   * Преобразование формата ответа от яндекса в формат для бэкенда
   * @param response
   * @param enableFillMetadataCoordinates - Берет координаты из метадаты,
   * чтобы показывать точные данные клика пользователя. При поиске через инпут должен быть отключен, если поиск через ползунок - включен
   */
  geocoderResponseToAddress({response}: GeocoderResponse, enableFillMetadataCoordinates: boolean = false): Address {
    const responseFeatureMember = response?.GeoObjectCollection?.featureMember?.[0];

    if (enableFillMetadataCoordinates) {
      // Смешиваю данные из метадаты, чтобы оставались точные координаты, иначе будут браться координаты совпадений по поиску
      const metadata = response?.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.Point.pos;
      responseFeatureMember.GeoObject.Point.pos = metadata;
    }

    return {
      point: responseFeatureMember?.GeoObject.Point.pos.split(' ').map(i => +i),
      description: responseFeatureMember?.GeoObject.description,
      name: responseFeatureMember?.GeoObject.name,
    }
  }

  async initMap() {
    await ymaps3.ready;

    // await ymaps3.ready.then(() => {
    //   ymaps3.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', ['@yandex/ymaps3-default-ui-theme@latest']);
    // });

    const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapListener } = ymaps3;

    const defaultLocation: YMapLocationRequest = { center: [37.623082, 55.75254], zoom: MapService.DEFAULT_ZOOM }

    this.map = new YMap(this.document.getElementById('map') as HTMLElement, { location: defaultLocation, theme: 'dark' });

    this.map.addChild(new YMapDefaultSchemeLayer({})).addChild(new YMapDefaultFeaturesLayer({}));

    // Создание объекта-слушателя.
    const mapListener = new YMapListener({
      layer: 'any',
      onUpdate: this.updateHandler.bind(this),
    });

    // Добавление слушателя на карту.
    this.map.addChild(mapListener);

    this.requestLocation();
  }

  requestLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      let location: YMapLocationRequest = {
        center: [position.coords.longitude, position.coords.latitude],
        zoom: MapService.DEFAULT_ZOOM,
      };

      this.setLocation(location);
      this.setMarkerWithMe([position.coords.longitude, position.coords.latitude]);
    });
  }

  async setMarkerWithMe(coordinates: number[]) {
    try {
      // @ts-ignore
      const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

      const mePoint = new YMapDefaultMarker({
        coordinates: coordinates as LngLat,
        draggable: false,
        title: 'Вы сейчас здесь',
      }) as any;

      this.map?.addChild(mePoint)
    } catch (e) {

    }
  }

  setLocation(location: YMapLocationRequest) {
    this.map?.setLocation(location);
  }

  /**
   * Создать ползунок для выбора места встречи
   */
  async addPoint({ coordinates, draggable, title, subtitle, isEditableMeetingPoint, hasTitle = true, hasSubtitle = true, pointId }: {
    coordinates?: LngLat,
    draggable?: boolean,
    title?: string,
    subtitle?: string,
    isEditableMeetingPoint?: boolean,
    hasTitle?: boolean,
    hasSubtitle?: boolean,
    pointId?: string,
  } = {}) {

    try {
      // @ts-ignore
      const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

      if (this.meetingPoint && isEditableMeetingPoint) {
        this.map?.removeChild(this.meetingPoint);
      }

      const newPoint = new YMapDefaultMarker({
        coordinates: coordinates || this.map?.center as LngLat,
        draggable: draggable === false ? false : true,
        title: hasTitle ? title || 'Место встречи' : undefined,
        subtitle: hasSubtitle ? subtitle || 'Передвигайте ползунок' : undefined,
        // onDragMove: this.onDragMovePointAHandler,
        onDragEnd: this.onDragEndHandler.bind(this),
        properties: {pointId},
        onClick: this.openMeetingInfo.bind(this, pointId),
      }) as any;

      if (!pointId) {
        this.meetingPoint = newPoint;
      } else {
        if (this.points[pointId]) {
          this.map?.removeChild(this.points[pointId]);
        }

        this.points[pointId] = newPoint;
      }


      this.map?.addChild(newPoint)
    } catch (e) {

    }
  }

  openMeetingInfo(pointId?: string) {
    if (pointId) {
      this.router.navigate(['/meetings', pointId]);
    }
  }

  addPointFromInput(coordinates: LngLat) {
    let location: YMapLocationRequest = {
      center: coordinates,
      zoom: MapService.DEFAULT_ZOOM,
    };

    this.map?.setLocation(location);
    this.addPoint({ coordinates, isEditableMeetingPoint: true });
  }

  // Принимает адрес стрингой, чтобы посмотреть координаты
  getCoordinatesByAddress(address: string) {
    return this.http.get<GeocoderResponse>(this.yandexPath, { params: { apikey: this.apiKey, geocode: address, format: 'json' } })
      .pipe(
        map((response): Address[] => {
          return this.geocoderResponseListToAddress(response);
        })
      );
  }

  // Отслеживает конечную точку ползунка
  onDragEndHandler(event: LngLat) {
    this.pointCoordinates$.next(event);
  }

  setMapState(state: MapState) {
    this.mapState.set(state);
    this.showHintToast();
  }

  removeMeetingPoint() {
    this.map?.removeChild(this.meetingPoint);
  }

  private showHintToast() {
    this.toastService.clear();

    let hintText = '';

    switch (this.mapState()) {
      case MapState.FILLING_FORM_ADDRESS:
        hintText = 'Перенесите ползунок или введите в поисковой строке место, где будет встреча';
        break;
      case MapState.FILLING_FORM_DATETIME:
        hintText = 'Выберите дату и время, когда вы планируете придти в указанное место';
        break;
      case MapState.INITIAL:
        hintText = 'Выберите уже существующую встречу или создайте свою нажав на кнопку "Запланировать встречу"';
        break;
    }

    this.toastService.show({
      text: hintText,
      classname: 'bg-primary text-light',
      delay: 10000,
    });
  }

  private geocoderResponseListToAddress({response}: GeocoderResponse): Address[] {
    const responseFeatureMembers = response?.GeoObjectCollection?.featureMember;

    return responseFeatureMembers?.map(responseFeatureMember => ({
      point: responseFeatureMember?.GeoObject.Point.pos.split(' ').map(i => +i),
      description: responseFeatureMember?.GeoObject.description,
      name: responseFeatureMember?.GeoObject.name,
    }));
  }

  private updateHandler(event: YMapUpdateResponse | any) {
    this.yMapUpdateResponse$.next(event);

    return event;
  }

  removeMeetingPointById(meetingId: string | undefined) {
    if (!meetingId) return;

    this.map?.removeChild(this.points[meetingId]);
    delete this.points[meetingId];
  }

  searchWithCriteria(meetingSearchCriteria: MeetingSearchCriteria) {
    this.meetingCriteria.set(meetingSearchCriteria);

    if (this.lastYMapUpdateResponse) {
      this.removeAllPoints();
      this.actualMeetingPoints$.next(new Map());
      this.yMapUpdateResponse$.next(this.lastYMapUpdateResponse);
    }
  }

  private removeAllPoints() {
    Object.values(this.points).forEach(point => {
      if (point) {
        this.map?.removeChild(point);
      }
    })
  }
}
