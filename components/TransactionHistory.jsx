"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { fetchTransactions } from "@/lib/chain";

function shortAddr(addr) {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function timeAgo(ts) {
  const diff = Math.floor(Date.now() / 1000) - parseInt(ts);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function TxRow({ tx, account }) {
  const isSent = tx.from.toLowerCase() === account.toLowerCase();
  const ethValue = parseFloat(ethers.formatEther(tx.value || "0"));
  const failed = tx.isError === "1";

  return (
    <div className="flex items-center justify-between border-b border-border/40 py-3 last:border-0">
      {/* Direction badge */}
      <div className="flex items-center gap-3">
        <span
          className={`w-12 rounded px-2 py-0.5 text-center text-[10px] font-bold ${
            failed
              ? "bg-red-500/10 text-red-400"
              : isSent
              ? "bg-accent/10 text-accent"
              : "bg-brand/10 text-brand"
          }`}
        >
          {failed ? "FAIL" : isSent ? "OUT" : "IN"}
        </span>

        <div>
          <p className="text-xs text-slate-300">
            {isSent ? `To: ${shortAddr(tx.to)}` : `From: ${shortAddr(tx.from)}`}
          </p>
          <a
            href={`https://etherscan.io/tx/${tx.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-slate-600 transition hover:text-brand"
          >
            {shortAddr(tx.hash)}
          </a>
        </div>
      </div>

      {/* Value + time */}
      <div className="text-right">
        <p className={`text-xs font-semibold ${failed ? "text-slate-600 line-through" : isSent ? "text-accent" : "text-brand"}`}>
          {isSent ? "-" : "+"}{ethValue.toFixed(ethValue < 0.001 ? 6 : 4)} ETH
        </p>
        <p className="text-[10px] text-slate-600">{timeAgo(tx.timeStamp)}</p>
      </div>
    </div>
  );
}

export default function TransactionHistory({ address: account }) {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!account) return;
    setLoading(true);
    setError(null);

    // Ignore a slow reply for an address we have since moved away from
    let current = true;
    fetchTransactions(account)
      .then((t) => current && setTxs(t))
      .catch(() => current && setError("Failed to load transactions"))
      .finally(() => current && setLoading(false));
    return () => { current = false; };
  }, [account]);

  return (
    <section className="card-border rounded-xl bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Transaction History
        </h2>
        {account && (
          <a
            href={`https://etherscan.io/address/${account}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-brand/60 transition hover:text-brand"
          >
            View on Etherscan ↗
          </a>
        )}
      </div>

      {!account && (
        <div className="flex h-40 items-center justify-center text-sm text-slate-600">
          Connect a wallet or look up an address
        </div>
      )}

      {account && loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-dark/50" />
          ))}
        </div>
      )}

      {account && error && <p className="text-sm text-red-400">{error}</p>}

      {account && !loading && txs.length === 0 && !error && (
        <p className="text-sm text-slate-500">No transactions found.</p>
      )}

      {account && !loading && txs.length > 0 && (
        <div className="max-h-80 overflow-y-auto pr-1">
          {txs.map((tx) => (
            <TxRow key={tx.hash} tx={tx} account={account} />
          ))}
        </div>
      )}
    </section>
  );
}
