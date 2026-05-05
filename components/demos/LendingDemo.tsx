"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLLATERAL_ETH = 1;
const LTV = 0.75;
const LIQUIDATION_THRESHOLD = 0.80;
const BORROW_AMOUNT = 500; // USDC
const ANNUAL_RATE = 0.08;

export default function LendingDemo() {
  const [ethPrice, setEthPrice] = useState(2000);
  const [borrowed, setBorrowed] = useState(false);
  const [interest, setInterest] = useState(0);
  const [liquidated, setLiquidated] = useState(false);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const collateralValue = ethPrice * COLLATERAL_ETH;
  const maxBorrow = collateralValue * LTV;
  const currentLTV = borrowed ? (BORROW_AMOUNT + interest) / collateralValue : 0;
  const liquidationPrice = borrowed ? (BORROW_AMOUNT + interest) / LIQUIDATION_THRESHOLD : 0;
  const atRisk = borrowed && currentLTV >= LIQUIDATION_THRESHOLD * 0.9;
  const shouldLiquidate = borrowed && currentLTV >= LIQUIDATION_THRESHOLD;

  // Interest accrual
  useEffect(() => {
    if (borrowed && !liquidated) {
      const iv = setInterval(() => {
        setInterest(i => +(i + BORROW_AMOUNT * (ANNUAL_RATE / (365 * 24 * 3600)) * 2).toFixed(4));
      }, 2000);
      return () => clearInterval(iv);
    }
  }, [borrowed, liquidated]);

  // Price crash simulation
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setEthPrice(p => {
          const next = +(p - 30).toFixed(0);
          if (next <= 0) { setRunning(false); return p; }
          return next;
        });
      }, 150);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  useEffect(() => {
    if (shouldLiquidate && !liquidated) {
      setLiquidated(true);
      setRunning(false);
    }
  }, [shouldLiquidate, liquidated]);

  function reset() {
    setEthPrice(2000);
    setBorrowed(false);
    setInterest(0);
    setLiquidated(false);
    setRunning(false);
  }

  const ltvPct = Math.min(currentLTV * 100, 100);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-4">
      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Lending Protocol Demo</span>

      {/* Position overview */}
      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-zinc-950 rounded border border-zinc-800 p-3 flex flex-col gap-2">
          <span className="text-zinc-600 uppercase tracking-wide">Collateral</span>
          <span className="text-blue-400 text-lg font-bold">{COLLATERAL_ETH} ETH</span>
          <span className="text-zinc-500">= ${collateralValue.toLocaleString()} @ ${ethPrice}/ETH</span>
          <span className="text-zinc-600">Liquidation trigger: ${liquidationPrice > 0 ? liquidationPrice.toFixed(0) : "—"}</span>
        </div>
        <div className="bg-zinc-950 rounded border border-zinc-800 p-3 flex flex-col gap-2">
          <span className="text-zinc-600 uppercase tracking-wide">Borrowed</span>
          <span className="text-green-400 text-lg font-bold">{borrowed ? `$${(BORROW_AMOUNT + interest).toFixed(2)}` : "—"}</span>
          <span className="text-zinc-500">Max borrow: ${maxBorrow.toFixed(0)}</span>
          <span className="text-zinc-600">APR: {(ANNUAL_RATE * 100).toFixed(0)}% — accruing live</span>
        </div>
      </div>

      {/* LTV bar */}
      {borrowed && (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-500">Loan-to-Value ratio</span>
            <span className={atRisk ? "text-red-400" : "text-zinc-300"}>{(currentLTV * 100).toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${
                ltvPct >= 80 ? "bg-red-500" : ltvPct >= 60 ? "bg-yellow-500" : "bg-green-500"
              }`}
              animate={{ width: `${ltvPct}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-zinc-600">
            <span>0%</span>
            <span className="text-yellow-600">Safe zone</span>
            <span className="text-red-600">Liquidation: 80%</span>
          </div>
        </div>
      )}

      {/* ETH price control */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs font-mono text-zinc-400">
          <span>ETH price</span>
          <span className="text-orange-400">${ethPrice}</span>
        </div>
        <input type="range" min={400} max={4000} value={ethPrice}
          onChange={e => { if (!liquidated) setEthPrice(Number(e.target.value)); }}
          className="accent-orange-500" />
      </div>

      <AnimatePresence>
        {liquidated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-red-950/40 border border-red-800 rounded p-4 text-xs font-mono text-red-300 flex flex-col gap-1">
            <span className="font-bold text-red-400">LIQUIDATED</span>
            <span>ETH price fell to ${ethPrice}. LTV hit {(LIQUIDATION_THRESHOLD * 100).toFixed(0)}%.</span>
            <span>Protocol seized your 1 ETH collateral and repaid the loan automatically.</span>
            <span className="text-zinc-500 mt-1">No call from the bank. No negotiation. The code ran.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 flex-wrap">
        {!borrowed && !liquidated && (
          <button onClick={() => setBorrowed(true)}
            className="px-4 py-1.5 text-xs font-mono bg-green-700 hover:bg-green-600 text-white rounded transition-colors">
            Deposit 1 ETH → Borrow $500 USDC
          </button>
        )}
        {borrowed && !liquidated && (
          <button onClick={() => setRunning(r => !r)}
            className="px-4 py-1.5 text-xs font-mono bg-red-700 hover:bg-red-600 text-white rounded transition-colors">
            {running ? "Pause Crash" : "Crash ETH Price"}
          </button>
        )}
        <button onClick={reset}
          className="px-4 py-1.5 text-xs font-mono bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors">
          Reset
        </button>
      </div>
    </div>
  );
}
