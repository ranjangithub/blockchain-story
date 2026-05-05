"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene23() {
  return (
    <SceneLayout sceneId={23}>
      <Narrator>
        November 2013. Vitalik writes the Ethereum whitepaper in a burst over a few weeks.
        The core idea: instead of a blockchain that tracks coin balances, build a blockchain
        that runs a computer. Every node runs the same virtual machine — the EVM,
        Ethereum Virtual Machine. Any code you deploy to it runs on every node simultaneously.
      </Narrator>
      <Narrator>
        The loop problem that stopped Bitcoin? Vitalik's solution: charge for every computational
        step. Each EVM instruction costs "gas" — a tiny fee. If your program runs forever,
        it runs out of gas and stops. The fee mechanism that prevents abuse is also
        the mechanism that makes complex programs possible. Elegant.
      </Narrator>
      <Narrator>
        In this model, a smart contract is just a program deployed to an Ethereum address.
        It has its own storage, its own balance, its own code. Anyone can call it by
        sending a transaction to its address. The code executes deterministically on
        every node. No one controls it. No one can change it after deployment. It just runs.
      </Narrator>
      <Narrator>
        The implications take a while to sink in. If you can run arbitrary code on a
        decentralized computer, you can build financial instruments without banks,
        organizations without CEOs, markets without exchanges. You can encode any
        agreement between any parties and have it execute automatically when conditions are met.
        Vitalik calls it "programmable money." Others call it a world computer.
        In 2015, Ethereum launches. The experiment begins.
      </Narrator>
      <SceneAdvance to={24} />
    </SceneLayout>
  );
}
