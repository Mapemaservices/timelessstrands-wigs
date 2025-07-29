-- Fix security issues identified by the linter

-- 1. Fix function search_path issues by setting SECURITY DEFINER and search_path
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE admin_roles.user_id = is_admin.user_id AND admin_roles.is_admin = true
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.admin_roles (user_id, email, is_admin)
  VALUES (auth.uid(), user_email, true)
  ON CONFLICT (user_id) DO UPDATE SET is_admin = true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.add_admin_by_email(admin_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.sync_user_metadata()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_all_users()
 RETURNS TABLE(id uuid, email text, created_at timestamp with time zone, last_sign_in_at timestamp with time zone, email_confirmed_at timestamp with time zone, is_admin boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Only allow admins to call this function
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND admin_roles.is_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email::text,
    u.created_at,
    u.last_sign_in_at,
    u.email_confirmed_at,
    COALESCE(ar.is_admin, false) as is_admin
  FROM auth.users u
  LEFT JOIN public.admin_roles ar ON u.id = ar.user_id
  ORDER BY u.created_at DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, phone)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'phone'
  );
  RETURN new;
END;
$function$;

-- 2. Add RLS policy for admin table (missing policy)
CREATE POLICY "Only super admins can manage admin table" 
ON public.admin 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- 3. Add additional security policies
CREATE POLICY "Only authenticated users can read their own profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Only the user can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 4. Ensure all sensitive tables have proper RLS
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Create function to check if user is authenticated
CREATE OR REPLACE FUNCTION public.is_authenticated()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT auth.uid() IS NOT NULL;
$function$;