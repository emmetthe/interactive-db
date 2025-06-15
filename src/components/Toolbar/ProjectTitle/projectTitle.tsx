'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function ProjectTitle() {
  const { id } = useParams();
  const [title, setTitle] = useState<string>(id as string);
  const [editing, setEditing] = useState<boolean>(false);

  return (
    <div className="inline-block max-w-[80vw] sm:max-w-xs min-h-[2.25rem]"> {/* ✅ consistent min height */}
      {editing ? (
        <input
          className="bg-gray-800 text-white text-center border-b border-white outline-none w-full text-lg font-medium truncate"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setEditing(false)}
          autoFocus
        />
      ) : (
        <h2
          className="text-lg font-medium cursor-pointer truncate w-full text-center"
          onClick={() => setEditing(true)}
          title="Click to rename"
        >
          {title}
        </h2>
      )}
    </div>
  );
};

