'use client';

import Dropdown from './dropdown';
import { Menu } from './menuItems';

interface MenuButtonProps {
  menu: Menu; // Name of the menu (File, Edit, etc.)
  items: readonly string[]; // Submenu items
  isOpen: boolean; // Whether this menu is currently open
  setOpenMenu: (menu: Menu | null) => void; // Function to open/close menus
  hasClicked: boolean;  // Whether the user has clicked a menu before
  setHasClicked: (clicked: boolean) => void; // Function to set the clicked state
}

export default function MenuButton({ menu, items, isOpen, setOpenMenu, hasClicked, setHasClicked }: MenuButtonProps) {
  return (
    <div
      className="relative"
      onMouseEnter={() => {
        // Only switch on hover after a menu has been clicked
        if (hasClicked) setOpenMenu(menu);
      }}
    >
      <button
        className="hover:underline px-2 py-1"
        onClick={() => {
          setHasClicked(true); // set hover-ready state on first click
          setOpenMenu(isOpen ? null : menu);
        }}
      >
        {menu}
      </button>

      {isOpen && (
        <Dropdown
          items={items}
          onItemClick={(item) => {
            console.log(`${menu} > ${item}`);
            setOpenMenu(null);
            setHasClicked(false); // reset hover-ready after selection
          }}
        />
      )}
    </div>
  );
}
