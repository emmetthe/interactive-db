'use client';
import { useState } from 'react';
import TableNode from './Table/table';
import CanvasWrapper from './CanvasWrapper/canvasWrapper';
import Sidebar from '../Sidebar/sidebar';
import Toolbar from '../Toolbar/toolbar';

interface Table {
  id: string;
  x: number;
  y: number;
}

export default function Canvas() {
  const [tables, setTables] = useState<Table[]>([]);

  const handleDrag = (id: string, x: number, y: number) => {
    setTables((prev) => prev.map((table) => (table.id === id ? { ...table, x, y } : table)));
  };

  const handleAddTable = () => {
    const newId = (Math.random() * 10000).toFixed(0);
    setTables([...tables, { id: newId, x: 100, y: 100 }]);
  };

  return (
    <div className="h-screen flex">
      <Toolbar />
      <Sidebar />
      <CanvasWrapper>
        {tables.map((table) => (
          <TableNode key={table.id} id={table.id} x={table.x} y={table.y} onDrag={handleDrag} />
        ))}
      </CanvasWrapper>
    </div>
  );
}
