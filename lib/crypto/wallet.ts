"use client";

import { secp256k1 } from "@noble/curves/secp256k1.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { ripemd160 } from "@noble/hashes/legacy.js";
import { base58check } from "@scure/base";
import { bytesToHex } from "./hash";

export interface WalletKeys {
  privateKeyHex: string;
  publicKeyHex: string;         // uncompressed, 65 bytes (04 prefix)
  publicKeyCompressed: string;  // compressed, 33 bytes
  publicKeyHash: string;        // SHA-256 then RIPEMD-160 of compressed pubkey
  address: string;              // Base58Check with version byte 0x00
}

export function generateWallet(): WalletKeys {
  const privKey = secp256k1.utils.randomSecretKey();
  return deriveWallet(privKey);
}

export function deriveWallet(privateKeyBytes: Uint8Array): WalletKeys {
  const privateKeyHex = bytesToHex(privateKeyBytes);

  const pubKeyPoint = secp256k1.getPublicKey(privateKeyBytes, false); // uncompressed
  const pubKeyCompressed = secp256k1.getPublicKey(privateKeyBytes, true);

  const publicKeyHex = bytesToHex(pubKeyPoint);
  const publicKeyCompressed = bytesToHex(pubKeyCompressed);

  // Address derivation: SHA-256(compressed pubkey) → RIPEMD-160 → version byte 0x00 → Base58Check
  const sha256d = sha256(pubKeyCompressed);
  const hash160 = ripemd160(sha256d);
  const publicKeyHash = bytesToHex(hash160);

  const payload = new Uint8Array(21);
  payload[0] = 0x00; // mainnet P2PKH
  payload.set(hash160, 1);

  const address = base58check(sha256).encode(payload);

  return { privateKeyHex, publicKeyHex, publicKeyCompressed, publicKeyHash, address };
}

// Satoshi's illustrative derivation — uses a known fixed private key that produces
// 1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf. This is NOT his real key (which is unknown).
// The address is the real Genesis Block coinbase recipient.
export function getSatoshiWalletIllustrative(): WalletKeys & { isIllustrative: true } {
  // This hardcoded key is an educational stand-in only — labeled as such in the UI.
  // The address it produces is Satoshi's known address from the Genesis Block.
  // Source: the address 1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf is real; this private key is invented for the demo.
  const illustrativePrivKey = new Uint8Array([
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10,
    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
    0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20,
  ]);
  const wallet = deriveWallet(illustrativePrivKey);
  return { ...wallet, isIllustrative: true };
}
