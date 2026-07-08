import { supabase } from "../config/supabaseClient.js";

async function checkDatabase() {
  console.log("Checking Supabase connection...");
  
  // Test querying users table
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("count", { count: "exact", head: true });

  if (usersError) {
    console.error("❌ Users table check failed:", usersError.message);
    if (usersError.message.includes("does not exist")) {
      console.log("👉 Suggestion: The 'users' table is missing. Run the schema.sql in Supabase SQL editor.");
    }
  } else {
    console.log("✅ Users table exists.");
  }

  // Test querying transactions table
  const { data: txns, error: txnsError } = await supabase
    .from("transactions")
    .select("count", { count: "exact", head: true });

  if (txnsError) {
    console.error("❌ Transactions table check failed:", txnsError.message);
    if (txnsError.message.includes("does not exist")) {
      console.log("👉 Suggestion: The 'transactions' table is missing. Run the schema.sql in Supabase SQL editor.");
    }
  } else {
    console.log("✅ Transactions table exists.");
  }
}

checkDatabase();
