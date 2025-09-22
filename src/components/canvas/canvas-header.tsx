'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Database, Settings, Share2, Save, ChevronDown } from 'lucide-react';

interface CanvasHeaderProps {
  workspaceName: string;
  onWorkspaceNameChange: (name: string) => void;
}

export default function CanvasHeader({ workspaceName, onWorkspaceNameChange }: CanvasHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(workspaceName);
  const [showSettings, setShowSettings] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNameClick = () => {
    setIsEditing(true);
    setTempName(workspaceName);
  };

  const handleNameSubmit = () => {
    onWorkspaceNameChange(tempName.trim() || 'Untitled Workspace');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempName(workspaceName);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">DataSketch</span>
        </Link>

        <div className="h-6 w-px bg-gray-300" />

        {/* workspace name */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyDown}
            className="text-lg font-medium text-gray-900 bg-transparent border-none outline-none focus:bg-gray-50 px-2 py-1 rounded"
          />
        ) : (
          <button
            onClick={handleNameClick}
            className="text-lg font-medium text-gray-900 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
          >
            {workspaceName}
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
        </button>

        <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* settings section */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* settings drop down*/}
          {showSettings && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <div className="flex space-x-2">
                    <button className="w-6 h-6 rounded bg-white border-2 border-gray-300" />
                    <button className="w-6 h-6 rounded bg-gray-100 border-2 border-transparent" />
                    <button className="w-6 h-6 rounded bg-blue-50 border-2 border-transparent" />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-700">Public workspace</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-700">Allow comments</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* login button */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
