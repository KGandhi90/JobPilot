"use client";

import React, { useState, useEffect } from "react";
import { useLocalParticipant } from "@livekit/components-react";

interface ControlsBarProps {
  onDisconnect: () => void;
}

export default function ControlsBar({ onDisconnect }: ControlsBarProps) {
  const { localParticipant } = useLocalParticipant();
  const [isMicEnabled, setIsMicEnabled] = useState(false);

  useEffect(() => {
    if (localParticipant) {
      setIsMicEnabled(localParticipant.isMicrophoneEnabled);
    }
  }, [localParticipant, localParticipant?.isMicrophoneEnabled]);

  const toggleMic = () => {
    if (localParticipant) {
      const newState = !localParticipant.isMicrophoneEnabled;
      localParticipant.setMicrophoneEnabled(newState);
      setIsMicEnabled(newState);
    }
  };

  return (
    <div className="w-full flex justify-center items-center gap-4 mt-8">
      <button
        onClick={toggleMic}
        className={`px-6 py-2 border font-mono uppercase tracking-widest text-xs transition-colors ${
          isMicEnabled 
            ? "border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]" 
            : "border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--paper)] hover:bg-[var(--accent-primary)] hover:text-[var(--paper)]"
        }`}
      >
        {isMicEnabled ? "Mic On" : "Mic Muted"}
      </button>

      <button
        onClick={onDisconnect}
        className="px-6 py-2 border border-[var(--ink)] text-[var(--ink)] font-mono uppercase tracking-widest text-xs hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors opacity-70 hover:opacity-100"
      >
        End Connection
      </button>
    </div>
  );
}
