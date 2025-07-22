import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import SidebarItem from '../item/sidebarItem';

interface SidebarSectionProps {
  title: string; // Section title (e.g., "Project", "View")
  isOpen: boolean; // Whether the sidebar is expanded
  items: { label: string; icon: React.ReactElement; onClick?: () => void }[]; // List of items in the section
  showToggle?: boolean; // show the expand/collapse toggle
  onToggle?: () => void; // Handler for toggling sidebar open/close
}

export default function SidebarSection({ title, isOpen, items, showToggle = false, onToggle }: SidebarSectionProps) {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-2">
        {/* Show section title if sidebar is open */}
        {isOpen && <span className="font-semibold text-xs uppercase tracking-wider">{title}</span>}
        {/* Toggle button for expanding/collapsing sidebar */}
        {showToggle && (
          <button
            onClick={onToggle}
            className="ml-auto text-gray-400 hover:text-white transition-colors text-xs"
            aria-label="Toggle sidebar"
          >
            {/* Simple icon for toggle */}
            {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
        )}
      </div>
      {/* Render each sidebar item */}
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <SidebarItem key={item.label} label={item.label} icon={item.icon} isOpen={isOpen} onClick={item.onClick} />
        ))}
      </div>
    </section>
  );
}
