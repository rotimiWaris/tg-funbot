import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useFetchUser from "../config/useFetchUser";
import "../index.css";

interface HomeProps {
  userId: string | null;
}

export default function Home({ userId }: HomeProps) {
  const navigate = useNavigate();
  const { data: userData, loading } = useFetchUser(userId);
  const [delayedLoading, setDelayedLoading] = useState(true); // New state for delayed loading

  // Set timeout to delay the transition from loading to content
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        document.body.style.backgroundColor = "#111";
        setDelayedLoading(true); // Set delayed loading after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timeout on component unmount
    } else {
      setDelayedLoading(false); // Once loading is complete, set delayedLoading to false
    }
  }, [loading]); // Dependency on loading, so it runs when loading changes

  if (delayedLoading) {
    return (
      <div className="container">
        <img
          src="/funbot.jpg"
          alt="Loading user data..."
          style={{ width: "100%" }}
        />
        <p style={{ color: "white" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Hello, {userData?.username || "Guest"}!</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#333",
        }}
      >
        <button
          onClick={() => navigate("/whack-a-mole")}
          style={{
            padding: "0.5rem 1rem",
            background: "#3bb7c7",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.75rem",
          }}
        >
          Play Whack A Mole
        </button>
      </div>
    </div>
  );
}
