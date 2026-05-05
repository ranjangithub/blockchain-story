"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import HalvingDemo from "@/components/demos/HalvingDemo";

export default function Scene16() {
  return (
    <SceneLayout sceneId={16}>
      <Narrator>
        Every block, miners receive newly created Bitcoin as a reward. This is how new Bitcoin
        enters existence — not printed by a central bank, but earned by expending real electricity
        to secure the network. Satoshi called the first transaction in each block the "coinbase" —
        the transaction that creates coins from nothing.
      </Narrator>
      <Narrator>
        But here is the constraint Satoshi coded in: every 210,000 blocks — roughly four years —
        the reward cuts in half. 50 BTC per block. Then 25. Then 12.5. Then 6.25.
        Eventually approaching zero, with a hard cap of 21 million Bitcoin total.
        No one can override this. Every node enforces it.
      </Narrator>
      <HalvingDemo />
      <Narrator>
        After the last halving, around the year 2140, miners will earn only transaction fees.
        Whether that's economically sustainable is one of Bitcoin's open questions.
        The supply schedule is fixed. The fee market is not.
      </Narrator>
      <Narrator>
        The halving is also the mechanism behind the "digital gold" narrative: predictable scarcity,
        coded in advance, enforced by every node on the network. No central banker can double the supply
        at a moment of political convenience.
      </Narrator>
      <SceneAdvance to={17} />
    </SceneLayout>
  );
}
