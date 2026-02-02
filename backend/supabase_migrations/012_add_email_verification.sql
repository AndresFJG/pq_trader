-- Add is_email_verified column to users table
-- This migration adds email verification support

-- Add the column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT false;

-- Update existing users to be verified (backward compatibility)
UPDATE users 
SET is_email_verified = true 
WHERE is_email_verified IS NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(is_email_verified);

-- Comment on column
COMMENT ON COLUMN users.is_email_verified IS 'Indicates if the user has verified their email address';
