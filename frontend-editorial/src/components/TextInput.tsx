"use client";

import React, { useState } from "react";
import { useChat } from "@livekit/components-react";

export default function TextInput() {
  const { send } = useChat();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        await send(message.trim());
        setMessage("");
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mt-6 flex gap-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your prompt..."
        className="flex-1 bg-transparent border-b border-[var(--ink)] py-2 px-1 text-sm font-sans focus:outline-none placeholder:opacity-50 text-[var(--ink)]"
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className="px-4 py-2 border border-[var(--ink)] font-mono uppercase tracking-widest text-[10px] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--ink)]"
      >
        Send
      </button>
    </form>
  );
}
