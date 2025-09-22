'use client';

import { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Key, Trash2, GripVertical } from 'lucide-react';
import { Table, Column } from '@/types/database';

interface DatabaseTableProps {
  table: Table;
  isSelected: boolean;
  isEditingMode: boolean;
  zoom: number;
  onSelect: () => void;
  onUpdate: (updates: Partial<Table>) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onAddColumn: () => void;
  onRemoveColumn: (columnId: string) => void;
  onUpdateColumn: (columnId: string, updates: Partial<Column>) => void;
}

const ItemTypes = {
  TABLE: 'table'
};

// Grid size for snapping
const GRID_SIZE = 20;

export default function DatabaseTable({
  table,
  isSelected,
  isEditingMode,
  zoom,
  onSelect,
  onUpdate,
  onContextMenu,
  onAddColumn,
  onRemoveColumn,
  onUpdateColumn
}: DatabaseTableProps) {
  const [editingCell, setEditingCell] = useState<{ columnId: string; field: 'name' | 'type' } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Function to snap to grid
  const snapToGrid = (x: number, y: number) => {
    const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
    return { x: snappedX, y: snappedY };
  };

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.TABLE,
    item: () => ({
      id: table.id,
      originalPosition: table.position
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta && item.originalPosition) {
        // Calculate new position
        const newX = item.originalPosition.x + delta.x / zoom;
        const newY = item.originalPosition.y + delta.y / zoom;

        // Snap to grid
        const snappedPosition = snapToGrid(newX, newY);

        onUpdate({
          position: snappedPosition
        });
      }
    }
  });

  // Attach drag ref to the table element
  drag(tableRef);

  const handleDoubleClick = (columnId: string, field: 'name' | 'type') => {
    if (isEditingMode) {
      setEditingCell({ columnId, field });
    }
  };

  const handleCellEdit = (columnId: string, field: 'name' | 'type', value: string) => {
    onUpdateColumn(columnId, { [field]: value });
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, columnId: string, field: 'name' | 'type') => {
    if (e.key === 'Enter') {
      const input = e.target as HTMLInputElement;
      handleCellEdit(columnId, field, input.value);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleTableClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  // Calculate table dimensions
  const tableWidth = table.size?.width || 240;
  const minHeight = table.size?.height || 150;

  // Calculate dynamic height based on column count
  const headerHeight = 48;
  const columnHeight = 44;
  const addButtonHeight = isEditingMode ? 32 : 0;
  const calculatedHeight = headerHeight + table.columns.length * columnHeight + addButtonHeight;

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
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onContextMenu={onContextMenu}
      onClick={handleTableClick}
    >
      {/* Table Header */}
      <div
        className="p-3 rounded-t-lg border-b border-gray-200 font-semibold text-white h-12 flex items-center"
        style={{ backgroundColor: table.color }}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-sm truncate">{table.name}</span>
          <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
            <GripVertical className="h-4 w-4 opacity-70" />
          </div>
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-200 overflow-hidden">
        {table.columns.map((column, index) => (
          <div key={column.id} className="p-2 hover:bg-gray-50 relative group h-11 flex items-center">
            <div className="flex items-center space-x-2 w-full">
              {column.isPrimary && <Key className="h-3 w-3 text-yellow-500 flex-shrink-0" />}

              <div className="flex-1 grid grid-cols-2 gap-2 text-xs min-w-0">
                <div className="min-w-0">
                  {editingCell?.columnId === column.id && editingCell.field === 'name' ? (
                    <input
                      type="text"
                      defaultValue={column.name}
                      autoFocus
                      onBlur={(e) => handleCellEdit(column.id, 'name', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, column.id, 'name')}
                      className="w-full px-1 py-0.5 border border-blue-500 rounded text-xs"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div
                      onDoubleClick={() => handleDoubleClick(column.id, 'name')}
                      className={`font-medium text-gray-900 p-0.5 rounded truncate ${isEditingMode ? 'cursor-text hover:bg-gray-100' : ''}`}
                      title={column.name}
                    >
                      {column.name}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  {editingCell?.columnId === column.id && editingCell.field === 'type' ? (
                    <input
                      type="text"
                      defaultValue={column.type}
                      autoFocus
                      onBlur={(e) => handleCellEdit(column.id, 'type', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, column.id, 'type')}
                      className="w-full px-1 py-0.5 border border-blue-500 rounded text-xs"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div
                      onDoubleClick={() => handleDoubleClick(column.id, 'type')}
                      className={`text-gray-600 p-0.5 rounded truncate ${isEditingMode ? 'cursor-text hover:bg-gray-100' : ''}`}
                      title={column.type}
                    >
                      {column.type}
                    </div>
                  )}
                </div>
              </div>

              {/* Delete button - only show in editing mode */}
              {isEditingMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveColumn(column.id);
                  }}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                  title="Delete column"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 mt-1 absolute bottom-0 left-2 right-2">
              {!column.isNullable && <span className="text-xs text-red-600 font-medium">NOT NULL</span>}
              {column.isPrimary && <span className="text-xs text-yellow-600 font-medium">PRIMARY</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Add Column Button - only show in editing mode */}
      {isEditingMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddColumn();
          }}
          className="w-full p-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-t border-gray-200 transition-colors h-8 flex items-center justify-center"
        >
          + Add Column
        </button>
      )}
    </div>
  );
}
