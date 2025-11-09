import Link from 'next/link';
import { Database } from 'lucide-react';

export default function AuthHeader() {
  return (
    <div className="absolute top-6 left-6">
      <Link 
        href="/" 
        className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors"
      >
        <Database className="h-6 w-6" />
        <span className="text-xl font-bold">DataSketch</span>
      </Link>
    </div>
  );
}