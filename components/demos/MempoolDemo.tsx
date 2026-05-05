"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tx {
  id: string;
  from: string;
  to: string;
  amount: string;
  fee: number;
  status: "waiting" | "selected" | "confirmed";
}

const INITIAL_TXS: Tx[] = [
  { id: "tx1", from: "Alice",   to: "Bob",    amount: "0.5 BTC",  fee: 50,  status: "waiting" },
  { id: "tx2", from: "Carol",   to: "Dave",   amount: "2.0 BTC",  fee: 8,   status: "waiting" },
  { id: "tx3", from: "Eve",     to: "Frank",  amount: "0.1 BTC",  fee: 120, status: "waiting" },
  { id: "tx4", from: "Grace",   to: "Hal",    amount: "5.0 BTC",  fee: 3,   status: "waiting" },
  { id: "tx5", from: "Ivan",    to: "Judy",   amount: "0.25 BTC", fee: 75,  status: "waiting" },
  { id: "tx6", from: "Kevin",   to: "Laura",  amount: "1.2 BTC",  fee: 15,  status: "waiting" },
  { id: "tx7", from: "Mallory", to: "Nancy",  amount: "0.8 BTC",  fee: 200, status: "waiting" },
  { id: "tx8", from: "Oscar",   to: "Peggy",  amount: "3.0 BTC",  fee: 2,   status: "waiting" },
];

const BLOCK_CAPACITY = 3;

export default function MempoolDemo() {
  const [txs, setTxs] = useState<Tx[]>(INITIAL_TXS);
  const [mined, setMined] = useState(false);

  const sorted = [...txs].sort((a, b) => b.fee - a.fee);
  const toInclude = sorted.slice(0, BLOCK_CAPACITY);
  const excluded = sorted.slice(BLOCK_CAPACITY);

  function mineBlock() {
    setTxs(prev =>
      prev.map(tx => {
        const included = toInclude.find(t => t.id === tx.id);
        return included ? { ...tx, status: "confirmed" } : tx;
      })
    );
    setMined(true);
  }

  function reset() {
    setTxs(INITIAL_TXS);
    setMined(false);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Mempool ({txs.filter(t => t.status === "waiting").length} unconfirmed)
        </span>
        <div className="flex gap-2">
          {!mined ? (
            <button onClick={mineBlock} className="px-3 py-1 text-xs font-mono bg-orange-600 hover:bg-orange-500 text-white rounded transition-colors">
              Mine Block (capacity: {BLOCK_CAPACITY} txs)
            </button>
          ) : (
            <button onClick={reset} className="px-3 py-1 text-xs font-mono bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors">
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-5 gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest px-2">
          <span className="col-span-2">Transaction</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Fee (sat)</span>
          <span className="text-right">Status</span>
        </div>
        <AnimatePresence>
          {sorted.map((tx, i) => {
            const willInclude = toInclude.find(t => t.id === tx.id);
            return (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`grid grid-cols-5 gap-2 px-3 py-2 rounded text-xs font-mono items-center border transition-colors ${
                  tx.status === "confirmed"
                    ? "bg-green-950/30 border-green-800 text-green-400"
                    : willInclude && !mined
                    ? "bg-zinc-800 border-zinc-600 text-zinc-200"
                    : "bg-zinc-950 border-zinc-800 text-zinc-500"
                }`}
              >
                <span className="col-span-2 truncate">{tx.from} → {tx.to}</span>
                <span className="text-right">{tx.amount}</span>
                <span className={`text-right ${tx.fee > 50 ? "text-orange-400" : ""}`}>{tx.fee}</span>
                <span className="text-right">
                  {tx.status === "confirmed" ? "✓ mined" : willInclude && !mined ? "next" : "waiting"}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {!mined && (
        <p className="text-xs text-zinc-600 font-mono">
          Miners sort by fee. Top {BLOCK_CAPACITY} (highlighted) get included next.
          Low-fee transactions wait — sometimes for hours.
        </p>
      )}
      {mined && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-green-500 font-mono">
          Block mined. {BLOCK_CAPACITY} transactions confirmed. {excluded.length} remain in the mempool.
        </motion.p>
      )}
    </div>
  );
}
