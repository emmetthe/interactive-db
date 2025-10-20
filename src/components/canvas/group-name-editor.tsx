'use client';

import { useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface GroupNameEditorProps {
  name: string;
  tempName: string;
  isEditing: boolean;
  onTempNameChange: (name: string) => void;
  onSubmit: () => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onCancel: () => void;
}

export default function GroupNameEditor({
  name,
  tempName,
  isEditing,
  onTempNameChange,
  onSubmit,
  onDoubleClick,
  onCancel
}: GroupNameEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div className="absolute top-2 left-2 flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded shadow-sm">
      <GripVertical className="h-4 w-4 text-gray-400" />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={tempName}
          onChange={(e) => onTempNameChange(e.target.value)}
          onBlur={onSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit();
            if (e.key === 'Escape') onCancel();
          }}
          className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none focus:bg-gray-50 px-1 rounded"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      ) : (
        <span 
          className="text-sm font-medium text-gray-900 cursor-text select-none"
          onDoubleClick={onDoubleClick}
        >
          {name}
        </span>
      )}
    </div>
  );
}