import { useMemo, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SplitText = ({
    text = '',
    className = '',
    delay = 50,
    animationFrom = { opacity: 0, transform: 'translate3d(0,40px,0)' },
    animationTo = { opacity: 1, transform: 'translate3d(0,0,0)' },
    easing = [0.25, 0.1, 0.25, 1],
    threshold = 0.1,
    rootMargin = '0px',
    textAlign = 'center',
    onLetterAnimationComplete,
    splitBy = 'letter', // 'letter' or 'word'
}) => {
    const [inView, setInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    if (ref.current) observer.unobserve(ref.current);
                }
            },
            { threshold, rootMargin }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    const words = useMemo(() => text.split(' '), [text]);

    return (
        <p
            ref={ref}
            className={className}
            style={{
                textAlign,
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
            }}
        >
            {words.map((word, wordIndex) => (
                <span key={wordIndex} style={{ display: 'inline-flex', whiteSpace: 'pre' }}>
                    {splitBy === 'letter' ? (
                        word.split('').map((letter, letterIndex) => {
                            const globalIndex = words.slice(0, wordIndex).join(' ').length + letterIndex + (wordIndex > 0 ? 1 : 0);
                            return (
                                <motion.span
                                    key={letterIndex}
                                    initial={animationFrom}
                                    animate={inView ? animationTo : animationFrom}
                                    transition={{
                                        duration: 0.4,
                                        delay: globalIndex * (delay / 1000),
                                        ease: easing,
                                    }}
                                    onAnimationComplete={
                                        wordIndex === words.length - 1 && letterIndex === word.length - 1
                                            ? onLetterAnimationComplete
                                            : undefined
                                    }
                                    style={{ display: 'inline-block', willChange: 'transform, opacity' }}
                                >
                                    {letter}
                                </motion.span>
                            );
                        })
                    ) : (
                        <motion.span
                            initial={animationFrom}
                            animate={inView ? animationTo : animationFrom}
                            transition={{
                                duration: 0.4,
                                delay: wordIndex * (delay / 1000),
                                ease: easing,
                            }}
                            style={{ display: 'inline-block', willChange: 'transform, opacity' }}
                        >
                            {word}
                        </motion.span>
                    )}
                    {wordIndex < words.length - 1 && '\u00A0'}
                </span>
            ))}
        </p>
    );
};

export default SplitText;
