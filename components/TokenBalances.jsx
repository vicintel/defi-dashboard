"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ERC20_TOKENS, ERC20_ABI } from "@/lib/tokens";
import { readProvider } from "@/lib/chain";

const usd = (n) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

async function getBalances(address) {
  const provider = readProvider();

  // ETH balance
  const ethBal = await provider.getBalance(address);
  const results = [
    {
      symbol: "ETH",
      name: "Ethereum",
      color: "#627eea",
      coingeckoId: "ethereum",
      balance: parseFloat(ethers.formatEther(ethBal)),
    },
  ];

  // ERC-20 balances
  await Promise.all(
    ERC20_TOKENS.map(async (token) => {
      try {
        const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
        const bal = await contract.balanceOf(address);
        const formatted = parseFloat(ethers.formatUnits(bal, token.decimals));
        if (formatted > 0) {
          results.push({ ...token, balance: formatted });
        }
      } catch {
        // skip token if fetch fails
      }
    })
  );

  return results;
}

function BalanceRow({ token, price }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-dark/50 px-4 py-3 transition hover:border-brand/20">
      <div className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
          style={{ backgroundColor: token.color + "22", color: token.color }}
        >
          {token.symbol.slice(0, 2)}
        </span>
        <div>
          <p className="text-sm font-semibold text-white">{token.symbol}</p>
          <p className="text-[10px] text-slate-500">{token.name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-white">
          {token.balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })}
        </p>
        <p className="text-[10px] text-slate-500">
          {price ? usd(token.balance * price) : token.symbol}
        </p>
      </div>
    </div>
  );
}

export default function TokenBalances({ address: account, prices }) {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!account) return;
    setLoading(true);
    setError(null);
    // Ignore a slow reply for an address we have since moved away from
    let current = true;
    getBalances(account)
      .then((t) => current && setTokens(t))
      .catch(() => current && setError("Failed to load balances"))
      .finally(() => current && setLoading(false));
    return () => { current = false; };
  }, [account]);

  return (
    <section className="card-border rounded-xl bg-card p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Token Balances
        </h2>
        {account && !loading && prices && tokens.length > 0 && (
          <span className="text-sm font-semibold text-white">
            {usd(tokens.reduce((sum, t) => sum + t.balance * (prices[t.coingeckoId]?.usd ?? 0), 0))}
          </span>
        )}
      </div>

      {!account && (
        <div className="flex h-32 items-center justify-center text-sm text-slate-600">
          Connect a wallet or look up an address
        </div>
      )}

      {account && loading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-dark/50" />
          ))}
        </div>
      )}

      {account && error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {account && !loading && tokens.length === 0 && !error && (
        <p className="text-sm text-slate-500">No token balances found.</p>
      )}

      {account && !loading && tokens.length > 0 && (
        <div className="space-y-2">
          {tokens.map((t) => (
            <BalanceRow key={t.symbol} token={t} price={prices?.[t.coingeckoId]?.usd} />
          ))}
        </div>
      )}
    </section>
  );
}
