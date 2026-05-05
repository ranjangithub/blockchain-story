"use client";

import { useState } from "react";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import { sha256Hex } from "@/lib/crypto/hash";
import { motion } from "framer-motion";

const INITIAL_TXS = [
  "Satoshi → Hal: 10 BTC",
  "Satoshi → Alice: 5 BTC",
  "Satoshi → Bob: 2 BTC",
  "Satoshi → Carol: 1 BTC",
];

export default function Scene6() {
  const [txs, setTxs] = useState(INITIAL_TXS);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const h = txs.map((tx) => sha256Hex(tx));
  const h01 = sha256Hex(h[0] + h[1]);
  const h23 = sha256Hex(h[2] + h[3]);
  const root = sha256Hex(h01 + h23);

  function updateTx(i: number, val: string) {
    const next = [...txs];
    next[i] = val;
    setTxs(next);
  }

  return (
    <SceneLayout sceneId={6}>
      <Narrator>
        The block has four transactions. The Merkle Root in the block header must represent
        all of them with a single 64-character hash. How?
      </Narrator>

      <Narrator>
        You hash them in pairs, then hash the pairs, until one hash remains. This tree structure
        was invented by Ralph Merkle in 1979. Satoshi used it because it has a remarkable
        property: you can prove a specific transaction is in a block without downloading the
        whole block.
      </Narrator>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-4 font-mono text-xs">
        <span className="text-zinc-500 uppercase tracking-widest">Merkle Tree — click a transaction to edit it</span>

        {/* Transactions row */}
        <div className="grid grid-cols-4 gap-2">
          {txs.map((tx, i) => (
            <div key={i} className="flex flex-col gap-1">
              {editIndex === i ? (
                <input
                  autoFocus
                  value={tx}
                  onChange={(e) => updateTx(i, e.target.value)}
                  onBlur={() => setEditIndex(null)}
                  className="bg-zinc-800 border border-orange-500 rounded px-2 py-1 text-orange-300 text-xs w-full focus:outline-none"
                />
              ) : (
                <button
                  onClick={() => setEditIndex(i)}
                  className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded px-2 py-1 text-zinc-300 text-xs text-left truncate transition-colors"
                  title={tx}
                >
                  {tx}
                </button>
              )}
              <div className="text-zinc-600 text-[10px] truncate">{h[i].slice(0, 12)}…</div>
            </div>
          ))}
        </div>

        {/* Arrows up */}
        <div className="grid grid-cols-2 gap-2 pl-[12.5%]">
          <div className="text-zinc-700 text-center">↑ Hash(TX1 + TX2)</div>
          <div className="text-zinc-700 text-center">↑ Hash(TX3 + TX4)</div>
        </div>

        {/* Pair hashes */}
        <div className="grid grid-cols-2 gap-2">
          <motion.div
            key={h01}
            initial={{ backgroundColor: "#431407" }}
            animate={{ backgroundColor: "transparent" }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-green-400 truncate"
          >
            {h01.slice(0, 20)}…
          </motion.div>
          <motion.div
            key={h23}
            initial={{ backgroundColor: "#431407" }}
            animate={{ backgroundColor: "transparent" }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-green-400 truncate"
          >
            {h23.slice(0, 20)}…
          </motion.div>
        </div>

        {/* Arrow to root */}
        <div className="text-zinc-700 text-center">↑ Hash(Hash01 + Hash23) = Merkle Root</div>

        {/* Root */}
        <motion.div
          key={root}
          initial={{ borderColor: "#c2410c" }}
          animate={{ borderColor: "#3f3f46" }}
          transition={{ duration: 0.8 }}
          className="bg-zinc-800 border-2 rounded px-3 py-2 text-orange-300 text-center"
        >
          <div className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Merkle Root</div>
          <div className="break-all">{root}</div>
        </motion.div>
      </div>

      <Narrator>
        Edit any transaction above. Its hash changes, the pair hash changes, and the Merkle Root
        changes. You cannot hide a tampered transaction inside a block.
      </Narrator>

      <Narrator>
        The bonus property: Merkle proofs. To prove that Transaction 2 is in this block,
        you only need Transaction 2's hash, Hash(TX3+TX4), and the root. You don't need
        the entire block. This is how lightweight Bitcoin wallets work — they verify your
        transaction without downloading 500GB of blockchain history.
      </Narrator>

      <Narrator>
        Satoshi has his fingerprint function, his identity system, his block structure,
        and his Merkle tree. One thing left: the mechanism that makes dishonesty expensive.
      </Narrator>

      <SceneAdvance to={7} />
    </SceneLayout>
  );
}
