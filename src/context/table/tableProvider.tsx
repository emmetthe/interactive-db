import React, { ReactNode, useState, useCallback, useEffect } from 'react';
import { TableContext } from './tableContext';
import { Table, TableColumn, WorkspaceData } from '@/lib/config';
import { generateId } from '@/utils/getWorkspaceID';

interface TableProviderProps {
  children: ReactNode;
  workspaceId: string;
}

export const TableProvider = ({ children, workspaceId }: TableProviderProps) => {
  const [tables, setTables] = useState<Table[]>([]);

  const STORAGE_KEY = `workspace_${workspaceId}`;

  // Load workspace data on mount
  useEffect(() => {
    loadWorkspace();
  }, [workspaceId]);

  const addTable = useCallback(() => {
    const newTable: Table = {
      id: generateId(),
      name: `Table_${tables.length + 1}`,
      x: 100 + tables.length * 20, // Offset new tables slightly
      y: 100 + tables.length * 20,
      columns: [
        {
          id: generateId(),
          name: 'id',
          type: 'INTEGER',
          isPrimaryKey: true,
          isNullable: false
        }
      ]
    };

    setTables((prev) => [...prev, newTable]);
  }, [tables.length]);

  const updateTablePosition = useCallback((id: string, x: number, y: number) => {
    setTables((prev) => prev.map((table) => (table.id === id ? { ...table, x, y } : table)));
  }, []);

  const updateTableData = useCallback((id: string, updates: Partial<Table>) => {
    setTables((prev) => prev.map((table) => (table.id === id ? { ...table, ...updates } : table)));
  }, []);

  const deleteTable = useCallback((id: string) => {
    setTables((prev) => prev.filter((table) => table.id !== id));
  }, []);

  const saveWorkspace = useCallback(async () => {
    try {
      const workspaceData: WorkspaceData = { tables };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceData));
    } catch (error) {
      console.error('Error saving workspace:', error);
    }
  }, [tables, STORAGE_KEY]);

  const loadWorkspace = useCallback(async () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const workspaceData: WorkspaceData = JSON.parse(savedData);
        setTables(workspaceData.tables || []);
      }
    } catch (error) {
      console.error('Error loading workspace:', error);
    }
  }, [STORAGE_KEY]);

  // Auto-save when tables change
  useEffect(() => {
    if (tables.length > 0) {
      const timeoutId = setTimeout(() => {
        saveWorkspace();
      }, 1000); // Debounce saves by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [tables, saveWorkspace]);

  return (
    <TableContext.Provider
      value={{
        tables,
        addTable,
        updateTablePosition,
        updateTableData,
        deleteTable,
        saveWorkspace,
        loadWorkspace
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
