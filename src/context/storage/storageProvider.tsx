import React, { useState, useEffect, ReactNode } from 'react';
import { StorageContext, StorageContextType } from './storageContext';
import { getWorkspaceId } from '@/utils/getWorkspaceID';
import { useParams } from 'next/navigation';

// Storage keys for localStorage
const STORAGE_KEYS = {
  WORKSPACE_NAME: 'canvas-workspace-name'
};

// Helper functions for localStorage with error handling
const storage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get item from localStorage: ${key}`, error);
      return null;
    }
  },

  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Failed to set item in localStorage: ${key}`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove item from localStorage: ${key}`, error);
    }
  }
};

interface StorageProviderProps {
  children: ReactNode;
}

// Initialize state synchronously to avoid flash
const initializeState = () => {
  const defaultWorkspaceName = 'Untitled Project';

  try {
    // Get workspace ID
    const currentWorkspaceId = getWorkspaceId();

    // Get workspace name from storage synchronously
    const savedWorkspaceName = storage.get(STORAGE_KEYS.WORKSPACE_NAME);

    return {
      workspaceId: currentWorkspaceId,
      workspaceName: savedWorkspaceName || defaultWorkspaceName
    };
  } catch (error) {
    console.error('Failed to initialize storage:', error);
    return {
      workspaceId: null,
      workspaceName: defaultWorkspaceName
    };
  }
};

export const StorageProvider: React.FC<StorageProviderProps> = ({ children }) => {
  // Initialize state synchronously to prevent flash
  const [state, setState] = useState(() => initializeState());
  const { id } = useParams() as { id: string };
  const defaultWorkspaceName = 'Untitled Project';

  // Only run effect to ensure localStorage is properly set if it wasn't initially
  useEffect(() => {
    try {
      // Ensure the workspace name is saved if it wasn't already
      if (state.workspaceName && !storage.get(STORAGE_KEYS.WORKSPACE_NAME)) {
        storage.set(STORAGE_KEYS.WORKSPACE_NAME, state.workspaceName);
      }
    } catch (error) {
      console.error('Failed to sync storage:', error);
    }
  }, [state.workspaceName]);

  // Actions
  const setWorkspaceId = (id: string) => {
    setState((prev) => ({ ...prev, workspaceId: id }));
    console.warn('setWorkspaceId called - workspace ID is managed by getWorkspaceId function');
  };

  const setWorkspaceName = (name: string) => {
    setState((prev) => ({ ...prev, workspaceName: name }));
    storage.set(STORAGE_KEYS.WORKSPACE_NAME, name);
  };

  const resetWorkspaceName = () => {
    setState((prev) => ({ ...prev, workspaceName: defaultWorkspaceName }));
    storage.set(STORAGE_KEYS.WORKSPACE_NAME, defaultWorkspaceName);
  };

  const getWorkspaceName = (): string => {
    return state.workspaceName || state.workspaceId || defaultWorkspaceName;
  };

  // Context value that matches your interface
  const contextValue: StorageContextType = {
    // State
    workspaceId: state.workspaceId,
    workspaceName: state.workspaceName,

    // Actions
    setWorkspaceId,
    setWorkspaceName,

    // Utility methods
    resetWorkspaceName,
    getWorkspaceName
  };

  return <StorageContext.Provider value={contextValue}>{children}</StorageContext.Provider>;
};
