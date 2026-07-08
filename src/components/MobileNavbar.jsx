import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LuLayoutDashboard,
  LuReceipt,
  LuPlus,
  LuChartColumn,
  LuSettings
} from "react-icons/lu";

const MobileNavbar = () => {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-slate-100 px-4 py-2 pb-safe-bottom">
      <div className="flex items-center justify-around relative max-w-md mx-auto">
        {/* Dashboard Link */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              isActive ? "text-brand" : "text-slate-400 hover:text-slate-600"
            }`
          }
        >
          <LuLayoutDashboard className="text-xl" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </NavLink>

        {/* Transactions Link */}
        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              isActive ? "text-brand" : "text-slate-400 hover:text-slate-600"
            }`
          }
        >
          <LuReceipt className="text-xl" />
          <span className="text-[10px] font-medium">Transactions</span>
        </NavLink>

        {/* Central Floating Action Button (FAB) for Add Expense */}
        <div className="relative -top-5 shrink-0">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/add-transaction")}
            className="w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center shadow-lg shadow-brand/30 border-4 border-white cursor-pointer"
            aria-label="Add Transaction"
          >
            <LuPlus className="text-2xl" />
          </motion.button>
        </div>

        {/* Reports Link */}
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              isActive ? "text-brand" : "text-slate-400 hover:text-slate-600"
            }`
          }
        >
          <LuChartColumn className="text-xl" />
          <span className="text-[10px] font-medium">Reports</span>
        </NavLink>

        {/* Settings Link */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              isActive ? "text-brand" : "text-slate-400 hover:text-slate-600"
            }`
          }
        >
          <LuSettings className="text-xl" />
          <span className="text-[10px] font-medium">Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default MobileNavbar;
