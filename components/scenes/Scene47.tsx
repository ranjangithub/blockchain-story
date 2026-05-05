"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene47() {
  return (
    <SceneLayout sceneId={47}>
      <Narrator>
        Here is where we actually are. Bitcoin: $1.3 trillion in market cap.
        The same 21 million coin limit, the same 10-minute blocks, the same proof-of-work
        Satoshi designed in 2008. BlackRock's Bitcoin ETF became the fastest-growing
        ETF in history. The institutions Bitcoin was meant to route around now hold
        more of it than most individuals. The protocol didn't change. The holders did.
      </Narrator>
      <Narrator>
        Ethereum: the world's programmable settlement layer. $400 billion in value.
        Proof-of-stake since 2022. L2 networks — Arbitrum, Optimism, Base, zkSync —
        processing millions of daily transactions at cents each. The base layer
        increasingly settles proofs rather than individual transactions.
        DeFi has $50–80 billion locked in protocols. Stablecoins move more daily
        volume than Visa. None of it has a CEO or a headquarters.
      </Narrator>
      <Narrator>
        The losses: Mt. Gox ($450M). The DAO ($60M). Ronin bridge ($625M).
        FTX ($8 billion in customer funds). UST/Luna ($40 billion in market cap,
        gone in 72 hours). Bridge hacks, oracle attacks, rug pulls, exit scams.
        The ecosystem lost more to fraud and negligence than most industries will ever touch.
        And it kept building. The infrastructure that survived these failures is more robust
        for having been tested by them.
      </Narrator>
      <Narrator>
        The open questions are the same as always, just clearer now.
        Can decentralized systems scale without sacrificing the decentralization that makes them worth having?
        Can stablecoins be safe without becoming the banks they replaced?
        What does it mean to own something digital if the social consensus around it can collapse?
        Should programmable money be controlled by governments, by code, or by neither?
        Will Satoshi's original insight — that trustless peer-to-peer exchange is possible
        at global scale — prove itself fully over the next decade, or encounter a wall it can't climb?
      </Narrator>
      <Narrator>
        You started this story in 2008, frustrated at a bank. You understand, now,
        what was built in response to that frustration, how it works, and everything
        it has become. The rest is still being written.
      </Narrator>
      <SceneAdvance to={47} isEnd />
    </SceneLayout>
  );
}
