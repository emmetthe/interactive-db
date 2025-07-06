import Canvas from '@/components/canvas/canvas';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <Canvas />
    </div>
  );
}
