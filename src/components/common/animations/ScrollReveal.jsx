// ScrollReveal.jsx - Reusable scroll-triggered animation component
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Animation variants for different reveal effects
const variants = {
    fadeUp: {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0 }
    },
    fadeDown: {
        hidden: { opacity: 0, y: -60 },
        visible: { opacity: 1, y: 0 }
    },
    fadeLeft: {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0 }
    },
    fadeRight: {
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0 }
    },
    zoomIn: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
    },
    zoomOut: {
        hidden: { opacity: 0, scale: 1.2 },
        visible: { opacity: 1, scale: 1 }
    },
    blur: {
        hidden: { opacity: 0, filter: 'blur(10px)' },
        visible: { opacity: 1, filter: 'blur(0px)' }
    },
    fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    }
};

/**
 * ScrollReveal - Animates children when they scroll into view
 * 
 * @param {string} variant - Animation type: 'fadeUp', 'fadeDown', 'fadeLeft', 'fadeRight', 'zoomIn', 'zoomOut', 'blur', 'fade'
 * @param {number} delay - Delay before animation starts (seconds)
 * @param {number} duration - Animation duration (seconds)
 * @param {number} threshold - How much of element must be visible to trigger (0-1)
 * @param {boolean} once - Only animate once (true) or every time element enters view (false)
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Content to animate
 */
const ScrollReveal = ({
    children,
    variant = 'fadeUp',
    delay = 0,
    duration = 0.6,
    threshold = 0.2,
    once = true,
    className = '',
    style = {},
    ...props
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once,
        amount: threshold
    });

    const selectedVariant = variants[variant] || variants.fadeUp;

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={selectedVariant}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1] // Smooth cubic-bezier easing
            }}
            className={className}
            style={style}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
export { variants };
