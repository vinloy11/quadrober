import { LngLat } from 'ymaps3';
import type { LngLatBounds } from '@yandex/ymaps3-types/common/types';

export interface YMapUpdateResponse {
  location: YMapUpdateResponseLocation,
}

export interface YMapUpdateResponseLocation {
  center: LngLat,
  zoom: number,
  bounds: LngLatBounds
}
