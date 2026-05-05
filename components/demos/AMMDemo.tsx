"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const INITIAL_ETH = 100;
const INITIAL_USDC = 200_000;
const K = INITIAL_ETH * INITIAL_USDC; // constant product

function calcSwap(ethIn: number, poolEth: number, poolUsdc: number) {
  const newEth = poolEth + ethIn;
  const newUsdc = K / newEth;
  const usdcOut = poolUsdc - newUsdc;
  const priceImpact = ((ethIn / poolEth) * 100).toFixed(1);
  const effectivePrice = usdcOut / ethIn;
  return { newEth, newUsdc, usdcOut, priceImpact, effectivePrice };
}

function calcIL(entryEthPrice: number, currentEthPrice: number) {
  const priceRatio = currentEthPrice / entryEthPrice;
  // IL = 2*sqrt(r)/(1+r) - 1
  const il = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio) - 1;
  return (il * 100).toFixed(2);
}

function buildCurve(poolEth: number) {
  const points = [];
  for (let eth = 10; eth <= 400; eth += 10) {
    const usdc = K / eth;
    if (usdc > 0 && usdc < 800_000) {
      points.push({ eth, usdc: Math.round(usdc) });
    }
  }
  return points;
}

export default function AMMDemo() {
  const [tab, setTab] = useState<"swap" | "lp">("swap");
  const [swapEth, setSwapEth] = useState(10);
  const [poolEth, setPoolEth] = useState(INITIAL_ETH);
  const [poolUsdc, setPoolUsdc] = useState(INITIAL_USDC);
  const [executed, setExecuted] = useState(false);
  const [entryEthPrice, setEntryEthPrice] = useState(2000);
  const [currentEthPrice, setCurrentEthPrice] = useState(2000);

  const swap = calcSwap(swapEth, poolEth, poolUsdc);
  const curveData = buildCurve(poolEth);
  const il = calcIL(entryEthPrice, currentEthPrice);

  function executeSwap() {
    setPoolEth(swap.newEth);
    setPoolUsdc(swap.newUsdc);
    setExecuted(true);
    setTimeout(() => setExecuted(false), 2000);
  }

  function resetPool() {
    setPoolEth(INITIAL_ETH);
    setPoolUsdc(INITIAL_USDC);
    setSwapEth(10);
  }

  const currentEthUsdPrice = poolUsdc / poolEth;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">AMM Demo</span>
        <span className="text-xs font-mono text-zinc-600">x × y = k = {(poolEth * poolUsdc / 1e9).toFixed(2)}B</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        {(["swap", "lp"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-mono transition-colors ${
              tab === t ? "text-orange-400 border-b-2 border-orange-500" : "text-zinc-500 hover:text-zinc-300"
            }`}>
            {t === "swap" ? "Swap" : "Provide Liquidity + IL"}
          </button>
        ))}
      </div>

      {tab === "swap" && (
        <>
          {/* Pool state */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-zinc-950 rounded border border-zinc-800 p-3">
              <div className="text-[10px] font-mono text-zinc-600 uppercase">Pool ETH</div>
              <div className="text-lg font-bold font-mono text-blue-400">{poolEth.toFixed(2)}</div>
            </div>
            <div className="bg-zinc-950 rounded border border-orange-900/40 p-3">
              <div className="text-[10px] font-mono text-zinc-600 uppercase">ETH Price</div>
              <div className="text-lg font-bold font-mono text-orange-400">${currentEthUsdPrice.toFixed(0)}</div>
            </div>
            <div className="bg-zinc-950 rounded border border-zinc-800 p-3">
              <div className="text-[10px] font-mono text-zinc-600 uppercase">Pool USDC</div>
              <div className="text-lg font-bold font-mono text-green-400">{poolUsdc.toFixed(0)}</div>
            </div>
          </div>

          {/* x*y=k curve */}
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curveData}>
                <XAxis dataKey="eth" tick={{ fontSize: 9, fill: "#52525b" }} label={{ value: "ETH", position: "insideRight", fontSize: 9, fill: "#52525b" }} />
                <YAxis tick={{ fontSize: 9, fill: "#52525b" }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", fontSize: 11 }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "USDC"]}
                  labelFormatter={l => `ETH: ${l}`}
                />
                <ReferenceLine x={poolEth} stroke="#f97316" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="usdc" stroke="#3b82f6" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Swap input */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>Swap ETH → USDC</span>
              <span>Price impact: <span className={Number(swap.priceImpact) > 5 ? "text-red-400" : "text-zinc-300"}>{swap.priceImpact}%</span></span>
            </div>
            <div className="flex items-center gap-3">
              <input type="range" min={1} max={80} value={swapEth}
                onChange={e => setSwapEth(Number(e.target.value))}
                className="flex-1 accent-orange-500" />
              <span className="text-sm font-mono text-zinc-300 w-20">{swapEth} ETH in</span>
            </div>
            <div className="text-xs font-mono text-zinc-400">
              You receive: <span className="text-green-400">{swap.usdcOut.toFixed(2)} USDC</span>
              <span className="text-zinc-600 ml-2">@ ${swap.effectivePrice.toFixed(2)}/ETH</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={executeSwap}
              className="px-4 py-1.5 text-xs font-mono bg-orange-600 hover:bg-orange-500 text-white rounded transition-colors">
              {executed ? "✓ Swapped!" : "Execute Swap"}
            </button>
            <button onClick={resetPool}
              className="px-4 py-1.5 text-xs font-mono bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors">
              Reset Pool
            </button>
          </div>
        </>
      )}

      {tab === "lp" && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-zinc-400 leading-relaxed">
            You provide liquidity by depositing both ETH and USDC. You earn 0.3% of every swap.
            But if ETH's price moves significantly, you may have been better off just holding.
            That's impermanent loss.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-zinc-500">Entry ETH price ($/ETH)</label>
              <input type="range" min={500} max={5000} step={100} value={entryEthPrice}
                onChange={e => setEntryEthPrice(Number(e.target.value))}
                className="accent-orange-500" />
              <span className="text-sm font-mono text-zinc-300">${entryEthPrice.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-zinc-500">Current ETH price ($/ETH)</label>
              <input type="range" min={500} max={5000} step={100} value={currentEthPrice}
                onChange={e => setCurrentEthPrice(Number(e.target.value))}
                className="accent-blue-500" />
              <span className="text-sm font-mono text-zinc-300">${currentEthPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className={`rounded border p-4 text-center ${
            Math.abs(Number(il)) < 0.5 ? "border-green-800 bg-green-950/20" :
            Math.abs(Number(il)) < 5 ? "border-yellow-800 bg-yellow-950/20" :
            "border-red-800 bg-red-950/20"
          }`}>
            <div className="text-[10px] font-mono text-zinc-500 uppercase">Impermanent Loss</div>
            <div className={`text-3xl font-bold font-mono mt-1 ${
              Math.abs(Number(il)) < 0.5 ? "text-green-400" :
              Math.abs(Number(il)) < 5 ? "text-yellow-400" : "text-red-400"
            }`}>{il}%</div>
            <div className="text-xs text-zinc-500 mt-1">
              vs. just holding ETH + USDC outside the pool
            </div>
          </div>

          <p className="text-xs text-zinc-600 font-mono leading-relaxed">
            IL = 2√(priceRatio) / (1 + priceRatio) − 1. A 2× price move causes ~5.7% IL.
            A 4× move causes ~20% IL. Fees compensate — but in volatile markets, not always enough.
          </p>
        </div>
      )}
    </div>
  );
}
