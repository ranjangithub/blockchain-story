"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene19() {
  return (
    <SceneLayout sceneId={19}>
      <Narrator>
        May 22, 2010. A programmer named Laszlo Hanyecz posts to the Bitcoin forum:
        "I'll pay 10,000 BTC for a couple of pizzas." He's been mining since the early days
        and has accumulated a lot of coins. He wants to see if Bitcoin can actually buy
        something real.
      </Narrator>
      <Narrator>
        A 19-year-old in England sees the post. He orders two Papa John's pizzas to
        Laszlo's house in Florida — $25 worth — and collects 10,000 BTC. That day,
        Bitcoin gets its first market price: $0.0025 per coin. One dollar buys 400 Bitcoin.
      </Narrator>
      <Narrator>
        At Bitcoin's 2021 peak, those two pizzas would be worth $690 million. Laszlo
        has never expressed regret. He says he was glad to contribute to Bitcoin becoming
        real money. Every May 22nd, the community celebrates Bitcoin Pizza Day — the day
        digital coins became a real medium of exchange.
      </Narrator>
      <Narrator>
        More importantly: price changes everything. Before Laszlo's pizza, Bitcoin was
        a cryptography experiment. After it, Bitcoin was something you could put a number on.
        Price is what draws miners. Price is what creates the economic incentives that
        make the security work. The pizzas weren't just a purchase. They were proof of concept.
      </Narrator>
      <SceneAdvance to={20} />
    </SceneLayout>
  );
}
