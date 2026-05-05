"use client";

import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import ChainDemo from "@/components/demos/ChainDemo";

export default function Scene12() {
  return (
    <SceneLayout sceneId={12}>
      <Narrator>
        Three blocks now. Each one contains a Merkle tree of transactions and a hash
        of the block before it. The chain is growing.
      </Narrator>

      <Narrator>
        Let's see what actually happens when someone tries to rewrite history.
        Change a transaction in Block 1 — just one — and watch the chain react.
      </Narrator>

      <ChainDemo />

      <Narrator>
        That cascade is the point. The chain's security isn't a database lock or a password —
        it's physics. Re-mining Block 1 takes real computation. Re-mining Block 2 takes more.
        Re-mining Block 3 takes more still. And the honest network is adding a new block
        every ten minutes while the attacker is still working on Block 1.
      </Narrator>

      <Narrator>
        To rewrite one hour of history, you'd need to out-compute the entire honest network
        for one hour. At Bitcoin's current hashrate, that costs hundreds of millions of dollars
        in electricity alone — before hardware. And the coins you'd steal would likely be worth
        less after the attack than the cost of conducting it.
      </Narrator>

      <Narrator>
        This is what Satoshi meant by "trustless." You don't trust Satoshi's node. You don't
        trust your node. You don't trust Hal's node. You trust the math. The chain itself is
        the evidence that the history is real.
      </Narrator>

      <div className="bg-zinc-900 border border-orange-900/40 rounded-lg p-5 flex flex-col gap-3">
        <p className="text-orange-400 text-xs font-mono uppercase tracking-widest">What you now understand</p>
        <div className="flex flex-col gap-2 text-sm text-zinc-300">
          <p>✓ SHA-256 hashes fingerprint data — change one character, the fingerprint screams</p>
          <p>✓ Private/public key pairs create unforgeable identities from mathematics</p>
          <p>✓ Block headers link to previous blocks via their hash — one change breaks all subsequent blocks</p>
          <p>✓ Proof of Work makes producing a valid block expensive — so rewriting history is even more expensive</p>
          <p>✓ The longest chain rule creates consensus without any central authority</p>
        </div>
      </div>

      <Narrator>
        The network has two nodes. Soon it will have more. And as it grows, the security
        model only gets stronger — more honest miners make it harder for any attacker
        to out-compute the network.
      </Narrator>

      <SceneAdvance to={13} label="Continue to Act 3 →" />
    </SceneLayout>
  );
}
