import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import { storageContext } from './storageContext';
import { StorageConfig } from '@/lib/config';
import { getWorkspaceId } from '@/utils/getWorkspaceID';

interface StorageProviderProps {
  children: ReactNode;
}

export const StorageProvider = ({ children }: StorageProviderProps) => {
  const [config, setConfig] = useState<StorageConfig | undefined>();

  // On initial load: set ID from localStorage or generate a new one
  useEffect(() => {
    const id = getWorkspaceId();
    setConfig({ defaultId: id, defaultName: id }); // Default name is the ID
  }, []);

  // Return current config
  const getConfig = useCallback(async (): Promise<StorageConfig | undefined> => {
    return config;
  }, [config]);

  // Allow updating just the name
  const updateConfig = useCallback(async (updates: Partial<StorageConfig>) => {
    if (!config) return;

    const updatedConfig = {
      ...config,
      ...updates,
    };

    setConfig(updatedConfig);
  }, [config]);

  return (
    <storageContext.Provider value={{ getConfig, updateConfig }}>
      {children}
    </storageContext.Provider>
  );
};
