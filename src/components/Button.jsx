import React from "react";
import { motion } from "framer-motion";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  icon: Icon
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5 rounded-2xl"
  };

  const variantStyles = {
    primary: "bg-brand text-white hover:bg-brand-dark focus:ring-brand shadow-sm shadow-brand/20",
    secondary: "bg-brand-light text-brand hover:bg-brand/10 focus:ring-brand",
    outline: "border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-300",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm shadow-red-500/20",
    flat: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300"
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { y: -1, scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon className="text-lg shrink-0" />}
      <span>{children}</span>
    </motion.button>
  );
};

export default Button;
