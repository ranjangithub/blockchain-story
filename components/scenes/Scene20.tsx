"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene20() {
  return (
    <SceneLayout sceneId={20}>
      <Narrator>
        Once Bitcoin has a price, it needs markets. In July 2010, Mt. Gox launches —
        a Tokyo-based exchange where buyers and sellers can post orders. The name
        is an artifact: the domain was originally built for trading Magic: The Gathering cards online.
        Bitcoin repurposed it.
      </Narrator>
      <Narrator>
        An exchange works through an order book. A buyer posts a bid: "I'll buy 1 BTC at $8."
        A seller posts an ask: "I'll sell 1 BTC at $9." When a bid meets an ask — when someone's
        price is someone else's price — a trade executes. The last executed price becomes
        "the price of Bitcoin." It's not set by anyone. It emerges from millions of competing
        orders every second.
      </Narrator>
      <Narrator>
        By 2013, Mt. Gox handles 70% of all Bitcoin trading in the world. The price swings
        wildly — $1 in 2011, $31 later that year, back to $2, then up to $266 in April 2013.
        For people outside financial systems — especially in countries with unstable currencies —
        Bitcoin starts to look like something worth holding.
      </Narrator>
      <Narrator>
        One thing the early exchanges teach: Bitcoin's price is not Bitcoin's security.
        The network has been running continuously since 2009 without a single successful
        attack on the protocol itself. The price goes up and down. The chain keeps producing
        blocks every ten minutes, indifferent to markets.
      </Narrator>
      <SceneAdvance to={21} />
    </SceneLayout>
  );
}
