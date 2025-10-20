'use client';

import { Table, Row } from '@/types/database';

interface TableEditorFormProps {
  table: Table;
  onUpdateTable: (updates: Partial<Table>) => void;
  onAddRow: () => void;
  onRemoveRow: (rowId: string) => void;
  onUpdateRow: (rowId: string, updates: Partial<Row>) => void;
}

export default function TableEditorForm({
  table,
  onUpdateTable,
  onAddRow,
  onRemoveRow,
  onUpdateRow
}: TableEditorFormProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Table Name</label>
        <input
          type="text"
          value={table.name}
          onChange={(e) => onUpdateTable({ name: e.target.value })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
        <input
          type="color"
          value={table.color}
          onChange={(e) => onUpdateTable({ color: e.target.value })}
          className="w-full h-8 border border-gray-300 rounded"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-700">Rows</label>
          <button onClick={onAddRow} className="text-xs text-blue-600 hover:text-blue-700">
            + Add Row
          </button>
        </div>

        <div className="space-y-2">
          {table.rows.map((row) => (
            <div key={row.id} className="p-2 border border-gray-200 rounded text-xs">
              <input
                type="text"
                value={row.name}
                onChange={(e) => onUpdateRow(row.id, { name: e.target.value })}
                className="w-full mb-1 px-1 py-0.5 border border-gray-300 rounded text-xs"
                placeholder="Column name"
              />
              <input
                type="text"
                value={row.type}
                onChange={(e) => onUpdateRow(row.id, { type: e.target.value })}
                className="w-full mb-1 px-1 py-0.5 border border-gray-300 rounded text-xs"
                placeholder="Data type"
              />
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={row.isPrimary}
                      onChange={(e) => onUpdateRow(row.id, { isPrimary: e.target.checked })}
                      className="w-3 h-3"
                    />
                    <span className="ml-1 text-xs">PK</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={row.isNullable}
                      onChange={(e) => onUpdateRow(row.id, { isNullable: e.target.checked })}
                      className="w-3 h-3"
                    />
                    <span className="ml-1 text-xs">Null</span>
                  </label>
                </div>
                <button onClick={() => onRemoveRow(row.id)} className="text-red-500 hover:text-red-700 text-xs">
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