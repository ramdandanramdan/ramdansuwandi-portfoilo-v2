'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Education } from '@/lib/types';
import SectionHeader from '@/components/landing/SectionHeader';

const monthFormat: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };

function formatDate(d: string | null) {
  return d ? new Date(d).toLocaleDateString('en-US', monthFormat) : null;
}

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function GraduateHat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 52" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M32 2L2 20l30 18 30-18L32 2z" />
      <path d="M2 20v16l30 18 30-16V20" />
      <path d="M18 28v8l14 8 14-8v-8" />
    </svg>
  );
}

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('education').select('*').eq('is_active', true).order('order_index').then(({ data }) => {
      if (data) setEducations(data as Education[]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-32"><div className="w-10 h-10 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;
  if (educations.length === 0) return null;

  return (
    <section className="py-28 relative overflow-hidden">
      {/* Deep background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[var(--electric-blue)] opacity-[0.02] blur-[300px]" />
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[var(--electric-blue)]/[0.012] to-transparent" />
        <div className="absolute inset-0 opacity-[0.005]"
          style={{ backgroundImage: 'linear-gradient(var(--electric-blue) 1px, transparent 1px), linear-gradient(90deg, var(--electric-blue) 1px, transparent 1px)', backgroundSize: '100px 100px' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <SectionHeader title="Education" subtitle="Academic background and qualifications" />

        {/* Base platform */}
        <motion.div
          className="relative mx-auto mt-16 mb-0"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          style={{ maxWidth: Math.min(educations.length * 300 + 100, 700), transformOrigin: 'center' }}
        >
          <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-full h-24 rounded-full bg-[var(--electric-blue)] opacity-[0.06] blur-[40px]" />
          <div className="h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-[var(--electric-blue)]/30 to-transparent" />
        </motion.div>

        {/* Bars */}
        <div className="flex flex-col md:flex-row items-stretch md:items-end justify-center gap-4 md:gap-16 mt-0">
          {educations.map((edu, i) => {
            const start = formatDate(edu.start_date);
            const end = formatDate(edu.end_date);
            const period = start ? `${start}${end ? ` — ${end}` : ' — Present'}` : '';
            const isLast = i === educations.length - 1;
            const barHeight = isLast ? 'h-48 md:h-[28rem]' : 'h-40 md:h-96';
            const imageSrc = edu.image_url || edu.images?.[0] || null;

            return (
              <div key={edu.id} className="flex flex-col items-center relative">
                {/* Bar wrapper */}
                <Link href={`/landing/education/${edu.id}`} className="block group z-10 w-full md:w-auto">
                  <div className={`relative w-full sm:w-48 md:w-72 ${barHeight}`}>
                    {/* Bar card */}
                    <motion.div
                      className="glass-card w-full h-full rounded-xl md:rounded-t-2xl overflow-hidden cursor-pointer"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 1.2, delay: i * 0.3, ease }}
                      style={{ transformOrigin: 'bottom' }}
                      whileHover={{ y: -4, transition: { duration: 0.3, ease } }}
                    >
                      {/* Gradient depth overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />

                      {/* Thumbnail background */}
                      {imageSrc ? (
                        <div className="absolute inset-0">
                          <img
                            src={imageSrc}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-card)] via-[var(--dark-card)]/70 to-transparent" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-[var(--dark-card)]" />
                      )}

                      {/* Accent gradient strip */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 md:w-1.5 z-20">
                        <div
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(to bottom, var(--electric-blue), var(--neon-green))',
                          }}
                        />
                        <div
                          className="absolute -left-1 top-0 bottom-0 w-3 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                          style={{
                            background: 'linear-gradient(to bottom, var(--electric-blue), var(--neon-green))',
                            filter: 'blur(6px)',
                          }}
                        />
                      </div>

                      {/* Top accent line */}
                      <div
                        className="absolute top-0 left-0 right-0 h-px z-20 opacity-30"
                        style={{
                          background: `linear-gradient(to right, transparent, color-mix(in srgb, var(--electric-blue) 40%, transparent), transparent)`,
                        }}
                      />

                      {/* Content */}
                      <motion.div
                        className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 z-20"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.3 + 0.3, ease }}
                      >
                        {/* Degree */}
                        <h3 className="text-sm md:text-lg font-bold text-white leading-tight mb-0.5 drop-shadow-lg">
                          {edu.degree}
                        </h3>

                        {/* School */}
                        <p className="text-[11px] md:text-sm text-white/70 group-hover:text-white/90 transition-colors duration-500 font-medium mb-2 drop-shadow">
                          {edu.school}
                        </p>

                        {/* Bottom row */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.08]">
                          <span className="text-[9px] md:text-xs text-white/40 font-mono tracking-tight">{period}</span>
                          {edu.grade && (
                            <span className="text-[10px] md:text-xs font-bold text-white bg-white/[0.08] px-2.5 py-0.5 rounded-full backdrop-blur border border-white/[0.04]">
                              {edu.grade}
                            </span>
                          )}
                        </div>
                      </motion.div>

                      {/* Number badge */}
                      <div className="absolute top-3 right-3 z-20">
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-black/30 backdrop-blur border border-white/[0.06] flex items-center justify-center group-hover:border-[var(--electric-blue)]/30 group-hover:bg-[var(--electric-blue)]/10 transition-all duration-500">
                          <span className="text-[9px] md:text-xs font-bold text-white/50 group-hover:text-[var(--electric-blue)] transition-colors duration-500">{i + 1}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </Link>

                {/* Year label */}
                <motion.p
                  className="mt-4 text-xs md:text-sm text-[var(--text-secondary)]/40 font-mono tracking-wider z-10"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.3 + 0.6, ease }}
                >
                  {edu.start_date ? edu.start_date.slice(0, 4) : '—'}
                </motion.p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          className="relative mx-auto mt-16 text-center"
          style={{ maxWidth: 400 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-10 w-full h-20 rounded-full"
            style={{
              background: 'radial-gradient(ellipse, color-mix(in srgb, var(--electric-blue) 8%, transparent), transparent)',
              filter: 'blur(30px)',
            }}
          />
          <div className="relative flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--electric-blue)]/20" />
            <span className="text-[10px] text-[var(--text-secondary)]/25 tracking-[0.2em] uppercase font-mono">
              {educations.length} {educations.length > 1 ? 'Degrees' : 'Degree'} Completed
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--neon-green)]/20" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
