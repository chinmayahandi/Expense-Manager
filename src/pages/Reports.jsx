import React, { useState, useMemo } from "react";
import { useExpense } from "../context/ExpenseContext";
import { formatCurrency } from "../utils/categoryHelper";
import { useNavigate } from "react-router-dom";
import {
  LuTrendingUp,
  LuTrendingDown,
  LuPiggyBank,
  LuCalendar,
  LuChartPie,
  LuArrowUpRight,
  LuArrowDownRight,
  LuReceiptText,
  LuCalendarDays,
  LuPlus
} from "react-icons/lu";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import SummaryCard from "../components/SummaryCard";
import ChartCard from "../components/ChartCard";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#F97316"];

// Premium Reports visual loading skeletons matching the layout grid
const ReportsSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 bg-slate-200 rounded-lg w-48"></div>
          <div className="h-4 bg-slate-100 rounded w-64"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-40 shrink-0"></div>
      </div>

      {/* Summary Cards Grid Skeleton */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 h-28 shadow-sm space-y-3">
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
            <div className="h-7 bg-slate-300 rounded w-2/3"></div>
            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
        ))}
      </section>

      {/* Chart Cards Skeleton */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 h-80 shadow-sm space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-full bg-slate-50 rounded"></div>
          </div>
        ))}
      </section>
    </div>
  );
};

