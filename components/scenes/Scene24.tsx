"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import SmartContractDemo from "@/components/demos/SmartContractDemo";

export default function Scene24() {
  return (
    <SceneLayout sceneId={24}>
      <Narrator>
        Remember the car you were going to buy from a stranger? We said Bitcoin couldn't
        solve the timing problem — who sends first? With Ethereum, we can. Let's build
        an escrow contract.
      </Narrator>
      <Narrator>
        You deploy a smart contract that does this: accept ETH from the buyer.
        If the seller provides the vehicle ID number within 7 days, release the funds to the seller.
        If 7 days pass without the VIN, refund the buyer. That's it. The contract holds the money.
        Neither party can touch it until the condition is met. No bank, no lawyer, no escrow company.
      </Narrator>
      <SmartContractDemo />
      <Narrator>
        Once deployed, the contract's code is immutable. Everyone can read it.
        You can verify exactly what it will do in every scenario before you lock funds into it.
        The seller knows they'll get paid if they deliver. The buyer knows they'll get a refund
        if they don't. The rules are in code, enforced by every Ethereum node on the planet.
        This is what "trustless" means in practice — not that there's no trust, but that
        the trust is placed in code you can read rather than institutions you have to believe in.
      </Narrator>
      <SceneAdvance to={25} />
    </SceneLayout>
  );
}
