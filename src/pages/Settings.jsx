import React, { useState } from "react";
import { useExpense } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import { CURRENCIES, LANGUAGES } from "../data/dummyData";
import { motion } from "framer-motion";
import {
  LuUser,
  LuGlobe,
  LuCoins,
  LuBell,
  LuInfo,
  LuCheck,
  LuCircleAlert,
  LuEye
} from "react-icons/lu";
import Button from "../components/Button";

const Settings = () => {
  const { settings, updateSettings } = useExpense();
  const { user, updateUser } = useAuth();

  // Local settings form state
  const [userName, setUserName] = useState(user && user.full_name ? user.full_name : "User");
  const [userAvatar, setUserAvatar] = useState(settings.userAvatar);
  const [currencyCode, setCurrencyCode] = useState(settings.currencyCode);
  const [language, setLanguage] = useState(settings.language);
  const [notifications, setNotifications] = useState(settings.notifications);
  const [theme, setTheme] = useState(settings.theme);

  // Success save notice state
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    
    // Find the symbol matching the currency code
    const selectedCurrency = CURRENCIES.find((c) => c.code === currencyCode);
    const symbol = selectedCurrency ? selectedCurrency.symbol : "₹";

    updateSettings({
      userName,
      userAvatar,
      currencyCode,
      currency: symbol,
      language,
      notifications,
      theme
    });

    if (user) {
      updateUser({
        ...user,
        full_name: userName
      });
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Toggle helper for notification switch animation
  const toggleNotifications = () => {
    setNotifications((prev) => !prev);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <section>
        <h2 className="font-display font-bold text-slate-800 text-lg md:text-2xl mt-0 mb-1 tracking-tight">
          Application Preferences
        </h2>
        <p className="text-xs text-slate-500">
          Manage your personal details, localization options, notifications, and core display parameters.
        </p>
      </section>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card Section */}
        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center justify-center space-y-3 md:border-r md:border-slate-50 md:pr-6">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-slate-100">
              <img src={userAvatar} alt="Profile avatar" className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-sm text-slate-800">{user && user.full_name ? user.full_name : "User"}</h4>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Premium Profile</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <LuUser className="text-slate-400" /> Display Username
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all duration-200 text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <LuEye className="text-slate-400" /> Avatar Image URL
              </label>
              <input
                type="text"
                value={userAvatar}
                onChange={(e) => setUserAvatar(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all duration-200 text-slate-800"
              />
            </div>
          </div>
        </section>

        {/* Preferences Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Localization Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <LuGlobe className="text-brand text-lg" />
              <h3 className="font-display font-semibold text-sm text-slate-800">Localization</h3>
            </div>

            {/* Currency Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <LuCoins className="text-slate-400" /> Primary Currency
              </label>
              <select
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200 rounded-xl outline-none focus:border-brand cursor-pointer text-slate-700 appearance-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <LuGlobe className="text-slate-400" /> Default Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200 rounded-xl outline-none focus:border-brand cursor-pointer text-slate-700 appearance-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* System Toggles Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <LuBell className="text-brand text-lg" />
              <h3 className="font-display font-semibold text-sm text-slate-800">Alerts & System</h3>
            </div>

            {/* Notifications Toggle (Animated Spring) */}
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <label className="text-xs font-semibold text-slate-700">Push Notifications</label>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Receive budget status reports, thresholds warnings and logs digests.
                </p>
              </div>
              
              <button
                type="button"
                onClick={toggleNotifications}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none ${
                  notifications ? "bg-brand" : "bg-slate-200"
                }`}
              >
                <motion.div
                  layout
                  className="bg-white w-4.5 h-4.5 rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    marginLeft: notifications ? "auto" : "0px",
                    marginRight: notifications ? "0px" : "auto"
                  }}
                />
              </button>
            </div>

            {/* Mock Dark Theme Toggle */}
            <div className="flex items-center justify-between py-2 border-t border-slate-50 pt-4">
              <div className="space-y-0.5">
                <label className="text-xs font-semibold text-slate-700">Dark Mode (Beta)</label>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Toggle application canvas themes (Interface holds light theme for Phase 1).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none ${
                  theme === "dark" ? "bg-brand" : "bg-slate-200"
                }`}
              >
                <motion.div
                  layout
                  className="bg-white w-4.5 h-4.5 rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    marginLeft: theme === "dark" ? "auto" : "0px",
                    marginRight: theme === "dark" ? "0px" : "auto"
                  }}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Buttons and Success States */}
        <section className="flex items-center justify-between bg-white px-6 py-4 border border-slate-100 rounded-2xl shadow-card">
          <div className="flex items-center gap-2">
            {isSaved ? (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand"
              >
                <LuCheck className="text-sm shrink-0" /> Settings Saved!
              </motion.span>
            ) : (
              <span className="text-[10px] font-semibold text-slate-400 uppercase">
                Edits persist in LocalStorage
              </span>
            )}
          </div>

          <Button type="submit" variant="primary" size="sm" icon={LuCheck} className="cursor-pointer">
            Save Preferences
          </Button>
        </section>
      </form>

      {/* About Section */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
          <LuInfo className="text-slate-400 text-lg" />
          <h3 className="font-display font-semibold text-sm text-slate-800">About SpendWise</h3>
        </div>

        <div className="text-xs text-slate-500 leading-relaxed space-y-2.5">
          <p>
            SpendWise is a premium local fintech portfolio tracker application designed to run entirely client-side.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2 max-w-sm font-medium">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 uppercase">Version</span>
              <span className="text-slate-700">1.0.0 (Phase 1 UI)</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 uppercase">Architecture</span>
              <span className="text-slate-700">React + Vite + Tailwind CSS</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
