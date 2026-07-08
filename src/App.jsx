import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Loader from "./components/Loader";

// Lazy-loaded page components for instant initial page loading
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const AddTransaction = lazy(() => import("./pages/AddTransaction"));
const EditTransaction = lazy(() => import("./pages/EditTransaction"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const CheckEmail = lazy(() => import("./pages/CheckEmail"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const EmailVerified = lazy(() => import("./pages/EmailVerified"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader type="spinner" />}>
            <Routes>
              {/* Protected Application Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainLayout />}>
                  {/* Root redirect to Dashboard */}
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="add-transaction" element={<AddTransaction />} />
                  <Route path="edit-transaction/:id" element={<EditTransaction />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>

              {/* Authentication Routes (Outside Layout shell) */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/check-email" element={<CheckEmail />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/email-verified" element={<EmailVerified />} />

              {/* 404 Catch All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;

