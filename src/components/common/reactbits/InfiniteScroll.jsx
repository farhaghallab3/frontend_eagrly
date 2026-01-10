import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import './InfiniteScroll.css';

const InfiniteScroll = ({
    items = [],
    renderItem,
    direction = 'horizontal', // 'horizontal' or 'vertical'
    speed = 0.5,
    gap = 20,
    className = '',
}) => {
    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState(0);

    const { scrollXProgress, scrollYProgress } = useScroll({
        container: containerRef,
    });

    useEffect(() => {
        if (containerRef.current) {
            setContainerSize(
                direction === 'horizontal'
                    ? containerRef.current.scrollWidth
                    : containerRef.current.scrollHeight
            );
        }
    }, [items, direction]);

    const progress = direction === 'horizontal' ? scrollXProgress : scrollYProgress;
    const smoothProgress = useSpring(progress, { stiffness: 100, damping: 30 });

    const translateValue = useTransform(
        smoothProgress,
        [0, 1],
        [0, -containerSize * speed]
    );

    return (
        <div
            className={`infinite-scroll-container ${direction} ${className}`}
            ref={containerRef}
        >
            <motion.div
                className="infinite-scroll-track"
                style={{
                    x: direction === 'horizontal' ? translateValue : 0,
                    y: direction === 'vertical' ? translateValue : 0,
                    gap,
                }}
            >
                {/* First set of items */}
                {items.map((item, index) => (
                    <div key={`item-${index}`} className="infinite-scroll-item">
                        {renderItem ? renderItem(item, index) : item}
                    </div>
                ))}

                {/* Duplicate for seamless loop */}
                {items.map((item, index) => (
                    <div key={`duplicate-${index}`} className="infinite-scroll-item" aria-hidden="true">
                        {renderItem ? renderItem(item, index) : item}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default InfiniteScroll;
