# E2E Test Plan: Text Input Pipeline

**Task:** P1-06
**Version:** 1.0.0
**Type:** Manual test plan (automated E2E planned for M2)
**Requirements Coverage:** R01, R02, R03
**Date:** 2026-03-12
**Status:** Active

---

## 1. Test Inputs

Three test inputs representing the range of raw material QJ RAW would actually submit. These are unpolished, unformatted, and written as Jay would speak or type them.

### Input A: Short Thought (1-2 sentences)

```
My son asked me why I don't talk about Iraq. I told him some freight you carry doesn't fit in a conversation — it fits in a life.
```

- **Length:** 2 sentences
- **Content type:** `text`
- **Umbrella Court:** Broken
- **Signal density:** High (fatherhood + war + Terminal freight metaphor)

### Input B: Medium Paragraph (3-5 sentences)

```
Been thinking about the goo phase again. That stretch where everything you were dissolves and nothing you're becoming has solidified yet. People want to skip it. They want the transformation without the dissolution. But the goo is where the signal forms — you just can't see it yet because you're still liquid. The forge doesn't care if you're ready.
```

- **Length:** 6 sentences
- **Content type:** `text`
- **Umbrella Court:** Flame-Retardant
- **Signal density:** Medium-high (goo phase framework, forge metaphor, resilience theme)

### Input C: Long Raw Dump (8-15 sentences)

```
So I've been sitting with this idea for a week now and I can't shake it. Everyone's talking about AI replacing humans but nobody's asking the real question — what part of you was replaceable in the first place. Like if a machine can do your job, maybe your job wasn't the thing that made you sovereign. I watched guys in Iraq who had nothing — no rank, no resources, no guarantees they'd see tomorrow — and they were more alive than any tech bro optimizing his morning routine. There's something in the convergence of AI and identity that nobody wants to say out loud. The machine doesn't threaten the operator. It threatens the person who never became one. I've been building the Terminal curriculum around this exact fracture point. The ontological schism isn't AI vs human — it's constructed self vs forged self. One was built by algorithms and culture and consumer loops. The other was built by fire and loss and the decision to stand when standing made no sense. My digital twin project isn't about copying me. It's about proving that the raw signal — the thing that makes Jay Rodriguez Jay Rodriguez and not a LinkedIn avatar — that signal can't be replicated by prediction engines. It has to be lived. And if you haven't lived it, no prompt is going to save you.
```

- **Length:** 14 sentences
- **Content type:** `text`
- **Umbrella Court:** Electrified
- **Signal density:** Very high (AI + identity, Terminal curriculum, ontological schism, digital twin, Iraq, convergence thesis, operator framework)

---

## 2. Expected Behavior at Each Pipeline Stage

### 2.1 Webhook Ingestion

For each input, the approval UI sends a POST request to the n8n webhook.

**Expected request (Input A example):**

```json
POST /webhook/raw-input
Content-Type: application/json

{
  "type": "text",
  "content": "My son asked me why I don't talk about Iraq. I told him some freight you carry doesn't fit in a conversation — it fits in a life."
}
```

**Verification (all inputs):**

| Check | Criteria | Pass/Fail |
|-------|----------|-----------|
| HTTP method | POST | |
| Content-Type | `application/json` | |
| `type` field | Present, value is `"text"` | |
| `content` field | Present, non-empty string | |
| `audio_url` field | Absent or null | |
| `image_url` field | Absent or null | |
| Response code | 200 within 30 seconds | |
| Response body | Valid JSON with `linkedin`, `substack`, `metadata` keys | |

### 2.2 Input Router (Switch Node)

The Switch node evaluates `body.type` and routes to the correct path.

| Check | Criteria | Pass/Fail |
|-------|----------|-----------|
| Route selection | Input routed to `text` path (not voice_memo, not image) | |
| Text Pass-Through (Set node) | Content string passed to Voice Engine unchanged | |
| No transcription triggered | Audio stub node NOT executed | |
| No image captioning triggered | Image stub node NOT executed | |

### 2.3 Voice Engine (Claude AI Node)

The Voice Engine receives the raw text and processes it through the `voice-engine.md` system prompt. It refines the raw input while preserving Jay's signal.

**Expected behavior per input:**

#### Input A (Short Thought)

