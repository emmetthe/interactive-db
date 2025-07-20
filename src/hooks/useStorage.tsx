import { useContext } from 'react';
import { storageContext } from '@/context/storage/storageContext';

export const useStorage = () => useContext(storageContext);