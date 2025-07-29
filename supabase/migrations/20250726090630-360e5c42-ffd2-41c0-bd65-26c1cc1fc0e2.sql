-- Create storage policies for product-images bucket
CREATE POLICY "Allow public access to product images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Allow admins to upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' AND 
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Allow admins to update product images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'product-images' AND 
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Allow admins to delete product images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'product-images' AND 
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);