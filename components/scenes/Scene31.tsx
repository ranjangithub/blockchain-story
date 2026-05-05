"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene31() {
  return (
    <SceneLayout sceneId={31}>
      <Narrator>
        If you can write financial contracts in code, can you run an organization in code?
        A DAO — Decentralized Autonomous Organization — is a smart contract that holds
        funds and executes decisions based on token holder votes. No CEO. No board.
        No legal entity required in some jurisdictions. The rules are code.
        Votes are transactions. Treasury disbursements require majority approval.
      </Narrator>
      <Narrator>
        In 2016, "The DAO" raised $150M in ETH — the largest crowdfund in history at that point.
        It was an investment fund governed entirely by token holders. Six weeks after launch,
        an attacker exploited a reentrancy bug in the contract and drained $60M.
        The Ethereum community faced an impossible choice: let the theft stand, or roll back
        the blockchain to undo it. They chose the rollback. The network split — Ethereum (the fork)
        and Ethereum Classic (the original chain). "Code is law" collided with "but we lost $60M."
      </Narrator>
      <Narrator>
        The lesson wasn't that DAOs don't work. MakerDAO has governed the DAI stablecoin
        since 2017 with billions in its treasury. Uniswap's governance token controls
        protocol parameters. Nouns DAO has funded hundreds of projects. The lesson is that
        DAO code must be audited meticulously, that upgradability and simplicity matter,
        and that "decentralized governance" can still be captured by large token holders.
        Voting power scales with wealth, not wisdom — the same problem that afflicts
        traditional shareholder governance.
      </Narrator>
      <SceneAdvance to={32} />
    </SceneLayout>
  );
}
