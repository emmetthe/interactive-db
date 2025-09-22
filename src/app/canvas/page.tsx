'use client';
import Canvas from '@/components/canvas/canvas';
import CombinedProvider from '@/context/providers/combinedProvider';

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return (
    <div>
      <CombinedProvider>
        <Canvas />
      </CombinedProvider>
    </div>
  );
}
