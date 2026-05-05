"use client";

import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene2() {
  return (
    <SceneLayout sceneId={2}>
      <Narrator>
        October 31, 2008. Halloween. Satoshi sends an email to a cryptography mailing list
        with 312 subscribers. The subject line: "Bitcoin P2P e-cash paper."
      </Narrator>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 font-mono text-sm flex flex-col gap-3">
        <div className="flex gap-4 text-xs text-zinc-600">
          <span>From: Satoshi Nakamoto</span>
          <span>·</span>
          <span>Oct 31, 2008</span>
        </div>
        <p className="text-zinc-300 font-bold">Bitcoin P2P e-cash paper</p>
        <p className="text-zinc-400 leading-relaxed text-xs">
          I've been working on a new electronic cash system that's fully peer-to-peer,
          with no trusted third party.
        </p>
        <p className="text-zinc-400 leading-relaxed text-xs">
          The paper is available at: bitcoin.org/bitcoin.pdf
        </p>
        <div className="border-t border-zinc-800 pt-3 text-xs text-zinc-500 leading-relaxed">
          Abstract: A purely peer-to-peer version of electronic cash would allow online payments
          to be sent directly from one party to another without going through a financial institution.
          Digital signatures provide part of the solution, but the main benefits are lost if a trusted
          third party is still required to prevent double-spending. We propose a solution to the
          double-spending problem using a peer-to-peer network...
        </div>
      </div>

      <Narrator>
        Nine pages. The abstract fits in three sentences. Most people on the list ignored it.
        A few replied with skepticism. One person replied with genuine interest: Hal Finney,
        a cryptographer who had spent years working on digital cash systems.
      </Narrator>

      <Narrator>
        The paper's core insight: you don't need a trusted third party to prevent double-spending
        if you can get a network of computers to agree on a shared history of transactions.
        The question is: how do you get computers that don't trust each other to agree on anything?
      </Narrator>

      <Narrator>
        To solve this, Satoshi needed three things. A way to fingerprint data so tampering is
        detectable. A way to create identities that no one can forge. And a way to make the
        cost of lying more expensive than the benefit of being honest.
      </Narrator>

      <Narrator>
        He already knew the answer to the first one.
      </Narrator>

      <SceneAdvance to={3} />
    </SceneLayout>
  );
}
