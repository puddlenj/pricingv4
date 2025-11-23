/*
  # Allow public updates to pool products

  1. Changes
    - Drop existing update policy
    - Create new update policy that allows public access
  
  2. Security Note
    - This allows anyone to edit products without authentication
    - Suitable for demo/testing purposes only
*/

DROP POLICY IF EXISTS "Authenticated users can update pool products" ON pool_products;

CREATE POLICY "Anyone can update pool products"
  ON pool_products
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
