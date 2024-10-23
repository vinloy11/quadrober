import { Inject, Injectable } from '@angular/core';
import { YMap, YMapFeatureDataSource, YMapLayer, YMapLocationRequest, YMapMarker } from 'ymaps3';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map: YMap | undefined;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    this.initMap();
    this.requestLocation();
  }

  async initMap() {
    await ymaps3.ready;

    const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = ymaps3;

    const defaultLocation: YMapLocationRequest = { center: [37.623082, 55.75254], zoom: 15 }

    this.map = new YMap(this.document.getElementById('map') as HTMLElement, { location: defaultLocation });

    this.map.addChild(new YMapDefaultSchemeLayer({})).addChild(new YMapDefaultFeaturesLayer({}));
  }

  requestLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      let location: YMapLocationRequest = {
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 15,
      };

      this.setLocation(location);
      this.setMarkerWithMe([position.coords.longitude, position.coords.latitude]);
    });
  }

  setMarkerWithMe(coordinates: number[]) {
    const { YMapMarker } = ymaps3;

    const meImg = this.document.createElement('div');
    meImg.innerHTML = `<img src="https://go.zvuk.com/thumb/1000x0/filters:quality(75):no_upscale()/imgs/2024/09/10/17/6589628/6b4e509b342e307568c339537f0f2cb2bdc03d9e.jpg"
                        width="24px"
                        height="24px"
      >`

    // TODO Доделать маркер
    const marker = new YMapMarker(
      {
        coordinates: coordinates as any,
        draggable: false,
        mapFollowsOnDrag: true
      },
      meImg as HTMLElement,
    );

    this.map?.addChild(marker);
  }

  setLocation(location: YMapLocationRequest) {
    this.map?.setLocation(location);
  }

  addPoint() {
    console.log('add point')
  }
}
