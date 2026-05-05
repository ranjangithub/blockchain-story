"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const HALVINGS = [
  { block: 0,       year: 2009, reward: 50    },
  { block: 210000,  year: 2012, reward: 25    },
  { block: 420000,  year: 2016, reward: 12.5  },
  { block: 630000,  year: 2020, reward: 6.25  },
  { block: 840000,  year: 2024, reward: 3.125 },
  { block: 1050000, year: 2028, reward: 1.5625 },
  { block: 1260000, year: 2032, reward: 0.78125 },
];

const MAX_SUPPLY = 21_000_000;

export default function HalvingDemo() {
  const [blockHeight, setBlockHeight] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentEra = [...HALVINGS].reverse().find(h => blockHeight >= h.block) || HALVINGS[0];
  const nextHalving = HALVINGS.find(h => h.block > blockHeight);

  // Approximate mined supply
  const minedSupply = HALVINGS.reduce((acc, era, i) => {
    const nextBlock = HALVINGS[i + 1]?.block ?? blockHeight;
    const blocks = Math.min(blockHeight, nextBlock) - era.block;
    if (blocks <= 0) return acc;
    return acc + blocks * era.reward;
  }, 0);
  const supplyPct = Math.min((minedSupply / MAX_SUPPLY) * 100, 100);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setBlockHeight(h => {
          if (h >= 1_260_000) { setRunning(false); return h; }
          return h + 10000;
        });
      }, 80);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-4">
      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">The Halving — Bitcoin's Supply Schedule</span>

      {/* Block counter */}
      <div className="flex items-end gap-4">
        <div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase">Block Height</div>
          <div className="text-3xl font-bold font-mono text-zinc-200">{blockHeight.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase">Mining Reward</div>
          <div className="text-3xl font-bold font-mono text-orange-400">{currentEra.reward} BTC</div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase">Est. Year</div>
          <div className="text-3xl font-bold font-mono text-zinc-400">{currentEra.year}</div>
        </div>
      </div>

      {/* Supply bar */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs font-mono text-zinc-500">
          <span>Supply mined</span>
          <span>{minedSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })} / 21,000,000 BTC</span>
        </div>
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-orange-500"
            animate={{ width: `${supplyPct}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="text-right text-[10px] font-mono text-zinc-600">{supplyPct.toFixed(2)}%</div>
      </div>

      {/* Halving milestones */}
      <div className="grid grid-cols-4 gap-2">
        {HALVINGS.slice(0, 4).map(h => (
          <div
            key={h.block}
            className={`rounded border p-2 text-center transition-colors ${
              blockHeight >= h.block
                ? "border-orange-800 bg-orange-950/30"
                : "border-zinc-800 bg-zinc-950"
            }`}
          >
            <div className="text-[10px] font-mono text-zinc-600">{h.year}</div>
            <div className="text-sm font-bold font-mono text-zinc-300">{h.reward}</div>
            <div className="text-[10px] font-mono text-zinc-600">BTC/block</div>
          </div>
        ))}
      </div>

      {nextHalving && (
        <p className="text-xs font-mono text-zinc-500">
          Next halving: block {nextHalving.block.toLocaleString()} (~{nextHalving.year}) →{" "}
          <span className="text-orange-400">{nextHalving.reward} BTC/block</span>.{" "}
          {(nextHalving.block - blockHeight).toLocaleString()} blocks to go.
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => setRunning(r => !r)}
          className="px-4 py-1.5 text-xs font-mono bg-orange-600 hover:bg-orange-500 text-white rounded transition-colors"
        >
          {running ? "Pause" : blockHeight === 0 ? "Watch Supply Unfold" : "Continue"}
        </button>
        <button
          onClick={() => { setBlockHeight(0); setRunning(false); }}
          className="px-4 py-1.5 text-xs font-mono bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
