"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene34() {
  return (
    <SceneLayout sceneId={34}>
      <Narrator>
        Ethereum's approach to scaling is different from Lightning, and in some ways
        more ambitious. Instead of payment channels between pairs of users, Ethereum
        uses rollups: a separate execution environment that processes hundreds or
        thousands of transactions, then posts a compressed summary and a proof
        back to Ethereum mainnet. The mainnet verifies the proof. The computation
        stays off-chain. The security stays on-chain.
      </Narrator>
      <Narrator>
        There are two kinds of rollups. Optimistic rollups — Arbitrum and Optimism —
        assume transactions are valid unless challenged. They post transaction data and
        wait a 7-day fraud window. If someone detects fraud, they submit a fraud proof.
        Otherwise, it's final. Fast to deploy, proven at scale, slightly slower finality.
      </Narrator>
      <Narrator>
        ZK rollups — zkSync, StarkNet, Polygon zkEVM — use zero-knowledge proofs.
        A mathematical proof accompanies every batch that cryptographically guarantees
        every transaction was valid, without revealing their contents. No fraud window —
        the proof is instant verification. The tradeoff: generating ZK proofs requires
        significant computation. The hardware is specialized, the math is complex,
        and EVM compatibility took years to achieve.
      </Narrator>
      <Narrator>
        By 2024, Arbitrum alone processes more transactions per day than Ethereum mainnet.
        Gas fees on L2 are 10–100x cheaper. The same Ethereum smart contracts, the same
        wallet addresses, the same tokens — just faster and cheaper, secured by the same
        30 million ETH locked in validators underneath. The trilemma isn't solved.
        It's being navigated, one layer at a time.
      </Narrator>
      <SceneAdvance to={35} />
    </SceneLayout>
  );
}
