import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    // Прокручиваем страницу вверх при изменении маршрута
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{
          opacity: 0,
          y: 30,
          filter: "blur(10px)"
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)"
        }}
        exit={{
          opacity: 0,
          y: -30,
          filter: "blur(10px)"
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 0.61, 0.36, 1]
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;