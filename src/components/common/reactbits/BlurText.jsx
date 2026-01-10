import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words', // 'words' or 'letters'
  direction = 'top', // 'top' or 'bottom'
  onAnimationComplete,
  animationFrom,
  animationTo,
  easing = [0.25, 0.1, 0.25, 1],
  threshold = 0.1,
  rootMargin = '0px',
  once = true,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once && ref.current) observer.unobserve(ref.current);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const defaultFrom = direction === 'top'
    ? { filter: 'blur(10px)', opacity: 0, y: -30 }
    : { filter: 'blur(10px)', opacity: 0, y: 30 };

  const defaultTo = { filter: 'blur(0px)', opacity: 1, y: 0 };

  const from = animationFrom || defaultFrom;
  const to = animationTo || defaultTo;

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={from}
          animate={inView ? to : from}
          transition={{
            duration: 0.5,
            delay: index * (delay / 1000),
            ease: easing,
          }}
          onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
        >
          {element}
          {animateBy === 'words' && index < elements.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </p>
  );
};

export default BlurText;
