import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

// Admin client bypasses RLS — use only in server-side trusted contexts
export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
