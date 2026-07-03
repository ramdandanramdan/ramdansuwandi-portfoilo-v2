'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Education } from '@/lib/types';
import ImageLightbox from '@/components/landing/ImageLightbox';
import PdfPreview from '@/components/landing/PdfPreview';
import RichDescription from '@/components/landing/RichDescription';

export default function EducationDetailPage() {
  const params = useParams();
  const [edu, setEdu] = useState<Education | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showPdf, setShowPdf] = useState(false);

  useEffect(() => {
    supabase.from('education').select('*').eq('id', params.id).single().then(({ data, error }) => {
      if (data) setEdu(data as Education);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center py-32"><div className="w-10 h-10 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!edu) {
    return (
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gradient mb-4">Education Not Found</h2>
          <Link href="/landing/education" className="text-[var(--electric-blue)] hover:underline">← Back to Education</Link>
        </div>
      </section>
    );
  }

  const imageList: string[] = edu.image_url ? [edu.image_url, ...(edu.images || [])] : (edu.images || []);
  const restImages: string[] = edu.image_url ? (edu.images || []) : [];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/3 w-80 h-80 rounded-full bg-[var(--electric-blue)] opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full bg-[var(--neon-green)] opacity-[0.03] blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <Link
          href="/landing/education"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-xs text-[var(--text-secondary)] hover:text-white hover:border-[var(--electric-blue)]/30 transition-all mb-10 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Education</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8"
        >
          {/* Left: Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-4 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-green)]" />

              {/* Degree and school */}
              <div className="flex items-start gap-4 mb-6">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--electric-blue)]/10 to-[var(--neon-green)]/10 border border-[var(--glass-border)] flex items-center justify-center">
                  <svg className="w-7 h-7 text-[var(--electric-blue)]" viewBox="0 0 64 64" fill="none">
                    <path d="M32 4L4 20l28 16 28-16L32 4z" fill="currentColor" opacity="0.15" />
                    <path d="M32 4L4 20l28 16 28-16L32 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M4 20v16l28 16 28-16V20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                    <path d="M18 28v8l14 8 14-8v-8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{edu.degree}</h1>
                  <p className="text-lg text-[var(--electric-blue)] font-medium">{edu.school}</p>
                </div>
              </div>

              {/* Field of study */}
              {edu.field_of_study && (
                <div className="mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--electric-blue)]/8 border border-[var(--electric-blue)]/15 text-[var(--electric-blue)]">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    {edu.field_of_study}
                  </span>
                </div>
              )}

              {/* Date range */}
              <div className="flex flex-wrap items-start gap-x-6 gap-y-3 mb-6">
                {(edu.start_date || edu.end_date) && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>
                      {edu.start_date
                        ? new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                        : 'Start'}
                      {' — '}
                      {edu.end_date
                        ? new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                        : 'Present'}
                    </span>
                  </div>
                )}

                {/* Location */}
                {edu.location && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--electric-blue)] shrink-0">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{edu.location}</span>
                  </div>
                )}
              </div>

              <RichDescription text={edu.description} className="border-t border-[var(--glass-border)] pt-6" />

              {/* Grade */}
              {edu.grade && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--electric-blue)]/8 to-[var(--neon-green)]/8 border border-[var(--electric-blue)]/12">
                  <svg className="w-4 h-4 text-[var(--electric-blue)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="text-sm text-[var(--text-secondary)]">Grade:</span>
                  <span className="text-sm font-bold text-[var(--electric-blue)]">{edu.grade}</span>
                </div>
              )}

              {/* Certificate */}
              {edu.certificate_url && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowPdf(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--electric-blue)]/20 bg-[var(--electric-blue)]/5 hover:bg-[var(--electric-blue)]/10 hover:border-[var(--electric-blue)]/40 transition-all text-sm text-[var(--electric-blue)] group cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                      <path d="M6 9h4" />
                      <path d="M6 13h2" />
                      <path d="M14 9h4" />
                      <path d="M14 13h2" />
                    </svg>
                    <span className="font-medium">Lihat Ijazah</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                      <path d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Portfolio Kerja */}
              {edu.work_portfolio && edu.work_portfolio.length > 0 && (
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
                    {edu.work_portfolio.map((item, i) => (
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
              {edu.achievements && edu.achievements.length > 0 && (
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
                    {edu.achievements.map((item, i) => (
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
          <div className="lg:col-span-2 space-y-4">
            {imageList.length > 0 ? (
              <>
                {/* Thumbnail */}
                {edu.image_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card overflow-hidden group cursor-pointer relative"
                    onClick={() => { const idx = imageList.indexOf(edu.image_url!); if (idx >= 0) setLightboxIndex(idx); }}
                  >
                    <img
                      src={edu.image_url}
                      alt={edu.degree}
                      className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ aspectRatio: '16/9', minHeight: '140px' }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                  </motion.div>
                )}
                {/* Gallery */}
                {restImages.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {restImages.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card overflow-hidden group cursor-pointer"
                        onClick={() => { const idx = imageList.indexOf(img); if (idx >= 0) setLightboxIndex(idx); }}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={img}
                            alt={`${edu.degree} ${i + 1}`}
                            className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            style={{ aspectRatio: '4/3', minHeight: '120px' }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="glass-card p-8 text-center">
                <svg className="w-12 h-12 mx-auto mb-3 text-[var(--text-secondary)] opacity-30" viewBox="0 0 64 64" fill="none">
                  <path d="M32 4L4 20l28 16 28-16L32 4z" fill="currentColor" opacity="0.15" />
                  <path d="M32 4L4 20l28 16 28-16L32 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M4 20v16l28 16 28-16V20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                </svg>
                <p className="text-sm text-[var(--text-secondary)]">No images available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {lightboxIndex !== null && imageList.length > 0 && (
        <ImageLightbox
          images={imageList}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((prev) => prev !== null ? (prev === 0 ? imageList.length - 1 : prev - 1) : null)}
          onNext={() => setLightboxIndex((prev) => prev !== null ? (prev === imageList.length - 1 ? 0 : prev + 1) : null)}
        />
      )}

      {showPdf && (
        <PdfPreview
          url={edu?.certificate_url ?? null}
          label={`Ijazah - ${edu?.school ?? ''}`}
          onClose={() => setShowPdf(false)}
        />
      )}
    </section>
  );
}
