interface SidebarItemProps {
  label: string; // Text label for the item
  icon: React.ReactElement; // Icon component for the item
  isOpen: boolean; // Whether the sidebar is expanded
  onClick?: () => void; // Optional click handler
}

export default function SidebarItem({ label, icon, isOpen, onClick }: SidebarItemProps) {
  return (
    <div className="relative group">
      {/* Sidebar button with icon and (if open) label */}
      <button
        className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800 transition-colors cursor-pointer"
        onClick={onClick}
      >
        <span className="text-lg">{icon}</span>
        {isOpen && <span className="text-sm">{label}</span>}
      </button>
      {/* Tooltip shown when sidebar is collapsed */}
      {!isOpen && (
        <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
}
