import { useState, useEffect } from 'react';
import type { WeatherData, WeatherCondition } from '../types';
import { fetchWeather } from '../utils/weatherApi';

export const useWeather = (lat: number, lon: number) => {
    const [weatherData, setWeatherData] = useState<WeatherData>({
        current: { condition: 'Sunny', temperature: 0, description: '로딩중...' },
        airQuality: { pm10: 0, pm25: 0, level: 'Good' },
        forecast: []
    });
    useEffect(() => {
        let mounted = true;
        const loadWeather = async () => {
            const data = await fetchWeather(lat, lon);
            if (mounted) {
                setWeatherData(data);
            }
        };
        loadWeather();
        return () => { mounted = false; };
    }, [lat, lon]);

    const toggleWeather = () => {
        // Manual toggle logic kept for demo purposes if API fails or for testing
        const conditions: WeatherCondition[] = ['Sunny', 'Rain', 'Snow', 'Cloudy', 'Night', 'Fog'];
        const currentIndex = conditions.indexOf(weatherData.current.condition);
        const nextIndex = (currentIndex + 1) % conditions.length;

        setWeatherData(prev => ({
            ...prev,
            current: {
                ...prev.current,
                condition: conditions[nextIndex],
                description: '데모 모드'
            }
        }));
    };

    return {
        weatherData,
        toggleWeather
    };
};
