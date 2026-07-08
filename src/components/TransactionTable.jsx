import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuPencil, LuTrash2, LuTrendingUp, LuTrendingDown } from "react-icons/lu";
import { getCategoryColor, getCategoryIcon, formatCurrency, formatDate } from "../utils/categoryHelper";

const TransactionTable = ({
  transactions,
  onEdit,
  onDelete,
  currencySymbol = "₹"
}) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">Transaction</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence initial={false}>
              {transactions.map((txn, index) => {
                const { id, title, amount, type, category, date, notes } = txn;
                const colors = getCategoryColor(category);
                const Icon = getCategoryIcon(category);

                return (
                  <motion.tr
                    key={id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                    className="hover:bg-slate-50/40 transition-colors group"
                  >
                    {/* Transaction Icon & Title */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${colors.bg} ${colors.text}`}>
                          <Icon className="text-base" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-slate-800 truncate max-w-[180px]">
                            {title}
                          </p>
                          {notes && (
                            <p className="text-[10px] text-slate-400 truncate max-w-[180px]" title={notes}>
                              {notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category Label */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md ${colors.bg} ${colors.text}`}>
                        {category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      {formatDate(date)}
                    </td>

                    {/* Type Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {type === "income" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <LuTrendingUp className="text-xs" /> Income
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          <LuTrendingDown className="text-xs" /> Expense
                        </span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 whitespace-nowrap text-right font-display font-bold text-sm">
                      <span className={type === "income" ? "text-emerald-500" : "text-slate-800"}>
                        {type === "income" ? "+" : "-"} {formatCurrency(amount, currencySymbol)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEdit(id)}
                          className="p-1.5 text-slate-400 hover:text-brand hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <LuPencil className="text-sm" />
                        </button>
                        <button
                          onClick={() => onDelete(id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <LuTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
