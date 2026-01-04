interface EmptyStateProps {
    onCreateNote: () => void;
}

export default function EmptyState({ onCreateNote }: EmptyStateProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <p className="text-neutral-400 text-lg">No note selected</p>
            <button
                onClick={onCreateNote}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg text-sm font-medium transition-colors"
            >
                New Note
            </button>
        </div>
    );
}
