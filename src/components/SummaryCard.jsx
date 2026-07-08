import React from "react";
import { motion } from "framer-motion";

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "brand", // brand, success, danger, warning, info
  className = ""
}) => {
  const variantStyles = {
    brand: {
      iconBg: "bg-emerald-50 text-brand border border-emerald-100",
      trendColor: "text-emerald-600"
    },
    success: {
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      trendColor: "text-emerald-600"
    },
    danger: {
      iconBg: "bg-rose-50 text-rose-600 border border-rose-100",
      trendColor: "text-rose-600"
    },
    warning: {
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
      trendColor: "text-amber-600"
    },
    info: {
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      trendColor: "text-blue-600"
    }
  };

  const style = variantStyles[variant] || variantStyles.brand;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "var(--shadow-hover)" }}
      className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-card transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl shrink-0 ${style.iconBg}`}>
            <Icon className="text-xl" />
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-800 tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className={`text-xs font-medium ${style.trendColor}`}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default SummaryCard;
