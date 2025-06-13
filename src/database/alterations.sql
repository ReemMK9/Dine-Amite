-- Keep track of modifications on the base schema

-- Add display_name column to app_user
ALTER TABLE app_user
ADD COLUMN display_name VARCHAR(100);