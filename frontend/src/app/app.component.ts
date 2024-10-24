import { Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AddPointButtonComponent } from './map-controls/add-point-button/add-point-button.component';
import { MapComponent } from './map-controls/map/map.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, AddPointButtonComponent, MapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
  }
}
