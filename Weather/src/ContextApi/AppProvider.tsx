import React, { useState, useEffect } from 'react';
import { AppContext } from './AppContext';
import type { DataSource, Polygon, Threshold, AppState } from '../types/types';
import { v4 as uuidv4 } from 'uuid';
import { fetchWeatherData } from '../utils/api';
import { calculateColor } from '../utils/helper';

const DEFAULT_DATA_SOURCES: DataSource[] = [
  {
    id: 'temperature_2m',
    name: 'Temperature at 2m',
    unit: '°C',
    minValue: -20,
    maxValue: 40,
    defaultThresholds: [
      { value: 10, color: 'blue', operator: '<' },
      { value: 25, color: 'green', operator: '>=' },
      { value: 25, color: 'orange', operator: '<' },
    ],
  },
];

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    polygons: [],
    currentDate: new Date(),
    selectedTimeRange: [0, 0],
    selectedDataSource: DEFAULT_DATA_SOURCES[0].id,
    isDrawing: false,
    tempPolygon: [],
    dataSources: DEFAULT_DATA_SOURCES,
  });

  // Load saved polygons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weatherDashboardPolygons');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          polygons: parsed.polygons || [],
          selectedDataSource: parsed.selectedDataSource || DEFAULT_DATA_SOURCES[0].id,
        }));
      } catch (e) {
        console.error('Failed to parse saved polygons', e);
      }
    }
  }, []);

  // Save polygons to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      'weatherDashboardPolygons',
      JSON.stringify({
        polygons: state.polygons,
        selectedDataSource: state.selectedDataSource,
      })
    );
  }, [state.polygons, state.selectedDataSource]);

  const addPolygon = async (polygon: Omit<Polygon, 'id' | 'color'>) => {
    const newPolygon: Polygon = {
      ...polygon,
      id: uuidv4(),
      color: '',
    };

    try {
      const weatherData = await fetchWeatherData(
        newPolygon.center,
        state.currentDate,
        state.selectedTimeRange,
        state.selectedDataSource
      );

      const avgValue = calculateAverageValue(weatherData, state.selectedDataSource);
      const color = calculateColor(avgValue, newPolygon.thresholds);

      setState(prev => ({
        ...prev,
        polygons: [...prev.polygons, { ...newPolygon, color }],
        isDrawing: false,
        tempPolygon: [],
      }));
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    }
  };

  const updatePolygon = async (id: string, updates: Partial<Polygon>) => {
    setState(prev => {
      const updatedPolygons = prev.polygons.map(poly => {
        if (poly.id === id) {
          return { ...poly, ...updates };
        }
        return poly;
      });

      return { ...prev, polygons: updatedPolygons };
    });

    // If thresholds or data source changed, recalculate color
    if (updates.thresholds || updates.dataSource) {
      const polygon = state.polygons.find(p => p.id === id);
      if (polygon) {
        try {
          const weatherData = await fetchWeatherData(
            polygon.center,
            state.currentDate,
            state.selectedTimeRange,
            updates.dataSource || polygon.dataSource
          );

          const avgValue = calculateAverageValue(
            weatherData,
            updates.dataSource || polygon.dataSource
          );
          const thresholds = updates.thresholds || polygon.thresholds;
          const color = calculateColor(avgValue, thresholds);

          setState(prev => ({
            ...prev,
            polygons: prev.polygons.map(p => 
              p.id === id ? { ...p, color, ...updates } : p
            ),
          }));
        } catch (error) {
          console.error('Failed to update polygon:', error);
        }
      }
    }
  };

  const deletePolygon = (id: string) => {
    setState(prev => ({
      ...prev,
      polygons: prev.polygons.filter(poly => poly.id !== id),
    }));
  };

  const setSelectedTimeRange = (range: [number, number]) => {
    setState(prev => ({ ...prev, selectedTimeRange: range }));
  };

  const setCurrentDate = (date: Date) => {
    setState(prev => ({ ...prev, currentDate: date }));
  };

  const setSelectedDataSource = (source: string) => {
    setState(prev => ({ ...prev, selectedDataSource: source }));
  };

  const startDrawing = () => {
    setState(prev => ({ ...prev, isDrawing: true, tempPolygon: [] }));
  };

  const addTempPoint = (point: [number, number]) => {
    setState(prev => ({
      ...prev,
      tempPolygon: [...prev.tempPolygon, point],
    }));
  };

  const finishDrawing = (cancel: boolean = false) => {
    if (cancel) {
      setState(prev => ({ ...prev, isDrawing: false, tempPolygon: [] }));
      return;
    }

    if (state.tempPolygon.length >= 3) {
      const center = calculateCenter(state.tempPolygon);
      const dataSource = state.dataSources.find(
        ds => ds.id === state.selectedDataSource
      );

      if (dataSource) {
        addPolygon({
          name: `Area ${state.polygons.length + 1}`,
          coordinates: state.tempPolygon,
          dataSource: dataSource.id,
          thresholds: dataSource.defaultThresholds,
          center,
        });
      }
    } else {
      setState(prev => ({ ...prev, isDrawing: false, tempPolygon: [] }));
    }
  };

  const addThreshold = (polygonId: string, threshold: Threshold) => {
    setState(prev => ({
      ...prev,
      polygons: prev.polygons.map(poly => {
        if (poly.id === polygonId) {
          return {
            ...poly,
            thresholds: [...poly.thresholds, threshold],
          };
        }
        return poly;
      }),
    }));
  };

  const removeThreshold = (polygonId: string, index: number) => {
    setState(prev => ({
      ...prev,
      polygons: prev.polygons.map(poly => {
        if (poly.id === polygonId) {
          const newThresholds = [...poly.thresholds];
          newThresholds.splice(index, 1);
          return {
            ...poly,
            thresholds: newThresholds,
          };
        }
        return poly;
      }),
    }));
  };

  // Helper function to calculate average value from weather data
  const calculateAverageValue = (weatherData: any, dataSource: string) => {
    if (!weatherData || !weatherData[dataSource]) return 0;
    
    const values = weatherData[dataSource];
    if (values.length === 0) return 0;
    
    const sum = values.reduce((acc: number, val: number) => acc + val, 0);
    return sum / values.length;
  };

  // Helper function to calculate center of polygon
  const calculateCenter = (coordinates: [number, number][]): [number, number] => {
    if (coordinates.length === 0) return [0, 0];
    
    let latSum = 0;
    let lngSum = 0;
    
    for (const [lat, lng] of coordinates) {
      latSum += lat;
      lngSum += lng;
    }
    
    return [latSum / coordinates.length, lngSum / coordinates.length];
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addPolygon,
        updatePolygon,
        deletePolygon,
        setSelectedTimeRange,
        setCurrentDate,
        setSelectedDataSource,
        startDrawing,
        addTempPoint,
        finishDrawing,
        addThreshold,
        removeThreshold,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;