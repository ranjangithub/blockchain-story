"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import FlashLoanDemo from "@/components/demos/FlashLoanDemo";

export default function Scene41() {
  return (
    <SceneLayout sceneId={41}>
      <Narrator>
        Here is something that cannot exist in traditional finance: an uncollateralized
        loan for $1 million, with zero credit check, that you borrow and repay
        within the same second — and if you fail to repay, the loan never happened.
        This is a flash loan, and it's only possible because of one property of the EVM:
        atomicity. All steps of a transaction either complete fully, or none of them do.
      </Narrator>
      <Narrator>
        The mechanics: you borrow from a lending protocol within a single transaction.
        You use the funds — for arbitrage, collateral swaps, self-liquidation.
        In the same transaction, you repay the loan plus a small fee.
        If the repayment step fails, the EVM reverts everything.
        The loan appears to have never happened. The lender never loses a dollar,
        because the loan only finalizes if it's repaid. No counterparty risk.
        No collateral needed. This is a primitive that no bank can offer —
        because banks can't roll back transactions.
      </Narrator>
      <FlashLoanDemo />
      <Narrator>
        Legitimate uses: arbitrage between DEXes (prices diverge constantly;
        flash loans let you profit without capital), collateral swaps,
        self-liquidation to avoid penalties. Attack uses: oracle manipulation —
        borrow a large sum, spike a price on a low-liquidity pool within the block,
        exploit a protocol that reads that price, repay the loan. bZx lost $600K this way.
        dForce lost $25M. The flash loan didn't create the vulnerability —
        it gave attackers access to unlimited capital to exploit it.
      </Narrator>
      <SceneAdvance to={42} />
    </SceneLayout>
  );
}
