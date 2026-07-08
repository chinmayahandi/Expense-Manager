import React from "react";
import { motion } from "framer-motion";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { getCategoryIcon, getCategoryColor, formatCurrency, formatDate } from "../utils/categoryHelper";

const TransactionCard = ({ transaction, onEdit, onDelete, currencySymbol = "₹" }) => {
  const { id, title, amount, type, category, date, notes } = transaction;
  const Icon = getCategoryIcon(category);
  const colors = getCategoryColor(category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: "var(--shadow-hover)" }}
      className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-card transition-all duration-200"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Category Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${colors.bg} ${colors.text}`}>
          <Icon className="text-xl" />
        </div>
        
        {/* Details */}
        <div className="min-w-0">
          <h4 className="font-semibold text-sm text-slate-800 truncate leading-snug">{title}</h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${colors.bg} ${colors.text}`}>
              {category}
            </span>
            <span className="text-[11px] text-slate-400">
              {formatDate(date)}
            </span>
          </div>
          {notes && (
            <p className="text-[11px] text-slate-400 mt-1 truncate max-w-[150px] sm:max-w-xs md:max-w-md italic">
              "{notes}"
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Amount */}
        <span
          className={`font-display font-bold text-sm sm:text-base ${
            type === "income" ? "text-emerald-500" : "text-slate-800"
          }`}
        >
          {type === "income" ? "+" : "-"} {formatCurrency(amount, currencySymbol)}
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(id)}
              className="p-1.5 text-slate-400 hover:text-brand hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              title="Edit"
            >
              <LuPencil className="text-sm" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete"
            >
              <LuTrash2 className="text-sm" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionCard;
