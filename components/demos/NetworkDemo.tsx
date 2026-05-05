"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ALL_NODES = [
  { id: "satoshi", label: "Satoshi",   x: 50, y: 15 },
  { id: "you",     label: "You",       x: 20, y: 50 },
  { id: "hal",     label: "Hal",       x: 80, y: 50 },
  { id: "alice",   label: "Alice",     x: 35, y: 82 },
  { id: "bob",     label: "Bob",       x: 65, y: 82 },
  { id: "carol",   label: "Carol",     x: 10, y: 20 },
  { id: "dave",    label: "Dave",      x: 88, y: 20 },
];

const EDGES_BY_COUNT: Record<number, [string, string][]> = {
  2: [["satoshi","you"]],
  3: [["satoshi","you"],["satoshi","hal"],["you","hal"]],
  4: [["satoshi","you"],["satoshi","hal"],["you","hal"],["you","alice"],["hal","alice"]],
  5: [["satoshi","you"],["satoshi","hal"],["you","hal"],["you","alice"],["hal","alice"],["alice","bob"],["hal","bob"]],
  6: [["satoshi","you"],["satoshi","hal"],["you","hal"],["you","alice"],["hal","alice"],["alice","bob"],["hal","bob"],["satoshi","carol"],["carol","you"]],
  7: [["satoshi","you"],["satoshi","hal"],["you","hal"],["you","alice"],["hal","alice"],["alice","bob"],["hal","bob"],["satoshi","carol"],["carol","you"],["satoshi","dave"],["dave","hal"]],
};

export default function NetworkDemo() {
  const [nodeCount, setNodeCount] = useState(2);

  const visibleNodes = ALL_NODES.slice(0, nodeCount);
  const edges = EDGES_BY_COUNT[nodeCount] || [];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">P2P Network Growth</span>
        <span className="text-xs font-mono text-zinc-400">{nodeCount} nodes · {edges.length} connections</span>
      </div>

      <div className="relative h-56 bg-zinc-950 rounded border border-zinc-800">
        <svg className="absolute inset-0 w-full h-full">
          {edges.map(([a, b]) => {
            const na = ALL_NODES.find(n => n.id === a)!;
            const nb = ALL_NODES.find(n => n.id === b)!;
            return (
              <motion.line
                key={`${a}-${b}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                x1={`${na.x}%`} y1={`${na.y}%`}
                x2={`${nb.x}%`} y2={`${nb.y}%`}
                stroke="#52525b" strokeWidth="1"
              />
            );
          })}
        </svg>

        <AnimatePresence>
          {visibleNodes.map(node => (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
            >
              <div className="w-3 h-3 rounded-full bg-orange-500 ring-2 ring-orange-800" />
              <span className="text-[10px] font-mono text-zinc-400">{node.label}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-zinc-500 w-20">Nodes: {nodeCount}</span>
        <input
          type="range" min={2} max={7} value={nodeCount}
          onChange={e => setNodeCount(Number(e.target.value))}
          className="flex-1 accent-orange-500"
        />
      </div>

      <p className="text-xs text-zinc-600 font-mono">
        No server. No central database. The ledger exists on every node simultaneously.
        Take any one offline — the network continues.
      </p>
    </div>
  );
}
