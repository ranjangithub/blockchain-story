"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateWallet, WalletKeys } from "@/lib/crypto/wallet";

interface Step {
  label: string;
  value: string;
  description: string;
}

function walletToSteps(w: WalletKeys): Step[] {
  return [
    {
      label: "Random Bytes",
      value: w.privateKeyHex.slice(0, 32) + "…",
      description: "64 random hex characters from your browser's secure random generator",
    },
    {
      label: "Private Key",
      value: w.privateKeyHex,
      description: "This is yours alone. Never share it. Lose it = lose your coins forever.",
    },
    {
      label: "Public Key (secp256k1)",
      value: w.publicKeyCompressed,
      description: "Derived mathematically from the private key. Safe to share. Cannot be reversed.",
    },
    {
      label: "SHA-256 → RIPEMD-160",
      value: w.publicKeyHash,
      description: "Two hash rounds compress the 66-byte public key to 20 bytes.",
    },
    {
      label: "Bitcoin Address",
      value: w.address,
      description: "Your public address. Version byte 0x00 + hash160 + Base58Check checksum.",
    },
  ];
}

export default function WalletDemoGenerate() {
  const [wallet, setWallet] = useState<WalletKeys | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loading, setLoading] = useState(false);

  function generate() {
    setLoading(true);
    setWallet(null);
    setSteps([]);
    setVisibleCount(0);

    setTimeout(() => {
      const w = generateWallet();
      const s = walletToSteps(w);
      setWallet(w);
      setSteps(s);
      setLoading(false);

      s.forEach((_, i) => {
        setTimeout(() => setVisibleCount(i + 1), i * 400);
      });
    }, 80);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Wallet Generator</span>
        <button
          onClick={generate}
          disabled={loading}
          className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-mono rounded transition-colors"
        >
          {loading ? "Generating…" : wallet ? "Generate Another" : "Generate My Wallet"}
        </button>
      </div>

      <AnimatePresence>
        {steps.slice(0, visibleCount).map((step, i) => (
          <motion.div
            key={`${step.label}-${wallet?.privateKeyHex?.slice(0, 8)}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center gap-2">
              <span className="text-orange-500 text-xs font-mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-zinc-400 text-xs font-mono uppercase tracking-wide">{step.label}</span>
            </div>
            <div className="font-mono text-sm text-green-400 bg-zinc-950 rounded px-3 py-2 border border-zinc-800 break-all">
              {step.value}
            </div>
            <p className="text-xs text-zinc-600">{step.description}</p>
            {i < steps.length - 1 && (
              <div className="text-zinc-700 text-xs font-mono pl-6 mt-1">↓</div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {wallet && visibleCount >= steps.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-orange-800/50 bg-orange-950/20 rounded p-3 text-xs text-orange-300 font-mono"
        >
          ⚠ This is a real keypair. Do not use it to hold actual Bitcoin.
          It was generated in your browser and is not stored anywhere.
        </motion.div>
      )}
    </div>
  );
}
