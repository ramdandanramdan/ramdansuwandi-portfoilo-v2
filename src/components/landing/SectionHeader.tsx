'use client';

import { motion } from 'framer-motion';
import GlitchText from './GlitchText';

export default function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-4"
    >
      <GlitchText as="h2" className="text-3xl md:text-4xl font-bold text-gradient mb-3">
        {title}
      </GlitchText>
      {subtitle && <p className="text-[var(--text-secondary)] text-sm md:text-lg">{subtitle}</p>}
    </motion.div>
  );
}
