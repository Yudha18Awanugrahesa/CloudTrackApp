import React, { useState, useEffect, useMemo } from "react";
import {
  Home,
  List,
  TrendingUp,
  Target,
  PieChart as PieChartIcon,
  Settings,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertCircle,
  CheckCircle2,
  X,
  Menu,
  Calendar,
  CreditCard,
  Tag,
  Zap,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import logoImage from './assets/cloudtrack-logo.jpg';


const CATEGORI_PEMASUKAN = [
  "Gaji",
  "Uang saku",
  "Bonus",
  "Penjualan Barang/Jasa",
  "Lainnya",
];
const CATEGORI_PENGELUARAN = [
  "Makanan/Minuman",
  "Transportasi",
  "Tagihan",
  "Belanja",
  "Hiburan",
  "Personal Care",
  "Pendidikan",
  "Kebutuhan Darurat",
  "Smoking",
  "Lainnya",
];
const METODE_PEMBAYARAN = ["Cash", "Transfer", "E-wallet"];
const TABS = [
  "Dashboard",
  "Transaksi",
  "Cash Flow",
  "Target",
  "Budget",
  "Laporan",
  "Pengaturan",
];

const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#64748b",
  "#06b6d4",
];

// Helper Utilities
const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);
};

const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

const getCurrentMonthString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// Generate dummy data relative to current date so it always shows up in "Bulan Ini"
const generateDummyData = () => {
  const today = getTodayDateString();
  const currentMonth = getCurrentMonthString();

  return {
    transactions: [
      {
        id: generateId(),
        date: today,
        type: "Pemasukan",
        category: "Penjualan Barang/Jasa",
        amount: 500000,
        description: "Penjualan CHOCREA TOYS",
        method: "Transfer",
      },
      {
        id: generateId(),
        date: today,
        type: "Pemasukan",
        category: "Uang saku",
        amount: 1500000,
        description: "Saku KKN",
        method: "Cash",
      },
      {
        id: generateId(),
        date: today,
        type: "Pengeluaran",
        category: "Belanja",
        amount: 250000,
        description: "Beli helm kuning",
        method: "E-wallet",
      },
      {
        id: generateId(),
        date: today,
        type: "Pengeluaran",
        category: "Lainnya",
        amount: 300000,
        description: "Bahan multiplex Presbotik",
        method: "Cash",
      },
      {
        id: generateId(),
        date: today,
        type: "Pengeluaran",
        category: "Makanan/Minuman",
        amount: 150000,
        description: "Konsumsi KKN Sorosutan",
        method: "Transfer",
      },
    ],
    targets: [
      {
        id: generateId(),
        name: "Modal Usaha CHOCREA",
        targetAmount: 5000000,
        currentAmount: 1000000,
        deadline: "2027-12-31",
        description: "Modal awal untuk produksi mainan",
      },
    ],
    budgets: [
      {
        id: generateId(),
        month: currentMonth,
        category: "Belanja",
        limitAmount: 500000,
      },
      {
        id: generateId(),
        month: currentMonth,
        category: "Makanan/Minuman",
        limitAmount: 500000,
      },
    ],
  };
};

