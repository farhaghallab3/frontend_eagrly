import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Marquee.css';

const Marquee = ({
    children,
    direction = 'left', // 'left' or 'right'
    speed = 30, // pixels per second
    pauseOnHover = true,
    className = '',
    gap = 40,
}) => {
    const containerRef = useRef(null);
    const [contentWidth, setContentWidth] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            const content = containerRef.current.querySelector('.marquee-content');
            if (content) {
                setContentWidth(content.offsetWidth);
            }
        }
    }, [children]);

    const duration = contentWidth / speed;

    return (
        <div
            className={`marquee-container ${className}`}
            onMouseEnter={() => pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => pauseOnHover && setIsPaused(false)}
            ref={containerRef}
        >
            <motion.div
                className="marquee-track"
                animate={{
                    x: direction === 'left' ? [0, -(contentWidth + gap)] : [-(contentWidth + gap), 0],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: duration || 10,
                        ease: 'linear',
                    },
                }}
                style={{
                    animationPlayState: isPaused ? 'paused' : 'running',
                }}
            >
                <div className="marquee-content" style={{ paddingRight: gap }}>
                    {children}
                </div>
                <div className="marquee-content" style={{ paddingRight: gap }} aria-hidden="true">
                    {children}
                </div>
                <div className="marquee-content" style={{ paddingRight: gap }} aria-hidden="true">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default Marquee;
