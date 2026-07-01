'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Experience } from '@/lib/types';
import ImageLightbox from '@/components/landing/ImageLightbox';
import RichDescription from '@/components/landing/RichDescription';
import PdfPreview from '@/components/landing/PdfPreview';

export default function ExperienceDetailPage() {
  const params = useParams();
  const [exp, setExp] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [docPreviewUrl, setDocPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('experience').select('*').eq('id', params.id).single().then(({ data, error }) => {
      if (data) setExp(data as Experience);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center py-32"><div className="w-10 h-10 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!exp) {
    return (
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gradient mb-4">Experience Not Found</h2>
          <Link href="/landing/experience" className="text-[var(--electric-blue)] hover:underline">← Back to Experience</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          href="/landing/experience"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-xs text-[var(--text-secondary)] hover:text-white hover:border-[var(--electric-blue)]/30 transition-all mb-8 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Experience</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8"
        >
          {/* Left: Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-8">
              <p className="text-xs text-[var(--electric-blue)] font-semibold tracking-wider mb-2">
                {exp.type?.toUpperCase()}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{exp.title}</h1>
              <p className="text-lg text-[var(--electric-blue)] font-medium mb-4">
                {exp.company} — {exp.position}
              </p>
              <div className="glass-card p-4 mb-6 space-y-2">
                {(exp.start_date || exp.end_date) && (
                  <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {exp.start_date
                      ? new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                      : 'Start'}
                    {' — '}
                    {exp.end_date
                      ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                      : 'Present'}
                  </p>
                )}
                {exp.location && (
                  <p className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{exp.location}</span>
                  </p>
                )}
              </div>
              <RichDescription text={exp.description} />

              {/* Portfolio Kerja */}
              {exp.work_portfolio && exp.work_portfolio.length > 0 && (
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
                    {exp.work_portfolio.map((item, i) => (
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
              {exp.achievements && exp.achievements.length > 0 && (
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
                    {exp.achievements.map((item, i) => (
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
            {exp.images && exp.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exp.images.map((img, i) => (
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
                        alt={`${exp.title} ${i + 1}`}
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
                <div className="text-4xl mb-3 opacity-30">🖼️</div>
                <p className="text-sm text-[var(--text-secondary)]">No images available</p>
              </div>
            )}

            {/* Documents */}
            {exp.documents && exp.documents.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--electric-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Dokumen Pendukung
                </h3>
                <div className="space-y-2">
                  {exp.documents.map((doc, i) => {
                    const isPdf = /\.pdf$/i.test(doc);
                    const fileName = decodeURIComponent(doc.split('/').pop() || `Document ${i + 1}`);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                      <div
                        className="glass-card p-3 flex items-center gap-3 group cursor-pointer hover:border-[var(--electric-blue)]/30 transition-all"
                        onClick={() => isPdf ? setDocPreviewUrl(doc) : window.open(doc, '_blank')}
                      >
                          <div className="w-9 h-9 rounded-lg bg-[var(--electric-blue)]/10 flex items-center justify-center shrink-0">
                            <span className="text-lg">{isPdf ? '📄' : '📎'}</span>
                          </div>
                          <span className="text-xs text-[var(--text-secondary)] flex-1 truncate">{fileName}</span>
                          {isPdf ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--electric-blue)" strokeWidth="1.5" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <circle cx="11" cy="11" r="8" />
                              <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                          ) : (
                            <a
                              href={doc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--neon-green)" strokeWidth="1.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {lightboxIndex !== null && exp.images && (
        <ImageLightbox
          images={exp.images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((prev) => prev !== null ? (prev === 0 ? exp.images!.length - 1 : prev - 1) : null)}
          onNext={() => setLightboxIndex((prev) => prev !== null ? (prev === exp.images!.length - 1 ? 0 : prev + 1) : null)}
        />
      )}

      {docPreviewUrl && (
        <PdfPreview
          url={docPreviewUrl}
          label={decodeURIComponent(docPreviewUrl.split('/').pop() || 'Document')}
          onClose={() => setDocPreviewUrl(null)}
        />
      )}
    </section>
  );
}
