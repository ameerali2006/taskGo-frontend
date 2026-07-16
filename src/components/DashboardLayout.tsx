import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  CheckSquare,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  LineChart,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/tasks", icon: LayoutDashboard },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
    { name: "Analytics", path: "/tasks", icon: LineChart },
    { name: "Settings", path: "/tasks", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans w-full relative overflow-hidden">
      {/* Mobile Sidebar Overlay Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* FIXED Left Sidebar (Width exactly 260px, height full screen) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] h-screen bg-white border-r border-slate-200 p-6 flex flex-col justify-between transition-transform duration-300 shrink-0 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-white shadow-md shadow-blue-500/20">
                T
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                TaskGo
              </span>
            </div>
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer border-none bg-transparent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu Navigation */}
          <nav className="flex flex-col gap-1 text-left">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              // Make first item active for demo layout logic
              const isActive = index === 0;
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Section */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition-all text-left w-full cursor-pointer border-none bg-transparent"
        >
          <LogOut className="h-5 w-5 text-slate-400" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content Area Container */}
      <div className="flex-grow flex flex-col h-screen w-full relative">
        {/* FIXED Top Navbar (Height exactly 72px, offset left by 260px on desktop) */}
        <header className="fixed top-0 right-0 left-0 lg:left-[260px] h-[72px] border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 py-4 flex items-center justify-between z-30 box-border">
          <div className="flex items-center gap-4">
            {/* Sidebar toggle button (Mobile) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer border-none bg-transparent"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search Box */}
            <div className="hidden sm:flex items-center relative w-64">
              <Search className="absolute left-3.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-left"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border-none bg-transparent">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
            </button>

            {/* Profile Avatar / User Info */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border-none bg-transparent"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-blue-600 shadow-sm border border-blue-200 text-sm">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-800 tracking-tight leading-none">
                    {user?.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 leading-none">
                    Member
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 z-50 w-48 bg-white border border-slate-100 rounded-xl shadow-xl p-1 text-left"
                    >
                      <div className="px-3 py-2 border-b border-slate-50">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-700 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left border-none bg-transparent"
                      >
                        <LogOut className="h-4.5 w-4.5 text-slate-400" />
                        <span>Log out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Scrollable Content Viewport (offset from top navbar by 72px and left sidebar by 260px on desktop) */}
        <main className="flex-1 pt-[72px] lg:pl-[260px] h-screen overflow-y-auto bg-slate-50 w-full box-border">
          {/* Main content box: Left aligned, maximum width 1400px, 32px padding (p-8) */}
          <div className="max-w-[1400px] w-full mx-auto p-8 flex flex-col gap-8 text-left items-start justify-start box-border">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
