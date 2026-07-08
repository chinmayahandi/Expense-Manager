export const INITIAL_TRANSACTIONS = [
  {
    id: "txn-1",
    title: "Monthly Salary",
    amount: 50000,
    type: "income",
    category: "Salary",
    date: "2026-07-01",
    notes: "Main company payroll credit"
  },
  {
    id: "txn-2",
    title: "Freelance Project Web",
    amount: 12000,
    type: "income",
    category: "Freelance",
    date: "2026-07-04",
    notes: "UI Design mockup delivery for client"
  },
  {
    id: "txn-3",
    title: "Organic Groceries",
    amount: 850,
    type: "expense",
    category: "Food",
    date: "2026-07-05",
    notes: "Weekly veggies and dairy"
  },
  {
    id: "txn-4",
    title: "Zara Brand Shopping",
    amount: 2100,
    type: "expense",
    category: "Shopping",
    date: "2026-07-02",
    notes: "New formal shirt for office"
  },
  {
    id: "txn-5",
    title: "Uber Ride to Airport",
    amount: 650,
    type: "expense",
    category: "Travel",
    date: "2026-07-03",
    notes: "Business trip travel expenses"
  },
  {
    id: "txn-6",
    title: "Electricity Bill Payments",
    amount: 1200,
    type: "expense",
    category: "Utilities",
    date: "2026-07-01",
    notes: "BESCOM monthly electricity charges"
  },
  {
    id: "txn-7",
    title: "Airtel Fiber Broadband",
    amount: 799,
    type: "expense",
    category: "Utilities",
    date: "2026-07-02",
    notes: "Monthly internet charge"
  },
  {
    id: "txn-8",
    title: "Pharmacy Medicals",
    amount: 500,
    type: "expense",
    category: "Medical",
    date: "2026-07-06",
    notes: "Vitamin supplements and pain relief"
  },
  {
    id: "txn-9",
    title: "Car Petrol Refuel",
    amount: 1800,
    type: "expense",
    category: "Travel",
    date: "2026-07-07",
    notes: "HP Petrol pump tank refuel"
  },
  {
    id: "txn-10",
    title: "Starbucks Coffee & Snacks",
    amount: 450,
    type: "expense",
    category: "Food",
    date: "2026-07-07",
    notes: "Meeting with designer colleague"
  },
  {
    id: "txn-11",
    title: "Consultation Fee",
    amount: 1500,
    type: "income",
    category: "Freelance",
    date: "2026-06-28",
    notes: "1-hour mentorship call"
  },
  {
    id: "txn-12",
    title: "Flat Monthly Rent",
    amount: 15000,
    type: "expense",
    category: "Housing",
    date: "2026-06-01",
    notes: "House rent transfer"
  },
  {
    id: "txn-13",
    title: "Mutual Fund SIP Dividend",
    amount: 3500,
    type: "income",
    category: "Investments",
    date: "2026-06-15",
    notes: "Monthly stock market dividend"
  },
  {
    id: "txn-14",
    title: "Gym Membership Renewal",
    amount: 2500,
    type: "expense",
    category: "Health & Fitness",
    date: "2026-06-05",
    notes: "Quarterly fitness pass"
  },
  {
    id: "txn-15",
    title: "Netflix Subscription",
    amount: 649,
    type: "expense",
    category: "Entertainment",
    date: "2026-06-18",
    notes: "Premium Ultra HD Plan"
  }
];

export const CATEGORIES = {
  income: ["Salary", "Freelance", "Investments", "Other Income"],
  expense: ["Food", "Shopping", "Travel", "Utilities", "Medical", "Housing", "Health & Fitness", "Entertainment", "Other Expense"]
};

export const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee (₹)" },
  { code: "USD", symbol: "$", name: "US Dollar ($)" },
  { code: "EUR", symbol: "€", name: "Euro (€)" },
  { code: "GBP", symbol: "£", name: "British Pound (£)" }
];

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "hi", name: "हिन्दी" },
  { code: "fr", name: "Français" }
];
