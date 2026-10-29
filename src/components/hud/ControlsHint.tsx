"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export const ControlsHint: React.FC = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="paper-glass px-3 py-1.5 rounded-full text-[11px] font-medium text-ink shadow-xs flex items-center gap-2 select-none">
      <span>Click or Tap to move</span>
      <span className="text-muted/60">·</span>
      <span className="flex items-center gap-1">
        <kbd className="px-1.5 py-0.5 rounded bg-sand border border-line font-mono text-[10px] font-bold">
          WASD
        </kbd>
        <span>Keys</span>
      </span>
      <span className="text-muted/60">·</span>
      <span className="flex items-center gap-1">
        <kbd className="px-1.5 py-0.5 rounded bg-sand border border-line font-mono text-[10px] font-bold">
          E
        </kbd>
        <span>to talk</span>
      </span>
      <button
        onClick={() => setVisible(false)}
        className="text-muted hover:text-ink ml-1"
        aria-label="Dismiss controls hint"
      >
        <X size={12} />
      </button>
    </div>
  );
};
