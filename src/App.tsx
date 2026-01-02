// TODO:
// implement insert and select

import React, { useState } from "react";
import supabase from "./client/supabase";

interface Note {
  title: string;
  content: string;
}

const App = () => {
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteContent, setNoteContent] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const note: Note = {
      title: noteTitle,
      content: noteContent,
    };

    const { error } = await supabase.from("notes").insert(note).single();

    if (error) {
      console.error(error.message);
    } else console.log("inserted:", JSON.stringify(note));
  };
  return (
    <>
      <form onSubmit={handleSave}>
        <input
          name="title"
          onChange={(e) => setNoteTitle(e.target.value)}
          value={noteTitle}
          style={{ backgroundColor: "grey" }}
        />
        <textarea
          name="content"
          onChange={(e) => setNoteContent(e.target.value)}
          style={{ backgroundColor: "grey" }}
        ></textarea>
        <button type="submit">Save</button>
      </form>
    </>
  );
};
export default App;
