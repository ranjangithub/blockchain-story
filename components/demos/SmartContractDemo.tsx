"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ContractState = "funded" | "vin_provided" | "refunded" | "completed";
type Scenario = "idle" | "buyer" | "timeout";

const CONTRACT_CODE = `// Escrow Contract (simplified)
contract CarEscrow {
  address buyer  = Alice;
  address seller = Bob;
  uint    amount = 1 ETH;
  uint    expiry = block.timestamp + 30 days;
  string  requiredVIN;

  function provideVIN(string vin) {
    require(msg.sender == seller);
    require(vin == requiredVIN);
    seller.transfer(amount); // ✓ release funds
  }

  function refund() {
    require(block.timestamp > expiry);
    require(msg.sender == buyer);
    buyer.transfer(amount);  // ✓ refund after timeout
  }
}`;

export default function SmartContractDemo() {
  const [state, setState] = useState<ContractState>("funded");
  const [scenario, setScenario] = useState<Scenario>("idle");
  const [log, setLog] = useState<string[]>(["Contract deployed. 1 ETH locked in escrow."]);

  function addLog(msg: string) {
    setLog(prev => [...prev, msg]);
  }

  function runBuyerScenario() {
    setScenario("buyer");
    setState("funded");
    setLog(["Contract deployed. 1 ETH locked in escrow."]);
    setTimeout(() => addLog("Bob calls provideVIN('1HGBH41JXMN109186')..."), 800);
    setTimeout(() => addLog("Contract validates VIN against stored value... ✓"), 1600);
    setTimeout(() => { setState("vin_provided"); addLog("Condition met. Transferring 1 ETH to Bob..."); }, 2400);
    setTimeout(() => { setState("completed"); addLog("✓ Done. Bob received 1 ETH. No lawyer needed."); }, 3200);
  }

  function runTimeoutScenario() {
    setScenario("timeout");
    setState("funded");
    setLog(["Contract deployed. 1 ETH locked in escrow."]);
    setTimeout(() => addLog("30 days pass. Bob never provided the VIN."), 800);
    setTimeout(() => addLog("Alice calls refund()..."), 1600);
    setTimeout(() => addLog("Contract checks: block.timestamp > expiry? ✓"), 2400);
    setTimeout(() => { setState("refunded"); addLog("✓ Refunding 1 ETH to Alice. Bob gets nothing."); }, 3200);
  }

  function reset() {
    setState("funded");
    setScenario("idle");
    setLog(["Contract deployed. 1 ETH locked in escrow."]);
  }

  const statusColor = {
    funded: "text-yellow-400",
    vin_provided: "text-blue-400",
    completed: "text-green-400",
    refunded: "text-orange-400",
  }[state];

  const statusLabel = {
    funded: "Awaiting VIN",
    vin_provided: "VIN verified — transferring",
    completed: "Complete — Bob paid",
    refunded: "Refunded — Alice returned",
  }[state];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-4">
      <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Escrow Smart Contract</span>

      {/* Scenario */}
      <div className="bg-zinc-950 rounded border border-zinc-800 p-3 flex flex-col gap-2 text-xs font-mono text-zinc-400">
        <p><span className="text-zinc-600">Setup:</span> Alice wants to buy Bob's car. Price: 1 ETH.</p>
        <p>Alice deposits into the contract. Bob must provide the VIN number to claim funds.</p>
        <p>If 30 days pass without the VIN, Alice can reclaim her ETH.</p>
        <p>No bank. No lawyer. The code IS the agreement.</p>
      </div>

      {/* Contract code */}
      <div className="bg-zinc-950 rounded border border-zinc-800 p-3 font-mono text-[11px] text-zinc-500 leading-relaxed whitespace-pre overflow-auto max-h-40">
        {CONTRACT_CODE}
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-zinc-600">Contract state:</span>
        <span className={`text-xs font-mono font-bold ${statusColor}`}>{statusLabel}</span>
      </div>

      {/* Event log */}
      <div className="bg-zinc-950 rounded border border-zinc-800 p-3 flex flex-col gap-1 min-h-[80px]">
        <AnimatePresence>
          {log.map((entry, i) => (
            <motion.p key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              className="text-xs font-mono text-zinc-400">
              <span className="text-zinc-600">&gt; </span>{entry}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={runBuyerScenario} disabled={scenario !== "idle"}
          className="px-3 py-1.5 text-xs font-mono bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white rounded transition-colors">
          Bob provides VIN → gets paid
        </button>
        <button onClick={runTimeoutScenario} disabled={scenario !== "idle"}
          className="px-3 py-1.5 text-xs font-mono bg-orange-700 hover:bg-orange-600 disabled:opacity-40 text-white rounded transition-colors">
          30 days pass → Alice refunded
        </button>
        <button onClick={reset}
          className="px-3 py-1.5 text-xs font-mono bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors">
          Reset
        </button>
      </div>
    </div>
  );
}
