import { Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { MapService } from './services/map.service';
import { AddPointButtonComponent } from './map-controls/add-point-button/add-point-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, AddPointButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(
    public readonly mapService: MapService
  ) { }

  ngOnInit() {
  }
}
