"use client";
import { useState } from "react";

type Account = { name: string; balance: number };

const INITIAL_ACCOUNTS: Account[] = [
  { name: "You", balance: 1000 },
  { name: "Alice", balance: 500 },
  { name: "Bob", balance: 0 },
  { name: "Contract", balance: 250 },
];

const TOKEN_NAME = "DEMO";
const TOTAL_SUPPLY = INITIAL_ACCOUNTS.reduce((s, a) => s + a.balance, 0);

export default function ERC20Demo() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(2);
  const [amount, setAmount] = useState(100);
  const [log, setLog] = useState<string[]>([]);
  const [error, setError] = useState("");

  function transfer() {
    setError("");
    if (from === to) { setError("Cannot send to yourself."); return; }
    if (amount <= 0) { setError("Amount must be positive."); return; }
    const sender = accounts[from];
    if (sender.balance < amount) {
      setError(`Insufficient balance: ${sender.name} has ${sender.balance} ${TOKEN_NAME}.`);
      return;
    }
    setAccounts((prev) =>
      prev.map((a, i) => {
        if (i === from) return { ...a, balance: a.balance - amount };
        if (i === to) return { ...a, balance: a.balance + amount };
        return a;
      })
    );
    setLog((prev) => [
      `Transfer: ${accounts[from].name} → ${accounts[to].name}: ${amount} ${TOKEN_NAME}`,
      ...prev.slice(0, 9),
    ]);
  }

  function reset() {
    setAccounts(INITIAL_ACCOUNTS);
    setLog([]);
    setError("");
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-orange-400 font-mono text-sm uppercase tracking-widest">
          ERC-20 Token: {TOKEN_NAME}
        </h3>
        <button
          onClick={reset}
          className="text-zinc-500 hover:text-zinc-300 font-mono text-xs transition-colors"
        >
          reset
        </button>
      </div>

      {/* Token metadata */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Token Name", value: TOKEN_NAME },
          { label: "Total Supply", value: `${TOTAL_SUPPLY.toLocaleString()}` },
          { label: "Standard", value: "ERC-20" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-zinc-800 rounded p-3 text-center">
            <p className="text-zinc-500 font-mono text-xs">{label}</p>
            <p className="text-zinc-200 font-mono text-sm font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Balances */}
      <div className="space-y-2">
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Balances</p>
        <div className="grid grid-cols-2 gap-2">
          {accounts.map((acc, i) => {
            const pct = (acc.balance / TOTAL_SUPPLY) * 100;
            return (
              <div key={i} className="bg-zinc-800 rounded p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-300 font-mono text-sm">{acc.name}</span>
                  <span className="text-orange-400 font-mono text-sm font-bold">
                    {acc.balance} {TOKEN_NAME}
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-zinc-600 text-xs font-mono mt-1">{pct.toFixed(1)}% of supply</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transfer controls */}
      <div className="bg-zinc-800 rounded-lg p-4 space-y-4">
        <p className="text-zinc-400 font-mono text-sm">Send tokens</p>
        <div className="grid grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-zinc-500 font-mono text-xs block mb-1">From</label>
            <select
              value={from}
              onChange={(e) => setFrom(Number(e.target.value))}
              className="w-full bg-zinc-700 border border-zinc-600 text-zinc-200 font-mono text-sm rounded px-3 py-2"
            >
              {accounts.map((a, i) => (
                <option key={i} value={i}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-zinc-500 font-mono text-xs block mb-1">To</label>
            <select
              value={to}
              onChange={(e) => setTo(Number(e.target.value))}
              className="w-full bg-zinc-700 border border-zinc-600 text-zinc-200 font-mono text-sm rounded px-3 py-2"
            >
              {accounts.map((a, i) => (
                <option key={i} value={i}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-zinc-500 font-mono text-xs block mb-1">Amount</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-zinc-700 border border-zinc-600 text-zinc-200 font-mono text-sm rounded px-3 py-2"
            />
          </div>
        </div>
        {error && <p className="text-red-400 font-mono text-xs">{error}</p>}
        <button
          onClick={transfer}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-mono text-sm py-2 rounded transition-colors"
        >
          transfer({accounts[from]?.name}, {accounts[to]?.name}, {amount})
        </button>
      </div>

      {/* Event log */}
      {log.length > 0 && (
        <div className="bg-zinc-800 rounded p-4 space-y-1 font-mono text-xs">
          <p className="text-zinc-500 uppercase tracking-widest mb-2">Transfer Events</p>
          {log.map((entry, i) => (
            <p key={i} className="text-green-400">
              ✓ {entry}
            </p>
          ))}
        </div>
      )}

      <p className="text-zinc-600 text-xs font-mono border-t border-zinc-800 pt-4">
        ERC-20 defines 6 functions: totalSupply, balanceOf, transfer, transferFrom, approve, allowance.
        Any contract implementing these 6 functions is an ERC-20 token. USDC, USDT, DAI are all ERC-20.
      </p>
    </div>
  );
}
