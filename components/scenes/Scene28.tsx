"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import AMMDemo from "@/components/demos/AMMDemo";

export default function Scene28() {
  return (
    <SceneLayout sceneId={28}>
      <Narrator>
        Uniswap's insight: instead of matching buyers with sellers, pool their liquidity
        together. Two assets go into a pool. The pool's price is defined by a single equation:
        x × y = k. X is the amount of token A in the pool. Y is the amount of token B.
        K is a constant that never changes. When you buy token A, you add token B to the pool.
        The pool rebalances. The price adjusts. No counterparty needed.
      </Narrator>
      <Narrator>
        Liquidity providers deposit equal values of both tokens and receive LP tokens representing
        their share of the pool. They earn a cut of every trade that flows through. In return,
        they accept impermanent loss — if prices diverge significantly, they'd have been
        better off just holding both tokens separately. The math is real; so is the risk.
      </Narrator>
      <AMMDemo />
      <Narrator>
        By 2021, Uniswap processes more daily trading volume than Coinbase. There's no company running it.
        The contracts are deployed, immutable, ownerless. Anyone can provide liquidity.
        Anyone can trade. The fee goes directly to liquidity providers via the contract.
        This is decentralized finance working as designed: programmable money, no gatekeepers.
      </Narrator>
      <SceneAdvance to={29} />
    </SceneLayout>
  );
}
