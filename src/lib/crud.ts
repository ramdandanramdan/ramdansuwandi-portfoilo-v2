'use server';

import { supabaseAdmin } from './supabase-admin';

export async function getDashboardStats() {
  const tables = ['home', 'about', 'experience', 'projects', 'skills', 'organization', 'achievements', 'contact'] as const;
  const stats: Record<string, number> = {};

  for (const table of tables) {
    const { count, error } = await supabaseAdmin
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (!error) stats[table] = count || 0;
  }

  const today = new Date().toISOString().split('T')[0];
  const { count: todayVisitors, error: visitorError } = await supabaseAdmin
    .from('visitors')
    .select('*', { count: 'exact', head: true })
    .gte('visited_at', today);

  const { count: totalVisitors } = await supabaseAdmin
    .from('visitors')
    .select('*', { count: 'exact', head: true });

  return {
    ...stats,
    total: Object.values(stats).reduce((a, b) => a + b, 0),
    today_visitors: visitorError ? 0 : (todayVisitors || 0),
    total_visitors: totalVisitors || 0,
  } as Record<string, number>;
}

export interface VisitorDay {
  date: string;
  count: number;
}

export interface PageView {
  page: string;
  count: number;
}

export interface SkillCategory {
  category: string;
  count: number;
}

export interface MessageDay {
  date: string;
  count: number;
}

export interface DashboardAnalytics {
  stats: Record<string, number>;
  visitorDays: VisitorDay[];
  pageViews: PageView[];
  skillCategories: SkillCategory[];
  messageDays: MessageDay[];
  recentMessages: Record<string, unknown>[];
  unreadMessages: number;
  totalMessages: number;
}

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const stats = await getDashboardStats();

  // Visitors per day (last 14 days)
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
  const { data: visitorData } = await supabaseAdmin
    .from('visitors')
    .select('visited_at, page_visited')
    .gte('visited_at', fourteenDaysAgo.toISOString().split('T')[0])
    .order('visited_at', { ascending: true });

  // Aggregate visitors by day
  const dayMap = new Map<string, number>();
  const pageMap = new Map<string, number>();
  (visitorData || []).forEach((v) => {
    const day = v.visited_at?.split('T')[0];
    if (day) dayMap.set(day, (dayMap.get(day) || 0) + 1);
    const page = v.page_visited || 'unknown';
    pageMap.set(page, (pageMap.get(page) || 0) + 1);
  });

  const visitorDays: VisitorDay[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    visitorDays.push({ date: key, count: dayMap.get(key) || 0 });
  }

  const pageViews: PageView[] = Array.from(pageMap.entries())
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Skills by category
  const { data: skillsData } = await supabaseAdmin
    .from('skills')
    .select('category');

  const skillMap = new Map<string, number>();
  (skillsData || []).forEach((s) => {
    const cat = s.category || 'Uncategorized';
    skillMap.set(cat, (skillMap.get(cat) || 0) + 1);
  });
  const skillCategories: SkillCategory[] = Array.from(skillMap.entries())
    .map(([category, count]) => ({ category, count }));

  // Messages per day (last 14 days)
  const { data: msgData } = await supabaseAdmin
    .from('contact')
    .select('created_at')
    .gte('created_at', fourteenDaysAgo.toISOString().split('T')[0])
    .or('type.eq.message,type.is.null');

  const msgDayMap = new Map<string, number>();
  (msgData || []).forEach((m) => {
    const day = m.created_at?.split('T')[0];
    if (day) msgDayMap.set(day, (msgDayMap.get(day) || 0) + 1);
  });
  const messageDays: MessageDay[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    messageDays.push({ date: key, count: msgDayMap.get(key) || 0 });
  }

  // Recent messages
  const { data: recentMessages } = await supabaseAdmin
    .from('contact')
    .select('*')
    .or('type.eq.message,type.is.null')
    .order('created_at', { ascending: false })
    .limit(5);

  const unreadCount = (recentMessages || []).filter((m) => !m.is_read).length;

  return {
    stats,
    visitorDays,
    pageViews,
    skillCategories,
    messageDays,
    recentMessages: recentMessages || [],
    unreadMessages: unreadCount,
    totalMessages: stats.contact || 0,
  };
}
