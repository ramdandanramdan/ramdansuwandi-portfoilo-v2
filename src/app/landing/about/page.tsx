'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { About, Home } from '@/lib/types';
import SectionHeader from '@/components/landing/SectionHeader';
import RichDescription from '@/components/landing/RichDescription';


const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatCard({ label, value }: { label: string; value: string }) {
  const numValue = parseInt(value);
  const isNum = !isNaN(numValue);
  const { count, ref } = useCountUp(isNum ? numValue : 0);

  return (
    <div className="glass-card p-3 md:p-5 text-center">
      <span ref={ref} className="text-2xl md:text-3xl font-bold text-gradient tabular-nums">
        {isNum ? count : value}{isNum && <span className="text-lg">+</span>}
      </span>
      <p className="text-xs text-[var(--text-secondary)] mt-1.5 uppercase tracking-wider font-medium">{label}</p>
    </div>
  );
}

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [home, setHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('about').select('*').eq('is_active', true).limit(1),
      supabase.from('home').select('*').eq('is_active', true).limit(1),
    ]).then(([aboutRes, homeRes]) => {
      if (aboutRes.data?.length) setAbout(aboutRes.data[0] as About);
      if (homeRes.data?.length) setHome(homeRes.data[0] as Home);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-32"><div className="w-10 h-10 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;
  if (!about) return null;

  const milestoneList = (about.milestones || []) as { year: string; title: string; description: string }[];
  const servicesList = (home?.services || []) as string[];
  const statsList = (home?.stats || []) as { label: string; value: string }[];

  const serviceIcons = [
    <svg key="0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    <svg key="1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    <svg key="2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
    <svg key="3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    <svg key="4" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>,
    <svg key="5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/></svg>,
  ];

  const serviceLabels = [
    'Building responsive and performant web applications with modern frameworks.',
    'Crafting intuitive user interfaces with clean, maintainable code.',
    'Developing robust server-side solutions and RESTful APIs.',
    'Creating cross-platform mobile experiences with React Native.',
    'Designing and optimizing database schemas and queries.',
    'Deploying and managing cloud infrastructure for scalable apps.',
  ];

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader title={about.title} subtitle={home?.tagline || 'About me'} />

        {/* Profile */}
        <div className="mt-16 mb-16">
          <div className="glass-card p-4 md:p-8 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--electric-blue)] to-[var(--neon-green)]" />
            <div className="md:grid md:grid-cols-5 gap-8 md:gap-12 items-start">
              <div className="md:col-span-2 max-w-[280px] mx-auto md:max-w-none">
                <div className="rounded-xl shadow-lg border border-[var(--glass-border)] overflow-hidden bg-[var(--dark-card)]">
                  {about.image_url ? (
                    <img src={about.image_url} alt={about.title} className="w-full h-auto" />
                  ) : (
                    <div className="w-full aspect-[3/4] flex items-center justify-center text-5xl">👤</div>
                  )}
                </div>
              </div>

              <div className="md:col-span-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--electric-blue)]">About Me</span>

                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mt-2">
                  Hello, I'm <span className="text-[var(--electric-blue)]">{about.title}</span>
                </h1>

                {home?.tagline && (
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{home.tagline}</p>
                )}

                <div className="w-12 h-0.5 rounded-full bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-green)] my-4" />

                <div className="text-sm text-[var(--text-secondary)] leading-relaxed text-left">
                  <RichDescription text={about.description} />
                </div>

                {about.skills_summary && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {about.skills_summary.split(',').map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-[11px] font-medium rounded-full bg-[var(--electric-blue)]/8 text-[var(--electric-blue)] border border-[var(--electric-blue)]/15"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-5 mt-6 pt-5 border-t border-[var(--glass-border)]">
                  {home?.location && (
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>Based in <span className="text-white">{home.location}</span></span>
                    </div>
                  )}
                  {home?.is_available !== undefined && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${home.is_available ? 'bg-[var(--neon-green)] shadow-[0_0_6px_var(--neon-green)]' : 'bg-red-500'}`} />
                      <span className="text-[var(--text-secondary)]">
                        {home.is_available ? (
                          <><span className="text-[var(--neon-green)]">Available</span> for work</>
                        ) : 'Not available'}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 ml-auto">
                    <Link
                      href="/landing/projects"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-black transition-all duration-300 hover:shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, var(--electric-blue), var(--neon-green))',
                      }}
                    >
                      Lihat Proyek
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </Link>
                    <Link
                      href="/landing/contact"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--electric-blue)] hover:text-[var(--electric-blue)] transition-all duration-300"
                    >
                      Hubungi Saya
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {statsList.length > 0 && (
          <div className="mb-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {statsList.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease }}
                >
                  <StatCard label={s.label} value={s.value} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Services */}
        {servicesList.length > 0 && (
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--electric-blue)]">What I Do</span>
              <h2 className="text-2xl font-bold text-white mt-2">My Services</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-md mx-auto">
                Technologies and solutions I work with to bring ideas to life.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {servicesList.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease }}
                >
                  <div className="glass-card p-5 h-full group cursor-default">
                    <div className="w-10 h-10 rounded-lg bg-[var(--electric-blue)]/10 text-[var(--electric-blue)] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[var(--electric-blue)]/15 transition-all duration-300">
                      {serviceIcons[i % serviceIcons.length]}
                    </div>
                    <h3 className="text-sm font-semibold text-white">{service}</h3>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1.5 leading-relaxed">{serviceLabels[i % serviceLabels.length]}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {milestoneList.length > 0 && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--electric-blue)]">Journey</span>
              <h2 className="text-2xl font-bold text-white mt-2">Milestones</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-md mx-auto">
                Key moments and achievements throughout my career.
              </p>
            </motion.div>
            <div className="max-w-2xl mx-auto relative pl-9">
              <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[var(--electric-blue)]/50 via-[var(--neon-green)]/30 to-transparent rounded-full" />
              <div className="space-y-8">
                {milestoneList.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.5, ease }}
                    className="relative"
                  >
                    <div className="absolute -left-9 top-1 w-[30px] h-[30px] rounded-full bg-[var(--dark-card)] border-2 border-[var(--electric-blue)]/30 flex items-center justify-center text-[10px] font-bold text-[var(--electric-blue)] shadow-[0_0_10px_color-mix(in_srgb,var(--electric-blue),transparent_70%)]">
                      {m.year.slice(2)}
                    </div>
                    <div className="glass-card px-5 py-4">
                      <span className="text-[10px] text-[var(--electric-blue)] font-semibold uppercase tracking-wider">{m.year}</span>
                      <h4 className="text-sm font-semibold text-white mt-1">{m.title}</h4>
                      {m.description && <RichDescription text={m.description} className="text-xs" />}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Kerja */}
        {about.work_portfolio && about.work_portfolio.length > 0 && (
          <div className="mt-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--electric-blue)]">Portfolio</span>
              <h2 className="text-2xl font-bold text-white mt-2">Portofolio Kerja</h2>
            </motion.div>
            <div className="max-w-2xl mx-auto space-y-3">
              {about.work_portfolio.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative rounded-xl border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[var(--electric-blue)]/25 transition-all p-4"
                >
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-[var(--electric-blue)]/40 to-[var(--neon-green)]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[var(--electric-blue)]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--electric-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Prestasi */}
        {about.achievements && about.achievements.length > 0 && (
          <div className="mt-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--electric-blue)]">Achievements</span>
              <h2 className="text-2xl font-bold text-white mt-2">Prestasi</h2>
            </motion.div>
            <div className="max-w-2xl mx-auto space-y-3">
              {about.achievements.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative rounded-xl border border-amber-400/10 bg-gradient-to-r from-amber-400/3 to-transparent hover:from-amber-400/8 hover:border-amber-400/25 transition-all p-4"
                >
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-amber-400/40 to-yellow-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
