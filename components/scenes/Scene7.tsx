"use client";

import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import MiningDemo from "@/components/demos/MiningDemo";

export default function Scene7() {
  return (
    <SceneLayout sceneId={7}>
      <Narrator>
        One problem remains. If producing a valid block is free — just collect some transactions,
        build a Merkle tree, fill in the header — then anyone can spam the network with fake
        blocks. The network would have no way to decide which chain is the "real" one.
      </Narrator>

      <Narrator>
        Satoshi's solution: make producing a valid block expensive. Not expensive in dollars —
        expensive in computation. The block's hash must start with a certain number of zeros.
        The only way to achieve this is to vary one field in the header — the nonce — and
        hash the whole header again. And again. And again. Until you get lucky.
      </Narrator>

      <Narrator>
        This is Proof of Work. The proof is the hash itself: if you show me a block whose
        hash starts with ten zeros, I know you did the work. There's no shortcut.
        No way to fake it. Hash functions are one-way — you can't work backwards from a
        target hash to find the input. You just try numbers until one works.
      </Narrator>

      <MiningDemo />

      <Narrator>
        January 3rd, 2009. Satoshi's machine runs for approximately six days at 2009 CPU speeds.
        At nonce 2,083,236,893, the hash resolves to something starting with ten zeros.
        The Genesis Block is born.
      </Narrator>

      <Narrator>
        He embeds a message in the coinbase transaction — the transaction that creates the
        50 BTC reward and sends them to his address:
      </Narrator>

      <div className="bg-zinc-900 border border-zinc-800 rounded px-4 py-3 font-mono text-sm text-orange-300">
        "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks."
      </div>

      <Narrator>
        A timestamp. A message to history. Proof that the Genesis Block was not pre-mined
        before that date — because the newspaper headline didn't exist before that date.
        And a reminder of why this system existed at all.
      </Narrator>

      <Narrator>
        Bitcoin exists. There's one block. One address. One person who knows the private key.
        The network is Satoshi's laptop.
      </Narrator>

      <Narrator>
        He needs someone else to join.
      </Narrator>

      <SceneAdvance to={8} label="Enter Act 2 →" />
    </SceneLayout>
  );
}
