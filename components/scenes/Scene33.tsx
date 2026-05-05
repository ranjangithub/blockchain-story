"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import LightningDemo from "@/components/demos/LightningDemo";

export default function Scene33() {
  return (
    <SceneLayout sceneId={33}>
      <Narrator>
        Bitcoin's seven transactions per second can't serve a planet. But there's a trick:
        you don't have to put every transaction on-chain. You just have to put the net result
        there. The Lightning Network, proposed in 2015 and deployed in 2018,
        exploits this with payment channels.
      </Narrator>
      <Narrator>
        Alice and Bob open a channel with one on-chain transaction, locking 0.1 BTC in a
        shared contract. Now they can send Bitcoin back and forth instantly — no miners,
        no fees, no waiting. Each payment is a new balance state that both parties sign.
        Only the latest signed state is valid. When they're done, one on-chain transaction
        settles the final balances. A thousand Lightning payments became two blockchain transactions.
      </Narrator>
      <LightningDemo />
      <Narrator>
        You don't need a direct channel with everyone. Payments route through the network:
        Alice to Carol through Bob — each node in the path locks funds temporarily,
        ensuring the payment only completes if every hop agrees. If any hop fails,
        the payment cancels and funds return. No trust required. The routing is enforced
        by cryptographic hash time-locked contracts — HTLCs — that guarantee atomicity.
        Either the entire payment succeeds, or nothing moves.
      </Narrator>
      <Narrator>
        Lightning works. El Salvador uses it for Bitcoin payments. Strike processes
        cross-border remittances through it. But routing large payments through a
        sparse network remains hard. And you need to be online to receive. The same
        tradeoffs Bitcoin always had: not for everything, but sovereign for the things it does.
      </Narrator>
      <SceneAdvance to={34} />
    </SceneLayout>
  );
}
