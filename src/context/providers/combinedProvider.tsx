import React, { ReactNode } from 'react';
import { StorageProvider } from '@/context/storage/storageProvider';
import { TableProvider } from '@/context/table/tableProvider';
import { useParams } from 'next/navigation';

export default function CombinedProvider({ children }: { children: ReactNode }) {
  const { id } = useParams();
  const workspaceId = id as string;

  return (
    <StorageProvider>
      <TableProvider workspaceId={workspaceId}>
        {children}
      </TableProvider>
    </StorageProvider>
  );
}