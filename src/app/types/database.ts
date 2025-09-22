export interface Column {
  id: string;
  name: string;
  type: string;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique?: boolean;
  defaultValue?: string;
}

export interface Table {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  color: string;
  columns: Column[];
}

export interface Relationship {
  id: string;
  name?: string;
  fromTableId: string;
  toTableId: string;
  fromColumnId: string;
  toColumnId: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface Group {
  id: string;
  name: string;
  tableIds: string[];
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  color: string;
}