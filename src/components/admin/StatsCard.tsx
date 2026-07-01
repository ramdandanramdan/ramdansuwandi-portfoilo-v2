'use client';

import { useEffect, useRef, useState } from 'react';

interface StatsCardProps {
  label: string;
  value: number;
  color?: string;
  delay?: number;
}

function useCountUp(target: number, delay: number = 0) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    const timer = setTimeout(() => {
      started.current = true;
      const steps = 30;
      const increment = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, 30);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [target, delay]);

  return count;
}

export default function StatsCard({ label, value, color = '#00d4ff', delay = 0 }: StatsCardProps) {
  const count = useCountUp(value, delay);

  return (
    <div
      className="bg-[var(--dark-card)] border border-[var(--glass-border)] rounded-xl p-5 transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] hover:shadow-lg"
    >
      <p className="text-3xl font-bold mb-0.5 tabular-nums" style={{ color }}>{count.toLocaleString()}</p>
      <p className="text-[var(--text-secondary)] text-sm">{label}</p>
    </div>
  );
}
