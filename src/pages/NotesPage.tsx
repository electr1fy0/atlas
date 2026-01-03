import { useEffect, useState, useRef } from "react";
import supabase from "../client/supabase";
import type { Session } from "@supabase/supabase-js";

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
  const [searchText, setSearchText] = useState<string>("");

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const filteredNotes = notes.filter((note) => {
    const query = searchText.toLowerCase().trim();
    if (!query) return true;
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  const fetchTasks = async (): Promise<Note[] | null> => {
    const { data: notes, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("error fetching notes:", error.message);
      return null;
    }
    return notes;
  };

  useEffect(() => {
    (async () => {
      const fetchedTasks = await fetchTasks();
      if (fetchedTasks) setNotes(fetchedTasks);
    })();
  }, []);

  useEffect(() => {
    if (!currID) return;

    const delayDebounceFn = setTimeout(async () => {
      const note: Note = { title: currTitle, content: currContent };
      const { error } = await supabase
        .from("notes")
        .update(note)
        .eq("id", currID);

      if (error) {
        console.error("failed to submit note:", error.message);
        return;
      }

      const fetchedTasks = await fetchTasks();
      if (fetchedTasks) setNotes(fetchedTasks);
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [currTitle, currContent, currID]);

  const handleDelete = async () => {
    if (!currID) return;
    const { error } = await supabase.from("notes").delete().eq("id", currID);
    if (error) {
      console.error("failed to delete note:", error.message);
      return;
    }

    const fetchedTasks = await fetchTasks();
    if (fetchedTasks) {
      setNotes(fetchedTasks);
      const firstNote = fetchedTasks[0];
      setCurrID(firstNote?.id ?? "");
      setCurrTitle(firstNote?.title ?? "");
      setCurrContent(firstNote?.content ?? "");
    }
  };

  const createNote = async () => {
    setCurrContent("");
    setCurrTitle("");
    setCurrID("");

    const { error, data } = await supabase
      .from("notes")
      .insert({ title: "", content: "" })
      .select()
      .single();

    if (error || !data) {
      console.error("failed to submit note:", error?.message);
      return;
    }

    setCurrID(data.id);
    setNotes((prev) => [data, ...prev]);

    requestAnimationFrame(() => {
      titleRef.current?.focus();
    });
  };

  return (
    <div className="w-full flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 flex flex-col justify-start  h-full bg-[#1D1E20] border-r border-[#2D2D2F]">
        <div className="py-6 px-4 shrink-0">
          <div className="flex justify-between items-center gap-4 text-neutral-400 px-2 py-1.5 text-xl">
            <h1 className="font-medium text-xl">atlas</h1>
            <div
              className="rounded-md border border-neutral-700 size-6 hover:bg-neutral-200 duration-100 flex items-center justify-center hover:text-neutral-700 cursor-pointer"
              onClick={createNote}
            >
              <span className="pb-0.5">+</span>
            </div>
          </div>
          <input
            className="rounded-lg px-4 py-1.5 w-full mt-4 bg-[#2D2D2F] outline-0 text-neutral-400"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Note List */}
        <ul className="flex-1 overflow-y-auto px-4 pb-8 flex flex-col">
          <hr className="border-[#2D2D2F] my-1 mx-2" />

          {filteredNotes.map((note) => (
            <div key={note.id}>
              <li
                className={`${note.id === currID ? "bg-[#2E2F31]" : "hover:bg-[#2E2F31]/50"} text-[#D0D1D3] rounded-lg px-4 min-h-16 pt-3 pb-3 w-full cursor-pointer transition-colors`}
                onClick={() => {
                  setCurrTitle(note.title);
                  setCurrContent(note.content);
                  if (note.id) setCurrID(note.id);
                  titleRef.current?.focus();
                }}
              >
                <span className=" min-h-6">
                  {note.title === "" ? "New Note" : note.title}
                </span>
                <div className="flex justify-between text-left text-sm items-start gap-y-2 h-full w-full text-neutral-500 flex-col">
                  <span className="content-preview line-clamp-1 text-sm h-full w-full">
                    {note.content}
                  </span>
                  <span className="text-xs">
                    {note.modified_at &&
                      new Date(note.modified_at).toLocaleDateString()}
                  </span>
                </div>
              </li>
              <hr className="border-[#2D2D2F] my-1 mx-2" />
            </div>
          ))}
        </ul>
      </div>

      {/* Note Area */}
      <div className="flex-1 flex flex-col h-full px-12 py-10 md:py-12 overflow-hidden">
        <form
          className="flex flex-col h-full max-w-xl w-full mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            onChange={(e) => setCurrTitle(e.target.value)}
            value={currTitle}
            ref={titleRef}
            placeholder="New Note"
            className="h-14 shrink-0 outline-0 text-2xl"
            onKeyDownCapture={(e) => {
              if (e.key === "Backspace" && e.metaKey && currTitle == "") {
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
            className="flex-1 w-full resize-none outline-none text-neutral-700 overflow-y-auto"
          />
        </form>
      </div>
    </div>
  );
}
