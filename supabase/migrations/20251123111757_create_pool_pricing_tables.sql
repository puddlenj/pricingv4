/*
  # Create Pool Pricing Tables

  1. New Tables
    - `pool_products`
      - `id` (uuid, primary key) - Unique identifier for each pool product
      - `name` (text) - Name of the pool product (e.g., "Standard Inground Pool")
      - `description` (text) - Detailed description of the pool product
      - `base_price` (numeric) - Starting price for the pool
      - `size_options` (jsonb) - Available size options with pricing
      - `features` (text[]) - Array of included features
      - `image_url` (text) - URL to product image
      - `category` (text) - Category (e.g., "Inground", "Above Ground", "Maintenance")
      - `is_featured` (boolean) - Whether to feature this product prominently
      - `display_order` (integer) - Order for displaying products
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `pool_products` table
    - Add policy for public read access (pricing is public information)
    - No insert/update/delete policies needed (managed by franchise owner only)
*/

CREATE TABLE IF NOT EXISTS pool_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  base_price numeric NOT NULL CHECK (base_price >= 0),
  size_options jsonb DEFAULT '[]'::jsonb,
  features text[] DEFAULT ARRAY[]::text[],
  image_url text,
  category text NOT NULL DEFAULT 'Inground',
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pool_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pool products"
  ON pool_products
  FOR SELECT
  USING (true);