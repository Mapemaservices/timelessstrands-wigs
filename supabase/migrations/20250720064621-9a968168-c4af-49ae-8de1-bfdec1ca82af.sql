-- Add trigger to sync user metadata with admin roles
CREATE OR REPLACE FUNCTION public.sync_user_metadata()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has is_admin in raw_user_meta_data
  IF (NEW.raw_user_meta_data ->> 'is_admin')::boolean = true THEN
    INSERT INTO public.admin_roles (user_id, email, is_admin)
    VALUES (NEW.id, NEW.email, true)
    ON CONFLICT (user_id) DO UPDATE SET 
      is_admin = true,
      email = NEW.email,
      updated_at = now();
  ELSIF (NEW.raw_user_meta_data ->> 'is_admin')::boolean = false THEN
    UPDATE public.admin_roles 
    SET is_admin = false, updated_at = now()
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for auth.users metadata changes
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_metadata();