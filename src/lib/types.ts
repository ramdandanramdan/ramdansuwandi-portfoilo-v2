export interface Home {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  resume_url: string | null;
  social_links: SocialLink[];
  tagline: string | null;
  services: string[];
  stats: StatItem[];
  location: string | null;
  is_available: boolean;
  work_portfolio: { title: string; description: string }[];
  achievements: { title: string; description: string }[];
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface About {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  milestones: Milestone[];
  skills_summary: string | null;
  work_portfolio: { title: string; description: string }[];
  achievements: { title: string; description: string }[];
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  images: string[];
  documents: string[];
  work_portfolio: { title: string; description: string }[];
  achievements: { title: string; description: string }[];
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  type?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  images: string[];
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  link: string | null;
  featured: boolean;
  category: string | null;
  work_portfolio: { title: string; description: string }[];
  achievements: { title: string; description: string }[];
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
  proficiency: number;
  icon_url: string | null;
  color: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  role: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  image_url: string | null;
  images: string[];
  website_url: string | null;
  work_portfolio: { title: string; description: string }[];
  achievements: { title: string; description: string }[];
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  issuer: string | null;
  image_url: string | null;
  images: string[];
  certificate_url: string | null;
  certificate_external_url: string | null;
  category: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field_of_study: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  grade: string | null;
  image_url: string | null;
  images: string[];
  certificate_url: string | null;
  work_portfolio: { title: string; description: string }[];
  achievements: { title: string; description: string }[];
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  type: 'social' | 'message';
  // social link fields
  platform: string | null;
  label: string | null;
  value: string | null;
  url: string | null;
  icon: string | null;
  // message fields
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  is_read: boolean;
  is_replied: boolean;
  // common
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Visitor {
  id: string;
  page_visited: string | null;
  ip_address: string | null;
  user_agent: string | null;
  visited_at: string;
}

export type SectionName = 'home' | 'about' | 'experience' | 'education' | 'projects' | 'skills' | 'organization' | 'achievements' | 'contact';
