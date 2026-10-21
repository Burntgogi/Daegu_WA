import { useState, useEffect } from 'react';
import type { WeatherData, WeatherCondition } from '../types';
import { fetchWeather } from '../utils/weatherApi';

const emptyWeather: WeatherData = { current: null, airQuality: null, forecast: [] };

export const useWeather = (lat: number, lon: number) => {
    const [result, setResult] = useState<{ lat: number; lon: number; data: WeatherData } | null>(null);
    const weatherData = result?.lat === lat && result.lon === lon ? result.data : null;

    useEffect(() => {
        let mounted = true;
        const loadWeather = async () => {
            const data = await fetchWeather(lat, lon);
            if (mounted) setResult({ lat, lon, data });
        };
        loadWeather();
        return () => { mounted = false; };
    }, [lat, lon]);

    const toggleWeather = () => {
        const conditions: WeatherCondition[] = ['Sunny', 'Rain', 'Snow', 'Cloudy', 'Night', 'Fog'];
        setResult(prev => {
            if (!prev?.data.current || prev.lat !== lat || prev.lon !== lon) return prev;
            const nextIndex = (conditions.indexOf(prev.data.current.condition) + 1) % conditions.length;
            return {
                ...prev,
                data: {
                    ...prev.data,
                    current: {
                        ...prev.data.current,
                        condition: conditions[nextIndex],
                        description: '데모 모드'
                    }
                }
            };
        });
    };

    return { weatherData: weatherData ?? emptyWeather, loading: weatherData === null, toggleWeather };
};
