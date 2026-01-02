import { createClient } from "@supabase/supabase-js";

export default createClient(
  import.meta.env.VITE_SUPABASE_REST_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
