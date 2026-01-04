import type { Note } from "../types";

interface NoteEditorProps {
    note: Note;
    titleRef: React.RefObject<HTMLInputElement | null>;
    contentRef: React.RefObject<HTMLTextAreaElement | null>;
    onUpdate: (fields: Partial<Note>) => void;
}

export default function NoteEditor({
    note,
    titleRef,
    contentRef,
    onUpdate,
}: NoteEditorProps) {
    return (
        <form
            className="flex flex-col h-full max-w-2xl w-full mx-auto"
            onSubmit={(e) => e.preventDefault()}
        >
            <input
                ref={titleRef}
                value={note.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Title"
                className="text-4xl font-bold outline-none mb-6 text-neutral-900"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        contentRef.current?.focus();
                    }
                }}
            />
            <textarea
                ref={contentRef}
                value={note.content}
                onChange={(e) => onUpdate({ content: e.target.value })}
                className="flex-1 w-full resize-none outline-none text-lg text-neutral-700 leading-relaxed"
                placeholder="Start writing..."
            />
        </form>
    );
}
