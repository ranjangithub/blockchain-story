"use client";

import { sha256 } from "@noble/hashes/sha2.js";
import { ripemd160 } from "@noble/hashes/legacy.js";

export function sha256Hex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const hash = sha256(bytes);
  return bytesToHex(hash);
}

export function doubleSha256(input: Uint8Array): Uint8Array {
  return sha256(sha256(input));
}

export function doubleSha256Hex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  return bytesToHex(doubleSha256(bytes));
}

export function ripemd160Hex(input: Uint8Array): string {
  return bytesToHex(ripemd160(input));
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBytes(hex: string): Uint8Array {
  const result = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    result[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return result;
}
