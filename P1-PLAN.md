# P1-PLAN.md — Core Pipeline (text → content)
> XML task plan. Verified against REQUIREMENTS.md (R01, R02, R03).
> Execute via wave-grouped subagents.

## Prerequisites (User Action Required)

Before Wave 1 can execute:
- [ ] Sign up for n8n Cloud at https://n8n.io/cloud
- [ ] Provide n8n Cloud URL + API key
- [ ] Provide Terminal EP1, EP7, and Cathedral Transmission 001-003 text (for voice calibration)

---

## Wave 1 — Foundation (no dependencies, run in parallel)

```xml
<task id="P1-01" type="auto" wave="1">
  <name>Initialize Next.js approval UI project</name>
  <files>
    app/package.json
    app/tsconfig.json
    app/tailwind.config.ts
    app/src/app/layout.tsx
    app/src/app/page.tsx
    app/src/lib/design-tokens.css
  </files>
  <action>
    Scaffold Next.js 14+ app with TypeScript, Tailwind CSS, and App Router.
    Create design token CSS file with semantic color tokens per UIUX Promax rules
    (--color-primary, --color-surface, --color-text, etc.).
    Light/dark mode support from day one.
    Mobile-first responsive layout shell.
    Deploy target: Vercel.
  </action>
  <verify>npm run build completes with zero errors</verify>
  <done>Next.js app scaffolded, builds clean, design tokens defined, responsive layout shell renders</done>
</task>

<task id="P1-02" type="auto" wave="1">
  <name>Create voice engine prompt system</name>
  <files>
    voice-profile.json (already created)
    engine/voice-engine.md
    engine/prompts/linkedin-transform.md
    engine/prompts/substack-transform.md
  </files>
  <action>
    Using voice-profile.json as the identity enforcement spec, create:
    1. voice-engine.md — system prompt that enforces QJ RAW voice on all output.
       Includes tone rules, vocabulary enforcement, guardrails, rejection criteria.
    2. linkedin-transform.md — prompt template that takes raw input and produces
       LinkedIn-formatted post (hook → tension → insight → signal structure,
       max 3000 chars, minimal hashtags, sovereign CTA).
    3. substack-transform.md — prompt template that takes raw input and produces
       Substack article (cold open → body → transmission close, longer form,
       more poetic register allowed).
    Each prompt must reference voice-profile.json vocabulary and guardrails.
  </action>
  <verify>
    Manual review: run a test input through each prompt template in Claude
    and confirm output matches voice profile (uses always_use words, avoids
    never_use words, matches tone descriptors).
  </verify>
  <done>Voice engine system prompt + 2 platform transform prompts exist and produce on-brand output</done>
</task>

<task id="P1-03" type="auto" wave="1">
  <name>Design n8n workflow architecture</name>
  <files>
    workflows/architecture.md
    workflows/pipeline-flow.json
  </files>
  <action>
    Design the n8n workflow architecture document covering:
    1. Webhook trigger node (receives raw input via HTTP POST)
    2. Input router node (detects type: text, voice memo URL, image URL)
    3. Transcription branch (for voice — use OpenAI Whisper node or Deepgram)
    4. Voice engine node (Claude/OpenAI node with voice-engine.md system prompt)
    5. Platform splitter (fan-out to LinkedIn transform + Substack transform)
    6. Output formatter (structure for approval UI consumption)
    7. Webhook response (sends formatted content back to approval UI)

    Create pipeline-flow.json as the n8n workflow JSON skeleton.
    Use n8n node names and properties from MCP documentation.
    Mark nodes that require credentials setup.
  </action>
  <verify>architecture.md is complete, pipeline-flow.json is valid JSON</verify>
  <done>n8n workflow architecture documented, skeleton JSON created with correct node types</done>
</task>
```

## Wave 2 — Integration (depends on Wave 1)

