export default function CanvasWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative w-full h-full bg-neutral-900 overflow-hidden"
      id="canvas"
    >
      {children}
    </div>
  );
}
