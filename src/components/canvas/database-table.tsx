'use client';

import { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Key, Trash2, GripVertical } from 'lucide-react';
import { Table, Column } from '@/types/database';

interface DatabaseTableProps {
  table: Table;
  isSelected: boolean;
  isEditingMode: boolean;
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

export default function DatabaseTable({
  table,
  isSelected,
  isEditingMode,
  onSelect,
  onUpdate,
  onContextMenu,
  onAddColumn,
  onRemoveColumn,
  onUpdateColumn
}: DatabaseTableProps) {
  const [editingCell, setEditingCell] = useState<{ columnId: string; field: 'name' | 'type' } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TABLE,
    item: () => ({
      id: table.id,
      position: table.position
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        onUpdate({
          position: {
            x: item.position.x + delta.x,
            y: item.position.y + delta.y
          }
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

  return (
    <div
      ref={tableRef}
      className={`absolute bg-white rounded-lg shadow-lg border-2 transition-all duration-200 ${
        isSelected ? 'border-blue-500 shadow-blue-200' : 'border-gray-200 hover:border-gray-300'
      } ${isDragging ? 'opacity-50' : ''}`}
      style={{
        left: table.position.x,
        top: table.position.y,
        minWidth: '200px',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onContextMenu={onContextMenu}
      onClick={handleTableClick}
    >
      {/* Table Header */}
      <div className="p-3 rounded-t-lg border-b border-gray-200 font-semibold text-white" style={{ backgroundColor: table.color }}>
        <div className="flex items-center justify-between">
          <span className="text-sm">{table.name}</span>
          <div className="flex items-center space-x-1">
            <GripVertical className="h-4 w-4 opacity-70" />
          </div>
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-200">
        {table.columns.map((column, index) => (
          <div key={column.id} className="p-2 hover:bg-gray-50 relative group">
            <div className="flex items-center space-x-2">
              {column.isPrimary && <Key className="h-3 w-3 text-yellow-500 flex-shrink-0" />}

              <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                <div>
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
                      className={`font-medium text-gray-900 p-0.5 rounded ${isEditingMode ? 'cursor-text hover:bg-gray-100' : ''}`}
                    >
                      {column.name}
                    </div>
                  )}
                </div>

                <div>
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
                      className={`text-gray-600 p-0.5 rounded ${isEditingMode ? 'cursor-text hover:bg-gray-100' : ''}`}
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
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Delete column"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 mt-1">
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
          className="w-full p-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-t border-gray-200 transition-colors"
        >
          + Add Column
        </button>
      )}
    </div>
  );
}
