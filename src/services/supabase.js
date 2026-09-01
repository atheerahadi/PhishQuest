import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wevxsxechwennmdwykku.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndldnhzeGVjaHdlbm5tZHd5a2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4MzE3OTMsImV4cCI6MjEwMTQwNzc5M30.eXjk61bN497zOAqjID7a8ycsxnvvn6jXh6MH4uuM0Og";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);