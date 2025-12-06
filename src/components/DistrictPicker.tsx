import React from 'react';
import type { District } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

interface DistrictPickerProps {
    districts: District[];
    selectedId: string;
    onSelect: (id: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const DistrictPicker: React.FC<DistrictPickerProps> = ({ districts, selectedId, onSelect, isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            zIndex: 90,
                            backdropFilter: 'blur(5px)'
                        }}
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            maxHeight: '70%',
                            backgroundColor: '#222',
                            borderTopLeftRadius: '20px',
                            borderTopRightRadius: '20px',
                            zIndex: 100,
                            padding: '20px',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>지역 선택</h2>
                            <button onClick={onClose} style={{ padding: '5px' }}>
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                            {districts.map((district) => (
                                <button
                                    key={district.id}
                                    onClick={() => {
                                        onSelect(district.id);
                                        onClose();
                                    }}
                                    style={{
                                        backgroundColor: selectedId === district.id ? '#4a90e2' : '#333',
                                        padding: '15px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        textAlign: 'left'
                                    }}
                                >
                                    <FaMapMarkerAlt color={selectedId === district.id ? '#FFF' : '#888'} />
                                    <span style={{ fontWeight: 500 }}>{district.name}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DistrictPicker;
