'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createItem, updateItem } from '@/lib/actions';
import type { SectionName } from '@/lib/types';

const platformTemplates: Record<string, { label: string; urlPrefix: string; placeholder: string; icon: string }> = {
  whatsapp: {
    label: 'WhatsApp',
    urlPrefix: 'https://wa.me/',
    placeholder: '6285890750820',
    icon: 'message-circle',
  },
  email: {
    label: 'Email',
    urlPrefix: 'mailto:',
    placeholder: 'ramdansuwandi18@gmail.com',
    icon: 'mail',
  },
  instagram: {
    label: 'Instagram',
    urlPrefix: 'https://instagram.com/',
    placeholder: 'ramdansunday',
    icon: 'camera',
  },
  linkedin: {
    label: 'LinkedIn',
    urlPrefix: 'https://linkedin.com/in/',
    placeholder: 'ramdansuwandi',
    icon: 'linkedin',
  },
  github: {
    label: 'GitHub',
    urlPrefix: 'https://github.com/',
    placeholder: 'username',
    icon: 'github',
  },
  website: {
    label: 'Website',
    urlPrefix: '',
    placeholder: 'https://example.com',
    icon: 'globe',
  },
};

interface Props {
  isNew: boolean;
  isSocial: boolean;
  initialData: Record<string, unknown>;
  section: SectionName;
  itemId?: string;
}

export default function ContactFormClient({ isNew, isSocial, initialData, section, itemId }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [platform, setPlatform] = useState((initialData.platform as string) ?? '');
  const [handle, setHandle] = useState('');
  const [customLabel, setCustomLabel] = useState((initialData.label as string) ?? '');
  const [customUrl, setCustomUrl] = useState((initialData.url as string) ?? '');

  const template = platformTemplates[platform];
  const isCustom = platform === 'website' || platform === '';

  const generatedUrl = template && handle
    ? template.urlPrefix + handle.replace(/^@/, '')
    : isCustom ? customUrl : '';

  const displayValue = template && handle
    ? (platform === 'whatsapp' ? `+${handle.replace(/^\+?62/, '62')}` : handle)
    : '';

  const generatedLabel = template?.label ?? customLabel;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData(e.target as HTMLFormElement);
    const type = isSocial ? 'social' : 'message';

    if (isSocial) {
      const finalPlatform = platform;
      const finalHandle = handle || (initialData.value as string) || '';
      const finalUrl = generatedUrl || customUrl || (initialData.url as string) || '';
      const finalLabel = generatedLabel || (initialData.label as string) || '';
      const finalValue = displayValue || finalHandle;

      formData.set('type', type);
      formData.set('platform', finalPlatform);
      formData.set('label', finalLabel);
      formData.set('value', finalValue);
      formData.set('url', finalUrl);
    }

    try {
      if (isNew) {
        await createItem(section, formData);
      } else {
        await updateItem(section, itemId!, formData);
      }
      router.push('/admin/dashboard/contact');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
    setSubmitting(false);
  };

  // Message view
  if (!isSocial) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/admin/dashboard/contact" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </Link>

        <div className="glass-card p-6 space-y-4">
          <h3 className="text-white font-semibold text-sm tracking-wide">Sender Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-[var(--text-secondary)] font-medium mb-1">Name</label>
              <p className="text-sm text-white">{String(initialData.name ?? '')}</p>
            </div>
            <div>
              <label className="block text-[10px] text-[var(--text-secondary)] font-medium mb-1">Email</label>
              <p className="text-sm text-[var(--electric-blue)]">{String(initialData.email ?? '')}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] text-[var(--text-secondary)] font-medium mb-1">Subject</label>
              <p className="text-sm text-white">{String(initialData.subject ?? '') || <span className="text-[var(--text-secondary)] italic">No subject</span>}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-white font-semibold text-sm tracking-wide mb-3">Message</h3>
          <div className="bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)] rounded-xl p-4">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{String(initialData.message ?? '')}</p>
          </div>
        </div>

        <Link
          href={`mailto:${initialData.email}?subject=Re: ${initialData.subject || 'Your Message'}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2 11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Reply via Email
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/dashboard/contact" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors flex items-center gap-1 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        Back to Contact
      </Link>

      <div className="glass-card p-8">
        <h3 className="text-white font-semibold text-sm tracking-wide mb-6">
          {isNew ? 'Add Contact Link' : 'Edit Contact Link'}
        </h3>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input type="hidden" name="type" value="social" />

          {/* Platform */}
          <div>
            <label className="block text-[10px] text-[var(--text-secondary)] font-medium mb-1.5">Platform</label>
            <select
              value={platform}
              onChange={(e) => { setPlatform(e.target.value); setHandle(''); setCustomUrl(''); }}
              className="input-field"
              required
            >
              <option value="">-- Select Platform --</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email (Gmail)</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="github">GitHub</option>
              <option value="website">Website / Other</option>
            </select>
          </div>

          {/* Handle / Value Input */}
          {platform && (
            <div>
              <label className="block text-[10px] text-[var(--text-secondary)] font-medium mb-1.5">
                {platform === 'whatsapp' ? 'Phone Number' : platform === 'email' ? 'Email Address' : platform === 'website' ? 'Full URL' : 'Username / Handle'}
              </label>
              {isCustom ? (
                <input
                  type="url"
                  name="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="input-field"
                  required
                />
              ) : (
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder={template?.placeholder ?? 'Enter value'}
                  className="input-field"
                  required
                />
              )}
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                {platform === 'whatsapp' && 'Enter number with country code, e.g. 6285890750820'}
                {platform === 'email' && 'Enter full email address'}
                {platform === 'instagram' && 'Enter username without @'}
                {platform === 'linkedin' && 'Enter LinkedIn profile ID (e.g. ramdansuwandi)'}
              </p>
            </div>
          )}

          {/* Preview */}
          {platform && (handle || customUrl) && (
            <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] p-4">
              <p className="text-[10px] text-[var(--text-secondary)] font-medium mb-2">Preview</p>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.03)] flex items-center justify-center text-[var(--electric-blue)]">
                  {platform === 'email' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  )}
                  {platform === 'whatsapp' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  )}
                  {platform === 'instagram' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  )}
                  {platform === 'linkedin' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  )}
                  {platform === 'github' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                  )}
                  {platform === 'website' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  )}
                </span>
                <div>
                  <p className="text-[10px] text-[var(--text-secondary)]">{generatedLabel}</p>
                  <p className="text-sm text-white">{isCustom ? customUrl : displayValue || handle}</p>
                </div>
              </div>
            </div>
          )}

          {/* Active */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={(initialData.is_active as boolean) ?? true}
                className="w-4 h-4 rounded border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)]"
              />
              <span className="text-xs text-[var(--text-secondary)] font-medium">Active</span>
            </label>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              isNew ? 'Add Contact Link' : 'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
