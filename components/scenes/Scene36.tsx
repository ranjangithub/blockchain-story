"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene36() {
  return (
    <SceneLayout sceneId={36}>
      <Narrator>
        It's 2024. Bitcoin just crossed $70,000. The SEC approved spot Bitcoin ETFs,
        making it accessible to every retirement account in America. BlackRock,
        Fidelity, Vanguard — the institutions that Bitcoin was built to route around —
        are now among the largest Bitcoin holders on earth. The irony is not lost
        on anyone who read the whitepaper.
      </Narrator>
      <Narrator>
        Ethereum completed "the Merge" in September 2022 — switching from proof-of-work
        to proof-of-stake without stopping the chain, in what was the most complex
        coordinated upgrade in software history. Energy consumption dropped 99.95%.
        The world called it impossible until it happened.
        Thirty million ETH is now staked as economic security.
      </Narrator>
      <Narrator>
        Layer 2 networks process millions of transactions daily. Zero-knowledge proofs —
        cryptographic tools once confined to academic papers — are running in production.
        Stablecoins move billions of dollars across borders every day for people who
        can't access banks. The experiment that started with a 9-page PDF and a
        code release in January 2009 is now systemically significant global infrastructure.
      </Narrator>
      <Narrator>
        You've been here since the beginning — the hashes, the keys, the blocks,
        the contracts. That's the infrastructure layer. But the ecosystem built on top
        is its own story: chain splits born from philosophy clashes, stablecoins that
        collapsed overnight, ICO manias, digital art worth millions, meme coins worth
        billions, institutions building their own versions of everything.
        The next act covers the parts of the story that don't fit neatly into the
        technical foundations — but that are just as important for understanding
        where we actually are.
      </Narrator>
      <SceneAdvance to={37} />
    </SceneLayout>
  );
}
