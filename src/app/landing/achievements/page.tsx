'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Achievement } from '@/lib/types';
import SectionHeader from '@/components/landing/SectionHeader';
import RichDescription from '@/components/landing/RichDescription';
import ImageLightbox from '@/components/landing/ImageLightbox';
import PdfPreview from '@/components/landing/PdfPreview';

const categoryIcons: Record<string, string> = {
  award: '🏆',
  competition: '🥇',
  certification: '📜',
  certificate: '📜',
  education: '🎓',
  scholarship: '🎯',
  volunteer: '🤝',
  publication: '📄',
  patent: '💡',
  recognition: '⭐',
};

function getIcon(ach: Achievement): string {
  if (!ach.category) return '🏆';
  const key = ach.category.toLowerCase();
  return categoryIcons[key] || '🏆';
}

function getCategoryGradient(category: string | null): string {
  switch (category?.toLowerCase()) {
    case 'award':
      return 'from-amber-500/20 to-yellow-600/10';
    case 'competition':
      return 'from-rose-500/20 to-pink-600/10';
    case 'certification':
    case 'certificate':
      return 'from-sky-500/20 to-blue-600/10';
    case 'education':
      return 'from-violet-500/20 to-purple-600/10';
    case 'publication':
      return 'from-emerald-500/20 to-teal-600/10';
    default:
      return 'from-[var(--electric-blue)]/15 to-[var(--neon-green)]/10';
  }
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewIndex, setPreviewIndex] = useState<{ achIdx: number; imgIdx: number } | null>(null);
  const [certificatePdf, setCertificatePdf] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    supabase.from('achievements').select('*').eq('is_active', true).order('order_index').then(({ data }) => {
      if (data) setAchievements(data as Achievement[]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-32"><div className="w-10 h-10 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;
  if (achievements.length === 0) return null;

  const previewImages = previewIndex !== null
    ? (() => {
        const ach = achievements[previewIndex.achIdx];
        const imgs: string[] = [];
        if (Array.isArray(ach?.images)) imgs.push(...ach.images);
        else if (ach?.image_url) imgs.push(ach.image_url);
        if (ach?.certificate_url && /\.(jpg|jpeg|png|gif|webp|avif|svg|bmp|ico)(\?.*)?$/i.test(ach.certificate_url)) {
          imgs.push(ach.certificate_url);
        }
        return imgs;
      })()
    : [];

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader title="Achievements" subtitle="Awards and recognition" />

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {achievements.map((ach, i) => {
            const images = Array.isArray(ach.images) ? ach.images : (ach.image_url ? [ach.image_url] : []);

            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="glass-card h-full overflow-hidden hover:border-[var(--electric-blue)]/20 transition-all flex flex-col">
                  {/* Top ribbon */}
                  <div className={`h-2 bg-gradient-to-r ${getCategoryGradient(ach.category)}`} />

                  {/* Thumbnail */}
                  {ach.image_url && (
                    <div className="relative w-full overflow-hidden bg-black/20">
                      <img
                        src={ach.image_url}
                        alt={ach.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-card)] via-transparent to-transparent" />
                    </div>
                  )}

                  {/* Icon + Title */}
                  <div className={`flex items-center gap-3 ${ach.image_url ? 'pt-3' : 'pt-4'} px-4 md:px-6 pb-3 md:pb-4`}>
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
                      {getIcon(ach)}
                    </div>
                    <div className="min-w-0 flex-1">
                      {ach.category && (
                        <p className="text-[10px] text-[var(--electric-blue)] font-semibold tracking-widest uppercase">{ach.category}</p>
                      )}
                      <h3 className="text-white font-bold text-base leading-tight line-clamp-2">{ach.title}</h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-4 md:px-6 pb-3 space-y-2 flex-1">
                    {ach.issuer && (
                      <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--electric-blue)]">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        {ach.issuer}
                      </p>
                    )}
                    {ach.date && (
                      <p className="text-[11px] text-[var(--text-secondary)] font-mono flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--neon-green)]">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {new Date(ach.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </p>
                    )}
                    {ach.description && (
                      <RichDescription text={ach.description} className="text-xs line-clamp-2 pt-1" />
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="px-4 md:px-6 pb-4 md:pb-5 pt-2 flex items-center gap-2 border-t border-[var(--glass-border)]">
                    <Link
                      href={`/landing/achievements/${ach.id}`}
                      className="flex-1 px-3 py-2 rounded-lg text-xs text-center text-[var(--text-secondary)] hover:text-white bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] transition-all"
                    >
                      Detail
                    </Link>
                    {ach.certificate_url && (
                      (() => {
                        const isPdf = ach.certificate_url.match(/\.pdf$/i);
                        const isImage = ach.certificate_url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|bmp|ico)(\?.*)?$/i);
                        if (isPdf) {
                          return (
                            <button
                              onClick={() => setCertificatePdf({ url: ach.certificate_url!, title: ach.title })}
                              className="flex-1 px-3 py-2 rounded-lg text-xs text-center text-[var(--neon-green)] border border-[var(--neon-green)]/20 hover:bg-[var(--neon-green)]/10 transition-all"
                            >
                              Certificate
                            </button>
                          );
                        }
                        if (isImage) {
                          return (
                            <button
                              onClick={() => {
                                const imgIdx = images.findIndex(img => img === ach.certificate_url);
                                setPreviewIndex({ achIdx: i, imgIdx: imgIdx >= 0 ? imgIdx : 0 });
                              }}
                              className="flex-1 px-3 py-2 rounded-lg text-xs text-center text-[var(--neon-green)] border border-[var(--neon-green)]/20 hover:bg-[var(--neon-green)]/10 transition-all"
                            >
                              Certificate
                            </button>
                          );
                        }
                        return (
                          <a
                            href={ach.certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-3 py-2 rounded-lg text-xs text-center text-[var(--neon-green)] border border-[var(--neon-green)]/20 hover:bg-[var(--neon-green)]/10 transition-all"
                          >
                            Certificate
                          </a>
                        );
                      })()
                    )}
                    {ach.certificate_external_url && (
                      <a
                        href={ach.certificate_external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 rounded-lg text-xs text-center text-[var(--neon-green)] border border-[var(--neon-green)]/20 hover:bg-[var(--neon-green)]/10 transition-all"
                      >
                        Link
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {previewIndex !== null && previewImages.length > 0 && (
        <ImageLightbox
          images={previewImages}
          currentIndex={previewIndex.imgIdx}
          onClose={() => setPreviewIndex(null)}
          onPrev={() => setPreviewIndex((prev) =>
            prev ? { ...prev, imgIdx: prev.imgIdx === 0 ? previewImages.length - 1 : prev.imgIdx - 1 } : null
          )}
          onNext={() => setPreviewIndex((prev) =>
            prev ? { ...prev, imgIdx: prev.imgIdx === previewImages.length - 1 ? 0 : prev.imgIdx + 1 } : null
          )}
        />
      )}

      {certificatePdf && (
        <PdfPreview
          url={certificatePdf.url}
          label={`Certificate - ${certificatePdf.title}`}
          onClose={() => setCertificatePdf(null)}
        />
      )}
    </section>
  );
}
