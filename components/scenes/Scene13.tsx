"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import NetworkDemo from "@/components/demos/NetworkDemo";

export default function Scene13() {
  return (
    <SceneLayout sceneId={13}>
      <Narrator>
        Word spreads. Other developers download the code. Each one runs a node —
        a full copy of every block since Genesis, the full ruleset, the full transaction history.
        The network grows.
      </Narrator>
      <NetworkDemo />
      <Narrator>
        Each node is equal. No node is the authority. There is no "Bitcoin server."
        When you ask "where is the Bitcoin blockchain?" the answer is: everywhere.
        Every node that has ever downloaded the full chain holds an exact copy.
      </Narrator>
      <Narrator>
        Take any single node offline — kill Satoshi's laptop, shut down Hal Finney's machine —
        and the network doesn't notice. The ledger exists in the remaining nodes.
        This is what "decentralized" actually means, at the mechanical level.
      </Narrator>
      <SceneAdvance to={14} />
    </SceneLayout>
  );
}
