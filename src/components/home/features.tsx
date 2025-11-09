import { Database, Users, Zap } from 'lucide-react';

export default function Features() {
  return (
    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="text-center p-6">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Database className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Visual Design</h3>
        <p className="text-gray-600">Drag and drop tables, create relationships, and visualize your database structure intuitively.</p>
      </div>
      <div className="text-center p-6">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaborate</h3>
        <p className="text-gray-600">Share your diagrams with team members and work together in real-time.</p>
      </div>
      <div className="text-center p-6">
        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
        <p className="text-gray-600">Build database diagrams quickly with our intuitive drag-and-drop interface.</p>
      </div>
    </div>
  );
}
