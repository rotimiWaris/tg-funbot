import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./config/supabaseClient";
import Home from "./components/Home";
import WhackAMole from "./components/WhackAMole";

function App() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };

    fetchAuthUser();
  }, []);

  return (
    <>
      <Router basename="/tg-funbot">
        <Routes>
          <Route path="/" element={<Home userId={userId} />} />
          <Route
            path="/whack-a-mole"
            element={<WhackAMole userId={userId} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
