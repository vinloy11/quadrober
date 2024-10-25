import { Component, OnInit, Optional, ViewContainerRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { MapService, MapState } from '../../services/map.service';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { Nullable } from '../../models/nullable';
import { PointForm } from '../map/map.component';
import { LngLat } from 'ymaps3';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApproveInfoModalComponent } from '../approve-info-modal/approve-info-modal.component';
import { merge, take } from 'rxjs';

@Component({
  selector: 'app-date-time-control',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './date-time-control.component.html',
  styleUrl: './date-time-control.component.scss'
})
export class DateTimeControlComponent implements OnInit {
  protected form: Nullable<PointForm> = null;
  /**
   * Преобразована для корректного min в инпуте
   * 2021-06-07T14:47:57
   * @protected
   */
  protected readonly currentDate = new Date().toISOString().slice(0,new Date().toISOString().lastIndexOf(":"));

  constructor(
    private readonly mapService: MapService,
    private readonly modalService: NgbModal,
    private readonly containerRef: ViewContainerRef,
    @Optional() private readonly formGroupDirective: FormGroupDirective,
  ) {
  }

  ngOnInit() {
    this.form = this.formGroupDirective.control;
  }

  goPrev() {
    this.mapService.setMapState(MapState.FILLING_FORM_ADDRESS);
    if (this.form) {
      this.mapService.addPoint({
        // Ставим точно такую же точку на тех же координатах, только которую можно двигать
        coordinates: this.form.value.address?.GeoObject.Point.pos.split(' ').map(item => +item) as LngLat,
        draggable: true,
      });
    }
  }

  goNext() {
    if (!this.form) return;

    const component = this.modalService.open(ApproveInfoModalComponent);
    component.componentInstance.form = this.form;

    merge(
      component.dismissed,
      component.closed
    )
      .pipe(take(1))
      .subscribe((response: boolean) => {
        if (response) {
          console.log('send request')
          this.mapService.mapState.set(MapState.INITIAL);
        } else {
          this.mapService.mapState.set(MapState.FILLING_FORM_DATETIME);
        }
      })
  }
}
