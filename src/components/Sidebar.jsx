import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiHome, HiBookOpen, HiClipboardList,
  HiChartBar, HiUser, HiCog, HiLogout, HiAcademicCap, HiX
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", icon: HiHome, label: "Dashboard" },
  { to: "/courses", icon: HiBookOpen, label: "Courses" },
  { to: "/tests", icon: HiClipboardList, label: "Tests" },
  { to: "/leaderboard", icon: HiChartBar, label: "Leaderboard" },
  { to: "/profile", icon: HiUser, label: "Profile" },
];

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-40 flex flex-col shadow-xl
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300 ease-in-out lg:static lg:shadow-none`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <HiAcademicCap className="text-white text-lg" />
            </div>
            <span className="font-bold text-lg gradient-text">Tech Academy</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <HiX className="text-xl" />
          </button>
        </div>

        {/* User avatar */}
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role} • {user?.points || 0} pts</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon className="text-xl flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
          {user?.role === "admin" && (
            <NavLink to="/admin" onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <HiCog className="text-xl flex-shrink-0" />
              <span>Admin Panel</span>
            </NavLink>
          )}
        </nav>

        {/* Streak badge */}
        {(user?.streakDays || 0) > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl px-3 py-2">
              <span className="text-xl">🔥</span>
              <div>
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400">{user.streakDays} Day Streak!</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Keep it up!</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
          <button onClick={handleLogout}
            className="sidebar-link w-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600">
            <HiLogout className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
