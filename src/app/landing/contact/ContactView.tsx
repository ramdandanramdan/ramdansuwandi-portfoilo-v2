'use client';

import { useState } from 'react';
import SectionHeader from '@/components/landing/SectionHeader';
import TiltCard from '@/components/landing/TiltCard';
import PdfPreview from '@/components/landing/PdfPreview';
import type { Contact } from '@/lib/types';

const platformConfig: Record<string, { label: string; icon: React.ReactNode; color: string; gradient: string }> = {
  email: {
    label: 'Email',
    color: 'hover:text-[#EA4335]',
    gradient: 'from-[#EA4335]/10 to-transparent',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
    ),
  },
  whatsapp: {
    label: 'WhatsApp',
    color: 'hover:text-[#25D366]',
    gradient: 'from-[#25D366]/10 to-transparent',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
    ),
  },
  instagram: {
    label: 'Instagram',
    color: 'hover:text-[#E4405F]',
    gradient: 'from-[#E4405F]/10 to-transparent',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
    ),
  },
  linkedin: {
    label: 'LinkedIn',
    color: 'hover:text-[#0A66C2]',
    gradient: 'from-[#0A66C2]/10 to-transparent',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
    ),
  },
  github: {
    label: 'GitHub',
    color: 'hover:text-white',
    gradient: 'from-white/5 to-transparent',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
    ),
  },
};

export default function ContactView({
  socials,
  resumeUrl,
}: {
  socials: Contact[];
  resumeUrl: string | null;
}) {
  const [showCvPdf, setShowCvPdf] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const WA_NUMBER = '6285890750820';

  const handleWhatsApp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = `Halo, saya ${name || '...'}. ${message || ''}`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <>
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Let&apos;s Collaborate"
          subtitle="Let&apos;s build something impactful together — whether it&apos;s a project, partnership, or just a bold idea worth exploring."
        />

        <div className="mt-8 text-center">
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--neon-green)] tracking-wide"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,136,0.12), rgba(0,255,136,0.04))',
              border: '1px solid rgba(0,255,136,0.25)',
              boxShadow: '0 0 20px rgba(0,255,136,0.15), 0 0 60px rgba(0,255,136,0.06), inset 0 0 20px rgba(0,255,136,0.04)',
              animation: 'glowPulse 2s ease-in-out infinite',
            }}
          >
            <span className="relative w-2.5 h-2.5 rounded-full bg-[var(--neon-green)]">
              <span
                className="absolute inset-0 rounded-full bg-[var(--neon-green)]"
                style={{ animation: 'pingSlow 2s ease-in-out infinite' }}
              />
            </span>
            <span>Available for Work &amp; freelance collaboration</span>
          </div>
          <style>{`
            @keyframes glowPulse {
              0%, 100% { box-shadow: 0 0 20px rgba(0,255,136,0.15), 0 0 60px rgba(0,255,136,0.06), inset 0 0 20px rgba(0,255,136,0.04); }
              50% { box-shadow: 0 0 30px rgba(0,255,136,0.3), 0 0 80px rgba(0,255,136,0.1), inset 0 0 30px rgba(0,255,136,0.08); }
            }
            @keyframes pingSlow {
              0%, 100% { opacity: 0.4; transform: scale(1); }
              50% { opacity: 0; transform: scale(2.5); }
            }
          `}</style>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Social Links */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[var(--electric-blue)]/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--electric-blue)]"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Connect With Me</h3>
                  <p className="text-[10px] text-[var(--text-secondary)]">Choose your preferred platform</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {socials.length > 0 ? (
                  socials.map((s) => {
                    const platform = (s.platform ?? '').toLowerCase();
                    const cfg = platformConfig[platform] ?? {
                      label: s.label ?? 'Contact',
                      color: 'hover:text-[var(--electric-blue)]',
                      gradient: 'from-[var(--electric-blue)]/5 to-transparent',
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                      ),
                    };

                    return (
                      <a
                        key={s.id}
                        href={s.url ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)] ${cfg.color} transition-all group hover:bg-[rgba(255,255,255,0.05)] hover:border-current/20 hover:shadow-lg hover:-translate-y-0.5`}
                        style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                      >
                        <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: `color-mix(in srgb, currentColor 10%, transparent)` }}>
                          {cfg.icon}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] text-[var(--text-secondary)] font-medium">{cfg.label}</p>
                          <p className="text-sm text-white truncate">{s.value ?? ''}</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto shrink-0 text-[var(--text-secondary)] group-hover:text-white transition-all group-hover:translate-x-0.5" style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                      </a>
                    );
                  })
                ) : (
                  <p className="text-sm text-[var(--text-secondary)] text-center py-4">No contact links available.</p>
                )}
              </div>
            </div>

            {/* Download CV */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Download CV</h3>
                  <p className="text-[10px] text-[var(--text-secondary)]">Get my complete resume</p>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                Download my latest resume to learn more about my professional background, skills, projects, and achievements. Available in PDF format.
              </p>

              {resumeUrl ? (
                <button
                  onClick={() => setShowCvPdf(true)}
                  className="group inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] hover:bg-[var(--electric-blue)]/10 hover:border-[var(--electric-blue)]/20 text-sm text-white hover:text-[var(--electric-blue)] transition-all w-full cursor-pointer"
                  style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span className="flex-1 text-left">Lihat CV</span>
                  <span className="text-[10px] text-[var(--text-secondary)] group-hover:text-[var(--electric-blue)]">PDF</span>
                </button>
              ) : (
                <div className="px-5 py-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-dashed border-[var(--glass-border)]">
                  <p className="text-xs text-[var(--text-secondary)] text-center">CV not available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: WhatsApp Direct */}
          <div className="lg:col-span-3">
            <TiltCard className="p-0">
              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#25D366]"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Chat via WhatsApp</h3>
                    <p className="text-[10px] text-[var(--text-secondary)]">Fast response, just a click away</p>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleWhatsApp}>
                  <div>
                    <label className="block text-[10px] text-[var(--text-secondary)] font-medium mb-1.5">Nama *</label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[var(--text-secondary)] font-medium mb-1.5">Pesan *</label>
                    <textarea
                      placeholder="Tell me about your project, idea, or just say hello..."
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="textarea-field"
                      rows={5}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[10px] text-[var(--text-secondary)]">* Required fields</p>
                    <button type="submit" className="btn-primary flex items-center gap-2 px-6" style={{background: 'linear-gradient(135deg, #25D366, #128C7E)'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                      Send via WhatsApp
                    </button>
                  </div>
                </form>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>

      {showCvPdf && (
        <PdfPreview
          url={resumeUrl}
          label="CV - Ramdan Suwandi"
          onClose={() => setShowCvPdf(false)}
        />
      )}
    </>
  );
}
