import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './TiltCard.css';

const TiltCard = ({
    children,
    className = '',
    containerClassName = '',
    rotationFactor = 15,
    springOptions = { stiffness: 300, damping: 20 },
    style = {},
}) => {
    const ref = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [rotationFactor, -rotationFactor]), springOptions);
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-rotationFactor, rotationFactor]), springOptions);

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        x.set((mouseX / width) - 0.5);
        y.set((mouseY / height) - 0.5);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={`tilt-card-container ${containerClassName}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                ...style,
            }}
        >
            <motion.div
                className={`tilt-card ${className}`}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
            >
                {children}

                {/* Shine effect */}
                <motion.div
                    className="tilt-card-shine"
                    style={{
                        opacity: isHovered ? 1 : 0,
                        background: `radial-gradient(
              circle at ${50}% ${50}%,
              rgba(255, 255, 255, 0.15) 0%,
              transparent 60%
            )`,
                    }}
                    animate={{
                        background: isHovered
                            ? `radial-gradient(circle at ${(x.get() + 0.5) * 100}% ${(y.get() + 0.5) * 100}%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)`
                            : `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0) 0%, transparent 60%)`,
                    }}
                />
            </motion.div>
        </motion.div>
    );
};

export default TiltCard;
