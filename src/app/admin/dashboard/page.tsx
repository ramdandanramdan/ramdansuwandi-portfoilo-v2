'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import StatsCard from '@/components/admin/StatsCard';
import VisitorsLineChart from '@/components/admin/charts/VisitorsLineChart';
import PageViewsBarChart from '@/components/admin/charts/PageViewsBarChart';
import MessagesAreaChart from '@/components/admin/charts/MessagesAreaChart';
import SkillsPieChart from '@/components/admin/charts/SkillsPieChart';
import { getDashboardAnalytics, type DashboardAnalytics } from '@/lib/crud';

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-2px)`,
      boxShadow: `${x * 12}px ${y * 12}px 30px rgba(0,0,0,0.3)`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, transition: 'transform 0.12s ease-out, box-shadow 0.12s ease-out' }}
      className={className}
    >
      {children}
    </div>
  );
}

const iconMap: Record<string, React.ReactNode> = {
  home: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  experience: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  projects: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  skills: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  organization: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  achievements: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  contact: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

const iconSvgs: Record<string, React.ReactNode> = {
  content: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  visitors: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  messages: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  unread: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const result = await getDashboardAnalytics();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { stats, visitorDays, pageViews, skillCategories, messageDays, recentMessages, unreadMessages, totalMessages } = data;
  const colors = ['var(--electric-blue)', 'var(--neon-green)', '#ff6b6b', '#ffd93d', '#6c5ce7', '#fd79a8', '#fdcb6e', '#00cec9'];
  const labels: Record<string, string> = { home: 'Home', experience: 'Experiences', projects: 'Projects', skills: 'Skills', organization: 'Organizations', achievements: 'Achievements', contact: 'Messages' };

  return (
    <div className="space-y-6">
      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Content', value: stats.total ?? 0, color: 'var(--electric-blue)', href: '' },
          { label: 'Total Visitors', value: stats.total_visitors ?? 0, color: '#0984e3', href: '' },
          { label: 'Messages', value: totalMessages, color: '#00cec9', href: '/admin/dashboard/contact' },
          { label: 'Unread', value: unreadMessages, color: '#e17055', href: '/admin/dashboard/contact' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <TiltCard>
              <Link href={card.href || '#'} className={card.href ? '' : 'pointer-events-none'}>
                <div className="bg-[var(--dark-card)] border border-[var(--glass-border)] rounded-xl p-5 transition-all duration-300 hover:border-[rgba(255,255,255,0.12)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-medium text-[var(--text-secondary)] uppercase tracking-wider">{card.label}</span>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${card.color}15`, color: card.color }}>
                      {iconSvgs[['content','visitors','messages','unread'][i]]}
                    </div>
                  </div>
                  <p className="text-3xl font-bold tabular-nums" style={{ color: card.color }}>{card.value.toLocaleString()}</p>
                  {i === 1 && (
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                      <span style={{ color: '#e17055' }}>+{stats.today_visitors ?? 0}</span> today
                    </p>
                  )}
                </div>
              </Link>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      {/* Content Overview Cards - Full Width Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">Content Overview</h2>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">All sections at a glance</p>
          </div>
          <Link href="/admin/dashboard/home" className="text-[11px] text-[var(--electric-blue)] hover:underline transition-opacity">Manage All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(iconMap).map(([key, icon], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.04 }}
            >
              <TiltCard>
                <Link href={`/admin/dashboard/${key}`}>
                  <div className="bg-[var(--dark-card)] border border-[var(--glass-border)] rounded-xl p-5 transition-all duration-300 hover:border-[rgba(255,255,255,0.12)]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${colors[i % colors.length]}18`, color: colors[i % colors.length] }}>
                        {icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{labels[key] || key}</p>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-lg font-bold tabular-nums" style={{ color: colors[i % colors.length] }}>
                            {stats[key] ?? 0}
                          </span>
                          <span className="text-[11px] text-[var(--text-secondary)]">items</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-2"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">Analytics</h2>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Visitor &amp; engagement insights</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          {/* Visitors Chart */}
          <div className="bg-[var(--dark-card)] border border-[var(--glass-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-semibold text-white tracking-wide">Visitors (14 days)</h3>
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Daily unique visits</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--electric-blue)]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--electric-blue)]" />
                <span className="text-[10px] text-[var(--electric-blue)] font-medium">
                  {visitorDays.reduce((a, b) => a + b.count, 0)} total
                </span>
              </div>
            </div>
            <VisitorsLineChart data={visitorDays} />
          </div>

          {/* Page Views */}
          <div className="bg-[var(--dark-card)] border border-[var(--glass-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-semibold text-white tracking-wide">Page Views</h3>
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Most visited pages</p>
              </div>
            </div>
            {pageViews.length === 0 ? (
              <div className="flex items-center justify-center h-[250px] text-[var(--text-secondary)] text-xs">No data yet</div>
            ) : (
              <PageViewsBarChart data={pageViews} />
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Messages Chart */}
          <div className="bg-[var(--dark-card)] border border-[var(--glass-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-semibold text-white tracking-wide">Messages (14 days)</h3>
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Incoming messages over time</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--neon-green)]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)]" />
                <span className="text-[10px] text-[var(--neon-green)] font-medium">
                  {messageDays.reduce((a, b) => a + b.count, 0)} total
                </span>
              </div>
            </div>
            <MessagesAreaChart data={messageDays} />
          </div>

          {/* Skills Distribution */}
          <div className="bg-[var(--dark-card)] border border-[var(--glass-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-semibold text-white tracking-wide">Skills by Category</h3>
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Distribution across categories</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#6c5ce7]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6c5ce7]" />
                <span className="text-[10px] text-[#6c5ce7] font-medium">
                  {skillCategories.reduce((a, b) => a + b.count, 0)} skills
                </span>
              </div>
            </div>
            <SkillsPieChart data={skillCategories} />
            {skillCategories.length > 0 && (
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 pt-3 border-t border-[var(--glass-border)]">
                {skillCategories.map((s, i) => (
                  <div key={s.category} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: colors[i % colors.length] }} />
                    <span className="text-[10px] text-[var(--text-secondary)]">{s.category} ({s.count})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Recent Messages */}
      {recentMessages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--dark-card)] border border-[var(--glass-border)] rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--glass-border)]">
            <div>
              <h3 className="text-xs font-semibold text-white tracking-wide">Recent Messages</h3>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Latest {recentMessages.length} messages</p>
            </div>
            <Link href="/admin/dashboard/contact">
              <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-black transition-all" style={{ background: 'linear-gradient(135deg, var(--electric-blue), var(--neon-green))' }}>
                View All
              </button>
            </Link>
          </div>
          <div className="divide-y divide-[var(--glass-border)]">
            {recentMessages.map((msg) => (
              <Link key={msg.id as string} href={`/admin/dashboard/contact/${msg.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${msg.is_read ? 'bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)]' : 'bg-[var(--electric-blue)]/15 text-[var(--electric-blue)]'}`}>
                  {String((msg.name as string)?.[0] ?? '?').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white">{msg.name as string}</span>
                    {!msg.is_read && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--electric-blue)]/20 text-[var(--electric-blue)] font-medium">New</span>}
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] truncate">{String(msg.message ?? '').slice(0, 80)}</p>
                </div>
                <span className="text-[10px] text-[var(--text-secondary)] shrink-0">
                  {msg.created_at ? new Date(msg.created_at as string).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : ''}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
