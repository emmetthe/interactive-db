import HomeButton from './homeButton/homeButton';
import MenuItems from './menu/items/menuItems';
import ProjectTitle from './projectTitle/projectTitle';
import ToolbarActions from './actions/actions';

export default function Toolbar() {
  return (
    <header className="w-full flex flex-wrap items-center justify-between p-1 bg-gray-900 text-white shadow">
      {/* Left Section */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        <HomeButton />
        <MenuItems />
      </div>

      {/* Middle Section (Center Title) */}
      <div className="flex-grow text-center mt-2 sm:mt-0">
        <ProjectTitle />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3 flex-shrink-0 mt-2 sm:mt-0">
        <ToolbarActions />
      </div>
    </header>
  );
}
