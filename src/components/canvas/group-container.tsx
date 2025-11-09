'use client';

import { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { Group } from '@/types/database';
import GroupNameEditor from './group-name-editor';
import ResizeHandle from './resize-handle';

interface GroupContainerProps {
  group: Group;
  zoom: number;
  isSelected: boolean;
  onUpdate: (updates: Partial<Group> & { moveTables?: { deltaX: number; deltaY: number } }) => void;
  onSelect: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const ItemTypes = {
  GROUP: 'group'
};

const GRID_SIZE = 20;

export default function GroupContainer({
  group,
  zoom,
  isSelected,
  onUpdate,
  onSelect,
  onContextMenu
}: GroupContainerProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(group.name);
  const groupRef = useRef<HTMLDivElement>(null);

  const snapToGrid = (x: number, y: number) => {
    const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
    return { x: snappedX, y: snappedY };
  };

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.GROUP,
    item: () => ({
      id: group.id,
      originalPosition: group.position
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta && item.originalPosition) {
        const newX = item.originalPosition.x + delta.x / zoom;
        const newY = item.originalPosition.y + delta.y / zoom;
        const snappedPosition = snapToGrid(newX, newY);
        
        const deltaX = snappedPosition.x - item.originalPosition.x;
        const deltaY = snappedPosition.y - item.originalPosition.y;
        
        onUpdate({ 
          position: snappedPosition,
          moveTables: { deltaX, deltaY }
        });
      }
    },
    canDrag: () => !isResizing && !isEditingName
  });

  drag(groupRef);

  const handleNameDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingName(true);
    setTempName(group.name);
  };

  const handleNameSubmit = () => {
    onUpdate({ name: tempName.trim() || group.name });
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setIsEditingName(false);
    setTempName(group.name);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = document.querySelector('[data-canvas]');
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / zoom;
      const mouseY = (e.clientY - rect.top) / zoom;
      
      const newWidth = Math.max(200, mouseX - group.position.x);
      const newHeight = Math.max(150, mouseY - group.position.y);
      
      onUpdate({ size: { width: newWidth, height: newHeight } });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, group.position, zoom, onUpdate]);

  return (
    <div
      ref={groupRef}
      className={`absolute rounded-lg border-2 transition-all duration-200 ${
        isSelected ? 'border-blue-500' : 'border-gray-300'
      } ${isDragging ? 'opacity-50' : ''}`}
      style={{
        left: group.position.x,
        top: group.position.y,
        width: group.size.width,
        height: group.size.height,
        backgroundColor: group.color,
        zIndex: 1,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onContextMenu={onContextMenu}
    >
      <GroupNameEditor
        name={group.name}
        tempName={tempName}
        isEditing={isEditingName}
        onTempNameChange={setTempName}
        onSubmit={handleNameSubmit}
        onDoubleClick={handleNameDoubleClick}
        onCancel={handleNameCancel}
      />

      <ResizeHandle onMouseDown={handleResizeMouseDown} />
    </div>
  );
}