const Reports = () => {
  const navigate = useNavigate();
  const { transactions, loadingTransactions, settings } = useExpense();

  // Date Range States
  const [range, setRange] = useState("all-time");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Process filters
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    const now = new Date();
    
    if (range === "this-month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      result = result.filter((t) => new Date(t.date) >= startOfMonth);
    } else if (range === "last-month") {
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      result = result.filter((t) => {
        const d = new Date(t.date);
        return d >= startOfLastMonth && d <= endOfLastMonth;
      });
    } else if (range === "last-3-months") {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      result = result.filter((t) => new Date(t.date) >= threeMonthsAgo);
    } else if (range === "this-year") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      result = result.filter((t) => new Date(t.date) >= startOfYear);
    } else if (range === "custom") {
      if (customStartDate) {
        result = result.filter((t) => new Date(t.date) >= new Date(customStartDate));
      }
      if (customEndDate) {
        result = result.filter((t) => new Date(t.date) <= new Date(customEndDate));
      }
    }
    
    return result;
  }, [transactions, range, customStartDate, customEndDate]);

  // Aggregate metrics based on filtered subset
  const stats = useMemo(() => {
    const incomeTxns = filteredTransactions.filter((t) => t.type === "income");
    const expenseTxns = filteredTransactions.filter((t) => t.type === "expense");

    const totalInflow = incomeTxns.reduce((sum, t) => sum + t.amount, 0);
    const totalOutflow = expenseTxns.reduce((sum, t) => sum + t.amount, 0);
    const savingsAmount = totalInflow - totalOutflow > 0 ? totalInflow - totalOutflow : 0;
    const rate = totalInflow > 0 ? Math.round((savingsAmount / totalInflow) * 100) : 0;

    // Peak Exposure / Transactions
    const highestExpenseTxn = expenseTxns.reduce((max, t) => (!max || t.amount > max.amount ? t : max), null);
    const highestIncomeTxn = incomeTxns.reduce((max, t) => (!max || t.amount > max.amount ? t : max), null);

    // Counts
    const transactionCount = filteredTransactions.length;
    
    // Averages
    const averageExpense = expenseTxns.length > 0 ? Math.round(totalOutflow / expenseTxns.length) : 0;
    const averageIncome = incomeTxns.length > 0 ? Math.round(totalInflow / incomeTxns.length) : 0;

    // Monthly average spend
    const uniqueMonths = new Set(
      filteredTransactions.map((t) =>
        new Date(t.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      )
    );
    const monthsCount = uniqueMonths.size || 1;
    const monthlyAverage = Math.round(totalOutflow / monthsCount);

    return {
      totalInflow,
      totalOutflow,
      savingsAmount,
      rate,
      highestExpenseTxn,
      highestIncomeTxn,
      transactionCount,
      averageExpense,
      averageIncome,
      monthlyAverage,
      monthsCount
    };
  }, [filteredTransactions]);

  // Aggregate monthly trends dynamically
  const monthlyData = useMemo(() => {
    const monthlyMap = {};
    
    // Sort transactions chronologically
    const sorted = [...filteredTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sorted.forEach((t) => {
      const month = new Date(t.date).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit"
      });
      
      if (!monthlyMap[month]) {
        monthlyMap[month] = { name: month, Income: 0, Expense: 0, Savings: 0 };
      }
      
      if (t.type === "income") {
        monthlyMap[month].Income += t.amount;
      } else {
        monthlyMap[month].Expense += t.amount;
      }
    });

    // Calculate savings per month
    Object.keys(monthlyMap).forEach((m) => {
      const diff = monthlyMap[m].Income - monthlyMap[m].Expense;
      monthlyMap[m].Savings = diff > 0 ? diff : 0;
    });

    return Object.values(monthlyMap);
  }, [filteredTransactions]);

  // Aggregate categories for progress bars
  const categorySpending = useMemo(() => {
    const map = {};
    const expenseTxns = filteredTransactions.filter((t) => t.type === "expense");
    
    expenseTxns.forEach((t) => {
      if (!map[t.category]) {
        map[t.category] = 0;
      }
      map[t.category] += t.amount;
    });

    const totalSpent = expenseTxns.reduce((sum, t) => sum + t.amount, 0) || 1;

    return Object.entries(map)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: Math.round((amount / totalSpent) * 100)
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions]);

  if (loadingTransactions) {
    return <ReportsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header & Range Selectors */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-slate-800 text-lg md:text-2xl mt-0 mb-1 tracking-tight">
            Financial Intelligence
          </h2>
          <p className="text-xs text-slate-500">
            Deeper insights into your assets flow, spending trends, and savings metrics.
          </p>
        </div>

        {/* Date Filters Control Block */}
        <div className="flex flex-wrap items-center gap-3">
          {range === "custom" && (
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 border border-slate-200 rounded-xl shadow-sm">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="bg-transparent border-none text-[10px] font-bold outline-none text-slate-600 cursor-pointer"
                aria-label="Custom range start date"
              />
              <span className="text-slate-300 text-xs">-</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="bg-transparent border-none text-[10px] font-bold outline-none text-slate-600 cursor-pointer"
                aria-label="Custom range end date"
              />
            </div>
          )}

          <div className="relative">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="pl-3.5 pr-8 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl outline-none transition-all duration-200 text-slate-700 hover:bg-slate-50 focus:border-brand cursor-pointer appearance-none shadow-sm"
              aria-label="Reports date range filter"
            >
              <option value="all-time">All Time</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="this-year">This Year</option>
              <option value="custom">Custom Date Range</option>
            </select>
            <LuCalendarDays className="absolute right-3 top-2.5 text-slate-400 text-xs pointer-events-none" />
          </div>
        </div>
      </section>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="No Transaction Logs Found"
          message="We couldn't compile financial insights for the selected dates because no cashflows match the filters."
          actionLabel="Log Transaction"
          onAction={() => navigate("/add-transaction")}
          icon={LuReceiptText}
        />
      ) : (
        <>
          {/* Stats Summary Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Cash Inflow"
              value={formatCurrency(stats.totalInflow, settings.currency)}
              subtitle="Cumulative income logged"
              icon={LuTrendingUp}
              variant="success"
            />
            <SummaryCard
              title="Total Cash Outflow"
              value={formatCurrency(stats.totalOutflow, settings.currency)}
              subtitle="Cumulative expenses logged"
              icon={LuTrendingDown}
              variant="danger"
            />
            <SummaryCard
              title="Net Savings"
              value={formatCurrency(stats.savingsAmount, settings.currency)}
              subtitle={`Savings rate: ${stats.rate}%`}
              icon={LuPiggyBank}
              variant="info"
            />
            <SummaryCard
              title="Range Avg Spend"
              value={formatCurrency(stats.monthlyAverage, settings.currency)}
              subtitle={`Averaged over ${stats.monthsCount} month(s)`}
              icon={LuCalendar}
              variant="warning"
            />
          </section>

          {/* Range Averages & Transaction Details List */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-card">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Transactions</span>
              <span className="text-lg font-bold text-slate-800 font-display mt-0.5 block">{stats.transactionCount}</span>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-card">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Income</span>
              <span className="text-lg font-bold text-emerald-600 font-display mt-0.5 block">
                {formatCurrency(stats.averageIncome, settings.currency)}
              </span>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-card">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Expense</span>
              <span className="text-lg font-bold text-rose-500 font-display mt-0.5 block">
                {formatCurrency(stats.averageExpense, settings.currency)}
              </span>
            </div>
          </section>

          {/* Graphs Grid Layout */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income vs Expenses Bar Chart */}
            <ChartCard title="Inflow vs Outflow Comparison">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#FFF", borderRadius: "12px", border: "1px solid #F1F5F9", fontSize: "12px" }}
                    formatter={(val) => formatCurrency(val, settings.currency)}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Savings Trend Line Chart */}
            <ChartCard title="Monthly Savings Trend">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#FFF", borderRadius: "12px", border: "1px solid #F1F5F9", fontSize: "12px" }}
                    formatter={(val) => formatCurrency(val, settings.currency)}
                  />
                  <Line type="monotone" dataKey="Savings" stroke="#3B82F6" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>

          {/* Category Spending Progress Bars & Analytics */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Spending Categories List */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card lg:col-span-2 space-y-6">
              <div>
                <h3 className="font-display font-semibold text-base text-slate-800 tracking-tight">
                  Top Spending Categories
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ranked list of categories where you spent the most cash flow.
                </p>
              </div>

              {categorySpending.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-sm">
                  <LuChartPie className="text-4xl mb-2 text-slate-300" />
                  <span>No expense transactions recorded yet</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {categorySpending.map((cat, idx) => {
                    const colorHex = COLORS[idx % COLORS.length];
                    return (
                      <div key={cat.category} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-700">{cat.category}</span>
                          <div className="space-x-1.5 text-slate-800">
                            <span>{formatCurrency(cat.amount, settings.currency)}</span>
                            <span className="text-slate-400 font-medium">({cat.percentage}%)</span>
                          </div>
                        </div>
                        {/* Progress Track */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${cat.percentage}%`,
                              backgroundColor: colorHex
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dynamic Insights Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card flex flex-col justify-between">
              <div>
                <h3 className="font-display font-semibold text-base text-slate-800 tracking-tight">
                  Financial Insights
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Automated heuristics based on active ledger.
                </p>
              </div>

              <div className="space-y-4 my-6 flex-grow flex flex-col justify-center">
                {/* Savings status advice */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-brand uppercase tracking-wider block">
                    Savings Rating
                  </span>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    {stats.rate >= 30
                      ? "Excellent! Your savings rate is above the recommended 30%. You are building a secure buffer."
                      : stats.rate >= 10
                      ? "Healthy. You are saving some income, but try cutting down on shopping or utility items to reach 30%."
                      : "Caution. Your monthly savings rate is very low. Inspect your highest expense categories."}
                  </p>
                </div>

                {/* Highest single expense stat */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">
                    Peak Exposure
                  </span>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    {stats.highestExpenseTxn ? (
                      <>
                        Your highest expense transaction was{" "}
                        <span className="text-rose-500 font-bold block mt-0.5 text-xs">
                          {stats.highestExpenseTxn.title} (
                          {formatCurrency(stats.highestExpenseTxn.amount, settings.currency)})
                        </span>
                      </>
                    ) : (
                      "No expense transaction logged in this range."
                    )}
                  </p>
                </div>

                {/* Highest single income stat */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                    Peak Inflow
                  </span>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    {stats.highestIncomeTxn ? (
                      <>
                        Your highest income transaction was{" "}
                        <span className="text-emerald-600 font-bold block mt-0.5 text-xs">
                          {stats.highestIncomeTxn.title} (
                          {formatCurrency(stats.highestIncomeTxn.amount, settings.currency)})
                        </span>
                      </>
                    ) : (
                      "No income transaction logged in this range."
                    )}
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-semibold text-center border-t border-slate-50 pt-4">
                System Insights updated just now
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Reports;
