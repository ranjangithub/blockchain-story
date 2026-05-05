"use client";

import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import HashDemo from "@/components/demos/HashDemo";

export default function Scene3() {
  return (
    <SceneLayout sceneId={3}>
      <Narrator>
        Satoshi needed a way to fingerprint data. Not encrypt it — fingerprint it.
        Something with three properties:
      </Narrator>

      <div className="flex flex-col gap-2 pl-4 border-l border-zinc-700">
        <p className="text-zinc-300 text-sm">
          <span className="text-orange-400 font-mono">01.</span>{" "}
          The same input always produces the same output.
        </p>
        <p className="text-zinc-300 text-sm">
          <span className="text-orange-400 font-mono">02.</span>{" "}
          Change one character in the input, and the output looks completely unrelated.
        </p>
        <p className="text-zinc-300 text-sm">
          <span className="text-orange-400 font-mono">03.</span>{" "}
          Given the output, you cannot reconstruct the input.
        </p>
      </div>

      <Narrator>
        He used SHA-256 — Secure Hash Algorithm, 256-bit output. It was already well-studied,
        published by the NSA, used in SSL certificates across the internet. Fast enough to
        compute on 2009 hardware. Impossibly hard to reverse.
      </Narrator>

      <Narrator>
        Try it. Change a single character in the transaction below — any character —
        and watch what happens to the hash.
      </Narrator>

      <HashDemo />

      <Narrator>
        That's the avalanche effect. A single bit change cascades through 64 rounds of
        bit-mixing until the output looks completely different. There's no pattern.
        No way to predict what the output will be without computing it.
      </Narrator>

      <Narrator>
        This is why tampering is detectable. If you change one transaction in a block,
        the block's fingerprint screams. And because every block contains the fingerprint
        of the block before it, a single change breaks every subsequent block in the chain.
      </Narrator>

      <Narrator>
        But first, Satoshi needed identities. Not usernames registered with anyone —
        mathematical identities that anyone can generate and no one can forge.
      </Narrator>

      <SceneAdvance to={4} />
    </SceneLayout>
  );
}
