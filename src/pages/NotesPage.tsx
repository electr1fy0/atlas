import { useEffect, useState, useRef } from "react";
import supabase from "../client/supabase";
import type { Session } from "@supabase/supabase-js";
import { HugeiconsIcon } from "@hugeicons/react";

interface Note {
  id?: string;
  title: string;
  content: string;
  created_at?: string;
  modified_at?: string;
}

export default function NotesPage() {
  const [currTitle, setCurrTitle] = useState<string>("");
  const [currContent, setCurrContent] = useState<string>("");
  const [currID, setCurrID] = useState<string>("");

  const [notes, setNotes] = useState<Note[]>([]);

  const [session, setSession] = useState<Session | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const fetchTasks = async () => {
    const { data: notes, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("error fetching notes:");
      return;
    }
    if (!notes) {
      console.error("fetched notes is null for some reason");
      return;
    }
    setNotes(notes);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async () => {
    const { error } = await supabase.from("notes").delete().eq("id", currID);
    if (error) {
      console.error("failed to delete note:", currTitle);
      return;
    }

    setCurrContent(notes[0] ? notes[0].content : "");
    setCurrTitle(notes[0] ? notes[0].title : "");
    await fetchTasks();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const note: Note = { title: currTitle, content: currContent };
    const { error } = await supabase
      .from("notes")
      .update(note)
      .eq("id", currID);

    if (error) {
      console.error("failed to submit note:", error.message);
      return;
    }

    fetchTasks();
  };

  const createNote = async () => {
    const { error, data } = await supabase
      .from("notes")
      .insert({ title: currTitle, content: currContent })
      .select()
      .single();

    if (error || !data) {
      console.error("failed to submit note:", error?.message || data);
      return;
    }
    setCurrContent("");
    setCurrTitle("");
    setCurrID(data.id);

    setNotes((prev) => [data, ...prev]);

    requestAnimationFrame(() => {
      titleRef.current?.focus();
    });
  };

  return (
    <div className="w-full flex">
      {/* Sidebar*/}
      <div className="">
        <div className="py-8 w-80 bg-[#1D1E20] px-4 h-screen">
          <div className="flex justify-between items-center gap-4 text-neutral-400 px-4 py-1.5 text-xl">
            <h1 className="font-medium text-xl">atlas</h1>
            <div
              className="rounded-md border size-6 hover:bg-neutral-200 flex items-center justify-center  hover:text-neutral-700 "
              onClick={createNote}
            >
              <span className="pb-0.5">+</span>
            </div>
          </div>
          <input
            className="rounded-lg px-4 py-1.5 w-full my-4 bg-[#2D2D2F] outline-0 text-neutral-400"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            name="search-bar"
          ></input>
          <ul className="rounded-lg ">
            {notes.map((note) => {
              return (
                <div key={note.id}>
                  <li
                    className={`hover: ${note.id == currID ? "bg-[#2E2F31]" : ""}  text-[#D0D1D3] rounded-lg px-3 py-3 w-full`}
                  >
                    <button
                      onClick={() => {
                        setCurrTitle(note.title);
                        setCurrContent(note.content);
                        if (note.id) setCurrID(note.id);
                        titleRef.current?.focus();
                      }}
                      className="w-full h-full"
                    >
                      <span className="block text-left"> {note.title}</span>
                      <div className="flex justify-between text-left text-sm items-center w-full text-neutral-400">
                        <span className="content-preview overflow-hidden ">
                          {note.content}
                        </span>
                        <span>
                          {note.modified_at &&
                            new Date(note.modified_at).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  </li>
                  <hr className="border-[#2D2D2F] my-1" />
                </div>
              );
            })}
          </ul>
        </div>
      </div>
      {/* Notes area*/}
      <div className="flex justify-start items-center flex-1  md:m-20">
        <div className="h-full max-w-1/2 area">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              onChange={(e) => setCurrTitle(e.target.value)}
              value={currTitle}
              ref={titleRef}
              className="h-14 outline-0 text-2xl"
              onKeyDownCapture={(e) => {
                if (e.key === "Backspace" && e.metaKey) {
                  e.preventDefault();
                  handleDelete();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  contentRef.current?.focus();
                }
              }}
            />
            <textarea
              ref={contentRef}
              onChange={(e) => setCurrContent(e.target.value)}
              value={currContent}
              className=" h-full resize-none outline-none text-neutral-700"
            />
            <button
              type="submit"
              className="py-1.5 px-3 rounded-md bg-neutral-900 hover:bg-neutral-700  text-neutral-300"
            >
              Update Note
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
