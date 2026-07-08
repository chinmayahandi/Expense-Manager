import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNavbar from "../components/MobileNavbar";
import Header from "../components/Header";
import Toast from "../components/Toast";
import { useExpense } from "../context/ExpenseContext";

const MainLayout = () => {
  const { toasts } = useExpense();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen pb-20 lg:pb-0">
        {/* Top Header Banner */}
        <Header />

        {/* Dynamic Page Router Container */}
        <main className="flex-grow px-6 py-2 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation bar */}
      <MobileNavbar />

      {/* Toast popup notifications layer */}
      <Toast toasts={toasts} />
    </div>
  );
};

export default MainLayout;
