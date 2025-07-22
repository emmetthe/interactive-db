export interface StorageConfig {
  defaultId: string;
  defaultName: string;
}

export interface TableColumn {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isNullable: boolean;
}

export interface Table {
  id: string;
  name: string;
  x: number;
  y: number;
  columns: TableColumn[];
}

export interface WorkspaceData {
  tables: Table[];
}
