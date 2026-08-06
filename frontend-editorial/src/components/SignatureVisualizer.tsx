"use client";

import React, { useEffect, useState } from "react";
import { useVoiceAssistant, useTrackVolume } from "@livekit/components-react";

export default function SignatureVisualizer() {
  const { state, audioTrack } = useVoiceAssistant();
  const agentVolume = useTrackVolume(audioTrack);
  const [vol, setVol] = useState(0);

  useEffect(() => {
    if (state === "speaking") {
      setVol(agentVolume);
    } else if (state === "listening") {
      setVol(Math.random() * 0.1);
    } else {
      setVol(0);
    }
  }, [state, agentVolume]);

  const isSpeaking = state === "speaking";

  return (
    <div className="flex flex-col items-center justify-center w-full py-16 px-4">
      <div className="relative w-full max-w-lg h-32 flex items-center justify-center">
        {/* Custom Wavy Line Visualizer */}
        <div
          className={`w-full max-w-xs flex items-center justify-center gap-2 transition-opacity duration-300 ${state === "disconnected" ? "opacity-30" : "opacity-100"
            }`}
        >
          {Array.from({ length: 20 }).map((_, i) => {
            const factor =
              0.4 + 0.6 * Math.sin((i / (20 - 1)) * Math.PI);

            return (
              <div
                key={i}
                className="w-1.5 bg-[var(--ink)] rounded-full transition-all duration-75"
                style={{
                  height: `${Math.max(4, vol * 150 * factor)}px`,
                }}
              />
            );
          })}
        </div>

        {/* ON AIR Indicator */}
        <div
          className={`absolute top-0 right-0 font-mono uppercase text-[10px] tracking-widest px-2 py-1 border rounded-sm transition-opacity duration-300 ${isSpeaking
            ? "opacity-100 border-[var(--ink)] text-[var(--ink)] animate-pulse"
            : "opacity-0 border-transparent text-transparent"
            }`}
        >
          ON AIR
        </div>

        {/* State Indicator (Eyebrow label) */}
        <div className="absolute -bottom-8 font-mono uppercase text-xs tracking-widest text-[var(--ink)] opacity-60">
          {state}
        </div>
      </div>
    </div>
  );
}
