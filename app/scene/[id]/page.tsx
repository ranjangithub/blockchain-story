import { notFound } from "next/navigation";
import { getScene, TOTAL_SCENES } from "@/lib/scenes/registry";

import Scene1 from "@/components/scenes/Scene1";
import Scene2 from "@/components/scenes/Scene2";
import Scene3 from "@/components/scenes/Scene3";
import Scene4 from "@/components/scenes/Scene4";
import Scene5 from "@/components/scenes/Scene5";
import Scene6 from "@/components/scenes/Scene6";
import Scene7 from "@/components/scenes/Scene7";
import Scene8 from "@/components/scenes/Scene8";
import Scene9 from "@/components/scenes/Scene9";
import Scene10 from "@/components/scenes/Scene10";
import Scene11 from "@/components/scenes/Scene11";
import Scene12 from "@/components/scenes/Scene12";
import Scene13 from "@/components/scenes/Scene13";
import Scene14 from "@/components/scenes/Scene14";
import Scene15 from "@/components/scenes/Scene15";
import Scene16 from "@/components/scenes/Scene16";
import Scene17 from "@/components/scenes/Scene17";
import Scene18 from "@/components/scenes/Scene18";
import Scene19 from "@/components/scenes/Scene19";
import Scene20 from "@/components/scenes/Scene20";
import Scene21 from "@/components/scenes/Scene21";
import Scene22 from "@/components/scenes/Scene22";
import Scene23 from "@/components/scenes/Scene23";
import Scene24 from "@/components/scenes/Scene24";
import Scene25 from "@/components/scenes/Scene25";
import Scene26 from "@/components/scenes/Scene26";
import Scene27 from "@/components/scenes/Scene27";
import Scene28 from "@/components/scenes/Scene28";
import Scene29 from "@/components/scenes/Scene29";
import Scene30 from "@/components/scenes/Scene30";
import Scene31 from "@/components/scenes/Scene31";
import Scene32 from "@/components/scenes/Scene32";
import Scene33 from "@/components/scenes/Scene33";
import Scene34 from "@/components/scenes/Scene34";
import Scene35 from "@/components/scenes/Scene35";
import Scene36 from "@/components/scenes/Scene36";
import Scene37 from "@/components/scenes/Scene37";
import Scene38 from "@/components/scenes/Scene38";
import Scene39 from "@/components/scenes/Scene39";
import Scene40 from "@/components/scenes/Scene40";
import Scene41 from "@/components/scenes/Scene41";
import Scene42 from "@/components/scenes/Scene42";
import Scene43 from "@/components/scenes/Scene43";
import Scene44 from "@/components/scenes/Scene44";
import Scene45 from "@/components/scenes/Scene45";
import Scene46 from "@/components/scenes/Scene46";
import Scene47 from "@/components/scenes/Scene47";

const SCENE_COMPONENTS: Record<number, React.ComponentType> = {
  1: Scene1,
  2: Scene2,
  3: Scene3,
  4: Scene4,
  5: Scene5,
  6: Scene6,
  7: Scene7,
  8: Scene8,
  9: Scene9,
  10: Scene10,
  11: Scene11,
  12: Scene12,
  13: Scene13,
  14: Scene14,
  15: Scene15,
  16: Scene16,
  17: Scene17,
  18: Scene18,
  19: Scene19,
  20: Scene20,
  21: Scene21,
  22: Scene22,
  23: Scene23,
  24: Scene24,
  25: Scene25,
  26: Scene26,
  27: Scene27,
  28: Scene28,
  29: Scene29,
  30: Scene30,
  31: Scene31,
  32: Scene32,
  33: Scene33,
  34: Scene34,
  35: Scene35,
  36: Scene36,
  37: Scene37,
  38: Scene38,
  39: Scene39,
  40: Scene40,
  41: Scene41,
  42: Scene42,
  43: Scene43,
  44: Scene44,
  45: Scene45,
  46: Scene46,
  47: Scene47,
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ScenePage({ params }: Props) {
  const { id } = await params;
  const sceneId = parseInt(id, 10);

  if (isNaN(sceneId) || sceneId < 1 || sceneId > TOTAL_SCENES) {
    notFound();
  }

  const SceneComponent = SCENE_COMPONENTS[sceneId];
  if (!SceneComponent) {
    const scene = getScene(sceneId);
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="max-w-md text-center flex flex-col gap-4">
          <p className="text-orange-500 text-xs font-mono uppercase tracking-widest">
            Scene {sceneId} · {scene?.actTitle}
          </p>
          <h1 className="text-2xl font-bold text-zinc-200">{scene?.title}</h1>
          <p className="text-zinc-500 text-sm">
            This scene is coming soon.
          </p>
          <a href="/scene/1" className="text-orange-400 hover:text-orange-300 font-mono text-sm transition-colors">
            ← Back to Scene 1
          </a>
        </div>
      </div>
    );
  }

  return <SceneComponent />;
}

export function generateStaticParams() {
  return Array.from({ length: TOTAL_SCENES }, (_, i) => ({ id: String(i + 1) }));
}
