'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { TableColumn } from '@/lib/config';

interface TableNodeProps {
  id: string;
  name: string;
  x: number;
  y: number;
  columns: TableColumn[];
  onDrag: (id: string, x: number, y: number) => void;
}

export default function TableNode({ id, name, x, y, columns, onDrag }: TableNodeProps) {
  const [position, setPosition] = useState({ x, y });
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging.current) return;
      const newX = e.clientX - offset.current.x;
      const newY = e.clientY - offset.current.y;
      setPosition({ x: newX, y: newY });
      onDrag(id, newX, newY);
    },
    [id, onDrag]
  );

  const onMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // Update position when props change
  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className="absolute w-48 bg-white rounded shadow-md cursor-move border"
      style={{ left: position.x, top: position.y }}
    >
      <div className="p-2 font-bold border-b bg-blue-50">{name}</div>
      <div className="p-2">
        {columns.map((column) => (
          <div key={column.id} className="text-sm py-1 flex justify-between">
            <span className={column.isPrimaryKey ? 'font-semibold' : ''}>{column.name}</span>
            <span className="text-gray-500 text-xs">{column.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
