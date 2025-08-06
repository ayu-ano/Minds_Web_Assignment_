import type { Threshold } from '../types/types';

export const calculateColor = (value: number, thresholds: Threshold[]): string => {
  if (!thresholds || thresholds.length === 0) return '#cccccc';

  // Sort thresholds by value in ascending order
  const sortedThresholds = [...thresholds].sort((a, b) => a.value - b.value);

  for (const threshold of sortedThresholds) {
    switch (threshold.operator) {
      case '<':
        if (value < threshold.value) return threshold.color;
        break;
      case '<=':
        if (value <= threshold.value) return threshold.color;
        break;
      case '>':
        if (value > threshold.value) return threshold.color;
        break;
      case '>=':
        if (value >= threshold.value) return threshold.color;
        break;
      case '=':
        if (value === threshold.value) return threshold.color;
        break;
    }
  }

  // If no threshold matches, return the color of the highest threshold
  return sortedThresholds[sortedThresholds.length - 1]?.color || '#cccccc';
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatHour = (hour: number): string => {
  return `${hour.toString().padStart(2, '0')}:00`;
};

export const calculateBounds = (coordinates: [number, number][]): [[number, number], [number, number]] => {
  if (coordinates.length === 0) {
    return [
      [0, 0],
      [0, 0],
    ];
  }

  let minLat = coordinates[0][0];
  let maxLat = coordinates[0][0];
  let minLng = coordinates[0][1];
  let maxLng = coordinates[0][1];

  for (const [lat, lng] of coordinates) {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  }

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
};