- **Retain:** The Iraq reference, the fatherhood detail, the freight metaphor, the emotional weight
- **Transform:** May expand slightly for context, sharpen the phrasing, ensure it lands as a complete thought
- **Must NOT do:** Over-explain, add context Jay didn't provide, soften the edge, add qualifiers

#### Input B (Medium Paragraph)

- **Retain:** Goo phase concept, dissolution/solidification metaphor, forge reference, the direct address ("People want to skip it")
- **Transform:** May tighten phrasing, improve rhythm per voice fingerprint rules (short declarative sentences, then one long one), add Terminal framework anchoring if needed
- **Must NOT do:** Turn it into advice, add "I" statements that weren't there, make it sound motivational

#### Input C (Long Raw Dump)

- **Retain:** Core thesis (AI threatens the unconstructed self, not the operator), Iraq grounding, digital twin reference, ontological schism framework, convergence thesis, the closing "no prompt is going to save you"
- **Transform:** Organize the stream-of-consciousness into a coherent through-line, sharpen redundancies, apply voice rhythm patterns, maintain the raw energy without the verbal wandering
- **Must NOT do:** Lose the anger, polish it into an essay voice, remove the specific references (Iraq, tech bro, LinkedIn avatar), add conclusions Jay didn't reach

### 2.4 LinkedIn Transform (Claude AI Node)

Each voice-engine output is transformed into LinkedIn format using `linkedin-transform.md`.

**Expected structure for all inputs:**

```
[HOOK — 1-2 lines, contradiction or hard truth, stops the scroll]

[TENSION — 2-4 short paragraphs, builds the argument, uses line breaks]

[INSIGHT — the turn, single undeniable truth]

[SIGNAL — closing line + CTA]
```

**Per-input expectations:**

| Aspect | Input A | Input B | Input C |
|--------|---------|---------|---------|
| Length | 150-200 words (short input = tighter output) | 200-280 words | 250-300 words |
| Hook | References silence/fatherhood/war directly | Opens with dissolution or the goo phase | Opens with the AI/human provocation |
| Tension | Brief — one or two paragraphs max | Develops the transformation metaphor | Builds the operator vs. constructed self argument |
| Insight | The freight metaphor lands | The forge truth | The "signal can't be replicated" thesis |
| CTA | "Book a RAW Session" or "Claim Your Frequency" | "Book a RAW Session" or "Claim Your Frequency" | "Book a RAW Session" or "Claim Your Frequency" |
| Character count | Under 3000 | Under 3000 | Under 3000 |

### 2.5 Substack Transform (Claude AI Node)

Each voice-engine output is transformed into Substack format using `substack-transform.md`.

**Expected structure for all inputs:**

```
[COLD OPEN — drops into the scene or argument, no preamble]

[BODY — develops the idea with lived experience anchoring, Terminal framework integration, longer paragraphs allowed, poetic register where earned]

[TRANSMISSION CLOSE — single line that echoes the opening, closes the loop]
```

**Per-input expectations:**

| Aspect | Input A | Input B | Input C |
|--------|---------|---------|---------|
| Length | 600-800 words (expanded from short seed) | 800-1200 words | 1000-1500 words |
| Cold open | Scene-setting — the moment the son asked | Drops into the goo phase experience directly | Opens with the AI provocation or an Iraq scene |
| Body | Expands on the freight metaphor, connects to Terminal curriculum, explores what it means to carry war into fatherhood | Develops the goo phase framework, anchors to lived experience (a specific goo phase Jay went through), connects to forge/steel metaphors | Full development of the AI/identity thesis, Iraq grounding, digital twin concept, ontological schism framework, convergence thesis |
| Transmission close | Echoes the opening — returns to the son, the question, or the freight | Returns to the goo/forge image | Returns to the "replaceable" question or the "no prompt is going to save you" line |

### 2.6 Response

The final response to the approval UI must be valid JSON with this exact structure:

```json
{
  "linkedin": {
    "content": "string — the full formatted LinkedIn post",
    "char_count": 1847
  },
  "substack": {
    "content": "string — the full formatted Substack article",
    "word_count": 923
  },
  "metadata": {
    "input_type": "text",
    "timestamp": "2026-03-12T14:32:00.000Z"
  }
}
```

**Response verification (all inputs):**

