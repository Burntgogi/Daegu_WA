import React from 'react';
import type { AirQuality } from '../types';

interface AirQualityBadgeProps {
    airQuality: AirQuality;
    isMobile: boolean;
}

const AirQualityBadge: React.FC<AirQualityBadgeProps> = ({ airQuality, isMobile }) => {
    const getColor = (level: string) => {
        switch (level) {
            case 'Good': return '#4caf50'; // Green
            case 'Moderate': return '#ffeb3b'; // Yellow
            case 'Bad': return '#ff9800'; // Orange
            case 'Very Bad': return '#f44336'; // Red
            default: return '#ccc';
        }
    };

    const getLabel = (level: string) => {
        switch (level) {
            case 'Good': return '좋음';
            case 'Moderate': return '보통';
            case 'Bad': return '나쁨';
            case 'Very Bad': return '매우나쁨';
            default: return '-';
        }
    }

    const desktopStyle: React.CSSProperties = {
        position: 'absolute',
        top: '90px',
        left: '50%',
        marginLeft: '160px',
        width: '220px',
        height: '300px',
    };

    const mobileStyle: React.CSSProperties = {
        position: 'absolute',
        // Mobile: Stack below Forecast (approx 720px down)
        top: '720px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '250px',
        marginBottom: '50px' // Bottom padding for scroll
    };

    const style = isMobile ? mobileStyle : desktopStyle;

    return (
        <div style={{
            ...style,
            zIndex: 50,
            background: 'rgba(0,0,0,0.4)',
            padding: '20px',
            borderRadius: '20px',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}>
            <div style={{ fontSize: '1.8rem', opacity: 0.9, fontWeight: 600 }}>미세먼지</div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: getColor(airQuality.level),
                    boxShadow: '0 0 10px ' + getColor(airQuality.level),
                    marginBottom: '10px'
                }} />
                <span style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{getLabel(airQuality.level)}</span>
            </div>

            <div style={{ fontSize: '1.5rem', marginTop: '10px', opacity: 0.8 }}>
                {Math.round(airQuality.pm10)} µg/m³
            </div>
        </div>
    );
};

export default AirQualityBadge;
