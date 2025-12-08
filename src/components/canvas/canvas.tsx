'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CanvasHeader from './canvas-header';
import CanvasSidebar from './canvas-sidebar';
import DatabaseTable from './database-table';
import GroupContainer from './group-container';
import ContextMenu from './context-menu';
import CanvasBackground from './canvas-background';
import TableEditorForm from './table-editor-form';
import { Table, Row, Relationship, Group } from '@/types/database';
import { generateTableColor } from '@/lib/utils';
import { WebSocketClient, WSMessage } from '@/websocket/websocket-client';

const DEFAULT_TABLE_WIDTH = 240;
const DEFAULT_TABLE_HEIGHT = 150;
const DEFAULT_GROUP_WIDTH = 400;
const DEFAULT_GROUP_HEIGHT = 300;

const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsla(${hue}, 70%, 60%, 0.15)`;
};

interface User {
  id: string;
  name: string;
  color: string;
}

// Generate or retrieve user ID
const getUserId = (): string => {
  if (typeof window === 'undefined') return '';
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
};

const getUserName = (): string => {
  if (typeof window === 'undefined') return 'Anonymous';
  let userName = localStorage.getItem('userName');
  if (!userName) {
    userName = `User ${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem('userName', userName);
  }
  return userName;
};

export default function Canvas() {
  const params = useParams();
  const searchParams = useSearchParams();

  // Workspace and connection state
  const [workspaceId, setWorkspaceId] = useState<string>('');
  const [workspaceName, setWorkspaceName] = useState('Untitled Workspace');
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit'>('edit');
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);

  const currentUserId = getUserId();
  const currentUserName = getUserName();

  // Canvas state
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
  const router = useRouter();

  const [isInitialized, setIsInitialized] = useState(false);

