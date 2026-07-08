import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useExpense } from "../context/ExpenseContext";
import {
  LuPlus,
  LuChevronLeft,
  LuChevronRight,
  LuReceiptText,
  LuTrendingUp,
  LuTrendingDown,
  LuCoins
} from "react-icons/lu";
import Button from "../components/Button";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import TransactionTable from "../components/TransactionTable";
import TransactionCard from "../components/TransactionCard";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";

const ITEMS_PER_PAGE = 10;

// Premium loading skeleton for table rows and cards matching Phase 1 style
const TransactionsSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 bg-slate-200 rounded-lg w-48"></div>
          <div className="h-4 bg-slate-100 rounded w-64"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-36 shrink-0"></div>
      </div>

      {/* Counters Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 h-20 space-y-2 shadow-sm">
            <div className="h-3 bg-slate-100 rounded w-16"></div>
            <div className="h-5 bg-slate-200 rounded w-24"></div>
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-16 bg-white border border-slate-100 rounded-2xl shadow-sm"></div>

      {/* Table Card Skeleton */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="h-8 bg-slate-100 rounded w-full"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-slate-50 rounded w-full"></div>
        ))}
      </div>
    </div>
  );
};

const Transactions = () => {
  const navigate = useNavigate();
  const { transactions, loadingTransactions, settings, deleteTransaction } = useExpense();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Calculate overall summary counters for ALL transactions
  const totalCount = transactions.length;
  const incomeCount = transactions.filter((t) => t.type === "income").length;
  const expenseCount = transactions.filter((t) => t.type === "expense").length;

  // Process filters
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search filter: instantly scans title, category, type, and notes
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q) ||
          (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    // Type filter
    if (selectedType !== "all") {
      result = result.filter((t) => t.type === selectedType);
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // Date range filter
    if (startDate) {
      result = result.filter((t) => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
      result = result.filter((t) => new Date(t.date) <= new Date(endDate));
    }

    // Sort order
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === "oldest") {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === "highest") {
        return b.amount - a.amount;
      }
      if (sortBy === "lowest") {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [transactions, search, selectedType, selectedCategory, sortBy, startDate, endDate]);

  // Compute pagination bounds
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE) || 1;
  const page = currentPage > totalPages ? 1 : currentPage;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTransactions, startIndex]);

  // Reset filters helper
  const handleClearFilters = () => {
    setSearch("");
    setSelectedType("all");
    setSelectedCategory("all");
    setSortBy("newest");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  // Handle deletions
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteTransaction(deleteId);
      } catch (err) {
        console.error("Failed to delete transaction inside view:", err);
      } finally {
        setIsDeleteOpen(false);
        setDeleteId(null);
      }
    }
  };

  if (loadingTransactions) {
    return <TransactionsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-slate-800 text-lg md:text-2xl mt-0 mb-1 tracking-tight">
            Transaction Ledger
          </h2>
          <p className="text-xs text-slate-500">
            Search, filter, and audit your incoming and outgoing transactions.
          </p>
        </div>
        
        <Button
          variant="primary"
          icon={LuPlus}
          onClick={() => navigate("/add-transaction")}
          className="shrink-0 cursor-pointer"
        >
          Add Transaction
        </Button>
      </section>

      {/* Overall Summary Counters */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-card flex items-center gap-3.5">
          <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
            <LuCoins className="text-lg" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Transactions</span>
            <span className="text-lg font-bold text-slate-800 font-display">{totalCount}</span>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-card flex items-center gap-3.5">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <LuTrendingUp className="text-lg" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Income Entries</span>
            <span className="text-lg font-bold text-emerald-600 font-display">{incomeCount}</span>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-card flex items-center gap-3.5">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <LuTrendingDown className="text-lg" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expense Entries</span>
            <span className="text-lg font-bold text-rose-500 font-display">{expenseCount}</span>
          </div>
        </div>
      </section>

      {/* Search and Filters grid */}
      <section className="grid grid-cols-1 gap-4">
        <div className="w-full sm:max-w-md">
          <SearchBar value={search} onChange={(val) => { setSearch(val); setCurrentPage(1); }} />
        </div>
        
        <FilterBar
          selectedType={selectedType}
          onChangeType={(val) => { setSelectedType(val); setCurrentPage(1); }}
          selectedCategory={selectedCategory}
          onChangeCategory={(val) => { setSelectedCategory(val); setCurrentPage(1); }}
          sortBy={sortBy}
          onChangeSortBy={(val) => { setSortBy(val); setCurrentPage(1); }}
          startDate={startDate}
          onChangeStartDate={(val) => { setStartDate(val); setCurrentPage(1); }}
          endDate={endDate}
          onChangeEndDate={(val) => { setEndDate(val); setCurrentPage(1); }}
          onClearFilters={handleClearFilters}
        />
      </section>

      {/* Table / List layout based on breakpoints */}
      <section className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <EmptyState
            title="No Results Match Filters"
            message="We couldn't find any transaction matches. Try clearing your search text or resetting filters."
            actionLabel="Reset All Filters"
            onAction={handleClearFilters}
            icon={LuReceiptText}
          />
        ) : (
          <>
            {/* Desktop and Tablet Table view */}
            <div className="hidden md:block">
              <TransactionTable
                transactions={paginatedTransactions}
                onEdit={(id) => navigate(`/edit-transaction/${id}`)}
                onDelete={openDeleteModal}
                currencySymbol={settings.currency}
              />
            </div>

            {/* Mobile Stack view */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {paginatedTransactions.map((txn) => (
                <TransactionCard
                  key={txn.id}
                  transaction={txn}
                  onEdit={(id) => navigate(`/edit-transaction/${id}`)}
                  onDelete={openDeleteModal}
                  currencySymbol={settings.currency}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-card">
                <span className="text-xs font-semibold text-slate-500">
                  Showing <span className="text-slate-800 font-bold">{startIndex + 1}</span>–
                  <span className="text-slate-800 font-bold">{Math.min(startIndex + ITEMS_PER_PAGE, filteredTransactions.length)}</span> of{" "}
                  <span className="text-slate-800 font-bold">{filteredTransactions.length}</span> transactions
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200 cursor-pointer"
                  >
                    <LuChevronLeft className="text-sm" />
                  </button>

                  {/* Numbered Page Links */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                        currentPage === pageNumber
                          ? "bg-brand text-white shadow-sm"
                          : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all duration-200 cursor-pointer"
                  >
                    <LuChevronRight className="text-sm" />
                  </button>
                </div>
              </div>
            )}
          </>
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

export default Transactions;
