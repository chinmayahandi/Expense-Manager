import React from "react";
import { motion } from "framer-motion";
import { LuFolderOpen } from "react-icons/lu";
import Button from "./Button";

const EmptyState = ({
  title = "No Transactions Found",
  message = "Try adjusting your search filters or add a new transaction to get started.",
  actionLabel,
  onAction,
  icon: Icon = LuFolderOpen
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl shadow-card"
    >
      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100">
        <Icon className="text-3xl" />
      </div>
      <h3 className="font-display font-semibold text-lg text-slate-800 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