```xml
<task id="P1-04" type="auto" wave="2">
  <name>Build approval interface components</name>
  <files>
    app/src/components/ContentCard.tsx
    app/src/components/ApprovalActions.tsx
    app/src/components/ContentInput.tsx
    app/src/components/PlatformBadge.tsx
    app/src/app/api/submit/route.ts
    app/src/app/api/approve/route.ts
  </files>
  <action>
    Build the approval UI with these components:

    ContentCard — displays generated content for a single platform.
    Shows: platform badge, formatted preview, character count, voice score.
    UIUX Promax: 4.5:1 contrast, 44px touch targets, semantic tokens only.

    ApprovalActions — approve / edit / reject buttons per content piece.
    Single-tap approve triggers deployment. Edit opens inline editor.
    Reject discards with optional reason capture.

    ContentInput — text area + voice memo upload for raw input submission.
    Voice-first: prominent mic icon, drag-drop for audio files.
    Text input as secondary with clear visual hierarchy.

    PlatformBadge — visual indicator for LinkedIn / Substack.

    API routes:
    POST /api/submit — accepts raw input, forwards to n8n webhook, returns job ID.
    POST /api/approve — accepts approval decision, triggers n8n distribution workflow.
  </action>
  <verify>
    npm run build passes.
    Components render correctly in browser.
    Touch targets >= 44px verified.
    Contrast ratio >= 4.5:1 on all text.
    Light and dark mode both functional.
  </verify>
  <done>Approval UI renders content cards with approve/edit/reject, input accepts text + audio, API routes respond</done>
</task>

<task id="P1-05" type="auto" wave="2">
  <name>Build n8n content pipeline workflow</name>
  <files>
    workflows/content-pipeline.json
  </files>
  <action>
    Using the architecture from P1-03 and voice prompts from P1-02,
    build the complete n8n workflow JSON:

    1. Webhook trigger — POST /webhook/raw-input
    2. Input type detection — check for text vs audio URL vs image URL
    3. Text path: pass directly to voice engine
    4. Audio path: Whisper transcription → voice engine (mark as future — stub for now)
    5. Voice engine: Claude node with voice-engine.md system prompt
    6. Platform fan-out: parallel paths for LinkedIn + Substack
    7. LinkedIn transform: Claude node with linkedin-transform.md prompt
    8. Substack transform: Claude node with substack-transform.md prompt
    9. Merge results
    10. Webhook response: return both formatted pieces to approval UI

    All Claude/AI nodes use voice-profile.json guardrails for output validation.
    Stub the audio/image paths with TODO markers for P3.
  </action>
  <verify>Valid n8n workflow JSON that can be imported into n8n Cloud</verify>
  <done>Complete content pipeline workflow JSON ready for n8n Cloud import</done>
</task>
```

## Wave 3 — End-to-End Verification (depends on Wave 2)

```xml
<task id="P1-06" type="auto" wave="3">
  <name>Integration test — text input end-to-end</name>
  <files>
    tests/e2e-text-pipeline.md
  </files>
  <action>
    Create an end-to-end test document that:
    1. Defines 3 test inputs (short thought, medium paragraph, long raw dump)
    2. Expected behavior at each pipeline stage
    3. Voice profile compliance checklist per output
    4. Platform format verification (LinkedIn char limit, Substack structure)
    5. Approval flow verification (approve triggers response, reject discards)

    This is a manual test plan for now — automated E2E comes in M2.
  </action>
  <verify>Test document exists with clear pass/fail criteria</verify>
  <done>E2E test plan covers the full text pipeline with measurable acceptance criteria</done>
</task>
```

---

## Wave Summary

| Wave | Tasks | Parallel? | Depends On |
|------|-------|-----------|------------|
| 1 | P1-01, P1-02, P1-03 | Yes (3 parallel) | Prerequisites only |
| 2 | P1-04, P1-05 | Yes (2 parallel) | Wave 1 |
| 3 | P1-06 | Sequential | Wave 2 |

## Requirements Traceability

| Requirement | Tasks |
|-------------|-------|
| R01 (text → content) | P1-02, P1-03, P1-05 |
| R02 (voice enforcement) | P1-02, P1-05 |
| R03 (1 platform format) | P1-02, P1-04, P1-05 |

---

*Plan verified against REQUIREMENTS.md. Ready for execution after prerequisites.*
