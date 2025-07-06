'use client';
import { useState } from 'react';
import TableNode from './table/table';
import Sidebar from '@/components/sidebar/sidebar';
import Toolbar from '@/components/toolbar/toolbar';

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
    <div className="h-screen flex flex-col">
      <Toolbar />

      {/* Main body: Sidebar + Canvas */}
      <div className="flex flex-grow overflow-hidden">
        <Sidebar />

        {/* Canvas content area */}
        <div className="flex-grow relative bg-gray-100">
          {tables.map((table) => (
            <TableNode key={table.id} id={table.id} x={table.x} y={table.y} onDrag={handleDrag} />
          ))}
        </div>
      </div>
    </div>
  );
}
