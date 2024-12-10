import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

interface User {
  id: string;
  username: string;
  high_score: number;
  // Add other fields from your "users" table
}

const useFetchUser = (userId: string | null) => {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("No user ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("users") // Replace with your table name
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      } else {
        setData(data as User);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [userId]);

  return { data, loading, error };
};

export default useFetchUser;
