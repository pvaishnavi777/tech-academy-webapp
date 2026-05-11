import { useState } from "react";
import { HiMenu, HiSun, HiMoon, HiBell, HiSearch } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick, title = "" }) => {
  const { dark, toggle } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/courses?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 gap-4 sticky top-0 z-20">
      {/* Menu toggle */}
      <button onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
        <HiMenu className="text-xl" />
      </button>

      {/* Page title */}
      {title && <h1 className="font-bold text-lg text-gray-800 dark:text-gray-100 hidden sm:block">{title}</h1>}

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses, chapters..."
            className="input pl-9 py-2 text-sm"
          />
        </div>
      </form>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle */}
        <button onClick={toggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
          {dark ? <HiSun className="text-xl text-yellow-400" /> : <HiMoon className="text-xl" />}
        </button>

        {/* Notifications */}
        <button onClick={() => navigate("/profile")}
          className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
          <HiBell className="text-xl" />
        </button>

        {/* Avatar */}
        <button onClick={() => navigate("/profile")}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
