"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import ReentrancyDemo from "@/components/demos/ReentrancyDemo";

export default function Scene37() {
  return (
    <SceneLayout sceneId={37}>
      <Narrator>
        It is April 30, 2016. A smart contract called The DAO raises 11.5 million ETH
        from 18,000 investors — roughly $150 million, 14% of all Ethereum in existence.
        It's a decentralized venture fund: token holders vote on investments, and profits
        flow back to them. No CEO, no board, no office. Just code on Ethereum.
        It's the largest crowdfund in history at that point. It's also broken.
      </Narrator>
      <Narrator>
        The DAO allows token holders to "split" — to leave the fund and take their
        proportional share of ETH with them into a personal "child DAO." The split
        function has a flaw so subtle that multiple auditors missed it.
        It sends ETH to the caller before zeroing their balance.
        If the caller is a smart contract with a fallback function, that fallback
        fires during the transfer — and can call split() again, and again, and again,
        before the balance ever resets to zero. This is a reentrancy attack:
        the function is re-entered before it finishes executing.
      </Narrator>
      <Narrator>
        On June 17, 2016, an anonymous attacker exploits it. Over three hours,
        they drain 3.6 million ETH — $60 million — into their own child DAO.
        There's one thing saving the community: The DAO's own rules require
        a 28-day waiting period before any child DAO can withdraw ETH.
        The attacker has the money but cannot spend it yet.
        The community has 28 days to decide what to do.
      </Narrator>
      <ReentrancyDemo />
      <Narrator>
        Here is what made the story stranger. A group of white hat hackers —
        developers including Griff Green and others in the Ethereum ecosystem —
        realized something: the other child DAOs that legitimate investors had
        previously created still held 7.2 million ETH. Those child DAOs had
        the same vulnerability. If the attacker ran the exploit again on those,
        they'd drain the rest of The DAO's remaining funds too.
        The white hats decided to act first.
      </Narrator>
      <Narrator>
        Using the identical reentrancy exploit, they attacked those vulnerable
        child DAOs themselves — draining 7.2 million ETH into a recovery contract
        they controlled. This was hacking to protect. They used an unauthorized
        exploit to move funds they didn't own, with the stated intention of returning
        them to rightful investors. No one asked permission. They acted unilaterally,
        racing against the original attacker who could have done the same thing.
        The ethics were genuinely contested then, as they still are.
      </Narrator>
      <Narrator>
        The Ethereum community now faced a question no blockchain had confronted:
        should we change the rules after the fact? The protocol said the attacker's
        transactions were valid. The code executed correctly. No Ethereum rule was broken.
        The exploit was real, but the contract did exactly what its code said.
        One side: "code is law" — rolling back sets a precedent that powerful insiders
        can rewrite history. This destroys immutability. The other side: "the community
        is the ultimate authority" — the intention of the contract was clearly not to let
        one person drain everything through a bug, and we can correct this.
      </Narrator>
      <Narrator>
        On July 20, 2016, at block 1,920,000, the Ethereum network hard forked.
        The majority chain — what we now call Ethereum — rewound past the attack.
        The attacker's child DAO was overwritten with a recovery contract.
        Investors recovered their ETH. The minority chain that refused the fork
        kept running unchanged — that became Ethereum Classic (ETC).
        Two chains, identical history up to block 1,919,999, then permanently diverged.
      </Narrator>
      <Narrator>
        The irony that followed: Ethereum Classic, the chain that stood for immutability
        above all else, was successfully 51% attacked three times — in 2019 and twice in 2020.
        Attackers rented enough mining power to rewrite recent ETC history, double-spending
        on exchanges. The chain that refused to rewrite history had its history rewritten
        by economics. The principle of "code is law" held on ETC. The security model
        it depended on did not. Security scales with economic commitment to the network —
        and ETC had far less of that than Ethereum.
      </Narrator>
      <SceneAdvance to={38} />
    </SceneLayout>
  );
}
