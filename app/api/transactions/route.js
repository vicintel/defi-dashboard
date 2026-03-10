import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "address required" }, { status: 400 });
  }

  const apiKey = process.env.ETHERSCAN_API_KEY || "";
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${apiKey}`;

  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    const data = await res.json();

    if (data.status !== "1") {
      return NextResponse.json({ transactions: [] });
    }

    const transactions = data.result.map((tx) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      timeStamp: tx.timeStamp,
      isError: tx.isError,
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice,
    }));

    return NextResponse.json({ transactions });
  } catch {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}
