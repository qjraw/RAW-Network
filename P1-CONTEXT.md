# P1-CONTEXT.md — Core Pipeline (text → content)
> Phase 1 discuss document. Captures implementation preferences before planning.

## Phase Goal

Build the foundational pipeline: text input → QJ RAW voice processing → platform-formatted content output.

## Architecture Questions to Resolve

### 1. Tech Stack

**Question:** What stack are we building this in?

Options:
- **A) Full Node.js/TypeScript** — n8n is JS-native, fast iteration, single language
- **B) Python backend + React frontend** — Better AI/ML libraries, separate concerns
- **C) n8n-first (workflow-native)** — Build as much as possible as n8n workflows, minimal custom code
- **D) Next.js full-stack** — React frontend + API routes, deploy as one unit

**Recommendation:** Option C (n8n-first) for the automation pipeline + Option D (Next.js) for the approval interface. Rationale: n8n handles the content pipeline natively (1,084 nodes), while Next.js gives us a clean approval UI that respects UIUX Promax constraints.

### 2. Voice Engine — How to Capture QJ RAW's Voice

**Question:** How do we define and enforce your voice?

Needs from you:
- [ ] 5-10 example posts/pieces that sound like "you"
- [ ] Words/phrases you always use
- [ ] Words/phrases you never use
- [ ] Tone descriptors (e.g., direct, raw, no-bullshit, poetic-when-it-matters)
- [ ] Any content you've seen that made you think "that's how I want to sound"

This becomes the `voice-profile.json` — the identity enforcement layer.

### 3. Platform Priority

**Question:** Which platforms first?

- [ ] X / Twitter
- [ ] Instagram (feed? stories? reels captions?)
- [ ] LinkedIn
- [ ] TikTok (captions)
- [ ] YouTube (descriptions, titles)
- [ ] Blog / personal site
- [ ] Email newsletter
- [ ] Other: ___

### 4. Input Method

**Question:** How will you primarily input raw content?

- [ ] Typing into a web interface
- [ ] Voice memos (phone → transcription)
- [ ] Photos with context
- [ ] Video clips
- [ ] Obsidian notes from vault
- [ ] All of the above (eventually)

### 5. Deployment Target

**Question:** Where does this run?

- [ ] Self-hosted (your own server / VPS)
- [ ] Cloud (Vercel + hosted n8n)
- [ ] Local-first (runs on your machine)
- [ ] Hybrid

### 6. n8n Instance

**Question:** Do you have an n8n instance running, or do we need to set one up?

- [ ] I have one running at: ___
- [ ] I need to set one up
- [ ] I'll use n8n Cloud

---

## Decisions Made So Far

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | QRAWTHINK + GSD | Context management + spec-driven development |
| Front-end rules | UIUX Promax | No AI slop, accessible, semantic tokens |
| Automation engine | n8n | 1,084 nodes, MCP integration, workflow-native |

## What's Blocking Planning

The P1-PLAN.md cannot be created until the questions above are answered. These are the "gray areas" that GSD requires resolving in the discuss phase — not during execution.

---

*Answer these questions and I build the plan.*
