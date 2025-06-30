import Sidebar from '@/components/Sidebar/sidebar';
import Toolbar from '@/components/Toolbar/toolbar';
import Canvas from '@/components/Canvas/canvas';

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
