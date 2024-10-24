import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import {
  debounceTime,
  filter,
  map, mergeMap,
  Observable,
  of,
  OperatorFunction,
  Subject,
  takeUntil
} from 'rxjs';
import { LngLat } from 'ymaps3';
import { FeatureMember } from '../../models/geocoder-response';
import { JsonPipe, NgIf } from '@angular/common';

enum STEPS {
  STEP_1,
  STEP_2,
}

@Component({
  selector: 'app-point-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgbTypeahead,
    JsonPipe,
    NgIf
  ],
  templateUrl: './point-form.component.html',
  styleUrl: './point-form.component.scss'
})
export class PointFormComponent implements OnDestroy, OnInit {
  protected STEPS = STEPS;
  protected currentStep = signal(STEPS.STEP_1);
  address = new FormControl<FeatureMember | null>(null);
  private readonly unsubscribe$ = new Subject<null>();
  search: OperatorFunction<string, readonly FeatureMember[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(1000),
      filter((address) => !!address && !!address.trim().length),
      mergeMap((term) => {
        return term ? this.mapService.getCoordinatesByAddress(term) : of(null);
      }),
      map(items => {
        if (items) {
          return items.response?.GeoObjectCollection?.featureMember || [];
        } else {
          return [];
        }
      }),
    );

  formatter = (x: FeatureMember) => {
    if (x) {
      return `${x.GeoObject?.description} ${x.GeoObject?.name}`
    } else {
      return ''
    }
  };

  constructor(
    private readonly mapService: MapService,
  ) {
  }

  ngOnInit() {
    this.mapService.preparedCoordinates$
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe(response => {
        this.address.patchValue(
          response.response?.GeoObjectCollection?.featureMember?.[0],
          { emitEvent: false }
        );
      });

    this.address.valueChanges.pipe(
      debounceTime(300),
      filter(address => !!address?.GeoObject),
      takeUntil(this.unsubscribe$),
    ).subscribe(address => {
      if (address) {
        this.mapService.addPointFromInput(address.GeoObject.Point.pos.split(' ').map(item => +item) as LngLat)
      }
    })
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  chooseOnMap() {
    this.mapService.chooseOnMap();
  }

  goToStep2() {
    this.currentStep.set(STEPS.STEP_2);
  }

  goStep(step: STEPS) {
    this.currentStep.set(step);
  }
}
