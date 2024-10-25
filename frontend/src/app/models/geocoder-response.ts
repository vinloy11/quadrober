import { LngLat } from 'ymaps3';

export interface GeocoderResponse {
  response: GeoObjectCollection;
}

export interface GeoObjectCollection {
  GeoObjectCollection: GeoObjectData;
}

export interface GeoObjectData {
  metaDataProperty: GeocoderResponseMetaData;
  featureMember: FeatureMember[];
}

export interface FeatureMember {
  GeoObject: GeoObject;
}

export interface GeoObject {
  /**
   * Название точки
   */
  name: string;
  /**
   * Полные данные до точки
   */
  description: string;
  Point: Point;
}

export interface Point {
  /**
   * Координаты места через пробел
   */
  pos: string;
}

export interface GeocoderResponseMetaData {
  GeocoderResponseMetaData: {
    Point: Point;
    found: string,
    // Строка или координаты которые мы отправляли
    request: string,
    results: string;
  },
}
