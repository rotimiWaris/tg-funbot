import { useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

const useFetchUser = (userId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setData(data);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [userId]);

  return { data, loading, error };
};

export default useFetchUser;
