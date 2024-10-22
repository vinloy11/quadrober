import { Component, Inject, Optional } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { YMapLocationRequest } from 'ymaps3';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    this.initMap();
  }

  async initMap() {
    await ymaps3.ready;

    const LOCATION: YMapLocationRequest = {
      center: [37.623082, 55.75254],
      zoom: 9
    };

    const { YMap, YMapDefaultSchemeLayer } = ymaps3;

    const map = new YMap(this.document.getElementById('map') as HTMLElement, { location: LOCATION });
    map.addChild(new YMapDefaultSchemeLayer({}));
  }
}
