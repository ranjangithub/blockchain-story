"use client";

import { useState } from "react";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

const FIELDS = [
  {
    key: "version",
    value: "1",
    label: "Version",
    explanation:
      "Which set of rules this block follows. Version 1 is the original Bitcoin protocol. Later versions added features like SegWit. Every node on the network only accepts blocks that follow rules they understand.",
  },
  {
    key: "prev_hash",
    value: "0000000000000000000000000000000000000000000000000000000000000000",
    label: "Previous Block Hash",
    explanation:
      "The SHA-256 fingerprint of the block that came before this one. For the Genesis Block, there is no previous block, so this is all zeros. Every subsequent block carries the hash of the block before it — this is what creates the chain.",
  },
  {
    key: "merkle_root",
    value: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
    label: "Merkle Root",
    explanation:
      "A single 64-character fingerprint representing ALL transactions in this block. Change any single transaction and the Merkle Root changes. You can't hide a fraudulent transaction inside a block — the root exposes it immediately.",
  },
  {
    key: "timestamp",
    value: "1231006505",
    label: "Timestamp",
    explanation:
      "Unix timestamp: seconds since January 1, 1970. This value (1231006505) converts to January 3, 2009, 18:15:05 UTC — the exact moment the Genesis Block was mined. Nodes check timestamps roughly, but don't rely on them for ordering — that's what the chain itself does.",
  },
  {
    key: "difficulty",
    value: "1d00ffff",
    label: "Difficulty Target",
    explanation:
      "How hard the mining puzzle was. This value defines how many leading zeros the block's hash must have. At difficulty 1 (the Genesis Block), the hash must start with roughly 8 leading zeros. Today's difficulty requires ~19 leading zeros — the network has done 10 quadrillion times more work per block.",
  },
  {
    key: "nonce",
    value: "2083236893",
    label: "Nonce",
    explanation:
      "The magic number Satoshi varied until the block's hash met the difficulty target. The word 'nonce' means 'number used once.' Satoshi tried over 2 billion different values before finding one that made the hash start with enough zeros. This is Proof of Work.",
  },
];

export default function Scene5() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const active = FIELDS.find((f) => f.key === activeKey);

  return (
    <SceneLayout sceneId={5}>
      <Narrator>
        Before mining, Satoshi needs to define what a block IS. Not just a list of transactions —
        a container with a precise structure. Six fields in the header. Each one is load-bearing.
      </Narrator>

      <Narrator>
        Click any field to understand why it exists.
      </Narrator>

      {/* Interactive block header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-0 font-mono text-sm">
        <div className="text-xs text-zinc-600 mb-3 uppercase tracking-widest">Block Header</div>
        {FIELDS.map((field) => (
          <button
            key={field.key}
            onClick={() => setActiveKey(activeKey === field.key ? null : field.key)}
            className={`flex gap-4 items-start text-left py-2.5 px-2 rounded transition-colors hover:bg-zinc-800 group ${
              activeKey === field.key ? "bg-zinc-800" : ""
            }`}
          >
            <span className="text-zinc-600 w-36 shrink-0 text-xs pt-0.5">{field.label}</span>
            <span
              className={`break-all text-xs ${
                activeKey === field.key ? "text-orange-300" : "text-zinc-400 group-hover:text-zinc-200"
              }`}
            >
              {field.value}
            </span>
          </button>
        ))}
      </div>

      {/* Explanation panel */}
      {active && (
        <div className="bg-zinc-900/50 border border-orange-900/50 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-orange-400 text-xs font-mono uppercase tracking-widest">{active.label}</span>
          <p className="text-zinc-300 text-sm leading-relaxed">{active.explanation}</p>
        </div>
      )}

      <Narrator>
        Six fields. That's the whole block header — the part that gets hashed and must
        meet the difficulty target. The transactions themselves are stored separately;
        the Merkle Root is their fingerprint, carried in the header.
      </Narrator>

      <Narrator>
        But how do you get one fingerprint from dozens — or thousands — of transactions?
        That's the Merkle tree.
      </Narrator>

      <SceneAdvance to={6} />
    </SceneLayout>
  );
}
