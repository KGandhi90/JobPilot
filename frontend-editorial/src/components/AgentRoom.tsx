"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import Masthead from "./Masthead";
import SignatureVisualizer from "./SignatureVisualizer";
import TranscriptLog from "./TranscriptLog";
import ControlsBar from "./ControlsBar";
import TextInput from "./TextInput";

export default function AgentRoom() {
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [micError, setMicError] = useState(false);

  const handleConnect = useCallback(async () => {
    try {
      setMicError(false);
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
        {micError && (
          <div className="absolute top-0 left-0 right-0 z-20 w-full bg-[var(--accent-primary)] text-[var(--paper)] px-4 py-3 text-center font-mono text-xs tracking-widest uppercase shadow-md">
            Microphone access denied. Please allow microphone permissions in your browser.
          </div>
        )}

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
            setMicError(false);
          }}
          onDisconnected={handleDisconnect}
          onMediaDeviceFailure={(e) => {
            setMicError(true);
            setConnecting(false);
            setToken("");
          }}
        >
          <RoomAudioRenderer />
          <SignatureVisualizer />
          <TranscriptLog />

          {connected && (
            <div className="w-full flex flex-col items-center mt-8 space-y-4">
              <TextInput />
              <ControlsBar onDisconnect={handleDisconnect} />
            </div>
          )}
        </LiveKitRoom>
      </div>
    </div>
  );
}
