import React from "react";
import { motion } from "framer-motion";

const ChartCard = ({ title, children, action, className = "" }) => {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "var(--shadow-hover)" }}
      className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-card transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-base text-slate-800 tracking-tight">
          {title}
        </h3>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="w-full h-72">
        {children}
      </div>
    </motion.div>
  );
};

export default ChartCard;
