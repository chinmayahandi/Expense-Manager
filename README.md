# SpendWise — Personal Expense Manager & Budget Tracker

SpendWise is a premium, high-fidelity fintech web application designed to track cash flows, manage budgets, and analyze spending patterns. It is built as a responsive, full-stack application.

- **Production Frontend**: [https://expensemanager-ochre.vercel.app/](https://expensemanager-ochre.vercel.app/)
- **Production Backend**: [https://expensemanager-py2d.onrender.com/](https://expensemanager-py2d.onrender.com/)

---

## 🚀 Tech Stack

### Frontend Client
- **Framework**: React + Vite (JS)
- **Styling**: Tailwind CSS + Custom Vanilla CSS
- **Routing**: React Router DOM (v6+)
- **State & Logic**: Context API (Auth & Transaction layers)
- **Charts**: Recharts (Dynamic Bar, Line, Area & Pie charts)
- **Animations**: Framer Motion
- **Icons**: React Icons (Lucide variant)
- **HTTP Client**: Axios (Auto-injected JWT Interceptors)

### Backend Server
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Hosted on Supabase)
- **ORM/Client**: Supabase JS Database Client
- **Authentication**: JWT (JSON Web Tokens) with auto-token generation
- **Security**: bcryptjs password hashing + CORS enabled

---

## ✨ Core Features

1. **Session & Auth Guards**:
   - Dynamic user login, registration, and session persistence.
   - JWT validation endpoint (`/auth/me`).
   - Route guards preventing unauthorized entry to metrics sheets.
   - Automatic `401 Unauthorized` token expiration catch that logs out users and displays warning notifications.
2. **Dynamic Dashboard Overview**:
   - Net balance, income totals, expense totals, and savings rate calculations.
   - Flow dynamics chart (monthly trends) and Category Breakdown donuts.
   - Quick log buttons (income vs. expense shortcut routes).
3. **Advanced Transaction Ledger**:
   - Instant search queries scan titles, notes, categories, and payment types.
   - Date range boundaries filter history ledger.
   - Dynamic pagination controls with explicit page indicators.
   - Stats summary counters (`Total Transactions`, `Income Count`, `Expense Count`).
4. **Interactive Reports & Insights**:
   - Filter datasets by time frames (`This Month`, `Last Month`, `Last 3 Months`, `This Year`, `Custom Date Range`).
   - Identify peak exposure points (shows transaction name and amount for highest income/expense logs).
   - Dynamic statistics recalculation.
5. **Interactive Preferences Settings**:
   - Direct user profile updating syncing to localStorage and active Auth Context.
   - Localization controls (currency symbol selection, language, notifications).
6. **Polished UX**:
   - Modern visual skeletons (Dashboard, Ledger, Reports) replace generic spinners.
   - Warning prompts when trying to leave forms with unsaved changes.
   - Form controls lock and display progress states (e.g. `Saving...`) during submission.

---

## 🛠️ Local Development Setup

### 1. Backend Server Setup
Navigate into the server folder:
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add your environment configurations:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_api_key
JWT_SECRET=your_jwt_secret_key
```
Start the server in development mode:
```bash
npm run dev
```

### 2. Frontend Client Setup
Navigate back to the project root:
```bash
npm install
```
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.
