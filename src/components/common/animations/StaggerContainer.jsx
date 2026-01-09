// StaggerContainer.jsx - Container that staggers children animations
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * StaggerContainer - Animates children with staggered timing
 * 
 * @param {number} staggerDelay - Delay between each child animation (seconds)
 * @param {number} duration - Duration of each child animation (seconds)
 * @param {number} threshold - How much of container must be visible to trigger (0-1)
 * @param {boolean} once - Only animate once
 * @param {string} className - Additional CSS classes
 */
const StaggerContainer = ({
    children,
    staggerDelay = 0.1,
    duration = 0.5,
    threshold = 0.1,
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={containerVariants}
            className={className}
            style={style}
            {...props}
        >
            {/* Wrap each child in motion.div with item variants */}
            {Array.isArray(children)
                ? children.map((child, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        {child}
                    </motion.div>
                ))
                : <motion.div variants={itemVariants}>{children}</motion.div>
            }
        </motion.div>
    );
};

/**
 * StaggerItem - Individual item for use inside StaggerContainer (manual control)
 */
export const StaggerItem = ({ children, className = '', ...props }) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    return (
        <motion.div variants={itemVariants} className={className} {...props}>
            {children}
        </motion.div>
    );
};

export default StaggerContainer;
