import Sidebar from '@/components/sidebar/sidebar';
import Toolbar from '@/components/toolbar/toolbar';
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
      {/* <Toolbar />
      <Sidebar /> */}
      <Canvas />
    </div>
  );
}
