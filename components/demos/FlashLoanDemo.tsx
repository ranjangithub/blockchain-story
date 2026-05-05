"use client";
import { useState } from "react";

type Step = {
  label: string;
  detail: string;
  type: "borrow" | "action" | "repay" | "profit" | "revert";
  done: boolean;
};

const LOAN_AMOUNT = 1_000_000;
const LOAN_FEE = 900; // 0.09%
const ARBITRAGE_PROFIT = 3_200;

function buildSteps(scenario: "arb" | "exploit"): Step[] {
  if (scenario === "arb") {
    return [
      { label: "Flash borrow", detail: `Borrow $${LOAN_AMOUNT.toLocaleString()} USDC from Aave (no collateral required)`, type: "borrow", done: false },
      { label: "Buy ETH on DEX A", detail: "ETH is $3,000 on Uniswap — buy 333.33 ETH with $1,000,000", type: "action", done: false },
      { label: "Sell ETH on DEX B", detail: "ETH is $3,010 on SushiSwap — sell 333.33 ETH for $1,003,333", type: "action", done: false },
      { label: "Repay flash loan", detail: `Repay $${LOAN_AMOUNT.toLocaleString()} + $${LOAN_FEE.toLocaleString()} fee to Aave`, type: "repay", done: false },
      { label: "Keep profit", detail: `Net profit: $${(ARBITRAGE_PROFIT - LOAN_FEE).toLocaleString()} in the same block, zero capital`, type: "profit", done: false },
    ];
  }
  return [
    { label: "Flash borrow", detail: "Borrow $500,000 USDC from dYdX", type: "borrow", done: false },
    { label: "Manipulate oracle", detail: "Buy massive ETH position on a low-liquidity DEX — spike the price 30% within the block", type: "action", done: false },
    { label: "Exploit protocol", detail: "Protocol reads inflated price → borrow $600,000 against $500,000 collateral", type: "action", done: false },
    { label: "Repay flash loan", detail: "Repay $500,000 to dYdX", type: "repay", done: false },
    { label: "Profit from exploit", detail: "Keep $100,000 — protocol is drained. bZx lost $600K this way in 2020.", type: "profit", done: false },
  ];
}

const REVERT_STEPS: Step[] = [
  { label: "Flash borrow", detail: "Borrowed $1,000,000 USDC", type: "borrow", done: false },
  { label: "Trade executed", detail: "Used the funds in some way", type: "action", done: false },
  { label: "Repayment fails", detail: "Insufficient balance to repay loan + fee", type: "revert", done: false },
  { label: "Transaction reverts", detail: "EVM undoes ALL state changes. Loan never happened. Balance unchanged.", type: "revert", done: false },
];

const TYPE_COLOR = {
  borrow: "text-blue-400 border-blue-800",
  action: "text-yellow-400 border-yellow-800",
  repay: "text-orange-400 border-orange-800",
  profit: "text-green-400 border-green-800",
  revert: "text-red-400 border-red-800",
};

const TYPE_ICON = {
  borrow: "↓",
  action: "⚡",
  repay: "↑",
  profit: "✓",
  revert: "✗",
};

