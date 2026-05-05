"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSatoshiWalletIllustrative } from "@/lib/crypto/wallet";

const SATOSHI_ADDRESS = "1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf";

interface Step {
  label: string;
  value: string;
  note?: string;
}

export default function WalletDemoFixed() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const w = getSatoshiWalletIllustrative();
    const s: Step[] = [
      {
        label: "Private Key (illustrative)",
        value: w.privateKeyHex,
        note: "Educational stand-in only — Satoshi's real key is unknown.",
      },
      {
        label: "secp256k1 → Public Key",
        value: w.publicKeyCompressed,
        note: "Elliptic curve multiplication. One-way: you cannot reverse this.",
      },
      {
        label: "SHA-256(public key)",
        value: w.publicKeyHash.slice(0, 64),
        note: "First of two hash rounds.",
      },
      {
        label: "RIPEMD-160 → Hash160",
        value: w.publicKeyHash,
        note: "20-byte fingerprint of the public key.",
      },
      {
        label: "Base58Check → Address",
        value: SATOSHI_ADDRESS,
        note: "Version byte 0x00 + Hash160 + 4-byte checksum, base-58 encoded.",
      },
    ];
    setSteps(s);
    s.forEach((_, i) => {
      setTimeout(() => setVisibleCount(i + 1), 600 + i * 700);
    });
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Satoshi's Wallet Derivation
        </span>
      </div>

      {steps.slice(0, visibleCount).map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-1"
        >
          <span className="text-zinc-500 text-xs font-mono uppercase tracking-wide">{step.label}</span>
          <div
            className={`font-mono text-sm break-all px-3 py-2 rounded border ${
              i === steps.length - 1
                ? "text-orange-300 bg-orange-950/20 border-orange-800/50"
                : "text-green-400 bg-zinc-950 border-zinc-800"
            }`}
          >
            {step.value}
          </div>
          {step.note && <p className="text-xs text-zinc-600">{step.note}</p>}
          {i < steps.length - 1 && (
            <div className="text-zinc-700 text-xs font-mono pl-0 mt-1">↓</div>
          )}
        </motion.div>
      ))}

      {visibleCount >= steps.length && steps.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-zinc-700 rounded p-3 text-xs text-zinc-400 font-mono"
        >
          This address — <span className="text-orange-300">{SATOSHI_ADDRESS}</span> — received
          the 50 BTC coinbase reward from the Genesis Block on January 3, 2009.
          Those coins are considered permanently unspendable and have never moved.
        </motion.div>
      )}
    </div>
  );
}
