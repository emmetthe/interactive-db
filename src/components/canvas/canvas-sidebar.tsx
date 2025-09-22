'use client';

import { useState } from 'react';
import { Plus, Table2, Link2, Group, ChevronRight, ChevronDown, Edit, X } from 'lucide-react';
import { Table, Relationship, Column } from '@/types/database';

interface CanvasSidebarProps {
  tables: Table[];
  relationships: Relationship[];
  selectedTable: string | null;
  isEditingMode: boolean;
  onCreateTable: () => void;
  onSelectTable: (tableId: string) => void;
  onUpdateTable: (tableId: string, updates: Partial<Table>) => void;
  onDeleteTable: (tableId: string) => void;
  onAddColumn: (tableId: string) => void;
  onRemoveColumn: (tableId: string, columnId: string) => void;
  onUpdateColumn: (tableId: string, columnId: string, updates: Partial<Column>) => void;
  onExitEditMode: () => void;
}

export default function CanvasSidebar({
  tables,
  relationships,
  selectedTable,
  isEditingMode,
  onCreateTable,
  onSelectTable,
  onUpdateTable,
  onDeleteTable,
  onAddColumn,
  onRemoveColumn,
  onUpdateColumn,
  onExitEditMode
}: CanvasSidebarProps) {
  const [activeTab, setActiveTab] = useState<'tables' | 'relationships' | 'groups'>('tables');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    tables: true,
    relationships: false,
    groups: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const selectedTableData = tables.find((t) => t.id === selectedTable);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        {isEditingMode ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Edit className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Edit Mode</span>
            </div>
            <button onClick={onExitEditMode} className="p-1 text-gray-400 hover:text-gray-600 rounded" title="Exit edit mode">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onCreateTable}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Table</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Tables Section */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('tables')}
            className="w-full flex items-center justify-between text-left text-sm font-medium text-gray-900 mb-3"
          >
            <div className="flex items-center space-x-2">
              <Table2 className="h-4 w-4" />
              <span>Tables ({tables.length})</span>
            </div>
            {expandedSections.tables ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {expandedSections.tables && (
            <div className="space-y-2">
              {tables.map((table) => (
                <div key={table.id}>
                  <button
                    onClick={() => onSelectTable(table.id)}
                    className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                      selectedTable === table.id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: table.color }} />
                    <span className="text-sm font-medium">{table.name}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Relationships Section */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => toggleSection('relationships')}
            className="w-full flex items-center justify-between text-left text-sm font-medium text-gray-900 mb-3"
          >
            <div className="flex items-center space-x-2">
              <Link2 className="h-4 w-4" />
              <span>Relationships ({relationships.length})</span>
            </div>
            {expandedSections.relationships ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {expandedSections.relationships && (
            <div className="space-y-2">
              {relationships.map((rel) => (
                <div key={rel.id} className="p-2 rounded-lg bg-gray-50 text-sm">
                  <div className="font-medium">{rel.name || 'Unnamed Relationship'}</div>
                  <div className="text-gray-600 text-xs">
                    {rel.fromTableId} → {rel.toTableId}
                  </div>
                </div>
              ))}
              {relationships.length === 0 && <div className="text-gray-500 text-sm text-center py-4">No relationships yet</div>}
            </div>
          )}
        </div>

        {/* Groups Section */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => toggleSection('groups')}
            className="w-full flex items-center justify-between text-left text-sm font-medium text-gray-900 mb-3"
          >
            <div className="flex items-center space-x-2">
              <Group className="h-4 w-4" />
              <span>Groups (0)</span>
            </div>
            {expandedSections.groups ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {expandedSections.groups && <div className="text-gray-500 text-sm text-center py-4">No groups created yet</div>}
        </div>
      </div>

      {/* Table Editor */}
      {selectedTableData && isEditingMode && (
        <div className="border-t border-gray-200 p-4 max-h-96 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Edit Table</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Table Name</label>
              <input
                type="text"
                value={selectedTableData.name}
                onChange={(e) => onUpdateTable(selectedTable!, { name: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
              <input
                type="color"
                value={selectedTableData.color}
                onChange={(e) => onUpdateTable(selectedTable!, { color: e.target.value })}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-700">Columns</label>
                <button onClick={() => onAddColumn(selectedTable!)} className="text-xs text-blue-600 hover:text-blue-700">
                  + Add Column
                </button>
              </div>

              <div className="space-y-2">
                {selectedTableData.columns.map((column) => (
                  <div key={column.id} className="p-2 border border-gray-200 rounded text-xs">
                    <input
                      type="text"
                      value={column.name}
                      onChange={(e) => onUpdateColumn(selectedTable!, column.id, { name: e.target.value })}
                      className="w-full mb-1 px-1 py-0.5 border border-gray-300 rounded text-xs"
                      placeholder="Column name"
                    />
                    <input
                      type="text"
                      value={column.type}
                      onChange={(e) => onUpdateColumn(selectedTable!, column.id, { type: e.target.value })}
                      className="w-full mb-1 px-1 py-0.5 border border-gray-300 rounded text-xs"
                      placeholder="Data type"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={column.isPrimary}
                            onChange={(e) => onUpdateColumn(selectedTable!, column.id, { isPrimary: e.target.checked })}
                            className="w-3 h-3"
                          />
                          <span className="ml-1 text-xs">PK</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={column.isNullable}
                            onChange={(e) => onUpdateColumn(selectedTable!, column.id, { isNullable: e.target.checked })}
                            className="w-3 h-3"
                          />
                          <span className="ml-1 text-xs">Null</span>
                        </label>
                      </div>
                      <button onClick={() => onRemoveColumn(selectedTable!, column.id)} className="text-red-500 hover:text-red-700 text-xs">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
