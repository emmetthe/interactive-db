'use client';

import { Table2, Plus, Trash2, Edit, Link2, Palette, Group } from 'lucide-react';
import {ContextMenuProps} from '@/types/database';

export default function ContextMenu({
  x,
  y,
  type,
  onClose,
  onCreateTable,
  onCreateGroup,
  onDeleteTable,
  onDeleteGroup,
  onAddRow
}: ContextMenuProps) {
  const menuItems = type === 'canvas' 
    ? [
        { icon: Table2, label: 'Add Table', action: onCreateTable },
        { icon: Group, label: 'Add Group', action: onCreateGroup },
        { icon: Link2, label: 'Add Relationship', action: () => {} },
      ]
    : type === 'table'
    ? [
        { icon: Edit, label: 'Edit Table', action: () => {} },
        { icon: Plus, label: 'Add Row', action: onAddRow },
        { icon: Palette, label: 'Change Color', action: () => {} },
        { icon: Link2, label: 'Add Relationship', action: () => {} },
        { type: 'divider' as const },
        { icon: Trash2, label: 'Delete Table', action: onDeleteTable, danger: true },
      ]
    : [
        { icon: Edit, label: 'Edit Group', action: () => {} },
        { icon: Palette, label: 'Change Color', action: () => {} },
        { type: 'divider' as const },
        { icon: Trash2, label: 'Delete Group', action: onDeleteGroup, danger: true },
      ];

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-48"
      style={{ 
        left: x, 
        top: y,
        transform: 'translate(0, 0)'
      }}
    >
      {menuItems.map((item, index) => {
        if ('type' in item && item.type === 'divider') {
          return <div key={index} className="border-t border-gray-200 my-2" />;
        }

        const Icon = 'icon' in item ? item.icon : Table2;
        const label = 'label' in item ? item.label : '';
        const action = 'action' in item ? item.action : undefined;
        const danger = 'danger' in item ? item.danger : false;

        return (
          <button
            key={index}
            onClick={() => {
              action?.();
              onClose();
            }}
            className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
              danger ? 'text-red-600 hover:text-red-700' : 'text-gray-700'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm">{label}</span>
          </button>
        );
      })}
    </div>
  );
}