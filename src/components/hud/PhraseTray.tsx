"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { audioService } from "@/lib/speech";
import { MessageSquare, Volume2, ChevronUp, ChevronDown } from "lucide-react";

export const PhraseTray: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { saveState } = useGame();
  const currentScenario = saveState.scenarios[saveState.currentDay];
  const targetLang = saveState.targetLanguage;

  const samplePhrasesByDay: Record<number, Array<{ text: string; translation: string }>> = {
    1: [
      { text: "Bonjour ! Je m'appelle...", translation: "Hello! My name is..." },
      { text: "Enchanté de faire votre connaissance.", translation: "Pleased to make your acquaintance." },
      { text: "Où se trouve l'épicerie ?", translation: "Where is the grocery store located?" },
    ],
    2: [
      { text: "Bonjour, je voudrais trois pommes.", translation: "Hello, I would like three apples." },
      { text: "Combien ça coûte au total ?", translation: "How much does it cost in total?" },
      { text: "Voilà, merci beaucoup !", translation: "Here you go, thank you very much!" },
    ],
    3: [
      { text: "Où va cette ligne de bus ?", translation: "Where does this bus route go?" },
      { text: "Un ticket de bus, s'il vous plaît.", translation: "A bus ticket, please." },
      { text: "À quelle heure arrive le prochain ?", translation: "What time does the next one arrive?" },
    ],
    4: [
      { text: "Un café et un croissant, s'il vous plaît.", translation: "A coffee and a croissant, please." },
      { text: "Puis-je m'installer en terrasse ?", translation: "May I sit on the terrace?" },
      { text: "L'addition, s'il vous plaît.", translation: "The bill, please." },
    ],
    5: [
      { text: "Il y a une fuite d'eau dans la salle de bain.", translation: "There is a water leak in the bathroom." },
      { text: "Quand le réparateur peut-il venir ?", translation: "When can the repairer visit?" },
      { text: "C'est assez urgent, merci.", translation: "It is quite urgent, thank you." },
    ],
    6: [
      { text: "Bonsoir ! Je viens d'emménager dans le quartier.", translation: "Good evening! I just moved into the neighbourhood." },
      { text: "J'aime beaucoup l'ambiance de cette ville.", translation: "I really like the atmosphere of this town." },
      { text: "Et vous, vous habitez ici depuis longtemps ?", translation: "And you, have you lived here for a long time?" },
    ],
    7: [
      { text: "Bonjour, je voudrais passer ma commande.", translation: "Hello, I would like to place my order." },
      { text: "Merci pour tout cette semaine !", translation: "Thank you for everything this week!" },
      { text: "À très bientôt, bonne journée !", translation: "See you soon, have a great day!" },
    ],
  };

  const phrases = samplePhrasesByDay[saveState.currentDay] || samplePhrasesByDay[2];

  const handlePlayPhrase = (text: string) => {
    audioService.speak(text, targetLang, saveState.settings.speechRate);
  };

  return (
    <div className="select-none flex flex-col items-start">
      {isOpen ? (
        <div className="w-[320px] max-w-[85vw] paper-glass p-3 rounded-2xl shadow-e1 mb-2 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-line">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Useful phrases for today
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-ink p-1 rounded-full"
              aria-label="Close phrase tray"
            >
              <ChevronDown size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {phrases.map((phrase, idx) => (
              <div
                key={idx}
                className="bg-sand/50 rounded-xl p-2 flex items-start justify-between gap-2 hover:bg-sand transition-colors"
              >
                <div className="text-xs">
                  <div className="font-semibold text-ink">{phrase.text}</div>
                  <div className="text-muted text-[11px]">{phrase.translation}</div>
                </div>
                <button
                  onClick={() => handlePlayPhrase(phrase.text)}
                  className="p-1 rounded-full text-lagoon hover:bg-paper/80 transition-colors shrink-0"
                  title="Listen"
                  aria-label={`Listen to ${phrase.text}`}
                >
                  <Volume2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Collapsed Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="paper-glass px-3.5 py-2 rounded-full text-xs font-semibold text-ink shadow-sm hover:shadow-md flex items-center gap-2 transition-all"
        aria-label="Toggle phrase tray"
      >
        <MessageSquare size={14} className="text-lagoon" />
        <span>Today's key phrases</span>
        {isOpen ? <ChevronDown size={14} className="text-muted" /> : <ChevronUp size={14} className="text-muted" />}
      </button>
    </div>
  );
};
