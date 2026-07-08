import React from "react";
import { motion } from "framer-motion";

export const Spinner = ({ size = "md", className = "" }) => {
  const sizeStyles = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeStyles[size]} border-slate-200 border-t-brand rounded-full animate-spin`}
      />
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 bg-slate-100 rounded-xl" />
      <div className="w-16 h-4 bg-slate-100 rounded-md" />
    </div>
    <div className="space-y-2">
      <div className="w-24 h-4 bg-slate-100 rounded-md" />
      <div className="w-32 h-8 bg-slate-100 rounded-lg" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card animate-pulse space-y-6">
    <div className="flex justify-between items-center">
      <div className="w-40 h-5 bg-slate-100 rounded-md" />
      <div className="w-20 h-8 bg-slate-100 rounded-lg" />
    </div>
    <div className="h-64 bg-slate-50 rounded-xl flex items-end justify-between p-4 gap-3">
      <div className="w-full bg-slate-100 rounded-t-md h-[40%]" />
      <div className="w-full bg-slate-100 rounded-t-md h-[75%]" />
      <div className="w-full bg-slate-100 rounded-t-md h-[55%]" />
      <div className="w-full bg-slate-100 rounded-t-md h-[90%]" />
      <div className="w-full bg-slate-100 rounded-t-md h-[30%]" />
      <div className="w-full bg-slate-100 rounded-t-md h-[65%]" />
    </div>
  </div>
);

export const ListSkeleton = ({ rows = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, idx) => (
      <div
        key={idx}
        className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl animate-pulse"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
          <div className="space-y-2">
            <div className="w-32 h-4 bg-slate-100 rounded" />
            <div className="w-20 h-3 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="space-y-2 flex flex-col items-end">
          <div className="w-16 h-4 bg-slate-100 rounded" />
          <div className="w-12 h-3 bg-slate-100 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const Loader = ({ type = "spinner", rows = 4 }) => {
  if (type === "card") return <CardSkeleton />;
  if (type === "chart") return <ChartSkeleton />;
  if (type === "list") return <ListSkeleton rows={rows} />;
  return (
    <div className="flex items-center justify-center p-8">
      <Spinner size="lg" />
    </div>
  );
};

export default Loader;
