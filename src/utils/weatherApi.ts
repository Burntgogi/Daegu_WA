import type { AirQuality, WeatherData, WeatherCondition } from '../types';
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

const isMeasurement = (value: unknown): value is number =>
    typeof value === 'number' && Number.isFinite(value);

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
    const weatherRequest = (async () => {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
        );
        if (!response.ok) throw new Error(`Weather HTTP ${response.status}`);
        const { current, daily } = await response.json();
        if (![current?.temperature_2m, current?.weather_code, current?.is_day].every(isMeasurement)) {
            throw new Error('Weather observations unavailable');
        }

        const forecast = [];
        for (let i = 1; i <= 4; i++) {
            if (![daily?.temperature_2m_min?.[i], daily?.temperature_2m_max?.[i], daily?.weather_code?.[i]].every(isMeasurement)) {
                throw new Error('Forecast observations unavailable');
            }
            forecast.push({
                date: format(new Date(daily.time[i]), 'MM/dd'),
                dayOfWeek: format(new Date(daily.time[i]), 'EEE', { locale: ko }),
                minTemp: Math.round(daily.temperature_2m_min[i]),
                maxTemp: Math.round(daily.temperature_2m_max[i]),
                condition: mapWmoCodeToCondition(daily.weather_code[i], 1)
            });
        }
        return {
            current: {
                condition: mapWmoCodeToCondition(current.weather_code, current.is_day),
                temperature: Math.round(current.temperature_2m),
                description: mapWmoCodeToDescription(current.weather_code)
            },
            forecast
        };
    })();

    const airRequest = (async (): Promise<AirQuality> => {
        const response = await fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5`
        );
        if (!response.ok) throw new Error(`Air quality HTTP ${response.status}`);
        const { current } = await response.json();
        if (!isMeasurement(current?.pm10) || !isMeasurement(current?.pm2_5)) {
            throw new Error('Air quality observations unavailable');
        }
        return {
            pm10: current.pm10,
            pm25: current.pm2_5,
            level: getAirQualityLevel(current.pm10)
        };
    })();

    const [weather, air] = await Promise.allSettled([weatherRequest, airRequest]);
    if (weather.status === 'rejected') console.error('Failed to fetch weather:', weather.reason);
    if (air.status === 'rejected') console.error('Failed to fetch air quality:', air.reason);
    return {
        current: weather.status === 'fulfilled' ? weather.value.current : null,
        forecast: weather.status === 'fulfilled' ? weather.value.forecast : [],
        airQuality: air.status === 'fulfilled' ? air.value : null
    };
};
