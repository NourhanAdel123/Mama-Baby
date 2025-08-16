// TestSupabase.jsx
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tzflifnsgijitatjdgly.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZmxpZm5zZ2lqaXRhdGpkZ2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNzY5MjMsImV4cCI6MjA2ODc1MjkyM30.xLAA6N0TxQqhFA7prGowhBSfIyA7SOpkE8Hlcj4b6Hg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TestSupabase() {
  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase
        .from("pregnancy_weeks") // اسم الجدول
        .select("*"); // كل الأعمدة

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Data from Supabase:", data);
      }
    };

    fetchData();
  }, []);

  return <h1>Check the console for Supabase data</h1>;
}
