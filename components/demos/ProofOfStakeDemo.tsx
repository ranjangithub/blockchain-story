"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const N = 24;                   // validator count in demo (represents 900,000+)
const STAKE = 32;               // ETH per validator
const ATTEST_THRESHOLD = 16;    // ⌈2/3 of 24⌉ needed for finality
const ATTESTER_REWARD = 0.007;  // ETH per finalized slot
const PROPOSER_BONUS  = 0.035;  // ETH extra for block proposer
const SLASH_AMOUNT    = 1.0;    // ETH burned on first slash
const SLOT_DURATION   = 12;     // seconds (real), shown as label only

// ─── Types ────────────────────────────────────────────────────────────────────
type VStatus = "idle" | "selected" | "proposing" | "attesting" | "attested" | "slashed" | "ejected";
type Validator = { id: number; stake: number; rewards: number; status: VStatus; blocks: number };
type Phase =
  | "idle" | "selecting" | "proposing" | "attesting"
  | "finalized" | "slash-pick" | "slashing" | "slashed";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeValidators(): Validator[] {
  return Array.from({ length: N }, (_, i) => ({
    id: i + 1,
    stake: STAKE,
    rewards: 0,
    status: "idle",
    blocks: 0,
  }));
}

const STATUS_RING: Record<VStatus, string> = {
  idle:      "ring-zinc-600  bg-zinc-800 text-zinc-400",
  selected:  "ring-yellow-400 bg-yellow-900/40 text-yellow-300 animate-pulse",
  proposing: "ring-orange-400 bg-orange-900/40 text-orange-300",
  attesting: "ring-blue-400  bg-blue-900/30   text-blue-300  animate-pulse",
  attested:  "ring-green-500 bg-green-900/30  text-green-300",
  slashed:   "ring-red-500   bg-red-900/40    text-red-300",
  ejected:   "ring-zinc-700  bg-zinc-900      text-zinc-600  opacity-50",
};

const STATUS_LABEL: Record<VStatus, string> = {
  idle:      "Staking",
  selected:  "Chosen!",
  proposing: "Proposing",
  attesting: "Voting…",
  attested:  "Attested ✓",
  slashed:   "SLASHED ✗",
  ejected:   "Ejected",
};

// ─── Validator card ───────────────────────────────────────────────────────────
function ValidatorCard({
  v, onClick, clickable,
}: {
  v: Validator;
  onClick?: () => void;
  clickable?: boolean;
}) {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`ring-2 rounded-lg p-2 flex flex-col items-center gap-1 transition-all duration-300
        ${STATUS_RING[v.status]}
        ${clickable ? "cursor-pointer hover:ring-red-400 hover:scale-105" : ""}
      `}
    >
      <p className="font-mono text-xs font-bold">V#{v.id}</p>
      <div className="w-6 h-6 rounded-full bg-current opacity-30" />
      <p className="font-mono text-xs leading-tight">{v.stake.toFixed(1)} ETH</p>
      {v.rewards > 0 && (
        <p className="font-mono text-xs text-green-400">+{v.rewards.toFixed(3)}</p>
      )}
      <p className="font-mono text-xs opacity-70 leading-tight text-center">
        {STATUS_LABEL[v.status]}
      </p>
    </div>
  );
}

