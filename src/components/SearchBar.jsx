import React from "react";
import { LuSearch, LuX } from "react-icons/lu";

const SearchBar = ({ value, onChange, placeholder = "Search transactions..." }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
        <LuSearch className="text-lg" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none transition-all duration-200 placeholder-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/5 focus:bg-white text-slate-800"
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <LuX className="text-base" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
