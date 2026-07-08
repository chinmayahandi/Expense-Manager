import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import { LuMail, LuLock, LuWallet, LuArrowRight } from "react-icons/lu";
import Button from "../components/Button";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useExpense();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (localStorage.getItem("session_expired") === "true") {
      showToast("Your session has expired. Please log in again.", "error");
      localStorage.removeItem("session_expired");
    }

    const verified = searchParams.get("verified");
    const errorType = searchParams.get("error");
    if (verified === "true") {
      showToast("Email verified successfully! You can now log in.", "success");
      navigate("/login", { replace: true });
    } else if (verified === "false") {
      if (errorType === "expired") {
        showToast("Verification link has expired. Please request a new one.", "error");
      } else {
        showToast("Email verification failed. The link may be invalid or expired.", "error");
      }
      navigate("/login", { replace: true });
    }
  }, [searchParams, showToast, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    if (!password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      showToast("Logged in successfully!", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failure:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to log in";
      showToast(errMsg, "error");
      
      if (err.response?.data?.errors) {
        const mappedErrors = {};
        err.response.data.errors.forEach(e => {
          mappedErrors[e.field] = e.message;
        });
        setErrors(mappedErrors);
      } else {
        setErrors({ general: errMsg });
      }
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
          <h2 className="font-display font-bold text-slate-800 text-2xl tracking-tight">
            Welcome back
          </h2>
          <p className="text-xs text-slate-400">
            Enter your credentials to access your financial ledger.
          </p>
        </div>

        {errors.general && (
          <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
            {errors.general}
          </div>
        )}

        {/* Input Fields */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <LuMail className="text-slate-400" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              placeholder="name@example.com"
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200 ${
                errors.email
                  ? "border-red-400 focus:ring-red-400/5 focus:border-red-400"
                  : "border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5"
              } text-slate-800`}
            />
            {errors.email && <p className="text-[10px] text-red-500 font-semibold">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <LuLock className="text-slate-400" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              placeholder="••••••••"
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200 ${
                errors.password
                  ? "border-red-400 focus:ring-red-400/5 focus:border-red-400"
                  : "border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5"
              } text-slate-800`}
            />
            {errors.password && <p className="text-[10px] text-red-500 font-semibold">{errors.password}</p>}
          </div>

          {/* Remember me & Forgot password row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 font-medium text-slate-500 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-brand focus:ring-brand border-slate-200 cursor-pointer accent-brand"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="font-semibold text-brand hover:text-brand-dark transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-4 font-semibold text-sm cursor-pointer"
            icon={LuArrowRight}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* Signup redirection */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-50 pt-5">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-brand hover:text-brand-dark transition-colors"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
