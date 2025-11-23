/*
  # Add Update Policies for Pool Pricing Tables

  1. Changes
    - Add INSERT policy for authenticated users on pool_products
    - Add UPDATE policy for authenticated users on pool_products
    - Add DELETE policy for authenticated users on pool_products

  2. Security
    - Only authenticated users can modify data
    - Public users can still view all data
*/

-- Pool Products policies
CREATE POLICY "Authenticated users can insert pool products"
  ON pool_products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pool products"
  ON pool_products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete pool products"
  ON pool_products
  FOR DELETE
  TO authenticated
  USING (true);