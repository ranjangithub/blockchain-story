"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import LendingDemo from "@/components/demos/LendingDemo";

export default function Scene29() {
  return (
    <SceneLayout sceneId={29}>
      <Narrator>
        If you can build an exchange without a company, you can build a bank without a bank.
        Aave and Compound deploy lending pools: suppliers deposit tokens and earn interest.
        Borrowers lock collateral and take out loans. All automated. All in code.
        No credit check. No loan officer. No one to bribe.
      </Narrator>
      <Narrator>
        The catch: DeFi loans are overcollateralized. To borrow $500 in USDC, you must lock
        $1,000 in ETH as collateral. This seems backwards compared to traditional finance,
        where loans are granted based on income and credit history. But it makes sense in
        a system with no identity, no legal enforcement, and no recourse. The only way to
        ensure repayment is to hold more collateral than the loan is worth.
      </Narrator>
      <LendingDemo />
      <Narrator>
        Liquidation is the mechanism that keeps the system solvent. If ETH drops enough
        that your collateral is no longer sufficient, a liquidator — another smart contract,
        or a bot watching the chain — pays off part of your loan and takes your collateral
        at a discount. There's no phone call, no workout, no extension. The math triggers
        automatically. During the May 2021 crash, over $1 billion in positions were liquidated
        in hours. The protocol didn't break. The math held.
      </Narrator>
      <SceneAdvance to={30} />
    </SceneLayout>
  );
}
