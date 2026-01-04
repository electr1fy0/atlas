import { useState } from "react";

type Pos = { x: number; y: number } | null;

export function useContextMenu() {
    const [pos, setPos] = useState<Pos>(null);

    const open = (e: React.MouseEvent) => {
        e.preventDefault();
        setPos({ x: e.clientX, y: e.clientY });
    };

    const close = () => setPos(null);

    return { pos, open, close };
}
