'use client';

import SidebarSection from './section/sidebarSection';
import { useState } from 'react';
import {
  FaTable,
  FaProjectDiagram,
  FaFileImport,
  FaFileExport,
  FaThLarge,
  FaSitemap,
  FaMapMarkedAlt,
  FaDrawPolygon,
  FaMousePointer,
  FaPlug,
  FaCommentDots,
  FaMoon,
  FaBorderAll,
  FaCogs
} from 'react-icons/fa';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`bg-gray-900 text-white h-full p-4 transition-all duration-300 flex flex-col ${isOpen ? 'w-48' : 'w-14'}`}>
      <SidebarSection
        title="Project"
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        showToggle
        items={[
          { label: 'New Table', icon: <FaTable /> },
          { label: 'New Relationship', icon: <FaProjectDiagram /> },
          { label: 'Import', icon: <FaFileImport /> },
          { label: 'Export', icon: <FaFileExport /> }
        ]}
      />

      <SidebarSection
        title="View"
        isOpen={isOpen}
        items={[
          { label: 'Grid View', icon: <FaThLarge /> },
          { label: 'ERD View', icon: <FaSitemap /> },
          { label: 'Mini-map', icon: <FaMapMarkedAlt /> },
          { label: 'Grid Toggle', icon: <FaDrawPolygon /> }
        ]}
      />

      <SidebarSection
        title="Tools"
        isOpen={isOpen}
        items={[
          { label: 'Select', icon: <FaMousePointer /> },
          { label: 'Connect', icon: <FaPlug /> },
          { label: 'Comment', icon: <FaCommentDots /> }
        ]}
      />

      <SidebarSection
        title="Settings"
        isOpen={isOpen}
        items={[
          { label: 'Theme', icon: <FaMoon /> },
          { label: 'Snap to Grid', icon: <FaBorderAll /> },
          { label: 'Auto Layout', icon: <FaCogs /> }
        ]}
      />
    </aside>
  );
}
