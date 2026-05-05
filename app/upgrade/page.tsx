import Link from "next/link";

const PAID_ACTS = [
  {
    act: 3,
    title: "The Network Grows",
    scenes: ["Full Nodes vs Light Clients", "The First Real Purchase", "Exchanges and Price Discovery", "Mt. Gox and the Private Key Lesson"],
  },
  {
    act: 4,
    title: "Bitcoin Matures",
    scenes: ["Bitcoin's Limitation", "Ethereum — A World Computer", "Your First Smart Contract", "Gas — Why Computation Costs Money", "ERC-20 Tokens"],
  },
  {
    act: 5,
    title: "Vitalik's Insight",
    scenes: ["The Problem with Centralized Exchanges", "The AMM — Automated Market Maker", "Lending and Borrowing", "Oracles", "DAOs"],
  },
  {
    act: 6,
    title: "DeFi",
    scenes: ["The Blockchain Trilemma", "Bitcoin's Lightning Network", "Ethereum's Rollups", "Bridges", "Where We Are (So Far)"],
  },
  {
    act: 7,
    title: "Scaling",
    scenes: ["Ethereum Classic", "Stablecoins", "The ICO Era", "DeFi Summer — Yield Farming", "Flash Loans", "NFTs", "The Merge"],
  },
  {
    act: 8,
    title: "The Broader Ecosystem",
    scenes: ["Meme Coins", "Sidechains", "Bank Coins and CBDCs", "The Full Picture"],
  },
];

const GUMROAD_URL = process.env.NEXT_PUBLIC_GUMROAD_URL ?? "#";

export default function UpgradePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#09090b", color: "#f4f4f5", fontFamily: "ui-monospace, 'Cascadia Code', monospace", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* Nav */}
      <div style={{ width: "100%", maxWidth: 760, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #27272a" }}>
        <Link href="/" style={{ color: "#f59e0b", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          ← Blockchain Story
        </Link>
        <span style={{ color: "#52525b", fontSize: 11 }}>Scene 18 – 47</span>
      </div>

      <div style={{ maxWidth: 680, width: "100%", padding: "48px 24px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ color: "#f59e0b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
            You've reached the end of the free content
          </div>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
            The story continues through<br />Act 4 → 8
          </h1>
          <p style={{ color: "#71717a", fontSize: 14, lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
            You've seen Bitcoin born and survive a 51% attack. Now: Ethereum, DeFi, smart contracts, AMMs, flash loans, NFTs, and how it all connects.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "#27272a", border: "1px solid #27272a", borderRadius: 12, overflow: "hidden", marginBottom: 40 }}>
          {[["30", "More scenes"], ["18", "Interactive demos"], ["5", "More acts"]].map(([val, label]) => (
            <div key={label} style={{ background: "#18181b", padding: "20px 16px", textAlign: "center" }}>
              <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 28 }}>{val}</div>
              <div style={{ color: "#52525b", fontSize: 11, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: "#1c1400", border: "1px solid #78350f", borderRadius: 12, padding: "28px 24px", marginBottom: 40, textAlign: "center" }}>
          <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
            Full Course — $79
          </div>
          <div style={{ color: "#a16207", fontSize: 13, marginBottom: 24 }}>
            One-time payment. Access forever. No subscription.
          </div>
          <a
            href={GUMROAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#f59e0b", color: "#09090b", fontWeight: 700, fontSize: 14, padding: "12px 32px", borderRadius: 8, textDecoration: "none", cursor: "pointer" }}
          >
            Unlock the full course →
          </a>
          <div style={{ color: "#52525b", fontSize: 11, marginTop: 16 }}>
            After purchase you'll receive an access link by email.
          </div>
        </div>

        {/* What's included */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ color: "#52525b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 20 }}>
            What's included
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PAID_ACTS.map((act) => (
              <div key={act.act} style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
                  Act {act.act} — {act.title}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {act.scenes.map((scene) => (
                    <span key={scene} style={{ fontSize: 11, color: "#71717a", background: "#09090b", border: "1px solid #27272a", borderRadius: 4, padding: "2px 8px" }}>
                      {scene}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Already purchased */}
        <div style={{ textAlign: "center", color: "#52525b", fontSize: 12 }}>
          Already purchased?{" "}
          <span style={{ color: "#71717a" }}>
            Check your email for the access link, or{" "}
            <a href="mailto:ranjanemail@gmail.com" style={{ color: "#f59e0b", textDecoration: "none" }}>
              contact support
            </a>
            .
          </span>
        </div>
      </div>
    </div>
  );
}
