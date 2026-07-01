'use client';

import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltDegree?: number;
  glowSize?: number;
}

export default function TiltCard({ children, className = '', tiltDegree = 8, glowSize = 300 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      el.style.transform = `translateY(-6px) scale(1.015) rotateX(${(y - 0.5) * -tiltDegree}deg) rotateY(${(x - 0.5) * tiltDegree}deg)`;
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle ${glowSize}px at ${x * 100}% ${y * 100}%, var(--glow-color), transparent)`;
      }
    });
  };

  const handleMouseEnter = () => {
    const el = cardRef.current;
    if (el) {
      el.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'translateY(-6px) scale(1.015) rotateX(0deg) rotateY(0deg)';
    }
    if (borderRef.current) borderRef.current.style.opacity = '1';
    if (glowRef.current) glowRef.current.style.opacity = '0.6';
  };

  const handleMouseLeave = () => {
    cancelAnimationFrame(rafRef.current);
    const el = cardRef.current;
    if (el) {
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'translateY(0px) scale(1) rotateX(0deg) rotateY(0deg)';
    }
    if (borderRef.current) borderRef.current.style.opacity = '0';
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
      glowRef.current.style.background = `radial-gradient(circle ${glowSize}px at 50% 50%, var(--glow-color), transparent)`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ perspective: '1200px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative overflow-hidden rounded-2xl bg-[#141210] border border-[rgba(200,180,140,0.08)] ${className}`}
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        <div
          ref={borderRef}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            opacity: 0,
            transition: 'opacity 0.2s ease',
            padding: '1px',
            background: 'linear-gradient(135deg, var(--electric-blue), var(--neon-green) 30%, transparent 60%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        <div
          ref={glowRef}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            opacity: 0,
            transition: 'opacity 0.2s ease',
            background: `radial-gradient(circle ${glowSize}px at 50% 50%, var(--glow-color), transparent)`,
          }}
        />

        {children}
      </div>
    </motion.div>
  );
}