| Check | Criteria | Pass/Fail |
|-------|----------|-----------|
| Top-level keys | `linkedin`, `substack`, `metadata` — all three present | |
| `linkedin.content` | Non-empty string | |
| `linkedin.char_count` | Integer, matches actual `content.length` | |
| `linkedin.char_count` | Value <= 3000 | |
| `substack.content` | Non-empty string | |
| `substack.word_count` | Integer, matches actual word count of `content` | |
| `substack.word_count` | Value >= 600 and <= 1500 | |
| `metadata.input_type` | `"text"` | |
| `metadata.timestamp` | Valid ISO 8601 timestamp | |
| JSON validity | Parses without error | |
| Response time | Under 60 seconds from webhook trigger | |

---

## 3. Voice Profile Compliance Checklist

Run this checklist **independently for each output** (6 total: 3 inputs x 2 platforms). A single failure on any item marks that output as FAIL.

### Per-Output Checklist

| # | Check | Criteria | Input A LI | Input A SS | Input B LI | Input B SS | Input C LI | Input C SS |
|---|-------|----------|------------|------------|------------|------------|------------|------------|
| V01 | Always-use vocabulary | Contains at least 1 word from `always_use` list, used naturally (not forced) | | | | | | |
| V02 | Never-use vocabulary | Contains zero words from `never_use` list | | | | | | |
| V03 | Scroll-stop opener | Opening line would make someone stop scrolling — contradiction, hard truth, or provocation | | | | | | |
| V04 | Closing signal | Closing line leaves a mark, not a summary. No "In conclusion" or equivalent | | | | | | |
| V05 | Lived experience anchor | Anchored to lived experience (Iraq, fatherhood, goo phase, Marine Corps) OR Terminal framework | | | | | | |
| V06 | Anti-influencer check | Does NOT sound like a LinkedIn influencer — no motivational poster tone, no generic advice | | | | | | |
| V07 | Exclamation restraint | No more than 2 exclamation marks in the entire piece | | | | | | |
| V08 | No engagement bait | Does not open with a question designed to bait engagement ("Want to know the secret to...?") | | | | | | |
| V09 | Emoji discipline | Max 1-2 strategic emoji, or none. No emoji spam | | | | | | |
| V10 | Active voice | Passive voice used at most once in the entire piece | | | | | | |
| V11 | Umbrella Court purity | Single Umbrella Court per piece — Transparent, Electrified, Flame-Retardant, or Broken. No mixing | | | | | | |
| V12 | Sovereign CTA | CTA is sovereign ("Book a RAW Session", "Claim Your Frequency"), never desperate or begging | | | | | | |
| V13 | Specificity test | Could NOT have been written by anyone else — contains details, references, or framing unique to Jay Rodriguez | | | | | | |

### Always-Use Vocabulary Reference

The following words must appear naturally (at least 1 per output). Tester should highlight which word(s) appeared:

`frequency`, `transmission`, `terminal`, `sovereign`, `raw`, `goo phase`, `convergence`, `operator`, `deployed`, `signal`, `steel`, `freight`, `Boss`, `the hit`, `the stand`, `the switch`, `rails`, `tracks`, `forge`, `unbowed`

### Never-Use Vocabulary Reference

If ANY of these appear in output, that output is an automatic FAIL:

`journey`, `hustle`, `grind`, `authenticity` (as buzzword), `content creator`, `In conclusion`, `I hope this helps`, `Certainly!`, `Great question!`, `As an AI`, `touch base`, `circle back`, `synergy`, `leverage` (as verb), `empower`, `transformative`, `game-changer`, `unlock your potential`, `at the end of the day`, `moving the needle`

---

## 4. Platform Format Verification

### 4.1 LinkedIn Format Checks

Run for each LinkedIn output (Input A, B, C).

| # | Check | Criteria | Input A | Input B | Input C |
|---|-------|----------|---------|---------|---------|
| L01 | Character limit | Total characters <= 3000 | | | |
| L02 | Hook present | First 1-2 lines are a contradiction or hard truth, no preamble | | | |
| L03 | Tension section | 2-4 short paragraphs building argument after hook | | | |
| L04 | Insight turn | Clear moment where the core truth lands | | | |
| L05 | Signal close | Final lines deliver signal, not summary | | | |
| L06 | Structure visible | hook -> tension -> insight -> signal structure is clear to a reader | | | |
| L07 | Short paragraphs | Paragraphs are short (1-3 sentences), separated by line breaks | | | |
| L08 | CTA present | Ends with "Book a RAW Session" or "Claim Your Frequency" (or close variant) | | | |
| L09 | No hashtag spam | Max 3 hashtags, or none. No walls of hashtags | | | |
| L10 | Word count range | 150-300 words | | | |

