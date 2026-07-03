'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import SectionHeader from '@/components/landing/SectionHeader';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const glow = glowRef.current;
    if (!el) return;
    let frame: number;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let gx = 50, gy = 50;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetX = (x - 0.5) * 5;
      targetY = (y - 0.5) * -5;
      gx = x * 100;
      gy = y * 100;
    };
    const onLeave = () => { targetX = 0; targetY = 0; gx = 50; gy = 50; };

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      el.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg)`;
      if (glow) {
        glow.style.background = `radial-gradient(400px circle at ${gx}% ${gy}%, rgba(0,242,254,0.06), transparent 60%)`;
      }
      if (Math.abs(currentX - targetX) > 0.01 || Math.abs(currentY - targetY) > 0.01) {
        frame = requestAnimationFrame(animate);
      }
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mouseenter', () => { frame = requestAnimationFrame(animate); });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return { ref, glowRef };
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const bgImage = project.image_url || project.images?.[0] || '';
  const { ref: tiltRef, glowRef } = useTilt();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
    >
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 6 + (index % 3) * 0.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div ref={tiltRef} style={{ perspective: '800px' }}>
          <Link href={`/landing/projects/${project.id}`} className="block group">
            {/* Glass card */}
            <div
              className="relative h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-700"
              style={{
                minHeight: '240px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              {/* Mouse follower glow */}
              <div
                ref={glowRef}
                className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 rounded-2xl"
                style={{ zIndex: 1 }}
              />
              {/* Subtle animated background gradient */}
              <div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  background: 'linear-gradient(45deg, var(--electric-blue), transparent 50%, var(--neon-green))',
                  backgroundSize: '200% 200%',
                  animation: 'drift 10s ease-in-out infinite',
                }}
              />

              {/* Thumbnail */}
              {bgImage ? (
                <div className="absolute inset-0">
                  <img
                    src={bgImage}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-bg)]/90 via-[var(--dark-bg)]/50 to-transparent" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--dark-bg)]/80 to-[var(--electric-blue)]/5" />
              )}

              {/* Glass overlay on hover */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-all duration-700" />

              {/* Accent strip with subtle pulse */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] z-10">
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to bottom, var(--electric-blue), var(--neon-green))',
                    animation: 'pulse-strip 4s ease-in-out infinite',
                  }}
                />
                <div
                  className="absolute -left-1 top-0 bottom-0 w-3 opacity-20"
                  style={{
                    background: 'linear-gradient(to bottom, var(--electric-blue), var(--neon-green))',
                    filter: 'blur(6px)',
                    animation: 'pulse-strip 4s ease-in-out infinite',
                  }}
                />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 z-10">
                {project.category && (
                  <div className="mb-2.5">
                    <span className="text-[10px] font-semibold tracking-wide text-[var(--electric-blue)]/80 bg-[var(--electric-blue)]/8 px-2.5 py-1 rounded-full border border-[var(--electric-blue)]/12 backdrop-blur-sm">
                      {project.category}
                    </span>
                  </div>
                )}

                <h3 className="text-lg md:text-xl font-bold text-white/90 leading-tight mb-1.5">
                  {project.title}
                </h3>

                {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack.slice(0, 3).map((tech: string, j: number) => (
                      <span
                        key={j}
                        className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/8 backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 3 && (
                      <span className="text-[10px] text-white/30 px-1">+{project.tech_stack.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Arrow on hover */}
                <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-1 group-hover:translate-x-0 bg-white/5 backdrop-blur-sm border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                    <path d="M5 12h14" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('projects').select('*').eq('is_active', true).order('order_index').then(({ data }) => {
      if (data) setProjects(data as Project[]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-32"><div className="w-10 h-10 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;
  if (projects.length === 0) return null;

  return (
    <section className="py-16 md:py-24 relative">
      {/* Ambient light */}
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--electric-blue), transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto px-4 relative">
        <SectionHeader title="Projects" subtitle="Some things I have built" />

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes drift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-strip {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </section>
  );
}
