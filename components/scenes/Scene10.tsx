"use client";

import { useState } from "react";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import { motion } from "framer-motion";

const SATOSHI_ADDRESS = "1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf";
const YOUR_ADDRESS = "1BpEi6DfDAUFd153wiGrvkiboLLaqFZqW";

const TX = {
  txid: "f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16",
  inputs: [
    {
      previousTxId: "genesis coinbase",
      outputIndex: 0,
      value: "50.00 BTC",
      scriptSig: "Satoshi's ECDSA signature + his public key",
    },
  ],
  outputs: [
    {
      value: "10.00 BTC",
      address: YOUR_ADDRESS,
      scriptPubKey: "OP_DUP OP_HASH160 <your_pubkey_hash> OP_EQUALVERIFY OP_CHECKSIG",
    },
    {
      value: "39.99 BTC",
      address: SATOSHI_ADDRESS,
      scriptPubKey: "OP_DUP OP_HASH160 <satoshi_pubkey_hash> OP_EQUALVERIFY OP_CHECKSIG",
    },
    {
      value: "0.01 BTC",
      address: "miner fee",
      scriptPubKey: "goes to whoever mines this block",
    },
  ],
};

type Tab = "structure" | "mempool";

export default function Scene10() {
  const [tab, setTab] = useState<Tab>("structure");
  const [confirmations, setConfirmations] = useState(0);

  return (
    <SceneLayout sceneId={10}>
      <Narrator>
        Satoshi constructs a transaction. Not a form submission — a precisely structured
        data object, signed with his private key.
      </Narrator>

      {/* Transaction explorer */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="flex border-b border-zinc-800">
          {(["structure", "mempool"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-xs font-mono transition-colors ${
                tab === t
                  ? "text-orange-400 border-b-2 border-orange-500"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t === "structure" ? "Transaction Structure" : "Mempool → Confirmation"}
            </button>
          ))}
        </div>

        <div className="p-5 font-mono text-xs flex flex-col gap-4">
          {tab === "structure" && (
            <>
              <div>
                <span className="text-zinc-600">txid</span>
                <div className="text-zinc-400 break-all mt-1">{TX.txid}</div>
              </div>

              <div>
                <span className="text-zinc-600 uppercase tracking-widest">Inputs</span>
                {TX.inputs.map((inp, i) => (
                  <div key={i} className="mt-2 pl-3 border-l border-zinc-700 flex flex-col gap-1">
                    <div>
                      <span className="text-zinc-600">previous tx: </span>
                      <span className="text-zinc-400">{inp.previousTxId}</span>
                    </div>
                    <div>
                      <span className="text-zinc-600">value being spent: </span>
                      <span className="text-orange-300">{inp.value}</span>
                    </div>
                    <div>
                      <span className="text-zinc-600">authorization: </span>
                      <span className="text-green-400">{inp.scriptSig}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <span className="text-zinc-600 uppercase tracking-widest">Outputs</span>
                {TX.outputs.map((out, i) => (
                  <div key={i} className="mt-2 pl-3 border-l border-zinc-700 flex flex-col gap-1">
                    <div>
                      <span className="text-zinc-600">value: </span>
                      <span className="text-orange-300">{out.value}</span>
                    </div>
                    <div>
                      <span className="text-zinc-600">to: </span>
                      <span className={out.address === YOUR_ADDRESS ? "text-blue-400" : "text-zinc-400"}>
                        {out.address} {out.address === YOUR_ADDRESS && "(← you)"}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-600">unlock condition: </span>
                      <span className="text-zinc-500">{out.scriptPubKey}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-zinc-600 mt-2">
                Total in: 50 BTC = Total out: 10 + 39.99 + 0.01. Nothing created or destroyed.
                The 0.01 BTC fee incentivizes miners to include this transaction.
              </p>
            </>
          )}

          {tab === "mempool" && (
            <div className="flex flex-col gap-4">
              <p className="text-zinc-400 leading-relaxed">
                The transaction is broadcast to the network. It's valid — Satoshi's signature
                checks out. But it's not confirmed. It sits in the mempool: a holding area where
                all unconfirmed transactions wait.
              </p>

              <div className="bg-zinc-950 rounded border border-zinc-700 p-3 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status</span>
                  <span className={confirmations > 0 ? "text-green-400" : "text-yellow-500"}>
                    {confirmations === 0 ? "Unconfirmed — in mempool" : `${confirmations} confirmation${confirmations > 1 ? "s" : ""}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Your 10 BTC</span>
                  <span className={confirmations >= 6 ? "text-green-400" : "text-yellow-500"}>
                    {confirmations >= 6 ? "Final (6+ confirmations)" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => setConfirmations(n)}
                    className={`px-3 py-1.5 text-xs rounded border font-mono transition-colors ${
                      confirmations >= n
                        ? "border-green-700 bg-green-950/30 text-green-400"
                        : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
                    }`}
                  >
                    Block +{n}
                  </button>
                ))}
              </div>

              {confirmations > 0 && confirmations < 6 && (
                <p className="text-zinc-500 text-xs leading-relaxed">
                  {confirmations} confirmation{confirmations > 1 ? "s" : ""}. Each new block added on top of yours
                  makes it harder to reverse — an attacker would have to re-mine all of them faster than
                  the honest network adds more.
                </p>
              )}
              {confirmations >= 6 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-400 text-xs leading-relaxed"
                >
                  Six confirmations. The traditional threshold for "final." Not because of a rule —
                  because the math makes reversal statistically negligible. The 10 BTC is yours.
                </motion.p>
              )}
            </div>
          )}
        </div>
      </div>

      <Narrator>
        This is the UTXO model — Unspent Transaction Outputs. Your 10 BTC isn't a number in a
        database. It's an output from a previous transaction that hasn't been spent yet.
        When you spend it, you reference this transaction's output as an input, prove ownership
        with your private key's signature, and create new outputs.
      </Narrator>

      <SceneAdvance to={11} />
    </SceneLayout>
  );
}
