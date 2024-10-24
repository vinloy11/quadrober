import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MapService, MapState } from '../../services/map.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-point-button',
  standalone: true,
  imports: [
    NgIf,
  ],
  templateUrl: './add-point-button.component.html',
  styleUrl: './add-point-button.component.scss'
})
export class AddPointButtonComponent {

  constructor(
    private readonly mapService: MapService,
    protected readonly offcanvasService: NgbOffcanvas
  ) {

  }

  addPoint() {
    this.mapService.setMapState(MapState.FILLING_FORM);
    this.mapService.addPoint();
  }
}
