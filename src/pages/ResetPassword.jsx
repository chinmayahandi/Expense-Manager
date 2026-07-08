import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import { LuLock, LuWallet, LuArrowLeft, LuCircleCheck } from "react-icons/lu";
import Button from "../components/Button";
import authApi from "../api/authApi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useExpense();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!password) {
      newErrors.password = "New password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.resetPassword(token, password);
      showToast("Password updated successfully!", "success");
      setIsSuccess(true);
    } catch (err) {
      console.error("Reset password failure:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to reset password. The link may have expired.";
      showToast(errMsg, "error");
      setErrors({ general: errMsg });
    } finally {
      setIsSubmitting(false);
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
            Reset Password
          </h2>
          <p className="text-xs text-slate-400 text-center max-w-xs">
            {isSuccess
              ? "Your password has been changed successfully. You can now sign in."
              : "Enter your new password below to secure your ledger account."}
          </p>
        </div>

        {errors.general && (
          <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
            {errors.general}
          </div>
        )}

        {!isSuccess ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <LuLock className="text-slate-400" /> New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                disabled={isSubmitting}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200 ${
                  errors.password
                    ? "border-red-400 focus:ring-red-400/5 focus:border-red-400"
                    : "border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5"
                } text-slate-800`}
              />
              {errors.password && <p className="text-[10px] text-red-500 font-semibold">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <LuLock className="text-slate-400" /> Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                }}
                disabled={isSubmitting}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200 ${
                  errors.confirmPassword
                    ? "border-red-400 focus:ring-red-400/5 focus:border-red-400"
                    : "border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5"
                } text-slate-800`}
              />
              {errors.confirmPassword && (
                <p className="text-[10px] text-red-500 font-semibold">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4 font-semibold text-sm cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl text-xs leading-relaxed text-center font-medium flex flex-col items-center gap-2">
              <LuCircleCheck className="text-2xl text-emerald-600" />
              Password updated successfully!
            </div>
            <Button
              type="button"
              variant="primary"
              className="w-full font-semibold text-sm cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Go to Sign In
            </Button>
          </div>
        )}

        {/* Back to Login link */}
        {!isSuccess && (
          <div className="text-center text-xs text-slate-400 border-t border-slate-50 pt-5">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-bold text-brand hover:text-brand-dark transition-colors"
            >
              <LuArrowLeft className="text-sm" /> Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
