"use client";

import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import WalletDemoGenerate from "@/components/demos/WalletDemoGenerate";

export default function Scene9() {
  return (
    <SceneLayout sceneId={9}>
      <Narrator>
        The software runs a key generation routine. Same math Satoshi used — secp256k1
        elliptic curve — but this time, with your entropy. Your browser generates
        32 random bytes that have never existed before and will never exist again in exactly
        this form.
      </Narrator>

      <WalletDemoGenerate />

      <Narrator>
        Your private key never leaves your machine. The software never sends it anywhere.
        No server stores a copy. No company can reset it if you lose it.
      </Narrator>

      <Narrator>
        This is the first genuine difference from every banking system you've ever used.
        Your identity on this network isn't granted to you by anyone. You didn't register.
        You didn't verify an email. You didn't agree to terms of service.
        You computed it from randomness. It's yours by mathematics, not by permission.
      </Narrator>

      <Narrator>
        Satoshi can see your public address. He sends you some Bitcoin to test the system.
      </Narrator>

      <SceneAdvance to={10} />
    </SceneLayout>
  );
}
