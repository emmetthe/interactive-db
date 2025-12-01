import { Users } from 'lucide-react';

interface User {
  id: string;
  name: string;
  color: string;
}

interface ActiveUsersProps {
  users: User[];
  currentUserId: string;
}

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-teal-500',
];

export default function ActiveUsers({ users, currentUserId }: ActiveUsersProps) {
  const displayUsers = users.slice(0, 5); // Show max 5 avatars
  const remainingCount = users.length - displayUsers.length;

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserColor = (userId: string): string => {
    // Consistent color for each user based on their ID
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
  };

  if (users.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
      <Users className="h-4 w-4 text-gray-500" />
      
      <div className="flex -space-x-2">
        {displayUsers.map((user) => (
          <div
            key={user.id}
            className={`relative w-8 h-8 rounded-full ${getUserColor(user.id)} flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-sm`}
            title={user.id === currentUserId ? `${user.name} (You)` : user.name}
          >
            {getInitials(user.name)}
            
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="relative w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-semibold border-2 border-white shadow-sm">
            +{remainingCount}
          </div>
        )}
      </div>
      
      <span className="text-sm text-gray-600 font-medium">
        {users.length} {users.length === 1 ? 'user' : 'users'}
      </span>
    </div>
  );
}