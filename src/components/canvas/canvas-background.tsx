'use client';

import { forwardRef, ReactNode } from 'react';

interface CanvasBackgroundProps {
  zoom: number;
  pan: { x: number; y: number };
  onWheel: (e: React.WheelEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onClick: () => void;
  children: ReactNode;
}

const CanvasBackground = forwardRef<HTMLDivElement, CanvasBackgroundProps>(
  (
    {
      zoom,
      pan,
      onWheel,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onContextMenu,
      onClick,
      children
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-canvas
        className="w-full h-full bg-white cursor-grab"
        style={{
          backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onContextMenu={onContextMenu}
        onClick={onClick}
      >
        <div
          className="relative origin-top-left"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

CanvasBackground.displayName = 'CanvasBackground';

export default CanvasBackground;