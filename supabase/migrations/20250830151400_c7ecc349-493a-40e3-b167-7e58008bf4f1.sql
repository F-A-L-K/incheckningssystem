-- Create a function to authenticate users
CREATE OR REPLACE FUNCTION public.authenticate_user(p_username text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
  result json;
BEGIN
  -- Get user by username
  SELECT * INTO user_record
  FROM public.users
  WHERE username = p_username;
  
  -- Check if user exists
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'user_not_found',
      'message', 'Användarnamn finns inte'
    );
  END IF;
  
  -- Check if user has access
  IF NOT user_record.Access_checkin THEN
    RETURN json_build_object(
      'success', false,
      'error', 'access_denied',
      'message', 'Du har inte behörighet att komma åt systemet'
    );
  END IF;
  
  -- For now, we'll do a simple password check (in production, use proper hashing)
  -- This is a simplified version - normally you'd use bcrypt or similar
  IF user_record.password_hash != p_password THEN
    RETURN json_build_object(
      'success', false,
      'error', 'invalid_password',
      'message', 'Felaktigt lösenord'
    );
  END IF;
  
  -- Return success with user data
  RETURN json_build_object(
    'success', true,
    'user', json_build_object(
      'id', user_record.id,
      'username', user_record.username,
      'full_name', user_record.full_name,
      'Access_checkin', user_record.Access_checkin,
      'admin', user_record.admin
    )
  );
END;
$$;