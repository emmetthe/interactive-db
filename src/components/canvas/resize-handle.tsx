'use client';

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
}

export default function ResizeHandle({ onMouseDown }: ResizeHandleProps) {
  return (
    <div
      className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize"
      onMouseDown={onMouseDown}
    >
      <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-gray-400"></div>
    </div>
  );
}