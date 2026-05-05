"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";

export default function Scene43() {
  return (
    <SceneLayout sceneId={43}>
      <Narrator>
        December 6, 2013. Two software engineers — Billy Markus and Jackson Palmer —
        create a cryptocurrency as a joke. They use the Shiba Inu dog meme that's
        flooding the internet, call it Dogecoin, and expect nobody to take it seriously.
        It has no hard supply cap. Its mascot is a dog. Its community ethos is "much wow."
        Within two weeks, it's a top-10 cryptocurrency by market cap.
      </Narrator>
      <Narrator>
        Dogecoin's community raises $25,000 to send the Jamaican bobsled team to the
        2014 Winter Olympics after they qualified but couldn't afford to go.
        They sponsor a NASCAR driver. They fund a clean water project in Kenya.
        The community is unusually wholesome for crypto. In January 2021,
        Reddit's WallStreetBets energy catches up with DOGE. Elon Musk tweets about it —
        repeatedly, including on Saturday Night Live. DOGE reaches a $90 billion market cap.
        It was created in two hours as a joke.
      </Narrator>
      <Narrator>
        Shiba Inu (SHIB) launched in 2020 explicitly as "the Dogecoin killer" —
        created anonymously, with 50% of its quadrillion-token supply sent to Vitalik Buterin's wallet
        as a stunt. Buterin donated most of it to COVID relief in India, worth $1 billion.
        SHIB reached a $41 billion market cap. Pepe (PEPE), based on the Pepe the Frog meme,
        reached $1.6 billion in 2023.
      </Narrator>
      <Narrator>
        Meme coins are uncomfortable for the blockchain community because they expose
        an inconvenient truth: all cryptocurrency value is a social construct.
        Bitcoin has value because people collectively agree it does. So does DOGE.
        The difference is the strength and nature of that consensus — Bitcoin's rests on
        mathematical scarcity, decentralization, and 15 years of institutional trust.
        DOGE's rests on community, humor, and Elon Musk's Twitter account.
        Both are real. Both can go to zero if the consensus collapses.
        Meme coins just make the underlying mechanism visible.
      </Narrator>
      <SceneAdvance to={44} />
    </SceneLayout>
  );
}
