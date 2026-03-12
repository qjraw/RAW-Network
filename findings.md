# Findings — RAW Network
> Major findings and decisions logged during sessions.

## 2026-03-12

### GSD Framework
- Source: github.com/glittercowboy/get-shit-done
- Core value: Prevents context rot by using fresh 200k-token subagent windows per task
- Phase lifecycle: discuss → plan → execute → verify
- Plans use XML task format with embedded verification criteria
- Atomic commits per task enable precise git bisect

### UIUX Promax
- Source: github.com/nextlevelbuilder/ui-ux-pro-max-skill
- 50+ styles, 161 palettes, 57 font pairings, 99 UX guidelines
- Critical rules: 4.5:1 contrast, 44px touch targets, 100ms feedback
- Design system must be generated before any component code

### n8n MCP
- Source: github.com/czlonkowski/n8n-mcp
- 1,084 nodes (537 core + 547 community), 99% property coverage
- 2,709 workflow templates available for reference
- Requires MCP_MODE=stdio to prevent JSON-RPC parse errors
- Safety: never edit production workflows directly

### QRAWTHINK Cognitive Stack
- User's custom operational OS for Claude sessions
- Layered routing: local vault → web search → API docs → SaaS automation
- Mandatory memory protocol with session start/end hygiene
- Delegation threshold: >5 tool calls = spawn sub-agent

### RAW Network Architecture (defined)
- Primary objective: raw input → QJ RAW-voiced content → multi-channel distribution → single-tap approval
- 6-stage pipeline: Ingest → Voice → Content → Approval → Distribution → Feedback
- Confirmed stack: n8n Cloud (pipeline) + Next.js/Vercel (approval UI)
- 3 milestones: Foundation (core pipeline) → Scale (multi-platform) → Intelligence (cognitive layer)
- 14 requirements scoped across 7 phases

### Voice Profile (resolved)
- Tone: direct, raw, no-bullshit, poetic-when-it-matters, military-precise
- Archetype: "Marine who reads philosophy"
- Always use: frequency, transmission, terminal, sovereign, raw, goo phase, convergence, operator, deployed, signal
- Never use: journey, hustle, grind, authenticity (buzzword), content creator, In conclusion, I hope this helps
- Voice ceiling: Cathedral Transmissions 001-003
- Clearest samples: Terminal EP1 (Resilience), EP7 (Courage)
- Guardrails enforce vocabulary, reject LinkedIn influencer tone, limit emoji/exclamation marks

### Platform Strategy (resolved)
- M1: LinkedIn (conversion) + Substack (long-form, paid subs)
- M2: TikTok + Instagram
- Eventually: all platforms
- Input priority: voice-first → text → photos → video

### Deployment (resolved)
- n8n Cloud (new instance, needs setup)
- Vercel for Next.js approval UI
- Zero local machine dependency
