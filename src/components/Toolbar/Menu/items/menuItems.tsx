'use client';

import { useState, useRef, useEffect } from 'react';
import MenuButton from '../butons/menuButton';

// Define the menu items and sub-options
export const menuData = {
  File: ['New', 'Open', 'Save', 'Export'],
  Edit: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste'],
  View: ['Zoom In', 'Zoom Out', 'Full Screen'],
  Help: ['Docs', 'About', 'Updates']
} as const;

// Create a type based on the keys of the menuData object
export type Menu = keyof typeof menuData;

export default function MenuItems() {
  const [openMenu, setOpenMenu] = useState<Menu | null>(null);
  // track if user has clicked a menu
  const [hasClicked, setHasClicked] = useState<boolean>(false);

  // Ref to detect clicks outside the menu
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown if the user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
        setHasClicked(false); // reset hover state when clicked outside
      }
    };
    document.addEventListener('mousedown', handleClickOutside); // Listen for clicks outside the menu
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    // Menu bar container
    <nav className="hidden sm:flex space-x-4 text-sm relative z-50" ref={menuRef}>
      {(Object.keys(menuData) as Menu[]).map((menu) => (
        <MenuButton
          key={menu}
          menu={menu}
          items={menuData[menu]}
          isOpen={openMenu === menu}
          setOpenMenu={setOpenMenu}
          hasClicked={hasClicked}
          setHasClicked={setHasClicked}
        />
      ))}
    </nav>
  );
}
