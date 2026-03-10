import "./globals.css";

export const metadata = {
  title: "DeFi Dashboard — Victor Dickson",
  description: "Personal DeFi wallet dashboard — token balances, live prices, transaction history.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark antialiased">{children}</body>
    </html>
  );
}
