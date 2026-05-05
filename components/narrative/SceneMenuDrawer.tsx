"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SCENES, SceneMeta, loadProgress } from "@/lib/scenes/registry";

interface ActGroup {
  act: number;
  actTitle: string;
  scenes: SceneMeta[];
}

const ACTS: ActGroup[] = Array.from(
  SCENES.reduce((map, scene) => {
    if (!map.has(scene.act)) {
      map.set(scene.act, { act: scene.act, actTitle: scene.actTitle, scenes: [] });
    }
    map.get(scene.act)!.scenes.push(scene);
    return map;
  }, new Map<number, ActGroup>()).values()
);

interface Props {
  currentSceneId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function SceneMenuDrawer({ currentSceneId, isOpen, onClose }: Props) {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(1);
  const [expandedActs, setExpandedActs] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen) {
      const progress = loadProgress();
      setUnlocked(progress);
      // Auto-expand the act containing the current scene
      const currentScene = SCENES.find((s) => s.id === currentSceneId);
      if (currentScene) {
        setExpandedActs(new Set([currentScene.act]));
      }
    }
  }, [isOpen, currentSceneId]);

  function toggleAct(act: number) {
    setExpandedActs((prev) => {
      const next = new Set(prev);
      if (next.has(act)) next.delete(act);
      else next.add(act);
      return next;
    });
  }

  function navigate(sceneId: number) {
    if (sceneId <= unlocked) {
      router.push(`/scene/${sceneId}`);
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-zinc-900 border-r border-zinc-800 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div>
                <p className="text-zinc-100 font-mono text-sm font-bold">Story Contents</p>
                <p className="text-zinc-500 text-xs mt-0.5">{unlocked - 1} of {SCENES.length} scenes read</p>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-zinc-300 transition-colors w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-800"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Acts list */}
            <div className="flex-1 overflow-y-auto">
              {ACTS.map(({ act, actTitle, scenes }) => {
                const isExpanded = expandedActs.has(act);
                const actUnlocked = scenes.some((s) => s.id <= unlocked);
                const actCompleted = scenes.every((s) => s.id < unlocked);
                const scenesDone = scenes.filter((s) => s.id < unlocked).length;

                return (
                  <div key={act} className="border-b border-zinc-800/60">
                    {/* Act header — clickable to expand/collapse */}
                    <button
                      onClick={() => toggleAct(act)}
                      className="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-zinc-800/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono uppercase tracking-widest ${actUnlocked ? "text-orange-500" : "text-zinc-600"}`}>
                            Act {act}
                          </span>
                          {actCompleted && (
                            <span className="text-emerald-500 text-xs">✓</span>
                          )}
                        </div>
                        <p className={`text-sm leading-tight mt-0.5 truncate ${actUnlocked ? "text-zinc-300" : "text-zinc-600"}`}>
                          {actTitle}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-zinc-600 text-xs font-mono">
                          {scenesDone}/{scenes.length}
                        </span>
                        <span className={`text-zinc-500 text-xs transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
                          ›
                        </span>
                      </div>
                    </button>

                    {/* Scenes list */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-zinc-950/40"
                        >
                          {scenes.map((scene) => {
                            const isUnlocked = scene.id <= unlocked;
                            const isCurrent = scene.id === currentSceneId;
                            const isRead = scene.id < unlocked;

                            return (
                              <button
                                key={scene.id}
                                onClick={() => navigate(scene.id)}
                                disabled={!isUnlocked}
                                className={`w-full text-left pl-10 pr-4 py-2 flex items-center gap-2 transition-colors ${
                                  isCurrent
                                    ? "bg-orange-500/10 border-l-2 border-orange-500"
                                    : isUnlocked
                                    ? "hover:bg-zinc-800/70 border-l-2 border-transparent"
                                    : "border-l-2 border-transparent cursor-not-allowed"
                                }`}
                              >
                                <span className={`text-xs font-mono w-4 shrink-0 ${isCurrent ? "text-orange-400" : isRead ? "text-zinc-500" : isUnlocked ? "text-zinc-500" : "text-zinc-700"}`}>
                                  {scene.id}
                                </span>
                                <span className={`text-xs leading-snug flex-1 ${
                                  isCurrent ? "text-orange-300 font-medium" : isUnlocked ? "text-zinc-300" : "text-zinc-600"
                                }`}>
                                  {scene.title}
                                </span>
                                {scene.hasDemo && isUnlocked && (
                                  <span className="text-zinc-600 text-xs shrink-0" title="Interactive demo">⚡</span>
                                )}
                                {!isUnlocked && (
                                  <span className="text-zinc-700 text-xs shrink-0">🔒</span>
                                )}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-zinc-800 shrink-0">
              <a
                href="/"
                className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors flex items-center gap-1"
              >
                ← Home
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
