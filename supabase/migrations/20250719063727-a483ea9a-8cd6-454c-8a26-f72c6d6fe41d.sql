-- Create admin roles table
CREATE TABLE public.admin_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for admin roles (only admins can manage admin roles)
CREATE POLICY "Only admins can view admin roles" 
ON public.admin_roles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

CREATE POLICY "Only admins can insert admin roles" 
ON public.admin_roles 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

CREATE POLICY "Only admins can update admin roles" 
ON public.admin_roles 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  has_video BOOLEAN DEFAULT false,
  video_length TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read, admin write)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

CREATE POLICY "Only admins can update products" 
ON public.products 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

CREATE POLICY "Only admins can delete products" 
ON public.products 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

-- Create product images table
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Create policies for product images
CREATE POLICY "Product images are viewable by everyone" 
ON public.product_images 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert product images" 
ON public.product_images 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

CREATE POLICY "Only admins can update product images" 
ON public.product_images 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

CREATE POLICY "Only admins can delete product images" 
ON public.product_images 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

-- Create product variants table
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  lace_size TEXT NOT NULL,
  inch_size TEXT NOT NULL,
  price INTEGER NOT NULL, -- Price in cents to avoid decimal issues
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for product variants
CREATE POLICY "Product variants are viewable by everyone" 
ON public.product_variants 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert product variants" 
ON public.product_variants 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

CREATE POLICY "Only admins can update product variants" 
ON public.product_variants 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

CREATE POLICY "Only admins can delete product variants" 
ON public.product_variants 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.admin_roles 
  WHERE user_id = auth.uid() AND is_admin = true
));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_admin_roles_updated_at
  BEFORE UPDATE ON public.admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE admin_roles.user_id = is_admin.user_id AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;