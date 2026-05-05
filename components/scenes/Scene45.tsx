"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import ProofOfStakeDemo from "@/components/demos/ProofOfStakeDemo";

export default function Scene45() {
  return (
    <SceneLayout sceneId={45}>
      <Narrator>
        Ethereum launched in 2015 using proof-of-work — miners competing with hardware,
        burning enormous amounts of electricity to produce blocks. But Vitalik had always
        intended to switch to something fundamentally different: proof-of-stake.
        The core idea: instead of wasting energy to prove you did work,
        prove you have something to lose. Lock ETH as collateral — your "stake."
        If you behave honestly, you earn rewards. If you cheat, the protocol
        burns your stake. Security from economics, not thermodynamics.
      </Narrator>
      <Narrator>
        In proof-of-stake, block producers are called validators, not miners.
        Every 12 seconds — one "slot" — the protocol uses RANDAO,
        Ethereum's randomness beacon, to pseudo-randomly select one validator
        to propose the next block. The selection probability is proportional
        to stake: more ETH staked means a slightly higher chance of being chosen,
        but not a guarantee. A committee of other validators then "attests" to
        the proposed block — they each cast a signed vote confirming the block is valid
        and builds on the correct chain. Once more than two-thirds of the committee
        attests, the block is finalized. No miner needed. No GPU race. No megawatts.
      </Narrator>
      <ProofOfStakeDemo />
      <Narrator>
        The threat that keeps validators honest is slashing. If a validator
        signs two different blocks for the same slot — called equivocation —
        any other node can submit both signatures to the chain as proof.
        The protocol verifies the contradiction and automatically burns part of the
        validator's stake, then forcibly exits them from the validator set.
        The minimum slash is 1 ETH, but if many validators are slashed simultaneously
        (suggesting a coordinated attack), the penalty scales up to 36% of their stake.
        The slasher who reported the violation earns a portion of the burned ETH.
        Honest monitoring is incentivized at the protocol level.
      </Narrator>
      <Narrator>
        There is also an "inactivity leak": if a validator goes offline and stops
        participating, their stake slowly drains — roughly 50% after 36 days of total
        inactivity. This ensures that if a large chunk of validators disappear
        (say, a datacenter goes offline), the remaining honest validators can eventually
        achieve finality again, even if the inactive validators drain out first.
        The network heals itself.
      </Narrator>
      <Narrator>
        September 15, 2022, 06:42:42 UTC. The Merge completes. The last proof-of-work
        block is mined. The next block is produced by a proof-of-stake validator.
        The chain doesn't pause. No transactions are lost. Energy consumption drops
        99.95% overnight. Seven years of engineering, hundreds of researchers,
        multiple testnets, and the coordination of thousands of independent node operators
        — all to switch the consensus engine of a $300 billion network without stopping it.
        The world had said it was impossible. The network kept producing blocks.
      </Narrator>
      <SceneAdvance to={46} />
    </SceneLayout>
  );
}