### 4.2 Substack Format Checks

Run for each Substack output (Input A, B, C).

| # | Check | Criteria | Input A | Input B | Input C |
|---|-------|----------|---------|---------|---------|
| S01 | Word count | 600-1500 words | | | |
| S02 | Cold open | Opens by dropping into the scene or argument — no "welcome back", "in this issue", "this week" | | | |
| S03 | No newsletter speak | Does not use newsletter conventions ("Hey friends", "Quick update", "Let's dive in") | | | |
| S04 | Transmission close | Final line echoes or mirrors the opening, closing the loop | | | |
| S05 | Header usage | Headers used sparingly — max 2-3 in the piece, not as listicle scaffolding | | | |
| S06 | No listicle structure | Content flows as essay/narrative, not as numbered list or "5 ways to..." | | | |
| S07 | Longer paragraphs OK | Body paragraphs can be 3-5 sentences (more than LinkedIn), reflecting essay register | | | |
| S08 | Poetic register earned | Any poetic language is grounded in lived experience, not decorative | | | |
| S09 | Terminal framework reference | References at least one Terminal/RAWALITY concept naturally | | | |

---

## 5. Approval Flow Verification

These checks verify the approval UI behavior when pipeline results are returned.

### 5.1 Content Display

| # | Check | Criteria | Pass/Fail |
|---|-------|----------|-----------|
| A01 | LinkedIn card renders | ContentCard component displays LinkedIn output with PlatformBadge showing "LinkedIn" | |
| A02 | Substack card renders | ContentCard component displays Substack output with PlatformBadge showing "Substack" | |
| A03 | Both cards visible | Both platform cards render simultaneously on the approval screen | |
| A04 | Character/word count displayed | LinkedIn card shows char_count, Substack card shows word_count | |
| A05 | Content is readable | Full text is visible (scrollable if needed), not truncated without indication | |

### 5.2 Approval Actions

| # | Check | Criteria | Pass/Fail |
|---|-------|----------|-----------|
| A06 | Approve button present | Approve button visible for each content card | |
| A07 | Approve triggers deployment | Clicking Approve sends POST to `/api/approve` with `action: "approve"` and correct content | |
| A08 | Approve response | API returns deployment confirmation response | |
| A09 | Edit button present | Edit button visible for each content card | |
| A10 | Edit opens editor | Clicking Edit opens inline editor with the content pre-populated | |
| A11 | Edit saves changes | Modified content can be submitted through the pipeline or directly approved | |
| A12 | Reject button present | Reject button visible for each content card | |
| A13 | Reject discards content | Clicking Reject discards the content (optionally with reason capture) | |
| A14 | Reject confirmation | Content is removed from the approval queue after rejection | |

### 5.3 Loading and Error States

| # | Check | Criteria | Pass/Fail |
|---|-------|----------|-----------|
| A15 | Loading state during processing | After submitting raw input, a loading indicator displays while pipeline processes | |
| A16 | Loading state is informative | Loading state indicates processing is happening (spinner, skeleton, or progress) | |
| A17 | Error state on pipeline failure | If the n8n webhook returns an error or times out, an error state displays | |
| A18 | Error state is actionable | Error message suggests retry or provides context (not a raw stack trace) | |
| A19 | Network failure handling | If the network is unavailable, appropriate error displays | |

### 5.4 UI Quality (UIUX Promax Compliance)

| # | Check | Criteria | Pass/Fail |
|---|-------|----------|-----------|
| A20 | Touch targets | All interactive elements (buttons, inputs) have minimum 44px touch target | |
| A21 | Dark mode rendering | All components render correctly in dark mode — no invisible text, no broken contrast | |
| A22 | Light mode rendering | All components render correctly in light mode | |
| A23 | Mobile layout | Single-column layout on viewports under 768px | |
| A24 | Contrast ratio | All text meets 4.5:1 contrast ratio against its background | |
| A25 | Responsive text | Content text is readable without horizontal scrolling on mobile | |

