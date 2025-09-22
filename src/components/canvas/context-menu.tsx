'use client';

import { Table2, Plus, Trash2, Edit, Link2, Palette } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  type: 'canvas' | 'table';
  onClose: () => void;
  onCreateTable: () => void;
  onDeleteTable?: () => void;
  onAddColumn?: () => void;
}

export default function ContextMenu({
  x,
  y,
  type,
  onClose,
  onCreateTable,
  onDeleteTable,
  onAddColumn
}: ContextMenuProps) {
  const menuItems = type === 'canvas' 
    ? [
        { icon: Table2, label: 'Add Table', action: onCreateTable },
        { icon: Link2, label: 'Add Relationship', action: () => {} },
      ]
    : [
        { icon: Edit, label: 'Edit Table', action: () => {} },
        { icon: Plus, label: 'Add Column', action: onAddColumn },
        { icon: Palette, label: 'Change Color', action: () => {} },
        { icon: Link2, label: 'Add Relationship', action: () => {} },
        { type: 'divider' },
        { icon: Trash2, label: 'Delete Table', action: onDeleteTable, danger: true },
      ];

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-48"
      style={{ 
        left: x, 
        top: y,
        transform: 'translate(0, 0)' // Ensure menu doesn't go off screen
      }}
    >
      {menuItems.map((item, index) => {
        if (item.type === 'divider') {
          return <div key={index} className="border-t border-gray-200 my-2" />;
        }

        const Icon = item.icon!;
        return (
          <button
            key={index}
            onClick={() => {
              item.action?.();
              onClose();
            }}
            className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
              item.danger ? 'text-red-600 hover:text-red-700' : 'text-gray-700'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}