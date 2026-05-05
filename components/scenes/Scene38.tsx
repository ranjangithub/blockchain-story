"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene38() {
  return (
    <SceneLayout sceneId={38}>
      <Narrator>
        Bitcoin and Ethereum are volatile — their prices move 10–20% in a day.
        That's fine for speculation. It's unusable for payments or savings.
        If you're paying rent, you need something that's worth approximately
        the same tomorrow as it is today. This is what stablecoins try to solve:
        the price stability of the dollar, the programmability of crypto.
      </Narrator>
      <Narrator>
        Three models exist. Model 1: fiat-backed. Tether (USDT, launched 2014) and USDC
        (2018) hold actual dollars in bank accounts and issue tokens on-chain as receipts.
        One dollar in → one token out. Simple. It works. But it's centralized —
        Circle can freeze your USDC, and has. It's also only as safe as the custodians
        holding the dollars. USDT's reserve composition has been disputed since launch.
        The model trusts institutions, which is exactly what crypto was supposed to replace.
      </Narrator>
      <Narrator>
        Model 2: crypto-backed. DAI is issued by MakerDAO. To mint $100 in DAI,
        you lock $150+ in ETH as collateral in a smart contract. If ETH drops enough
        that your collateral falls below a threshold, the contract automatically liquidates
        you. No human involved. Decentralized, but requires excess collateral to exist.
        DAI can't be frozen by anyone. It's held its peg through multiple market crashes.
      </Narrator>
      <Narrator>
        Model 3: algorithmic. No collateral. Just code that expands and contracts the supply
        to maintain a $1 price. UST (TerraUSD) was the most prominent attempt.
        In May 2022, a coordinated attack triggered a "death spiral":
        UST lost its $1 peg. The algorithm minted billions of LUNA tokens to restore it.
        Hyperinflation of LUNA made the collateral worthless. UST went to $0.
        LUNA went from $80 to $0.0001 in 72 hours. $40 billion in value evaporated.
        Algorithm stablecoins remain the blockchain's open wound — every new design
        promising it solved what Terra couldn't.
      </Narrator>
      <SceneAdvance to={39} />
    </SceneLayout>
  );
}
