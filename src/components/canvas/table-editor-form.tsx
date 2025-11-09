'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Table, Row } from '@/types/database';

interface TableEditorFormProps {
  table: Table;
  onUpdateTable: (updates: Partial<Table>) => void;
  onAddRow: () => void;
  onRemoveRow: (rowId: string) => void;
  onUpdateRow: (rowId: string, updates: Partial<Row>) => void;
}

const DATA_TYPES = [
  'INT',
  'BIGINT',
  'SMALLINT',
  'TINYINT',
  'VARCHAR(255)',
  'VARCHAR(50)',
  'STRING',
  'CHAR(10)',
  'BOOLEAN',
  'DATE',
  'DATETIME',
  'TIMESTAMP',
  'DECIMAL(10,2)',
  'FLOAT',
  'DOUBLE',
  'JSON',
  'BLOB'
];

export default function TableEditorForm({ table, onUpdateTable, onAddRow, onRemoveRow, onUpdateRow }: TableEditorFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Table Name</label>
        <input
          type="text"
          value={table.name}
          onChange={(e) => onUpdateTable({ name: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <input
          type="color"
          value={table.color}
          onChange={(e) => onUpdateTable({ color: e.target.value })}
          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Rows</label>
          <button onClick={onAddRow} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Row
          </button>
        </div>

        <div className="space-y-3">
          {table.rows.map((row) => (
            <div key={row.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Column Name</label>
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => onUpdateRow(row.id, { name: e.target.value })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  placeholder="e.g., user_id"
                />
              </div>

              {/*text input to select dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Data Type</label>
                <select
                  value={row.type}
                  onChange={(e) => onUpdateRow(row.id, { type: e.target.value })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white"
                >
                  {DATA_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div className="flex space-x-3">
                  <label className="flex items-center space-x-1.5">
                    <input
                      type="checkbox"
                      checked={row.isPrimary}
                      onChange={(e) => onUpdateRow(row.id, { isPrimary: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-xs font-medium text-gray-700">Primary Key</span>
                  </label>
                  <label className="flex items-center space-x-1.5">
                    <input
                      type="checkbox"
                      checked={row.isNullable}
                      onChange={(e) => onUpdateRow(row.id, { isNullable: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-xs font-medium text-gray-700">Nullable</span>
                  </label>
                </div>
                <button
                  onClick={() => onRemoveRow(row.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
