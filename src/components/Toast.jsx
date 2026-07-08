import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuCircleCheck, LuTriangleAlert, LuInfo, LuX } from "react-icons/lu";

const toastIcons = {
  success: LuCircleCheck,
  error: LuTriangleAlert,
  info: LuInfo
};

const toastColors = {
  success: "bg-emerald-50 text-emerald-800 border-emerald-100",
  error: "bg-rose-50 text-rose-800 border-rose-100",
  info: "bg-blue-50 text-blue-800 border-blue-100"
};

const Toast = ({ toasts }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toastIcons[toast.type] || LuCheckCircle2;
          const colorClass = toastColors[toast.type] || toastColors.success;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex items-center justify-between p-4 rounded-xl border shadow-lg pointer-events-auto ${colorClass}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="text-lg shrink-0" />
                <span className="text-xs font-semibold">{toast.message}</span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
