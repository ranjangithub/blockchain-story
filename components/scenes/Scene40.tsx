"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import YieldFarmingDemo from "@/components/demos/YieldFarmingDemo";

export default function Scene40() {
  return (
    <SceneLayout sceneId={40}>
      <Narrator>
        June 2020. Compound Finance, a lending protocol, makes a decision: distribute COMP
        governance tokens to users who supply or borrow on the platform. Every block,
        COMP flows to users proportional to their activity. Suddenly, lending and borrowing
        on Compound isn't just useful — it's profitable in a third way. You earn interest,
        you pay interest, and you receive COMP on top of both.
      </Narrator>
      <Narrator>
        This is liquidity mining, also called yield farming. The insight: DeFi protocols
        need users. Users bring liquidity. Liquidity makes the protocol work.
        So give users ownership — tokens — in proportion to their contribution.
        The protocol bootstraps itself by distributing future governance rights
        to the people who make it useful today. Within weeks, every major DeFi protocol
        copies the model. Synthetix, Balancer, Curve, Yearn, SushiSwap all launch token
        distributions. Total Value Locked in DeFi: $1 billion in June 2020.
        $15 billion by September. $80 billion by May 2021.
      </Narrator>
      <YieldFarmingDemo />
      <Narrator>
        The yields looked insane — triple-digit APYs printed daily in news headlines.
        They were real in nominal terms. The catch: reward tokens were new, with speculative
        prices. A 500% APY in a token worth $10 today earns you nothing if that token is
        worth $0.50 in six months. Many weren't even that lucky. "Degenerate farming" —
        chasing the highest APY without understanding the underlying protocol —
        became a rite of passage. Many lost everything. The protocols that survived
        built sustainable fee revenue. The ones that existed only for token emissions collapsed
        when emissions stopped attracting new buyers.
      </Narrator>
      <SceneAdvance to={41} />
    </SceneLayout>
  );
}
