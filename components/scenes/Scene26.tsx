"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import ERC20Demo from "@/components/demos/ERC20Demo";

export default function Scene26() {
  return (
    <SceneLayout sceneId={26}>
      <Narrator>
        Smart contracts made a surprising realization obvious: you don't need Bitcoin
        to issue a currency. You can deploy a contract that tracks balances, allows transfers,
        and behaves exactly like a coin — running entirely within Ethereum. In 2015,
        developers standardized how to do this: ERC-20, the token standard.
      </Narrator>
      <Narrator>
        An ERC-20 token is just a smart contract with six required functions.
        Any contract that implements them is, by definition, a token.
        Your balance isn't stored on some special ledger — it's a number in a
        mapping inside that contract. When you "hold USDC," you have a positive
        balance in Circle's USDC contract. The token only exists as state in Ethereum.
      </Narrator>
      <ERC20Demo />
      <Narrator>
        In 2017–2018, this triggered the ICO era — anyone could deploy an ERC-20 token,
        call it anything, and sell it. Most were worthless. But the infrastructure itself
        was sound. USDC, the dollar-pegged stablecoin issued by Circle, is an ERC-20.
        DAI, algorithmically pegged to the dollar with no central issuer, is an ERC-20.
        Wrapped Bitcoin — BTC that exists on Ethereum — is an ERC-20. The standard became
        the plumbing for an entire financial system.
      </Narrator>
      <SceneAdvance to={27} />
    </SceneLayout>
  );
}
