"use client";

import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene8() {
  return (
    <SceneLayout sceneId={8}>
      <Narrator>
        January 9, 2009. Satoshi releases Bitcoin v0.1 to the world.
        He posts to the cryptography mailing list again:
      </Narrator>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 font-mono text-sm flex flex-col gap-3">
        <div className="flex gap-4 text-xs text-zinc-600">
          <span>From: Satoshi Nakamoto</span>
          <span>·</span>
          <span>Jan 9, 2009</span>
        </div>
        <p className="text-zinc-300 font-bold">Bitcoin v0.1 released</p>
        <p className="text-zinc-400 leading-relaxed text-xs">
          Announcing the first release of Bitcoin, a new electronic cash system that uses a
          peer-to-peer network to prevent double-spending. It's completely decentralized with
          no server or central authority.
        </p>
        <p className="text-zinc-400 text-xs">
          Download: sourceforge.net/projects/bitcoin/
        </p>
      </div>

      <Narrator>
        Hal Finney replies: "Running bitcoin." He downloads it, runs it, and becomes the first
        person other than Satoshi to run a Bitcoin node.
      </Narrator>

      <Narrator>
        But in this story — he also emails you.
      </Narrator>

      <div className="bg-zinc-900 border border-orange-900/50 rounded-lg p-5 font-mono text-sm flex flex-col gap-3">
        <div className="flex gap-4 text-xs text-zinc-600">
          <span>From: S. Nakamoto</span>
          <span>·</span>
          <span>Jan 9, 2009, 11:47 AM</span>
        </div>
        <p className="text-zinc-300 font-bold">Something I've been working on</p>
        <p className="text-zinc-400 leading-relaxed text-xs">
          I've been working on something. Download this. Run it. Tell me what you think.
        </p>
        <p className="text-zinc-400 text-xs">
          [bitcoin-0.1.tar.gz attached]
        </p>
        <p className="text-zinc-500 text-xs">— S</p>
      </div>

      <Narrator>
        You download it. You run it. The software starts, connects to Satoshi's node,
        and downloads the chain — one block. The Genesis Block.
      </Narrator>

      <Narrator>
        Before you can do anything, the software needs to set up your identity on the network.
        It generates your keys.
      </Narrator>

      <SceneAdvance to={9} />
    </SceneLayout>
  );
}
