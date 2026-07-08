import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import { LuBell, LuSparkles } from "react-icons/lu";

const Header = () => {
  const { settings } = useExpense();
  const { user, isLoggedIn } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  // Determine greeting based on local time
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 17) return "Good afternoon";
    return "Good evening";
  };

  const notificationItems = [
    { id: 1, text: "Your Freelance Payment of ₹12,000 cleared.", time: "2 hours ago" },
    { id: 2, text: "Budget Alert: Shopping is at 80% of limit.", time: "1 day ago" }
  ];

  const displayName = user && user.full_name ? user.full_name : "User";

  return (
    <header className="relative flex items-center justify-between px-6 py-5 bg-transparent">
      {/* Greetings */}
      <div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-brand uppercase tracking-wider">
          <LuSparkles className="text-xs animate-pulse" />
          <span>Overview Dashboard</span>
        </div>
        <h2 className="font-display font-bold text-slate-800 text-lg md:text-2xl mt-0.5 mb-0 tracking-tight">
          {getGreeting()}, <span className="text-brand">{displayName}</span>!
        </h2>
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-4 shrink-0">
        {!isLoggedIn ? (
          /* Auth Buttons */
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-brand hover:bg-brand-dark text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-sm shadow-brand/15 cursor-pointer"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <>
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 bg-white border border-slate-100 hover:bg-slate-50 transition-colors rounded-xl flex items-center justify-center text-slate-500 shadow-sm relative cursor-pointer"
                aria-label="View notifications"
              >
                <LuBell className="text-lg" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-500/10 animate-pulse" />
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl border border-slate-100 shadow-xl z-40 py-2.5 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between">
                      <h4 className="font-semibold text-xs text-slate-700">Notifications</h4>
                      <span className="text-[10px] text-brand font-semibold">Mark all read</span>
                    </div>
                    <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto">
                      {notificationItems.map((item) => (
                        <div key={item.id} className="p-3.5 hover:bg-slate-50/50 transition-colors">
                          <p className="text-xs text-slate-600 leading-normal">{item.text}</p>
                          <span className="text-[9px] text-slate-400 font-medium block mt-1">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar Link */}
            <Link
              to="/settings"
              className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm hover:scale-105 transition-transform duration-200"
            >
              <img
                src={settings.userAvatar}
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
