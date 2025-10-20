'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CanvasHeader from './canvas-header';
import CanvasSidebar from './canvas-sidebar';
import DatabaseTable from './database-table';
import GroupContainer from './group-container';
import ContextMenu from './context-menu';
import CanvasBackground from './canvas-background';
import { Table, Row, Relationship, Group } from '@/types/database';
import { generateTableColor } from '@/lib/utils';

const DEFAULT_TABLE_WIDTH = 240;
const DEFAULT_TABLE_HEIGHT = 150;
const DEFAULT_GROUP_WIDTH = 400;
const DEFAULT_GROUP_HEIGHT = 300;

const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsla(${hue}, 70%, 60%, 0.15)`;
};

export default function Canvas() {
  const [workspaceName, setWorkspaceName] = useState('Untitled Workspace');
  const [tables, setTables] = useState<Table[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: 'canvas' | 'table' | 'group';
    tableId?: string;
    groupId?: string;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const lastPanPointRef = useRef({ x: 0, y: 0 });

  const createNewTable = useCallback(
    (x?: number, y?: number) => {
      let tableX, tableY;

      if (x !== undefined && y !== undefined) {
        tableX = x;
        tableY = y;
      } else {
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (canvasRect) {
          const topLeftX = 50;
          const topLeftY = 50;
          tableX = (topLeftX - pan.x) / zoom;
          tableY = (topLeftY - pan.y) / zoom;
          const staggerOffset = tables.length * 30;
          tableX += staggerOffset;
          tableY += staggerOffset;
        } else {
          tableX = 100 + tables.length * 30;
          tableY = 100 + tables.length * 30;
        }
      }

      const newTable: Table = {
        id: `table_${Date.now()}`,
        name: `Table ${tables.length + 1}`,
        position: { x: tableX, y: tableY },
        size: { width: DEFAULT_TABLE_WIDTH, height: DEFAULT_TABLE_HEIGHT },
        color: generateTableColor(tables.length),
        rows: [
          { id: 'row_1', name: 'id', type: 'INT', isPrimary: true, isNullable: false },
          { id: 'row_2', name: 'name', type: 'VARCHAR(255)', isPrimary: false, isNullable: true }
        ]
      };

      setTables((prev) => [...prev, newTable]);
    },
    [tables.length, pan.x, pan.y, zoom]
  );

  const createNewGroup = useCallback(() => {
    const groupX = 150 + groups.length * 40;
    const groupY = 150 + groups.length * 40;

    const newGroup: Group = {
      id: `group_${Date.now()}`,
      name: `Group ${groups.length + 1}`,
      tableIds: [],
      position: { x: groupX, y: groupY },
      size: { width: DEFAULT_GROUP_WIDTH, height: DEFAULT_GROUP_HEIGHT },
      color: generateRandomColor()
    };

    setGroups((prev) => [...prev, newGroup]);
  }, [groups.length]);

  const updateTable = useCallback((tableId: string, updates: Partial<Table>) => {
    setTables((prev) => prev.map((table) => (table.id === tableId ? { ...table, ...updates } : table)));
  }, []);

  const updateGroup = useCallback(
    (groupId: string, updates: Partial<Group> & { moveTables?: { deltaX: number; deltaY: number } }) => {
      if (updates.moveTables) {
        const group = groups.find((g) => g.id === groupId);
        if (group) {
          setTables((prev) =>
            prev.map((table) => {
              if (group.tableIds.includes(table.id)) {
                return {
                  ...table,
                  position: {
                    x: table.position.x + updates.moveTables!.deltaX,
                    y: table.position.y + updates.moveTables!.deltaY
                  }
                };
              }
              return table;
            })
          );
        }
      }

      const { moveTables, ...groupUpdates } = updates;
      setGroups((prev) => prev.map((group) => (group.id === groupId ? { ...group, ...groupUpdates } : group)));
    },
    [groups]
  );

  const checkTableGroupAssignment = useCallback(
    (tableId: string) => {
      const table = tables.find((t) => t.id === tableId);
      if (!table) return;

      let assignedGroupId: string | null = null;

      for (const group of groups) {
        const tableCenter = {
          x: table.position.x + table.size.width / 2,
          y: table.position.y + table.size.height / 2
        };

        const isInside =
          tableCenter.x >= group.position.x &&
          tableCenter.x <= group.position.x + group.size.width &&
          tableCenter.y >= group.position.y &&
          tableCenter.y <= group.position.y + group.size.height;

        if (isInside) {
          assignedGroupId = group.id;
          break;
        }
      }

      setGroups((prev) =>
        prev.map((group) => {
          const hasTable = group.tableIds.includes(tableId);

          if (assignedGroupId === group.id && !hasTable) {
            return { ...group, tableIds: [...group.tableIds, tableId] };
          } else if (assignedGroupId !== group.id && hasTable) {
            return { ...group, tableIds: group.tableIds.filter((id) => id !== tableId) };
          }

          return group;
        })
      );
    },
    [tables, groups]
  );

  const deleteTable = useCallback(
    (tableId: string) => {
      setTables((prev) => prev.filter((table) => table.id !== tableId));
      setRelationships((prev) => prev.filter((rel) => rel.fromTableId !== tableId && rel.toTableId !== tableId));
      setGroups((prev) =>
        prev.map((group) => ({
          ...group,
          tableIds: group.tableIds.filter((id) => id !== tableId)
        }))
      );
      if (selectedTable === tableId) setSelectedTable(null);
      if (editingTable === tableId) setEditingTable(null);
    },
    [selectedTable, editingTable]
  );

  const deleteGroup = useCallback(
    (groupId: string) => {
      setGroups((prev) => prev.filter((group) => group.id !== groupId));
      if (selectedGroup === groupId) setSelectedGroup(null);
    },
    [selectedGroup]
  );

  const addRow = useCallback((tableId: string) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              rows: [
                ...table.rows,
                {
                  id: `row_${Date.now()}`,
                  name: `row_${table.rows.length + 1}`,
                  type: 'VARCHAR(255)',
                  isPrimary: false,
                  isNullable: true
                }
              ]
            }
          : table
      )
    );
  }, []);

  const removeRow = useCallback((tableId: string, rowId: string) => {
    setTables((prev) =>
      prev.map((table) => (table.id === tableId ? { ...table, rows: table.rows.filter((row) => row.id !== rowId) } : table))
    );
  }, []);

  const updateRow = useCallback((tableId: string, rowId: string, updates: Partial<Row>) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              rows: table.rows.map((row) => (row.id === rowId ? { ...row, ...updates } : row))
            }
          : table
      )
    );
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(0.1, Math.min(3, prev + delta)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && e.target === canvasRef.current) {
      isPanningRef.current = true;
      lastPanPointRef.current = { x: e.clientX, y: e.clientY };
      setSelectedTable(null);
      setSelectedGroup(null);
      setEditingTable(null);
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanningRef.current) {
      const deltaX = e.clientX - lastPanPointRef.current.x;
      const deltaY = e.clientY - lastPanPointRef.current.y;
      setPan((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      lastPanPointRef.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false;
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, type: 'canvas' });
  }, []);

  const handleTableContextMenu = useCallback((e: React.MouseEvent, tableId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, type: 'table', tableId });
  }, []);

  const handleGroupContextMenu = useCallback((e: React.MouseEvent, groupId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, type: 'group', groupId });
  }, []);

  const handleTableSelect = useCallback((tableId: string) => {
    setSelectedTable(tableId);
    setEditingTable(tableId);
    setSelectedGroup(null);
  }, []);

  const handleGroupSelect = useCallback((groupId: string) => {
    setSelectedGroup(groupId);
    setSelectedTable(null);
    setEditingTable(null);
  }, []);

  const handleCanvasClick = useCallback(() => {
    setSelectedTable(null);
    setEditingTable(null);
    setSelectedGroup(null);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gray-50">
        <CanvasHeader workspaceName={workspaceName} onWorkspaceNameChange={setWorkspaceName} />

        <div className="flex flex-1 overflow-hidden">
          <CanvasSidebar
            tables={tables}
            groups={groups}
            relationships={relationships}
            selectedTable={selectedTable}
            selectedGroup={selectedGroup}
            editingTable={editingTable}
            onCreateTable={createNewTable}
            onCreateGroup={createNewGroup}
            onSelectTable={handleTableSelect}
            onSelectGroup={handleGroupSelect}
            onUpdateTable={updateTable}
            onUpdateGroup={updateGroup}
            onDeleteTable={deleteTable}
            onDeleteGroup={deleteGroup}
            onAddRow={addRow}
            onRemoveRow={removeRow}
            onUpdateRow={updateRow}
            onExitEditMode={() => {
              setEditingTable(null);
              setSelectedTable(null);
            }}
          />

          <div className="flex-1 relative overflow-hidden">
            <CanvasBackground
              ref={canvasRef}
              zoom={zoom}
              pan={pan}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onContextMenu={handleContextMenu}
              onClick={handleCanvasClick}
            >
              {groups.map((group) => (
                <GroupContainer
                  key={group.id}
                  group={group}
                  zoom={zoom}
                  isSelected={selectedGroup === group.id}
                  onUpdate={(updates) => updateGroup(group.id, updates)}
                  onSelect={() => handleGroupSelect(group.id)}
                  onContextMenu={(e) => handleGroupContextMenu(e, group.id)}
                />
              ))}

              {tables.map((table) => (
                <DatabaseTable
                  key={table.id}
                  table={table}
                  isSelected={selectedTable === table.id}
                  isEditingMode={editingTable === table.id}
                  zoom={zoom}
                  onSelect={() => handleTableSelect(table.id)}
                  onUpdate={(updates) => updateTable(table.id, updates)}
                  onUpdateComplete={() => checkTableGroupAssignment(table.id)}
                  onContextMenu={(e) => handleTableContextMenu(e, table.id)}
                  onAddRow={() => addRow(table.id)}
                  onRemoveRow={(rowId) => removeRow(table.id, rowId)}
                  onUpdateRow={(rowId, updates) => updateRow(table.id, rowId, updates)}
                />
              ))}
            </CanvasBackground>

            {contextMenu && (
              <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                type={contextMenu.type}
                onClose={() => setContextMenu(null)}
                onCreateTable={() => {
                  createNewTable();
                  setContextMenu(null);
                }}
                onCreateGroup={() => {
                  createNewGroup();
                  setContextMenu(null);
                }}
                onDeleteTable={() => {
                  if (contextMenu.tableId) deleteTable(contextMenu.tableId);
                  setContextMenu(null);
                }}
                onDeleteGroup={() => {
                  if (contextMenu.groupId) deleteGroup(contextMenu.groupId);
                  setContextMenu(null);
                }}
                onAddRow={() => {
                  if (contextMenu.tableId) addRow(contextMenu.tableId);
                  setContextMenu(null);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}