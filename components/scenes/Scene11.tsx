"use client";

import { useState, useEffect, useRef } from "react";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import { motion } from "framer-motion";

const NODES = [
  { id: "satoshi", label: "Satoshi", x: 20, y: 40 },
  { id: "you",     label: "You",     x: 75, y: 20 },
  { id: "hal",     label: "Hal",     x: 75, y: 60 },
];

const EDGES = [
  ["satoshi", "you"],
  ["satoshi", "hal"],
  ["you", "hal"],
];

export default function Scene11() {
  const [propagated, setPropagated] = useState<string[]>([]);
  const [blockCount, setBlockCount] = useState(1);
  const [confirming, setConfirming] = useState(false);

  function propagateTx() {
    setPropagated([]);
    const seq = ["satoshi", "you", "hal"];
    seq.forEach((id, i) => {
      setTimeout(() => setPropagated((prev) => [...prev, id]), i * 600);
    });
  }

  function mineBlock() {
    setConfirming(true);
    setTimeout(() => {
      setBlockCount((n) => n + 1);
      setConfirming(false);
    }, 1500);
  }

  return (
    <SceneLayout sceneId={11}>
      <Narrator>
        Satoshi's transaction is broadcast. Within seconds, it reaches every node on the
        (very small) network. Satoshi's node. Your node. Hal Finney's node. All three see it.
        All three add it to their mempool.
      </Narrator>

      {/* Network propagation visualization */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-4">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Network Propagation</span>

        <div className="relative h-36 bg-zinc-950 rounded border border-zinc-800">
          <svg className="absolute inset-0 w-full h-full">
            {EDGES.map(([a, b]) => {
              const na = NODES.find((n) => n.id === a)!;
              const nb = NODES.find((n) => n.id === b)!;
              return (
                <line
                  key={`${a}-${b}`}
                  x1={`${na.x}%`} y1={`${na.y}%`}
                  x2={`${nb.x}%`} y2={`${nb.y}%`}
                  stroke="#3f3f46" strokeWidth="1"
                />
              );
            })}
          </svg>
          {NODES.map((node) => {
            const hasTx = propagated.includes(node.id);
            return (
              <motion.div
                key={node.id}
                animate={{
                  backgroundColor: hasTx ? "#431407" : "#18181b",
                  borderColor: hasTx ? "#c2410c" : "#3f3f46",
                }}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-8 rounded border flex items-center justify-center"
              >
                <span className="text-xs font-mono text-zinc-300">{node.label}</span>
              </motion.div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={propagateTx}
            className="px-3 py-1.5 text-xs font-mono bg-orange-700 hover:bg-orange-600 text-white rounded transition-colors"
          >
            Broadcast Transaction
          </button>
          <button
            onClick={mineBlock}
            disabled={confirming || propagated.length === 0}
            className="px-3 py-1.5 text-xs font-mono bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 text-white rounded transition-colors"
          >
            {confirming ? "Mining…" : "Mine Next Block"}
          </button>
        </div>

        <div className="flex gap-4 font-mono text-xs text-zinc-500">
          <span>Chain height: <span className="text-zinc-300">{blockCount}</span></span>
          <span>Your tx: <span className={blockCount > 1 ? "text-green-400" : "text-yellow-500"}>
            {blockCount > 1 ? `${blockCount - 1} confirmation${blockCount > 2 ? "s" : ""}` : "unconfirmed"}
          </span></span>
        </div>
      </div>

      <Narrator>
        A miner — Satoshi, for now — collects transactions from the mempool, builds a block,
        and runs the proof-of-work loop. When he finds a valid nonce, he broadcasts the block.
        Every node verifies it independently and adds it to their chain.
      </Narrator>

      <Narrator>
        No one asks Satoshi for permission to add the block. No one coordinates.
        The rule is simple: the longest valid chain wins. Every node follows it.
        Consensus emerges from math, not authority.
      </Narrator>

      <Narrator>
        Your transaction now has one confirmation. Six blocks from now — roughly one hour —
        it will be considered final by any reasonable standard. Not because of a rule.
        Because of how expensive it would be to rewrite history.
      </Narrator>

      <SceneAdvance to={12} />
    </SceneLayout>
  );
}
