# P1-CONTEXT.md — Core Pipeline (text → content)
> Phase 1 discuss document. All decisions resolved 2026-03-12.

## Phase Goal

Build the foundational pipeline: voice/text input → QJ RAW voice processing → LinkedIn + Substack formatted content → approval interface.

## Resolved Decisions

### 1. Tech Stack — CONFIRMED

- **Pipeline:** n8n Cloud (workflow-native, no local dependency)
- **Approval UI:** Next.js on Vercel
- **Voice Engine:** Prompt-based with `voice-profile.json` identity layer

### 2. Voice Profile — QJ RAW

**Tone (5 words):** direct, raw, no-bullshit, poetic-when-it-matters, military-precise

**Always use:**
frequency, transmission, terminal, sovereign, raw, goo phase, convergence, operator, deployed, signal

**Never use:**
"journey," "hustle," "grind," "authenticity" (as buzzword), "content creator," "In conclusion," "I hope this helps"

**Voice references:**
- Terminal EP1 (Resilience) — clearest voice sample
- Terminal EP7 (Courage) — clearest voice sample
- Cathedral Transmissions 001, 002, 003 — written voice ceiling

**Voice rules:**
- Write like a Marine who reads philosophy
- Short sentences hit harder than long ones
- Metaphor is a weapon, not decoration
- Every word earns its place or gets cut
- Vulnerability is strength, not softness
- No corporate polish. No AI slop. No filler.

### 3. Platforms — M1 Priority

1. **LinkedIn** — where RAW Sessions conversions happen
2. **Substack** — long-form, newsletter, paid subscribers

M2 additions: TikTok, Instagram. All platforms eventually.

### 4. Input Method — Voice-First

- **Primary:** Voice memos (phone → transcription → pipeline)
- **Secondary:** Text input
- **Tertiary:** Photos, video
- **Architecture:** Build voice-first, everything else follows same pipeline after ingest

### 5. Deployment — Cloud

- **n8n:** n8n Cloud (new instance needed)
- **Approval UI:** Vercel (Next.js)
- **No local machine dependency**

### 6. n8n Instance — New Setup Required

- No existing instance
- Will use n8n Cloud
- Need to provision before P1 execution

## Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | QRAWTHINK + GSD | Context management + spec-driven development |
| Front-end rules | UIUX Promax | No AI slop, accessible, semantic tokens |
| Pipeline engine | n8n Cloud | Workflow-native, 1,084 nodes, no local dependency |
| Approval UI | Next.js + Vercel | Clean deploy, UIUX Promax compliant |
| Voice identity | voice-profile.json | Enforceable, versionable, auditable |
| Platform priority | LinkedIn + Substack | Where money moves |
| Input priority | Voice-first | Primary use case, everything else inherits pipeline |
| Voice tone | direct, raw, military-precise, poetic | Marine who reads philosophy |

---

*Discuss phase complete. Ready for P1-PLAN.md.*
