import { ethers } from "ethers";

// Public mainnet endpoints that need no key and allow browser requests,
// so the dashboard can run as a static site.
const RPC = "https://ethereum-rpc.publicnode.com";
const BLOCKSCOUT = "https://eth.blockscout.com/api";

// A well-known public wallet for visitors without MetaMask.
export const SAMPLE_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
export const SAMPLE_LABEL = "vitalik.eth";

let provider;
export function readProvider() {
  provider ??= new ethers.JsonRpcProvider(RPC, 1, { staticNetwork: true });
  return provider;
}

// Accepts a 0x address or an ENS name; returns a checksummed address or null.
export async function resolveAddress(input) {
  const value = input.trim();
  if (ethers.isAddress(value)) return ethers.getAddress(value);
  if (value.endsWith(".eth")) return readProvider().resolveName(value);
  return null;
}

// Blockscout serves the Etherscan-compatible txlist without an API key.
export async function fetchTransactions(address) {
  const res = await fetch(
    `${BLOCKSCOUT}?module=account&action=txlist&address=${address}&page=1&offset=20&sort=desc`
  );
  if (!res.ok) throw new Error("Blockscout fetch failed");
  const data = await res.json();
  if (data.status !== "1") return [];
  return data.result.map((tx) => ({
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: tx.value,
    timeStamp: tx.timeStamp,
    isError: tx.isError,
    gasUsed: tx.gasUsed,
    gasPrice: tx.gasPrice,
  }));
}