export default function CloudTrackApp() {
  const [user, setUser] = useState(
    () => localStorage.getItem("cloudtrack_user") || "",
  );
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data States (Sama seperti sebelumnya)
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("cloudtrack_tx");
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [targets, setTargets] = useState(() => {
    const saved = localStorage.getItem("cloudtrack_targets");
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("cloudtrack_budgets");
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(
    () => localStorage.setItem("cloudtrack_tx", JSON.stringify(transactions)),
    [transactions],
  );
  useEffect(
    () => localStorage.setItem("cloudtrack_targets", JSON.stringify(targets)),
    [targets],
  );
  useEffect(
    () => localStorage.setItem("cloudtrack_budgets", JSON.stringify(budgets)),
    [budgets],
  );
  useEffect(() => localStorage.setItem("cloudtrack_user", user), [user]);

  const currentMonthPrefix = getCurrentMonthString();
  const allTimeIncome = transactions
    .filter((t) => t.type === "Pemasukan")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const allTimeExpense = transactions
    .filter((t) => t.type === "Pengeluaran")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalSaldo = allTimeIncome - allTimeExpense;

  const currentMonthTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonthPrefix),
  );
  const monthIncome = currentMonthTransactions
    .filter((t) => t.type === "Pemasukan")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const monthExpense = currentMonthTransactions
    .filter((t) => t.type === "Pengeluaran")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const sisaCashFlow = monthIncome - monthExpense;

  if (!user) {
    return <LoginScreen onLogin={(name) => setUser(name)} />;
  }

  const resetData = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus semua data? Ini tidak dapat dibatalkan.",
      )
    ) {
      setTransactions([]);
      setTargets([]);
      setBudgets([]);
      alert("Data berhasil di-reset.");
    }
  };

  const handleLogout = () => {
    setUser("");
    localStorage.removeItem("cloudtrack_user");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <DashboardView
            transactions={transactions}
            monthIncome={monthIncome}
            monthExpense={monthExpense}
            totalSaldo={totalSaldo}
            sisaCashFlow={sisaCashFlow}
            targets={targets}
          />
        );
      case "Transaksi":
        return (
          <TransactionView
            transactions={transactions}
            setTransactions={setTransactions}
          />
        );
      case "Cash Flow":
        return <CashFlowView transactions={transactions} />;
      case "Target":
        return <TargetView targets={targets} setTargets={setTargets} />;
      case "Budget":
        return (
          <BudgetView
            budgets={budgets}
            setBudgets={setBudgets}
            transactions={transactions}
            currentMonthPrefix={currentMonthPrefix}
          />
        );
      case "Laporan":
        return <ReportView transactions={transactions} />;
      case "Pengaturan":
        return (
          <SettingsView
            user={user}
            onReset={resetData}
            onLogout={handleLogout}
          />
        );
      default:
        return <DashboardView />;
    }
  };

  // Navigasi dengan gaya FinTrack
  const NavItem = ({ tab, icon: Icon, isMobile }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }}
        className={`flex transition-colors ${
          isMobile
            ? `flex-col items-center justify-center gap-1 w-full py-2 ${isActive ? "text-[#0E9F6E]" : "text-[#667066]"}`
            : `items-center gap-3 w-full px-3 py-2.5 rounded-[9px] text-[13.5px] ${isActive ? "bg-[#E6F6EE] text-[#0B7A54] font-bold" : "text-[#667066] font-medium hover:bg-[#F6F8F6] hover:text-[#16211C]"}`
        }`}
      >
        <Icon size={isMobile ? 22 : 18} strokeWidth={isActive ? 2.5 : 2} />
        <span
          className={`${isMobile ? "text-[10px] mt-1" : ""} ${isActive ? "font-bold" : "font-medium"}`}
        >
          {tab === "Target Keuangan" ? "Target" : tab}
        </span>
      </button>
    );
  };

  const menuItems = [
    { name: "Dashboard", icon: Home },
    { name: "Transaksi", icon: List },
    { name: "Cash Flow", icon: TrendingUp },
    { name: "Target", icon: Target },
    { name: "Budget", icon: Wallet },
    { name: "Laporan", icon: PieChartIcon },
    { name: "Pengaturan", icon: Settings },
  ];

  return (
    // Latar belakang utama FinTrack (#F6F8F6)
    <div className="min-h-screen bg-[#F6F8F6] text-[#16211C] flex font-sans">
      {/* SIDEBAR DESKTOP: Lebar spesifik 232px seperti FinTrack */}
      <aside className="hidden md:flex flex-col w-[232px] bg-white border-r border-[#E3E7E3] fixed h-full z-20">
        <div className="px-4 py-6 flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] bg-[#0E9F6E] rounded-[9px] text-white flex items-center justify-center font-bold text-[14px] shrink-0">
            CT
          </div>
          <div>
            <h1 className="text-[16.5px] font-bold tracking-tight text-[#16211C] leading-none">
              CloudTrack
            </h1>
            <p className="text-[10.5px] text-[#93998F] mt-0.5">
              Keuangan Pribadi
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3.5 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavItem key={item.name} tab={item.name} icon={item.icon} />
          ))}
        </nav>

        <div className="p-3.5 border-t border-[#EDF0ED] mt-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-[13.5px] text-[#DC4C4C] font-medium hover:bg-[#FCEBEB] rounded-[9px] transition-colors"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <main className="flex-1 md:ml-[232px] pb-24 md:pb-12 w-full min-h-screen relative">
        <div className="md:hidden bg-white border-b border-[#E3E7E3] p-3.5 sticky top-0 z-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-[32px] h-[32px] bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 rounded-[10px] text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-200">
              <Zap size={18} className="fill-white/20" />
            </div>
            <h1 className="text-[15px] font-bold text-[#16211C]">CloudTrack</h1>
          </div>
        </div>

        <div className="p-5 md:p-8 max-w-[1180px] mx-auto">
          <div className="flex justify-between items-end mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-[21px] font-bold text-[#16211C] m-0 tracking-tight">
                {activeTab === "Dashboard" ? "Dashboard Keuangan" : activeTab}
              </h2>
              <p className="text-[13px] text-[#667066] mt-1">
                {activeTab === "Dashboard"
                  ? `by ${user}`
                  : "Kelola data keuangan Anda"}
              </p>
            </div>
          </div>
          {renderContent()}
        </div>
      </main>

      {/* NAVIGASI BAWAH HP */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E3E7E3] flex justify-around px-1 py-1.5 pb-safe z-40">
        {menuItems.slice(0, 4).map((item) => (
          <NavItem key={item.name} tab={item.name} icon={item.icon} isMobile />
        ))}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center gap-1 w-full py-2 ${
            ["Budget", "Laporan", "Pengaturan"].includes(activeTab)
              ? "text-[#0E9F6E]"
              : "text-[#667066]"
          }`}
        >
          <Menu size={22} strokeWidth={2} />
          <span className="text-[10px] mt-1 font-medium">Lainnya</span>
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#0F1411]/40 flex flex-col justify-end pb-[70px]">
          <div className="bg-white rounded-t-[18px] p-4 w-full">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="font-bold text-[15px] text-[#16211C]">
                Menu Lainnya
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#667066]"
              >
                <X size={18} />
              </button>
            </div>
            <NavItem tab="Budget" icon={Wallet} />
            <NavItem tab="Laporan" icon={PieChartIcon} />
            <NavItem tab="Pengaturan" icon={Settings} />
          </div>
        </div>
      )}
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Pengecekan username dan password
    if (username === "Yudha Awanugrahesa" && password === "12345678") {
      setIsLoading(true);

      // Memberikan jeda animasi loading sebentar sebelum masuk
      setTimeout(() => {
        onLogin(username);
      }, 1200);
    } else {
      setError("Username atau Password salah!");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F6F8F6] p-0 lg:p-6 font-sans">
      <div className="w-full max-w-[1200px] min-h-screen lg:min-h-[720px] bg-white rounded-none lg:rounded-[28px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-[#E3E7E3]">
        {/* KOLOM KIRI: Branding & Ilustrasi */}
        <div className="relative bg-gradient-to-br from-[#E8F5ED] via-[#D5EEDF] to-[#C1E6D0] p-8 lg:p-12 flex flex-col justify-between overflow-hidden">
          {/* Efek Lingkaran Abstrak Latar Belakang */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/40 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#0E9F6E]/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header Logo */}
          <div className="flex items-center gap-4 relative z-10">
            <img
              src={logoImage}
              alt="CloudTrack Logo"
              className="w-16 h-16 object-contain rounded-2xl shadow-md"
            />
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-[#16211C]">
                Cloud<span className="text-[#0E9F6E]">Track</span>
              </span>
              <p className="text-xs text-[#667066] font-medium tracking-wide mt-0.5">
                Pantau. Atur. Capai Target.
              </p>
            </div>
          </div>

          {/* Konten Teks & Fitur */}
          <div className="my-auto py-8 relative z-10 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-[#16211C] tracking-tight leading-tight">
                Kelola Keuangan, <br />
                <span className="text-[#0E9F6E]">Lebih Terarah.</span>
              </h1>
              <p className="text-sm text-[#667066] max-w-md leading-relaxed">
                CloudTrack membantu kamu mengelola keuangan pribadi
                dengan mudah, rapi, dan terukur.
              </p>
            </div>

            {/* Ikon Fitur Kecil */}
            <div className="grid grid-cols-4 gap-3 pt-2">
              <div className="bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-white/80 text-center shadow-sm">
                <div className="w-8 h-8 mx-auto mb-1.5 bg-[#0E9F6E]/10 text-[#0E9F6E] rounded-lg flex items-center justify-center">
                  <Wallet size={16} />
                </div>
                <span className="text-[11px] font-semibold text-[#16211C] block truncate">
                  Keuangan Pribadi
                </span>
              </div>
              <div className="bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-white/80 text-center shadow-sm">
                <div className="w-8 h-8 mx-auto mb-1.5 bg-[#0E9F6E]/10 text-[#0E9F6E] rounded-lg flex items-center justify-center">
                  <Building2 size={16} />
                </div>
                <span className="text-[11px] font-semibold text-[#16211C] block truncate">
                  Keuangan Usaha
                </span>
              </div>
              <div className="bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-white/80 text-center shadow-sm">
                <div className="w-8 h-8 mx-auto mb-1.5 bg-[#0E9F6E]/10 text-[#0E9F6E] rounded-lg flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
                <span className="text-[11px] font-semibold text-[#16211C] block truncate">
                  Cash Flow
                </span>
              </div>
              <div className="bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-white/80 text-center shadow-sm">
                <div className="w-8 h-8 mx-auto mb-1.5 bg-[#0E9F6E]/10 text-[#0E9F6E] rounded-lg flex items-center justify-center">
                  <Target size={16} />
                </div>
                <span className="text-[11px] font-semibold text-[#16211C] block truncate">
                  Target Keuangan
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#667066] font-medium relative z-10">
            © 2026 CloudTrack App. All rights reserved.
          </div>
        </div>

        {/* KOLOM KANAN: Form Login */}
        <div className="bg-white p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-2 lg:hidden">
              <div className="w-15 h-15 rounded-lg text-white flex items-center justify-center font-bold text-sm">
                <img
                  src={logoImage}
                  alt="CloudTrack Logo"
                  className="w-16 h-16 object-contain rounded-2xl shadow-md"
                />
              </div>
              <span className="text-lg font-bold text-[#16211C]">
                CloudTrack
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#16211C] tracking-tight">
              Selamat datang kembali!
            </h2>
            <p className="text-sm text-[#667066] mt-1">
              Masuk ke akun kamu untuk melanjutkan ke pengelolaan keuangan.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-[#FCEBEB] text-[#A62F2F] p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 border border-[#DC4C4C]/20 animate-in fade-in">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#16211C] tracking-wide">
                Username
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-[#93998F]">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  placeholder="Ketik username..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F6F8F6] border border-[#E3E7E3] focus:bg-white focus:border-[#0E9F6E] focus:ring-4 focus:ring-[#0E9F6E]/10 outline-none transition-all text-sm text-[#16211C]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#16211C] tracking-wide">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-[#93998F]">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  placeholder="Ketik password..."
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-[#F6F8F6] border border-[#E3E7E3] focus:bg-white focus:border-[#0E9F6E] focus:ring-4 focus:ring-[#0E9F6E]/10 outline-none transition-all text-sm text-[#16211C]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#93998F] hover:text-[#16211C] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Checkbox & Lupa Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E3E7E3] text-[#0E9F6E] focus:ring-[#0E9F6E] accent-[#0E9F6E]"
                />
                <span className="text-[#667066] font-medium">Ingat saya</span>
              </label>
              <a
                href="#lupa"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Silakan hubungi administrator untuk reset password.");
                }}
                className="text-[#0E9F6E] hover:underline font-semibold"
              >
                Lupa password?
              </a>
            </div>

            {/* Tombol Masuk */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0E9F6E] hover:bg-[#0B7A54] text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0E9F6E]/25 hover:shadow-xl hover:shadow-[#0E9F6E]/30 disabled:opacity-80 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Catatan Kredensial Uji Coba */}
          <div className="mt-8 pt-6 border-t border-[#EDF0ED] text-center">
            <p className="text-[11px] text-[#93998F]">
              Design by{" "}
              <strong className="text-[#16211C]">Yudha Awanugrahesa</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView({
  transactions,
  monthIncome,
  monthExpense,
  totalSaldo,
  sisaCashFlow,
  targets,
}) {
  const currentMonthPrefix = getCurrentMonthString();
  const currentMonthTx = transactions.filter((t) =>
    t.date.startsWith(currentMonthPrefix),
  );

  const expenseByCategory = useMemo(() => {
    const expenses = currentMonthTx.filter((t) => t.type === "Pengeluaran");
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
      return acc;
    }, {});
    return Object.keys(grouped)
      .map((key) => ({ name: key, value: grouped[key] }))
      .sort((a, b) => b.value - a.value);
  }, [currentMonthTx]);

  const dailyCashFlow = useMemo(() => {
    const grouped = currentMonthTx.reduce((acc, curr) => {
      const day = curr.date.split("-")[2];
      if (!acc[day]) acc[day] = { day, Pemasukan: 0, Pengeluaran: 0 };
      acc[day][curr.type] += Number(curr.amount);
      return acc;
    }, {});
    return Object.values(grouped).sort(
      (a, b) => parseInt(a.day) - parseInt(b.day),
    );
  }, [currentMonthTx]);

  // Warna chart bawaan FinTrack
  const PIE_COLORS = [
    "#0E9F6E",
    "#2F6FED",
    "#D97706",
    "#DC4C4C",
    "#7B61FF",
    "#0EA5B7",
    "#B45309",
  ];

  return (
    <div className="space-y-4">
      {/* STAT GRID: 4 Kolom dengan gaya FinTrack */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Kartu Saldo */}
        <div className="bg-white border border-[#E3E7E3] rounded-[14px] p-[15px_16px]">
          <div className="w-[30px] h-[30px] rounded-lg bg-[#E6F6EE] text-[#0B7A54] flex items-center justify-center mb-2.5">
            <Wallet size={16} />
          </div>
          <div className="text-[12px] text-[#667066] font-semibold">
            Total Saldo
          </div>
          <div className="text-[20px] font-bold text-[#16211C] mt-1 tracking-tight">
            {formatRupiah(totalSaldo)}
          </div>
          <div className="text-[11.5px] text-[#93998F] mt-1">
            Pemasukan − pengeluaran
          </div>
        </div>

        {/* Kartu Pemasukan */}
        <div className="bg-white border border-[#E3E7E3] rounded-[14px] p-[15px_16px]">
          <div className="w-[30px] h-[30px] rounded-lg bg-[#E6F6EE] text-[#0B7A54] flex items-center justify-center mb-2.5">
            <ArrowDownCircle size={16} />
          </div>
          <div className="text-[12px] text-[#667066] font-semibold">
            Pemasukan Bulan Ini
          </div>
          <div className="text-[20px] font-bold text-[#16211C] mt-1 tracking-tight">
            {formatRupiah(monthIncome)}
          </div>
        </div>

        {/* Kartu Pengeluaran */}
        <div className="bg-white border border-[#E3E7E3] rounded-[14px] p-[15px_16px]">
          <div className="w-[30px] h-[30px] rounded-lg bg-[#FCEBEB] text-[#A62F2F] flex items-center justify-center mb-2.5">
            <ArrowUpCircle size={16} />
          </div>
          <div className="text-[12px] text-[#667066] font-semibold">
            Pengeluaran Bulan Ini
          </div>
          <div className="text-[20px] font-bold text-[#16211C] mt-1 tracking-tight">
            {formatRupiah(monthExpense)}
          </div>
        </div>

        {/* Kartu Sisa Cash Flow */}
        <div className="bg-white border border-[#E3E7E3] rounded-[14px] p-[15px_16px]">
          <div
            className={`w-[30px] h-[30px] rounded-lg flex items-center justify-center mb-2.5 ${sisaCashFlow >= 0 ? "bg-[#E6F6EE] text-[#0B7A54]" : "bg-[#FCEBEB] text-[#A62F2F]"}`}
          >
            <TrendingUp size={16} />
          </div>
          <div className="text-[12px] text-[#667066] font-semibold">
            Sisa Cash Flow
          </div>
          <div className="text-[20px] font-bold text-[#16211C] mt-1 tracking-tight">
            {formatRupiah(sisaCashFlow)}
          </div>
          <div className="text-[11.5px] text-[#93998F] mt-1">
            {sisaCashFlow >= 0 ? "Surplus bulan ini" : "Defisit bulan ini"}
          </div>
        </div>
      </div>

      {/* Bagian Grafik dengan Card bergaya FinTrack */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-3">
        {/* Chart Area */}
        <div className="bg-white border border-[#E3E7E3] rounded-[14px] p-[18px]">
          <h3 className="text-[14.5px] font-bold text-[#16211C] mb-1">
            Cash Flow Harian
          </h3>
          <p className="text-[12px] text-[#667066] mb-4">Bulan ini</p>
          <div className="h-[220px]">
            {dailyCashFlow.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyCashFlow}
                  margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#EDF0ED"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#93998F", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#93998F", fontSize: 10 }}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value) => formatRupiah(value)}
                    labelFormatter={(label) => `Tgl: ${label}`}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #E3E7E3",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Pemasukan"
                    stroke="#0E9F6E"
                    fill="#0E9F6E"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="Pengeluaran"
                    stroke="#DC4C4C"
                    fill="#DC4C4C"
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#93998F] text-[13px]">
                Belum ada data bulan ini.
              </div>
            )}
          </div>
        </div>

        {/* Chart Pie */}
        <div className="bg-white border border-[#E3E7E3] rounded-[14px] p-[18px]">
          <h3 className="text-[14.5px] font-bold text-[#16211C] mb-1">
            Pengeluaran per Kategori
          </h3>
          <p className="text-[12px] text-[#667066] mb-4">Bulan ini</p>
          <div className="h-[220px]">
            {expenseByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatRupiah(value)}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #E3E7E3",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#93998F] text-[13px]">
                Belum ada pengeluaran.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Riwayat Transaksi bergaya Daftar Plaid FinTrack */}
      <div className="bg-white border border-[#E3E7E3] rounded-[14px] p-[18px]">
        <h3 className="text-[14.5px] font-bold text-[#16211C] mb-1">
          Transaksi Terbaru
        </h3>
        <p className="text-[12px] text-[#667066] mb-4">6 transaksi terakhir</p>

        {transactions.length === 0 ? (
          <div className="py-8 text-center text-[#93998F] text-[13px]">
            Belum ada transaksi.
          </div>
        ) : (
          <div className="flex flex-col">
            {transactions
              .slice()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 6)
              .map((tx, idx) => (
                <div
                  key={tx.id}
                  className={`flex justify-between items-center py-[10px] ${idx !== 0 ? "border-t border-[#EDF0ED]" : ""}`}
                >
                  <div>
                    <div className="font-semibold text-[13px] text-[#16211C]">
                      {tx.description}
                    </div>
                    <div className="text-[11.5px] text-[#93998F]">
                      {tx.date} · {tx.category}
                    </div>
                  </div>
                  <div
                    className={`font-bold text-[13.5px] ${tx.type === "Pemasukan" ? "text-[#0B7A54]" : "text-[#A62F2F]"}`}
                  >
                    {tx.type === "Pemasukan" ? "+" : "-"}
                    {formatRupiah(tx.amount)}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionView({ transactions, setTransactions }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Semua");

  // 1. Form State Diperbarui: type dan category dikosongkan di awal
  const [formData, setFormData] = useState({
    date: getTodayDateString(),
    type: "",
    category: "",
    amount: "",
    description: "",
    method: "Cash",
  });

  const handleDelete = (id) => {
    if (window.confirm("Hapus transaksi ini?")) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (Number(formData.amount) <= 0) {
      alert("Nominal harus lebih dari 0");
      return;
    }
    const newTx = {
      ...formData,
      id: generateId(),
      amount: Number(formData.amount),
    };
    setTransactions([newTx, ...transactions]);
    setIsModalOpen(false);

    // 2. Reset semua state setelah simpan, termasuk type dan category
    setFormData({
      date: getTodayDateString(),
      type: "",
      category: "",
      amount: "",
      description: "",
      method: "Cash",
    });
  };

  const filteredData = transactions
    .filter((t) => {
      const matchSearch =
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "Semua" || t.type === filterType;
      return matchSearch && matchType;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            placeholder="Cari transaksi..."
            className="px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none w-full sm:max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="Semua">Semua Jenis</option>
            <option value="Pemasukan">Pemasukan</option>
            <option value="Pengeluaran">Pengeluaran</option>
          </select>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={20} /> Tambah
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="p-4 font-medium">Tanggal</th>
                <th className="p-4 font-medium">Deskripsi & Kategori</th>
                <th className="p-4 font-medium">Metode</th>
                <th className="p-4 font-medium text-right">Nominal</th>
                <th className="p-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    Tidak ada data transaksi.
                  </td>
                </tr>
              ) : (
                filteredData.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="p-4 whitespace-nowrap">{tx.date}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">
                        {tx.description}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {tx.category}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {tx.method}
                      </span>
                    </td>
                    <td
                      className={`p-4 text-right font-bold whitespace-nowrap ${tx.type === "Pemasukan" ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {tx.type === "Pemasukan" ? "+" : "-"}
                      {formatRupiah(tx.amount)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Transaksi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold">Tambah Transaksi</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    Jenis
                  </label>
                  <select
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
                    value={formData.type}
                    // 3. Jika "Jenis" diubah, paksa "Kategori" menjadi kosong lagi
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value,
                        category: "",
                      })
                    }
                  >
                    <option value="" disabled hidden>
                      -- Pilih Jenis --
                    </option>
                    <option value="Pemasukan">Pemasukan</option>
                    <option value="Pengeluaran">Pengeluaran</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-500 mb-1">
                  Kategori
                </label>
                <select
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="" disabled hidden>
                    -- Pilih Kategori --
                  </option>

                  {/* 4. Pastikan type sudah dipilih sebelum merender pilihan kategori */}
                  {formData.type &&
                    (formData.type === "Pemasukan"
                      ? CATEGORI_PEMASUKAN
                      : CATEGORI_PENGELUARAN
                    ).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-500 mb-1">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Contoh: 50000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-slate-500 mb-1">
                  Deskripsi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Cth: Beli makan siang"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-slate-500 mb-1">
                  Metode Pembayaran
                </label>
                <div className="flex gap-2">
                  {METODE_PEMBAYARAN.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData({ ...formData, method })}
                      className={`flex-1 py-2 text-sm rounded-xl border ${formData.method === method ? "bg-blue-50 border-blue-500 text-blue-700 font-medium" : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50"}`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CashFlowView({ transactions }) {
  const currentMonthPrefix = getCurrentMonthString();
  const txThisMonth = transactions.filter((t) =>
    t.date.startsWith(currentMonthPrefix),
  );

  const totalIn = txThisMonth
    .filter((t) => t.type === "Pemasukan")
    .reduce((a, b) => a + Number(b.amount), 0);
  const totalOut = txThisMonth
    .filter((t) => t.type === "Pengeluaran")
    .reduce((a, b) => a + Number(b.amount), 0);
  const netFlow = totalIn - totalOut;

  // Monthly summary for simple bar chart presentation (using simple divs)
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">
            Total Pemasukan (Bulan Ini)
          </p>
          <p className="text-2xl font-bold text-emerald-600">
            {formatRupiah(totalIn)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">
            Total Pengeluaran (Bulan Ini)
          </p>
          <p className="text-2xl font-bold text-red-600">
            {formatRupiah(totalOut)}
          </p>
        </div>
        <div
          className={`p-6 rounded-2xl border shadow-sm ${netFlow >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}
        >
          <p
            className={`text-sm font-medium mb-1 ${netFlow >= 0 ? "text-emerald-700" : "text-red-700"}`}
          >
            Net Cash Flow
          </p>
          <p
            className={`text-2xl font-bold ${netFlow >= 0 ? "text-emerald-800" : "text-red-800"}`}
          >
            {formatRupiah(netFlow)}
          </p>
          <div
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${netFlow >= 0 ? "bg-emerald-200 text-emerald-800" : "bg-red-200 text-red-800"}`}
          >
            {netFlow >= 0 ? "SURPLUS" : "DEFISIT"}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          Analisis Arus Kas Sederhana
        </h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-slate-600">
                Pemasukan vs Pengeluaran
              </span>
              <span className="text-slate-400">
                {totalIn > 0 ? Math.round((totalOut / totalIn) * 100) : 0}%
                dihabiskan
              </span>
            </div>
            <div className="w-full flex h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${totalIn === 0 ? 0 : 100}%` }}
              ></div>
            </div>
            <div className="w-full flex h-4 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div
                className="bg-red-500 h-full"
                style={{
                  width: `${totalIn === 0 ? (totalOut > 0 ? 100 : 0) : Math.min(100, (totalOut / totalIn) * 100)}%`,
                }}
              ></div>
            </div>
            <div className="flex gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>{" "}
                Pemasukan
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>{" "}
                Pengeluaran
              </span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4">
            <AlertCircle className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              {netFlow >= 0
                ? "Bagus! Anda berhasil menjaga pengeluaran lebih kecil dari pemasukan bulan ini. Pertahankan untuk meningkatkan tabungan Anda."
                : "Perhatian: Pengeluaran Anda melebihi pemasukan bulan ini. Tinjau kembali anggaran dan hindari pengeluaran yang tidak perlu."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TargetView({ targets, setTargets }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
    description: "",
  });

  const handleSave = (e) => {
    e.preventDefault();
    const newTarget = {
      ...formData,
      id: generateId(),
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount),
    };
    setTargets([...targets, newTarget]);
    setIsModalOpen(false);
    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "0",
      deadline: "",
      description: "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus target ini?"))
      setTargets(targets.filter((t) => t.id !== id));
  };

  const addFund = (id, amount) => {
    const num = Number(
      window.prompt("Masukkan nominal dana yang ditambahkan:", "0"),
    );
    if (num > 0) {
      setTargets(
        targets.map((t) =>
          t.id === id ? { ...t, currentAmount: t.currentAmount + num } : t,
        ),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-500">
          Kelola dan pantau tujuan keuangan Anda.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={20} /> Target
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {targets.length === 0 ? (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-500">
            Belum ada target keuangan. Yuk buat tujuan finansial pertamamu!
          </div>
        ) : (
          targets.map((t) => {
            const percent = Math.min(
              100,
              Math.round((t.currentAmount / t.targetAmount) * 100),
            );
            const isAchieved = t.currentAmount >= t.targetAmount;

            return (
              <div
                key={t.id}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col relative"
              >
                {isAchieved && (
                  <div className="absolute -top-3 -right-3 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                    <CheckCircle2 size={24} />
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">
                      {t.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tenggat: {t.deadline || "Tidak ada"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="text-sm text-slate-600 mb-6 flex-1">
                  {t.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold text-slate-800">
                      {percent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${isAchieved ? "bg-emerald-500" : "bg-blue-500"}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>{formatRupiah(t.currentAmount)}</span>
                    <span>Tujuan: {formatRupiah(t.targetAmount)}</span>
                  </div>
                </div>

                <button
                  disabled={isAchieved}
                  onClick={() => addFund(t.id)}
                  className={`w-full py-2.5 rounded-xl font-medium transition-colors ${isAchieved ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
                >
                  {isAchieved ? "Target Tercapai!" : "Tambah Dana"}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Target */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold">Buat Target Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-500 mb-1">
                  Nama Target
                </label>
                <input
                  type="text"
                  required
                  placeholder="Cth: Beli Laptop Baru"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">
                  Target Nominal (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Contoh: 10000000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
                  value={formData.targetAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAmount: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    Sudah Terkumpul
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
                    value={formData.currentAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentAmount: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">
                    Tenggat Waktu
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">
                  Deskripsi Singkat
                </label>
                <input
                  type="text"
                  placeholder="Catatan..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BudgetView({ budgets, setBudgets, transactions, currentMonthPrefix }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: CATEGORI_PENGELUARAN[0],
    limitAmount: "",
  });

  const handleSave = (e) => {
    e.preventDefault();
    // Cek jika kategori sudah ada budget di bulan ini
    const existing = budgets.find(
      (b) => b.month === currentMonthPrefix && b.category === formData.category,
    );
    if (existing) {
      alert("Kategori ini sudah memiliki budget untuk bulan ini.");
      return;
    }

    const newBudget = {
      id: generateId(),
      month: currentMonthPrefix,
      category: formData.category,
      limitAmount: Number(formData.limitAmount),
    };
    setBudgets([...budgets, newBudget]);
    setIsModalOpen(false);
    setFormData({ ...formData, limitAmount: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus budget ini?"))
      setBudgets(budgets.filter((b) => b.id !== id));
  };

  // Get current month budgets
  const activeBudgets = budgets.filter((b) => b.month === currentMonthPrefix);

  // Calculate spent amount for each budget category
  const expensesThisMonth = transactions.filter(
    (t) => t.date.startsWith(currentMonthPrefix) && t.type === "Pengeluaran",
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-500">
          Batasi pengeluaran Anda agar tidak boros.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={20} /> Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeBudgets.length === 0 ? (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-500">
            Belum ada budget untuk bulan ini.
          </div>
        ) : (
          activeBudgets.map((budget) => {
            const spent = expensesThisMonth
              .filter((e) => e.category === budget.category)
              .reduce((sum, e) => sum + Number(e.amount), 0);
            const percent = Math.min(100, (spent / budget.limitAmount) * 100);
            const isOver = spent > budget.limitAmount;
            const remaining = budget.limitAmount - spent;

            return (
              <div
                key={budget.id}
                className={`bg-white p-6 rounded-2xl border shadow-sm relative ${isOver ? "border-red-300" : "border-slate-100"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${isOver ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
                    >
                      <Wallet size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">
                        {budget.category}
                      </h3>
                      <p className="text-xs text-slate-500">Budget Bulanan</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-end text-sm">
                    <span className="text-slate-500">
                      Terpakai:{" "}
                      <strong className="text-slate-800">
                        {formatRupiah(spent)}
                      </strong>
                    </span>
                    <span className="text-slate-500">
                      Batas: <strong>{formatRupiah(budget.limitAmount)}</strong>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${isOver ? "bg-red-500" : percent > 80 ? "bg-orange-400" : "bg-emerald-500"}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm text-slate-500">Sisa Anggaran:</span>
                  <span
                    className={`font-bold ${isOver ? "text-red-600" : "text-emerald-600"}`}
                  >
                    {isOver ? "Rp 0" : formatRupiah(remaining)}
                  </span>
                </div>

                {isOver && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl flex items-center gap-2 border border-red-100 font-medium">
                    <AlertCircle size={18} /> Budget Terlampaui! (Lebih{" "}
                    {formatRupiah(Math.abs(remaining))})
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Budget */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold">Tetapkan Budget Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-500 mb-1">
                  Kategori Pengeluaran
                </label>
                <select
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {CATEGORI_PENGELUARAN.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">
                  Batas Anggaran (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Contoh: 500000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
                  value={formData.limitAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, limitAmount: e.target.value })
                  }
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportView({ transactions }) {
  const currentMonthPrefix = getCurrentMonthString();
  const txThisMonth = transactions.filter((t) =>
    t.date.startsWith(currentMonthPrefix),
  );

  const expenses = txThisMonth.filter((t) => t.type === "Pengeluaran");
  const groupedExpenses = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const totalExpense = Object.values(groupedExpenses).reduce(
    (a, b) => a + b,
    0,
  );
  const sortedCategories = Object.keys(groupedExpenses)
    .map((cat) => ({
      name: cat,
      value: groupedExpenses[cat],
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <PieChartIcon size={20} className="text-blue-500" /> Ringkasan
          Pengeluaran Kategori (Bulan Ini)
        </h3>

        {sortedCategories.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            Belum ada data laporan bulan ini.
          </div>
        ) : (
          <div className="space-y-6">
            {sortedCategories.map((cat) => {
              const percent = ((cat.value / totalExpense) * 100).toFixed(1);
              return (
                <div key={cat.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-slate-700">
                      {cat.name}
                    </span>
                    <span className="font-bold text-slate-800">
                      {formatRupiah(cat.value)}{" "}
                      <span className="text-slate-400 font-normal text-sm ml-1">
                        ({percent}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
        <h4 className="font-bold text-blue-800 mb-2">Insight Keuangan</h4>
        {sortedCategories.length > 0 ? (
          <p className="text-blue-700 text-sm">
            Pengeluaran terbesar Anda bulan ini ada pada kategori{" "}
            <strong>{sortedCategories[0].name}</strong> sebesar{" "}
            {formatRupiah(sortedCategories[0].value)}. Pastikan pengeluaran ini
            sejalan dengan prioritas dan budget Anda.
          </p>
        ) : (
          <p className="text-blue-700 text-sm">
            Catat transaksi pengeluaran Anda untuk mendapatkan insight keuangan.
          </p>
        )}
      </div>
    </div>
  );
}

function SettingsView({ user, onReset, onLogout }) {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Profil</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {user.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-slate-500">Nama Pengguna</p>
            <p className="text-xl font-bold text-slate-800">{user}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Manajemen Data</h3>

        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
          <h4 className="font-bold text-orange-800 mb-1">Reset Semua Data</h4>
          <p className="text-sm text-orange-700 mb-4">
            Menghapus semua transaksi, target, dan budget. Tindakan ini tidak
            dapat dikembalikan.
          </p>
          <button
            onClick={onReset}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            Reset Data
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:hidden">
        <button
          onClick={onLogout}
          className="w-full flex justify-center items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl font-medium transition-colors"
        >
          <LogOut size={20} /> Keluar Aplikasi
        </button>
      </div>
    </div>
  );
}
