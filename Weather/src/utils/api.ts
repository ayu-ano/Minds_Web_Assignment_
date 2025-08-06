import axios from 'axios';
import { formatDate } from './helper';

const API_URL = import.meta.env.VITE_OPEN_METEO_API_URL;

export const fetchWeatherData = async (
  center: [number, number],
  currentDate: Date,
  selectedTimeRange: [number, number],
  dataSource: string
) => {
  const startDate = new Date(currentDate);
  startDate.setDate(startDate.getDate() - 15);
  
  const endDate = new Date(currentDate);
  endDate.setDate(endDate.getDate() + 15);

  try {
    const response = await axios.get(API_URL, {
      params: {
        latitude: center[0],
        longitude: center[1],
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        hourly: dataSource,
      },
    });

    return response.data.hourly;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchWeatherDataForTimeRange = async (
  center: [number, number],
  startDate: Date,
  endDate: Date,
  dataSource: string
) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        latitude: center[0],
        longitude: center[1],
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        hourly: dataSource,
      },
    });

    return response.data.hourly;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};