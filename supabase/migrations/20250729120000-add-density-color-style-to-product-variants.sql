-- Add density, color, and style columns to product_variants
ALTER TABLE public.product_variants
ADD COLUMN density TEXT,
ADD COLUMN color TEXT,
ADD COLUMN style TEXT;
