"use client";
import SceneLayout from "@/components/narrative/SceneLayout";
import Narrator from "@/components/narrative/Narrator";
import SceneAdvance from "@/components/narrative/SceneAdvance";
import MempoolDemo from "@/components/demos/MempoolDemo";

export default function Scene14() {
  return (
    <SceneLayout sceneId={14}>
      <Narrator>
        More users. More transactions. The mempool — that holding area where unconfirmed
        transactions wait — starts filling up. Miners can only fit so many transactions
        in each block. They have to choose which ones to include.
      </Narrator>
      <Narrator>
        The obvious choice: include the transactions that pay the highest fee.
        A fee market emerges. Not because anyone designed it — because the incentives
        demand it.
      </Narrator>
      <MempoolDemo />
      <Narrator>
        This is Bitcoin's congestion mechanism. During peak demand, fees spike.
        During quiet periods, they fall to near zero. No committee sets the fee.
        Users bid against each other for block space, and miners optimize for profit.
      </Narrator>
      <Narrator>
        It's efficient in the economic sense and frustrating in the user experience sense.
        A transaction you submitted for $0.10 might take hours if $5 transactions flood in behind it.
        This tension — block size vs. throughput — was Bitcoin's first major scaling debate.
      </Narrator>
      <SceneAdvance to={15} />
    </SceneLayout>
  );
}
