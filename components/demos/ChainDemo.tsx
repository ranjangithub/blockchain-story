"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { sha256Hex } from "@/lib/crypto/hash";

interface Block {
  id: number;
  transactions: string;
  hash: string;
  prevHash: string;
}

const GENESIS_PREV = "0000000000000000000000000000000000000000000000000000000000000000";

function computeBlockHash(prevHash: string, transactions: string): string {
  return sha256Hex(`${prevHash}|${transactions}`);
}

function buildChain(txs: string[]): Block[] {
  const chain: Block[] = [];
  let prevHash = GENESIS_PREV;
  for (let i = 0; i < txs.length; i++) {
    const hash = computeBlockHash(prevHash, txs[i]);
    chain.push({ id: i + 1, transactions: txs[i], hash, prevHash });
    prevHash = hash;
  }
  return chain;
}

const INITIAL_TXS = [
  "Satoshi → Hal: 10 BTC\nSatoshi → You: 5 BTC",
  "You → Alice: 2 BTC\nHal → Bob: 3 BTC",
  "Alice → Carol: 1 BTC\nBob → Dave: 1 BTC",
];

export default function ChainDemo() {
  const [txs, setTxs] = useState(INITIAL_TXS);
  const [chain, setChain] = useState<Block[]>([]);

  useEffect(() => {
    setChain(buildChain(txs));
  }, [txs]);

  function rebuildFrom(index: number) {
    const newTxs = [...txs];
    setTxs(newTxs);
    const rebuilt = buildChain(newTxs);
    setChain(rebuilt);
  }

  function updateTx(index: number, value: string) {
    const newTxs = [...txs];
    newTxs[index] = value;
    setTxs(newTxs);
  }

  function resetAll() {
    setTxs(INITIAL_TXS);
  }

  // Determine which blocks are "broken" (prev_hash doesn't match previous block's actual hash)
  const originalChain = buildChain(INITIAL_TXS);
  const isBroken = chain.map((block, i) => {
    if (i === 0) return block.prevHash !== GENESIS_PREV;
    return block.prevHash !== chain[i - 1].hash;
  });

  const anyBroken = isBroken.some(Boolean);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Chain Immutability Demo</span>
        {anyBroken && (
          <button
            onClick={resetAll}
            className="text-xs font-mono text-orange-400 hover:text-orange-300 transition-colors"
          >
            Reset chain
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {chain.map((block, i) => {
          const broken = isBroken[i];
          const prevBroken = i > 0 && isBroken[i - 1];

          return (
            <motion.div
              key={block.id}
              layout
              className={`rounded border p-4 flex flex-col gap-3 transition-colors ${
                broken
                  ? "border-red-700 bg-red-950/20"
                  : "border-zinc-700 bg-zinc-950"
              }`}
            >
              {/* Block header */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-zinc-300">Block {block.id}</span>
                {broken && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-mono text-red-400"
                  >
                    ✗ BROKEN — prev_hash mismatch
                  </motion.span>
                )}
                {!broken && anyBroken && i > 0 && !prevBroken && (
                  <span className="text-xs font-mono text-green-500">✓ valid (not yet re-mined)</span>
                )}
              </div>

              {/* Previous block hash */}
              <div>
                <span className="text-xs font-mono text-zinc-600">prev_hash</span>
                <div className={`font-mono text-xs break-all mt-1 ${broken ? "text-red-400" : "text-zinc-500"}`}>
                  {block.prevHash}
                </div>
              </div>

              {/* Transactions — editable for block 1 */}
              <div>
                <span className="text-xs font-mono text-zinc-600">transactions</span>
                {i === 0 ? (
                  <textarea
                    value={block.transactions}
                    onChange={(e) => updateTx(i, e.target.value)}
                    rows={2}
                    className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-zinc-300 font-mono text-xs resize-none focus:outline-none focus:border-orange-500"
                  />
                ) : (
                  <div className="font-mono text-xs text-zinc-400 mt-1 whitespace-pre-line">
                    {block.transactions}
                  </div>
                )}
              </div>

              {/* This block's hash */}
              <div>
                <span className="text-xs font-mono text-zinc-600">hash</span>
                <div className={`font-mono text-xs break-all mt-1 ${broken ? "text-red-500" : "text-green-500"}`}>
                  {block.hash}
                </div>
              </div>

              {/* Re-mine button for broken blocks */}
              {broken && (
                <button
                  onClick={() => rebuildFrom(i)}
                  className="self-start text-xs font-mono text-orange-400 hover:text-orange-300 border border-orange-800 hover:border-orange-600 rounded px-3 py-1 transition-colors"
                >
                  Re-mine block {block.id} (and all after it)
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {anyBroken && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-zinc-400 leading-relaxed"
        >
          You changed Block 1. Its hash changed. Block 2's <code className="text-orange-300 text-xs">prev_hash</code> is now wrong.
          Block 3 breaks too. To fix it, you'd re-mine Block 1, then Block 2, then Block 3 — faster
          than the rest of the network adds honest blocks. That's why rewriting history is astronomically expensive.
        </motion.p>
      )}
    </div>
  );
}
