"use client";
import { useState } from "react";

type ChannelState = {
  aliceBalance: number;
  bobBalance: number;
  txCount: number;
  isOpen: boolean;
  isClosed: boolean;
  openTxHash: string;
  closeTxHash: string;
};

const CHANNEL_CAPACITY = 0.1; // BTC

function randomHash() {
  return (
    Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("") + "..."
  );
}

export default function LightningDemo() {
  const [channel, setChannel] = useState<ChannelState>({
    aliceBalance: 0,
    bobBalance: 0,
    txCount: 0,
    isOpen: false,
    isClosed: false,
    openTxHash: "",
    closeTxHash: "",
  });
  const [sendAmount, setSendAmount] = useState(0.01);
  const [log, setLog] = useState<{ msg: string; onchain: boolean }[]>([]);

  function openChannel() {
    const hash = randomHash();
    setChannel({
      aliceBalance: 0.06,
      bobBalance: 0.04,
      txCount: 0,
      isOpen: true,
      isClosed: false,
      openTxHash: hash,
      closeTxHash: "",
    });
    setLog([
      {
        msg: `[ON-CHAIN] Channel opened — ${hash} — 0.1 BTC locked`,
        onchain: true,
      },
    ]);
  }

  function send(direction: "ab" | "ba") {
    if (!channel.isOpen || channel.isClosed) return;
    const from = direction === "ab" ? "Alice" : "Bob";
    const to = direction === "ab" ? "Bob" : "Alice";
    const fromBal =
      direction === "ab" ? channel.aliceBalance : channel.bobBalance;
    if (fromBal < sendAmount) {
      setLog((prev) => [
        { msg: `Insufficient balance: ${from} only has ${fromBal.toFixed(4)} BTC`, onchain: false },
        ...prev,
      ]);
      return;
    }
    const newAlice =
      direction === "ab"
        ? channel.aliceBalance - sendAmount
        : channel.aliceBalance + sendAmount;
    const newBob =
      direction === "ab"
        ? channel.bobBalance + sendAmount
        : channel.bobBalance - sendAmount;
    const txCount = channel.txCount + 1;
    setChannel((c) => ({
      ...c,
      aliceBalance: newAlice,
      bobBalance: newBob,
      txCount,
    }));
    setLog((prev) => [
      {
        msg: `[OFF-CHAIN] Tx #${txCount}: ${from} → ${to}: ${sendAmount.toFixed(4)} BTC (instant, 0 fees)`,
        onchain: false,
      },
      ...prev,
    ]);
  }

  function closeChannel() {
    if (!channel.isOpen || channel.isClosed) return;
    const hash = randomHash();
    setChannel((c) => ({ ...c, isClosed: true, closeTxHash: hash }));
    setLog((prev) => [
      {
        msg: `[ON-CHAIN] Channel closed — ${hash} — Alice: ${channel.aliceBalance.toFixed(4)} BTC, Bob: ${channel.bobBalance.toFixed(4)} BTC`,
        onchain: true,
      },
      ...prev,
    ]);
  }

  function reset() {
    setChannel({
      aliceBalance: 0,
      bobBalance: 0,
      txCount: 0,
      isOpen: false,
      isClosed: false,
      openTxHash: "",
      closeTxHash: "",
    });
    setLog([]);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-orange-400 font-mono text-sm uppercase tracking-widest">
          Lightning Payment Channel
        </h3>
        <button
          onClick={reset}
          className="text-zinc-500 hover:text-zinc-300 font-mono text-xs transition-colors"
        >
          reset
        </button>
      </div>

      {/* Channel state */}
      {channel.isOpen && !channel.isClosed && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-zinc-400 font-mono text-xs mb-1">
            <span>Alice</span>
            <span className="text-green-400 font-bold">Channel open</span>
            <span>Bob</span>
          </div>
          <div className="relative h-8 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-orange-500 transition-all duration-300 rounded-l-full"
              style={{
                width: `${(channel.aliceBalance / CHANNEL_CAPACITY) * 100}%`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center gap-4 font-mono text-xs">
              <span className="text-white font-bold">
                {channel.aliceBalance.toFixed(4)} BTC
              </span>
              <span className="text-zinc-400">|</span>
              <span className="text-white font-bold">
                {channel.bobBalance.toFixed(4)} BTC
              </span>
            </div>
          </div>
          <p className="text-zinc-600 font-mono text-xs text-center">
            {channel.txCount} off-chain transaction{channel.txCount !== 1 ? "s" : ""} · 0 on-chain fees
          </p>
        </div>
      )}

      {channel.isClosed && (
        <div className="bg-zinc-800 rounded p-4 text-center space-y-1">
          <p className="text-green-400 font-mono text-sm font-bold">Channel settled on-chain</p>
          <p className="text-zinc-400 font-mono text-xs">
            {channel.txCount} Lightning payments → 2 blockchain transactions total
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="text-zinc-500 font-mono text-xs">Amount (BTC)</label>
          <input
            type="number"
            min={0.001}
            max={0.05}
            step={0.001}
            value={sendAmount}
            onChange={(e) => setSendAmount(Number(e.target.value))}
            className="bg-zinc-700 border border-zinc-600 text-zinc-200 font-mono text-sm rounded px-3 py-1 w-28"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {!channel.isOpen && (
            <button
              onClick={openChannel}
              className="col-span-2 bg-orange-600 hover:bg-orange-500 text-white font-mono text-sm py-2 rounded transition-colors"
            >
              Open Channel (1 on-chain tx)
            </button>
          )}
          {channel.isOpen && !channel.isClosed && (
            <>
              <button
                onClick={() => send("ab")}
                className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-mono text-sm py-2 rounded transition-colors"
              >
                Alice → Bob
              </button>
              <button
                onClick={() => send("ba")}
                className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-mono text-sm py-2 rounded transition-colors"
              >
                Bob → Alice
              </button>
              <button
                onClick={closeChannel}
                className="col-span-2 bg-zinc-600 hover:bg-zinc-500 text-zinc-200 font-mono text-sm py-2 rounded transition-colors"
              >
                Close Channel (1 on-chain tx)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div className="bg-zinc-800 rounded p-3 space-y-1 max-h-40 overflow-y-auto font-mono text-xs">
          {log.map((entry, i) => (
            <p
              key={i}
              className={entry.onchain ? "text-orange-400" : "text-green-400"}
            >
              {entry.msg}
            </p>
          ))}
        </div>
      )}

      <p className="text-zinc-600 text-xs font-mono border-t border-zinc-800 pt-4">
        Lightning channels only touch the blockchain twice — open and close.
        Everything in between is instant and free. Routing through multiple channels
        enables payments to anyone in the network, not just direct channel partners.
      </p>
    </div>
  );
}
