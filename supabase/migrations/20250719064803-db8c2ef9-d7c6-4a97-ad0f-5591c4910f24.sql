-- Insert initial admin user (replace with your email)
INSERT INTO public.admin_roles (user_id, email, is_admin) 
VALUES (
  'cd34e336-55da-447e-a876-33d5e09a1e72', -- Placeholder user_id, update after signup
  'osekogroup@gmail.com', -- Replace with your actual email
  true
);

-- Function to make current authenticated user an admin (run after signing up)
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.admin_roles (user_id, email, is_admin)
  VALUES (auth.uid(), user_email, true)
  ON CONFLICT (user_id) DO UPDATE SET is_admin = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;