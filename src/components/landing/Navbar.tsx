'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

const links = [
  { label: 'Home', href: '/landing' },
  { label: 'About', href: '/landing/about' },
  { label: 'Skills', href: '/landing/skills' },
  { label: 'Education', href: '/landing/education' },
  { label: 'Experience', href: '/landing/experience' },
  { label: 'Projects', href: '/landing/projects' },
  { label: 'Organization', href: '/landing/organization' },
  { label: 'Achievements', href: '/landing/achievements' },
  { label: 'Contact', href: '/landing/contact' },
];

const themeIcons: Record<string, React.ReactNode> = {
  dark: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  sore: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0" />
      <line x1="12" y1="9" x2="12" y2="5" />
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
      <line x1="1" y1="18" x2="3" y2="18" />
      <line x1="21" y1="18" x2="23" y2="18" />
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
      <path d="M8 20a2 2 0 0 0 8 0" />
    </svg>
  ),
};

const menuVariants = {
  closed: { x: '100%', transition: { type: 'spring' as const, damping: 30, stiffness: 300 } },
  open: { x: 0, transition: { type: 'spring' as const, damping: 30, stiffness: 300 } },
};

const itemVariants = {
  closed: { opacity: 0, x: 40 },
  open: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.04, type: 'spring' as const, damping: 25, stiffness: 250 },
  }),
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, cycle, label } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'glass border-b border-[var(--glass-border)]' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <Link href="/landing" className="text-lg md:text-xl font-bold text-gradient">
            Portfolio
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-all duration-200 relative ${
                    isActive
                      ? 'text-[var(--electric-blue)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[var(--electric-blue)]"
                    />
                  )}
                </Link>
              );
            })}
            <button
              onClick={cycle}
              className="p-2 rounded-xl glass hover:border-[var(--electric-blue)] transition-all text-[var(--text-secondary)] hover:text-[var(--electric-blue)] relative group"
              title={`Theme: ${label}`}
            >
              {themeIcons[theme]}
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{label}</span>
            </button>
            <Link
              href="/admin/login"
              className="text-sm px-4 py-1.5 rounded-lg bg-[rgba(201,151,74,0.12)] text-[var(--electric-blue)] border border-[rgba(201,151,74,0.25)] hover:bg-[rgba(201,151,74,0.2)] transition-all"
            >
              Admin
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={cycle}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--electric-blue)] transition-colors"
              title={`Theme: ${label}`}
            >
              {themeIcons[theme]}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute right-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-[var(--dark-card)] border-l border-[var(--glass-border)] flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--glass-border)]">
                <span className="text-sm font-semibold text-white">Menu</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto py-3 px-3">
                {links.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      custom={i}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-0.5 text-sm font-medium transition-all ${
                          isActive
                            ? 'text-[var(--electric-blue)] bg-[var(--electric-blue)]/8 border border-[var(--electric-blue)]/12'
                            : 'text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Drawer footer */}
              <div className="p-3 border-t border-[var(--glass-border)] space-y-1.5">
                <Link
                  href="/admin/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Admin Panel
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
