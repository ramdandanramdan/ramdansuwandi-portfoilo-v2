'use client';

import { useState, useEffect } from 'react';

export default function MobileDisclaimer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)]">
      <div
        className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium backdrop-blur-md overflow-hidden shadow-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(255,180,50,0.1), rgba(255,120,50,0.04))',
          border: '1px solid rgba(255,180,50,0.2)',
          color: 'rgba(255,200,100,0.9)',
          boxShadow: '0 0 20px rgba(255,180,50,0.06)',
        }}
      >
        <span className="shrink-0 text-sm">⚠️</span>
        <span className="leading-snug">
          For the best experience, please open my portfolio on a laptop or desktop
        </span>
      </div>
    </div>
  );
}
