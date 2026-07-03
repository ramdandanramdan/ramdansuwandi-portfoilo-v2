'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Experience } from '@/lib/types';
import SectionHeader from '@/components/landing/SectionHeader';
import RichDescription from '@/components/landing/RichDescription';
import TiltCard from '@/components/landing/TiltCard';

const monthFormat: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };

function formatDate(d: string | null) {
  return d ? new Date(d).toLocaleDateString('en-US', monthFormat) : null;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('experience').select('*').eq('is_active', true).eq('type', 'work').order('order_index').then(({ data }) => {
      if (data) setExperiences(data as Experience[]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-32"><div className="w-10 h-10 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;
  if (experiences.length === 0) return null;

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader title="Experience" subtitle="Professional journey and work history" />

        <div className="relative mt-16">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--electric-blue)] via-[var(--neon-green)] to-transparent -translate-x-1/2 hidden md:block" />

          {experiences.map((exp, i) => {
            const start = formatDate(exp.start_date);
            const end = formatDate(exp.end_date);
            const period = start ? `${start}${end ? ` — ${end}` : ' — Present'}` : '';

            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/landing/experience/${exp.id}`}>
                  {/* Mobile: stacked */}
                  <div className="md:hidden glass-card p-5 mb-6 group cursor-pointer relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--electric-blue)] to-[var(--neon-green)]" />
                    <h3 className="text-base font-bold text-white mb-0.5">{exp.title}</h3>
                    <p className="text-xs text-[var(--electric-blue)] mb-1">{exp.company} — {exp.position}</p>
                    {period && <p className="text-[10px] text-[var(--text-secondary)] mb-2">{period}</p>}
                    <RichDescription text={exp.description} className="text-xs line-clamp-3" />
                  </div>

                  {/* Desktop: alternating left-right */}
                  <div className="hidden md:flex items-stretch mb-8 group cursor-pointer">
                    {/* Left side: card on even, period on odd */}
                    <div className={`w-[calc(50%-28px)] flex ${isLeft ? '' : 'items-center justify-end'}`}>
                      {isLeft ? (
                        <TiltCard className="p-6 w-full" tiltDegree={4} glowSize={350}>
                          <h3 className="text-xl font-bold text-white mb-1" style={{ transform: 'translateZ(20px)' }}>{exp.title}</h3>
                          <p className="text-sm text-[var(--electric-blue)] font-medium mb-2" style={{ transform: 'translateZ(12px)' }}>{exp.company} — {exp.position}</p>
                          {period && <p className="text-xs text-[var(--text-secondary)] mb-3" style={{ transform: 'translateZ(8px)' }}>{period}</p>}
                          <RichDescription text={exp.description} className="text-sm line-clamp-3" style={{ transform: 'translateZ(10px)' }} />
                        </TiltCard>
                      ) : (
                        period ? (
                          <div className="text-right pr-8">
                            <div className="text-[11px] text-[var(--text-secondary)] font-mono whitespace-nowrap">{period}</div>
                          </div>
                        ) : null
                      )}
                    </div>

                    {/* Timeline dot */}
                    <div className="relative z-10 flex-shrink-0 w-14 flex items-start justify-center pt-5">
                      <div className="w-4 h-4 rounded-full bg-[var(--dark-bg)] border-2 border-[var(--electric-blue)] group-hover:border-[var(--neon-green)] group-hover:scale-125 transition-all duration-300 shadow-lg shadow-[var(--electric-blue)]/20" />
                      <div className={`absolute top-[calc(24px)] bottom-0 w-px bg-gradient-to-b from-[var(--electric-blue)]/20 to-transparent ${i === experiences.length - 1 ? 'hidden' : ''}`} />
                    </div>

                    {/* Right side: card on odd, period on even */}
                    <div className={`w-[calc(50%-28px)] flex ${!isLeft ? '' : 'items-center justify-start'}`}>
                      {!isLeft ? (
                        <TiltCard className="p-6 w-full" tiltDegree={4} glowSize={350}>
                          <h3 className="text-xl font-bold text-white mb-1" style={{ transform: 'translateZ(20px)' }}>{exp.title}</h3>
                          <p className="text-sm text-[var(--electric-blue)] font-medium mb-2" style={{ transform: 'translateZ(12px)' }}>{exp.company} — {exp.position}</p>
                          {period && <p className="text-xs text-[var(--text-secondary)] mb-3" style={{ transform: 'translateZ(8px)' }}>{period}</p>}
                          <RichDescription text={exp.description} className="text-sm line-clamp-3" style={{ transform: 'translateZ(10px)' }} />
                        </TiltCard>
                      ) : (
                        period ? (
                          <div className="pl-8">
                            <div className="text-[11px] text-[var(--text-secondary)] font-mono whitespace-nowrap">{period}</div>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
