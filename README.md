# DeFi Dashboard

A wallet-connected dashboard for tracking Ethereum balances, live token prices, and
transaction history. Connect MetaMask, and it reads your ERC-20 balances straight from
the chain and pairs them with live market data.

Built with Next.js 14 (App Router), ethers v6, and Tailwind CSS.

## What it does

- **Wallet connect** — MetaMask via `ethers.BrowserProvider`, with network detection and
  a truncated address display. No wallet, no data: nothing is stored server-side.
- **Live prices** — ETH, BTC, BNB, SOL, USDC and USDT with 24h change and market cap,
  from CoinGecko.
- **Token balances** — ERC-20 balances read directly from mainnet contracts (USDT, USDC,
  DAI and others), priced against the live feed.
- **Transaction history** — the 20 most recent transactions for the connected address,
  with gas cost and success/failure status.

## How it's put together

Third-party APIs are called from route handlers, never from the browser, so API keys stay
on the server and responses can be cached:

```
app/api/prices/route.js         → CoinGecko, revalidated every 60s
app/api/transactions/route.js   → Etherscan,  revalidated every 30s
```

Chain reads (`balanceOf` on each token contract) happen client-side through the user's own
wallet provider, so there's no RPC key to manage and no node to pay for.

```
app/          App Router pages and API route handlers
components/   Navbar, PriceCards, TokenBalances, TransactionHistory
lib/          Token contract definitions and the CoinGecko client
```

## Running it locally

```bash
npm install
cp .env.example .env.local   # add your Etherscan key
npm run dev
```

| Variable | Required | Notes |
| --- | --- | --- |
| `ETHERSCAN_API_KEY` | for transaction history | Free tier is enough. Prices and balances work without it. |

Then open http://localhost:3000 with MetaMask installed.

## Notes

- Read-only. The app never requests a signature, never submits a transaction, and never
  touches your private keys.
- Ethereum mainnet only.
- Built as a portfolio project to work through wallet connection, on-chain reads, and
  server-side API caching in the App Router.

## License

MIT
