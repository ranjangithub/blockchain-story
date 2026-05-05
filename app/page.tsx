"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  loadProgress,
  resetProgress,
  SCENES,
  SceneMeta,
  TOTAL_SCENES,
} from "@/lib/scenes/registry";

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

const TOTAL_DEMOS = SCENES.filter((s) => s.hasDemo).length;

export default function Home() {
  const router = useRouter();
  const [progress, setProgress] = useState(1);
  const [showToc, setShowToc] = useState(false);
  const [expandedActs, setExpandedActs] = useState<Set<number>>(new Set());

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  function startOver() {
    resetProgress();
    router.push("/scene/1");
  }

  function toggleAct(act: number) {
    setExpandedActs((prev) => {
      const next = new Set(prev);
      if (next.has(act)) next.delete(act);
      else next.add(act);
      return next;
    });
  }

  function navigateTo(sceneId: number) {
    if (sceneId <= progress) {
      router.push(`/scene/${sceneId}`);
    }
  }

  const hasProgress = progress > 1;

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-6 py-16 bg-zinc-950">
      <div className="max-w-xl w-full flex flex-col gap-8">
        {/* Hero */}
        <div className="flex flex-col gap-3">
          <p className="text-orange-500 text-xs font-mono uppercase tracking-widest">
            An Interactive Story
          </p>
          <h1 className="text-4xl font-bold text-zinc-100 leading-tight">
            From Satoshi to DeFi
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            January 2009. Satoshi Nakamoto emails you the source code.
            You join the network. You mine blocks. You watch Bitcoin grow into
            a global financial layer — and then Ethereum, smart contracts, DeFi.
          </p>
          <p className="text-zinc-500 text-sm">
            Every technical concept — hashing, proof of work, merkle trees,
            51% attacks, AMMs — arrives when the story needs it.
            All demos run real cryptography in your browser.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-8 text-sm font-mono text-zinc-500">
          <div>
            <span className="text-zinc-300 text-lg font-bold">{TOTAL_SCENES}</span>
            <span className="ml-1.5">scenes</span>
          </div>
          <div>
            <span className="text-zinc-300 text-lg font-bold">{TOTAL_DEMOS}</span>
            <span className="ml-1.5">interactive demos</span>
          </div>
          <div>
            <span className="text-zinc-300 text-lg font-bold">8</span>
            <span className="ml-1.5">acts</span>
          </div>
        </div>

        {/* Progress bar */}
        {hasProgress && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Your progress</span>
              <span>{progress - 1} / {TOTAL_SCENES} scenes</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full">
              <div
                className="h-full bg-orange-500 rounded-full transition-all"
                style={{ width: `${((progress - 1) / TOTAL_SCENES) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/scene/${hasProgress ? progress : 1}`)}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-mono text-sm rounded transition-colors"
          >
            {hasProgress ? `Continue — Scene ${progress}` : "Begin the Story"}
          </button>
          {hasProgress && (
            <button
              onClick={startOver}
              className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 font-mono text-sm rounded transition-colors"
            >
              Start Over
            </button>
          )}
        </div>

        {/* Table of Contents toggle */}
        <div className="border-t border-zinc-800 pt-6">
          <button
            onClick={() => setShowToc((v) => !v)}
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors text-sm font-mono group"
          >
            <span className={`transition-transform duration-200 ${showToc ? "rotate-90" : ""}`}>›</span>
            <span>Browse all scenes</span>
          </button>

          <AnimatePresence initial={false}>
            {showToc && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-4 flex flex-col gap-1">
                  {ACTS.map(({ act, actTitle, scenes }) => {
                    const isExpanded = expandedActs.has(act);
                    const scenesDone = scenes.filter((s) => s.id < progress).length;
                    const actUnlocked = scenes.some((s) => s.id <= progress);

                    return (
                      <div key={act} className="rounded border border-zinc-800 overflow-hidden">
                        {/* Act row */}
                        <button
                          onClick={() => toggleAct(act)}
                          className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-zinc-800/60 transition-colors bg-zinc-900"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-mono uppercase tracking-widest ${actUnlocked ? "text-orange-500" : "text-zinc-600"}`}>
                                Act {act}
                              </span>
                              {scenesDone === scenes.length && (
                                <span className="text-emerald-500 text-xs">✓</span>
                              )}
                            </div>
                            <p className={`text-sm mt-0.5 ${actUnlocked ? "text-zinc-200" : "text-zinc-600"}`}>
                              {actTitle}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-zinc-600 text-xs font-mono">
                              {scenesDone}/{scenes.length}
                            </span>
                            <span className={`text-zinc-500 text-sm transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>›</span>
                          </div>
                        </button>

                        {/* Scenes */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.18 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-zinc-800">
                                {scenes.map((scene) => {
                                  const isUnlocked = scene.id <= progress;
                                  const isRead = scene.id < progress;
                                  const isCurrent = scene.id === progress;

                                  return (
                                    <button
                                      key={scene.id}
                                      onClick={() => navigateTo(scene.id)}
                                      disabled={!isUnlocked}
                                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 border-b border-zinc-800/50 last:border-b-0 transition-colors ${
                                        isCurrent
                                          ? "bg-orange-500/10"
                                          : isUnlocked
                                          ? "hover:bg-zinc-800/40 bg-zinc-950"
                                          : "bg-zinc-950 cursor-not-allowed"
                                      }`}
                                    >
                                      <span className={`text-xs font-mono w-5 text-right shrink-0 ${
                                        isCurrent ? "text-orange-400" : isRead ? "text-zinc-500" : isUnlocked ? "text-zinc-500" : "text-zinc-700"
                                      }`}>
                                        {scene.id}
                                      </span>
                                      <span className={`text-sm flex-1 ${
                                        isCurrent ? "text-orange-300 font-medium" : isUnlocked ? "text-zinc-300" : "text-zinc-600"
                                      }`}>
                                        {scene.title}
                                        {isCurrent && <span className="ml-2 text-xs text-orange-500 font-mono">← you are here</span>}
                                      </span>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        {scene.hasDemo && isUnlocked && (
                                          <span className="text-xs text-zinc-600 font-mono" title="Interactive demo">⚡</span>
                                        )}
                                        {isRead && !isCurrent && (
                                          <span className="text-xs text-emerald-600">✓</span>
                                        )}
                                        {!isUnlocked && (
                                          <span className="text-xs text-zinc-700">🔒</span>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-xs text-zinc-600 font-mono">
          For developers who understand code but want to understand blockchain from first principles.
          No wallet required. No account. Fully open source.
        </p>
      </div>
    </main>
  );
}
