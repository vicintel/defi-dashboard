"use client";

export default function Navbar({ account, onConnect, onDisconnect, network }) {
  const short = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : null;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-dark/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-brand/40 bg-brand/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00f5a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-bold tracking-widest text-brand text-glow">
            DEFI DASHBOARD
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {network && (
            <div className="flex items-center gap-2 rounded border border-border px-3 py-1.5 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
              {network}
            </div>
          )}

          {account ? (
            <div className="flex items-center gap-2">
              <div className="rounded border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-medium text-brand">
                {short}
              </div>
              <button
                onClick={onDisconnect}
                className="rounded border border-border px-3 py-1.5 text-xs text-slate-500 transition hover:border-red-500/40 hover:text-red-400"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="rounded border border-brand/50 bg-brand/10 px-4 py-2 text-xs font-semibold text-brand transition hover:bg-brand/20 hover:shadow-[0_0_16px_rgba(0,245,160,0.3)]"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
