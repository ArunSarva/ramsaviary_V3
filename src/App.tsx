import React, { useState, useCallback, useRef } from "react";
import {
  LayoutDashboard,
  Bird,
  ShoppingBasket,
  Plus,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import BirdsTable from "./components/BirdsTable";
import FeedsTable from "./components/FeedsTable";
import AddTransaction from "./components/AddTransaction";
import { AppData, BirdTransaction, FeedTransaction, TabType } from "./types";
import {
  parseExcelData,
  downloadExcel,
  saveToLocalStorage,
  loadFromLocalStorage,
} from "./excelUtils";
import RamLogo from "./assets/Ramslogo.png";
const INITIAL_DATA: AppData = { birds: [], feeds: [] };

function App() {
  const [data, setData] = useState<AppData>(
    () => loadFromLocalStorage() || INITIAL_DATA,
  );
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const persist = (d: AppData) => {
    setData(d);
    saveToLocalStorage(d);
  };

  const handleFileImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = parseExcelData(ev.target?.result as ArrayBuffer);
          persist(parsed);
          showToast(
            `✅ Loaded ${parsed.birds.length} sales + ${parsed.feeds.length} purchases`,
          );
        } catch {
          showToast("❌ Error reading file");
        }
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
      e.target.value = "";
    },
    [],
  );

  const handleAddBird = (t: BirdTransaction) => {
    const newData = {
      ...data,
      birds: [...data.birds, { ...t, slNo: data.birds.length + 1 }],
    };
    persist(newData);
    showToast("✅ Sale entry added");
  };

  const handleAddFeed = (t: FeedTransaction) => {
    const newData = {
      ...data,
      feeds: [...data.feeds, { ...t, slNo: data.feeds.length + 1 }],
    };
    persist(newData);
    showToast("✅ Purchase entry added");
  };

  const handleDeleteBird = (index: number) => {
    const birds = data.birds
      .filter((_, i) => i !== index)
      .map((b, i) => ({ ...b, slNo: i + 1 }));
    persist({ ...data, birds });
    showToast("🗑️ Entry deleted");
  };

  const handleDeleteFeed = (index: number) => {
    const feeds = data.feeds
      .filter((_, i) => i !== index)
      .map((f, i) => ({ ...f, slNo: i + 1 }));
    persist({ ...data, feeds });
    showToast("🗑️ Entry deleted");
  };

  const tabs = [
    { id: "dashboard" as TabType, label: "Home", icon: LayoutDashboard },
    { id: "birds" as TabType, label: "Sales", icon: Bird },
    { id: "feeds" as TabType, label: "Buys", icon: ShoppingBasket },
    { id: "add" as TabType, label: "Add", icon: Plus },
  ];

  const isEmpty = data.birds.length === 0 && data.feeds.length === 0;

  return (
    <div className="min-h-screen text-white">
      {/* BG orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass-strong rounded-2xl px-5 py-3 text-sm text-white shadow-xl max-w-xs w-[90vw] text-center transition-all">
          {toast}
        </div>
      )}

      {/* Top header */}
      <div className="sticky top-0 z-40 glass-strong border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-base">
              <img src={RamLogo} alt="logo"></img>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">Ram's Avairy</h1>
              <p className="text-white/40 text-[10px]">P&L Tracker 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={fileRef}
              onChange={handleFileImport}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              className="glass flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white active:scale-95 transition-all"
            >
              {loading ? (
                <RefreshCw size={13} className="animate-spin" />
              ) : (
                <Upload size={13} />
              )}
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={() => downloadExcel(data)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-violet-600/50 border border-violet-500/30 active:scale-95 transition-all"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content — padding-bottom for bottom nav */}
      <div className="relative px-3 pt-4 pb-24 max-w-2xl mx-auto">
        {isEmpty && activeTab !== "add" && (
          <div className="glass-card rounded-2xl p-8 text-center mt-4">
            <div className="text-5xl mb-3">📊</div>
            <p className="text-white/70 font-semibold mb-1">No data yet</p>
            <p className="text-white/40 text-sm mb-5">
              Import your Excel or add entries manually.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600/40 border border-violet-500/30 text-sm font-medium active:scale-95 transition-all"
              >
                <Upload size={15} /> Import Excel
              </button>
              <button
                onClick={() => setActiveTab("add")}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600/40 border border-emerald-500/30 text-sm font-medium active:scale-95 transition-all"
              >
                <Plus size={15} /> Add New Entry
              </button>
            </div>
          </div>
        )}

        {activeTab === "dashboard" && <Dashboard data={data} />}
        {activeTab === "birds" && (
          <BirdsTable birds={data.birds} onDelete={handleDeleteBird} />
        )}
        {activeTab === "feeds" && (
          <FeedsTable feeds={data.feeds} onDelete={handleDeleteFeed} />
        )}
        {activeTab === "add" && (
          <AddTransaction onAddBird={handleAddBird} onAddFeed={handleAddFeed} />
        )}
      </div>

      {/* Bottom nav bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
        <div className="glass-strong border-t border-white/10 px-2 pt-2 pb-2">
          <div className="flex max-w-2xl mx-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all active:scale-95 ${
                    active ? "text-white" : "text-white/40"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-xl transition-all ${active ? "bg-violet-600/50" : ""}`}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
