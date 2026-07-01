'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Skill } from '@/lib/types';
import SectionHeader from '@/components/landing/SectionHeader';
import TiltCard from '@/components/landing/TiltCard';

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('skills').select('*').eq('is_active', true).order('order_index').then(({ data }) => {
      if (data) setSkills(data as Skill[]);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-32"><div className="w-10 h-10 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader title="Skills" subtitle="Technologies and tools I work with" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {skills.map((skill, i) => (
            <TiltCard key={skill.id} className="p-6 text-center" tiltDegree={5} glowSize={200}>
              <div
                className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 bg-[#1a1816] border border-[rgba(200,180,140,0.06)]"
                style={{ transform: 'translateZ(20px)', color: skill.color }}
              >
                {skill.icon_url ? <img src={skill.icon_url} alt={skill.name} className="w-8 h-8" /> : <span>⚡</span>}
              </div>
              <h3 className="text-white font-semibold mb-2" style={{ transform: 'translateZ(10px)' }}>{skill.name}</h3>
              <div className="w-full h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden" style={{ transform: 'translateZ(5px)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.proficiency}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: skill.color }}
                />
              </div>
              <p className="text-xs text-secondary mt-1">{skill.proficiency}%</p>
              {skill.category && <p className="text-xs text-accent mt-1 opacity-70">{skill.category}</p>}
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
