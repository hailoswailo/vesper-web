import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role client — bypasses RLS entirely. Only ever import this from
 * server-only code that has independently verified the request (e.g. the
 * Stripe webhook route, after verifying Stripe's signature), never from
 * anything reachable directly by a browser request.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
