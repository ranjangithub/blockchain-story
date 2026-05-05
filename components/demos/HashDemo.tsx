"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sha256Hex } from "@/lib/crypto/hash";

export default function HashDemo() {
  const [input, setInput] = useState("Hello, Satoshi.");
  const [hash, setHash] = useState("");
  const [prevHash, setPrevHash] = useState("");
  const [exploding, setExploding] = useState(false);
  const prevInput = useRef(input);

  useEffect(() => {
    setHash(sha256Hex(input));
  }, []);

  function handleChange(val: string) {
    const newHash = sha256Hex(val);
    if (prevInput.current !== val) {
      setPrevHash(hash);
      setExploding(true);
      setTimeout(() => setExploding(false), 600);
    }
    prevInput.current = val;
    setInput(val);
    setHash(newHash);
  }

  function renderHashDiff() {
    if (!prevHash || prevHash === hash) return null;
    return (
      <div className="mt-2 flex gap-3 text-xs font-mono text-zinc-500">
        <span className="line-through text-zinc-600">{prevHash.slice(0, 16)}…</span>
        <span className="text-orange-400">{hash.slice(0, 16)}…</span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">SHA-256 Live Demo</span>
      </div>

      {/* Input */}
      <div>
        <label className="block text-xs font-mono text-zinc-500 mb-2">Input — try changing one character</label>
        <textarea
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          rows={3}
          className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-zinc-200 font-mono text-sm resize-none focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {/* Hash output */}
      <div>
        <label className="block text-xs font-mono text-zinc-500 mb-2">SHA-256 Output</label>
        <AnimatePresence mode="wait">
          <motion.div
            key={hash}
            initial={exploding ? { x: [-3, 3, -3, 3, 0], opacity: 0.6, scale: 0.98 } : { opacity: 0 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className={`font-mono text-sm break-all p-3 rounded border ${
              exploding
                ? "bg-orange-950/30 border-orange-500/50 text-orange-300"
                : "bg-zinc-950 border-zinc-700 text-green-400"
            }`}
          >
            {hash}
          </motion.div>
        </AnimatePresence>
        {renderHashDiff()}
      </div>

      <p className="text-xs text-zinc-600 font-mono">
        {input.length} chars in → 64 hex chars out, always.
        One character change rewrites the entire output.
      </p>
    </div>
  );
}
