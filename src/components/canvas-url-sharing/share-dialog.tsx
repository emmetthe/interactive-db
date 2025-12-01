import { useState } from 'react';
import { X, Copy, Check, Link2, Users } from 'lucide-react';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
}

export default function ShareDialog({ isOpen, onClose, workspaceId, workspaceName }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit'>('edit');

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/canvas/${workspaceId}`;
  const shareUrlWithAccess = `${shareUrl}?access=${accessLevel}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrlWithAccess);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Collaborate on ${workspaceName}`,
          text: `Join me in editing this DataSketch workspace: ${workspaceName}`,
          url: shareUrlWithAccess
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Share Workspace</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workspace Name */}
        <p className="text-sm text-gray-600 mb-4">Share "{workspaceName}" with others to collaborate in real-time</p>

        {/* Access Level */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setAccessLevel('view')}
              className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                accessLevel === 'view'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              View Only
            </button>
            <button
              onClick={() => setAccessLevel('edit')}
              className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                accessLevel === 'edit'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              Can Edit
            </button>
          </div>
        </div>

        {/* Share Link */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 overflow-hidden">
              <div className="flex items-center space-x-2">
                <Link2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{shareUrlWithAccess}</span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Native Share Button (if supported) */}
        {navigator.share && (
          <button
            onClick={handleShare}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mb-4"
          >
            Share via...
          </button>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> Anyone with this link will be able to {accessLevel === 'edit' ? 'view and edit' : 'view'} this workspace
            in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
