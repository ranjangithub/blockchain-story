"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GENESIS_HASH = "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f";

const GENESIS_HEADER = {
  version: "1",
  prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
  merkleRoot: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
  timestamp: "1231006505",
};

interface MineState {
  status: "idle" | "mining" | "found" | "stopped";
  nonce: number;
  hash: string;
  elapsed: number;
}

export default function MiningDemo() {
  const [difficulty, setDifficulty] = useState(3);
  const [state, setState] = useState<MineState>({ status: "idle", nonce: 0, hash: "", elapsed: 0 });
  const [showGenesis, setShowGenesis] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const startTimeRef = useRef<number>(0);

  const header = Object.values(GENESIS_HEADER).join("|");

  function startMining() {
    if (workerRef.current) workerRef.current.terminate();
    setShowGenesis(false);
    startTimeRef.current = Date.now();

    setState({ status: "mining", nonce: 0, hash: "", elapsed: 0 });

    const worker = new Worker(
      new URL("../../lib/crypto/mining.worker.ts", import.meta.url),
      { type: "module" }
    );
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (e.data.type === "progress") {
        setState({ status: "mining", nonce: e.data.nonce, hash: e.data.hash, elapsed });
      } else if (e.data.type === "found") {
        setState({ status: "found", nonce: e.data.nonce, hash: e.data.hash, elapsed });
        setTimeout(() => setShowGenesis(true), 1200);
        worker.terminate();
      } else if (e.data.type === "exhausted") {
        setState((prev) => ({ ...prev, status: "stopped" }));
        worker.terminate();
      }
    };

    worker.postMessage({ header, difficulty });
  }

  function stopMining() {
    workerRef.current?.terminate();
    setState((prev) => ({ ...prev, status: "stopped" }));
  }

  const hashDisplay = state.hash || "—";
  const meetsTarget = state.hash.startsWith("0".repeat(difficulty));

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Proof of Work Demo</span>
      </div>

      {/* Block header fields */}
      <div className="grid grid-cols-1 gap-2 text-xs font-mono">
        {Object.entries(GENESIS_HEADER).map(([k, v]) => (
          <div key={k} className="flex gap-3">
            <span className="text-zinc-600 w-28 shrink-0">{k}</span>
            <span className="text-zinc-400 break-all">{v}</span>
          </div>
        ))}
        <div className="flex gap-3">
          <span className="text-zinc-600 w-28 shrink-0">nonce</span>
          <span className="text-orange-400">{state.nonce.toLocaleString()}</span>
        </div>
      </div>

      {/* Difficulty slider */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-zinc-500 w-24">Difficulty: {difficulty}</span>
        <input
          type="range"
          min={1}
          max={4}
          value={difficulty}
          onChange={(e) => setDifficulty(Number(e.target.value))}
          disabled={state.status === "mining"}
          className="flex-1 accent-orange-500"
        />
        <span className="text-xs font-mono text-zinc-600 w-24">Hash must start with {'"'}{"0".repeat(difficulty)}{'"'}</span>
      </div>

      {/* Hash output */}
      <div>
        <label className="block text-xs font-mono text-zinc-500 mb-2">Current hash</label>
        <div
          className={`font-mono text-sm break-all px-3 py-2 rounded border transition-colors ${
            state.status === "found" && meetsTarget
              ? "bg-green-950/30 border-green-600 text-green-400"
              : state.status === "mining"
              ? "bg-zinc-950 border-zinc-700 text-red-400"
              : "bg-zinc-950 border-zinc-700 text-zinc-500"
          }`}
        >
          {hashDisplay}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {state.status !== "mining" ? (
          <button
            onClick={startMining}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-mono rounded transition-colors"
          >
            {state.status === "found" ? "Mine Again" : "Start Mining"}
          </button>
        ) : (
          <button
            onClick={stopMining}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-mono rounded transition-colors"
          >
            Stop
          </button>
        )}

        {state.status === "mining" && (
          <span className="text-zinc-500 text-sm font-mono self-center">
            {state.nonce.toLocaleString()} hashes tried…
          </span>
        )}
        {(state.status === "found" || state.status === "stopped") && (
          <span className="text-zinc-500 text-sm font-mono self-center">
            {state.elapsed.toFixed(2)}s · {state.nonce.toLocaleString()} nonces
          </span>
        )}
      </div>

      {/* Genesis Block reveal */}
      <AnimatePresence>
        {showGenesis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-orange-800/60 bg-orange-950/20 rounded p-4 flex flex-col gap-2"
          >
            <p className="text-xs font-mono text-orange-400 uppercase tracking-widest">The Real Genesis Block</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Satoshi's machine ran for approximately 6 days at 2009 CPU speeds.
              At nonce 2,083,236,893, January 3rd, 2009, it found:
            </p>
            <div className="font-mono text-xs text-green-400 break-all bg-zinc-950 px-3 py-2 rounded border border-zinc-800">
              {GENESIS_HASH}
            </div>
            <p className="text-xs text-zinc-500">
              The concept is the same — just 10 leading zeros instead of your {difficulty}.
              At that difficulty, modern hardware would need ~10 minutes per block.
              That's the design. That's Bitcoin.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
