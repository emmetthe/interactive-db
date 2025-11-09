'use client';

import { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { Table, Row } from '@/types/database';
import TableHeader from './table-header';
import TableColumnRow from './table-column-row';
import ResizeHandle from './resize-handle';

interface DatabaseTableProps {
  table: Table;
  isSelected: boolean;
  isEditingMode: boolean;
  zoom: number;
  onSelect: () => void;
  onUpdate: (updates: Partial<Table>) => void;
  onUpdateComplete?: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onAddRow: () => void;
  onRemoveRow: (rowId: string) => void;
  onUpdateRow: (rowId: string, updates: Partial<Row>) => void;
}

const ItemTypes = {
  TABLE: 'table'
};

const GRID_SIZE = 20;

export default function DatabaseTable({
  table,
  isSelected,
  isEditingMode,
  zoom,
  onSelect,
  onUpdate,
  onUpdateComplete,
  onContextMenu,
  onAddRow,
  onRemoveRow,
  onUpdateRow
}: DatabaseTableProps) {
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: 'name' | 'type' } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const snapToGrid = (x: number, y: number) => {
    const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
    return { x: snappedX, y: snappedY };
  };

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TABLE,
    item: () => ({
      id: table.id,
      originalPosition: table.position
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: () => editingCell === null && !isResizing,
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta && item.originalPosition) {
        const newX = item.originalPosition.x + delta.x / zoom;
        const newY = item.originalPosition.y + delta.y / zoom;
        const snappedPosition = snapToGrid(newX, newY);

        onUpdate({
          position: snappedPosition
        });

        if (onUpdateComplete) {
          onUpdateComplete();
        }
      }
    }
  });

  drag(tableRef);

  const handleDoubleClick = (rowId: string, field: 'name' | 'type') => {
    if (isEditingMode) {
      setEditingCell({ rowId, field });
    }
  };

  const handleCellEdit = (rowId: string, field: 'name' | 'type', value: string) => {
    onUpdateRow(rowId, { [field]: value });
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, rowId: string, field: 'name' | 'type') => {
    if (e.key === 'Enter') {
      const input = e.target as HTMLInputElement;
      handleCellEdit(rowId, field, input.value);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleTableClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = document.querySelector('[data-canvas]');
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / zoom;
      const mouseY = (e.clientY - rect.top) / zoom;

      const newWidth = Math.max(200, mouseX - table.position.x);
      const newHeight = Math.max(100, mouseY - table.position.y);

      onUpdate({ size: { width: newWidth, height: newHeight } });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, table.position, zoom, onUpdate]);

  const tableWidth = table.size?.width || 240;
  const minHeight = table.size?.height || 150;
  const headerHeight = 48;
  const columnHeight = 44;
  const addButtonHeight = isEditingMode ? 32 : 0;
  const calculatedHeight = headerHeight + table.rows.length * columnHeight + addButtonHeight;
  const tableHeight = Math.max(minHeight, calculatedHeight);

  return (
    <div
      ref={tableRef}
      className={`absolute bg-white rounded-lg shadow-lg border-2 transition-all duration-200 select-none ${
        isSelected ? 'border-blue-500 shadow-blue-200' : 'border-gray-200 hover:border-gray-300'
      } ${isDragging ? 'opacity-50' : ''}`}
      style={{
        left: table.position.x,
        top: table.position.y,
        width: tableWidth,
        height: tableHeight,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isSelected ? 20 : 10
      }}
      onContextMenu={onContextMenu}
      onClick={handleTableClick}
    >
      <TableHeader name={table.name} color={table.color} />

      <div className="divide-y divide-gray-200 overflow-hidden">
        {table.rows.map((row) => (
          <TableColumnRow
            key={row.id}
            row={row}
            isEditingMode={isEditingMode}
            editingCell={editingCell}
            onDoubleClick={handleDoubleClick}
            onCellEdit={handleCellEdit}
            onKeyDown={handleKeyDown}
            onRemoveRow={onRemoveRow}
          />
        ))}
      </div>

      {isEditingMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddRow();
          }}
          className="w-full p-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-t border-gray-200 transition-colors h-8 flex items-center justify-center"
        >
          + Add Row
        </button>
      )}

      <ResizeHandle onMouseDown={handleResizeMouseDown} />
    </div>
  );
}
