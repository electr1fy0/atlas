import { useState } from "react";
import supabase from "../client/supabase";

interface Creds {
  email: string;
  password: string;
}

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const creds: Creds = { email, password };

    if (isLogin) {
      const resp = await supabase.auth.signInWithPassword(creds);
      console.log("signin resp", resp);
    } else {
      console.log("unimplemented signup");
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6
      bg-linear-to-br from-[#FFFFFF] to-[#F0F0F0]"
    >
      <div className="bg-white/80 bg-blur-md border border-neutral-200 rounded-xl p-10  w-full max-w-[440px] text-left">
        <h1 className="text-2xl font-semibold tracking-tight mb-8">
          {isLogin ? "Sign In" : "Sign Up"}
        </h1>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-neutral-500"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-3  py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password text-left"
              className="text-sm font-medium text-neutral-500"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3  py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 transition-all"
            />
          </div>

          <button
            type="submit"
            className="mt-8 w-full px-3  py-2 bg-black text-white rounded-xl font-medium hover:bg-neutral-800 transition-all"
          >
            {isLogin ? "Continue" : "Create Account"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 text-left">
          <button
            className="text-neutral-400 text-sm hover:text-black transition-colors"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  const note: Note = { title: noteTitle, content: noteContent };
  const { data, error } = await supabase
    .from("notes")
    .insert(note)
    .select()
    .single();
  if (error) {
    console.error(error.message);
  } else {
    if (data) setNotes([data, ...notes]);
    setNoteTitle("");
    setNoteContent("");
  }
};

useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });
  return () => subscription.unsubscribe();
}, []);

useEffect(() => {
  if (!session) return;
  const fetchNotes = async () => {
    const { data: notes, error } = await supabase.from("notes").select("*");
    if (error) console.error(error.message);
    else setNotes(notes);
  };
  fetchNotes();
}, [session]);

const handleLogout = () => {
  supabase.auth.signOut();
};
