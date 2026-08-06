"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { useLocalParticipant, useTrackTranscription, useVoiceAssistant, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";

export default function TranscriptLog() {
  const { localParticipant } = useLocalParticipant();
  const { audioTrack: agentTrack } = useVoiceAssistant();

  // Reactively fetch microphone tracks in the room
  const tracks = useTracks([Track.Source.Microphone]);
  // Find the local user's microphone track
  const userTrack = useMemo(() => {
    return tracks.find((t) => t.participant.identity === localParticipant?.identity);
  }, [tracks, localParticipant]);

  const { segments: userSegments } = useTrackTranscription(userTrack);
  const { segments: agentSegments } = useTrackTranscription(agentTrack);

  const scrollRef = useRef<HTMLDivElement>(null);

  const allSegments = useMemo(() => {
    const combined = [
      ...userSegments.map(s => ({ ...s, speaker: "User" })),
      ...agentSegments.map(s => ({ ...s, speaker: "Agent" }))
    ];
    return combined.sort((a, b) => (a.firstReceivedTime || a.startTime || 0) - (b.firstReceivedTime || b.startTime || 0));
  }, [userSegments, agentSegments]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allSegments]);

  if (allSegments.length === 0) {
    return (
      <div className="w-full text-center py-12 opacity-40 italic font-serif">
        The transcript will appear here.
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="w-full max-w-3xl mx-auto flex flex-col space-y-6 overflow-y-auto max-h-[40vh] pb-8 scrollbar-hide px-4"
    >
      {allSegments.map((msg) => {
        return (
          <div key={msg.id} className={`w-full flex flex-col pt-4 border-t border-[var(--rule)] ${msg.final ? "opacity-100" : "opacity-70"}`}>
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-secondary)]">
                {msg.speaker} {!msg.final && "(typing...)"}
              </span>
            </div>
            <p className="font-sans text-lg text-[var(--ink)] leading-relaxed">
              {msg.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}

