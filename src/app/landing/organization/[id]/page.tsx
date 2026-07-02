'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Organization } from '@/lib/types';
import ImageLightbox from '@/components/landing/ImageLightbox';
import RichDescription from '@/components/landing/RichDescription';

export default function OrganizationDetailPage() {
  const params = useParams();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    supabase.from('organization').select('*').eq('id', params.id).single().then(({ data }) => {
      if (data) setOrg(data as Organization);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center py-32"><div className="w-10 h-10 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!org) {
    return (
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gradient mb-4">Organization Not Found</h2>
          <Link href="/landing/organization" className="text-[var(--electric-blue)] hover:underline">← Back to Organizations</Link>
        </div>
      </section>
    );
  }

  const images = Array.isArray(org.images) ? org.images : (org.image_url ? [org.image_url] : []);

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          href="/landing/organization"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-xs text-[var(--text-secondary)] hover:text-white hover:border-[var(--electric-blue)]/30 transition-all mb-8 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Organizations</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8"
        >
          {/* Left: Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden bg-[#1a1816] border border-[rgba(200,180,140,0.06)]">
                  {org.image_url ? <img src={org.image_url} alt={org.name} className="w-full h-full object-cover" /> : '🏛️'}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{org.name}</h1>
                  <p className="text-lg text-[var(--electric-blue)] font-medium">{org.role}</p>
                </div>
              </div>

              {(org.start_date || org.end_date) && (
                <p className="text-sm text-[var(--text-secondary)] mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {org.start_date
                    ? new Date(org.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                    : 'Start'}
                  {' — '}
                  {org.end_date
                    ? new Date(org.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                    : 'Present'}
                </p>
              )}

              {org.description && (
                <RichDescription text={org.description} />
              )}

              {org.website_url && (
                <a
                  href={org.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-xs text-white hover:border-[var(--electric-blue)]/30 transition-all mt-6"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Visit Website
                </a>
              )}

              {/* Portfolio Kerja */}
              {org.work_portfolio && org.work_portfolio.length > 0 && (
                <div className="mt-10 pt-6 border-t border-[var(--glass-border)]">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--electric-blue)]/20 to-[var(--neon-green)]/20 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--electric-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">Portofolio Kerja</h3>
                  </div>
                  <div className="space-y-3">
                    {org.work_portfolio.map((item, i) => (
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
                            {item.link_project && (
                              <a
                                href={item.link_project}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-2 text-xs text-[var(--electric-blue)] hover:underline"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                Link Project
                              </a>
                            )}
                            {item.documents && item.documents.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {item.documents.map((doc, j) => (
                                  <a
                                    key={j}
                                    href={doc}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-[var(--electric-blue)]/10 text-[var(--electric-blue)] border border-[var(--electric-blue)]/20 hover:bg-[var(--electric-blue)]/20 transition-colors"
                                  >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                    Dokumen {j + 1}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prestasi */}
              {org.achievements && org.achievements.length > 0 && (
                <div className="mt-10 pt-6 border-t border-[var(--glass-border)]">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/20 to-yellow-500/20 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">Prestasi</h3>
                  </div>
                  <div className="space-y-3">
                    {org.achievements.map((item, i) => (
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
          </div>

          {/* Right: Images */}
          <div className="lg:col-span-2">
            {images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {images.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card overflow-hidden group cursor-pointer"
                    onClick={() => setLightboxIndex(i)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={img}
                        alt={`${org.name} ${i + 1}`}
                        className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        style={{ aspectRatio: '4/3', minHeight: '120px' }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center">
                <div className="text-4xl mb-3 opacity-30">🏛️</div>
                <p className="text-sm text-[var(--text-secondary)]">No images available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {lightboxIndex !== null && images.length > 0 && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((prev) => prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : null)}
          onNext={() => setLightboxIndex((prev) => prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : null)}
        />
      )}
    </section>
  );
}
