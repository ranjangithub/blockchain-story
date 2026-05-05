// Web Worker for proof-of-work mining — keeps main thread unblocked
// Receives: { header: string; difficulty: number }
// Posts:    { type: "progress"; nonce: number; hash: string }
//           { type: "found";    nonce: number; hash: string }

import { sha256 } from "@noble/hashes/sha2.js";

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function meetsTarget(hash: string, difficulty: number): boolean {
  return hash.startsWith("0".repeat(difficulty));
}

self.onmessage = (e: MessageEvent<{ header: string; difficulty: number; maxNonces?: number }>) => {
  const { header, difficulty, maxNonces = 10_000_000 } = e.data;
  const encoder = new TextEncoder();

  for (let nonce = 0; nonce <= maxNonces; nonce++) {
    const input = `${header}${nonce}`;
    const bytes = encoder.encode(input);
    const hash = bytesToHex(sha256(sha256(bytes)));

    if (nonce % 500 === 0) {
      self.postMessage({ type: "progress", nonce, hash });
    }

    if (meetsTarget(hash, difficulty)) {
      self.postMessage({ type: "found", nonce, hash });
      return;
    }
  }

  // Exhausted without finding — shouldn't happen at difficulty ≤ 4
  self.postMessage({ type: "exhausted", nonce: maxNonces, hash: "" });
};
