'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { listItems, deleteItem, updateContactField, updateOrderBatch, getHomeSettings, uploadImage, updateResumeUrl } from '@/lib/actions';
import { useToast } from '@/components/admin/Toast';

type Tab = 'links' | 'messages';

const platformMeta: Record<string, { color: string; icon: React.ReactNode }> = {
  whatsapp: {
    color: '#25D366',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  },
  email: {
    color: '#EA4335',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  },
  instagram: {
    color: '#E4405F',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  },
  linkedin: {
    color: '#0A66C2',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  },
  github: {
    color: '#ffffff',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
  },
};

export default function ContactPage() {
  const router = useRouter();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [orderedLinks, setOrderedLinks] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>('links');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetch = useCallback(async () => {
    try {
      const [data, home] = await Promise.all([
        listItems('contact'),
        getHomeSettings(),
      ]);
      setItems(data as Record<string, unknown>[]);
      const links = (data as Record<string, unknown>[]).filter((i) => (i.type as string) === 'social');
      setOrderedLinks(links);
      setResumeUrl(home?.resume_url ?? null);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  // Real-time subscription for new messages
  useEffect(() => {
    const channel = supabase
      .channel('contact-messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contact' },
        (payload) => {
          const newItem = payload.new as Record<string, unknown>;
          if (newItem.type === 'message' || !newItem.type) {
            setItems((prev) => [newItem, ...prev]);
            toast(`New message from ${newItem.name ?? 'Someone'}`, 'info');
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [toast]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await deleteItem('contact', id);
      await fetch();
      router.refresh();
      toast('Item deleted successfully');
    } catch (e) { console.error(e); toast('Failed to delete item', 'error'); }
  };

  const handleToggle = async (id: string, field: string, value: boolean) => {
    try {
      await updateContactField(id, field, value);
      await fetch();
      toast('Message status updated');
    } catch (e) { console.error(e); toast('Failed to update status', 'error'); }
  };

  const moveLink = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedLinks.length) return;
    const reordered = Array.from(orderedLinks);
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setOrderedLinks(reordered);
    setSaving(true);
    try {
      await updateOrderBatch('contact', reordered.map((item, i) => ({ id: item.id as string, order_index: i })));
    } catch (e) {
      console.error(e);
      setOrderedLinks(items.filter((i) => (i.type as string) === 'social'));
    }
    setSaving(false);
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'cv');
      await updateResumeUrl(url);
      setResumeUrl(url);
      e.target.value = '';
    } catch (err) {
      alert('Upload failed');
    }
    setUploading(false);
  };

  const socialLinks = orderedLinks;
  const messages = items.filter((i) => (i.type as string) === 'message' || !i.type);
  const unreadCount = messages.filter((i) => !i.is_read).length;

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Contact</h2>
          {saving && <div className="w-4 h-4 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" />}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-[var(--dark-card)] border border-[var(--glass-border)] p-1 w-fit">
        <button onClick={() => setTab('links')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${tab === 'links' ? 'bg-[var(--electric-blue)]/15 text-[var(--electric-blue)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-white'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          Social Links
        </button>
        <button onClick={() => setTab('messages')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${tab === 'messages' ? 'bg-[var(--electric-blue)]/15 text-[var(--electric-blue)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-white'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Messages
          {unreadCount > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold">{unreadCount}</span>}
        </button>
      </div>

      {/* Social Links Tab */}
      {tab === 'links' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Links List */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--dark-card)] border border-[var(--glass-border)] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">{socialLinks.length} link{socialLinks.length !== 1 ? 's' : ''}</span>
                </div>
                <Link href="/admin/dashboard/contact/new">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-black transition-all hover:shadow-lg" style={{background: 'linear-gradient(135deg, var(--electric-blue), var(--neon-green))'}}>
                    + Add Link
                  </button>
                </Link>
              </div>

              {socialLinks.length === 0 ? (
                <div className="text-center py-16 text-[var(--text-secondary)] text-sm px-5">
                  No social links yet. Click &ldquo;Add Link&rdquo; to create one.
                </div>
              ) : (
                socialLinks.map((item, index) => {
                  const p = (item.platform as string) ?? '';
                  const meta = platformMeta[p.toLowerCase()] ?? { color: 'var(--electric-blue)', icon: null };
                  const isFirst = index === 0;
                  const isLast = index === socialLinks.length - 1;
                  return (
                    <div key={item.id as string} className="border-b border-[var(--glass-border)] last:border-b-0 hover:bg-[rgba(255,255,255,0.03)] transition-colors">
                      <div className="flex items-center gap-3 px-5 py-3.5">
                        <div className="flex flex-col items-center gap-0.5 shrink-0">
                          <button
                            onClick={() => moveLink(index, 'up')}
                            disabled={isFirst || saving}
                            className={`p-0.5 rounded transition-all ${
                              isFirst || saving
                                ? 'text-[var(--glass-border)] cursor-not-allowed'
                                : 'text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] cursor-pointer'
                            }`}
                            title="Move up"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                          </button>
                          <span className="text-[10px] text-[var(--text-secondary)] font-mono leading-none">{index + 1}</span>
                          <button
                            onClick={() => moveLink(index, 'down')}
                            disabled={isLast || saving}
                            className={`p-0.5 rounded transition-all ${
                              isLast || saving
                                ? 'text-[var(--glass-border)] cursor-not-allowed'
                                : 'text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] cursor-pointer'
                            }`}
                            title="Move down"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                          </button>
                        </div>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${meta.color}15`, color: meta.color }}>
                          {meta.icon ?? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white truncate">{item.label as string}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0" style={{ background: `${meta.color}15`, color: meta.color }}>{p}</span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">{item.value as string}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Link href={`/admin/dashboard/contact/${item.id}`}>
                            <button className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white transition-all hover:bg-[var(--electric-blue)]">Edit</button>
                          </Link>
                          <button onClick={() => handleDelete(item.id as string)} className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-red-400 transition-all hover:bg-red-500/15">Delete</button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* CV Upload Card */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--dark-card)] border border-[var(--glass-border)] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[var(--glass-border)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--electric-blue)] shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <h3 className="text-sm font-semibold text-white">Download CV</h3>
              </div>

              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleCvUpload} />

              {resumeUrl ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)]">
                    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium truncate">CV_RAMDANSUWANDI.pdf</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">Uploaded</p>
                    </div>
                    <a href={resumeUrl} target="_blank" className="px-2 py-1 rounded text-[11px] font-medium text-[var(--electric-blue)] hover:bg-[var(--electric-blue)]/10 transition-all">View</a>
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-dashed border-[rgba(255,255,255,0.1)] text-[var(--text-secondary)] hover:text-white hover:border-[rgba(255,255,255,0.2)] transition-all">
                    {uploading ? 'Uploading...' : 'Replace CV'}
                  </button>
                </div>
              ) : (
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="w-full py-10 rounded-xl border-2 border-dashed border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--electric-blue)]/30 hover:bg-[var(--electric-blue)]/5 transition-all flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span className="text-xs">{uploading ? 'Uploading...' : 'Upload CV (PDF)'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {tab === 'messages' && (
        <div className="bg-[var(--dark-card)] border border-[var(--glass-border)] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--glass-border)]">
            <span className="text-xs font-medium text-[var(--text-secondary)]">{messages.length} message{messages.length !== 1 ? 's' : ''}{unreadCount > 0 ? ` · ${unreadCount} unread` : ''}</span>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-secondary)] text-sm px-5">
              No messages yet.
            </div>
          ) : (
            messages.map((item) => (
              <div key={item.id as string} className="border-b border-[var(--glass-border)] last:border-b-0 hover:bg-[rgba(255,255,255,0.03)] transition-colors">
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        item.is_read ? 'bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)]' : 'bg-[var(--electric-blue)]/15 text-[var(--electric-blue)]'
                      }`}>
                        {String((item.name as string)?.[0] ?? '?').toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{item.name as string}</span>
                          {!item.is_read && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--electric-blue)]/20 text-[var(--electric-blue)] font-medium">New</span>}
                          <span className="text-[11px] text-[var(--text-secondary)] ml-auto shrink-0">
                            {item.created_at ? new Date(item.created_at as string).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] truncate">{String(item.email ?? '')}{item.subject ? ` · ${item.subject}` : ''}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 mt-2">{String(item.message ?? '')}</p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--glass-border)]">
                    <Link href={`/admin/dashboard/contact/${item.id}`}>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all hover:bg-[var(--electric-blue)]">View</button>
                    </Link>
                    <button onClick={() => handleToggle(item.id as string, 'is_read', !item.is_read)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${item.is_read ? 'text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.05)]' : 'bg-green-500/15 text-green-400 hover:bg-green-500/25'}`}>
                      {item.is_read ? 'Unread' : 'Read'}
                    </button>
                    <button onClick={() => handleToggle(item.id as string, 'is_replied', !item.is_replied)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${item.is_replied ? 'text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.05)]' : 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25'}`}>
                      {item.is_replied ? 'Unreply' : 'Replied'}
                    </button>
                    <button onClick={() => handleDelete(item.id as string)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all ml-auto">Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
