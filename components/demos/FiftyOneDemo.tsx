"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function FiftyOneDemo() {
  const [attackPct, setAttackPct] = useState(30);
  const [running, setRunning] = useState(false);
  const [honestBlocks, setHonestBlocks] = useState(0);
  const [attackBlocks, setAttackBlocks] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const honestPct = 100 - attackPct;
  const has51 = attackPct >= 51;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => e + 1);
        // Probabilistic: each tick one side "finds" a block proportional to hash power
        if (Math.random() * 100 < honestPct) setHonestBlocks(h => h + 1);
        if (Math.random() * 100 < attackPct) setAttackBlocks(a => a + 1);
      }, 200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, honestPct, attackPct]);

  function reset() {
    setRunning(false);
    setHonestBlocks(0);
    setAttackBlocks(0);
    setElapsed(0);
  }

  const attackerLeads = attackBlocks > honestBlocks;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-5">
      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">51% Attack Simulation</span>

      {/* Hash power split */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-green-400">Honest miners: {honestPct}%</span>
          <span className="text-red-400">Attacker: {attackPct}%</span>
        </div>
        <div className="relative">
          <input
            type="range" min={10} max={75} value={attackPct}
            onChange={e => { reset(); setAttackPct(Number(e.target.value)); }}
            className="w-full accent-red-500"
          />
        </div>
        <div className="h-4 rounded overflow-hidden flex">
          <div className="bg-green-700 transition-all" style={{ width: `${honestPct}%` }} />
          <div className="bg-red-700 transition-all" style={{ width: `${attackPct}%` }} />
        </div>
        {has51 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 font-mono">
            ⚠ Attacker has majority hash power. They can outpace the honest chain.
          </motion.p>
        )}
      </div>

      {/* Chain race visualization */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono text-green-400">Honest chain</span>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: honestBlocks }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-green-700 rounded-sm" />
            ))}
            {honestBlocks === 0 && <div className="w-4 h-4 bg-zinc-800 rounded-sm" />}
          </div>
          <span className="text-xs font-mono text-zinc-500">{honestBlocks} blocks</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono text-red-400">Attacker chain (secret)</span>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: attackBlocks }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-red-800 rounded-sm" />
            ))}
            {attackBlocks === 0 && <div className="w-4 h-4 bg-zinc-800 rounded-sm" />}
          </div>
          <span className="text-xs font-mono text-zinc-500">{attackBlocks} blocks</span>
        </div>
      </div>

      {attackerLeads && has51 && running && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-red-950/40 border border-red-800 rounded p-3 text-xs font-mono text-red-300">
          Attacker's chain is longer. If broadcast now, the network switches.
          Any transaction in the honest chain could be erased — enabling double-spend.
        </motion.div>
      )}

      {!has51 && honestBlocks > 0 && (
        <p className="text-xs font-mono text-green-500">
          Honest chain grows faster. The attacker's secret chain can't catch up.
          This is Bitcoin's security at work.
        </p>
      )}

      <div className="flex gap-3">
        <button onClick={() => setRunning(r => !r)}
          className="px-4 py-1.5 text-xs font-mono bg-orange-600 hover:bg-orange-500 text-white rounded transition-colors">
          {running ? "Pause" : "Start Race"}
        </button>
        <button onClick={reset}
          className="px-4 py-1.5 text-xs font-mono bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors">
          Reset
        </button>
      </div>

      <p className="text-xs text-zinc-600 font-mono leading-relaxed">
        At Bitcoin's current hashrate, a 1-hour 51% attack costs ~$1B+ in hardware and electricity.
        The economic incentive to attack is almost always less than the cost.
      </p>
    </div>
  );
}
