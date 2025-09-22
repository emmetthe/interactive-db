export interface StorageConfig {
  defaultId: string;
  defaultName: string;
}

export interface WorkspaceData {
  tables: Table[];
}

export interface Column {
  id: string;
  name: string;
  type: string;
  isPrimary: boolean;
  isNullable: boolean;
}

export interface Table {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  color: string;
  columns: Column[];
}

export interface Relationship {
  id: string;
  name?: string;
  fromTableId: string;
  fromColumnId: string;
  toTableId: string;
  toColumnId: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}
