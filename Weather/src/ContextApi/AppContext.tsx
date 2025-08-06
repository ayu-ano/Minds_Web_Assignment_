import { createContext } from 'react';
import type { AppState, Polygon, Threshold } from '../types/types'; // Added 'type' keyword

type AppContextType = {
  state: AppState;
  addPolygon: (polygon: Omit<Polygon, 'id' | 'color'>) => void;
  updatePolygon: (id: string, updates: Partial<Polygon>) => void;
  deletePolygon: (id: string) => void;
  setSelectedTimeRange: (range: [number, number]) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedDataSource: (source: string) => void;
  startDrawing: () => void;
  addTempPoint: (point: [number, number]) => void;
  finishDrawing: (cancel?: boolean) => void;
  addThreshold: (polygonId: string, threshold: Threshold) => void;
  removeThreshold: (polygonId: string, index: number) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);