import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-add-point-button',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './add-point-button.component.html',
  styleUrl: './add-point-button.component.scss'
})
export class AddPointButtonComponent {
  userPoints = 0;

  constructor(
    private readonly mapService: MapService,
  ) {
  }

  addPoint() {
    this.mapService.addPoint();
  }
}
