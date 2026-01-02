import React, { useEffect, useState } from "react";
import supabase from "./client/supabase";
import type { Session } from "@supabase/supabase-js";

interface Note {
  id?: string;
  title: string;
  content: string;
  created_at?: string;
  modified_at?: string;
}

interface Creds {
  email: string;
  password: string;
}

const App = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteContent, setNoteContent] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [session, setSession] = useState<Session | null>(null);

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
      console.log("inserted:", JSON.stringify(note));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const creds: Creds = { email, password };
    const { error } = await supabase.auth.signInWithPassword(creds);
    if (error) console.error("login failed");
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
    if (!session) {
      return;
    }
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
  return (
    <div>
      <header>
        <h1>Notebook</h1>
      </header>
      <button onClick={handleLogout}>logout</button>
      <main>
        <section>
          <form onSubmit={handleLogin}>
            <input
              name="email"
              value={email}
              type="email"
              placeholder="log"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <input
              name="password"
              type="password"
              value={password}
              placeholder="pass"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button type="submit">login</button>
          </form>
        </section>
        <section>
          <form onSubmit={handleSave}>
            <input
              name="title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Title"
            />

            <textarea
              name="content"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Content"
            />

            <button type="submit">Save</button>
          </form>
        </section>

        {notes.length > 0 && (
          <section>
            {notes.map((note: Note) => (
              <article key={note.id}>
                <time>
                  {note.created_at
                    ? new Date(note.created_at).toLocaleDateString()
                    : ""}
                </time>
                <br />
                <time>
                  {note.modified_at
                    ? new Date(note.modified_at).toLocaleDateString()
                    : ""}
                </time>

                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <code>{note.id}</code>
                <hr />
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
