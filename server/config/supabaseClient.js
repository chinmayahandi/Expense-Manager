import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

let supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl) {
  console.error("Critical Error: SUPABASE_URL environment variable is missing.");
}

// Bulletproof URL parsing helper
if (supabaseUrl && !supabaseUrl.startsWith("http://") && !supabaseUrl.startsWith("https://")) {
  supabaseUrl = `https://${supabaseUrl}.supabase.co`;
}

if (!supabaseKey) {
  console.error("Critical Error: SUPABASE_SERVICE_ROLE_KEY environment variable is missing.");
}

console.log(`Initializing Supabase client with URL: ${supabaseUrl}`);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});
