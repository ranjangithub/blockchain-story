"use client";

import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene1() {
  return (
    <SceneLayout sceneId={1}>
      <Narrator>
        September 15, 2008. Lehman Brothers files for Chapter 11 bankruptcy.
        The largest bankruptcy filing in US history.
      </Narrator>

      <Narrator>
        $691 billion in assets. Gone — or rather, transferred. Transferred to governments,
        to other banks, to bailout funds assembled from public money.
        The people who caused the crash got rescued by the people they crashed.
      </Narrator>

      <Narrator>
        Somewhere, watching this, is a person (or group of people) who goes by Satoshi Nakamoto.
        We don't know who they are. We know what they were thinking.
      </Narrator>

      <div className="border-l-2 border-orange-700 pl-5 py-1">
        <p className="text-zinc-400 italic leading-relaxed">
          "The root problem with conventional currency is all the trust that's required to make it work.
          The central bank must be trusted not to debase the currency, but the history of fiat
          currencies is full of breaches of that trust."
        </p>
        <p className="text-zinc-600 text-sm mt-2 font-mono">— Satoshi Nakamoto, 2009</p>
      </div>

      <Narrator>
        He had been thinking about this for years. Every wire transfer, every bank account,
        every payment system in existence required trusting a third party — a party that could
        freeze your account, reverse your transaction, fail, get hacked, or be seized by governments.
      </Narrator>

      <Narrator>
        What if you could transfer value between two people — directly, without any intermediary,
        in a way that couldn't be reversed, blocked, or censored? What if you didn't need to
        trust a bank because you didn't need a bank at all?
      </Narrator>

      <Narrator>
        He opens a text editor.
      </Narrator>

      <SceneAdvance to={2} />
    </SceneLayout>
  );
}
