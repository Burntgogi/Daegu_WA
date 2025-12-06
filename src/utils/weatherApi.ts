import type { WeatherData, WeatherCondition } from '../types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const mapWmoCodeToCondition = (code: number, isDay: number): WeatherCondition => {
    if (code === 0) return isDay ? 'Sunny' : 'Night';
    if (code === 1 || code === 2 || code === 3) return 'Cloudy'; // OpenMeteo 1-3 is clear/partly cloudy, but mapping to Cloudy for simplicity or Sunny? Let's say Cloudy for now or Sunny for 1.
    if (code === 45 || code === 48) return 'Fog';
    if (code >= 51 && code <= 67) return 'Rain';
    if (code >= 71 && code <= 86) return 'Snow';
    if (code >= 95 && code <= 99) return 'Rain';
    return 'Cloudy';
};

const mapWmoCodeToDescription = (code: number): string => {
    if (code === 0) return '맑음';
    if (code === 1) return '대체로 맑음';
    if (code === 2) return '약간 흐림';
    if (code === 3) return '흐림';
    if (code === 45 || code === 48) return '안개';
    if (code >= 51 && code <= 55) return '이슬비';
    if (code >= 61 && code <= 65) return '비';
    if (code >= 71 && code <= 77) return '눈';
    if (code >= 95) return '뇌우';
    return '흐림';
};

const getAirQualityLevel = (pm10: number): 'Good' | 'Moderate' | 'Bad' | 'Very Bad' => {
    if (pm10 <= 30) return 'Good';
    if (pm10 <= 80) return 'Moderate';
    if (pm10 <= 150) return 'Bad';
    return 'Very Bad';
};

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
    try {
        // 1. Fetch Weather + Forecast
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
        );
        const weatherJson = await weatherRes.json();

        // 2. Fetch Air Quality
        const airRes = await fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5`
        );
        const airJson = await airRes.json();

        const current = weatherJson.current;
        const daily = weatherJson.daily;
        const air = airJson.current;

        // Process Forecast (Skip today, take next 4 days)
        const forecast = [];
        for (let i = 1; i <= 4; i++) {
            forecast.push({
                date: format(new Date(daily.time[i]), 'MM/dd'),
                dayOfWeek: format(new Date(daily.time[i]), 'EEE', { locale: ko }),
                minTemp: Math.round(daily.temperature_2m_min[i]),
                maxTemp: Math.round(daily.temperature_2m_max[i]),
                condition: mapWmoCodeToCondition(daily.weather_code[i], 1) // Forecast always shows day icon
            });
        }

        return {
            current: {
                condition: mapWmoCodeToCondition(current.weather_code, current.is_day),
                temperature: Math.round(current.temperature_2m),
                description: mapWmoCodeToDescription(current.weather_code)
            },
            airQuality: {
                pm10: air.pm10,
                pm25: air.pm2_5,
                level: getAirQualityLevel(air.pm10)
            },
            forecast
        };

    } catch (error) {
        console.error("Failed to fetch weather:", error);
        // Fallback
        return {
            current: { condition: 'Sunny', temperature: 0, description: '연결 실패' },
            airQuality: { pm10: 0, pm25: 0, level: 'Good' },
            forecast: []
        };
    }
};
