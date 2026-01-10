import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const CountUp = ({
    from = 0,
    to,
    duration = 2,
    delay = 0,
    suffix = '',
    prefix = '',
    className = '',
    once = true,
    separator = ',',
    decimals = 0,
    easing = [0.25, 0.1, 0.25, 1],
}) => {
    const [count, setCount] = useState(from);
    const ref = useRef(null);
    const inView = useInView(ref, { once, amount: 0.3 });
    const hasStarted = useRef(false);

    useEffect(() => {
        if (!inView || hasStarted.current) return;
        hasStarted.current = true;

        const startTime = performance.now();
        const startDelay = delay * 1000;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime - startDelay;

            if (elapsed < 0) {
                requestAnimationFrame(animate);
                return;
            }

            const progress = Math.min(elapsed / (duration * 1000), 1);

            // Apply easing
            const easedProgress = cubicBezier(progress, ...easing);
            const currentValue = from + (to - from) * easedProgress;

            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(to);
            }
        };

        requestAnimationFrame(animate);
    }, [inView, from, to, duration, delay, easing]);

    // Cubic bezier easing function
    const cubicBezier = (t, x1, y1, x2, y2) => {
        const cx = 3 * x1;
        const bx = 3 * (x2 - x1) - cx;
        const ax = 1 - cx - bx;
        const cy = 3 * y1;
        const by = 3 * (y2 - y1) - cy;
        const ay = 1 - cy - by;

        const sampleCurveX = (t) => ((ax * t + bx) * t + cx) * t;
        const sampleCurveY = (t) => ((ay * t + by) * t + cy) * t;

        let t2 = t;
        for (let i = 0; i < 8; i++) {
            const x = sampleCurveX(t2) - t;
            if (Math.abs(x) < 0.001) break;
            const d = (3 * ax * t2 + 2 * bx) * t2 + cx;
            if (Math.abs(d) < 0.000001) break;
            t2 -= x / d;
        }

        return sampleCurveY(t2);
    };

    const formatNumber = (num) => {
        const fixed = num.toFixed(decimals);
        if (!separator) return fixed;

        const [whole, decimal] = fixed.split('.');
        const formatted = whole.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        return decimal ? `${formatted}.${decimal}` : formatted;
    };

    return (
        <motion.span
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
        >
            {prefix}{formatNumber(count)}{suffix}
        </motion.span>
    );
};

export default CountUp;
