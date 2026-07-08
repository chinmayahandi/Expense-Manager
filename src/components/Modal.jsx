import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX } from "react-icons/lu";
import Button from "./Button";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel,
  onConfirm,
  confirmVariant = "primary",
  cancelLabel = "Cancel",
  maxWidth = "max-w-md"
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={`relative w-full ${maxWidth} bg-white rounded-2xl border border-slate-100 shadow-xl z-10 overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-display font-semibold text-slate-800 text-base">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <LuX className="text-lg" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 text-sm text-slate-600 flex-grow">
              {children}
            </div>

            {/* Footer */}
            {(onConfirm || onClose) && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                {cancelLabel && (
                  <Button variant="outline" size="sm" onClick={onClose}>
                    {cancelLabel}
                  </Button>
                )}
                {onConfirm && (
                  <Button variant={confirmVariant} size="sm" onClick={onConfirm}>
                    {confirmLabel || "Confirm"}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
