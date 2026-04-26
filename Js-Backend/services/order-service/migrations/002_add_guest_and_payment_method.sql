-- Add guest_id and payment_method columns to orders table
-- Migration Script

-- Add guest_id column (nullable, for guest checkout support)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS guest_id VARCHAR(255);

-- Add payment_method column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

-- Make user_id nullable (since guest orders won't have user_id)
ALTER TABLE orders 
ALTER COLUMN user_id DROP NOT NULL;

-- Add index for guest_id
CREATE INDEX IF NOT EXISTS idx_orders_guest_id ON orders(guest_id);

-- Add constraint to ensure either user_id or guest_id is present
ALTER TABLE orders 
ADD CONSTRAINT check_user_or_guest 
CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL);

-- Made with Bob