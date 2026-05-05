"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene30() {
  return (
    <SceneLayout sceneId={30}>
      <Narrator>
        Smart contracts can do almost anything — except see outside the blockchain.
        The EVM is deterministic: every node must reach the same result executing the same code.
        If contracts could call external APIs — weather data, stock prices, sports scores —
        different nodes might get different results, and consensus would break.
        The blockchain is a sealed room. The internet doesn't exist inside it.
      </Narrator>
      <Narrator>
        This is the oracle problem. A DeFi lending contract needs to know the current
        price of ETH to decide when to liquidate a position. Where does it get that price?
        If you hardcode a price, you get immediately exploited. If you let one address
        update the price, that address becomes a central point of failure.
        The solution — oracles — is one of the most complex unsolved problems in the space.
      </Narrator>
      <Narrator>
        Chainlink's approach: a decentralized network of node operators, each fetching the
        same data from multiple sources, aggregating results, and posting a consensus
        price on-chain. Operators stake LINK tokens as collateral — if they post bad data,
        they lose their stake. Still not perfect. In 2020, a flash loan attack exploited
        an oracle on the bZx protocol: a trader manipulated a price within a single transaction
        block, draining $600,000 before any oracle could update.
      </Narrator>
      <Narrator>
        The oracle problem matters beyond DeFi. A smart contract for crop insurance
        needs to know if it rained. An election system needs certified vote counts.
        A supply chain contract needs to know if goods arrived. The real world is full
        of facts that need to get on-chain. Getting them there without introducing
        centralization or manipulation remains the open frontier.
      </Narrator>
      <SceneAdvance to={31} />
    </SceneLayout>
  );
}
