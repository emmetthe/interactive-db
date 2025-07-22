import { createContext } from 'react';
import { Table } from '@/lib/config';

export interface TableContextType {
  tables: Table[];
  addTable: () => void;
  updateTablePosition: (id: string, x: number, y: number) => void;
  updateTableData: (id: string, updates: Partial<Table>) => void;
  deleteTable: (id: string) => void;
  saveWorkspace: () => Promise<void>;
  loadWorkspace: () => Promise<void>;
}

export const TableContext = createContext<TableContextType>({
  tables: [],
  addTable: () => {},
  updateTablePosition: () => {},
  updateTableData: () => {},
  deleteTable: () => {},
  saveWorkspace: async () => {},
  loadWorkspace: async () => {}
});
