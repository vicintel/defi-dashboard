"use client";

import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "@/components/Navbar";
import AddressLookup from "@/components/AddressLookup";
import PriceCards from "@/components/PriceCards";
import TokenBalances from "@/components/TokenBalances";
import TransactionHistory from "@/components/TransactionHistory";
import { COINS, fetchPrices } from "@/lib/coingecko";
import { ERC20_TOKENS } from "@/lib/tokens";

const PRICE_IDS = [...new Set([...COINS.map((c) => c.id), ...ERC20_TOKENS.map((t) => t.coingeckoId)])];

export default function Home() {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  // The address being shown: the connected wallet, or one looked up by hand
  const [viewing, setViewing] = useState(null);
  const [prices, setPrices] = useState(null);
  const [pricesUpdated, setPricesUpdated] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setPrices(await fetchPrices(PRICE_IDS));
        setPricesUpdated(new Date());
      } catch {
        // keep the last prices we had
      }
    }
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask not detected. Install MetaMask, or look up an address instead.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const net = await provider.getNetwork();
      const address = ethers.getAddress(accounts[0]);
      setAccount(address);
      setViewing(address);
      setNetwork(net.name === "mainnet" || net.name === "homestead" ? "Ethereum" : net.name);
    } catch (err) {
      console.error("Connect failed:", err);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setNetwork(null);
    setViewing(null);
  }, []);

  return (
    <div className="min-h-screen bg-dark">
      <Navbar
        account={account}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        network={network}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              DeFi{" "}
              <span className="text-brand text-glow">Dashboard</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Connect a wallet, or look up any Ethereum address, to see its balances and history.
            </p>
          </div>
          <AddressLookup onLookup={setViewing} current={account ? null : viewing} />
        </div>

        {/* Live Prices */}
        <PriceCards prices={prices} updated={pricesUpdated} />

        {/* Wallet sections */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TokenBalances address={viewing} prices={prices} />
          <TransactionHistory address={viewing} />
        </div>

        {/* Stats bar */}
        {viewing && (
          <div className="card-border rounded-xl bg-card px-6 py-4">
            <div className="flex flex-wrap gap-8">
              <Stat label={account ? "Connected address" : "Viewing address"} value={`${viewing.slice(0, 10)}...${viewing.slice(-6)}`} />
              <Stat label="Network" value={network || "Ethereum"} />
              <Stat label="Mode" value={account ? "Wallet" : "Read-only"} highlight />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-[11px] text-slate-700">
        Built by{" "}
        <a href="https://myportfolio-one-eta-18.vercel.app" className="text-brand/60 hover:text-brand transition">
          Victor Dickson
        </a>{" "}
        · Prices from CoinGecko · History from Blockscout · Read-only, never asks for a signature
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
