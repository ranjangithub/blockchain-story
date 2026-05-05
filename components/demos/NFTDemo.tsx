"use client";
import { useState, useEffect } from "react";

// ─── BAYC IPFS constants ───────────────────────────────────────────────────────
const BAYC_CONTRACT    = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
const METADATA_CID     = "QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq";

// Multiple gateways — first one to respond wins (tried in order)
const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs",
  "https://cloudflare-ipfs.com/ipfs",
  "https://gateway.pinata.cloud/ipfs",
];

const FEATURED = [
  { id: 1,    note: "Token #1"         },
  { id: 42,   note: "Token #42"        },
  { id: 100,  note: "Token #100"       },
  { id: 1000, note: "Token #1000"      },
  { id: 3749, note: "Token #3749"      },
  { id: 8817, note: "$3.4M sale (2021)" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Trait = { trait_type: string; value: string };
type TokenData = {
  id: number;
  imageUrl: string | null;
  name: string | null;
  traits: Trait[];
  loading: boolean;
  error: boolean;
};

// ─── ERC standard data ────────────────────────────────────────────────────────
const ERC20_FNS = [
  { name: "totalSupply()",                      desc: "How many tokens exist in total"           },
  { name: "balanceOf(address owner)",            desc: "How many tokens an address holds"         },
  { name: "transfer(address to, uint amount)",   desc: "Send tokens from caller to someone"       },
  { name: "transferFrom(address from, to, amt)", desc: "Move tokens on behalf of another"         },
  { name: "approve(address spender, uint amt)",  desc: "Allow another address to spend your tokens" },
  { name: "allowance(address owner, spender)",   desc: "Check how much a spender is allowed"      },
];

const ERC721_FNS = [
  { name: "balanceOf(address owner)",                    desc: "How many NFTs this address owns", isNew: false },
  { name: "ownerOf(uint256 tokenId)",                    desc: "Who owns a specific token ID",    isNew: true  },
  { name: "transferFrom(address from, to, tokenId)",     desc: "Transfer a specific token",       isNew: false },
  { name: "safeTransferFrom(from, to, tokenId)",         desc: "Transfer — checks recipient can handle NFTs", isNew: true },
  { name: "approve(address to, uint256 tokenId)",        desc: "Approve someone to move one specific NFT",    isNew: true },
  { name: "setApprovalForAll(address op, bool approved)","desc": "Approve operator for ALL your NFTs",        isNew: true },
  { name: "getApproved(uint256 tokenId)",                desc: "Who is approved to move this specific NFT",   isNew: true },
  { name: "isApprovedForAll(address owner, operator)",   desc: "Is this operator approved for all?",          isNew: true },
  { name: "tokenURI(uint256 tokenId)",                   desc: "Returns metadata URL → IPFS → image + traits", isNew: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shortAddr(addr: string) {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

function ipfsToHttp(uri: string, gateway = IPFS_GATEWAYS[0]) {
  if (uri.startsWith("ipfs://")) return `${gateway}/${uri.slice(7)}`;
  if (uri.startsWith("https://")) return uri;
  return `${gateway}/${uri}`;
}

// Fetch metadata for a token, trying gateways in order
async function fetchMetadata(tokenId: number): Promise<{ imageUrl: string; name: string; traits: Trait[] }> {
  for (const gw of IPFS_GATEWAYS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(`${gw}/${METADATA_CID}/${tokenId}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) continue;
      const data = await res.json();
      const imageUrl = ipfsToHttp(data.image ?? "", gw);
      return {
        imageUrl,
        name: data.name ?? `Bored Ape #${tokenId}`,
        traits: data.attributes ?? [],
      };
    } catch {
      // try next gateway
    }
  }
  throw new Error("All gateways failed");
}

// ─── Fallback SVG ape ─────────────────────────────────────────────────────────
function ApeArt({ id }: { id: number }) {
  const hue = (id * 37) % 360;
  const bgHue = (id * 73 + 120) % 360;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill={`hsl(${bgHue},40%,20%)`} />
      {/* Body */}
      <ellipse cx="50" cy="75" rx="28" ry="20" fill={`hsl(${hue},50%,35%)`} />
      {/* Head */}
      <ellipse cx="50" cy="48" rx="22" ry="20" fill={`hsl(${hue},50%,40%)`} />
      {/* Ears */}
      <ellipse cx="28" cy="50" rx="7" ry="9" fill={`hsl(${hue},50%,40%)`} />
      <ellipse cx="72" cy="50" rx="7" ry="9" fill={`hsl(${hue},50%,40%)`} />
      {/* Eyes */}
      <circle cx="42" cy="46" r="4" fill="white" />
      <circle cx="58" cy="46" r="4" fill="white" />
      <circle cx={(id % 3) + 41} cy="46" r="2" fill="#1a1a2e" />
      <circle cx={(id % 3) + 57} cy="46" r="2" fill="#1a1a2e" />
      {/* Mouth */}
      <path d="M40,58 Q50,65 60,58" stroke={`hsl(${hue},60%,60%)`} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <ellipse cx="50" cy="54" rx="5" ry="3" fill={`hsl(${hue},45%,30%)`} />
      {/* Bored expression detail */}
      <line x1="38" y1="42" x2="44" y2="40" stroke={`hsl(${hue},60%,25%)`} strokeWidth="1.5" />
      <line x1="62" y1="42" x2="56" y2="40" stroke={`hsl(${hue},60%,25%)`} strokeWidth="1.5" />
    </svg>
  );
}

// ─── Token card ───────────────────────────────────────────────────────────────
function TokenCard({ token, note }: { token: TokenData; note: string }) {
  const [flipped, setFlipped] = useState(false);
  const ownerAddr = `0x${((token.id * 0xdeadbeef) >>> 0).toString(16).padStart(8, "0")}...1f3b`;

  return (
    <div
      className="relative cursor-pointer group"
      onClick={() => !token.loading && setFlipped((f) => !f)}
      title={token.loading ? "Loading…" : "Click to see traits"}
    >
      <div className={`transition-all duration-500 ${flipped ? "[transform:rotateY(180deg)]" : ""} [transform-style:preserve-3d] relative aspect-square`}>

        {/* Front — image */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800">
          {token.loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-zinc-800">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-zinc-500 font-mono text-xs">Fetching from IPFS…</p>
            </div>
          ) : token.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={token.imageUrl}
              alt={token.name ?? `Bored Ape #${token.id}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          {/* Fallback SVG shown if img fails or error */}
          <div className={token.error || (!token.loading && !token.imageUrl) ? "" : "hidden"}>
            <ApeArt id={token.id} />
          </div>

          {/* Badge */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2">
            <p className="text-white font-mono text-xs font-bold">#{token.id}</p>
            {note && <p className="text-orange-400 font-mono text-xs">{note}</p>}
          </div>

          {/* Flip hint */}
          {!token.loading && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded px-1.5 py-0.5">
              <p className="text-zinc-300 font-mono text-xs">traits →</p>
            </div>
          )}
        </div>

        {/* Back — traits */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg border border-orange-700 bg-zinc-900 p-3 overflow-y-auto">
          <p className="text-orange-400 font-mono text-xs font-bold mb-2">
            {token.name ?? `Bored Ape #${token.id}`}
          </p>
          <div className="space-y-1 mb-2">
            {token.traits.slice(0, 8).map((t) => (
              <div key={t.trait_type} className="flex justify-between gap-1">
                <span className="text-zinc-500 font-mono text-xs truncate">{t.trait_type}</span>
                <span className="text-zinc-300 font-mono text-xs truncate">{t.value}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-700 pt-2 space-y-0.5">
            <p className="text-zinc-600 font-mono text-xs">ownerOf({token.id})</p>
            <p className="text-green-400 font-mono text-xs truncate">{ownerAddr}</p>
          </div>
          <p className="text-zinc-600 font-mono text-xs mt-2 italic">click to flip back</p>
        </div>
      </div>
    </div>
  );
}

// ─── Ownership chain diagram ───────────────────────────────────────────────────
function OwnershipChain() {
  const steps = [
    {
      label: "Token ID",
      value: "#8817",
      color: "text-orange-400",
      detail: "A uint256 — just a number from 1 to 10,000",
    },
    {
      label: "ownerOf(8817)",
      value: "0x1919...f7a2",
      color: "text-purple-400",
      detail: "On-chain: mapping(uint256 → address) in the contract",
    },
    {
      label: "tokenURI(8817)",
      value: "ipfs://QmeSj.../8817",
      color: "text-blue-400",
      detail: "Points to a JSON metadata file stored on IPFS",
    },
    {
      label: "IPFS metadata",
      value: '{ "image": "ipfs://QmRR.../8817.png", "attributes": [...] }',
      color: "text-green-400",
      detail: "JSON file: image link + trait list. NOT on the blockchain.",
    },
    {
      label: "Image file",
      value: "8817.png (IPFS)",
      color: "text-yellow-400",
      detail: "The actual pixel data. If IPFS pin is lost, image disappears. The blockchain entry remains.",
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-zinc-400 font-mono text-sm">
        Follow exactly what you own when you own BAYC #8817 — the ape that sold for $3.4M:
      </p>
      {steps.map((s, i) => (
        <div key={s.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center font-mono text-xs text-zinc-400 flex-shrink-0">
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-px flex-1 bg-zinc-700 mt-1" />}
          </div>
          <div className="pb-4 flex-1">
            <div className="flex flex-wrap items-baseline gap-2 mb-1">
              <span className="text-zinc-500 font-mono text-xs">{s.label}</span>
              <span className="font-mono text-xs font-bold truncate max-w-full">
                <span className={s.color}>{s.value}</span>
              </span>
            </div>
            <p className="text-zinc-600 font-mono text-xs">{s.detail}</p>
          </div>
        </div>
      ))}
      <div className="bg-zinc-800 rounded p-3 border border-zinc-700">
        <p className="text-zinc-400 font-mono text-xs">
          <span className="text-orange-400 font-bold">What you actually own: </span>
          Steps 1–2 live on Ethereum forever. Steps 3–5 live on IPFS —
          permanent only if someone keeps pinning the files.
          The "right-click save" argument misses the point: you can copy the pixels,
          not the blockchain entry. The entry is what has social and financial value.
        </p>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function NFTDemo() {
  const [tab, setTab] = useState<"standard" | "gallery" | "chain">("standard");
  const [tokens, setTokens] = useState<TokenData[]>(
    FEATURED.map(({ id }) => ({ id, imageUrl: null, name: null, traits: [], loading: false, error: false }))
  );
  const [galleryLoaded, setGalleryLoaded] = useState(false);

  // Load all token metadata when gallery tab first opened
  useEffect(() => {
    if (tab !== "gallery" || galleryLoaded) return;
    setGalleryLoaded(true);

    FEATURED.forEach(({ id }, idx) => {
      setTokens((prev) =>
        prev.map((t, i) => (i === idx ? { ...t, loading: true } : t))
      );
      fetchMetadata(id)
        .then(({ imageUrl, name, traits }) => {
          setTokens((prev) =>
            prev.map((t, i) =>
              i === idx ? { ...t, imageUrl, name, traits, loading: false } : t
            )
          );
        })
        .catch(() => {
          setTokens((prev) =>
            prev.map((t, i) =>
              i === idx ? { ...t, loading: false, error: true } : t
            )
          );
        });
    });
  }, [tab, galleryLoaded]);

  const TABS: { key: typeof tab; label: string }[] = [
    { key: "standard", label: "ERC Standard" },
    { key: "gallery",  label: "BAYC Gallery"  },
    { key: "chain",    label: "Ownership Chain" },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-6 space-y-5">
      <h3 className="text-orange-400 font-mono text-sm uppercase tracking-widest">
        NFTs &amp; ERC-721
      </h3>

      {/* Tab bar */}
      <div className="flex gap-1 bg-zinc-800 rounded-lg p-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded font-mono text-xs transition-all ${
              tab === key
                ? "bg-orange-600 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: ERC Standard ───────────────────────────────────────────── */}
      {tab === "standard" && (
        <div className="space-y-5">
          {/* ERC vs EIP explainer */}
          <div className="bg-zinc-800 rounded-lg p-4 space-y-2">
            <p className="text-zinc-200 font-mono text-sm font-bold">What does "ERC" mean?</p>
            <p className="text-zinc-400 font-mono text-xs leading-relaxed">
              <span className="text-orange-400">ERC = Ethereum Request for Comment.</span>{" "}
              Modeled after the IETF&apos;s RFC process (which standardized the internet&apos;s protocols),
              an ERC is a community-proposed technical standard for Ethereum.
              Anyone can write one. They live as GitHub issues in the{" "}
              <span className="text-zinc-300">ethereum/EIPs</span> repository.
              The community reviews, discusses, and either adopts or rejects them.
              ERCs are a subcategory of{" "}
              <span className="text-orange-400">EIPs (Ethereum Improvement Proposals)</span> —
              ERCs specifically define application-level standards like token interfaces.
            </p>
          </div>

          {/* ERC-20 vs ERC-721 */}
          <div className="grid grid-cols-2 gap-4">
            {/* ERC-20 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-900/50 text-blue-400 font-mono text-xs px-2 py-0.5 rounded">ERC-20</span>
                <span className="text-zinc-500 font-mono text-xs">Fungible · 2015</span>
              </div>
              <p className="text-zinc-500 font-mono text-xs">
                mapping(address → uint256) — tracks balance per owner
              </p>
              {ERC20_FNS.map((fn) => (
                <div key={fn.name} className="bg-zinc-800 rounded px-3 py-2">
                  <p className="text-blue-300 font-mono text-xs">{fn.name}</p>
                  <p className="text-zinc-500 font-mono text-xs mt-0.5">{fn.desc}</p>
                </div>
              ))}
            </div>

            {/* ERC-721 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-orange-900/50 text-orange-400 font-mono text-xs px-2 py-0.5 rounded">ERC-721</span>
                <span className="text-zinc-500 font-mono text-xs">Non-Fungible · Jan 2018</span>
              </div>
              <p className="text-zinc-500 font-mono text-xs">
                mapping(uint256 → address) — tracks owner per tokenId
              </p>
              {ERC721_FNS.map((fn) => (
                <div
                  key={fn.name}
                  className={`rounded px-3 py-2 ${
                    fn.isNew ? "bg-orange-900/20 border border-orange-800/50" : "bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <p className={`font-mono text-xs ${fn.isNew ? "text-orange-300" : "text-zinc-300"}`}>
                      {fn.name}
                    </p>
                    {fn.isNew && (
                      <span className="text-orange-500 font-mono text-xs">✦</span>
                    )}
                  </div>
                  <p className="text-zinc-500 font-mono text-xs mt-0.5">{fn.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-zinc-600 font-mono text-xs border-t border-zinc-800 pt-3">
            ✦ = functions unique to ERC-721 that ERC-20 doesn&apos;t have.
            The critical addition: <span className="text-orange-400">ownerOf(tokenId)</span> and{" "}
            <span className="text-orange-400">tokenURI(tokenId)</span>.
          </p>

          {/* History */}
          <div className="space-y-2">
            <p className="text-zinc-400 font-mono text-xs font-bold uppercase tracking-widest">How ERC-721 came to exist</p>
            {[
              { date: "Nov 2015", event: "ERC-20 proposed by Fabian Vogelsteller — the fungible token standard" },
              { date: "Dec 2017", event: "CryptoKitties launches — NFT concept proved viable, crashes Ethereum network" },
              { date: "Jan 2018", event: "ERC-721 formally proposed by William Entriken, Dieter Shirley, Jacob Evans, Nastassia Sachs — standardizing what CryptoKitties had built" },
              { date: "Jun 2018", event: "ERC-721 finalized as an official Ethereum standard" },
              { date: "Jun 2021", event: "NFT mania peaks — Bored Ape Yacht Club sells out at 0.08 ETH each ($190)" },
              { date: "Mar 2021", event: "Beeple's 'Everydays' sells at Christie's for $69M — Old Masters auction house settles in ETH" },
            ].map(({ date, event }) => (
              <div key={date} className="flex gap-3">
                <span className="text-orange-400 font-mono text-xs w-20 flex-shrink-0">{date}</span>
                <span className="text-zinc-400 font-mono text-xs">{event}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: BAYC Gallery ───────────────────────────────────────────── */}
      {tab === "gallery" && (
        <div className="space-y-4">
          <div className="bg-zinc-800 rounded p-3 font-mono text-xs space-y-1">
            <p className="text-zinc-400">
              <span className="text-orange-400 font-bold">Contract: </span>
              <span className="text-zinc-300 break-all">{BAYC_CONTRACT}</span>
            </p>
            <p className="text-zinc-400">
              <span className="text-orange-400 font-bold">Total supply: </span>
              <span className="text-zinc-300">10,000 tokens</span>
            </p>
            <p className="text-zinc-400">
              <span className="text-orange-400 font-bold">Metadata: </span>
              <span className="text-zinc-300 break-all">ipfs://{METADATA_CID}/{"<tokenId>"}</span>
            </p>
          </div>
          <p className="text-zinc-500 font-mono text-xs">
            Images load from IPFS in real time. Click any ape to see its on-chain traits.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {tokens.map((token, i) => (
              <TokenCard key={token.id} token={token} note={FEATURED[i].note} />
            ))}
          </div>

          <p className="text-zinc-600 font-mono text-xs border-t border-zinc-800 pt-3">
            Traits come from the IPFS metadata JSON. Rarer trait combinations = higher market value.
            BAYC #8817 (bottom-right) sold for 852 ETH (~$3.4M) in October 2021.
          </p>
        </div>
      )}

      {/* ── Tab: Ownership Chain ────────────────────────────────────────── */}
      {tab === "chain" && <OwnershipChain />}
    </div>
  );
}