---

## 6. Pass/Fail Criteria

### 6.1 Scoring Rules

Each section is scored independently. The overall test result is the lowest section score.

- **PASS** = all checks in the section pass
- **FAIL** = one or more checks in the section fail

### 6.2 Section Verdicts

| Section | Scope | Pass Condition | Fail Condition |
|---------|-------|----------------|----------------|
| **Webhook Ingestion** | All 3 inputs | All requests return 200 with valid JSON response | Any request fails, times out, or returns malformed response |
| **Input Router** | All 3 inputs | All inputs route to text path | Any input misroutes |
| **Voice Engine** | All 3 inputs | Retained elements present in output, prohibited transforms absent | Any input loses core signal, over-polishes, or adds content Jay didn't provide |
| **LinkedIn Transform** | All 3 outputs | All L01-L10 checks pass for all 3 inputs | Any single L-check fails on any input |
| **Substack Transform** | All 3 outputs | All S01-S09 checks pass for all 3 inputs | Any single S-check fails on any input |
| **Response Structure** | All 3 responses | All response checks pass | Any response missing keys, wrong types, or out-of-range values |
| **Voice Compliance** | All 6 outputs | All V01-V13 checks pass for all 6 outputs | **Any single V-check fails on any output** |
| **Approval Flow** | UI behavior | All A01-A25 checks pass | Any A-check fails |

### 6.3 Critical Failures (Immediate FAIL, No Override)

These failures cannot be waived or deprioritized. Any one of these makes the entire test run FAIL regardless of other section results:

1. **Never-use word detected** (V02) in any output
2. **Output sounds like a LinkedIn influencer** (V06) on any output
3. **Specificity test failure** (V13) — output could have been written by anyone
4. **Response structure invalid** — missing keys or unparseable JSON
5. **Both platforms not returned** — only LinkedIn or only Substack in response

### 6.4 Overall Verdict

```
PASS: All 8 sections pass AND zero critical failures
FAIL: Any section fails OR any critical failure triggered
```

### 6.5 Failure Documentation

When any check fails, the tester must document:

1. **Which check failed** (ID and description)
2. **Which input triggered the failure** (A, B, or C)
3. **Which platform output failed** (LinkedIn, Substack, or both)
4. **Evidence** — the exact text or behavior that caused the failure
5. **Severity** — Critical (blocks release) or Non-Critical (can ship with known issue logged)

---

## 7. Test Execution Log Template

Use this template for each test run.

```
Test Run ID: _______________
Date: _______________
Tester: _______________
Environment: [ ] Local  [ ] Staging  [ ] Production

Input A (Short):  [ ] Submitted  [ ] Response Received  [ ] LinkedIn Reviewed  [ ] Substack Reviewed
Input B (Medium): [ ] Submitted  [ ] Response Received  [ ] LinkedIn Reviewed  [ ] Substack Reviewed
Input C (Long):   [ ] Submitted  [ ] Response Received  [ ] LinkedIn Reviewed  [ ] Substack Reviewed

Section Results:
  Webhook Ingestion:    [ ] PASS  [ ] FAIL
  Input Router:         [ ] PASS  [ ] FAIL
  Voice Engine:         [ ] PASS  [ ] FAIL
  LinkedIn Transform:   [ ] PASS  [ ] FAIL
  Substack Transform:   [ ] PASS  [ ] FAIL
  Response Structure:   [ ] PASS  [ ] FAIL
  Voice Compliance:     [ ] PASS  [ ] FAIL
  Approval Flow:        [ ] PASS  [ ] FAIL

Critical Failures: [ ] None  [ ] See notes below

Overall Verdict: [ ] PASS  [ ] FAIL

Notes / Failure Evidence:
_______________________________________________
_______________________________________________
_______________________________________________
```

---

## Appendix: Requirements Traceability

| Requirement | What This Test Covers |
|-------------|----------------------|
| R01 — Text input produces formatted content | Sections 2.1-2.6 (full pipeline from text input to structured JSON response) |
| R02 — Voice engine enforces QJ RAW identity | Section 3 (V01-V13 voice compliance checklist on all outputs) |
| R03 — Content formatted for at least 1 platform | Section 4 (LinkedIn L01-L10 and Substack S01-S09 format verification) |
