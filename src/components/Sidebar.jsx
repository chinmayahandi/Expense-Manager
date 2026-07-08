import { NavLink, useNavigate } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import {
  LuLayoutDashboard,
  LuReceipt,
  LuChartColumn,
  LuSettings,
  LuWallet,
  LuChevronRight,
  LuLogOut
} from "react-icons/lu";

const Sidebar = () => {
  const { settings, showToast } = useExpense();
  const { logout, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LuLayoutDashboard },
    { name: "Transactions", path: "/transactions", icon: LuReceipt },
    { name: "Reports", path: "/reports", icon: LuChartColumn },
    { name: "Settings", path: "/settings", icon: LuSettings }
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-50">
        <div className="w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand/10 shrink-0">
          <LuWallet className="text-xl" />
        </div>
        <div>
          <h1 className="font-display font-bold text-base text-slate-800 tracking-tight my-0">
            SpendWise
          </h1>
          <p className="text-[10px] font-semibold text-brand tracking-widest uppercase">
            Expense Manager
          </p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-brand/5 text-brand"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="text-lg" />
                <span>{item.name}</span>
              </div>
            </NavLink>
          );
        })}
        
        {/* Log Out button */}
        {isLoggedIn && (
          <button
            onClick={() => {
              logout();
              showToast("Logged out successfully!", "info");
              navigate("/login");
            }}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50/50 transition-all duration-200 cursor-pointer mt-4"
          >
            <div className="flex items-center gap-3">
              <LuLogOut className="text-lg" />
              <span>Log Out</span>
            </div>
          </button>
        )}
      </nav>

      {/* User profile footer info */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/20 m-4 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={settings.userAvatar}
            alt={user && user.full_name ? user.full_name : "User"}
            className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm"
          />
          <div className="min-w-0">
            <h4 className="font-semibold text-xs text-slate-800 truncate">
              {user && user.full_name ? user.full_name : "User"}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">
              Active Member
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
