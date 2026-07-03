'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Organization } from '@/lib/types';
import SectionHeader from '@/components/landing/SectionHeader';
import RichDescription from '@/components/landing/RichDescription';

const monthFormat: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };

function formatDate(d: string | null) {
  return d ? new Date(d).toLocaleDateString('en-US', monthFormat) : null;
}

export default function OrganizationPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('organization').select('*').eq('is_active', true).order('order_index').then(({ data }) => {
      if (data) setOrganizations(data as Organization[]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-32"><div className="w-10 h-10 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;
  if (organizations.length === 0) return null;

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-5xl mx-auto px-4">
        <SectionHeader title="Organizations" subtitle="Communities and groups I am part of" />

        <div className="relative mt-16 pl-8 md:pl-0">
          {/* Timeline line — left side */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--neon-green)] via-[var(--electric-blue)] to-transparent" />

          {organizations.map((org, i) => {
            const start = formatDate(org.start_date);
            const end = formatDate(org.end_date);
            const period = start ? `${start}${end ? ` — ${end}` : ' — Present'}` : '';
            const images = Array.isArray(org.images) ? org.images : (org.image_url ? [org.image_url] : []);

            return (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-10 md:pl-16 pb-12 last:pb-0"
              >
                {/* Dot on timeline */}
                <div className="absolute left-[-5px] md:left-[27px] top-1 w-2.5 h-2.5 rounded-full bg-[var(--neon-green)] ring-4 ring-[var(--dark-bg)]" />

                {/* Card */}
                <Link href={`/landing/organization/${org.id}`} className="block group">
                  <div className="glass-card p-4 md:p-6 flex items-start gap-3 md:gap-5 hover:border-[var(--neon-green)]/30 transition-all">
                    {/* Logo */}
                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-lg md:text-2xl flex-shrink-0 overflow-hidden bg-[#1a1816] border border-[rgba(200,180,140,0.06)] group-hover:border-[var(--neon-green)]/20 transition-colors">
                      {org.image_url ? (
                        <img src={org.image_url} alt={org.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="opacity-60">🏛️</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-lg group-hover:text-[var(--neon-green)] transition-colors">{org.name}</h3>
                        {images.length > 0 && (
                          <span className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                            {images.length}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--electric-blue)] font-medium mb-2">{org.role}</p>
                      {period && (
                        <p className="text-[11px] text-[var(--text-secondary)] font-mono mb-2">{period}</p>
                      )}
                      <RichDescription text={org.description} className="text-sm line-clamp-2" />

                      {/* Bottom row */}
                      <div className="flex items-center gap-3 mt-3">
                        {org.website_url && (
                          <span className="text-[11px] text-[var(--text-secondary)] group-hover:text-[var(--neon-green)] transition-colors flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            Website
                          </span>
                        )}
                        <span className="text-[11px] text-[var(--text-secondary)] group-hover:text-white transition-colors flex items-center gap-1 ml-auto">
                          Details
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                            <path d="M5 12h14" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                      </div>
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
