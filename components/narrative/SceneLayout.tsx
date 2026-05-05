"use client";

import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getScene, loadProgress, resetProgress, TOTAL_SCENES } from "@/lib/scenes/registry";
import SceneMenuDrawer from "./SceneMenuDrawer";

interface SceneLayoutProps {
  sceneId: number;
  children: ReactNode;
}

export default function SceneLayout({ sceneId, children }: SceneLayoutProps) {
  const scene = getScene(sceneId);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unlocked = loadProgress();
    if (sceneId > unlocked) {
      router.replace(`/scene/${unlocked}`);
    }
  }, [sceneId, router]);

  function handleReset() {
    if (confirm("Start over? This clears your progress.")) {
      resetProgress();
      router.push("/scene/1");
    }
  }

  if (!scene) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <SceneMenuDrawer
        currentSceneId={sceneId}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors group"
            aria-label="Open scene menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <rect x="1" y="3" width="14" height="1.5" rx="0.75" fill="currentColor"/>
              <rect x="1" y="7.25" width="14" height="1.5" rx="0.75" fill="currentColor"/>
              <rect x="1" y="11.5" width="14" height="1.5" rx="0.75" fill="currentColor"/>
            </svg>
            <span className="text-sm font-mono hidden sm:inline">Contents</span>
          </button>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-500 text-sm font-mono">ACT {scene.act}</span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-400 text-sm hidden md:inline">{scene.actTitle}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-600 text-sm font-mono">
            {sceneId} / {TOTAL_SCENES}
          </span>
          <button
            onClick={handleReset}
            className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors"
          >
            Start over
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-px bg-zinc-800 relative">
        <motion.div
          className="h-full bg-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${(sceneId / TOTAL_SCENES) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Scene title */}
      <div className="px-6 pt-12 pb-4 max-w-3xl mx-auto w-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-orange-500 text-sm font-mono uppercase tracking-widest mb-2"
        >
          Scene {sceneId}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-zinc-100"
        >
          {scene.title}
        </motion.h1>
      </div>

      {/* Scene content */}
      <main className="flex-1 px-6 pb-16 max-w-3xl mx-auto w-full">
        <div className="flex flex-col gap-8">{children}</div>
      </main>
    </div>
  );
}
