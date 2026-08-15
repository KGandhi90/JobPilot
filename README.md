# JobPilot — Voice AI Job Application Assistant

> **JobPilot** is a voice-first AI assistant for Indian job seekers. Talk to it to log applications, get real-time company research, and practice mock interviews with a specialist agent. Built with Deepgram STT, Groq LLM, and Murf Falcon TTS on LiveKit. Features hybrid Supabase + Excel memory, outbound SIP calls, human escalation, and a live analytics dashboard.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Murf Falcon](https://img.shields.io/badge/TTS-Murf%20Falcon-6366F1)](https://murf.ai/api/docs/text-to-speech/streaming)
[![LiveKit](https://img.shields.io/badge/Transport-LiveKit-002cf2)](https://docs.livekit.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://www.python.org/)

---

## What It Does

JobPilot works in two modes:

**Inbound (Browser):** Open the web app and speak. Log new job applications, update existing ones, get a summary of all your tracked roles, and research companies — all by voice. A live **Dispatch Desk** analytics dashboard at `/dispatch` tracks your call success rate in real time.

**Outbound (SIP):** JobPilot calls *you* on your phone via a SIP trunk for a scheduled daily interview practice session. Pick the role and difficulty, and a specialist Interview Coach agent grills you like a hiring manager, then gives structured STAR-method feedback on your answer.

---

## Architecture

```mermaid
flowchart LR
    A[🎙️ User speaks] -->|audio| B[Deepgram STT]
    B -->|text| C[Groq LLM]
    C -->|response text| D[Murf Falcon TTS]
    D -->|audio| E[LiveKit]
    E -->|stream| F[🔊 User hears]

    style A fill:#444441,stroke:#888780,color:#fff
    style B fill:#185FA5,stroke:#85B7EB,color:#fff
    style C fill:#534AB7,stroke:#AFA9EC,color:#fff
    style D fill:#0F6E56,stroke:#5DCAA5,color:#fff
    style E fill:#D85A30,stroke:#F0997B,color:#fff
    style F fill:#444441,stroke:#888780,color:#fff
```

---

## Why Murf Falcon

- **55ms model latency** — fastest production TTS available
- **130ms time-to-first-audio** across 10+ global regions
- **150+ voices** across 35+ languages including Indian English (Anisha, Samar, Pooja)
- **99.38% pronunciation accuracy**
- **$0.01/1000 characters** — up to 10x cheaper than alternatives

JobPilot uses **Anisha** (Indian English, female) as the main agent voice and **Samar** (Indian English, male) for the Interview Coach specialist — making the agent handoff audibly clear.

---

## Features

### 🎙️ Voice Pipeline
Full real-time voice pipeline: Deepgram `nova-3` (multilingual STT) → Groq `llama-3.3-70b-versatile` (LLM) → Murf Falcon (TTS), orchestrated by LiveKit Agents SDK with Silero VAD and the Multilingual turn detector.

### 🧠 Hybrid Memory
Two-layer memory system:
- **Supabase** (cloud PostgreSQL) — all applications stored persistently across sessions
- **Excel** (`job_applications.xlsx`) — loaded at startup via Pandas and injected into the system prompt as historical context

### 🔍 Real-Time Company Research
The `search_company_background` tool calls the Wikipedia REST API to fetch a plain-text company summary whenever the user mentions a new company they applied to.

### 📞 Outbound SIP Calls
`backend/src/dial.py` uses the LiveKit Python Server SDK to create a room, dispatch the outbound Interview Coach agent, and dial a SIP URI. Works with Linphone and any SIP-compatible soft phone.

> **Note:** In Linphone, go to Preferences → Calls → Media Encryption → set to **None** to prevent calls from dropping immediately.

### 🆘 Human Escalation
The `create_escalation` tool handles two situations:
1. User requests professional career coaching or human resume review
2. User is clearly frustrated or stuck

The agent asks for permission first, generates a unique `#REF-XXXXXX` ticket ID, saves a privacy-safe record to `backend/escalations.json`, and reads the reference ID back to the user.

### 📊 Call Analytics — Dispatch Desk
A live broadcast-styled dashboard at `http://localhost:3000/dispatch`:
- **Total calls / Successful / Failed** in large mono numerals
- **Success rate** percentage
- **Recent call history** manifest (timestamp, channel, duration, outcome)
- Auto-refreshes every 3 seconds by polling `/api/analytics`
- Backed by `backend/analytics.json`, written on every room disconnect

### 🤝 Agent Handoff to Specialist
The main `Assistant` agent can hand the live conversation to a dedicated `InterviewAgent` specialist. The specialist:
- Gets its own system prompt (interview-only, cannot track applications)
- Uses the **Samar** voice to signal the switch
- Receives full conversation history via `chat_ctx.copy(exclude_instructions=True)`
- Auto-introduces itself via an `on_enter()` hook

---

## Quickstart

### Prerequisites

- **Python** 3.10+
- **[uv](https://docs.astral.sh/uv/)** — fast Python package manager
  ```bash
  # macOS/Linux
  curl -LsSf https://astral.sh/uv/install.sh | sh
  # Windows (PowerShell)
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
  ```
- **Node.js** 18+
- **pnpm**
  ```bash
  npm install -g pnpm
  ```
- A [LiveKit Cloud](https://cloud.livekit.io/) project (free tier available)

### Step 1: Clone the repo

```bash
git clone https://github.com/KGandhi90/JobPilot.git
cd JobPilot
```

### Step 2: Set up environment variables

Create `.env.local` in `backend/` and `frontend-editorial/` (copy from `.env.example` in each).

| Variable | Where to get it | Required |
|---|---|---|
| `LIVEKIT_URL` | LiveKit Cloud dashboard | ✅ |
| `LIVEKIT_API_KEY` | LiveKit Cloud dashboard | ✅ |
| `LIVEKIT_API_SECRET` | LiveKit Cloud dashboard | ✅ |
| `MURF_API_KEY` | [murf.ai/api/dashboard](https://murf.ai/api/dashboard) | ✅ |
| `DEEPGRAM_API_KEY` | [deepgram.com](https://deepgram.com) | ✅ |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) | ✅ |
| `SUPABASE_URL` | [supabase.com](https://supabase.com) dashboard | ✅ |
| `SUPABASE_KEY` | Supabase project API key | ✅ |
| `SIP_TRUNK_ID` | LiveKit SIP dashboard | For outbound calls only |

> ⚠️ **Never commit your `.env.local` files.** They are already in `.gitignore`.

### Step 3: Install backend dependencies

```bash
cd backend
uv sync
uv run python src/agent.py download-files
```

### Step 4: Install frontend dependencies

```bash
cd frontend-editorial
pnpm install
```

### Step 5: Run everything

```powershell
# Windows (from the Day1/ root)
.\start_app.ps1
```

```bash
# macOS/Linux
chmod +x start_app.sh && ./start_app.sh
```

This starts the backend agent and the Next.js frontend in separate windows.

Open **http://localhost:3000** and click **Start Talking**.  
Open **http://localhost:3000/dispatch** for the live analytics dashboard.

### Optional: Outbound Interview Call

```bash
cd backend
uv run python src/dial.py
```

This places a SIP call to the number configured in `dial.py`. Make sure Linphone (or your SIP client) is running with Media Encryption set to **None**.

---

## Project Structure

```
Day1/
├── backend/
│   ├── src/
│   │   ├── agent.py              # Main inbound agent (Assistant + InterviewAgent)
│   │   ├── outbound_agent.py     # Outbound Interview Coach agent
│   │   └── dial.py               # Script to place outbound SIP calls
│   ├── analytics.json            # Auto-generated call outcome records
│   ├── escalations.json          # Auto-generated human escalation tickets
│   ├── job_applications.xlsx     # Local application dataset (Pandas)
│   ├── .env.example
│   └── pyproject.toml
├── frontend-editorial/
│   ├── src/app/
│   │   ├── page.tsx              # Homepage / voice session UI
│   │   ├── dispatch/page.tsx     # Dispatch Desk analytics dashboard
│   │   ├── dashboard/page.tsx    # Alias for /dispatch
│   │   └── api/analytics/route.ts # API endpoint for analytics polling
│   ├── .env.example
│   └── package.json
├── BUILD_SUMMARY.md              # Day-by-day build log
├── start_app.ps1                 # Windows launcher
├── start_app.sh                  # macOS/Linux launcher
└── README.md
```

---

## Configuration

### Voices

Edit `tts=murf.TTS(voice="...")` in `agent.py` or `outbound_agent.py`:

| Voice | Accent | Gender |
|---|---|---|
| `Anisha` | Indian English | Female (main agent default) |
| `Samar` | Indian English | Male (specialist default) |
| `Pooja` | Indian English | Female |
| `Amara` | US English | Female |
| `Gordon` | US English | Male |

Browse all 150+ voices: [Murf Voice Library](https://murf.ai/api/docs/voices-styles/voice-library)

### LLM

JobPilot uses **Groq** (`llama-3.3-70b-versatile`) for its speed and quality. To swap to another LLM, change the `llm=groq.LLM(...)` call in `agent.py` to any LiveKit-compatible LLM plugin.

### Supabase Schema

Create a `job_applications` table in your Supabase project:

```sql
create table job_applications (
  id uuid default gen_random_uuid() primary key,
  company text,
  role text,
  status text,
  applied_date text,
  notes text
);
```

---

## 📝 Blog Post

Read the full build story — architecture, features, challenges, and how to run it yourself:

🔗 **[How I Built JobPilot: A Voice AI Job Application Assistant in 10 Days](#)** ← *https://dev.to/kgandhi90/jobpilot-a-10-day-build-log-for-a-voice-first-job-assistant-2abf*

---

## Links

- [Murf API Docs](https://murf.ai/api/docs)
- [Murf Voice Library](https://murf.ai/api/docs/voices-styles/voice-library)
- [Murf Falcon Benchmarks](https://murf.ai/falcon/benchmarks)
- [LiveKit Docs](https://docs.livekit.io)
- [LiveKit Agents SDK](https://docs.livekit.io/agents)
- [Deepgram Docs](https://developers.deepgram.com)
- [Supabase Docs](https://supabase.com/docs)
- [Groq Console](https://console.groq.com)
- [Murf Discord](https://discord.gg/FbKAy96Sz7)

---

## License

MIT
