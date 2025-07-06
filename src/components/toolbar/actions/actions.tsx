export default function ToolbarActions() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <button className="hover:bg-gray-800 px-2 py-1 rounded cursor-pointer">Save</button>
      <button className="hover:bg-gray-800 px-2 py-1 rounded cursor-pointer">Share</button>
      <button className="hover:bg-gray-800 px-2 py-1 rounded hidden sm:inline cursor-pointer">Settings</button>
      <button className="bg-white text-black px-3 py-1 rounded cursor-pointer">Sign In</button>
    </div>
  );
}
