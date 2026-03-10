"use client";

import { useEffect, useState } from "react";

function fmt(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function PriceCard({ coin }) {
  const pos = coin.change24h >= 0;
  return (
    <div className="card-border rounded-xl bg-card p-4 transition hover:glow-green hover:border-brand/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
            style={{ backgroundColor: coin.color + "22", color: coin.color }}
          >
            {coin.symbol.slice(0, 1)}
          </span>
          <div>
            <p className="text-xs font-semibold text-white">{coin.symbol}</p>
            <p className="text-[10px] text-slate-500">{coin.name}</p>
          </div>
        </div>
        <span
          className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
            pos ? "bg-brand/10 text-brand" : "bg-red-500/10 text-red-400"
          }`}
        >
          {pos ? "+" : ""}
          {coin.change24h.toFixed(2)}%
        </span>
      </div>
      <p className="mt-3 text-lg font-bold text-white">
        {fmt(coin.price)}
      </p>
      <p className="mt-1 text-[10px] text-slate-500">
        MCap: {fmt(coin.marketCap)}
      </p>
    </div>
  );
}

export default function PriceCards() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  async function load() {
    try {
      const res = await fetch("/api/prices");
      const data = await res.json();
      setCoins(data);
      setLastUpdated(new Date());
    } catch {
      // silently fail, keep stale data
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Live Prices
        </h2>
        {lastUpdated && (
          <span className="text-[10px] text-slate-600">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-card card-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {coins.map((c) => (
            <PriceCard key={c.id} coin={c} />
          ))}
        </div>
      )}
    </section>
  );
}
