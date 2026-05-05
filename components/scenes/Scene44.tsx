"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene44() {
  return (
    <SceneLayout sceneId={44}>
      <Narrator>
        We've covered L2 rollups — chains that execute transactions and post proofs
        back to Ethereum mainnet, inheriting its security. Sidechains are a different
        architecture, and often confused with L2s. The distinction matters.
        A sidechain is an independent blockchain that runs alongside a main chain,
        connected by a bridge. It has its own validators and its own consensus.
        It does NOT inherit the security of the main chain. If the sidechain's
        validators collude, they can steal funds. The main chain can't stop them.
      </Narrator>
      <Narrator>
        Polygon PoS (the original "Polygon," now called Polygon PoS) is technically
        a sidechain: it has ~100 validators staking MATIC tokens, and checkpoints
        to Ethereum every 30 minutes — but the security between checkpoints depends
        entirely on those 100 validators, not Ethereum's 900,000+ validators.
        Gnosis Chain (formerly xDai): 5-second blocks, stable gas in XDAI,
        its own validator set. Both are fast and cheap because they sacrifice
        Ethereum's security guarantees.
      </Narrator>
      <Narrator>
        The practical tradeoff: if the sidechain has a small validator set,
        collusion or takeover is cheaper than attacking Ethereum. A $100M attack
        on a sidechain might cost $2M in stake. The same attack on Ethereum
        would require $15+ billion in ETH. That's why Polygon is pivoting its
        architecture to Polygon zkEVM — a true ZK rollup that inherits Ethereum security.
        "Sidechain" was the fast path. "L2" is the secure path. The industry is
        slowly migrating everything toward the secure path.
      </Narrator>
      <Narrator>
        One legitimate use case for sidechains: gaming and applications with
        different security requirements. A game where virtual items are traded
        doesn't need Ethereum-level security. A fast, cheap sidechain with
        reasonable security is fine for low-value transactions. The key is
        understanding what security model you're actually relying on —
        and making sure the value at risk is proportionate to the security you're paying for.
      </Narrator>
      <SceneAdvance to={45} />
    </SceneLayout>
  );
}
