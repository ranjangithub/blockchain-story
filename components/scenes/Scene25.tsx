"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import GasDemo from "@/components/demos/GasDemo";

export default function Scene25() {
  return (
    <SceneLayout sceneId={25}>
      <Narrator>
        If Ethereum is a world computer, then computation needs to cost something.
        Otherwise, someone could deploy a program with an infinite loop and freeze
        every node on the network. The solution is gas: every EVM instruction has a
        fixed cost in gas units, and every transaction sets a limit on how much gas it'll spend.
        Run out of gas mid-execution? The transaction fails, the state reverts — but you still
        paid for the computation already done. Gas is non-refundable labor.
      </Narrator>
      <Narrator>
        The gas price itself — how much ETH each gas unit costs — was historically a free market.
        In 2021, Ethereum upgraded to EIP-1559: a base fee that adjusts automatically with
        network congestion, plus an optional tip to prioritize your transaction.
        The base fee is burned — destroyed forever. The tip goes to the miner (now validator).
        During high-traffic periods, ETH gets removed from supply faster than it's created.
        The world computer that charges for its own compute has a built-in deflationary mechanism.
      </Narrator>
      <GasDemo />
      <Narrator>
        The practical implication: complex transactions cost more. A simple ETH transfer
        costs 21,000 gas. Writing to storage costs 20,000 gas per slot. Deploying a contract
        can cost millions. At peak congestion, a single DeFi transaction can cost $100 in fees.
        Gas is the real constraint on what Ethereum can do at scale — and the reason
        why Layer 2 solutions exist, which we'll get to.
      </Narrator>
      <SceneAdvance to={26} />
    </SceneLayout>
  );
}
