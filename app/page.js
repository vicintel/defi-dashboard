"use client";

import { useState, useCallback } from "react";
import { ethers } from "ethers";
import Navbar from "@/components/Navbar";
import PriceCards from "@/components/PriceCards";
import TokenBalances from "@/components/TokenBalances";
import TransactionHistory from "@/components/TransactionHistory";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);

  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const net = await provider.getNetwork();
      setAccount(accounts[0]);
      setNetwork(net.name === "homestead" ? "Ethereum" : net.name);
    } catch (err) {
      console.error("Connect failed:", err);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setNetwork(null);
  }, []);

  return (
    <div className="min-h-screen bg-dark">
      <Navbar
        account={account}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        network={network}
      />

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            DeFi{" "}
            <span className="text-brand text-glow">Dashboard</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Connect your wallet to view balances, prices, and transaction history.
          </p>
        </div>

        {/* Live Prices */}
        <PriceCards />

        {/* Wallet sections */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TokenBalances account={account} />
          <TransactionHistory account={account} />
        </div>

        {/* Stats bar */}
        {account && (
          <div className="card-border rounded-xl bg-card px-6 py-4">
            <div className="flex flex-wrap gap-8">
              <Stat label="Connected Address" value={`${account.slice(0, 10)}...${account.slice(-6)}`} />
              <Stat label="Network" value={network || "—"} />
              <Stat label="Status" value="Live" highlight />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-[11px] text-slate-700">
        Built by{" "}
        <a href="https://victor-dusky.vercel.app" className="text-brand/60 hover:text-brand transition">
          Victor Dickson
        </a>{" "}
        · Powered by CoinGecko + Etherscan
      </footer>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-slate-600">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold ${highlight ? "text-brand" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}
