'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/components/landing/ThemeProvider';

const icons: Record<string, React.ReactNode> = {
  Dashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Home: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  About: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Experience: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  Education: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
  ),
  Projects: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
  ),
  Skills: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  Organization: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Achievements: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
  ),
  Contact: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
};

const menuItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Home', href: '/admin/dashboard/home' },
  { label: 'About', href: '/admin/dashboard/about' },
  { label: 'Experience', href: '/admin/dashboard/experience' },
  { label: 'Education', href: '/admin/dashboard/education' },
  { label: 'Projects', href: '/admin/dashboard/projects' },
  { label: 'Skills', href: '/admin/dashboard/skills' },
  { label: 'Organization', href: '/admin/dashboard/organization' },
  { label: 'Achievements', href: '/admin/dashboard/achievements' },
  { label: 'Contact', href: '/admin/dashboard/contact' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { theme, cycle, label } = useTheme();

  useEffect(() => {
    supabase.from('contact').select('id', { count: 'exact', head: true }).or('type.eq.message,type.is.null').eq('is_read', false).then(({ count }) => {
      if (count !== null) setUnreadCount(count);
    });

    const channel = supabase
      .channel('sidebar-messages')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'contact', filter: 'type=eq.message' },
        () => {
          supabase.from('contact').select('id', { count: 'exact', head: true }).or('type.eq.message,type.is.null').eq('is_read', false).then(({ count }) => {
            if (count !== null) setUnreadCount(count);
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  return (
    <aside
      className="h-screen fixed left-0 top-0 z-50 flex flex-col transition-all duration-500 bg-[var(--dark-card)] border-r border-[var(--glass-border)] group/sidebar"
      style={{ width: collapsed ? 60 : 240 }}
    >
      {/* Header */}
      <div className={`relative flex items-center gap-3 px-4 h-14 border-b border-[var(--glass-border)] overflow-hidden ${collapsed ? 'justify-center' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--electric-blue)]/5 via-transparent to-[var(--neon-green)]/5 animate-[gradient-shift_6s_ease_infinite] bg-[length:200%_100%]" />
        {!collapsed && (
          <>
            <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--electric-blue)] to-[var(--neon-green)] flex items-center justify-center text-black text-[10px] font-bold shrink-0 shadow-[0_0_10px_color-mix(in_srgb,var(--electric-blue),transparent_60%)]">
              R
            </div>
            <span className="relative text-sm font-semibold text-white tracking-wide">Ramdan</span>
          </>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`relative text-[var(--text-secondary)] hover:text-white transition-colors p-1 ${collapsed ? '' : 'ml-auto'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed ? (
              <><polyline points="9 18 15 12 9 6" /></>
            ) : (
              <><polyline points="15 18 9 12 15 6" /></>
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm group/item transition-all duration-300 ${
                  isActive
                    ? 'text-[var(--electric-blue)]'
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
                } ${collapsed ? 'justify-center' : ''}`}
                style={isActive ? {
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--electric-blue) 12%, transparent), color-mix(in srgb, var(--electric-blue) 4%, transparent))',
                  animation: 'sidebar-glow 4s ease-in-out infinite',
                } : {}}
              >
                {isActive && (
                  <>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-[var(--electric-blue)] animate-[sidebar-indicator_3s_ease-in-out_infinite]" style={{boxShadow: '0 0 8px var(--electric-blue)'}} />
                    <div className="absolute inset-0 rounded-lg border border-[var(--electric-blue)]/15" />
                  </>
                )}
                <span className={`relative z-[1] ${isActive ? 'animate-[sidebar-icon-glow_4s_ease-in-out_infinite]' : 'group-hover/item:scale-110'} transition-transform duration-300`}>
                  {icons[item.label]}
                </span>
                {!collapsed && (
                  <span className="relative z-[1] text-xs font-medium tracking-wide flex-1">{item.label}</span>
                )}
                {!collapsed && item.label === 'Contact' && unreadCount > 0 && (
                  <span className="relative z-[1] text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold leading-none">{unreadCount}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-[var(--glass-border)] space-y-1">
        <button
          onClick={cycle}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full text-xs ${
            collapsed ? 'justify-center' : ''
          } text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.04)] group/theme`}
        >
          <span className="transition-transform duration-300 group-hover/theme:rotate-12">
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            )}
          </span>
          {!collapsed && <span className="flex-1 text-left">{label}</span>}
        </button>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full text-xs ${
            collapsed ? 'justify-center' : ''
          } text-red-400/80 hover:text-red-400 hover:bg-red-500/10 group/logout`}
        >
          <span className="transition-transform duration-300 group-hover/logout:translate-x-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
