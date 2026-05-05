"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import DifficultyDemo from "@/components/demos/DifficultyDemo";

export default function Scene15() {
  return (
    <SceneLayout sceneId={15}>
      <Narrator>
        As more miners join the network, blocks start arriving faster than every ten minutes.
        More hash power means the puzzle gets solved faster. Left unchecked, this would
        compress Bitcoin's entire issuance schedule — all 21 million coins mined decades early.
      </Narrator>
      <Narrator>
        Satoshi built in a self-correcting mechanism. Every 2,016 blocks — roughly two weeks —
        Bitcoin measures how long those blocks actually took and adjusts the difficulty target.
        Blocks arriving too fast? Raise the difficulty. Too slow? Lower it. Always converging on ten minutes.
      </Narrator>
      <DifficultyDemo />
      <Narrator>
        This is why Bitcoin can absorb any amount of mining hardware without breaking its supply schedule.
        A million new miners join tomorrow? Difficulty spikes. They all leave? Difficulty drops.
        The ten-minute block time holds across orders of magnitude of hash power change.
      </Narrator>
      <Narrator>
        It also means Bitcoin's security scales with economic value. As Bitcoin's price rises,
        mining becomes more profitable, more miners join, and the network's total hash power grows —
        making a 51% attack progressively more expensive.
      </Narrator>
      <SceneAdvance to={16} />
    </SceneLayout>
  );
}
