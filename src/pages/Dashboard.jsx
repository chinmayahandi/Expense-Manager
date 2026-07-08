import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import { formatCurrency } from "../utils/categoryHelper";
import {
  LuPlus,
  LuTrendingUp,
  LuTrendingDown,
  LuWallet,
  LuPiggyBank,
  LuArrowRight,
  LuChartPie,
  LuReceipt
} from "react-icons/lu";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import SummaryCard from "../components/SummaryCard";
import ChartCard from "../components/ChartCard";
import TransactionCard from "../components/TransactionCard";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";

// Colors for category distribution chart
const COLORS = [
  "#10B981", // Emerald (Brand)
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F97316", // Orange
  "#06B6D4"  // Cyan
];

// Premium Dashboard visual loading skeletons matching the layout grid
const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Metric Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 h-28 shadow-sm space-y-3">
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
            <div className="h-7 bg-slate-300 rounded w-2/3"></div>
            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
        ))}
      </section>

      {/* Quick Actions Panel */}
      <section className="h-16 bg-white border border-slate-100 rounded-2xl shadow-sm"></section>

      {/* Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 h-80 shadow-sm space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-full bg-slate-50 rounded"></div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 h-80 shadow-sm space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-full bg-slate-50 rounded"></div>
        </div>
      </section>

      {/* Recent Transactions List */}
      <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="h-5 bg-slate-200 rounded w-1/5"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-slate-50 rounded w-full"></div>
        ))}
      </section>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    transactions,
    loadingTransactions,
    currentBalance,
    totalIncome,
    totalExpense,
    savings,
    savingsRate,
    settings,
    deleteTransaction
  } = useExpense();

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Quick action navigation
  const handleQuickAction = (type) => {
    navigate("/add-transaction", { state: { defaultType: type } });
  };

  // Prepare recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  // Compute monthly data dynamically for area chart (last 6 months)
  const getMonthlyChartData = () => {
    const monthlyMap = {};
    
    // Sort transactions chronologically to build the chart flow
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sorted.forEach((t) => {
      const month = new Date(t.date).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit"
      });
      
      if (!monthlyMap[month]) {
        monthlyMap[month] = { name: month, Income: 0, Expense: 0 };
      }
      
      if (t.type === "income") {
        monthlyMap[month].Income += t.amount;
      } else {
        monthlyMap[month].Expense += t.amount;
      }
    });

    const data = Object.values(monthlyMap);
    // If empty, return dummy default flow
    if (data.length === 0) {
      return [
        { name: "May 26", Income: 0, Expense: 0 },
        { name: "Jun 26", Income: 0, Expense: 0 },
        { name: "Jul 26", Income: 0, Expense: 0 }
      ];
    }
    return data;
  };

  // Compute category breakdown data for expenses (Pie Chart)
  const getCategoryChartData = () => {
    const categoryMap = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        if (!categoryMap[t.category]) {
          categoryMap[t.category] = 0;
        }
        categoryMap[t.category] += t.amount;
      });

    return Object.entries(categoryMap).map(([key, val]) => ({
      name: key,
      value: val
    }));
  };

  const monthlyData = getMonthlyChartData();
  const categoryData = getCategoryChartData();

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteTransaction(deleteId);
      } catch (err) {
        console.error("Failed to delete transaction inside dashboard:", err);
      } finally {
        setIsDeleteOpen(false);
        setDeleteId(null);
      }
    }
  };

  if (loadingTransactions) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Current Balance"
          value={formatCurrency(currentBalance, settings.currency)}
          subtitle="Available Cash Flow"
          icon={LuWallet}
          variant="brand"
        />
        <SummaryCard
          title="Total Income"
          value={formatCurrency(totalIncome, settings.currency)}
          subtitle="Cash Inflow this month"
          icon={LuTrendingUp}
          variant="success"
        />
        <SummaryCard
          title="Total Expense"
          value={formatCurrency(totalExpense, settings.currency)}
          subtitle="Cash Outflow this month"
          icon={LuTrendingDown}
          variant="danger"
        />
        <SummaryCard
          title="Savings"
          value={formatCurrency(savings, settings.currency)}
          subtitle={`${savingsRate}% Savings Rate`}
          icon={LuPiggyBank}
          variant="info"
        />
      </section>

      {/* Quick Actions Panel */}
      <section className="bg-white p-4 border border-slate-100 rounded-2xl shadow-card">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Quick Actions
          </span>
          <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => handleQuickAction("expense")}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-xs font-semibold rounded-xl cursor-pointer"
            >
              <LuPlus className="text-sm" /> Add Expense
            </button>
            <button
              onClick={() => handleQuickAction("income")}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors text-xs font-semibold rounded-xl cursor-pointer"
            >
              <LuPlus className="text-sm" /> Add Income
            </button>
            <Link
              to="/reports"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-semibold rounded-xl cursor-pointer"
            >
              <LuChartPie className="text-sm" /> View Reports
            </Link>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Flow */}
        <ChartCard title="Cash Flow Dynamics" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#FFF", borderRadius: "12px", border: "1px solid #F1F5F9", boxShadow: "var(--shadow-card)", fontSize: "12px" }}
              />
              <Area type="monotone" dataKey="Income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="Expense" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Expense Category Pie Breakdown */}
        <ChartCard title="Expense Category Breakdown">
          {categoryData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <LuChartPie className="text-4xl mb-2 text-slate-300 animate-pulse" />
              <span className="text-xs">No expenses logged yet</span>
            </div>
          ) : (
            <div className="flex flex-col justify-between h-full">
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => formatCurrency(val, settings.currency)}
                      contentStyle={{ background: "#FFF", borderRadius: "12px", border: "1px solid #F1F5F9", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-medium pb-2 border-t border-slate-50 pt-3">
                {categoryData.slice(0, 4).map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="truncate">{entry.name}</span>
                  </div>
                ))}
                {categoryData.length > 4 && (
                  <div className="col-span-2 text-center text-slate-400 font-semibold italic text-[9px] mt-0.5">
                    + {categoryData.length - 4} more categories
                  </div>
                )}
              </div>
            </div>
          )}
        </ChartCard>
      </section>

      {/* Recent Transactions List & View All Link */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-base text-slate-800 tracking-tight">
            Recent Transactions
          </h3>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark transition-colors cursor-pointer"
          >
            <span>View All</span>
            <LuArrowRight className="text-sm" />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <EmptyState
            title="No Transactions Logged"
            message="Your transactions list is empty. Add your monthly income or logged expenses to start tracking."
            actionLabel="Add Transaction"
            onAction={() => navigate("/add-transaction")}
            icon={LuReceipt}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {recentTransactions.map((txn) => (
              <TransactionCard
                key={txn.id}
                transaction={txn}
                onEdit={(id) => navigate(`/edit-transaction/${id}`)}
                onDelete={openDeleteModal}
                currencySymbol={settings.currency}
              />
            ))}
          </div>
        )}
      </section>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Transaction?"
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        confirmVariant="danger"
      >
        <div className="space-y-1">
          <p className="leading-relaxed font-semibold text-slate-800 text-sm">
            Are you sure you want to delete this transaction?
          </p>
          <p className="text-slate-400 text-xs">
            This action cannot be undone. It will remove the record permanently from the ledger.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
