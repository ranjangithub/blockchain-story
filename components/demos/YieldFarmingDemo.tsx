"use client";
import { useState, useEffect, useRef } from "react";

type Pool = {
  name: string;
  baseAPY: number;
  rewardAPY: number;
  token: string;
  risk: "low" | "medium" | "high";
};

const POOLS: Pool[] = [
  { name: "USDC / ETH", baseAPY: 8, rewardAPY: 45, token: "COMP", risk: "low" },
  { name: "ETH / WBTC", baseAPY: 12, rewardAPY: 80, token: "CRV", risk: "medium" },
  { name: "SHIB / ETH",  baseAPY: 5,  rewardAPY: 240, token: "SHIB", risk: "high" },
];

const RISK_COLOR = { low: "text-green-400", medium: "text-yellow-400", high: "text-red-400" };
const RISK_BG   = { low: "bg-green-900/30", medium: "bg-yellow-900/30", high: "bg-red-900/30" };

export default function YieldFarmingDemo() {
  const [selected, setSelected] = useState(0);
  const [deposited, setDeposited] = useState(10000);
  const [compounding, setCompounding] = useState(true);
  const [days, setDays] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const pool = POOLS[selected];
  const totalAPY = pool.baseAPY + pool.rewardAPY;
  const dailyRate = totalAPY / 100 / 365;

  function calcValue(d: number) {
    if (compounding) {
      return deposited * Math.pow(1 + dailyRate, d);
    }
    return deposited + deposited * dailyRate * d;
  }

  const currentValue = calcValue(days);
  const profit = currentValue - deposited;
  const roi = (profit / deposited) * 100;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setDays((d) => {
          if (d >= 365) {
            setRunning(false);
            return 365;
          }
          return d + 1;
        });
      }, 20);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  function startStop() {
    if (days >= 365) { setDays(0); setRunning(true); return; }
    setRunning((r) => !r);
  }
  function reset() { setRunning(false); setDays(0); }

  const progressPct = (days / 365) * 100;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6 space-y-6">
      <h3 className="text-orange-400 font-mono text-sm uppercase tracking-widest">
        Yield Farming Simulator
      </h3>

      {/* Pool selector */}
      <div className="grid grid-cols-3 gap-2">
        {POOLS.map((p, i) => (
          <button
            key={p.name}
            onClick={() => { setSelected(i); reset(); }}
            className={`rounded p-3 text-left transition-all border ${
              selected === i
                ? "border-orange-500 bg-zinc-800"
                : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
            }`}
          >
            <p className="text-zinc-200 font-mono text-xs font-bold">{p.name}</p>
            <p className={`font-mono text-xs mt-1 ${RISK_COLOR[p.risk]}`}>
              {p.baseAPY + p.rewardAPY}% APY · {p.risk} risk
            </p>
            <p className="text-zinc-500 font-mono text-xs">rewards in {p.token}</p>
          </button>
        ))}
      </div>

      {/* APY breakdown */}
      <div className={`rounded-lg p-4 ${RISK_BG[pool.risk]} border border-zinc-700 space-y-2`}>
        <div className="flex justify-between font-mono text-sm">
          <span className="text-zinc-400">Liquidity provider fee APY</span>
          <span className="text-zinc-200">{pool.baseAPY}%</span>
        </div>
        <div className="flex justify-between font-mono text-sm">
          <span className="text-zinc-400">{pool.token} reward APY</span>
          <span className="text-yellow-400 font-bold">+{pool.rewardAPY}%</span>
        </div>
        <div className="border-t border-zinc-600 pt-2 flex justify-between font-mono text-sm font-bold">
          <span className="text-zinc-300">Total APY</span>
          <span className="text-orange-400">{totalAPY}%</span>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-zinc-500 font-mono text-xs block mb-1">Initial deposit ($)</label>
          <input
            type="number"
            min={100}
            step={1000}
            value={deposited}
            onChange={(e) => { setDeposited(Number(e.target.value)); reset(); }}
            className="w-full bg-zinc-700 border border-zinc-600 text-zinc-200 font-mono text-sm rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={compounding}
              onChange={(e) => { setCompounding(e.target.checked); reset(); }}
              className="accent-orange-500"
            />
            <span className="text-zinc-400 font-mono text-sm">Auto-compound</span>
          </label>
          <p className="text-zinc-600 font-mono text-xs mt-1">
            Reinvest rewards daily
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between font-mono text-xs text-zinc-500">
          <span>Day {days}</span>
          <span>365 days</span>
        </div>
        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-800 rounded p-3 text-center">
          <p className="text-zinc-500 font-mono text-xs">Current value</p>
          <p className="text-zinc-200 font-mono text-sm font-bold mt-1">
            ${currentValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-zinc-800 rounded p-3 text-center">
          <p className="text-zinc-500 font-mono text-xs">Profit</p>
          <p className="text-green-400 font-mono text-sm font-bold mt-1">
            +${profit.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-zinc-800 rounded p-3 text-center">
          <p className="text-zinc-500 font-mono text-xs">ROI</p>
          <p className="text-orange-400 font-mono text-sm font-bold mt-1">
            {roi.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={startStop}
          className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-mono text-sm py-2 rounded transition-colors"
        >
          {running ? "Pause" : days >= 365 ? "Restart" : days === 0 ? "Start farming →" : "Resume"}
        </button>
        <button
          onClick={reset}
          className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-mono text-sm px-4 py-2 rounded transition-colors"
        >
          Reset
        </button>
      </div>

      <p className="text-zinc-600 text-xs font-mono border-t border-zinc-800 pt-4">
        Warning: reward APYs are paid in new tokens whose price is speculative. If the token
        price drops 80% while you farm, your "240% APY" earns you negative real returns.
        DeFi Summer 2020 yields were real. Most token prices later collapsed.
      </p>
    </div>
  );
}
