import { fetchPrices, COINS } from "@/lib/coingecko";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const data = await fetchPrices();
    const result = COINS.map((coin) => ({
      ...coin,
      price: data[coin.id]?.usd ?? 0,
      change24h: data[coin.id]?.usd_24h_change ?? 0,
      marketCap: data[coin.id]?.usd_market_cap ?? 0,
    }));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
