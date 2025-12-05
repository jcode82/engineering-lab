import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

const run = async () => {
  const { data, error } = await supabase.from("experiments").select("*");
  console.log("data:", data);
  console.log("error:", error);
};

run();
