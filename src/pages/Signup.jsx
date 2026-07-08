import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import { LuUser, LuMail, LuLock, LuWallet, LuArrowRight } from "react-icons/lu";
import Button from "../components/Button";

const Signup = () => {
  const navigate = useNavigate();
  const { showToast } = useExpense();
  const { register } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Full Name is required";
    }
    if (!email) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    if (!password) {
      newErrors.password = "Password is required";
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
      await register(name, email, password);
      showToast("Account created successfully", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup failure:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to register";
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
            Create Profile
          </h2>
          <p className="text-xs text-slate-400">
            Sign up to start tracking your cashflows and budgeting.
          </p>
        </div>

        {errors.general && (
          <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
            {errors.general}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <LuUser className="text-slate-400" /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              placeholder="Alex Mercer"
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200 ${
                errors.name
                  ? "border-red-400 focus:ring-red-400/5 focus:border-red-400"
                  : "border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5"
              } text-slate-800`}
            />
            {errors.name && <p className="text-[10px] text-red-500 font-semibold">{errors.name}</p>}
          </div>

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

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <LuLock className="text-slate-400" /> Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              placeholder="••••••••"
              disabled={isSubmitting}
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
            icon={LuArrowRight}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>

        {/* Login redirection */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-50 pt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-brand hover:text-brand-dark transition-colors"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
