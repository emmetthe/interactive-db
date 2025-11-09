'use client';

import { GripVertical } from 'lucide-react';

interface TableHeaderProps {
  name: string;
  color: string;
}

export default function TableHeader({ name, color }: TableHeaderProps) {
  return (
    <div
      className="p-3 rounded-t-lg border-b border-gray-200 font-semibold text-white h-12 flex items-center"
      style={{ backgroundColor: color }}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-sm truncate">{name}</span>
        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
          <GripVertical className="h-4 w-4 opacity-70" />
        </div>
      </div>
    </div>
  );
}