// Initialize workspace from URL
useEffect(() => {
  // Only run once on mount
  if (isInitialized) return;

  const urlWorkspaceId = params?.id as string;
  const urlAccessLevel = (searchParams?.get('access') as 'view' | 'edit') || 'edit';

  if (urlWorkspaceId) {
    setWorkspaceId(urlWorkspaceId);
    setAccessLevel(urlAccessLevel);
    setIsInitialized(true);
  }
}, []);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((message: WSMessage) => {
    switch (message.type) {
      case 'sync:state':
        // Sync all state from server
        setWorkspaceName(message.state.workspaceName || 'Untitled Workspace');
        setTables(message.state.tables || []);
        setGroups(message.state.groups || []);
        setRelationships(message.state.relationships || []);
        console.log('State synced from server');
        break;

      case 'user:joined':
        console.log(`User ${message.userName} joined`);
        break;

      case 'user:left':
        console.log(`User ${message.userId} left`);
        break;

      case 'users:list':
        setActiveUsers(
          message.users.map((user) => ({
            id: user.id,
            name: user.name,
            color: '#000'
          }))
        );
        break;

      case 'workspace:name':
        setWorkspaceName(message.name);
        break;

      case 'table:create':
        setTables((prev) => [...prev, message.table]);
        break;

      case 'table:update':
        setTables((prev) => prev.map((table) => (table.id === message.tableId ? { ...table, ...message.updates } : table)));
        break;

      case 'table:delete':
        setTables((prev) => prev.filter((table) => table.id !== message.tableId));
        setRelationships((prev) => prev.filter((rel) => rel.fromTableId !== message.tableId && rel.toTableId !== message.tableId));
        break;

      case 'group:create':
        setGroups((prev) => [...prev, message.group]);
        break;

      case 'group:update':
        setGroups((prev) => prev.map((group) => (group.id === message.groupId ? { ...group, ...message.updates } : group)));
        break;

      case 'group:delete':
        setGroups((prev) => prev.filter((group) => group.id !== message.groupId));
        break;

      case 'access:denied':
        alert(message.reason);
        break;

      default:
        break;
    }
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!workspaceId || !currentUserId) return;

    const client = new WebSocketClient({
      workspaceId,
      userId: currentUserId,
      userName: currentUserName,
      accessLevel,
      onMessage: handleWebSocketMessage,
      onConnect: () => {
        setIsConnected(true);
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
      }
    });

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
    client.connect(wsUrl);
    setWsClient(client);

    return () => {
      client.disconnect();
    };
  }, [workspaceId, currentUserId, currentUserName, accessLevel, handleWebSocketMessage]);

  const createNewTable = useCallback(
    (x?: number, y?: number) => {
      if (accessLevel === 'view') {
        alert('You do not have permission to create tables');
        return;
      }

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

      // Broadcast to other users
      if (wsClient && isConnected) {
        wsClient.send({
          type: 'table:create',
          table: newTable
        });
      }
    },
    [tables.length, pan.x, pan.y, zoom, wsClient, isConnected, accessLevel]
  );

  const createNewGroup = useCallback(() => {
    if (accessLevel === 'view') {
      alert('You do not have permission to create groups');
      return;
    }

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

    // Broadcast to other users
    if (wsClient && isConnected) {
      wsClient.send({
        type: 'group:create',
        group: newGroup
      });
    }
  }, [groups.length, wsClient, isConnected, accessLevel]);

  const updateTable = useCallback(
    (tableId: string, updates: Partial<Table>) => {
      if (accessLevel === 'view') {
        alert('You do not have permission to edit tables');
        return;
      }

      setTables((prev) => prev.map((table) => (table.id === tableId ? { ...table, ...updates } : table)));

      // Broadcast to other users
      if (wsClient && isConnected) {
        wsClient.send({
          type: 'table:update',
          tableId,
          updates
        });
      }
    },
    [wsClient, isConnected, accessLevel]
  );

  const updateGroup = useCallback(
    (groupId: string, updates: Partial<Group> & { moveTables?: { deltaX: number; deltaY: number } }) => {
      if (accessLevel === 'view') {
        alert('You do not have permission to edit groups');
        return;
      }

      if (updates.moveTables) {
        const group = groups.find((g) => g.id === groupId);
        if (group) {
          setTables((prev) =>
            prev.map((table) => {
              if (group.tableIds.includes(table.id)) {
                const newPosition = {
                  x: table.position.x + updates.moveTables!.deltaX,
                  y: table.position.y + updates.moveTables!.deltaY
                };

                // Broadcast table position updates
                if (wsClient && isConnected) {
                  wsClient.send({
                    type: 'table:update',
                    tableId: table.id,
                    updates: { position: newPosition }
                  });
                }

                return {
                  ...table,
                  position: newPosition
                };
              }
              return table;
            })
          );
        }
      }

      const { moveTables, ...groupUpdates } = updates;
      setGroups((prev) => prev.map((group) => (group.id === groupId ? { ...group, ...groupUpdates } : group)));

      // Broadcast to other users
      if (wsClient && isConnected) {
        wsClient.send({
          type: 'group:update',
          groupId,
          updates: groupUpdates
        });
      }
    },
    [groups, wsClient, isConnected, accessLevel]
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
            const updatedGroup = { ...group, tableIds: [...group.tableIds, tableId] };

            // Broadcast group update
            if (wsClient && isConnected) {
              wsClient.send({
                type: 'group:update',
                groupId: group.id,
                updates: { tableIds: updatedGroup.tableIds }
              });
            }

            return updatedGroup;
          } else if (assignedGroupId !== group.id && hasTable) {
            const updatedGroup = { ...group, tableIds: group.tableIds.filter((id) => id !== tableId) };

            // Broadcast group update
            if (wsClient && isConnected) {
              wsClient.send({
                type: 'group:update',
                groupId: group.id,
                updates: { tableIds: updatedGroup.tableIds }
              });
            }

            return updatedGroup;
          }

          return group;
        })
      );
    },
    [tables, groups, wsClient, isConnected]
  );

  const deleteTable = useCallback(
    (tableId: string) => {
      if (accessLevel === 'view') {
        alert('You do not have permission to delete tables');
        return;
      }

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

      // Broadcast to other users
      if (wsClient && isConnected) {
        wsClient.send({
          type: 'table:delete',
          tableId
        });
      }
    },
    [selectedTable, editingTable, wsClient, isConnected, accessLevel]
  );

  const deleteGroup = useCallback(
    (groupId: string) => {
      if (accessLevel === 'view') {
        alert('You do not have permission to delete groups');
        return;
      }

      setGroups((prev) => prev.filter((group) => group.id !== groupId));
      if (selectedGroup === groupId) setSelectedGroup(null);

      // Broadcast to other users
      if (wsClient && isConnected) {
        wsClient.send({
          type: 'group:delete',
          groupId
        });
      }
    },
    [selectedGroup, wsClient, isConnected, accessLevel]
  );

  const addRow = useCallback(
    (tableId: string) => {
      if (accessLevel === 'view') {
        alert('You do not have permission to edit tables');
        return;
      }

      const newRow = {
        id: `row_${Date.now()}`,
        name: `column_name`,
        type: 'VARCHAR(255)',
        isPrimary: false,
        isNullable: true
      };

      setTables((prev) =>
        prev.map((table) =>
          table.id === tableId
            ? {
                ...table,
                rows: [...table.rows, newRow]
              }
            : table
        )
      );

      // Broadcast to other users
      if (wsClient && isConnected) {
        const updatedTable = tables.find((t) => t.id === tableId);
        if (updatedTable) {
          wsClient.send({
            type: 'table:update',
            tableId,
            updates: { rows: [...updatedTable.rows, newRow] }
          });
        }
      }
    },
    [tables, wsClient, isConnected, accessLevel]
  );

  const removeRow = useCallback(
    (tableId: string, rowId: string) => {
      if (accessLevel === 'view') {
        alert('You do not have permission to edit tables');
        return;
      }

      setTables((prev) =>
        prev.map((table) => (table.id === tableId ? { ...table, rows: table.rows.filter((row) => row.id !== rowId) } : table))
      );

      // Broadcast to other users
      if (wsClient && isConnected) {
        const updatedTable = tables.find((t) => t.id === tableId);
        if (updatedTable) {
          wsClient.send({
            type: 'table:update',
            tableId,
            updates: { rows: updatedTable.rows.filter((row) => row.id !== rowId) }
          });
        }
      }
    },
    [tables, wsClient, isConnected, accessLevel]
  );

  const updateRow = useCallback(
    (tableId: string, rowId: string, updates: Partial<Row>) => {
      if (accessLevel === 'view') {
        alert('You do not have permission to edit tables');
        return;
      }

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

      // Broadcast to other users
      if (wsClient && isConnected) {
        const updatedTable = tables.find((t) => t.id === tableId);
        if (updatedTable) {
          wsClient.send({
            type: 'table:update',
            tableId,
            updates: {
              rows: updatedTable.rows.map((row) => (row.id === rowId ? { ...row, ...updates } : row))
            }
          });
        }
      }
    },
    [tables, wsClient, isConnected, accessLevel]
  );

  const handleWorkspaceNameChange = useCallback(
    (newName: string) => {
      setWorkspaceName(newName);

      // Broadcast to other users
      if (wsClient && isConnected) {
        wsClient.send({
          type: 'workspace:name',
          name: newName
        });
      }
    },
    [wsClient, isConnected]
  );

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

  const selectedTableData = tables.find((t) => t.id === selectedTable);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gray-50">
        <CanvasHeader
          workspaceName={workspaceName}
          workspaceId={workspaceId}
          onWorkspaceNameChange={handleWorkspaceNameChange}
          activeUsers={activeUsers}
          currentUserId={currentUserId}
          accessLevel={accessLevel}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
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

          {/* Canvas */}
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

          {/* Right Sidebar - Table Editor */}
          {selectedTableData && editingTable === selectedTable && (
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Edit Table</h3>
                {accessLevel === 'view' && <p className="text-sm text-gray-500 mt-1">View only mode</p>}
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <TableEditorForm
                  table={selectedTableData}
                  onUpdateTable={(updates) => updateTable(selectedTable!, updates)}
                  onAddRow={() => addRow(selectedTable!)}
                  onRemoveRow={(rowId) => removeRow(selectedTable!, rowId)}
                  onUpdateRow={(rowId, updates) => updateRow(selectedTable!, rowId, updates)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}
