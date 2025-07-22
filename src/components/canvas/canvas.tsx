'use client';
import TableNode from '@/components/table/table';
import Sidebar from '@/components/sidebar/sidebar';
import Toolbar from '@/components/toolbar/toolbar';
import { useTable } from '@/hooks/useTable';

export default function Canvas() {
  const { tables, updateTablePosition } = useTable();

  const handleDrag = (id: string, x: number, y: number) => {
    updateTablePosition(id, x, y);
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
            <TableNode key={table.id} id={table.id} name={table.name} x={table.x} y={table.y} columns={table.columns} onDrag={handleDrag} />
          ))}
        </div>
      </div>
    </div>
  );
}
