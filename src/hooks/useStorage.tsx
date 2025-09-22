import { useContext } from 'react';
import { StorageContext, StorageContextType } from '@/context/storage/storageContext';


export const useStorage = (): StorageContextType => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};
