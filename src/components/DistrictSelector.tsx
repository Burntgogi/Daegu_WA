import React from 'react';
import type { District } from '../types';
import { motion } from 'framer-motion';

interface DistrictSelectorProps {
    districts: District[];
    selectedId: string;
    onSelect: (id: string) => void;
}

const DistrictSelector: React.FC<DistrictSelectorProps> = ({ districts, selectedId, onSelect }) => {
    return (
        <div style={{
            position: 'absolute',
            bottom: '30px',
            left: 0,
            width: '100%',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            zIndex: 50,
            padding: '0 20px',
            scrollbarWidth: 'none', // Hide scrollbar Firefox
            msOverflowStyle: 'none', // Hide scrollbar IE
        }} className="district-scroll">
            <style>{`
        .district-scroll::-webkit-scrollbar { display: none; }
      `}</style>

            <div style={{ display: 'flex', gap: '15px' }}>
                {districts.map((district) => (
                    <motion.button
                        key={district.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(district.id)}
                        style={{
                            padding: '10px 18px',
                            borderRadius: '25px',
                            backgroundColor: selectedId === district.id ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,0.5)',
                            color: selectedId === district.id ? '#000' : '#FFF',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        {district.name}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default DistrictSelector;
