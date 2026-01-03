import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import supabase from "./client/supabase";
import NotesPage from "./pages/NotesPage";
import AuthPage from "./pages/AuthPage";

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        console.error(error);
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return user ? <NotesPage /> : <AuthPage />;
};

export default App;
