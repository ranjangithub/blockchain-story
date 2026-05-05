"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene46() {
  return (
    <SceneLayout sceneId={46}>
      <Narrator>
        While DeFi was rebuilding finance without intermediaries, the intermediaries
        were watching. Their response: build their own blockchains.
        In 2019, JPMorgan launched JPM Coin — a permissioned blockchain token
        representing dollars, used only between JPMorgan's institutional clients
        for intraday settlements. No public access. No mining. 75 known validators,
        all JPMorgan entities. It settles roughly $1 billion per day in internal transfers.
        By most definitions, it's a shared database with a token on top. But JPMorgan
        trusts it more than their own legacy systems, which is revealing.
      </Narrator>
      <Narrator>
        Central Bank Digital Currencies go further. China's digital yuan — e-CNY —
        is a CBDC issued directly by the People's Bank of China. It's legal tender,
        replacing physical cash in the government's vision. It's programmable:
        the government can set expiry dates, restrict it to specific merchants or categories,
        or track spending in ways cash never allowed. 260 million wallets created by 2023.
        Pilots in dozens of cities. The European Central Bank is in a multi-year
        digital euro research program. The US Federal Reserve has been more cautious,
        issuing research papers but not committing to implementation.
      </Narrator>
      <Narrator>
        The ideological contrast is stark. Bitcoin was created specifically because
        governments and banks control money — and someone believed that was a problem
        worth solving at the protocol level. A CBDC is government-issued, government-controlled,
        programmable money. It can be frozen. It can be restricted. It expires.
        The surveillance capabilities are unprecedented. The financial inclusion
        argument is real: billions of people have phones but no bank accounts.
        A CBDC wallet requires neither. But every transaction is visible to the issuer.
      </Narrator>
      <Narrator>
        Both worlds are now developing in parallel: public, permissionless blockchains
        where no one controls your money, and permissioned, government-controlled
        digital currencies where everyone's money is visible and programmable by the state.
        The question of which model wins is not technical. It's political.
        It depends on what people decide they want money to be.
      </Narrator>
      <SceneAdvance to={47} />
    </SceneLayout>
  );
}
