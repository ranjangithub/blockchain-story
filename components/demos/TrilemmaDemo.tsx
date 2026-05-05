"use client";
import { useState } from "react";

type Chain = {
  name: string;
  security: number;
  decentralization: number;
  scalability: number;
  description: string;
  color: string;
};

const CHAINS: Chain[] = [
  {
    name: "Bitcoin",
    security: 95,
    decentralization: 90,
    scalability: 10,
    description: "~7 TPS. Maximum security and decentralization. Scalability sacrificed.",
    color: "#f97316",
  },
  {
    name: "Ethereum",
    security: 90,
    decentralization: 75,
    scalability: 20,
    description: "~15 TPS on L1. Strong security + decentralization. L2s solve scalability.",
    color: "#8b5cf6",
  },
  {
    name: "Solana",
    security: 70,
    decentralization: 45,
    scalability: 85,
    description: "~65,000 TPS theoretical. High throughput, fewer validators, more centralized.",
    color: "#06b6d4",
  },
  {
    name: "BNB Chain",
    security: 75,
    decentralization: 30,
    scalability: 75,
    description: "~160 TPS. 21 validators controlled by Binance. Fast but centralized.",
    color: "#eab308",
  },
  {
    name: "Ethereum L2",
    security: 88,
    decentralization: 65,
    scalability: 80,
    description:
      "~2000+ TPS. Inherits Ethereum security. Still maturing in decentralization.",
    color: "#22c55e",
  },
];

function Bar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between font-mono text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="text-zinc-300">{value}/100</span>
      </div>
      <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function TrilemmaDemo() {
  const [selected, setSelected] = useState(0);
  const chain = CHAINS[selected];
  const sum = chain.security + chain.decentralization + chain.scalability;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6 space-y-6">
      <h3 className="text-orange-400 font-mono text-sm uppercase tracking-widest">
        The Blockchain Trilemma
      </h3>

      {/* Triangle visualization */}
      <div className="relative flex justify-center">
        <svg viewBox="0 0 260 230" className="w-64 h-56">
          {/* Triangle outline */}
          <polygon
            points="130,20 20,210 240,210"
            fill="none"
            stroke="#3f3f46"
            strokeWidth="2"
          />
          {/* Filled triangle based on values */}
          <polygon
            points={`130,${20 + (1 - chain.security / 100) * 130} ${
              20 + (1 - chain.decentralization / 100) * 80
            },${210 - (1 - chain.decentralization / 100) * 20} ${
              240 - (1 - chain.scalability / 100) * 80
            },${210 - (1 - chain.scalability / 100) * 20}`}
            fill={chain.color}
            fillOpacity="0.25"
            stroke={chain.color}
            strokeWidth="2"
          />
          {/* Labels */}
          <text x="130" y="14" textAnchor="middle" className="fill-zinc-300" fontSize="11" fontFamily="monospace">
            Security
          </text>
          <text x="8" y="225" textAnchor="start" className="fill-zinc-300" fontSize="11" fontFamily="monospace">
            Decentral.
          </text>
          <text x="252" y="225" textAnchor="end" className="fill-zinc-300" fontSize="11" fontFamily="monospace">
            Scalability
          </text>
        </svg>
      </div>

      {/* Chain selector */}
      <div className="grid grid-cols-5 gap-1">
        {CHAINS.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setSelected(i)}
            className={`py-2 px-1 rounded font-mono text-xs text-center transition-all ${
              selected === i
                ? "text-white font-bold"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
            style={selected === i ? { backgroundColor: c.color } : {}}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Bars */}
      <div className="space-y-3">
        <Bar label="Security" value={chain.security} color={chain.color} />
        <Bar label="Decentralization" value={chain.decentralization} color={chain.color} />
        <Bar label="Scalability" value={chain.scalability} color={chain.color} />
      </div>

      {/* Sum indicator */}
      <div className="bg-zinc-800 rounded p-3 flex justify-between items-center">
        <span className="text-zinc-400 font-mono text-xs">Property sum</span>
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(sum / 300) * 100}%`,
                backgroundColor: chain.color,
              }}
            />
          </div>
          <span className="text-zinc-300 font-mono text-xs">{sum}/300</span>
        </div>
      </div>

      <p className="text-zinc-500 font-mono text-xs italic">{chain.description}</p>

      <p className="text-zinc-600 text-xs font-mono border-t border-zinc-800 pt-4">
        No chain scores above ~200/300. The trilemma says you can maximize any two properties,
        but the third suffers. L2 rollups are the current best attempt to escape the constraint.
      </p>
    </div>
  );
}
