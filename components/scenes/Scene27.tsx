"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene27() {
  return (
    <SceneLayout sceneId={27}>
      <Narrator>
        Ethereum has tokens. Tokens need to be tradeable. The obvious approach is an exchange —
        but we've seen where that leads. Mt. Gox held $450M in Bitcoin and lost it.
        FTX held customer funds and used them as a personal bank. Every centralized exchange
        is the same structural failure: someone holds your keys.
      </Narrator>
      <Narrator>
        The early Ethereum ecosystem tried building decentralized order books.
        Put the order book itself on-chain. Every bid and ask is a transaction.
        It sounds right — nothing is held by anyone. But it's impractical.
        Every order placed or canceled costs gas. Market makers — who constantly
        update orders — would spend more on gas than they earn from trades.
        On-chain order books don't work at scale.
      </Narrator>
      <Narrator>
        The question becomes: can you build a market that works without an order book?
        Can you trade tokens without buyers and sellers needing to find each other?
        The answer, it turns out, is yes — but it requires rethinking what a market
        actually is. Instead of matching buyers and sellers, you can pool their assets
        together and let a mathematical formula do the pricing.
      </Narrator>
      <Narrator>
        In 2018, a Hayden Adams writes Uniswap — 300 lines of Solidity, no venture funding,
        no company, no order book. It becomes the foundation of an entirely new kind of finance.
      </Narrator>
      <SceneAdvance to={28} />
    </SceneLayout>
  );
}
