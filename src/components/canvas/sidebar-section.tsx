'use client';

import { ChevronRight, ChevronDown, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface SidebarSectionProps {
  title: string;
  icon: LucideIcon;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export default function SidebarSection({
  title,
  icon: Icon,
  count,
  isExpanded,
  onToggle,
  children
}: SidebarSectionProps) {
  return (
    <div className="p-4 border-t border-gray-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left text-sm font-medium text-gray-900 mb-3"
      >
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4" />
          <span>{title} ({count})</span>
        </div>
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {isExpanded && children}
    </div>
  );
}