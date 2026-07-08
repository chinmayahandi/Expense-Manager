import React from "react";
import { CATEGORIES } from "../data/dummyData";
import { LuFilter, LuArrowUpDown, LuCalendar } from "react-icons/lu";

const FilterBar = ({
  selectedType,
  onChangeType,
  selectedCategory,
  onChangeCategory,
  sortBy,
  onChangeSortBy,
  startDate,
  onChangeStartDate,
  endDate,
  onChangeEndDate,
  onClearFilters
}) => {
  // Combine all categories for the dropdown list
  const allCategories = [
    ...CATEGORIES.income,
    ...CATEGORIES.expense
  ];
  const uniqueCategories = Array.from(new Set(allCategories));

  // Determine if any filters are active to conditionally render the Clear button
  const hasActiveFilters =
    selectedType !== "all" ||
    selectedCategory !== "all" ||
    sortBy !== "newest" ||
    startDate !== "" ||
    endDate !== "";

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 border border-slate-100 rounded-2xl shadow-card">
      {/* Type Toggle Segmented Controls */}
      <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start xl:self-auto">
        {["all", "income", "expense"].map((type) => (
          <button
            key={type}
            onClick={() => onChangeType(type)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all duration-200 cursor-pointer ${
              selectedType === type
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Select Dropdowns & Date Pickers */}
      <div className="flex flex-wrap items-center gap-3 w-full xl:justify-end">
        {/* Date Range Selection */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-xl">
          <LuCalendar className="text-slate-400 text-xs shrink-0" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => onChangeStartDate(e.target.value)}
            className="bg-transparent border-none text-[11px] outline-none text-slate-600 cursor-pointer font-medium"
            placeholder="Start"
            aria-label="Start date filter"
          />
          <span className="text-slate-300 text-xs">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onChangeEndDate(e.target.value)}
            className="bg-transparent border-none text-[11px] outline-none text-slate-600 cursor-pointer font-medium"
            placeholder="End"
            aria-label="End date filter"
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-1.5 min-w-[130px] relative">
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <LuFilter className="text-xs" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => onChangeCategory(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 text-slate-700 hover:bg-slate-100 focus:border-brand cursor-pointer appearance-none"
            aria-label="Category filter"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 min-w-[130px] relative">
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <LuArrowUpDown className="text-xs" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => onChangeSortBy(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 text-slate-700 hover:bg-slate-100 focus:border-brand cursor-pointer appearance-none"
            aria-label="Sort transactions"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-3.5 py-2 text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 cursor-pointer shrink-0 border border-red-100"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
