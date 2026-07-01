'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Home, StatItem } from '@/lib/types';
import RichDescription from '@/components/landing/RichDescription';

function fadeInUp(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5 },
  };
}

export default function HeroSection({ home }: { home: Home }) {
  const services: string[] = Array.isArray(home.services) ? home.services : [];
  const stats: StatItem[] = Array.isArray(home.stats) ? home.stats : [];
  const socialLinks: { platform: string; url: string }[] = Array.isArray(home.social_links) ? home.social_links : [];
  const heroCardRef = useRef<HTMLDivElement>(null);
  const heroRafRef = useRef<number>(0);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    cancelAnimationFrame(heroRafRef.current);
    heroRafRef.current = requestAnimationFrame(() => {
      const el = heroCardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      el.style.transform = `rotateX(${(y - 0.5) * -4}deg) rotateY(${(x - 0.5) * 4}deg)`;
    });
  };

  const handleHeroMouseEnter = () => {
    const el = heroCardRef.current;
    if (el) {
      el.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  };

  const handleHeroMouseLeave = () => {
    cancelAnimationFrame(heroRafRef.current);
    const el = heroCardRef.current;
    if (el) {
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center relative overflow-hidden py-20">
      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text Content */}
          <motion.div
            className="order-2 lg:order-1"
            animate={{ y: [-22, 0, -22] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div {...fadeInUp(0)}>
              {home.subtitle && (
                <p className="text-lg md:text-xl text-[var(--electric-blue)] font-semibold mb-2">
                  {home.subtitle}
                </p>
              )}

              <h1 className="flicker-text text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4">
                <span className="text-gradient">RAMDAN<br />SUWANDI</span>
              </h1>

              {home.tagline && (
                <p className="text-[var(--text-secondary)] text-base md:text-lg italic mb-4">
                  &ldquo;{home.tagline}&rdquo;
                </p>
              )}

{home.description && (
  <div className="mb-6 max-w-xl">
    <RichDescription text={home.description} className="text-base md:text-lg" />
  </div>
)}

              {home.location && (
                <p className="text-sm text-[var(--text-secondary)] mb-5 flex items-center gap-2 flex-wrap">
                  <span>📍 {home.location}</span>
                  {home.is_available !== undefined && home.is_available ? (
                    <span className="relative inline-flex items-center gap-2 px-3 py-1 rounded-full overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(107,138,80,0.12), rgba(107,138,80,0.04))',
                        border: '1px solid rgba(107,138,80,0.2)',
                        animation: 'avail-float 3s ease-in-out infinite',
                      }}
                    >
                      {/* Shimmer sweep */}
                      <span
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(107,138,80,0.15), transparent)',
                          backgroundSize: '200% 100%',
                          animation: 'avail-shimmer 2.5s ease-in-out infinite',
                        }}
                      />
                      {/* Pulsing dot with ring */}
                      <span className="relative flex items-center justify-center w-2.5 h-2.5">
                        <span className="absolute inset-0 rounded-full bg-[var(--neon-green)]"
                          style={{
                            animation: 'avail-ping 2s ease-in-out infinite',
                            opacity: 0.4,
                          }}
                        />
                        <span className="absolute inset-0 rounded-full bg-[var(--neon-green)]"
                          style={{
                            animation: 'avail-ping 2s ease-in-out infinite 0.6s',
                            opacity: 0.2,
                          }}
                        />
                        <span className="w-2 h-2 rounded-full bg-[var(--neon-green)] relative z-10"
                          style={{ boxShadow: '0 0 6px var(--neon-green), 0 0 12px var(--neon-green)' }}
                        />
                      </span>
                      <span className="relative text-xs font-semibold text-[var(--neon-green)] tracking-wide">Available for Work</span>
                    </span>
                  ) : home.is_available !== undefined && (
                    <span className="inline-flex items-center gap-1.5 text-red-400">
                      <span className="w-2 h-2 rounded-full inline-block bg-red-400" />
                      Not Available
                    </span>
                  )}
                </p>
              )}

              {/* CTA Buttons */}
              <div className="flex items-center gap-4 flex-wrap mb-8">
                {home.resume_url && (
                  <button
                    onClick={() => {
                      fetch(home.resume_url!)
                        .then(res => res.blob())
                        .then(blob => {
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'CV_Ramdan_Suwandi.pdf';
                          a.click();
                          URL.revokeObjectURL(url);
                        });
                    }}
                    className="btn-primary"
                  >
                    Download Resume
                  </button>
                )}
                <Link href="/landing/contact">
                  <button className="glass px-6 py-3 rounded-xl text-[var(--text-primary)] hover:border-[var(--electric-blue)] hover:shadow-[0_0_20px_var(--glow-color)] transition-all">
                    Contact Me
                  </button>
                </Link>
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap mb-6">
                  {socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass px-4 py-2 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--electric-blue)] hover:border-[var(--electric-blue)] transition-all"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              )}

              {/* Services Tags */}
              {services.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {services.map((service, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: 'rgba(201, 151, 74, 0.1)',
                        border: '1px solid rgba(201, 151, 74, 0.2)',
                        color: 'var(--electric-blue)',
                      }}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              {stats.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {stats.map((stat, i) => (
                    <div key={i} className="glass px-5 py-3 rounded-xl min-w-[100px]">
                      <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Right: Glass Card Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative max-w-[380px] lg:max-w-[440px] w-full"
              style={{ perspective: '1200px' }}
            >
              <motion.div
                ref={heroCardRef}
                onMouseMove={handleHeroMouseMove}
                onMouseEnter={handleHeroMouseEnter}
                onMouseLeave={handleHeroMouseLeave}
                style={{
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
                animate={{ y: [0, -22, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Glow aura layers */}
                {/* Layer 1: Core electric blue glow */}
                <motion.div
                  className="absolute -inset-12 -z-10"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.4), rgba(0,212,255,0.05) 50%, transparent 70%)',
                    filter: 'blur(60px)',
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.08, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Layer 2: Expanding blue-green halo */}
                <motion.div
                  className="absolute -inset-24 -z-10"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(0,242,254,0.12), rgba(57,255,20,0.04) 40%, transparent 65%)',
                    filter: 'blur(80px)',
                  }}
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.12, 1],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />
                {/* Layer 3: Outer soft radiance */}
                <motion.div
                  className="absolute -inset-36 -z-10"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.04), transparent 55%)',
                    filter: 'blur(100px)',
                  }}
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
                {/* Light rays sweep */}
                <motion.div
                  className="absolute -inset-40 -z-10"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent, rgba(0,212,255,0.03), transparent 30%, rgba(57,255,20,0.02), transparent 60%, rgba(0,212,255,0.03), transparent)',
                    filter: 'blur(50px)',
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                />

                {/* Card */}
                <motion.div
                  className="aspect-[3/4] w-full relative z-10 rounded-2xl overflow-hidden"
                  style={{ boxShadow: '0 0 0 1px rgba(0,212,255,0.08), 0 8px 32px rgba(0,0,0,0.4)' }}
                  animate={{ boxShadow: [
                    '0 0 0 1px rgba(0,212,255,0.08), 0 8px 32px rgba(0,0,0,0.4), 0 0 30px rgba(0,212,255,0.05)',
                    '0 0 0 1px rgba(0,212,255,0.15), 0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(0,212,255,0.12), 0 0 100px rgba(57,255,20,0.04)',
                    '0 0 0 1px rgba(0,212,255,0.08), 0 8px 32px rgba(0,0,0,0.4), 0 0 30px rgba(0,212,255,0.05)',
                  ] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {/* Subtle gradient border */}
                  <div
                    className="absolute inset-0 z-20 pointer-events-none rounded-2xl"
                    style={{
                      border: '1px solid transparent',
                      background: 'linear-gradient(135deg, rgba(0,212,255,0.15), transparent 50%, rgba(57,255,20,0.08)) border-box',
                      WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                  />
                  {/* Subtle breathing glow */}
                  <div
                    className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
                    style={{
                      boxShadow: 'inset 0 0 40px rgba(0,212,255,0.03)',
                      animation: 'breathe 4s ease-in-out infinite',
                    }}
                  />

                  {/* Image */}
                  <div className="w-full h-full relative">
                    {home.image_url ? (
                      <img
                        src={home.image_url}
                        alt={home.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--dark-card)]">
                        <span className="text-7xl opacity-30">👨‍💻</span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-card)]/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

        </div>
      </div>

      <style>{`
        @keyframes avail-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes avail-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes avail-ping {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes breathe {
          0%, 100% { box-shadow: inset 0 0 40px rgba(0,212,255,0.03); }
          50% { box-shadow: inset 0 0 60px rgba(0,212,255,0.06); }
        }
      `}</style>
    </section>
  );
}