// ─── Block visualiser ─────────────────────────────────────────────────────────
function BlockVisual({
  height, proposer, txCount, phase,
}: {
  height: number; proposer: number; txCount: number; phase: Phase;
}) {
  const txLabels = ["Transfer", "Swap", "Mint NFT", "Approve", "Claim", "Stake", "Bridge", "Lend"];
  return (
    <div className="bg-zinc-950 border border-zinc-700 rounded-lg p-4 space-y-2">
      <div className="flex justify-between font-mono text-xs">
        <span className="text-zinc-500">Block</span>
        <span className="text-orange-400 font-bold">#{height.toLocaleString()}</span>
      </div>
      <div className="flex justify-between font-mono text-xs">
        <span className="text-zinc-500">Proposer</span>
        <span className="text-yellow-400">Validator #{proposer}</span>
      </div>
      <div className="flex justify-between font-mono text-xs">
        <span className="text-zinc-500">Slot duration</span>
        <span className="text-zinc-300">{SLOT_DURATION}s</span>
      </div>
      <div className="border-t border-zinc-800 pt-2 space-y-1">
        <p className="text-zinc-600 font-mono text-xs">Transactions ({txCount})</p>
        <div className="flex flex-wrap gap-1">
          {txLabels.slice(0, txCount).map((tx) => (
            <span key={tx} className="bg-zinc-800 text-zinc-400 font-mono text-xs px-1.5 py-0.5 rounded">
              {tx}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-zinc-800 pt-2 font-mono text-xs">
        <div className="flex justify-between">
          <span className="text-zinc-500">Status</span>
          <span className={
            phase === "finalized" ? "text-green-400 font-bold" :
            phase === "attesting" ? "text-blue-400" :
            phase === "proposing" ? "text-orange-400" :
            "text-zinc-400"
          }>
            {phase === "proposing"  ? "Building…"   :
             phase === "attesting"  ? "Awaiting votes" :
             phase === "finalized"  ? "✓ Finalized"   :
             "Pending"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Attestation progress bar ─────────────────────────────────────────────────
function AttestBar({ votes, needed, total }: { votes: number; needed: number; total: number }) {
  const pct = Math.min(100, (votes / total) * 100);
  const threshPct = (needed / total) * 100;
  const finalized = votes >= needed;
  return (
    <div className="space-y-1">
      <div className="flex justify-between font-mono text-xs">
        <span className="text-zinc-400">Committee attestations</span>
        <span className={finalized ? "text-green-400 font-bold" : "text-zinc-300"}>
          {votes}/{total} {finalized ? "✓ FINALIZED" : `(need ${needed})`}
        </span>
      </div>
      <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
        {/* Threshold marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-orange-500 z-10"
          style={{ left: `${threshPct}%` }}
        />
        {/* Fill */}
        <div
          className={`h-full rounded-full transition-all duration-300 ${finalized ? "bg-green-500" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-zinc-600 font-mono text-xs">
        Orange line = 2/3 threshold ({needed} validators). Above it = block finalized.
      </p>
    </div>
  );
}

// ─── Slashing explainer ────────────────────────────────────────────────────────
function SlashExplainer({ validator, onDone }: { validator: Validator | null; onDone: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Attestation 1 broadcast", detail: `Validator #${validator?.id} signs: Block A is canonical at slot 18,543,201`, color: "text-zinc-300" },
    { label: "Attestation 2 broadcast (equivocation!)", detail: `Same validator #${validator?.id} signs: Block B is canonical at slot 18,543,201`, color: "text-red-400" },
    { label: "Network detects contradiction", detail: "Two conflicting attestations for the same slot = provable equivocation. Any node can report this.", color: "text-yellow-400" },
    { label: "Slashing transaction submitted", detail: "A whistleblower node submits both attestations on-chain. The protocol verifies them.", color: "text-orange-400" },
    { label: "Penalty applied", detail: `${SLASH_AMOUNT} ETH burned from stake. Validator forcibly exited. Minimum 1/32 stake always burned; can reach 36% if many slash simultaneously.`, color: "text-red-500" },
    { label: "Whistleblower reward", detail: "The reporting node receives a small portion of the slashed ETH. Incentivizes honest monitoring.", color: "text-green-400" },
  ];

  useEffect(() => {
    if (step >= steps.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), 1200);
    return () => clearTimeout(t);
  }, [step, steps.length]);

  return (
    <div className="bg-red-950/30 border border-red-800 rounded-lg p-4 space-y-3">
      <p className="text-red-400 font-mono text-sm font-bold">Slashing in progress — V#{validator?.id}</p>
      <div className="space-y-2">
        {steps.slice(0, step).map((s, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-red-600 font-mono text-xs w-4">{i + 1}.</span>
            <div>
              <p className={`font-mono text-xs font-bold ${s.color}`}>{s.label}</p>
              <p className="text-zinc-500 font-mono text-xs">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
      {step >= steps.length && (
        <button
          onClick={onDone}
          className="w-full mt-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-mono text-sm py-2 rounded transition-colors"
        >
          Continue →
        </button>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProofOfStakeDemo() {
  const [validators, setValidators] = useState<Validator[]>(makeValidators);
  const [phase, setPhase] = useState<Phase>("idle");
  const [proposerId, setProposerId] = useState<number | null>(null);
  const [voteCount, setVoteCount] = useState(0);
  const [blockHeight, setBlockHeight] = useState(18_543_200);
  const [epochSlot, setEpochSlot] = useState(0);   // 0-31 within epoch
  const [epoch, setEpoch] = useState(287_423);
  const [slashTarget, setSlashTarget] = useState<number | null>(null);
  const [totalRewards, setTotalRewards] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const attestTimerRef = useRef<NodeJS.Timeout | null>(null);
  const selectTimerRef = useRef<NodeJS.Timeout | null>(null);

  function addLog(msg: string) {
    setLog((prev) => [msg, ...prev].slice(0, 6));
  }

  function clearTimers() {
    if (attestTimerRef.current) clearInterval(attestTimerRef.current);
    if (selectTimerRef.current) clearInterval(selectTimerRef.current);
  }

  function reset() {
    clearTimers();
    setValidators(makeValidators());
    setPhase("idle");
    setProposerId(null);
    setVoteCount(0);
    setSlashTarget(null);
    setLog([]);
  }

  // ── Step 1: Run a slot ────────────────────────────────────────────────────
  const runSlot = useCallback(() => {
    if (phase !== "idle" && phase !== "finalized") return;
    clearTimers();
    setPhase("selecting");
    setVoteCount(0);

    // Reset to idle except ejected/slashed
    setValidators((prev) =>
      prev.map((v) =>
        v.status === "ejected" || v.status === "slashed"
          ? v
          : { ...v, status: "idle" }
      )
    );

    addLog("RANDAO: selecting proposer from active validator set…");

    // Animate random selection (slot-machine effect)
    let ticker = 0;
    let currentFlash = 0;
    const activeIds = validators
      .filter((v) => v.status !== "ejected" && v.status !== "slashed")
      .map((v) => v.id);

    selectTimerRef.current = setInterval(() => {
      ticker++;
      currentFlash = activeIds[ticker % activeIds.length];
      setValidators((prev) =>
        prev.map((v) => ({
          ...v,
          status:
            v.status === "ejected" || v.status === "slashed"
              ? v.status
              : v.id === currentFlash
              ? "selected"
              : "idle",
        }))
      );

      if (ticker > 18) {
        clearInterval(selectTimerRef.current!);
        // Lock in final proposer
        const chosen = activeIds[Math.floor(Math.random() * activeIds.length)];
        setProposerId(chosen);
        setValidators((prev) =>
          prev.map((v) => ({
            ...v,
            status:
              v.status === "ejected" || v.status === "slashed"
                ? v.status
                : v.id === chosen
                ? "proposing"
                : "idle",
          }))
        );
        addLog(`Proposer: Validator #${chosen} selected via RANDAO`);
        setPhase("proposing");

        setTimeout(() => {
          addLog("Block proposed. Committee attestation begins…");
          setPhase("attesting");
          startAttesting(chosen, activeIds);
        }, 1800);
      }
    }, 80);
  }, [phase, validators]);

  // ── Step 2: Attestation ───────────────────────────────────────────────────
  function startAttesting(proposer: number, activeIds: number[]) {
    const committee = activeIds.filter((id) => id !== proposer);
    let idx = 0;
    setValidators((prev) =>
      prev.map((v) => ({
        ...v,
        status:
          v.status === "ejected" || v.status === "slashed"
            ? v.status
            : v.id === proposer
            ? "proposing"
            : committee.includes(v.id)
            ? "attesting"
            : v.status,
      }))
    );

    attestTimerRef.current = setInterval(() => {
      if (idx >= committee.length) {
        clearInterval(attestTimerRef.current!);
        return;
      }
      const attesterId = committee[idx];
      idx++;
      setValidators((prev) =>
        prev.map((v) =>
          v.id === attesterId ? { ...v, status: "attested" } : v
        )
      );
      setVoteCount((c) => {
        const next = c + 1;
        if (next === ATTEST_THRESHOLD) addLog(`✓ 2/3 threshold reached — block finalized!`);
        return next;
      });
    }, 150);

    // Finalize after all voted
    setTimeout(
      () => {
        clearInterval(attestTimerRef.current!);
        finalize(proposer, committee);
      },
      committee.length * 150 + 400
    );
  }

  // ── Step 3: Finalize + rewards ────────────────────────────────────────────
  function finalize(proposer: number, committee: number[]) {
    setPhase("finalized");
    setBlockHeight((h) => h + 1);
    setEpochSlot((s) => (s + 1) % 32);
    setEpoch((e) => (epochSlot === 31 ? e + 1 : e));

    setValidators((prev) =>
      prev.map((v) => {
        if (v.status === "ejected" || v.status === "slashed") return v;
        if (v.id === proposer) {
          const r = PROPOSER_BONUS + ATTESTER_REWARD;
          return { ...v, rewards: v.rewards + r, status: "idle", blocks: v.blocks + 1 };
        }
        if (committee.includes(v.id)) {
          return { ...v, rewards: v.rewards + ATTESTER_REWARD, status: "idle" };
        }
        return { ...v, status: "idle" };
      })
    );

    const slotRewards = (committee.length * ATTESTER_REWARD + PROPOSER_BONUS).toFixed(4);
    setTotalRewards((t) => t + parseFloat(slotRewards));
    addLog(`Rewards distributed: ${slotRewards} ETH across ${committee.length + 1} validators`);
  }

  // ── Slashing flow ─────────────────────────────────────────────────────────
  function enterSlashMode() {
    addLog("Slash mode: click an active validator to simulate equivocation");
    setPhase("slash-pick");
  }

  function handleSlashPick(id: number) {
    if (phase !== "slash-pick") return;
    const v = validators.find((x) => x.id === id);
    if (!v || v.status === "ejected" || v.status === "slashed") return;
    setSlashTarget(id);
    addLog(`Validator #${id} submits conflicting attestations (equivocation)`);
    setPhase("slashing");
  }

  function onSlashDone() {
    const id = slashTarget!;
    setValidators((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, stake: v.stake - SLASH_AMOUNT, status: "ejected", rewards: v.rewards }
          : v
      )
    );
    addLog(`V#${id} ejected. ${SLASH_AMOUNT} ETH burned. Remaining stake returned after 36 days.`);
    setPhase("idle");
    setSlashTarget(null);
  }

  // Cleanup on unmount
  useEffect(() => () => clearTimers(), []);

  const activeValidators = validators.filter(
    (v) => v.status !== "ejected" && v.status !== "slashed"
  );
  const slashTargetV = slashTarget ? validators.find((v) => v.id === slashTarget) ?? null : null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-orange-400 font-mono text-sm uppercase tracking-widest">
          Proof of Stake — Live Consensus
        </h3>
        <button
          onClick={reset}
          className="text-zinc-500 hover:text-zinc-300 font-mono text-xs transition-colors"
        >
          reset
        </button>
      </div>

      {/* Network stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Demo validators",  value: `${activeValidators.length}/${N}`          },
          { label: "ETH staked (demo)", value: `${activeValidators.length * STAKE} ETH`  },
          { label: "Epoch / Slot",      value: `${epoch} / ${epochSlot}`                 },
          { label: "Rewards earned",    value: `${totalRewards.toFixed(3)} ETH`          },
        ].map(({ label, value }) => (
          <div key={label} className="bg-zinc-800 rounded p-2 text-center">
            <p className="text-zinc-500 font-mono text-xs">{label}</p>
            <p className="text-orange-400 font-mono text-xs font-bold mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-800/40 rounded p-2 font-mono text-xs text-zinc-500 text-center">
        This demo shows {N} validators. Real Ethereum has <span className="text-zinc-300">900,000+</span> validators
        staking <span className="text-zinc-300">30M+ ETH</span> (~$75B) as economic security.
      </div>

      {/* Block + attestation */}
      {phase !== "idle" && (
        <div className="grid grid-cols-2 gap-4">
          {proposerId && (
            <BlockVisual
              height={blockHeight + (phase === "finalized" ? 0 : 1)}
              proposer={proposerId}
              txCount={5 + (proposerId % 4)}
              phase={phase}
            />
          )}
          {(phase === "attesting" || phase === "finalized") && (
            <div className="space-y-3 flex flex-col justify-center">
              <AttestBar
                votes={voteCount}
                needed={ATTEST_THRESHOLD}
                total={activeValidators.length - 1}
              />
              <div className="space-y-1 font-mono text-xs text-zinc-500">
                <p><span className="text-blue-400">●</span> Attesting — validating block</p>
                <p><span className="text-green-400">●</span> Attested — vote cast ✓</p>
                <p><span className="text-orange-400">●</span> Proposing — block builder</p>
              </div>
            </div>
          )}
          {phase === "proposing" && (
            <div className="flex flex-col justify-center space-y-2">
              <p className="text-zinc-400 font-mono text-sm">
                Validator #{proposerId} is building the block:
              </p>
              <ul className="font-mono text-xs text-zinc-500 space-y-1">
                <li>· Collects pending transactions from mempool</li>
                <li>· Selects by fee (highest first)</li>
                <li>· Computes new state root</li>
                <li>· Signs block with their BLS key</li>
                <li>· Broadcasts to the network</li>
              </ul>
              <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slashing UI */}
      {phase === "slash-pick" && (
        <div className="bg-red-950/20 border border-red-800 rounded p-3 font-mono text-sm text-red-400">
          Click any <span className="font-bold">active validator</span> below to simulate it
          broadcasting two conflicting attestations (equivocation).
          The network will detect and slash it.
        </div>
      )}
      {phase === "slashing" && slashTargetV && (
        <SlashExplainer validator={slashTargetV} onDone={onSlashDone} />
      )}

      {/* Validator grid */}
      <div className="grid grid-cols-6 gap-2">
        {validators.map((v) => (
          <ValidatorCard
            key={v.id}
            v={v}
            clickable={phase === "slash-pick" && v.status !== "ejected" && v.status !== "slashed"}
            onClick={() => handleSlashPick(v.id)}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 font-mono text-xs text-zinc-500">
        {[
          { color: "bg-zinc-600",   label: "Staking (idle)"   },
          { color: "bg-yellow-400", label: "Proposer selected" },
          { color: "bg-orange-400", label: "Proposing block"   },
          { color: "bg-blue-400",   label: "Attesting…"        },
          { color: "bg-green-500",  label: "Attested ✓"        },
          { color: "bg-red-500",    label: "Slashed / Ejected" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Event log */}
      {log.length > 0 && (
        <div className="bg-zinc-950 rounded p-3 space-y-1 font-mono text-xs border border-zinc-800">
          {log.map((entry, i) => (
            <p key={i} className={i === 0 ? "text-zinc-200" : "text-zinc-600"}>
              {i === 0 ? "▶ " : "  "}{entry}
            </p>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={runSlot}
          disabled={phase === "selecting" || phase === "proposing" || phase === "attesting" || phase === "slashing"}
          className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono text-sm py-2.5 rounded transition-colors"
        >
          {phase === "selecting" ? "Selecting proposer…" :
           phase === "proposing" ? "Building block…" :
           phase === "attesting" ? "Collecting votes…" :
           phase === "finalized" ? "Run Next Slot →" :
           "Run Slot →"}
        </button>
        <button
          onClick={enterSlashMode}
          disabled={phase !== "idle" && phase !== "finalized"}
          className="bg-red-900 hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-red-300 font-mono text-sm px-4 py-2.5 rounded transition-colors"
        >
          Slash a Validator
        </button>
      </div>

      {/* Explainer box */}
      <div className="bg-zinc-800 rounded-lg p-4 space-y-2 border border-zinc-700">
        <p className="text-zinc-300 font-mono text-xs font-bold">How PoS security works</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-xs text-zinc-400">
          {[
            ["32 ETH minimum stake",          "Skin in the game — you lose it if you cheat"],
            ["RANDAO proposer selection",      "Pseudo-random, unpredictable, manipulation-resistant"],
            ["2/3 attestation threshold",      "No single party can finalize without super-majority"],
            ["Slashing for equivocation",      "Double-voting = provable, reported on-chain, punished"],
            ["Inactivity leak",                "Offline validators slowly lose stake — stay online or exit"],
            ["33% to disrupt / 66% to attack", "Attacker needs $15–30B ETH, which gets slashed on detection"],
          ].map(([term, desc]) => (
            <div key={term}>
              <p className="text-orange-400 font-bold">{term}</p>
              <p className="text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
