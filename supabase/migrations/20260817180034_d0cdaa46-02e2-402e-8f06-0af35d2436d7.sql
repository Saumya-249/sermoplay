-- Trigger-only function: no client should be able to call it via the API
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Role check helper: not callable by anonymous visitors.
-- Signed-in users keep EXECUTE because it is referenced by the user_roles RLS policy,
-- which is evaluated with the caller's privileges. It only returns a boolean.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;