'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CanvasHeader from './canvas-header';
import CanvasSidebar from './canvas-sidebar';
import DatabaseTable from './database-table';
import ContextMenu from './context-menu';
import { Table, Column, Relationship } from '@/types/database';
import { generateTableColor } from '@/lib/utils';

export default function Canvas() {
  const [workspaceName, setWorkspaceName] = useState('Untitled Workspace');
  const [tables, setTables] = useState<Table[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: 'canvas' | 'table';
    tableId?: string;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const lastPanPointRef = useRef({ x: 0, y: 0 });

  const createNewTable = useCallback(
    (x?: number, y?: number) => {
      // If no position specified, create table at the top-left of the current view
      let tableX, tableY;

      if (x !== undefined && y !== undefined) {
        tableX = x;
        tableY = y;
      } else {
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (canvasRect) {
          // Calculate top-left of visible canvas area accounting for pan and zoom
          const topLeftX = 50; // Small margin from the edge
          const topLeftY = 50;

          // Convert from screen coordinates to canvas coordinates
          tableX = (topLeftX - pan.x) / zoom;
          tableY = (topLeftY - pan.y) / zoom;

          // Add staggered offset based on existing tables count to avoid overlap
          const staggerOffset = tables.length * 30; // 30px offset per existing table
          tableX += staggerOffset;
          tableY += staggerOffset;
        } else {
          // Fallback if canvas ref not available
          tableX = 100 + tables.length * 30;
          tableY = 100 + tables.length * 30;
        }
      }

      const newTable: Table = {
        id: `table_${Date.now()}`,
        name: `Table ${tables.length + 1}`,
        position: {
          x: tableX,
          y: tableY
        },
        color: generateTableColor(tables.length),
        columns: [
          {
            id: 'col_1',
            name: 'id',
            type: 'INT',
            isPrimary: true,
            isNullable: false
          },
          {
            id: 'col_2',
            name: 'name',
            type: 'VARCHAR(255)',
            isPrimary: false,
            isNullable: true
          }
        ]
      };

      setTables((prev) => [...prev, newTable]);
    },
    [tables.length, pan.x, pan.y, zoom]
  );

  const updateTable = useCallback((tableId: string, updates: Partial<Table>) => {
    setTables((prev) => prev.map((table) => (table.id === tableId ? { ...table, ...updates } : table)));
  }, []);

  const deleteTable = useCallback((tableId: string) => {
    setTables((prev) => prev.filter((table) => table.id !== tableId));
    setRelationships((prev) => prev.filter((rel) => rel.fromTableId !== tableId && rel.toTableId !== tableId));
  }, []);

  const addColumn = useCallback((tableId: string) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              columns: [
                ...table.columns,
                {
                  id: `col_${Date.now()}`,
                  name: `column_${table.columns.length + 1}`,
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

  const removeColumn = useCallback((tableId: string, columnId: string) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              columns: table.columns.filter((col) => col.id !== columnId)
            }
          : table
      )
    );
  }, []);

  const updateColumn = useCallback((tableId: string, columnId: string, updates: Partial<Column>) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              columns: table.columns.map((col) => (col.id === columnId ? { ...col, ...updates } : col))
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
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanningRef.current) {
      const deltaX = e.clientX - lastPanPointRef.current.x;
      const deltaY = e.clientY - lastPanPointRef.current.y;

      setPan((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));

      lastPanPointRef.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false;
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: 'canvas'
    });
  }, []);

  const handleTableContextMenu = useCallback((e: React.MouseEvent, tableId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: 'table',
      tableId
    });
  }, []);

  const handleTableSelect = useCallback((tableId: string) => {
    setSelectedTable(tableId);
    setIsEditingMode(true);
  }, []);

  const handleCanvasClick = useCallback(() => {
    setSelectedTable(null);
    setIsEditingMode(false);
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
            relationships={relationships}
            selectedTable={selectedTable}
            isEditingMode={isEditingMode}
            onCreateTable={createNewTable}
            onSelectTable={handleTableSelect}
            onUpdateTable={updateTable}
            onDeleteTable={deleteTable}
            onAddColumn={addColumn}
            onRemoveColumn={removeColumn}
            onUpdateColumn={updateColumn}
            onExitEditMode={() => {
              setIsEditingMode(false);
              setSelectedTable(null);
            }}
          />

          <div className="flex-1 relative overflow-hidden">
            <div
              ref={canvasRef}
              className="w-full h-full bg-white cursor-grab"
              style={{
                backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
                backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                backgroundPosition: `${pan.x}px ${pan.y}px`
              }}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onContextMenu={handleContextMenu}
              onClick={handleCanvasClick}
            >
              <div
                className="relative origin-top-left"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
                }}
              >
                {tables.map((table) => (
                  <DatabaseTable
                    key={table.id}
                    table={table}
                    isSelected={selectedTable === table.id}
                    isEditingMode={isEditingMode}
                    onSelect={() => handleTableSelect(table.id)}
                    onUpdate={(updates) => updateTable(table.id, updates)}
                    onContextMenu={(e) => handleTableContextMenu(e, table.id)}
                    onAddColumn={() => addColumn(table.id)}
                    onRemoveColumn={(columnId) => removeColumn(table.id, columnId)}
                    onUpdateColumn={(columnId, updates) => updateColumn(table.id, columnId, updates)}
                  />
                ))}
              </div>
            </div>

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
                onDeleteTable={() => {
                  if (contextMenu.tableId) {
                    deleteTable(contextMenu.tableId);
                  }
                  setContextMenu(null);
                }}
                onAddColumn={() => {
                  if (contextMenu.tableId) {
                    addColumn(contextMenu.tableId);
                  }
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
