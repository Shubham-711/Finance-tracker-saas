import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, Target, BarChart3, X } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { name: "Goals", path: "/goals", icon: Target },
  { name: "Reports", path: "/reports", icon: BarChart3 },
];

const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      {/* DARK OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
        ></div>
      )}

      {/* SLIDE-IN SIDEBAR */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: open ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 140 }}
        className="fixed left-0 top-0 h-screen w-64 bg-[#0d0d12]/80 backdrop-blur-xl 
        border-r border-white/10 z-30 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h1 className="text-xl font-semibold text-white tracking-wide">
            Finance Tracker
          </h1>

          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg 
                text-gray-400 hover:text-white hover:bg-white/10 
                transition-all duration-200 ${
                  isActive ? "text-white bg-white/10" : ""
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 px-6 text-gray-500 text-xs">
          v1.0.0
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
