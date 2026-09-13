import type { TruthState } from '../../core/truth';

export interface Territory {
  id: string;
  name: string;
  code?: string;
  level: string;
  parentId?: string;
  geometry?: GeoJSON.MultiPolygon;
  areaKm2?: number;
  truthState: TruthState;
}
