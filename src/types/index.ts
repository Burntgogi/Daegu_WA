export type WeatherCondition = 'Sunny' | 'Rain' | 'Snow' | 'Cloudy' | 'Night' | 'Fog';

export interface AirQuality {
    pm10: number;
    pm25: number;
    level: 'Good' | 'Moderate' | 'Bad' | 'Very Bad';
}

export interface ForecastDay {
    date: string;
    dayOfWeek: string;
    minTemp: number;
    maxTemp: number;
    condition: WeatherCondition;
}

export interface WeatherData {
    current: {
        condition: WeatherCondition;
        temperature: number;
        description: string;
    };
    airQuality: AirQuality;
    forecast: ForecastDay[];
}

export interface District {
    id: string;
    name: string; // e.g., 'Daegu', 'Nam-gu'
    image: string; // path to image in public folder
    video?: string; // path to video in public folder
    lat: number;
    lon: number;
}
