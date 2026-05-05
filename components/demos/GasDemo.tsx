"use client";
import { useState } from "react";

const OPERATIONS = [
  { name: "ADD", desc: "Add two numbers", gas: 3, count: 0 },
  { name: "STORE", desc: "Write to storage", gas: 20000, count: 0 },
  { name: "LOAD", desc: "Read from storage", gas: 800, count: 0 },
  { name: "TRANSFER", desc: "Send ETH", gas: 21000, count: 0 },
  { name: "LOG", desc: "Emit an event", gas: 375, count: 0 },
];

const BASE_FEE = 15; // gwei
const ETH_PRICE = 3000; // USD

function gweiToUSD(gwei: number): string {
  const eth = gwei / 1e9;
  return (eth * ETH_PRICE).toFixed(4);
}

export default function GasDemo() {
  const [ops, setOps] = useState(OPERATIONS.map((o) => ({ ...o })));
  const [tip, setTip] = useState(2);
  const [congestion, setCongestion] = useState(15);

  const totalGas = ops.reduce((sum, op) => sum + op.gas * op.count, 0);
  const effectiveFee = congestion + tip;
  const totalGwei = totalGas * effectiveFee;
  const totalUSD = gweiToUSD(totalGwei);

  function inc(i: number) {
    setOps((prev) => prev.map((op, j) => (j === i ? { ...op, count: op.count + 1 } : op)));
  }
  function dec(i: number) {
    setOps((prev) =>
      prev.map((op, j) => (j === i ? { ...op, count: Math.max(0, op.count - 1) } : op))
    );
  }
  function reset() {
    setOps(OPERATIONS.map((o) => ({ ...o })));
  }

  const congestionLabel =
    congestion < 10 ? "Low" : congestion < 30 ? "Normal" : congestion < 80 ? "High" : "Surge";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-orange-400 font-mono text-sm uppercase tracking-widest">
          Gas Cost Builder
        </h3>
        <button
          onClick={reset}
          className="text-zinc-500 hover:text-zinc-300 font-mono text-xs transition-colors"
        >
          reset
        </button>
      </div>

      {/* Network conditions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-800 rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-mono text-xs">Base Fee (network)</span>
            <span
              className={`font-mono text-xs font-bold ${
                congestion < 10
                  ? "text-green-400"
                  : congestion < 30
                  ? "text-yellow-400"
                  : congestion < 80
                  ? "text-orange-400"
                  : "text-red-400"
              }`}
            >
              {congestionLabel} · {congestion} gwei
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={200}
            value={congestion}
            onChange={(e) => setCongestion(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <p className="text-zinc-600 text-xs">
            Set by the network automatically. Burns when paid.
          </p>
        </div>
        <div className="bg-zinc-800 rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-mono text-xs">Priority Tip (yours)</span>
            <span className="font-mono text-xs font-bold text-blue-400">{tip} gwei</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            value={tip}
            onChange={(e) => setTip(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <p className="text-zinc-600 text-xs">Goes to the miner. Higher tip = faster inclusion.</p>
        </div>
      </div>

      {/* Operation selector */}
      <div className="space-y-2">
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
          Build your transaction
        </p>
        {ops.map((op, i) => (
          <div key={op.name} className="flex items-center gap-3 bg-zinc-800 rounded px-3 py-2">
            <div className="flex-1 min-w-0">
              <span className="text-zinc-200 font-mono text-sm font-bold">{op.name}</span>
              <span className="text-zinc-500 font-mono text-xs ml-2">{op.desc}</span>
            </div>
            <span className="text-zinc-500 font-mono text-xs w-20 text-right">
              {op.gas.toLocaleString()} gas
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dec(i)}
                disabled={op.count === 0}
                className="w-6 h-6 rounded bg-zinc-700 text-zinc-300 font-bold text-sm disabled:opacity-30 hover:bg-zinc-600 transition-colors"
              >
                −
              </button>
              <span className="text-zinc-200 font-mono text-sm w-4 text-center">{op.count}</span>
              <button
                onClick={() => inc(i)}
                className="w-6 h-6 rounded bg-zinc-700 text-zinc-300 font-bold text-sm hover:bg-zinc-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cost summary */}
      <div className="bg-zinc-800 rounded-lg p-4 space-y-3 border border-zinc-700">
        <div className="flex justify-between text-zinc-400 font-mono text-sm">
          <span>Total gas units</span>
          <span className="text-zinc-200">{totalGas.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-zinc-400 font-mono text-sm">
          <span>Effective fee rate</span>
          <span className="text-zinc-200">{effectiveFee} gwei/gas</span>
        </div>
        <div className="border-t border-zinc-700 pt-3 flex justify-between font-mono">
          <span className="text-zinc-300">Total cost</span>
          <div className="text-right">
            <div className="text-orange-400 font-bold">
              {totalGas === 0 ? "—" : `${(totalGwei / 1e9).toFixed(6)} ETH`}
            </div>
            <div className="text-zinc-500 text-xs">${totalGas === 0 ? "—" : totalUSD}</div>
          </div>
        </div>
      </div>

      <p className="text-zinc-600 text-xs font-mono border-t border-zinc-800 pt-4">
        EIP-1559: base fee is burned (removed from supply). Miner receives only the tip.
        This makes ETH deflationary during high-usage periods.
      </p>
    </div>
  );
}
