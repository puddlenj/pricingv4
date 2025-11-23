/*
  # Add hide_base_price column to pool_products

  1. Changes
    - Add `hide_base_price` boolean column to `pool_products` table
    - Defaults to false (show base price by default)
    - This allows admin to hide the base price section for specific products like "Additional Services"
  
  2. Notes
    - Non-breaking change - existing products will continue to show base price
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pool_products' AND column_name = 'hide_base_price'
  ) THEN
    ALTER TABLE pool_products ADD COLUMN hide_base_price boolean DEFAULT false;
  END IF;
END $$;