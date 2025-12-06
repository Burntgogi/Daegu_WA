import React, { useRef, useEffect } from 'react';
import type { WeatherCondition } from '../types';

interface WeatherEffectsProps {
    condition: WeatherCondition;
}

interface Particle {
    x: number;
    y: number;
    speed: number;
    size: number;
    wind: number;
}

const WeatherEffects: React.FC<WeatherEffectsProps> = ({ condition }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const particleCount = 200;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    speed: condition === 'Rain' ? Math.random() * 20 + 30 : Math.random() * 2 + 1,
                    size: condition === 'Rain' ? 1 : Math.random() * 3 + 1,
                    wind: condition === 'Rain' ? 0 : Math.random() * 2 - 1,
                });
            }
        };

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';

            particles.forEach((p) => {
                p.y += p.speed;
                p.x += p.wind;

                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x > canvas.width) p.x = 0;
                if (p.x < 0) p.x = canvas.width;

                if (condition === 'Rain') {
                    ctx.beginPath();
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x, p.y + 25);
                    ctx.stroke();
                } else if (condition === 'Snow') {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        resizeCanvas();
        initParticles();

        // Only animate if it's Rain or Snow
        if (condition === 'Rain' || condition === 'Snow') {
            draw();
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [condition]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 20
            }}
        />
    );
};

export default WeatherEffects;
