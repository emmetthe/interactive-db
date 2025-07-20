import { createContext } from 'react';
import { StorageConfig } from '@/lib/config';

export interface StorageContext {
  getConfig: () => Promise<StorageConfig | undefined>;
  updateConfig: (config: Partial<StorageConfig>) => Promise<void>;
};

export const storageContext = createContext<StorageContext>({
  getConfig:(): any => undefined,
  updateConfig: (): any => undefined,
});
