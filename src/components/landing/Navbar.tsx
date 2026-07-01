'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, cycle, label } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass border-b border-[var(--glass-border)]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/landing" className="text-xl font-bold text-gradient">
          Portfolio
        </Link>

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
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {label}
            </span>
          </button>

          <Link
            href="/admin/login"
            className="text-sm px-4 py-1.5 rounded-lg bg-[rgba(201,151,74,0.12)] text-[var(--electric-blue)] border border-[rgba(201,151,74,0.25)] hover:bg-[rgba(201,151,74,0.2)] transition-all"
          >
            Admin
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
