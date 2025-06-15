'use client';

// List of submenu options
interface DropdownProps {
  items: readonly string[];
  onItemClick: (item: string) => void; // Function to run when an item is clicked
}

export default function Dropdown({ items, onItemClick }: DropdownProps) {
  return (
    // Dropdown container
    <div className="absolute left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
      {/* Render each submenu option */}
      {items.map((item) => (
        <button
          key={item}
          className="block w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
          onClick={() => onItemClick(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
