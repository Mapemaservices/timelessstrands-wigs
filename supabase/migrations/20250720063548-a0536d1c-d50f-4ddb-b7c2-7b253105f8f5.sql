-- Create helper function to make users admin easily
CREATE OR REPLACE FUNCTION public.add_admin_by_email(admin_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get user_id from auth.users table using email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = admin_email 
  LIMIT 1;
  
  -- If user found, insert or update admin role
  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.admin_roles (user_id, email, is_admin)
    VALUES (target_user_id, admin_email, true)
    ON CONFLICT (user_id) DO UPDATE SET 
      is_admin = true,
      email = admin_email,
      updated_at = now();
  ELSE
    RAISE EXCEPTION 'User with email % not found', admin_email;
  END IF;
END;
$$;