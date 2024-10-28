import { Component } from '@angular/core';
import { AddPointButtonComponent } from '../add-point-button/add-point-button.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatureMember } from '../../models/geocoder-response';
import { Nullable } from '../../models/nullable';
import { InputSearchComponent } from '../input-search/input-search.component';
import { NgIf } from '@angular/common';
import { MapState, MapService } from '../../services/map.service';
import { DateTimeControlComponent } from '../date-time-control/date-time-control.component';
import { ToastsContainer } from '../../shared/toasts-container';
import { Address } from '../../models/meeting/address';

export type PointForm = FormGroup<PointFormGroup>;

export interface PointFormGroup {
  address: FormControl<Nullable<Address>>,
  pointDateTime: FormControl<Nullable<Date | string>>
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    AddPointButtonComponent,
    InputSearchComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    DateTimeControlComponent,
    ToastsContainer
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  form: PointForm;

  constructor(
    private readonly fb: FormBuilder,
    protected readonly mapService: MapService
  ) {
    this.form = this.fb.group({
      address: new FormControl<Nullable<Address>>(null),
      pointDateTime: new FormControl<Nullable<Date | string>>(null),
    });
  }

  protected readonly MapState = MapState;
}