export default function FlashLoanDemo() {
  const [scenario, setScenario] = useState<"arb" | "exploit">("arb");
  const [steps, setSteps] = useState<Step[]>(buildSteps("arb"));
  const [current, setCurrent] = useState(-1);
  const [showRevert, setShowRevert] = useState(false);
  const [revertStep, setRevertStep] = useState(-1);

  function changeScenario(s: "arb" | "exploit") {
    setScenario(s);
    setSteps(buildSteps(s));
    setCurrent(-1);
    setShowRevert(false);
    setRevertStep(-1);
  }

  function next() {
    if (current < steps.length - 1) {
      const next = current + 1;
      setCurrent(next);
      setSteps((prev) => prev.map((s, i) => (i <= next ? { ...s, done: true } : s)));
    }
  }

  function startRevert() {
    setShowRevert(true);
    setRevertStep(0);
    setTimeout(() => setRevertStep(1), 500);
    setTimeout(() => setRevertStep(2), 1100);
    setTimeout(() => setRevertStep(3), 1800);
  }

  function reset() {
    setSteps(buildSteps(scenario));
    setCurrent(-1);
    setShowRevert(false);
    setRevertStep(-1);
  }

  const isComplete = current === steps.length - 1;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-orange-400 font-mono text-sm uppercase tracking-widest">
          Flash Loan — One Block
        </h3>
        <button onClick={reset} className="text-zinc-500 hover:text-zinc-300 font-mono text-xs transition-colors">
          reset
        </button>
      </div>

      {/* Scenario selector */}
      <div className="grid grid-cols-2 gap-2">
        {(["arb", "exploit"] as const).map((s) => (
          <button
            key={s}
            onClick={() => changeScenario(s)}
            className={`py-2 rounded font-mono text-sm transition-all ${
              scenario === s
                ? "bg-orange-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {s === "arb" ? "Arbitrage (legitimate)" : "Oracle exploit (attack)"}
          </button>
        ))}
      </div>

      {/* Key mechanic callout */}
      <div className="bg-zinc-800 rounded p-3 font-mono text-xs text-zinc-400">
        <span className="text-orange-400 font-bold">Atomicity: </span>
        All steps execute in a single transaction. If repayment fails, the entire transaction
        reverts — as if nothing happened. The lender takes zero risk.
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`rounded border px-4 py-3 transition-all duration-300 ${
              step.done
                ? TYPE_COLOR[step.type]
                : "border-zinc-700 text-zinc-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold w-4 text-center">
                {step.done ? TYPE_ICON[step.type] : String(i + 1)}
              </span>
              <div>
                <p className="font-mono text-sm font-bold">{step.label}</p>
                {step.done && (
                  <p className="font-mono text-xs opacity-70 mt-0.5">{step.detail}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      {!isComplete && !showRevert && (
        <div className="flex gap-3">
          <button
            onClick={next}
            disabled={current === steps.length - 1}
            className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-mono text-sm py-2 rounded transition-colors"
          >
            {current === -1 ? "Begin transaction →" : "Next step →"}
          </button>
          {current >= 0 && (
            <button
              onClick={startRevert}
              className="bg-red-900 hover:bg-red-800 text-red-300 font-mono text-sm px-4 py-2 rounded transition-colors"
            >
              Simulate revert
            </button>
          )}
        </div>
      )}

      {isComplete && !showRevert && (
        <div className="bg-green-900/30 border border-green-800 rounded p-4 text-center">
          <p className="text-green-400 font-mono text-sm font-bold">
            Transaction complete — all steps executed in one block
          </p>
          <p className="text-green-500/70 font-mono text-xs mt-1">
            Loan borrowed, used, and repaid atomically. No collateral. No counterparty risk.
          </p>
        </div>
      )}

      {/* Revert animation */}
      {showRevert && (
        <div className="space-y-2">
          <p className="text-red-400 font-mono text-xs uppercase tracking-widest">
            Transaction reverting...
          </p>
          {REVERT_STEPS.slice(0, revertStep + 1).map((s, i) => (
            <div key={i} className="border border-red-800 text-red-400 rounded px-4 py-2 font-mono text-sm">
              <span className="font-bold">✗ </span>{s.label}
              {i >= 2 && <p className="text-xs opacity-70 mt-0.5">{s.detail}</p>}
            </div>
          ))}
          {revertStep >= 3 && (
            <div className="bg-red-900/20 border border-red-800 rounded p-3 text-center">
              <p className="text-red-400 font-mono text-xs">
                State fully reverted. No ETH moved. No loan was ever made. Gas burned was the only cost.
              </p>
            </div>
          )}
        </div>
      )}

      <p className="text-zinc-600 text-xs font-mono border-t border-zinc-800 pt-4">
        Flash loans don't exist in traditional finance — atomicity is a blockchain primitive.
        Aave, dYdX, and Uniswap V3 all offer flash loans. The fee is typically 0.05–0.09%.
      </p>
    </div>
  );
}
