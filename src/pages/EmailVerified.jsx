import React from "react";
import { useNavigate } from "react-router-dom";
import { LuCircleCheck, LuWallet } from "react-icons/lu";
import Button from "../components/Button";

const EmailVerified = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-card space-y-6 flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-brand text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20">
            <LuWallet className="text-2xl" />
          </div>
          <h2 className="font-display font-bold text-slate-800 text-2xl tracking-tight text-center">
            Verification Successful
          </h2>
        </div>

        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
          <LuCircleCheck className="text-5xl" />
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-slate-700">
            Thank you for verifying your email address!
          </p>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Your Expense Tracker profile has been fully activated. You are ready to log in and start managing your cashflows.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          className="w-full font-semibold text-sm cursor-pointer mt-4"
          onClick={() => navigate("/login")}
        >
          Sign In Now
        </Button>
      </div>
    </div>
  );
};

export default EmailVerified;
