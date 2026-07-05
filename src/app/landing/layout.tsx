'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import InteractiveBackground3D from '@/components/landing/InteractiveBackground3D';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import MobileDisclaimer from '@/components/landing/MobileDisclaimer';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="min-h-screen bg-[var(--dark-bg)] transition-colors duration-300 relative">
      <InteractiveBackground3D />

      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-gradient-to-r from-[var(--electric-blue)] to-[var(--neon-green)] origin-left"
        style={{ scaleX }}
      />

      <div className="relative z-10">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <MobileDisclaimer />
      </div>
    </div>
  );
}
