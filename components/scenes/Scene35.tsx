"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene35() {
  return (
    <SceneLayout sceneId={35}>
      <Narrator>
        With Bitcoin, Ethereum, and a dozen L2 chains all running independently,
        a new problem emerges: how do you move assets between them?
        The answer is bridges — and they're the most dangerous part of the ecosystem.
      </Narrator>
      <Narrator>
        A bridge typically works like this: you lock 1 ETH on Ethereum mainnet into a
        bridge contract. The bridge mints "wrapped ETH" on the destination chain,
        representing a claim on the locked ETH. When you want to return, you burn
        the wrapped tokens and the bridge releases your locked ETH. The locked funds
        are the key: they sit in a single contract, on a single chain, controlled by
        a bridge operator. A massive, centralized pot of value with a target painted on it.
      </Narrator>
      <Narrator>
        Bridge hacks are now the largest category of crypto theft by dollar value.
        The Ronin bridge (Axie Infinity): $625 million stolen in March 2022 — validators
        compromised through a fake job offer. The Wormhole bridge: $320 million in February 2022 —
        a signature verification bug. Nomad: $190 million in August 2022 — a single buggy
        deploy enabled anyone to copy a valid proof transaction and drain the contract.
      </Narrator>
      <Narrator>
        The fundamental problem is that blockchains can't natively verify events
        on other blockchains. A bridge must trust someone to relay information
        across the gap — a validator set, a multisig, a ZK proof verifier.
        Every trust assumption is an attack surface. The most secure cross-chain design
        today — native ZK light clients — is still years away from wide deployment.
        Until then, moving between chains means trusting a bridge operator with your assets.
        Sometimes that goes badly.
      </Narrator>
      <SceneAdvance to={36} />
    </SceneLayout>
  );
}
