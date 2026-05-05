"use client";
import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | "intro"
  | "code"
  | "attack-start"
  | "reentrant-loop"
  | "drain-complete"
  | "locked"
  | "whitehats"
  | "rescue-complete"
  | "fork-vote"
  | "split";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAO_INITIAL = 11_500_000;   // total ETH in The DAO (June 2016)
const DRAINED = 3_600_000;        // ETH attacker drained
const RESCUED = 7_200_000;        // ETH white hats rescued from other child DAOs
const REMAINING = DAO_INITIAL - DRAINED - RESCUED; // ~700k legitimately split

// The vulnerable Solidity pseudocode
const VULNERABLE_CODE = `function splitDAO(address recipient) public {
    uint amount = balances[msg.sender];

    // ① Send ETH to recipient first
    recipient.call.value(amount)();
    //          ↑ recipient fallback fires HERE
    //            before we reach step ②

    // ② Only then zero the balance  ← BUG
    balances[msg.sender] = 0;
}`;

const SAFE_CODE = `function splitDAO(address recipient) public {
    uint amount = balances[msg.sender];

    // ① Zero the balance FIRST
    balances[msg.sender] = 0;

    // ② Then send ETH
    recipient.call.value(amount)();
    // Reentrancy now harmless:
    // balance is already 0
}`;

