import React from 'react';
import type { ForecastDay } from '../types';
import { WiDaySunny, WiRain, WiSnow, WiNightClear, WiDayCloudy, WiFog } from 'react-icons/wi';

interface ForecastSidebarProps {
    forecast: ForecastDay[];
    isMobile: boolean;
}

const ForecastSidebar: React.FC<ForecastSidebarProps> = ({ forecast, isMobile }) => {
    const getIcon = (condition: string) => {
        switch (condition) {
            case 'Sunny': return <WiDaySunny size={40} />;
            case 'Night': return <WiNightClear size={40} />;
            case 'Rain': return <WiRain size={40} />;
            case 'Snow': return <WiSnow size={40} />;
            case 'Cloudy': return <WiDayCloudy size={40} />;
            case 'Fog': return <WiFog size={40} />;
            default: return <WiDaySunny size={40} />;
        }
    };

    const desktopStyle: React.CSSProperties = {
        position: 'absolute',
        top: '90px',
        right: '50%',
        marginRight: '160px',
        width: '220px',
        height: '300px',
    };

    const mobileStyle: React.CSSProperties = {
        position: 'absolute',
        // Mobile: Stack below main info (approx 400px down)
        top: '400px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px', // Wider on mobile
        height: 'auto',
        marginBottom: '20px'
    };

    const style = isMobile ? mobileStyle : desktopStyle;

    return (
        <div style={{
            ...style,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '20px',
            zIndex: 50,
            background: 'rgba(0,0,0,0.2)',
            padding: '20px',
            borderRadius: '20px',
            backdropFilter: 'blur(3px)'
        }}>
            {forecast.map((day, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>
                        {day.dayOfWeek}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {getIcon(day.condition)}
                    </div>
                    <div style={{ fontSize: '1.2rem', opacity: 1, fontWeight: 500 }}>
                        {day.minTemp}° / <span style={{ fontWeight: 700 }}>{day.maxTemp}°</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ForecastSidebar;
