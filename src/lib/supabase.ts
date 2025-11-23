import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PoolProduct {
  id: string;
  name: string;
  description: string;
  base_price: number;
  size_options: { size: string; price: number }[];
  features: string[];
  image_url: string | null;
  category: string;
  is_featured: boolean;
  display_order: number;
  hide_base_price: boolean;
  created_at: string;
  updated_at: string;
}
