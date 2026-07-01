-- ============================================
-- Migration: Move education data from experience table to education table
-- Run this AFTER the education table has been created (via schema.sql)
-- ============================================

-- Move education-type experiences to the education table
INSERT INTO education (id, school, degree, field_of_study, location, start_date, end_date, description, grade, images, is_active, order_index, created_at, updated_at)
SELECT
  id,
  company AS school,
  title AS degree,
  position AS field_of_study,
  location,
  start_date,
  end_date,
  description,
  NULL AS grade,
  images,
  is_active,
  order_index,
  created_at,
  updated_at
FROM experience
WHERE type = 'education';

-- Delete the moved records from experience table
DELETE FROM experience WHERE type = 'education';

-- Update existing work experiences to remove the type field dependency
-- (type column remains for future use but defaults to 'work')

-- Add image_url column to education table for thumbnail
ALTER TABLE education ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add certificate_url column for diploma/ijazah PDF
ALTER TABLE education ADD COLUMN IF NOT EXISTS certificate_url TEXT;

-- Add work_portfolio and achievements JSONB columns (same as experience table)
ALTER TABLE education ADD COLUMN IF NOT EXISTS work_portfolio JSONB DEFAULT '[]'::jsonb;
ALTER TABLE education ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;
