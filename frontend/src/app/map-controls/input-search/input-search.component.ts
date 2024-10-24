import { Component, forwardRef, OnDestroy, OnInit, Optional } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroupDirective, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FeatureMember } from '../../models/geocoder-response';
import { debounceTime, filter, map, mergeMap, Observable, of, OperatorFunction, Subject, takeUntil } from 'rxjs';
import { MapService } from '../../services/map.service';
import { LngLat } from 'ymaps3';
import { PointForm } from '../map/map.component';
import { NgIf } from '@angular/common';
import { Nullable } from '../../models/nullable';

@Component({
  selector: 'app-input-search',
  standalone: true,
  imports: [
    NgbTypeahead,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.scss',
})
export class InputSearchComponent implements OnDestroy, OnInit {
  form: Nullable<PointForm> = null;
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
      return `${x.GeoObject?.name}`
    } else {
      return ''
    }
  };

  constructor(
    private readonly mapService: MapService,
    @Optional() private readonly formGroupDirective: FormGroupDirective
  ) {
  }

  ngOnInit() {
    this.form = this.formGroupDirective.control;

    this.mapService.preparedCoordinates$
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe(response => {
        this.form?.controls.address.patchValue(
          response.response?.GeoObjectCollection?.featureMember?.[0],
          { emitEvent: false }
        );
      });

    this.form.controls.address.valueChanges.pipe(
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

  goNext() {
    console.log('continue')
  }
}
