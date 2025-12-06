import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTime } from './hooks/useTime';
import { useWeather } from './hooks/useWeather';
import { useMediaQuery } from './hooks/useMediaQuery';
import { districts } from './utils/districts';
import WeatherEffects from './components/WeatherEffects';
import WeatherInfo from './components/WeatherInfo';
import DistrictPicker from './components/DistrictPicker';
import ForecastSidebar from './components/ForecastSidebar';
import AirQualityBadge from './components/AirQualityBadge';
import { FaPlay, FaImage } from 'react-icons/fa'; // Import icons

function App() {
  const { fullDate, timeString, isNight } = useTime();
  const [currentDistrictId, setCurrentDistrictId] = useState('daegu');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(true); // Default to Video mode

  // Responsive Check (< 850px)
  const isMobile = useMediaQuery('(max-width: 850px)');

  const currentDistrict = districts.find(d => d.id === currentDistrictId) || districts[0];

  const { weatherData, toggleWeather } = useWeather(currentDistrict.lat, currentDistrict.lon);

  // Derived conditions
  const isFoggy = weatherData.current.condition === 'Fog' || weatherData.airQuality.level === 'Very Bad';
  const isCloudy = weatherData.current.condition === 'Cloudy';

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflowY: isMobile ? 'auto' : 'hidden',
      overflowX: 'hidden'
    }}>

      {/* Background Media Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDistrict.id + (isVideoMode ? '-video' : '-image')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        >
          {isVideoMode ? (
            <video
              src={currentDistrict.video}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isNight ? 'brightness(0.4)' : 'brightness(0.95)',
                transition: 'filter 1s ease'
              }}
            />
          ) : (
            <img
              src={currentDistrict.image}
              alt={currentDistrict.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isNight ? 'brightness(0.4)' : 'brightness(0.95)',
                transition: 'filter 1s ease'
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cloud Overlay Effect */}
      {isCloudy && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2,
          background: 'linear-gradient(to bottom, rgba(200,200,200,0.3) 0%, rgba(255,255,255,0) 80%)',
          pointerEvents: 'none'
        }} />
      )}

      {/* Fog Overlay Effect */}
      {isFoggy && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3,
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(3px) contrast(0.8)',
          pointerEvents: 'none',
          transition: 'all 1s ease'
        }} />
      )}

      {/* Canvas Weather Effects */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 4, pointerEvents: 'none' }}>
        <WeatherEffects condition={weatherData.current.condition} />
      </div>

      {/* Content Layer */}
      <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 50 }}>
        <ForecastSidebar forecast={weatherData.forecast} isMobile={isMobile} />
        <AirQualityBadge airQuality={weatherData.airQuality} isMobile={isMobile} />

        <WeatherInfo
          weather={weatherData.current}
          fullDate={fullDate}
          timeString={timeString}
          districtName={currentDistrict.name}
          onClick={toggleWeather}
          onDistrictClick={() => setIsPickerOpen(true)}
        />

        {isMobile && <div style={{ height: '1000px' }} />}
      </div>

      {/* Mode Toggle Button (Bottom-Left) */}
      <button
        onClick={() => setIsVideoMode(!isVideoMode)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 60,
          background: 'rgba(0,0,0,0.5)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.2s ease'
        }}
        title={isVideoMode ? "정지오 화면으로 보기" : "동영상으로 보기"}
      >
        {isVideoMode ? <FaImage size={24} /> : <FaPlay size={20} style={{ marginLeft: '4px' }} />}
      </button>

      {/* Modal District Picker */}
      <DistrictPicker
        districts={districts}
        selectedId={currentDistrictId}
        onSelect={setCurrentDistrictId}
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
      />

    </div>
  );
}

export default App;
