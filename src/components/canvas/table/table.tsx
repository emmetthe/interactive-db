'use client';
import { useState, useRef, useEffect } from 'react';

interface TableNodeProps {
  id: string;
  x: number;
  y: number;
  onDrag: (id: string, x: number, y: number) => void;
}

export default function TableNode({ id, x, y, onDrag }: TableNodeProps) {
  const [position, setPosition] = useState({ x, y });
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    const rect = ref.current?.getBoundingClientRect();
    offset.current = {
      x: e.clientX - (rect?.left ?? 0),
      y: e.clientY - (rect?.top ?? 0),
    };
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;
    setPosition({ x: newX, y: newY });
    onDrag(id, newX, newY);
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className="absolute w-48 bg-white rounded shadow-md cursor-move"
      style={{ left: position.x, top: position.y }}
    >
      <div className="p-2 font-bold border-b">Table {id}</div>
      <div className="p-2 text-sm text-gray-700">Columns...</div>
    </div>
  );
}
