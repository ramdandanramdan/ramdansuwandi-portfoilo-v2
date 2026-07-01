-- ============================================
-- Portfolio CMS Database Schema for Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. HOME TABLE
CREATE TABLE IF NOT EXISTS home (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  image_url TEXT,
  resume_url TEXT,
  social_links JSONB DEFAULT '[]'::jsonb,
  tagline VARCHAR(500),
  services JSONB DEFAULT '[]'::jsonb,
  stats JSONB DEFAULT '[]'::jsonb,
  location VARCHAR(255),
  is_available BOOLEAN DEFAULT true,
  work_portfolio JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ABOUT TABLE
CREATE TABLE IF NOT EXISTS about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  milestones JSONB DEFAULT '[]'::jsonb,
  skills_summary TEXT,
  work_portfolio JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  start_date DATE,
  end_date DATE,
  description TEXT,
  type VARCHAR(50) DEFAULT 'work',
  images JSONB DEFAULT '[]'::jsonb,
  documents JSONB DEFAULT '[]'::jsonb,
  work_portfolio JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  link TEXT,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  category VARCHAR(100),
  work_portfolio JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  proficiency INT DEFAULT 0,
  icon_url TEXT,
  color VARCHAR(50) DEFAULT '#00d4ff',
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORGANIZATION TABLE
CREATE TABLE IF NOT EXISTS organization (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  website_url TEXT,
  work_portfolio JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE,
  issuer VARCHAR(255),
  image_url TEXT,
  certificate_url TEXT,
  certificate_external_url TEXT,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school VARCHAR(255) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255),
  location VARCHAR(255),
  start_date DATE,
  end_date DATE,
  description TEXT,
  grade VARCHAR(100),
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  certificate_url TEXT,
  work_portfolio JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CONTACT TABLE (social links + messages from visitors)
CREATE TABLE IF NOT EXISTS contact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) DEFAULT 'message',
  -- social link fields
  platform VARCHAR(50),
  label VARCHAR(255),
  value VARCHAR(255),
  url TEXT,
  icon VARCHAR(100),
  -- message fields
  name VARCHAR(255),
  email VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  is_replied BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage bucket for image uploads
-- Create via Supabase Dashboard: Storage → Create bucket → Name: portfolio-images, Public bucket
-- Or run: supabase storage create portfolio-images --public
-- The bucket is auto-created on first upload via the server action.

-- 9. VISITORS TABLE (for statistics)
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_visited VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
DO $$
DECLARE
  tables TEXT[] := ARRAY['home', 'about', 'experience', 'projects', 'skills', 'organization', 'achievements', 'education', 'contact'];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%s_updated_at ON %I;
      CREATE TRIGGER update_%s_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END;
$$;

-- Enable Row Level Security
ALTER TABLE home ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DO $$
DECLARE
  tables TEXT[] := ARRAY['home', 'about', 'experience', 'projects', 'skills', 'organization', 'achievements', 'education', 'contact'];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS "Public can view active %s" ON %I;
      CREATE POLICY "Public can view active %s" ON %I
        FOR SELECT
        USING (is_active = true);
    ', t, t, t, t);
  END LOOP;
END;
$$;

-- Create policies for authenticated users (admin) full access
DO $$
DECLARE
  tables TEXT[] := ARRAY['home', 'about', 'experience', 'projects', 'skills', 'organization', 'achievements', 'education', 'contact', 'visitors'];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS "Admin can manage %s" ON %I;
      CREATE POLICY "Admin can manage %s" ON %I
        FOR ALL
        USING (auth.role() = ''authenticated'')
        WITH CHECK (auth.role() = ''authenticated'');
    ', t, t, t, t);
  END LOOP;
END;
$$;

-- Insert sample data
INSERT INTO home (title, subtitle, description, order_index) VALUES
('Ramdan Suwandi', 'Full Stack Web Developer', 'Building modern web experiences with cutting-edge technology. Passionate about creating elegant, performant, and accessible applications.', 0)
ON CONFLICT DO NOTHING;

INSERT INTO about (title, description, order_index) VALUES
('About Me', 'I am a passionate full-stack web developer with expertise in modern web technologies. I love turning complex problems into simple, beautiful, and intuitive solutions.', 0)
ON CONFLICT DO NOTHING;

INSERT INTO skills (name, category, proficiency, color, order_index) VALUES
('Next.js', 'Frontend', 90, '#00d4ff', 0),
('React', 'Frontend', 92, '#00d4ff', 1),
('TypeScript', 'Language', 88, '#007acc', 2),
('Node.js', 'Backend', 85, '#00d4ff', 3),
('Supabase', 'Backend', 80, '#00d4ff', 4),
('Tailwind CSS', 'Frontend', 90, '#00d4ff', 5),
('PostgreSQL', 'Database', 78, '#007acc', 6),
('Prisma', 'Database', 75, '#00d4ff', 7)
ON CONFLICT DO NOTHING;

INSERT INTO experience (title, company, position, description, type, order_index) VALUES
('Frontend Developer', 'Tech Company', 'Frontend Developer', 'Developed and maintained modern web applications using React and Next.js.', 'work', 0),
('Full Stack Developer', 'Startup Inc.', 'Full Stack Developer', 'Built end-to-end solutions for various client projects.', 'work', 1)
ON CONFLICT DO NOTHING;

INSERT INTO education (school, degree, field_of_study, start_date, end_date, grade, description, order_index) VALUES
('SMK Bhakti Persada', 'High School Diploma – TKJ', null, '2018-09-01', '2021-03-31', '83.25/100.00', 'Teknologi Komputer & Jaringan (TKJ)', 0),
('Universitas Krisnadwipayana (UNKRIS)', 'Bachelor of Teknik Informatika', null, '2021-04-01', '2026-02-28', '3.36/4.00', null, 1)
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description, tech_stack, featured, order_index) VALUES
('Portfolio Website', 'A modern portfolio built with Next.js, Tailwind CSS, and Framer Motion.', '["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"]', true, 0),
('E-Commerce Platform', 'Full-featured e-commerce platform with payment integration.', '["React", "Node.js", "PostgreSQL", "Stripe"]', true, 1)
ON CONFLICT DO NOTHING;

INSERT INTO organization (name, role, description, order_index) VALUES
('Developer Community', 'Lead Organizer', 'Organizing tech meetups and workshops for developers.', 0),
('Open Source Project', 'Contributor', 'Contributing to various open source projects.', 1)
ON CONFLICT DO NOTHING;

INSERT INTO achievements (title, description, category, order_index) VALUES
('Best Developer Award', 'Awarded for outstanding performance in web development.', 'Award', 0),
('Hackathon Winner', 'First place in a 48-hour hackathon competition.', 'Competition', 1)
ON CONFLICT DO NOTHING;
