import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import { CATEGORIES } from "../data/dummyData";
import { motion } from "framer-motion";
import { LuPlus, LuChevronLeft, LuCalendar, LuDollarSign, LuFileText } from "react-icons/lu";
import Button from "../components/Button";

const AddTransaction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addTransaction, settings } = useExpense();

  // Get default type if passed from Dashboard quick action
  const defaultType = location.state?.defaultType || "expense";

  // Form State
  const [type, setType] = useState(defaultType);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[defaultType][0] || "");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // When type toggles, reset the category to the first one in the new type list
  const handleTypeChange = (newType) => {
    if (isSubmitting) return;
    setType(newType);
    setCategory(CATEGORIES[newType][0] || "");
    if (errors.type) {
      setErrors((prev) => ({ ...prev, type: null }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Transaction title is required.";
    }
    if (!amount) {
      newErrors.amount = "Amount is required.";
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid positive number.";
    }
    if (!category) {
      newErrors.category = "Please select a category.";
    }
    if (!date) {
      newErrors.date = "Please select a date.";
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      // Set hours to 0 to compare dates accurately
      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        newErrors.date = "Future dates are not allowed.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isDirty = title.trim() !== "" || amount !== "" || notes.trim() !== "";

  const handleBack = () => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addTransaction({
        title,
        amount: parseFloat(amount),
        type,
        category,
        date,
        notes
      });
      navigate("/transactions");
    } catch (err) {
      console.error("Failed to save transaction:", err);
      if (err.response?.data?.errors) {
        const mappedErrors = {};
        err.response.data.errors.forEach(e => {
          mappedErrors[e.field] = e.message;
        });
        setErrors(mappedErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back navigation header */}
      <section className="flex items-center gap-3">
        <button
          onClick={handleBack}
          disabled={isSubmitting}
          className="p-2 bg-white border border-slate-100 hover:bg-slate-50 transition-colors rounded-xl text-slate-500 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go back"
        >
          <LuChevronLeft className="text-lg" />
        </button>
        <div>
          <h2 className="font-display font-bold text-slate-800 text-lg md:text-xl mt-0 mb-0.5 tracking-tight">
            Log Transaction
          </h2>
          <p className="text-xs text-slate-500">Record a new income entry or expense cashflow.</p>
        </div>
      </section>

      {/* Form Card */}
      <motion.form
        onSubmit={handleSave}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 p-6 rounded-2xl shadow-card space-y-6"
      >
        {/* Type Toggle sliding tab */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-100 p-1 rounded-xl relative w-full sm:max-w-xs">
            {["expense", "income"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                disabled={isSubmitting}
                className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all duration-200 cursor-pointer relative z-10 disabled:opacity-50 disabled:cursor-not-allowed ${
                  type === t ? "text-slate-800 font-semibold" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {type === t && (
                  <motion.div
                    layoutId="activeFormTab"
                    className="absolute inset-0 bg-white shadow-sm rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Input fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Title */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Transaction Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Whole Foods Groceries"
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200 ${
                errors.title
                  ? "border-red-400 focus:ring-red-400/5 focus:border-red-400"
                  : "border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5"
              } text-slate-800 disabled:opacity-50`}
            />
            {errors.title && <p className="text-[11px] text-red-500 font-medium">{errors.title}</p>}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <span className="text-sm font-semibold">{settings.currency}</span>
              </div>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                disabled={isSubmitting}
                className={`w-full pl-9 pr-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200 ${
                  errors.amount
                    ? "border-red-400 focus:ring-red-400/5 focus:border-red-400"
                    : "border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5"
                } text-slate-800 font-display disabled:opacity-50`}
              />
            </div>
            {errors.amount && <p className="text-[11px] text-red-500 font-medium">{errors.amount}</p>}
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200 appearance-none cursor-pointer ${
                errors.category
                  ? "border-red-400 focus:ring-red-400/5 focus:border-red-400"
                  : "border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5"
              } text-slate-700 disabled:opacity-50`}
            >
              {CATEGORIES[type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-[11px] text-red-500 font-medium">{errors.category}</p>}
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all duration-200 ${
                  errors.date
                    ? "border-red-400 focus:ring-red-400/5 focus:border-red-400"
                    : "border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5"
                } text-slate-700 disabled:opacity-50`}
              />
            </div>
            {errors.date && <p className="text-[11px] text-red-500 font-medium">{errors.date}</p>}
          </div>

          {/* Notes / Descriptions */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide a brief comment or details about this entry..."
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all duration-200 text-slate-800 resize-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Buttons Panel */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
          <Button variant="outline" size="sm" onClick={handleBack} disabled={isSubmitting} className="cursor-pointer">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={LuPlus} disabled={isSubmitting} className="cursor-pointer">
            {isSubmitting ? "Saving..." : "Save Transaction"}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default AddTransaction;