const ATTACKER_CODE = `// Attacker's contract
contract MaliciousDAO {
    TheDAO public target;

    // This runs every time the DAO sends ETH
    fallback() external payable {
        if (address(target).balance >= 100_000 ether) {
            target.splitDAO(address(this));
            // ↑ calls back into the DAO
            //   before balance resets
        }
    }
}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function CodeBlock({
  code,
  highlight,
  label,
}: {
  code: string;
  highlight?: string[];
  label: string;
}) {
  return (
    <div className="bg-zinc-950 rounded border border-zinc-700 overflow-hidden">
      <div className="px-3 py-1.5 bg-zinc-800 border-b border-zinc-700 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span className="text-zinc-400 font-mono text-xs ml-2">{label}</span>
      </div>
      <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto">
        {code.split("\n").map((line, i) => {
          const isHighlighted = highlight?.some((h) => line.includes(h));
          return (
            <div
              key={i}
              className={
                isHighlighted
                  ? "bg-red-900/50 text-red-300 -mx-4 px-4"
                  : "text-zinc-300"
              }
            >
              {line || " "}
            </div>
          );
        })}
      </pre>
    </div>
  );
}

function BalanceBar({
  label,
  balance,
  max,
  color,
  sublabel,
}: {
  label: string;
  balance: number;
  max: number;
  color: string;
  sublabel?: string;
}) {
  const pct = Math.max(0, Math.min(100, (balance / max) * 100));
  return (
    <div className="space-y-1">
      <div className="flex justify-between font-mono text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className={color}>{balance.toLocaleString()} ETH</span>
      </div>
      <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color.replace("text-", "").includes("red") ? "#ef4444" : color.includes("green") ? "#22c55e" : color.includes("orange") ? "#f97316" : color.includes("blue") ? "#3b82f6" : "#a78bfa" }}
        />
      </div>
      {sublabel && <p className="text-zinc-600 font-mono text-xs">{sublabel}</p>}
    </div>
  );
}

// ─── Call-stack animation ─────────────────────────────────────────────────────

function CallStack({ depth }: { depth: number }) {
  const frames = Array.from({ length: depth }, (_, i) => ({
    label: `splitDAO() call #${i + 1}`,
    eth: (i + 1) * 100_000,
  }));
  return (
    <div className="space-y-1">
      <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-2">
        EVM Call Stack
      </p>
      <div className="space-y-1 max-h-52 overflow-y-auto">
        {frames.map((f, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 font-mono text-xs"
            style={{ marginLeft: `${i * 8}px` }}
          >
            <span className="text-yellow-400">{f.label}</span>
            <span className="text-orange-400">−{f.eth.toLocaleString()} ETH</span>
          </div>
        ))}
        {depth > 0 && (
          <div
            className="flex items-center justify-between bg-red-950 border border-red-700 rounded px-3 py-1.5 font-mono text-xs animate-pulse"
            style={{ marginLeft: `${depth * 8}px` }}
          >
            <span className="text-red-400">fallback() ← triggers again</span>
            <span className="text-red-300">looping…</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function ReentrancyDemo() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [daoBalance, setDaoBalance] = useState(DAO_INITIAL);
  const [attackerBalance, setAttackerBalance] = useState(0);
  const [whiteHatBalance, setWhiteHatBalance] = useState(0);
  const [callDepth, setCallDepth] = useState(0);
  const [drainPct, setDrainPct] = useState(0);
  const [rescuePct, setRescuePct] = useState(0);
  const [daysLeft, setDaysLeft] = useState(28);

  const drainRef = useRef<NodeJS.Timeout | null>(null);
  const rescueRef = useRef<NodeJS.Timeout | null>(null);
  const stackRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  function clearAll() {
    [drainRef, rescueRef, stackRef, timerRef].forEach((r) => {
      if (r.current) clearInterval(r.current);
    });
  }

  function reset() {
    clearAll();
    setPhase("intro");
    setDaoBalance(DAO_INITIAL);
    setAttackerBalance(0);
    setWhiteHatBalance(0);
    setCallDepth(0);
    setDrainPct(0);
    setRescuePct(0);
    setDaysLeft(28);
  }

  function advance() {
    clearAll();
    const next: Record<Phase, Phase> = {
      intro: "code",
      code: "attack-start",
      "attack-start": "reentrant-loop",
      "reentrant-loop": "drain-complete",
      "drain-complete": "locked",
      locked: "whitehats",
      whitehats: "rescue-complete",
      "rescue-complete": "fork-vote",
      "fork-vote": "split",
      split: "split",
    };
    setPhase(next[phase]);
  }

  // ── Phase effects ─────────────────────────────────────────────────────────

  useEffect(() => {
    clearAll();
    if (phase === "reentrant-loop") {
      // Build up call stack depth 1→8
      let d = 0;
      stackRef.current = setInterval(() => {
        d += 1;
        setCallDepth(d);
        if (d >= 8) {
          clearInterval(stackRef.current!);
          setTimeout(() => setPhase("drain-complete"), 600);
        }
      }, 350);
    }

    if (phase === "drain-complete") {
      // Animate drain: DAO goes from full → full-DRAINED
      let pct = 0;
      drainRef.current = setInterval(() => {
        pct += 2;
        setDrainPct(pct);
        const removed = Math.floor((DRAINED * pct) / 100);
        setDaoBalance(DAO_INITIAL - removed);
        setAttackerBalance(removed);
        if (pct >= 100) clearInterval(drainRef.current!);
      }, 30);
    }

    if (phase === "locked") {
      // Count down from 28 days (fast, cosmetic)
      let d = 28;
      timerRef.current = setInterval(() => {
        d -= 1;
        setDaysLeft(d);
        if (d <= 0) clearInterval(timerRef.current!);
      }, 80);
    }

    if (phase === "rescue-complete") {
      // Animate white-hat rescue: drain other child DAOs to recovery
      let pct = 0;
      rescueRef.current = setInterval(() => {
        pct += 2;
        setRescuePct(pct);
        const rescued = Math.floor((RESCUED * pct) / 100);
        setDaoBalance(DAO_INITIAL - DRAINED - rescued);
        setWhiteHatBalance(rescued);
        if (pct >= 100) clearInterval(rescueRef.current!);
      }, 25);
    }

    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ─── Labels ────────────────────────────────────────────────────────────────

  const PHASE_LABELS: Record<Phase, string> = {
    intro: "Background — The DAO",
    code: "The Vulnerable Code",
    "attack-start": "The Attacker Deploys",
    "reentrant-loop": "Reentrancy Loop Begins",
    "drain-complete": "3.6M ETH Drained",
    locked: "28-Day Lockup — The Window",
    whitehats: "White Hats Strike Back",
    "rescue-complete": "7.2M ETH Rescued",
    "fork-vote": "The Community Votes",
    split: "ETH vs ETC — Two Chains",
  };

  const PHASE_ORDER: Phase[] = [
    "intro",
    "code",
    "attack-start",
    "reentrant-loop",
    "drain-complete",
    "locked",
    "whitehats",
    "rescue-complete",
    "fork-vote",
    "split",
  ];
  const currentIndex = PHASE_ORDER.indexOf(phase);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-orange-400 font-mono text-sm uppercase tracking-widest">
          The DAO Hack — Step by Step
        </h3>
        <button
          onClick={reset}
          className="text-zinc-500 hover:text-zinc-300 font-mono text-xs transition-colors"
        >
          restart
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 items-center">
        {PHASE_ORDER.map((p, i) => (
          <div
            key={p}
            className={`rounded-full transition-all duration-300 ${
              i < currentIndex
                ? "w-2 h-2 bg-orange-500"
                : i === currentIndex
                ? "w-3 h-3 bg-orange-400 ring-2 ring-orange-400/30"
                : "w-2 h-2 bg-zinc-700"
            }`}
          />
        ))}
        <span className="text-zinc-500 font-mono text-xs ml-2">
          {currentIndex + 1}/{PHASE_ORDER.length} — {PHASE_LABELS[phase]}
        </span>
      </div>

      {/* ── Phase content ─────────────────────────────────────────────────── */}

      {phase === "intro" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Launch date", value: "April 30, 2016" },
              { label: "ETH raised", value: "11,500,000 ETH" },
              { label: "USD value (then)", value: "~$150,000,000" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-zinc-800 rounded p-3 text-center">
                <p className="text-zinc-500 font-mono text-xs">{label}</p>
                <p className="text-zinc-200 font-mono text-sm font-bold mt-1">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-zinc-400 font-mono text-sm leading-relaxed">
            The DAO was an Ethereum smart contract — a decentralized investment fund.
            Token holders could vote on which projects to fund. 18,000 investors contributed
            11.5 million ETH, representing 14% of all ETH in existence at the time.
            It was the largest crowdfund in history.
          </p>
          <p className="text-zinc-400 font-mono text-sm leading-relaxed">
            Token holders could also "split" from The DAO, taking their proportional share
            of ETH with them into a "child DAO." This split mechanism had a bug.
          </p>
        </div>
      )}

      {phase === "code" && (
        <div className="space-y-4">
          <p className="text-zinc-400 font-mono text-sm">
            The split function sends ETH to the caller <span className="text-red-400 font-bold">before</span> zeroing
            their balance. If the recipient is a contract, its fallback function fires
            during the transfer — and can call <code className="bg-zinc-800 px-1 rounded">splitDAO()</code> again
            before the balance ever updates.
          </p>
          <CodeBlock
            code={VULNERABLE_CODE}
            highlight={["recipient.call.value", "balances[msg.sender] = 0"]}
            label="TheDAO.sol — splitDAO() — THE BUG"
          />
          <div className="bg-red-900/20 border border-red-800 rounded p-3 font-mono text-xs text-red-400">
            <span className="font-bold">The flaw: </span>
            checks-effects-interactions pattern violated. Effect (zeroing balance)
            must come before interaction (external call). Here it comes after.
          </div>
          <div className="mt-2">
            <p className="text-zinc-500 font-mono text-xs mb-2">The safe version looks like this:</p>
            <CodeBlock
              code={SAFE_CODE}
              highlight={["balances[msg.sender] = 0"]}
              label="Safe version — zero first, send second"
            />
          </div>
        </div>
      )}

      {phase === "attack-start" && (
        <div className="space-y-4">
          <p className="text-zinc-400 font-mono text-sm">
            On June 17, 2016, an anonymous attacker deployed a malicious contract.
            Its fallback function — which runs automatically when it receives ETH —
            immediately calls <code className="bg-zinc-800 px-1 rounded text-yellow-400">splitDAO()</code> back into The DAO.
            The attacker needed only 1% of DAO tokens (~$1.5M) to initiate the attack.
          </p>
          <CodeBlock
            code={ATTACKER_CODE}
            highlight={["target.splitDAO(address(this))", "fallback() external payable"]}
            label="AttackerContract.sol — the malicious drainer"
          />
          <div className="bg-zinc-800 rounded p-4 space-y-2">
            <p className="text-zinc-300 font-mono text-sm font-bold">What happens when splitDAO() runs:</p>
            <ol className="space-y-2 font-mono text-xs text-zinc-400 list-decimal list-inside">
              <li>DAO checks: <span className="text-green-400">balance[attacker] = 100,000 ETH ✓</span></li>
              <li>DAO sends 100,000 ETH → attacker&apos;s contract</li>
              <li>Attacker&apos;s fallback fires: calls splitDAO() <span className="text-yellow-400">AGAIN</span></li>
              <li>DAO checks: <span className="text-red-400">balance[attacker] still = 100,000 ETH ✓</span> (never zeroed)</li>
              <li>DAO sends another 100,000 ETH → attacker&apos;s contract</li>
              <li>Repeat from step 3...</li>
            </ol>
          </div>
        </div>
      )}

      {phase === "reentrant-loop" && (
        <div className="space-y-4">
          <p className="text-zinc-400 font-mono text-sm">
            Watch the EVM call stack grow as the reentrancy loop executes.
            Each recursive call drains another 100,000 ETH before the previous
            call has a chance to zero the balance.
          </p>
          <CallStack depth={callDepth} />
          {callDepth > 0 && (
            <div className="flex justify-between bg-zinc-800 rounded p-3 font-mono text-sm">
              <span className="text-zinc-400">ETH drained so far</span>
              <span className="text-red-400 font-bold">
                −{(callDepth * 100_000).toLocaleString()} ETH
              </span>
            </div>
          )}
          <p className="text-zinc-600 font-mono text-xs">
            The actual attack ran thousands of recursive calls over several hours,
            pausing and resuming across multiple transactions to stay within gas limits.
          </p>
        </div>
      )}

      {phase === "drain-complete" && (
        <div className="space-y-5">
          <p className="text-zinc-400 font-mono text-sm">
            Over three hours, the attacker drained 3.6 million ETH.
            Watch The DAO empty and the attacker&apos;s child DAO fill up.
          </p>
          <div className="space-y-4">
            <BalanceBar
              label="The DAO (victims)"
              balance={daoBalance}
              max={DAO_INITIAL}
              color="text-red-400"
            />
            <div className="flex items-center gap-2 text-zinc-600 font-mono text-xs justify-center">
              <div className="h-px flex-1 bg-zinc-700" />
              <span>ETH flowing</span>
              <div className="h-px flex-1 bg-zinc-700" />
            </div>
            <BalanceBar
              label="Attacker's Child DAO"
              balance={attackerBalance}
              max={DAO_INITIAL}
              color="text-orange-400"
            />
          </div>
          {drainPct >= 100 && (
            <div className="bg-red-900/20 border border-red-800 rounded p-4 font-mono text-sm text-center space-y-1">
              <p className="text-red-400 font-bold">3,600,000 ETH drained — $60M stolen</p>
              <p className="text-red-500/70 text-xs">
                14% of all Ethereum in existence. The largest smart contract exploit in history at that point.
              </p>
            </div>
          )}
        </div>
      )}

      {phase === "locked" && (
        <div className="space-y-5">
          <div className="bg-green-900/20 border border-green-800 rounded p-4 space-y-2">
            <p className="text-green-400 font-mono text-sm font-bold">
              The DAO&apos;s own rules saved everyone — temporarily.
            </p>
            <p className="text-zinc-400 font-mono text-sm">
              Child DAOs couldn&apos;t withdraw ETH for 28 days after creation.
              The same mechanism designed to prevent hasty decisions now gave the
              Ethereum community a window to respond. The attacker had the ETH —
              but couldn&apos;t spend it yet.
            </p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-5 text-center space-y-3">
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              Time remaining until attacker can withdraw
            </p>
            <p className="text-5xl font-mono font-bold text-orange-400">
              {Math.max(0, daysLeft)}<span className="text-2xl text-zinc-500 ml-1">days</span>
            </p>
            <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-100"
                style={{ width: `${((28 - Math.max(0, daysLeft)) / 28) * 100}%` }}
              />
            </div>
            <p className="text-zinc-500 font-mono text-xs">
              Clock is ticking. The community has 28 days to act.
            </p>
          </div>
          <p className="text-zinc-400 font-mono text-sm">
            The Ethereum community started an emergency discussion.
            But someone else noticed something — the other child DAOs that legitimate
            users had created still had 7.2 million ETH in them, vulnerable to the same exploit.
            If the attacker ran the same attack on those, they could drain the rest of The DAO too.
          </p>
        </div>
      )}

      {phase === "whitehats" && (
        <div className="space-y-4">
          <div className="bg-blue-900/20 border border-blue-800 rounded p-4 space-y-2">
            <p className="text-blue-400 font-mono text-sm font-bold">
              The White Hat Counter-Attack
            </p>
            <p className="text-zinc-400 font-mono text-sm leading-relaxed">
              A group of developers including Griff Green, Jordi Baylina, and others
              from the Ethereum community realized: if they used the SAME reentrancy exploit
              on the remaining child DAOs before the attacker did, they could move that ETH
              to a safe recovery contract they controlled — and return it to investors later.
            </p>
          </div>
          <div className="bg-zinc-800 rounded p-4 font-mono text-sm space-y-3">
            <p className="text-zinc-400 font-bold">The white hats&apos; reasoning:</p>
            <div className="space-y-2 text-zinc-400 text-xs">
              <div className="flex gap-3">
                <span className="text-blue-400 font-bold w-4">1.</span>
                <span>The attacker could exploit the same bug again on other child DAOs</span>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400 font-bold w-4">2.</span>
                <span>We have the same exploit available to us right now</span>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400 font-bold w-4">3.</span>
                <span>If we exploit it first, we control the recovery contract</span>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400 font-bold w-4">4.</span>
                <span>We return the ETH to rightful owners after resolution</span>
              </div>
              <div className="flex gap-3">
                <span className="text-red-400 font-bold w-4">?</span>
                <span className="text-red-400">
                  Is this ethical? They used an exploit to drain funds they didn&apos;t own —
                  even if to protect them. No one asked permission. They acted unilaterally.
                </span>
              </div>
            </div>
          </div>
          <p className="text-zinc-500 font-mono text-xs">
            They decided to act. Click continue to see the rescue.
          </p>
        </div>
      )}

      {phase === "rescue-complete" && (
        <div className="space-y-5">
          <p className="text-zinc-400 font-mono text-sm">
            Racing against time and the attacker, the white hats deployed the same reentrancy
            exploit against the remaining child DAOs — moving 7.2 million ETH to a
            safe recovery contract before anyone else could drain it.
          </p>
          <div className="space-y-4">
            <BalanceBar
              label="Remaining Child DAOs (at risk)"
              balance={Math.max(0, RESCUED - Math.floor((RESCUED * rescuePct) / 100))}
              max={RESCUED}
              color="text-yellow-400"
            />
            <div className="flex items-center gap-2 text-zinc-600 font-mono text-xs justify-center">
              <div className="h-px flex-1 bg-zinc-700" />
              <span className="text-blue-400">white hat rescue →</span>
              <div className="h-px flex-1 bg-zinc-700" />
            </div>
            <BalanceBar
              label="White Hat Recovery Contract"
              balance={whiteHatBalance}
              max={RESCUED}
              color="text-blue-400"
            />
          </div>

          {rescuePct >= 100 && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Attacker holds (locked)", value: "3.6M ETH", color: "text-red-400" },
                { label: "White hats hold (safe)", value: "7.2M ETH", color: "text-blue-400" },
                { label: "Community decides", value: "28 days", color: "text-orange-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-zinc-800 rounded p-3 text-center">
                  <p className="text-zinc-500 font-mono text-xs">{label}</p>
                  <p className={`font-mono text-sm font-bold mt-1 ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {phase === "fork-vote" && (
        <div className="space-y-4">
          <p className="text-zinc-400 font-mono text-sm">
            With the clock ticking, the Ethereum community debated.
            A carbon vote (weighted by ETH held) ran for two weeks.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-900/20 border border-green-800 rounded p-4 space-y-2">
              <p className="text-green-400 font-mono text-sm font-bold">Hard Fork</p>
              <p className="text-zinc-400 font-mono text-xs leading-relaxed">
                Roll back the chain at block 1,920,000. Return all DAO ETH to a
                recovery contract. Investors made whole. The attack never happened
                (on the new chain).
              </p>
              <div className="mt-3">
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-zinc-500">Vote share</span>
                  <span className="text-green-400 font-bold">87%</span>
                </div>
                <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "87%" }} />
                </div>
              </div>
            </div>
            <div className="bg-red-900/20 border border-red-800 rounded p-4 space-y-2">
              <p className="text-red-400 font-mono text-sm font-bold">No Fork — Code is Law</p>
              <p className="text-zinc-400 font-mono text-xs leading-relaxed">
                The contract executed as written. The attacker used the rules.
                Rolling back sets a precedent that kills immutability.
                Let the theft stand.
              </p>
              <div className="mt-3">
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-zinc-500">Vote share</span>
                  <span className="text-red-400 font-bold">13%</span>
                </div>
                <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "13%" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-zinc-800 rounded p-3 font-mono text-xs text-zinc-400">
            <span className="text-orange-400 font-bold">July 20, 2016, block 1,920,000. </span>
            The hard fork executes. The majority chain moves forward with the rollback.
            The attacker&apos;s child DAO is rewritten to a recovery contract. Investors
            recover their ETH. A minority of nodes refuse the fork and keep mining the original chain.
          </div>
        </div>
      )}

      {phase === "split" && (
        <div className="space-y-5">
          <p className="text-zinc-400 font-mono text-sm">
            Block 1,920,000 exists on both chains — but with different transaction history.
            The split is permanent.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                name: "Ethereum (ETH)",
                color: "border-purple-600 bg-purple-900/20",
                labelColor: "text-purple-400",
                points: [
                  "Hard fork applied",
                  "DAO attacker's funds returned",
                  "Community consensus prioritized",
                  "Today: $400B market cap",
                  "World's programmable settlement layer",
                ],
              },
              {
                name: "Ethereum Classic (ETC)",
                color: "border-zinc-600 bg-zinc-800/50",
                labelColor: "text-zinc-400",
                points: [
                  "Original chain, unmodified",
                  "Attacker's 3.6M ETH remains valid",
                  "'Code is law' principle upheld",
                  "51% attacked 3× (2019–2020)",
                  "Today: ~$3B market cap",
                ],
              },
            ].map(({ name, color, labelColor, points }) => (
              <div key={name} className={`rounded-lg border p-4 space-y-3 ${color}`}>
                <p className={`font-mono text-sm font-bold ${labelColor}`}>{name}</p>
                <ul className="space-y-1.5">
                  {points.map((p) => (
                    <li key={p} className="flex gap-2 font-mono text-xs text-zinc-400">
                      <span className={labelColor}>·</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="bg-zinc-800 rounded p-4 font-mono text-xs text-zinc-400 space-y-2">
            <p className="text-orange-400 font-bold">The uncomfortable legacy:</p>
            <p>
              Every person who held ETH before the fork now had ETH on both chains simultaneously.
              The attacker, too. The "rollback" didn&apos;t eliminate them from the ecosystem —
              it just changed the majority chain&apos;s history. On Ethereum Classic,
              their 3.6 million ETC is still there. Code was law on one chain.
              Community was law on the other. Both exist today.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2 border-t border-zinc-800">
        {phase !== "split" ? (
          <button
            onClick={advance}
            disabled={
              (phase === "reentrant-loop" && callDepth < 8) ||
              (phase === "drain-complete" && drainPct < 100) ||
              (phase === "rescue-complete" && rescuePct < 100)
            }
            className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-wait text-white font-mono text-sm py-2.5 rounded transition-colors"
          >
            {phase === "reentrant-loop" && callDepth < 8
              ? "Watch the loop..."
              : phase === "drain-complete" && drainPct < 100
              ? "Draining..."
              : phase === "rescue-complete" && rescuePct < 100
              ? "Rescuing..."
              : "Continue →"}
          </button>
        ) : (
          <button
            onClick={reset}
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-mono text-sm py-2.5 rounded transition-colors"
          >
            ← Replay from beginning
          </button>
        )}
      </div>
    </div>
  );
}
