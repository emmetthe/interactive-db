import SidebarItem from '../item/sidebarItem';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Item {
  label: string;
  icon: React.ReactElement;
}

interface SidebarSectionProps {
  title: string;
  items: Item[];
  isOpen: boolean;
  showToggle?: boolean;
  onToggle?: () => void;
}

export default function SidebarSection({ title, items, isOpen, showToggle = false, onToggle }: SidebarSectionProps) {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-sm font-semibold mb-2 text-gray-400">
        {isOpen && <span>{title}</span>}
        {showToggle && (
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm"
            title="Toggle Sidebar"
          >
            {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
        )}
      </div>
      <div className="space-y-1">
        {items.map((item, idx) => (
          <SidebarItem key={idx} label={item.label} icon={item.icon} isOpen={isOpen} />
        ))}
      </div>
    </div>
  );
}