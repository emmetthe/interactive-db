'use client';
import { useParams } from 'next/navigation';
import Canvas from '@/components/canvas/canvas';
import { TableProvider } from '@/context/table/tableProvider';

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  const { id } = useParams();
  const workspaceId = id as string;

  return (
    <div>
      <TableProvider workspaceId={workspaceId}>
        <Canvas />
      </TableProvider>
    </div>
  );
}
