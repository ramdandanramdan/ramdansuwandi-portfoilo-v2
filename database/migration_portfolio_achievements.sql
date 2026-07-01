-- ============================================
-- Migration: Add work_portfolio & achievements JSONB columns to all content tables
-- Run this AFTER schema.sql has been applied
-- ============================================

-- Home
ALTER TABLE home ADD COLUMN IF NOT EXISTS work_portfolio JSONB DEFAULT '[]'::jsonb;
ALTER TABLE home ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;

-- About
ALTER TABLE about ADD COLUMN IF NOT EXISTS work_portfolio JSONB DEFAULT '[]'::jsonb;
ALTER TABLE about ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;

-- Projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS work_portfolio JSONB DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;

-- Organization
ALTER TABLE organization ADD COLUMN IF NOT EXISTS work_portfolio JSONB DEFAULT '[]'::jsonb;
ALTER TABLE organization ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;

-- Education (if not already added)
ALTER TABLE education ADD COLUMN IF NOT EXISTS work_portfolio JSONB DEFAULT '[]'::jsonb;
ALTER TABLE education ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;

-- ============================================
-- Migration: Add documents JSONB to experience table
-- ============================================
ALTER TABLE experience ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- ============================================
-- Migration: Add missing columns to projects table
-- ============================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS link TEXT;
