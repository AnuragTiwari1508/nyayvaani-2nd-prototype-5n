import { createClient } from "@supabase/supabase-js"

// This client has admin privileges and should only be used in server contexts
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)
