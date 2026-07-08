import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import { LuMail, LuWallet, LuArrowLeft, LuSend, LuLoader } from "react-icons/lu";
import Button from "../components/Button";
import authApi from "../api/authApi";

const CheckEmail = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useExpense();
  const email = searchParams.get("email") || "";
  
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Handle resend countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (!email) {
      showToast("Email address was not found in the URL. Please go back and sign up again.", "error");
      return;
    }

    setIsResending(true);
    try {
      await authApi.resendVerification(email);
      showToast("Verification email resent successfully! Please check your inbox.", "success");
      setCountdown(60); // Start 60-second cooldown
    } catch (err) {
      console.error("Resend verification failure:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to resend verification email";
      showToast(errMsg, "error");
    } finally {
      setIsResending(false);
    }
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
            Verify Your Email
          </h2>
          <div className="w-16 h-16 bg-blue-50 text-brand rounded-full flex items-center justify-center my-2">
            <LuMail className="text-3xl" />
          </div>
          <p className="text-xs text-slate-400 text-center max-w-xs leading-relaxed">
            We have dispatched a verification link to your registered email address:
          </p>
          {email && (
            <p className="text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 max-w-full truncate">
              {email}
            </p>
          )}
          <p className="text-[11px] text-slate-400 text-center max-w-xs mt-1 leading-relaxed">
            Please check your inbox (and spam folder) and click the link to verify your account. The link expires in 24 hours.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <Button
            type="button"
            variant="primary"
            className="w-full font-semibold text-sm cursor-pointer flex justify-center items-center gap-2"
            icon={isResending ? LuLoader : LuSend}
            disabled={isResending || countdown > 0}
            onClick={handleResend}
          >
            {isResending ? (
              <span className="flex items-center gap-1">
                <LuLoader className="animate-spin text-sm" /> Resending...
              </span>
            ) : countdown > 0 ? (
              `Resend Email in ${countdown}s`
            ) : (
              "Resend Verification Email"
            )}
          </Button>

          <div className="text-center text-xs text-slate-400 border-t border-slate-50 pt-5 flex items-center justify-center gap-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-bold text-brand hover:text-brand-dark transition-colors"
            >
              <LuArrowLeft className="text-sm" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
