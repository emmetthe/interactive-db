import { createContext } from 'react';

// Current state
export interface StorageContextType {
  workspaceId: string | null;
  workspaceName: string | null;

  // Actions
  setWorkspaceId: (id: string) => void;
  setWorkspaceName: (name: string) => void;

  // Utility methods
  resetWorkspaceName: () => void; // Reset to default name
  getWorkspaceName: () => string; // Get current display name (custom or default)
}

export const StorageContext = createContext<StorageContextType>({
  workspaceId: null,
  workspaceName: null,
  setWorkspaceId: () => {},
  setWorkspaceName: () => {},
  resetWorkspaceName: () => {},
  getWorkspaceName: () => ''
});
