"use client";

import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import WalletDemoFixed from "@/components/demos/WalletDemoFixed";

export default function Scene4() {
  return (
    <SceneLayout sceneId={4}>
      <Narrator>
        Before Satoshi can receive anything — before the Genesis Block, before Bitcoin
        exists at all — he needs an address. A place on the network that belongs to him
        and only him. Not an email. Not a username registered with anyone. Something he
        generates himself, from nothing, that no one can forge.
      </Narrator>

      <Narrator>
        The math comes from a branch of cryptography called elliptic curve cryptography.
        Satoshi picks a specific curve called secp256k1 — a curve defined by the equation
        y² = x³ + 7, over a very large prime field.
      </Narrator>

      <Narrator>
        He generates 32 random bytes. This is his private key. A number so large that
        if every atom in the observable universe were a computer running at the speed of light,
        guessing it would take longer than the age of the universe.
      </Narrator>

      <Narrator>
        From that private key, a one-way mathematical operation on the elliptic curve produces
        a public key. Anyone can have the public key. But only Satoshi — who knows the private
        key — can produce valid signatures. Watch the derivation:
      </Narrator>

      <WalletDemoFixed />

      <Narrator>
        That address — <span className="text-orange-300 font-mono text-sm">1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf</span> —
        is where the first 50 Bitcoin will go. The reward for mining the Genesis Block.
      </Narrator>

      <Narrator>
        The 50 BTC sent to that address have never moved. They're considered permanently
        unspendable — a relic, a monument. No one has ever spent them because the Genesis
        Block's coinbase transaction was hard-coded in a way that makes the coins unredeemable.
        The coins sit there to this day.
      </Narrator>

      <Narrator>
        Now Satoshi has an identity and a fingerprint function. He has everything he needs
        to define what a block actually is.
      </Narrator>

      <SceneAdvance to={5} />
    </SceneLayout>
  );
}
