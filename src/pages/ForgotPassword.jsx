import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import { LuMail, LuWallet, LuArrowLeft, LuSend } from "react-icons/lu";
import Button from "../components/Button";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useExpense();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isSent, setIsSent] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is required");
      return;
    }

    // Mock send recovery email
    showToast("Password reset email sent successfully!", "success");
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-card space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-brand text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20">
            <LuWallet className="text-2xl" />
          </div>
          <h2 className="font-display font-bold text-slate-800 text-2xl tracking-tight text-center">
            Recover Password
          </h2>
          <p className="text-xs text-slate-400 text-center max-w-xs">
            {isSent
              ? "Check your email inbox for instructions to reset your password."
              : "Enter your registered email address and we'll send a recovery link."}
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <LuMail className="text-slate-400" /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="name@example.com"
                className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200 ${
                  error
                    ? "border-red-400 focus:ring-red-400/5 focus:border-red-400"
                    : "border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5"
                } text-slate-800`}
              />
              {error && <p className="text-[10px] text-red-500 font-semibold">{error}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4 font-semibold text-sm cursor-pointer"
              icon={LuSend}
            >
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl text-xs leading-relaxed text-center font-medium">
            A password reset link has been dispatched to <span className="font-bold">{email}</span>. Click the link inside to set a new password.
          </div>
        )}

        {/* Back to Login link */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-50 pt-5">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 font-bold text-brand hover:text-brand-dark transition-colors"
          >
            <LuArrowLeft className="text-sm" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
