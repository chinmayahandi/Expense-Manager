import React from "react";
import {
  LuUtensilsCrossed,
  LuShoppingBag,
  LuCar,
  LuZap,
  LuHeartPulse,
  LuCoins,
  LuLaptop,
  LuHouse,
  LuTrendingUp,
  LuGamepad,
  LuDumbbell,
  LuCircleHelp
} from "react-icons/lu";

export const getCategoryIcon = (category) => {
  const norm = (category || "").toLowerCase().trim();
  
  if (norm.includes("food") || norm.includes("starbucks") || norm.includes("dining")) {
    return LuUtensilsCrossed;
  }
  if (norm.includes("shop") || norm.includes("clothing") || norm.includes("zara")) {
    return LuShoppingBag;
  }
  if (norm.includes("travel") || norm.includes("fuel") || norm.includes("uber") || norm.includes("car") || norm.includes("petrol")) {
    return LuCar;
  }
  if (norm.includes("utilit") || norm.includes("electricity") || norm.includes("internet") || norm.includes("broadband") || norm.includes("bill")) {
    return LuZap;
  }
  if (norm.includes("medic") || norm.includes("pharmacy") || norm.includes("health")) {
    return LuHeartPulse;
  }
  if (norm.includes("salary") || norm.includes("pay")) {
    return LuCoins;
  }
  if (norm.includes("freelance") || norm.includes("consult")) {
    return LuLaptop;
  }
  if (norm.includes("house") || norm.includes("rent") || norm.includes("flat")) {
    return LuHouse;
  }
  if (norm.includes("invest") || norm.includes("dividend") || norm.includes("stock")) {
    return LuTrendingUp;
  }
  if (norm.includes("entertain") || norm.includes("netflix") || norm.includes("movie")) {
    return LuGamepad;
  }
  if (norm.includes("gym") || norm.includes("fitness") || norm.includes("workout")) {
    return LuDumbbell;
  }
  return LuCircleHelp;
};

export const getCategoryColor = (category) => {
  const norm = (category || "").toLowerCase().trim();

  if (norm.includes("food") || norm.includes("starbucks") || norm.includes("dining")) {
    return {
      bg: "bg-amber-50 border-amber-100",
      text: "text-amber-600"
    };
  }
  if (norm.includes("shop") || norm.includes("clothing") || norm.includes("zara")) {
    return {
      bg: "bg-pink-50 border-pink-100",
      text: "text-pink-600"
    };
  }
  if (norm.includes("travel") || norm.includes("fuel") || norm.includes("uber") || norm.includes("car") || norm.includes("petrol")) {
    return {
      bg: "bg-blue-50 border-blue-100",
      text: "text-blue-600"
    };
  }
  if (norm.includes("utilit") || norm.includes("electricity") || norm.includes("internet") || norm.includes("broadband") || norm.includes("bill")) {
    return {
      bg: "bg-purple-50 border-purple-100",
      text: "text-purple-600"
    };
  }
  if (norm.includes("medic") || norm.includes("pharmacy") || norm.includes("health")) {
    return {
      bg: "bg-red-50 border-red-100",
      text: "text-red-600"
    };
  }
  if (norm.includes("salary") || norm.includes("pay")) {
    return {
      bg: "bg-emerald-50 border-emerald-100",
      text: "text-emerald-600"
    };
  }
  if (norm.includes("freelance") || norm.includes("consult")) {
    return {
      bg: "bg-cyan-50 border-cyan-100",
      text: "text-cyan-600"
    };
  }
  if (norm.includes("house") || norm.includes("rent") || norm.includes("flat")) {
    return {
      bg: "bg-orange-50 border-orange-100",
      text: "text-orange-600"
    };
  }
  if (norm.includes("invest") || norm.includes("dividend") || norm.includes("stock")) {
    return {
      bg: "bg-indigo-50 border-indigo-100",
      text: "text-indigo-600"
    };
  }
  if (norm.includes("entertain") || norm.includes("netflix") || norm.includes("movie")) {
    return {
      bg: "bg-rose-50 border-rose-100",
      text: "text-rose-600"
    };
  }
  if (norm.includes("gym") || norm.includes("fitness") || norm.includes("workout")) {
    return {
      bg: "bg-teal-50 border-teal-100",
      text: "text-teal-600"
    };
  }
  return {
    bg: "bg-slate-50 border-slate-100",
    text: "text-slate-600"
  };
};

export const formatCurrency = (amount, symbol = "₹") => {
  return `${symbol}${Math.abs(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};
