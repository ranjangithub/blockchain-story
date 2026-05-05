"use client";

import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { saveProgress, TOTAL_SCENES } from "@/lib/scenes/registry";

interface SceneAdvanceProps {
  to: number;
  label?: string;
  isEnd?: boolean;
}

export default function SceneAdvance({ to, label, isEnd: isEndProp }: SceneAdvanceProps) {
  const router = useRouter();
  const params = useParams();
  const currentSceneId = params?.id ? parseInt(params.id as string, 10) : 1;
  const isEnd = isEndProp ?? to > TOTAL_SCENES;

  function advance() {
    saveProgress(to);
    if (isEnd) {
      router.push("/");
    } else {
      router.push(`/scene/${to}`);
    }
  }

  function goBack() {
    if (isNaN(currentSceneId) || currentSceneId <= 1) {
      router.push("/");
    } else {
      router.push(`/scene/${currentSceneId - 1}`);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="pt-6 flex items-center justify-between border-t border-zinc-800 mt-4"
    >
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors font-mono text-sm group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span>{currentSceneId <= 1 ? "Home" : "Back"}</span>
      </button>

      <button
        onClick={advance}
        className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors font-mono text-sm group"
      >
        <span>{label ?? (isEnd ? "Finish" : "Continue")}</span>
        <span className="group-hover:translate-x-1 transition-transform">
          {isEnd ? "✓" : "→"}
        </span>
      </button>
    </motion.div>
  );
}
