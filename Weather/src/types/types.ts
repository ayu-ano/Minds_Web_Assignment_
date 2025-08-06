export interface Polygon {
  id: string;
  name: string;
  coordinates: [number, number][];
  dataSource: string;
  thresholds: Threshold[];
  color?: string;
  center: [number, number];
}

export interface Threshold {
  value: number;
  color: string;
  operator: '>' | '<' | '>=' | '<=' | '=';
}

export interface WeatherData {
  time: string[];
  temperature_2m: number[];
}

export interface DataSource {
  id: string;
  name: string;
  unit: string;
  minValue: number;
  maxValue: number;
  defaultThresholds: Threshold[];
}

export interface AppState {
  polygons: Polygon[];
  currentDate: Date;
  selectedTimeRange: [number, number];
  selectedDataSource: string;
  isDrawing: boolean;
  tempPolygon: [number, number][];
  dataSources: DataSource[];
}