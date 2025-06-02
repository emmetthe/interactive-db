const Header = () => (
  <header className="w-full shadow-md sticky top-0 bg-gray-900 z-50 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold text-blue-400">App Name</div>
      <nav className="hidden md:flex space-x-8 text-sm font-medium">
        <a href="#features" className="hover:text-blue-400">Features</a>
        <a href="#pricing" className="hover:text-blue-400">Pricing</a>
        <a href="#contact" className="hover:text-blue-400">Contact</a>
      </nav>
      <div className="hidden md:block">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Get Started</button>
      </div>
    </div>
  </header>
);

export default Header;
