import { useState, useEffect, useMemo } from "react";
import supabase from "../client/supabase";
import type { Note } from "../types";

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteID, setActiveNoteID] = useState<string | null>(null);
    const [searchText, setSearchText] = useState("");

    const activeNote = useMemo(() => {
        return notes.find((n) => n.id === activeNoteID) || null;
    }, [notes, activeNoteID]);

    const filteredNotes = useMemo(() => {
        const query = searchText.toLowerCase().trim();
        if (!query) return notes;

        return notes.filter(
            (note) =>
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query),
        );
    }, [notes, searchText]);

    useEffect(() => {
        const fetchAll = async () => {
            const { data } = await supabase
                .from("notes")
                .select("*")
                .order("created_at", { ascending: false });
            if (data) {
                setNotes(data);
                if (data.length > 0) setActiveNoteID(data[0].id);
            }
        };
        fetchAll();
    }, []);

    useEffect(() => {
        if (!activeNote) return;

        const timeout = setTimeout(async () => {
            const { error } = await supabase
                .from("notes")
                .update({ title: activeNote.title, content: activeNote.content })
                .eq("id", activeNote.id);

            if (error) console.error("Auto-save failed:", error.message);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [activeNote?.title, activeNote?.content]);

    const updateNote = (fields: Partial<Note>) => {
        if (!activeNoteID) return;
        setNotes((prev) =>
            prev.map((n) => (n.id === activeNoteID ? { ...n, ...fields } : n)),
        );
    };

    const createNote = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from("notes")
            .insert({ title: "", content: "", author_id: user.id })
            .select()
            .single();

        if (data) {
            setNotes((prev) => [data, ...prev]);
            setActiveNoteID(data.id);
        }

        return data;
    };

    const deleteNote = async () => {
        if (!activeNoteID) return;

        const { error } = await supabase
            .from("notes")
            .delete()
            .eq("id", activeNoteID);

        if (error) {
            console.error("Delete failed:", error.message);
            return;
        }

        setNotes((prev) => prev.filter((n) => n.id !== activeNoteID));
        setActiveNoteID(null);
    };

    return {
        notes: filteredNotes,
        activeNote,
        activeNoteID,
        searchText,
        setSearchText,
        setActiveNoteID,
        updateNote,
        createNote,
        deleteNote,
    };
}
