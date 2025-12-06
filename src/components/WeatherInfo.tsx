import React from 'react';
import type { WeatherData } from '../types';
import { WiDaySunny, WiRain, WiSnow, WiNightClear, WiDayCloudy, WiFog } from 'react-icons/wi';
import { FaChevronDown } from 'react-icons/fa';

interface WeatherInfoProps {
    weather: WeatherData['current'];
    fullDate: string;
    timeString: string;
    districtName: string;
    onClick: () => void;
    onDistrictClick: () => void;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ weather, fullDate, timeString, districtName, onClick, onDistrictClick }) => {
    const getIcon = () => {
        switch (weather.condition) {
            case 'Sunny': return <WiDaySunny size={75} />;
            case 'Night': return <WiNightClear size={75} />;
            case 'Rain': return <WiRain size={75} />;
            case 'Snow': return <WiSnow size={75} />;
            case 'Cloudy': return <WiDayCloudy size={75} />;
            case 'Fog': return <WiFog size={75} />;
            default: return <WiDaySunny size={75} />;
        }
    };

    // fullDate is "2024년 12월 06일"
    const yearStr = fullDate.split('년')[0] + '년';
    const restDateStr = fullDate.indexOf('년') > -1 ? fullDate.split('년')[1].trim() : fullDate;

    return (
        <div
            style={{
                position: 'absolute',
                top: '6%', // Moved UP from 10%
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                zIndex: 50,
                width: '100%',
                pointerEvents: 'none'
            }}
        >
            {/* Title & Picker Trigger - Moved HIGHER */}
            <div
                onClick={(e) => { e.stopPropagation(); onDistrictClick(); }}
                style={{
                    pointerEvents: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '6px 14px',
                    borderRadius: '30px',
                    backdropFilter: 'blur(4px)',
                    marginBottom: '10px' // Reduced margin
                }}
            >
                <h1 style={{
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    textShadow: 'var(--shadow-text)',
                    color: '#FFF',
                    margin: 0
                }}>
                    {districtName}
                </h1>
                <FaChevronDown size={14} style={{ marginTop: '2px', color: '#FFF' }} />
            </div>

            {/* Date & Time (Top, Large, Vertical Split) */}
            <div style={{ marginBottom: '15px', textShadow: 'var(--shadow-text)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 300, opacity: 0.9, marginBottom: '2px' }}>
                    {yearStr}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.1 }}>
                    {restDateStr} <br />
                    <span style={{ fontSize: '2.5rem', fontWeight: 500 }}>{timeString}</span>
                </div>
            </div>

            {/* Weather Data (Horizontal Layout) */}
            <div style={{ textShadow: 'var(--shadow-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                <div
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', cursor: 'pointer', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
                >
                    {getIcon()}
                </div>

                <div style={{ textAlign: 'left' }}>
                    <p style={{
                        fontSize: '4.5rem',
                        fontWeight: 700,
                        lineHeight: 1,
                        margin: 0
                    }}>
                        {weather.temperature}°
                    </p>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0, paddingLeft: '5px' }}>{weather.description}</p>
                </div>
            </div>
        </div>
    );
};

export default WeatherInfo;
