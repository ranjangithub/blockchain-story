"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function DifficultyDemo() {
  const [hashrate, setHashrate] = useState(50);

  // Model: baseline 50 EH/s → 10 min blocks. Linear scaling.
  const baseHashrate = 50;
  const baseBlockTime = 10;
  const rawBlockTime = (baseBlockTime * baseHashrate) / hashrate;

  // Difficulty adjusts every 2016 blocks to target 10 min
  const adjustedDifficulty = hashrate / baseHashrate;
  const blockTimeAfterAdjust = baseBlockTime;

  const difficultyChange = ((adjustedDifficulty - 1) * 100).toFixed(0);
  const sign = adjustedDifficulty >= 1 ? "+" : "";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-5">
      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Difficulty Adjustment</span>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs font-mono text-zinc-400">
          <span>Network hashrate</span>
          <span className="text-orange-400">{hashrate} EH/s</span>
        </div>
        <input
          type="range" min={5} max={200} value={hashrate}
          onChange={e => setHashrate(Number(e.target.value))}
          className="accent-orange-500"
        />
        <div className="flex justify-between text-[10px] font-mono text-zinc-600">
          <span>5 EH/s (early Bitcoin)</span>
          <span>200 EH/s (near peak)</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-950 rounded border border-zinc-800 p-3 flex flex-col gap-1">
          <span className="text-[10px] font-mono text-zinc-600 uppercase">Before adjust</span>
          <span className={`text-lg font-bold font-mono ${rawBlockTime < 8 ? "text-red-400" : rawBlockTime > 12 ? "text-yellow-400" : "text-green-400"}`}>
            {rawBlockTime.toFixed(1)} min
          </span>
          <span className="text-[10px] text-zinc-600">per block</span>
        </div>
        <div className="bg-zinc-950 rounded border border-orange-900/50 p-3 flex flex-col gap-1">
          <span className="text-[10px] font-mono text-zinc-600 uppercase">Difficulty Δ</span>
          <span className={`text-lg font-bold font-mono ${adjustedDifficulty > 1 ? "text-orange-400" : "text-blue-400"}`}>
            {sign}{difficultyChange}%
          </span>
          <span className="text-[10px] text-zinc-600">every 2,016 blocks</span>
        </div>
        <div className="bg-zinc-950 rounded border border-green-900/50 p-3 flex flex-col gap-1">
          <span className="text-[10px] font-mono text-zinc-600 uppercase">After adjust</span>
          <span className="text-lg font-bold font-mono text-green-400">
            {blockTimeAfterAdjust}.0 min
          </span>
          <span className="text-[10px] text-zinc-600">target restored</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs font-mono text-zinc-500">
          <span>Difficulty (relative)</span>
          <span>{adjustedDifficulty.toFixed(2)}x baseline</span>
        </div>
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-orange-500 rounded-full"
            animate={{ width: `${Math.min((adjustedDifficulty / 4) * 100, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <p className="text-xs text-zinc-600 font-mono leading-relaxed">
        Every 2,016 blocks (~2 weeks), Bitcoin compares actual block times against the 10-minute target
        and adjusts the required number of leading zeros. More miners → harder puzzle → back to 10 min.
        Miners leave → easier puzzle → back to 10 min. Self-correcting, forever.
      </p>
    </div>
  );
}
