'use client';

import React from 'react';
import { Key, Trash2 } from 'lucide-react';
import { Row } from '@/types/database';

interface TableColumnRowProps {
  row: Row;
  isEditingMode: boolean;
  editingCell: { rowId: string; field: 'name' | 'type' } | null;
  onDoubleClick: (rowId: string, field: 'name' | 'type') => void;
  onCellEdit: (rowId: string, field: 'name' | 'type', value: string) => void;
  onKeyDown: (e: React.KeyboardEvent, rowId: string, field: 'name' | 'type') => void;
  onRemoveRow: (rowId: string) => void;
}

export default function TableColumnRow({
  row,
  isEditingMode,
  editingCell,
  onDoubleClick,
  onCellEdit,
  onKeyDown,
  onRemoveRow
}: TableColumnRowProps) {
  const [localNameValue, setLocalNameValue] = React.useState(row.name);
  const [localTypeValue, setLocalTypeValue] = React.useState(row.type);

  const isEditingName = editingCell?.rowId === row.id && editingCell.field === 'name';
  const isEditingType = editingCell?.rowId === row.id && editingCell.field === 'type';

  // Update local values when row changes
  React.useEffect(() => {
    if (!isEditingName) {
      setLocalNameValue(row.name);
    }
  }, [row.name, isEditingName]);

  React.useEffect(() => {
    if (!isEditingType) {
      setLocalTypeValue(row.type);
    }
  }, [row.type, isEditingType]);

  const handleNameBlur = () => {
    const trimmedValue = localNameValue.trim();
    if (!row.isNullable && trimmedValue === '') {
      // Revert to original value if non-nullable and empty
      setLocalNameValue(row.name);
      return;
    }
    onCellEdit(row.id, 'name', trimmedValue);
  };

  const handleTypeBlur = () => {
    const trimmedValue = localTypeValue.trim();
    if (!row.isNullable && trimmedValue === '') {
      // Revert to original value if non-nullable and empty
      setLocalTypeValue(row.type);
      return;
    }
    onCellEdit(row.id, 'type', trimmedValue);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameBlur();
      onKeyDown(e, row.id, 'name');
    } else if (e.key === 'Escape') {
      setLocalNameValue(row.name);
      onKeyDown(e, row.id, 'name');
    }
  };

  const handleTypeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTypeBlur();
      onKeyDown(e, row.id, 'type');
    } else if (e.key === 'Escape') {
      setLocalTypeValue(row.type);
      onKeyDown(e, row.id, 'type');
    }
  };

  return (
    <div className="p-2 hover:bg-gray-50 relative group h-11 flex items-center">
      <div className="flex items-center space-x-2 w-full">
        {row.isPrimary && <Key className="h-3 w-3 text-yellow-500 flex-shrink-0" />}

        <div className="flex-1 grid grid-cols-2 gap-2 text-xs min-w-0">
          <div className="min-w-0">
            {isEditingName ? (
              <input
                type="text"
                value={localNameValue}
                onChange={(e) => setLocalNameValue(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                autoFocus
                className="w-full px-1 py-0.5 border border-blue-500 rounded text-xs"
                onMouseDown={(e) => e.stopPropagation()}
              />
            ) : (
              <div
                onDoubleClick={() => onDoubleClick(row.id, 'name')}
                className={`font-medium text-gray-900 p-0.5 rounded truncate ${isEditingMode ? 'cursor-text hover:bg-gray-100' : ''}`}
                title={row.name}
              >
                {row.name}
              </div>
            )}
          </div>

          <div className="min-w-0">
            {isEditingType ? (
              <input
                type="text"
                value={localTypeValue}
                onChange={(e) => setLocalTypeValue(e.target.value)}
                onBlur={handleTypeBlur}
                onKeyDown={handleTypeKeyDown}
                autoFocus
                className="w-full px-1 py-0.5 border border-blue-500 rounded text-xs"
                onMouseDown={(e) => e.stopPropagation()}
              />
            ) : (
              <div
                onDoubleClick={() => onDoubleClick(row.id, 'type')}
                className={`text-gray-600 p-0.5 rounded truncate ${isEditingMode ? 'cursor-text hover:bg-gray-100' : ''}`}
                title={row.type}
              >
                {row.type}
              </div>
            )}
          </div>
        </div>

        {isEditingMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveRow(row.id);
            }}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex-shrink-0"
            title="Delete row"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
