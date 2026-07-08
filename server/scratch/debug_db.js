import { supabase } from "../config/supabaseClient.js";

async function debug() {
  console.log("Querying users table...");
  const res = await supabase.from("users").select("*");
  console.log("Users Response:", { data: res.data, error: res.error });

  console.log("\nQuerying transactions table...");
  const res2 = await supabase.from("transactions").select("*");
  console.log("Transactions Response:", { data: res2.data, error: res2.error });
}

debug();
