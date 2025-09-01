-- Update authenticate_user function to use SHA-256 password hashing
CREATE OR REPLACE FUNCTION public.authenticate_user(p_username text, p_password text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_record RECORD;
  hashed_password text;
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
  
  -- Check if user has access (note the quoted column name to preserve case)
  IF NOT user_record."Access_checkin" THEN
    RETURN json_build_object(
      'success', false,
      'error', 'access_denied',
      'message', 'Du har inte behörighet att komma åt systemet'
    );
  END IF;
  
  -- Hash the provided password with SHA-256
  hashed_password := encode(digest(p_password, 'sha256'), 'hex');
  
  -- Compare hashed password with stored hash
  IF user_record.password_hash != hashed_password THEN
    RETURN json_build_object(
      'success', false,
      'error', 'invalid_password',
      'message', 'Felaktigt lösenord'
    );
  END IF;
  
  -- Return success with user data (note the quoted column names)
  RETURN json_build_object(
    'success', true,
    'user', json_build_object(
      'id', user_record.id,
      'username', user_record.username,
      'full_name', user_record.full_name,
      'Access_checkin', user_record."Access_checkin",
      'admin', user_record.admin
    )
  );
END;
$function$