-- Fix the get_all_users function to resolve column ambiguity
CREATE OR REPLACE FUNCTION public.get_all_users()
 RETURNS TABLE(id uuid, email text, created_at timestamp with time zone, last_sign_in_at timestamp with time zone, email_confirmed_at timestamp with time zone, is_admin boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
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
$function$