'use client';

import { useState } from 'react';
import { Plus, Table2, Link2, Group as GroupIcon, Edit, X } from 'lucide-react';
import { Table, Relationship, Row, Group } from '@/types/database';
import SidebarSection from './sidebar-section';
import TableEditorForm from './table-editor-form';

interface CanvasSidebarProps {
  tables: Table[];
  groups: Group[];
  relationships: Relationship[];
  selectedTable: string | null;
  selectedGroup: string | null;
  editingTable: string | null;
  onCreateTable: () => void;
  onCreateGroup: () => void;
  onSelectTable: (tableId: string) => void;
  onSelectGroup: (groupId: string) => void;
  onUpdateTable: (tableId: string, updates: Partial<Table>) => void;
  onUpdateGroup: (groupId: string, updates: Partial<Group>) => void;
  onDeleteTable: (tableId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onAddRow: (tableId: string) => void;
  onRemoveRow: (tableId: string, rowId: string) => void;
  onUpdateRow: (tableId: string, rowId: string, updates: Partial<Row>) => void;
  onExitEditMode: () => void;
}

export default function CanvasSidebar({
  tables,
  groups,
  relationships,
  selectedTable,
  selectedGroup,
  editingTable,
  onCreateTable,
  onCreateGroup,
  onSelectTable,
  onSelectGroup,
  onUpdateTable,
  onUpdateGroup,
  onDeleteTable,
  onDeleteGroup,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
  onExitEditMode
}: CanvasSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    tables: true,
    relationships: false,
    groups: true
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
        {editingTable ? (
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
        <SidebarSection
          title="Tables"
          icon={Table2}
          count={tables.length}
          isExpanded={expandedSections.tables}
          onToggle={() => toggleSection('tables')}
        >
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
        </SidebarSection>

        <SidebarSection
          title="Relationships"
          icon={Link2}
          count={relationships.length}
          isExpanded={expandedSections.relationships}
          onToggle={() => toggleSection('relationships')}
        >
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
        </SidebarSection>

        <SidebarSection
          title="Groups"
          icon={GroupIcon}
          count={groups.length}
          isExpanded={expandedSections.groups}
          onToggle={() => toggleSection('groups')}
        >
          <div className="space-y-2">
            <button
              onClick={onCreateGroup}
              className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>New Group</span>
            </button>

            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => onSelectGroup(group.id)}
                className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                  selectedGroup === group.id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="w-3 h-3 rounded" style={{ backgroundColor: group.color }} />
                <span className="text-sm font-medium">{group.name}</span>
                <span className="text-xs text-gray-500 ml-auto">({group.tableIds.length})</span>
              </button>
            ))}
          </div>
        </SidebarSection>
      </div>

      {selectedTableData && editingTable === selectedTable && (
        <div className="border-t border-gray-200 p-4 max-h-96 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Edit Table</h3>
          <TableEditorForm
            table={selectedTableData}
            onUpdateTable={(updates) => onUpdateTable(selectedTable!, updates)}
            onAddRow={() => onAddRow(selectedTable!)}
            onRemoveRow={(rowId) => onRemoveRow(selectedTable!, rowId)}
            onUpdateRow={(rowId, updates) => onUpdateRow(selectedTable!, rowId, updates)}
          />
        </div>
      )}
    </div>
  );
}