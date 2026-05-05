export interface SceneMeta {
  id: number;
  title: string;
  act: number;
  actTitle: string;
  hasDemo: boolean;
}

export const SCENES: SceneMeta[] = [
  // ACT 1 — SATOSHI'S PROBLEM
  { id: 1,  title: "The Crisis",                          act: 1, actTitle: "Satoshi's Problem",   hasDemo: false },
  { id: 2,  title: "The Whitepaper",                      act: 1, actTitle: "Satoshi's Problem",   hasDemo: false },
  { id: 3,  title: "The Fingerprint Problem",             act: 1, actTitle: "Satoshi's Problem",   hasDemo: true  },
  { id: 4,  title: "Creating a Wallet",                   act: 1, actTitle: "Satoshi's Problem",   hasDemo: true  },
  { id: 5,  title: "The Block Structure",                 act: 1, actTitle: "Satoshi's Problem",   hasDemo: true  },
  { id: 6,  title: "The Merkle Tree",                     act: 1, actTitle: "Satoshi's Problem",   hasDemo: true  },
  { id: 7,  title: "Mining the Genesis Block",            act: 1, actTitle: "Satoshi's Problem",   hasDemo: true  },
  // ACT 2 — YOU JOIN THE NETWORK
  { id: 8,  title: "Satoshi's Email",                     act: 2, actTitle: "You Join the Network", hasDemo: false },
  { id: 9,  title: "You Create Your Wallet",              act: 2, actTitle: "You Join the Network", hasDemo: true  },
  { id: 10, title: "Satoshi Sends You 10 BTC",            act: 2, actTitle: "You Join the Network", hasDemo: true  },
  { id: 11, title: "A Miner Picks Up Your Transaction",   act: 2, actTitle: "You Join the Network", hasDemo: false },
  { id: 12, title: "Why Changing the Past is Impossible", act: 2, actTitle: "You Join the Network", hasDemo: true  },
  // ACT 3 — THE NETWORK GROWS
  { id: 13, title: "More Nodes Join",                     act: 3, actTitle: "The Network Grows",    hasDemo: true  },
  { id: 14, title: "The Mempool Fills Up",                act: 3, actTitle: "The Network Grows",    hasDemo: true  },
  { id: 15, title: "Difficulty Adjusts",                  act: 3, actTitle: "The Network Grows",    hasDemo: true  },
  { id: 16, title: "The Halving",                         act: 3, actTitle: "The Network Grows",    hasDemo: true  },
  { id: 17, title: "The 51% Attack",                      act: 3, actTitle: "The Network Grows",    hasDemo: true  },
  { id: 18, title: "Full Nodes vs. Light Clients",        act: 3, actTitle: "The Network Grows",    hasDemo: false },
  // ACT 4 — BITCOIN MATURES
  { id: 19, title: "The First Real Purchase",             act: 4, actTitle: "Bitcoin Matures",      hasDemo: false },
  { id: 20, title: "Exchanges and Price Discovery",       act: 4, actTitle: "Bitcoin Matures",      hasDemo: false },
  { id: 21, title: "Mt. Gox and the Private Key Lesson",  act: 4, actTitle: "Bitcoin Matures",      hasDemo: false },
  // ACT 5 — VITALIK'S INSIGHT
  { id: 22, title: "Bitcoin's Limitation",                act: 5, actTitle: "Vitalik's Insight",    hasDemo: false },
  { id: 23, title: "Ethereum — A World Computer",         act: 5, actTitle: "Vitalik's Insight",    hasDemo: false },
  { id: 24, title: "Your First Smart Contract",           act: 5, actTitle: "Vitalik's Insight",    hasDemo: true  },
  { id: 25, title: "Gas — Why Computation Costs Money",   act: 5, actTitle: "Vitalik's Insight",    hasDemo: true  },
  { id: 26, title: "ERC-20 Tokens",                       act: 5, actTitle: "Vitalik's Insight",    hasDemo: true  },
  // ACT 6 — DEFI
  { id: 27, title: "The Problem with Centralized Exchanges", act: 6, actTitle: "DeFi",              hasDemo: false },
  { id: 28, title: "The AMM — Automated Market Maker",    act: 6, actTitle: "DeFi",                 hasDemo: true  },
  { id: 29, title: "Lending and Borrowing",               act: 6, actTitle: "DeFi",                 hasDemo: true  },
  { id: 30, title: "Oracles — The Real World Problem",    act: 6, actTitle: "DeFi",                 hasDemo: false },
  { id: 31, title: "DAOs — Organizations Without Bosses", act: 6, actTitle: "DeFi",                 hasDemo: false },
  // ACT 7 — SCALING
  { id: 32, title: "The Blockchain Trilemma",             act: 7, actTitle: "Scaling",              hasDemo: true  },
  { id: 33, title: "Bitcoin's Lightning Network",         act: 7, actTitle: "Scaling",              hasDemo: true  },
  { id: 34, title: "Ethereum's Rollups",                  act: 7, actTitle: "Scaling",              hasDemo: false },
  { id: 35, title: "Bridges — Moving Between Chains",     act: 7, actTitle: "Scaling",              hasDemo: false },
  { id: 36, title: "Where We Are (So Far)",               act: 7, actTitle: "Scaling",              hasDemo: false },
  // ACT 8 — THE BROADER ECOSYSTEM
  { id: 37, title: "Ethereum Classic — Two Chains, One History", act: 8, actTitle: "The Broader Ecosystem", hasDemo: true  },
  { id: 38, title: "Stablecoins — Pegging to the Dollar",        act: 8, actTitle: "The Broader Ecosystem", hasDemo: false },
  { id: 39, title: "The ICO Era",                                act: 8, actTitle: "The Broader Ecosystem", hasDemo: false },
  { id: 40, title: "DeFi Summer — Yield Farming",                act: 8, actTitle: "The Broader Ecosystem", hasDemo: true  },
  { id: 41, title: "Flash Loans — One Block, No Collateral",     act: 8, actTitle: "The Broader Ecosystem", hasDemo: true  },
  { id: 42, title: "NFTs and Digital Ownership",                 act: 8, actTitle: "The Broader Ecosystem", hasDemo: true  },
  { id: 43, title: "Meme Coins — The Social Layer",              act: 8, actTitle: "The Broader Ecosystem", hasDemo: false },
  { id: 44, title: "Sidechains — A Different Tradeoff",          act: 8, actTitle: "The Broader Ecosystem", hasDemo: false },
  { id: 45, title: "The Merge — Ethereum Goes Proof of Stake",   act: 8, actTitle: "The Broader Ecosystem", hasDemo: true  },
  { id: 46, title: "Bank Coins and CBDCs",                       act: 8, actTitle: "The Broader Ecosystem", hasDemo: false },
  { id: 47, title: "The Full Picture",                           act: 8, actTitle: "The Broader Ecosystem", hasDemo: false },
];

export const TOTAL_SCENES = SCENES.length;
export const MVP_SCENES = 12; // Acts 1–2: the shippable Bitcoin mental model

export function getScene(id: number): SceneMeta | undefined {
  return SCENES.find((s) => s.id === id);
}

export function getProgressKey() {
  return "blockchain-story-progress";
}

export function loadProgress(): number {
  if (typeof window === "undefined") return 1;
  const raw = localStorage.getItem(getProgressKey());
  const parsed = raw ? parseInt(raw, 10) : 1;
  return isNaN(parsed) ? 1 : Math.min(Math.max(parsed, 1), TOTAL_SCENES);
}

export function saveProgress(sceneId: number) {
  if (typeof window === "undefined") return;
  const current = loadProgress();
  if (sceneId > current) {
    localStorage.setItem(getProgressKey(), String(sceneId));
  }
}

export function resetProgress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getProgressKey());
}
