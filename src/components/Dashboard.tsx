import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  // DollarSign,
  Bird,
  // ShoppingCart,
  CreditCard,
} from "lucide-react";
import { AppData } from "../types";

interface DashboardProps {
  data: AppData;
}

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

const ALL_TIME = "all";
const currentMonthKey = () => new Date().toISOString().slice(0, 7);
const monthLabel = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

const StatCard = ({ icon: Icon, label, value, sub, color, textColor }: any) => (
  <div className="glass-card rounded-2xl p-4 flex flex-col gap-1.5">
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-lg ${color}`}>
        <Icon size={15} className="text-white" />
      </div>
      <span className="text-white/50 text-xs font-medium">{label}</span>
    </div>
    <div className={`text-xl font-bold ${textColor || "text-white"}`}>
      {value}
    </div>
    {sub && <div className="text-white/40 text-[11px]">{sub}</div>}
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const months = useMemo(() => {
    const isValidMonthKey = (key: string) =>
      /^\d{4}-\d{2}$/.test(key) && !isNaN(new Date(key + "-01").getTime());
    const set = new Set<string>();
    data.birds.forEach((b) => {
      const key = b.date?.slice(0, 7);
      if (key && isValidMonthKey(key)) set.add(key);
    });
    data.feeds.forEach((f) => {
      const key = f.date?.slice(0, 7);
      if (key && isValidMonthKey(key)) set.add(key);
    });
    set.add(currentMonthKey());
    return Array.from(set).sort().reverse();
  }, [data.birds, data.feeds]);

  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey());

  const birds = useMemo(
    () =>
      selectedMonth === ALL_TIME
        ? data.birds
        : data.birds.filter((b) => b.date.slice(0, 7) === selectedMonth),
    [data.birds, selectedMonth],
  );
  const feeds = useMemo(
    () =>
      selectedMonth === ALL_TIME
        ? data.feeds
        : data.feeds.filter((f) => f.date.slice(0, 7) === selectedMonth),
    [data.feeds, selectedMonth],
  );

  const totalSell = birds.reduce((s, b) => s + b.amount, 0);
  const totalBuy = feeds.reduce((s, f) => s + f.amount, 0);
  const profit = totalSell - totalBuy;
  const totalBirdsSold = birds.reduce((s, b) => s + b.quantity, 0);
  const unpaidSell = birds
    .filter((b) => b.status !== "Paid")
    .reduce((s, b) => s + b.amount, 0);

  const birdBreakdown = birds.reduce(
    (acc, b) => {
      acc[b.birds] = (acc[b.birds] || 0) + b.amount;
      return acc;
    },
    {} as Record<string, number>,
  );
  const topBirds = Object.entries(birdBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const locationBreakdown = birds.reduce(
    (acc, b) => {
      acc[b.location] = (acc[b.location] || 0) + b.amount;
      return acc;
    },
    {} as Record<string, number>,
  );
  const topLocations = Object.entries(locationBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const recentSales = birds
    .map((b, i) => ({ b, i }))
    .sort((x, y) => {
      const dateDiff = new Date(y.b.date).getTime() - new Date(x.b.date).getTime();
      return dateDiff !== 0 ? dateDiff : y.i - x.i;
    })
    .slice(0, 5)
    .map(({ b }) => b);

  return (
    <div className="space-y-4">
      {/* Month selector */}
      <div className="glass-card rounded-2xl p-3 flex items-center justify-between gap-2">
        <span className="text-white/50 text-xs font-medium pl-1">
          Showing
        </span>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="glass-input rounded-xl px-3 py-2 text-sm text-white flex-1 max-w-[50%]"
        >
          <option value={ALL_TIME}>All Time</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {monthLabel(m)}
            </option>
          ))}
        </select>
      </div>

      {birds.length === 0 && feeds.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-white/70 font-semibold mb-1">
            No records for {selectedMonth === ALL_TIME ? "this range" : monthLabel(selectedMonth)}
          </p>
          <p className="text-white/40 text-sm">
            Try a different month or switch to All Time.
          </p>
        </div>
      ) : (
      <>
      {/* P&L hero card */}
      <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-white/50 text-xs mb-1">
            {profit >= 0 ? "Net Profit" : "Net Loss"}
          </p>
          <p
            className={`text-3xl font-bold ${profit >= 0 ? "text-emerald-400" : "text-rose-400"}`}
          >
            {fmt(Math.abs(profit))}
          </p>
          <p className="text-white/40 text-xs mt-1">
            Sales {fmt(totalSell)} · Buys {fmt(totalBuy)}
          </p>
        </div>
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${profit >= 0 ? "bg-emerald-500/20" : "bg-rose-500/20"}`}
        >
          {profit >= 0 ? "📈" : "📉"}
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={TrendingUp}
          label="Total Sales"
          value={fmt(totalSell)}
          sub={`${birds.length} transactions`}
          color="bg-emerald-500/30"
          textColor="text-emerald-400"
        />
        <StatCard
          icon={TrendingDown}
          label="Purchases"
          value={fmt(totalBuy)}
          sub={`${feeds.length} transactions`}
          color="bg-rose-500/30"
          textColor="text-rose-400"
        />
        <StatCard
          icon={Bird}
          label="Birds Sold"
          value={totalBirdsSold}
          sub="Total qty"
          color="bg-sky-500/30"
        />
        <StatCard
          icon={CreditCard}
          label="Unpaid"
          value={fmt(unpaidSell)}
          sub="Pending"
          color="bg-amber-500/30"
          textColor="text-amber-400"
        />
      </div>

      {/* Top birds */}
      {topBirds.length > 0 && (
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
            Top Birds by Revenue
          </h3>
          <div className="space-y-2.5">
            {topBirds.map(([bird, amount]) => {
              const pct = Math.round((amount / totalSell) * 100);
              return (
                <div key={bird}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70 truncate max-w-[55%]">
                      {bird}
                    </span>
                    <span className="text-white font-medium">
                      {fmt(amount)}{" "}
                      <span className="text-white/40">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locations */}
      {topLocations.length > 0 && (
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
            Sales by Location
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {topLocations.map(([loc, amount]) => (
              <div key={loc} className="glass rounded-xl p-3">
                <p className="text-white/60 text-xs mb-0.5">
                  {loc || "Unknown"}
                </p>
                <p className="text-white font-semibold text-sm">
                  {fmt(amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent sales */}
      {recentSales.length > 0 && (
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Recent Sales
          </h3>
          <div className="space-y-2">
            {recentSales.map((b, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {b.birds}
                  </p>
                  <p className="text-white/40 text-xs">
                    {b.customerName} · {b.date}
                  </p>
                </div>
                <div className="text-right ml-3 shrink-0">
                  <p className="text-emerald-400 font-semibold text-sm">
                    {fmt(b.amount)}
                  </p>
                  <p className="text-white/40 text-xs">×{b.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default Dashboard;
