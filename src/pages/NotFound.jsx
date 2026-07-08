import React from "react";
import { useNavigate } from "react-router-dom";
import { LuCircleAlert, LuHouse } from "react-icons/lu";
import Button from "../components/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-card flex flex-col items-center text-center space-y-6">
        {/* Logo/Alert */}
        <div className="w-16 h-16 bg-brand-light text-brand rounded-2xl flex items-center justify-center shadow-lg shadow-brand/10 border border-brand/10">
          <LuCircleAlert className="text-3xl animate-bounce" />
        </div>

        {/* Error Info */}
        <div className="space-y-2">
          <h1 className="font-display font-black text-slate-800 text-5xl tracking-tight my-0">
            404
          </h1>
          <h2 className="font-display font-bold text-slate-700 text-lg tracking-tight my-0">
            Page Not Found
          </h2>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed mx-auto">
            The page you are trying to visit does not exist or has been relocated to another address.
          </p>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          icon={LuHouse}
          onClick={() => navigate("/dashboard")}
          className="w-full font-semibold text-sm cursor-pointer"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
