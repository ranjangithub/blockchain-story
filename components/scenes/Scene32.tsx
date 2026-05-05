"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import TrilemmaDemo from "@/components/demos/TrilemmaDemo";

export default function Scene32() {
  return (
    <SceneLayout sceneId={32}>
      <Narrator>
        Vitalik Buterin formalized an observation that the community had felt but not
        named: the blockchain trilemma. Every blockchain must balance three properties —
        security, decentralization, and scalability. You can have any two. The third
        suffers. This isn't a temporary engineering problem. It's structural.
      </Narrator>
      <Narrator>
        Bitcoin chose security and decentralization. 7 transactions per second. The entire
        world cannot use Bitcoin as a payments network without a layer on top.
        Ethereum made the same choice with the same result. BNB Chain chose security
        and scalability — 21 validators, all known, all tied to Binance. Fast, cheap,
        and structurally centralized. Different point on the same triangle.
      </Narrator>
      <TrilemmaDemo />
      <Narrator>
        The most promising current answer isn't to find a blockchain that beats the trilemma —
        it's to stop trying to fit everything into one layer. Layer 2 solutions inherit
        Ethereum's security by posting proofs to the main chain, while running their own
        higher-throughput execution environment. The base layer provides security.
        The layer above provides speed. The trilemma isn't solved. It's delegated.
      </Narrator>
      <SceneAdvance to={33} />
    </SceneLayout>
  );
}
