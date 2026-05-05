"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene18() {
  return (
    <SceneLayout sceneId={18}>
      <Narrator>
        You've been running a full node — downloading every block since January 2009,
        verifying every transaction yourself, trusting no one's word. That's the purist
        way. But as Bitcoin grows, most people won't run a full node. Their phones can't
        hold the whole chain.
      </Narrator>
      <Narrator>
        Satoshi anticipated this. The whitepaper describes "simplified payment verification" —
        SPV. Instead of downloading every block, you download only the block headers: 80 bytes
        each instead of megabytes. You ask full nodes for proof that your transaction is
        in a block. You verify the proof without verifying the block itself.
      </Narrator>
      <Narrator>
        The tradeoff is real. A full node rejects invalid blocks — it validates every rule itself.
        An SPV client trusts that the longest chain is also the valid chain. If 51% of miners
        collaborated to include an invalid transaction in a block, full nodes would reject it.
        An SPV wallet might not. Full nodes are the immune system. SPV clients are the ordinary
        users who depend on that immune system without contributing to it.
      </Narrator>
      <Narrator>
        This creates a subtle political dynamic: the more people use SPV wallets instead of
        full nodes, the more they trust miners. Satoshi's ideal — no trusted third parties —
        depends on enough people running full nodes to make the immune system work.
        "Enough" has never been precisely defined. It's still debated.
      </Narrator>
      <SceneAdvance to={19} />
    </SceneLayout>
  );
}
