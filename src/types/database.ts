export interface Row {
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
  rows: Row[];
  size: {
    width: number;
    height: number;
  }
}

export interface Relationship {
  id: string;
  name?: string;
  fromTableId: string;
  toTableId: string;
  fromRowId: string;
  toRowId: string;
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

export interface ContextMenuProps {
  x: number;
  y: number;
  type: 'canvas' | 'table' | 'group';
  onClose: () => void;
  onCreateTable: () => void;
  onCreateGroup?: () => void;
  onDeleteTable?: () => void;
  onDeleteGroup?: () => void;
  onAddRow?: () => void;
}