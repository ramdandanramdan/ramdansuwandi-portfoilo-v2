'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import InteractiveBackground3D from '@/components/landing/InteractiveBackground3D';
import { ToastProvider } from '@/components/admin/Toast';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/dashboard/home': 'Home',
  '/admin/dashboard/about': 'About',
  '/admin/dashboard/experience': 'Experience',
  '/admin/dashboard/education': 'Education',
  '/admin/dashboard/projects': 'Projects',
  '/admin/dashboard/skills': 'Skills',
  '/admin/dashboard/organization': 'Organization',
  '/admin/dashboard/achievements': 'Achievements',
  '/admin/dashboard/contact': 'Contact',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAuth(true);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const basePath = '/' + pathname.split('/').slice(1, 3).join('/');
  const pageTitle = pageTitles[basePath] || 'Admin';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--dark-bg)]">
        <div className="w-8 h-8 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-[var(--dark-bg)] flex relative">
      <InteractiveBackground3D />
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <ToastProvider>
        <main className="flex-1 min-h-screen relative z-10 transition-all duration-300 md:ml-[320px]">
          {/* Top bar */}
          <div className="sticky top-0 z-20 backdrop-blur-xl bg-[var(--dark-bg)]/80 border-b border-[var(--glass-border)]">
            <div className="flex items-center justify-between h-14 px-3 md:px-6">
              <div className="flex items-center gap-3 min-w-0">
                {/* Mobile hamburger */}
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="md:hidden p-2 -ml-1 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  aria-label="Open sidebar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
                <div className="min-w-0">
                  <h1 className="text-sm font-semibold text-white truncate">{pageTitle}</h1>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 capitalize truncate">
                    {basePath === '/admin/dashboard' ? 'Overview' : 'Manage your content'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="/landing"
                  target="_blank"
                  className="text-[11px] text-[var(--text-secondary)] hover:text-[var(--electric-blue)] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--glass-border)] hover:border-[var(--electric-blue)]/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  View Site
                </a>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 md:p-6">
            {children}
          </div>
        </main>
      </ToastProvider>
    </div>
  );
}
