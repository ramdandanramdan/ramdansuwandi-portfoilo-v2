'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Achievement } from '@/lib/types';
import ImageLightbox from '@/components/landing/ImageLightbox';
import PdfPreview from '@/components/landing/PdfPreview';
import RichDescription from '@/components/landing/RichDescription';

export default function AchievementDetailPage() {
  const params = useParams();
  const [ach, setAch] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showPdf, setShowPdf] = useState(false);

  useEffect(() => {
    supabase.from('achievements').select('*').eq('id', params.id).single().then(({ data }) => {
      if (data) setAch(data as Achievement);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center py-32"><div className="w-10 h-10 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!ach) {
    return (
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gradient mb-4">Achievement Not Found</h2>
          <Link href="/landing/achievements" className="text-[var(--electric-blue)] hover:underline">← Back to Achievements</Link>
        </div>
      </section>
    );
  }

  const images = (() => {
    const imgs: string[] = [];
    if (Array.isArray(ach?.images)) imgs.push(...ach.images);
    else if (ach?.image_url) imgs.push(ach.image_url);
    if (ach?.certificate_url && /\.(jpg|jpeg|png|gif|webp|avif|svg|bmp|ico)(\?.*)?$/i.test(ach.certificate_url)) {
      imgs.push(ach.certificate_url);
    }
    return imgs;
  })();

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          href="/landing/achievements"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-xs text-[var(--text-secondary)] hover:text-white hover:border-[var(--electric-blue)]/30 transition-all mb-8 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Achievements</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8"
        >
          {/* Left: Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-8">
              {ach.category && (
                <p className="text-xs text-[var(--electric-blue)] font-semibold tracking-wider mb-2">{ach.category.toUpperCase()}</p>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{ach.title}</h1>
              {ach.issuer && (
                <p className="text-lg text-[var(--electric-blue)] font-medium mb-4">{ach.issuer}</p>
              )}
              {ach.date && (
                <p className="text-sm text-[var(--text-secondary)] mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {new Date(ach.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </p>
              )}
              {ach.description && (
                <RichDescription text={ach.description} />
              )}
              {ach.certificate_url && (
                (() => {
                  const isPdf = ach.certificate_url.match(/\.pdf$/i);
                  const isImage = ach.certificate_url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|bmp|ico)(\?.*)?$/i);
                  if (isPdf) {
                    return (
                      <button
                        onClick={() => setShowPdf(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-xs text-white hover:border-[var(--electric-blue)]/30 transition-all mt-6 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                          <line x1="8" y1="21" x2="16" y2="21" />
                          <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                        View Certificate
                      </button>
                    );
                  }
                  if (isImage) {
                    return (
                      <button
                        onClick={() => {
                          const idx = images.findIndex(img => img === ach.certificate_url);
                          setLightboxIndex(idx >= 0 ? idx : images.length);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-xs text-white hover:border-[var(--electric-blue)]/30 transition-all mt-6 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        View Certificate
                      </button>
                    );
                  }
                  return (
                    <a
                      href={ach.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-xs text-white hover:border-[var(--electric-blue)]/30 transition-all mt-6"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      View Certificate
                    </a>
                  );
                })()
              )}
              {ach.certificate_external_url && (
                <a
                  href={ach.certificate_external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-xs text-white hover:border-[var(--electric-blue)]/30 transition-all mt-6 ml-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Link Certificate
                </a>
              )}
            </div>
          </div>

          {/* Right: Images */}
          <div className="lg:col-span-2">
            {images.length > 0 ? (
              <div className={`grid ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
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
                        alt={`${ach.title} ${i + 1}`}
                        className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        style={{ aspectRatio: images.length === 1 ? '16/9' : '4/3', minHeight: '120px' }}
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
                <div className="text-4xl mb-3 opacity-30">🏆</div>
                <p className="text-sm text-[var(--text-secondary)]">No images</p>
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

      {showPdf && (
        <PdfPreview
          url={ach?.certificate_url ?? null}
          label={`Certificate - ${ach?.title ?? ''}`}
          onClose={() => setShowPdf(false)}
        />
      )}
    </section>
  );
}
