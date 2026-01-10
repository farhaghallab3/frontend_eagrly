import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const Magnet = ({
    children,
    padding = 80,
    disabled = false,
    magnetStrength = 0.4,
    className = '',
}) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (disabled) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;

        setPosition({
            x: distanceX * magnetStrength,
            y: distanceY * magnetStrength,
        });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
                mass: 0.1,
            }}
            style={{
                display: 'inline-block',
                padding: `${padding}px`,
                margin: `-${padding}px`,
            }}
        >
            {children}
        </motion.div>
    );
};

export default Magnet;
