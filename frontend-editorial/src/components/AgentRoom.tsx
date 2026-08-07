"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import Masthead from "./Masthead";
import SignatureVisualizer from "./SignatureVisualizer";
import TranscriptLog from "./TranscriptLog";

export default function AgentRoom() {
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = useCallback(async () => {
    try {
      setConnecting(true);
      const res = await fetch("/api/token", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to get token");
      }

      setServerUrl(data.serverUrl);
      setToken(data.participantToken);
    } catch (e) {
      console.error(e);
      setConnecting(false);
    }
  }, []);

  const handleDisconnect = () => {
    setToken("");
    setConnected(false);
    setConnecting(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto px-4 md:px-8 pb-8">
      <Masthead />

      <div className="flex-1 flex flex-col justify-center relative">
        {(!token || !connected) && !connecting && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-[var(--paper)] bg-opacity-80">
            <button
              onClick={handleConnect}
              className="px-8 py-3 border border-[var(--ink)] font-mono uppercase tracking-widest text-sm hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
            >
              Start Talking
            </button>
          </div>
        )}

        {connecting && !connected && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-[var(--paper)] bg-opacity-80">
            <span className="font-mono uppercase tracking-widest text-sm animate-pulse">
              Connecting...
            </span>
          </div>
        )}

        <LiveKitRoom
          serverUrl={serverUrl}
          token={token}
          connect={!!token}
          audio={true}
          video={false}
          onConnected={() => {
            setConnected(true);
            setConnecting(false);
          }}
          onDisconnected={handleDisconnect}
        >
          <RoomAudioRenderer />
          <SignatureVisualizer />
          <TranscriptLog />

          {connected && (
            <div className="w-full flex justify-center mt-12">
              <button
                onClick={handleDisconnect}
                className="px-6 py-2 border border-[var(--accent-primary)] text-[var(--accent-primary)] font-mono uppercase tracking-widest text-xs hover:bg-[var(--accent-primary)] hover:text-[var(--paper)] transition-colors"
              >
                End Connection
              </button>
            </div>
          )}
        </LiveKitRoom>
      </div>
    </div>
  );
}
