import { HugeiconsIcon } from "@hugeicons/react";
import {
    PencilEdit02Icon,
    LogoutSquare01Icon,
} from "@hugeicons/core-free-icons";
import type { Note } from "../types";

interface SidebarProps {
    notes: Note[];
    activeNoteID: string | null;
    searchText: string;
    onSearchChange: (text: string) => void;
    onNoteClick: (id: string) => void;
    onContextMenu: (e: React.MouseEvent) => void;
    onCreateNote: () => void;
    onSignout: () => void;
}

export default function Sidebar({
    notes,
    activeNoteID,
    searchText,
    onSearchChange,
    onNoteClick,
    onContextMenu,
    onCreateNote,
    onSignout,
}: SidebarProps) {
    return (
        <div className="w-80 flex flex-col h-full border-r border-[#2D2D2F]">
            {/* Header */}
            <div className="py-6 px-4 shrink-0">
                <div className="flex justify-between items-center gap-4 text-neutral-400 px-2 py-1.5">
                    <h1 className="font-medium text-xl font-geist-mono">atlas</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={onCreateNote}
                            className="rounded-md p-1 hover:bg-[#262628] duration-100"
                        >
                            <HugeiconsIcon icon={PencilEdit02Icon} size={22} />
                        </button>
                        <button
                            onClick={onSignout}
                            className="rounded-md p-1 hover:bg-[#262628] duration-100"
                        >
                            <HugeiconsIcon icon={LogoutSquare01Icon} size={21} />
                        </button>
                    </div>
                </div>
                <input
                    className="rounded-lg px-4 py-1.5 w-full mt-4 bg-[#2D2D2F] outline-0 text-neutral-400 text-sm"
                    placeholder="Search notes..."
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Note List */}
            <ul className="flex-1 overflow-y-auto px-4 pb-8 flex flex-col">
                {notes.map((note) => (
                    <div key={note.id}>
                        <li
                            className={`${note.id === activeNoteID ? "bg-[#2E2F31]" : "hover:bg-[#2E2F31]/50"} text-[#D0D1D3] rounded-lg px-4 py-3 w-full cursor-pointer transition-colors`}
                            onClick={() => onNoteClick(note.id)}
                            onContextMenu={onContextMenu}
                        >
                            <span className="block font-medium truncate">
                                {note.title || "New Note"}
                            </span>
                            <span className="block text-sm text-neutral-500 line-clamp-1">
                                {note.content || "No content"}
                            </span>
                            <span className="block text-xs text-neutral-600 mt-1">
                                {(note.modified_at || note.created_at) && new Date(note.modified_at || note.created_at!).toLocaleDateString()}
                            </span>
                        </li>
                        <hr className="border-[#2D2D2F] my-1 mx-2" />
                    </div>
                ))}
            </ul>
        </div>
    );
}
