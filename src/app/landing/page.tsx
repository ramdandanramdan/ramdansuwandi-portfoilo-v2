'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Home } from '@/lib/types';
import HeroSection from '@/components/landing/HeroSection';

export default function LandingPage() {
  const [home, setHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHome = async () => {
      const { data } = await supabase
        .from('home')
        .select('*')
        .eq('is_active', true)
        .order('order_index')
        .limit(1);

      if (data && data.length > 0) setHome(data[0] as Home);
      setLoading(false);
    };

    fetchHome();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-10 h-10 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!home) return null;
  return <HeroSection home={home} />;
}
