"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene21() {
  return (
    <SceneLayout sceneId={21}>
      <Narrator>
        February 2014. Mt. Gox suspends withdrawals. A week later: the CEO walks into a
        Tokyo press conference looking pale. 850,000 Bitcoin — worth $450 million at the time —
        have been stolen. Gone. The exchange files for bankruptcy. The money is never recovered.
      </Narrator>
      <Narrator>
        The hack took years. Attackers had quietly been draining the exchange since at least 2011,
        exploiting poor security and chaotic internal systems. Mt. Gox didn't actually own the coins
        it claimed to hold. When users deposited Bitcoin to trade, the exchange held those coins
        on behalf of its customers. One central server. One point of failure. 850,000 reasons
        why that was a terrible design.
      </Narrator>
      <Narrator>
        This is the lesson that echoes through all of crypto: "Not your keys, not your coins."
        When you hold Bitcoin in an exchange wallet, you don't hold Bitcoin. You hold an IOU.
        The exchange controls the private key. If the exchange gets hacked, goes bankrupt,
        gets seized by regulators, or simply disappears — your IOU is worth nothing.
      </Narrator>
      <Narrator>
        In 2022, FTX would repeat the same lesson at larger scale — $8 billion in customer
        funds lost in a collapse that took days. The same mistake, eight years later. Bitcoin
        solves the problem of trusting central banks. It doesn't solve the problem of
        trusting exchanges. That problem you have to solve yourself, by holding your own keys.
      </Narrator>
      <SceneAdvance to={22} />
    </SceneLayout>
  );
}
