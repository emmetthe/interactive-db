// src/app/[id]/page.tsx
type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  const { id } = params;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to page: {id}</h1>
      <p>This page was generated using the ID in the URL.</p>
    </div>
  );
}
