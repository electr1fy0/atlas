// Shared types for the app

export interface Note {
    id: string;
    title: string;
    content: string;
    created_at?: string;
    modified_at?: string;
}
