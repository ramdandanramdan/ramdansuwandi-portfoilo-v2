'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileDisclaimer() {
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setVisible(false);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    const hide = () => {
      setVisible(false);
      timeout = setTimeout(show, 15000);
    };

    const show = () => {
      setVisible(true);
      timeout = setTimeout(hide, 5000);
    };

    show();

    return () => clearTimeout(timeout);
  }, [isMobile]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)]"
          initial={{ opacity: 0, y: 20, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ type: 'spring', damping: 18, stiffness: 260, mass: 0.8 }}
        >
          <div
            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium backdrop-blur-md shadow-lg overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,180,50,0.1), rgba(255,120,50,0.04))',
              border: '1px solid rgba(255,180,50,0.2)',
              color: 'rgba(255,200,100,0.9)',
              boxShadow: '0 0 20px rgba(255,180,50,0.06)',
            }}
          >
            <span className="shrink-0 text-sm">💡</span>
            <span className="leading-snug">
              For the best experience, please open my portfolio on a laptop or desktop
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
