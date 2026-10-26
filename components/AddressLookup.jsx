"use client";

import { useState } from "react";
import { resolveAddress, SAMPLE_ADDRESS, SAMPLE_LABEL } from "@/lib/chain";

export default function AddressLookup({ onLookup, current }) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function lookup(input) {
    setBusy(true);
    setError(null);
    try {
      const address = await resolveAddress(input);
      if (address) onLookup(address);
      else setError("Enter a 0x address or an ENS name like vitalik.eth");
    } catch {
      setError("Couldn't resolve that name. Check it and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full lg:w-[28rem]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) lookup(value);
        }}
        className="flex gap-2"
      >
        <label htmlFor="lookup" className="sr-only">Ethereum address or ENS name</label>
        <input
          id="lookup"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0x… or name.eth"
          spellCheck={false}
          autoComplete="off"
          className="min-w-0 flex-1 rounded border border-border bg-card px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-brand/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded border border-brand/50 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand/20 disabled:opacity-50"
        >
          {busy ? "Looking up…" : "Look up"}
        </button>
      </form>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-600">
        {error ? (
          <span className="text-red-400">{error}</span>
        ) : (
          <span>No wallet needed.</span>
        )}
        {current !== SAMPLE_ADDRESS && (
          <button
            type="button"
            onClick={() => {
              setValue(SAMPLE_LABEL);
              onLookup(SAMPLE_ADDRESS);
            }}
            className="text-brand/70 underline-offset-2 transition hover:text-brand hover:underline"
          >
            Try {SAMPLE_LABEL} →
          </button>
        )}
      </div>
    </div>
  );
}
