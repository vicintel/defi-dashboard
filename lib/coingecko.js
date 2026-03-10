const BASE = "https://api.coingecko.com/api/v3";

export const COINS = [
  { id: "ethereum",  symbol: "ETH",  name: "Ethereum",  color: "#627eea" },
  { id: "bitcoin",   symbol: "BTC",  name: "Bitcoin",   color: "#f7931a" },
  { id: "binancecoin", symbol: "BNB", name: "BNB",      color: "#f3ba2f" },
  { id: "solana",    symbol: "SOL",  name: "Solana",    color: "#9945ff" },
  { id: "usd-coin",  symbol: "USDC", name: "USD Coin",  color: "#2775ca" },
  { id: "tether",    symbol: "USDT", name: "Tether",    color: "#26a17b" },
];

export async function fetchPrices() {
  const ids = COINS.map((c) => c.id).join(",");
  const res = await fetch(
    `${BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("CoinGecko fetch failed");
  return res.json();
}
