"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { audioService } from "@/lib/speech";
import {
  BookOpen,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Search,
  Sparkles,
  Check,
  X,
  MessageCircle,
  Clock,
  Mic,
  Calendar,
} from "lucide-react";

export const JournalModal: React.FC = () => {
  const {
    saveState,
    setOverlay,
    toggleBookmark,
    updatePhraseStatus,
    queuePhraseTomorrow,
  } = useGame();

  const [activeTab, setActiveTab] = useState<"phrases" | "conversations" | "corrections" | "journey">("phrases");
  const [searchQuery, setSearchQuery] = useState("");
  const [phraseFilter, setPhraseFilter] = useState<"all" | "needs-practice" | "comfortable">("all");
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);

  const targetLang = saveState.targetLanguage;

  // Filter phrases
  const filteredPhrases = saveState.savedPhrases.filter((p) => {
    const matchesSearch =
      p.phraseText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      phraseFilter === "all" || p.status === phraseFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedPhrase = saveState.savedPhrases.find((p) => p.id === selectedPhraseId) || filteredPhrases[0];

  // Extract all corrections from dialogue history
  const allCorrections = saveState.conversationHistory.flatMap((c) =>
    c.turns
      .filter((t) => t.correction)
      .map((t) => ({
        day: c.day,
        npcName: c.npcName,
        original: t.correction!.original,
        suggested: t.correction!.suggested,
        explanation: t.correction!.explanation,
        timestamp: t.timestamp,
      }))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim backdrop-blur-xs select-none animate-fadeIn">
      <div className="w-full max-w-4xl paper-glass-strong rounded-3xl border border-line shadow-e2 p-5 sm:p-7 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-coral/10 text-coral flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-ink">Journal</h2>
              <p className="text-xs text-muted">
                Your personal record of phrases, conversations, and language reflections.
              </p>
            </div>
          </div>
          <button
            onClick={() => setOverlay(null)}
            className="p-2 rounded-full text-muted hover:text-ink hover:bg-sand/80 transition-colors"
            aria-label="Close journal (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab selection row */}
        <div className="flex items-center justify-between gap-2 border-b border-line pb-3 mb-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("phrases")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === "phrases"
                  ? "bg-coral text-paper shadow-xs"
                  : "hover:bg-sand text-muted"
              }`}
            >
              Phrases ({saveState.savedPhrases.length})
            </button>
            <button
              onClick={() => setActiveTab("conversations")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === "conversations"
                  ? "bg-coral text-paper shadow-xs"
                  : "hover:bg-sand text-muted"
              }`}
            >
              Conversations ({saveState.conversationHistory.length})
            </button>
            <button
              onClick={() => setActiveTab("corrections")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === "corrections"
                  ? "bg-coral text-paper shadow-xs"
                  : "hover:bg-sand text-muted"
              }`}
            >
              Reflections & Corrections ({allCorrections.length})
            </button>
            <button
              onClick={() => setActiveTab("journey")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === "journey"
                  ? "bg-coral text-paper shadow-xs"
                  : "hover:bg-sand text-muted"
              }`}
            >
              Journey Milestones
            </button>
          </div>

          {activeTab === "phrases" && (
            <div className="relative hidden sm:block w-52">
              <Search size={14} className="absolute left-2.5 top-2.5 text-muted" />
              <input
                type="text"
                placeholder="Search phrases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-paper border border-line text-xs text-ink focus:outline-none focus:border-lagoon"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Phrases */}
        {activeTab === "phrases" && (
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Col: Filters & Phrase List */}
            <div className="md:col-span-2 flex flex-col overflow-hidden">
              {/* Filter chips */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <button
                  onClick={() => setPhraseFilter("all")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                    phraseFilter === "all" ? "bg-sand text-ink border border-line" : "text-muted hover:bg-sand/40"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setPhraseFilter("needs-practice")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                    phraseFilter === "needs-practice" ? "bg-sun/20 text-ink border border-sun" : "text-muted hover:bg-sand/40"
                  }`}
                >
                  Needs practice
                </button>
                <button
                  onClick={() => setPhraseFilter("comfortable")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                    phraseFilter === "comfortable" ? "bg-sage/20 text-ink border border-sage" : "text-muted hover:bg-sand/40"
                  }`}
                >
                  Comfortable
                </button>
              </div>

              {/* Phrase rows list */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredPhrases.length === 0 ? (
                  <div className="p-8 text-center text-muted text-xs">
                    No phrases match this filter. Say hello to neighbours to collect new phrases!
                  </div>
                ) : (
                  filteredPhrases.map((phrase) => {
                    const isSelected = selectedPhrase?.id === phrase.id;

                    return (
                      <div
                        key={phrase.id}
                        onClick={() => setSelectedPhraseId(phrase.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-paper border-coral shadow-xs"
                            : "bg-paper/70 border-line hover:bg-paper"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(phrase.id);
                            }}
                            className="text-muted hover:text-coral transition-colors"
                            aria-label="Bookmark phrase"
                          >
                            {phrase.bookmarked ? (
                              <BookmarkCheck size={16} className="text-coral" />
                            ) : (
                              <Bookmark size={16} />
                            )}
                          </button>
                          <div>
                            <div className="text-xs font-bold text-ink">{phrase.phraseText}</div>
                            <div className="text-[11px] text-muted">{phrase.translation}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              phrase.status === "needs-practice"
                                ? "bg-sun/20 text-ink"
                                : "bg-sage/20 text-sage"
                            }`}
                          >
                            {phrase.status === "needs-practice" ? "Practice" : "Comfortable"}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              audioService.speak(phrase.phraseText, targetLang, saveState.settings.speechRate);
                            }}
                            className="p-1 rounded-full text-lagoon hover:bg-sand transition-colors"
                            title="Listen"
                            aria-label={`Listen to ${phrase.phraseText}`}
                          >
                            <Volume2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Col: Phrase Detail Drawer */}
            <div className="bg-sand/30 border border-line rounded-2xl p-4 flex flex-col justify-between">
              {selectedPhrase ? (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold tracking-wider text-muted uppercase">
                    Phrase Detail
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-ink mb-1">{selectedPhrase.phraseText}</h3>
                    <p className="text-xs text-muted italic">{selectedPhrase.translation}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => audioService.speak(selectedPhrase.phraseText, targetLang, 0.95)}
                      className="px-3 py-1.5 rounded-xl bg-paper border border-line hover:border-lagoon text-xs font-semibold text-ink flex items-center gap-1.5 shadow-xs"
                    >
                      <Volume2 size={14} className="text-lagoon" />
                      <span>Normal</span>
                    </button>
                    <button
                      onClick={() => audioService.speak(selectedPhrase.phraseText, targetLang, 0.75)}
                      className="px-3 py-1.5 rounded-xl bg-paper border border-line hover:border-lagoon text-xs font-semibold text-ink flex items-center gap-1.5 shadow-xs"
                    >
                      <span>🐢 0.75×</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-muted space-y-1 pt-2 border-t border-line/60">
                    <div>
                      <span className="font-semibold text-ink">Source: </span>
                      <span>Day {selectedPhrase.sourceDay}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-ink">Practiced: </span>
                      <span>{selectedPhrase.timesPracticed} time(s)</span>
                    </div>
                  </div>

                  {/* Practice buttons */}
                  <div className="space-y-2 pt-3">
                    <button
                      onClick={() => {
                        updatePhraseStatus(
                          selectedPhrase.id,
                          selectedPhrase.status === "needs-practice" ? "comfortable" : "needs-practice"
                        );
                      }}
                      className="w-full py-2 rounded-xl bg-paper border border-line text-xs font-semibold text-ink hover:bg-sand transition-colors"
                    >
                      Mark as {selectedPhrase.status === "needs-practice" ? "Comfortable ✓" : "Needs practice 🔖"}
                    </button>

                    <button
                      onClick={() => queuePhraseTomorrow(selectedPhrase.id)}
                      className="w-full py-2 rounded-xl bg-coral text-paper text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Calendar size={13} />
                      <span>Use it tomorrow</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted text-center py-8">Select a phrase to view details.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Conversations */}
        {activeTab === "conversations" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {saveState.conversationHistory.length === 0 ? (
              <div className="p-12 text-center text-muted text-xs">
                No conversation history yet. Talk to neighbours around town to record dialogues!
              </div>
            ) : (
              saveState.conversationHistory.map((convo) => (
                <div key={convo.id} className="bg-paper border border-line rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-line text-xs">
                    <div className="font-bold text-ink flex items-center gap-1.5">
                      <MessageCircle size={15} className="text-coral" />
                      <span>Conversation with {convo.npcName}</span>
                    </div>
                    <span className="text-muted text-[11px]">
                      Day {convo.day} · {convo.completedAt}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {convo.turns.map((turn) => (
                      <div key={turn.id} className="text-xs">
                        <span className="font-bold text-ink mr-1.5">{turn.speakerName}:</span>
                        <span className="text-ink">{turn.text}</span>
                        {turn.translation && (
                          <span className="text-muted block text-[11px] italic mt-0.5">
                            {turn.translation}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Corrections */}
        {activeTab === "corrections" && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {allCorrections.length === 0 ? (
              <div className="p-12 text-center text-muted text-xs">
                <Sparkles size={24} className="mx-auto mb-2 text-sun" />
                <p>No corrections yet! Speak and type freely — helpful tips and alternatives will appear here.</p>
              </div>
            ) : (
              allCorrections.map((corr, idx) => (
                <div key={idx} className="bg-paper border border-line rounded-2xl p-3.5 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] text-muted mb-1">
                    <span>Day {corr.day} · {corr.npcName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                    <span className="line-through text-danger">"{corr.original}"</span>
                    <span className="text-muted">→</span>
                    <span className="text-sage font-bold">"{corr.suggested}"</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{corr.explanation}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Journey Milestones */}
        {activeTab === "journey" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <div className="bg-sand/30 border border-line rounded-2xl p-4">
              <span className="text-xs font-bold text-coral uppercase tracking-wider block mb-1">
                Completed Milestones
              </span>
              <p className="text-xs text-muted mb-3">
                Tasks accomplished in your target language across the 7 chapters.
              </p>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                  const scen = saveState.scenarios[dayNum];
                  const doneTasks = scen.tasks.filter((t) => t.status === "done" || t.status === "done-with-help");

                  return (
                    <div key={dayNum} className="bg-paper border border-line rounded-xl p-3 text-xs">
                      <div className="flex items-center justify-between font-bold text-ink mb-1">
                        <span>{scen.chapterTitle}</span>
                        <span className="text-muted font-normal text-[11px]">
                          {doneTasks.length} / {scen.tasks.length} tasks
                        </span>
                      </div>
                      <div className="space-y-1">
                        {scen.tasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-2 text-[11px] text-muted">
                            {task.status === "done" || task.status === "done-with-help" ? (
                              <Check size={12} className="text-sage shrink-0" strokeWidth={3} />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full border border-line shrink-0" />
                            )}
                            <span className={task.status === "done" ? "text-ink font-medium" : ""}>
                              {task.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
