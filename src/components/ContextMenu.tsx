type Pos = { x: number; y: number };

interface ContextMenuProps {
  pos: Pos;
  onDelete: () => void;
}

export default function ContextMenu({ pos, onDelete }: ContextMenuProps) {
  return (
    <div
      className="fixed bg-white border border-neutral-200 p-1 rounded-md shadow-xl z-50"
      style={{ top: pos.y, left: pos.x }}
    >
      <ul className="text-sm text-neutral-600 cursor-pointer">
        <li
          className="hover:bg-red-50 px-4 py-1 rounded text-red-500"
          onClick={onDelete}
        >
          Delete Note
        </li>
      </ul>
    </div>
  );
}
