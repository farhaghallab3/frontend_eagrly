import { useEffect, useRef } from 'react';
import './Aurora.css';

const Aurora = ({
    colorStops = ['#FFB300', '#FF8F00', '#FFC107'],
    amplitude = 1.0,
    blend = 0.5,
    speed = 1.0,
    className = '',
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const createGradient = (x, y, radius, color, opacity) => {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, 'transparent');
            return gradient;
        };

        const animate = () => {
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;

            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'lighter';

            const t = time * 0.001 * speed;

            colorStops.forEach((color, i) => {
                const angle = (i / colorStops.length) * Math.PI * 2 + t;
                const radiusX = width * 0.3 * amplitude;
                const radiusY = height * 0.2 * amplitude;

                const x = width * 0.5 + Math.cos(angle) * radiusX;
                const y = height * 0.5 + Math.sin(angle * 0.7) * radiusY;
                const size = Math.min(width, height) * (0.4 + Math.sin(t + i) * 0.1);

                ctx.fillStyle = createGradient(x, y, size, color, blend);
                ctx.fillRect(0, 0, width, height);
            });

            time += 16;
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [colorStops, amplitude, blend, speed]);

    return (
        <canvas
            ref={canvasRef}
            className={`aurora-canvas ${className}`}
        />
    );
};

export default Aurora;
