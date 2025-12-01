import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

interface WorkspaceRouterProps {
  onWorkspaceLoad: (workspaceId: string, accessLevel: 'view' | 'edit') => void;
  children: React.ReactNode;
}

export default function WorkspaceRouter({ onWorkspaceLoad, children }: WorkspaceRouterProps) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const workspaceId = params?.workspaceId as string;
    const accessLevel = (searchParams?.get('access') as 'view' | 'edit') || 'edit';

    if (workspaceId) {
      // Load workspace with specified access level
      onWorkspaceLoad(workspaceId, accessLevel);
      setIsLoading(false);
    } else {
      // No workspace ID - create new workspace or redirect
      const newWorkspaceId = generateWorkspaceId();
      router.push(`/workspace/${newWorkspaceId}`);
    }
  }, [params, searchParams, router, onWorkspaceLoad]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function generateWorkspaceId(): string {
  // Generate a URL-friendly random ID
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}