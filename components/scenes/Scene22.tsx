"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene22() {
  return (
    <SceneLayout sceneId={22}>
      <Narrator>
        It's 2013. A 19-year-old named Vitalik Buterin has been writing about Bitcoin for
        two years. He opens the Bitcoin source code and stares at Bitcoin Script — the
        programming language that lives inside every transaction.
      </Narrator>
      <Narrator>
        Bitcoin Script is deliberately limited. It can do: "Alice sends 1 BTC to Bob if
        Bob provides a valid signature." It can do multi-signature: "require 2 of 3 people
        to sign." It can do simple time locks. But it cannot do: "release funds if the
        temperature in Tokyo exceeds 30°C." It cannot loop. It cannot remember state
        between transactions. It cannot call other contracts.
      </Narrator>
      <Narrator>
        Satoshi designed Script this way intentionally. A Turing-complete scripting language —
        one that can express any computation — creates a problem: how do you prevent a
        program from running forever? If a miner executes a script that loops infinitely,
        the whole network freezes. Bitcoin solves this by refusing to allow loops at all.
        Simple. Safe. But also severely limited.
      </Narrator>
      <Narrator>
        Vitalik proposes adding features to Bitcoin. The community says no — the protocol
        is working. Don't risk breaking it. He tries again with a different proposal. Same answer.
        Vitalik stops trying to extend Bitcoin. Instead, he starts thinking about
        what a blockchain without Bitcoin's constraints could look like.
      </Narrator>
      <SceneAdvance to={23} />
    </SceneLayout>
  );
}
