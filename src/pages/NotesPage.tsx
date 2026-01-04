import { useRef } from "react";
import { useNotes } from "../hooks/useNotes";
import { useContextMenu } from "../hooks/useContextMenu";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import NoteEditor from "../components/NoteEditor";
import EmptyState from "../components/EmptyState";
import ContextMenu from "../components/ContextMenu";

export default function NotesPage() {
  const {
    notes,
    activeNote,
    activeNoteID,
    searchText,
    setSearchText,
    setActiveNoteID,
    updateNote,
    createNote,
    deleteNote,
  } = useNotes();

  const contextMenu = useContextMenu();
  const { signOut } = useAuth();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleCreateNote = async () => {
    const newNote = await createNote();
    if (newNote) {
      setTimeout(() => titleRef.current?.focus(), 0);
    }
  };

  return (
    <div
      className="w-full flex h-screen overflow-hidden bg-[#1D1E20]"
      onClick={contextMenu.close}
    >
      {contextMenu.pos && (
        <ContextMenu pos={contextMenu.pos} onDelete={deleteNote} />
      )}

      <Sidebar
        notes={notes}
        activeNoteID={activeNoteID}
        searchText={searchText}
        onSearchChange={setSearchText}
        onNoteClick={setActiveNoteID}
        onContextMenu={contextMenu.open}
        onCreateNote={handleCreateNote}
        onSignout={signOut}
      />

      <div className="flex-1 flex flex-col h-full px-12 py-10 overflow-hidden bg-white">
        {activeNote ? (
          <NoteEditor
            note={activeNote}
            titleRef={titleRef}
            contentRef={contentRef}
            onUpdate={updateNote}
          />
        ) : (
          <EmptyState onCreateNote={handleCreateNote} />
        )}
      </div>
    </div>
  );
}
