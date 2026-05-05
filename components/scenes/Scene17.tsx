"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import FiftyOneDemo from "@/components/demos/FiftyOneDemo";

export default function Scene17() {
  return (
    <SceneLayout sceneId={17}>
      <Narrator>
        Here is the most dangerous attack on Bitcoin's security model. An attacker acquires
        more than half the network's total computing power — 51%. They build a secret chain,
        longer than the honest chain. Then they broadcast it.
      </Narrator>
      <Narrator>
        Every node follows the "longest chain wins" rule. They switch to the attacker's longer chain.
        Any transaction that was in the honest chain but not in the attacker's chain disappears.
        The attacker can double-spend: send Bitcoin, wait for the recipient to see "confirmations,"
        then broadcast their secret chain where that transaction never existed.
      </Narrator>
      <FiftyOneDemo />
      <Narrator>
        The defense is economic, not cryptographic. At Bitcoin's 2024 hashrate,
        renting enough hardware for even a one-hour 51% attack costs hundreds of millions of dollars.
        The Bitcoin you'd steal would likely be worth less after markets panic. The attack is
        theoretically possible and economically irrational — that IS the security.
      </Narrator>
      <Narrator>
        Smaller coins with less hash power are genuinely vulnerable. Several have been 51%
        attacked in practice. Security scales with the total value committed to mining,
        which is why "more miners = more secure" is literal, not metaphorical.
      </Narrator>
      <SceneAdvance to={18} />
    </SceneLayout>
  );
}
