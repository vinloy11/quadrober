import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MapService } from '../../services/map.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PointFormComponent } from '../point-form/point-form.component';

@Component({
  selector: 'app-add-point-button',
  standalone: true,
  imports: [
    NgIf,
    PointFormComponent,
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
    this.offcanvasService.open(PointFormComponent, { position: 'bottom', backdrop: false, panelClass: 'add-point-container' });
    this.mapService.addPoint();
  }
}
