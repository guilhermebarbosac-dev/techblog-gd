'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import Tilt from 'react-parallax-tilt';
import { ReactTyped } from 'react-typed';

// Componente com animação de entrada suave
export function FadeInSection({ children, className = '', delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Componente com efeito de hover avançado
export function HoverCard({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

// Componente com efeito 3D Tilt
export function TiltCard({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tilt
      className={className}
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      perspective={1000}
      scale={1.05}
      transitionSpeed={2000}
      gyroscope={true}
    >
      {children}
    </Tilt>
  );
}

// Componente de texto com efeito de digitação
export function TypeWriter({ strings, className = '' }: {
  strings: string[];
  className?: string;
}) {
  return (
    <ReactTyped
      strings={strings}
      typeSpeed={50}
      backSpeed={30}
      loop
      className={className}
    />
  );
}

// Componente com animação de mola (spring)
export function SpringButton({ children, onClick }: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const [springs, api] = useSpring(() => ({
    scale: 1,
    rotation: 0,
  }));

  return (
    <animated.button
      style={springs}
      onMouseEnter={() => api.start({ scale: 1.1, rotation: 5 })}
      onMouseLeave={() => api.start({ scale: 1, rotation: 0 })}
      onClick={onClick}
      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow"
    >
      {children}
    </animated.button>
  );
}

// Componente com stagger animation (animações em sequência)
export function StaggeredList({ items, className = '' }: {
  items: string[];
  className?: string;
}) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.ul
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          variants={itemVariants}
          className="mb-2 p-3 bg-white rounded-lg shadow-sm"
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}

// Componente com animação de rotação contínua
export function SpinningIcon({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.div>
  );
}

// Componente com efeito de slide reveal
export function SlideReveal({ children, direction = 'left', className = '' }: {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -100, y: 0 };
      case 'right': return { x: 100, y: 0 };
      case 'up': return { x: 0, y: -100 };
      case 'down': return { x: 0, y: 100 };
      default: return { x: -100, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getInitialPosition() }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Componente com efeito de pulse
export function PulsingElement({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
