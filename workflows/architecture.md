# RAW Network — n8n Workflow Architecture

**Version:** 1.0.0
**Task:** P1-03
**Status:** Foundation (P1) — text path active, audio/image/video paths stubbed for P3

---

## Overview

Two workflows power the RAW Network content pipeline:

1. **Content Pipeline Workflow** (P1) — Accepts raw input, runs it through the voice engine and platform transforms, returns formatted content for approval.
2. **Approval Distribution Workflow** (P2) — Receives approved content and deploys it to LinkedIn/Substack.

---

## Workflow 1: Content Pipeline

### Purpose
Accept raw input (text, voice memo, image) via webhook, process through QJ RAW's voice engine, produce platform-specific content (LinkedIn + Substack), and return to the approval UI.

### Node-by-Node Architecture

```
                                  +--------------------+
                                  |   Webhook Trigger  |
                                  | POST /raw-input    |
                                  | Body: {type,       |
                                  |  content,          |
                                  |  audio_url?,       |
                                  |  image_url?}       |
                                  +---------+----------+
                                            |
                                            v
                                  +--------------------+
                                  |   Input Router     |
                                  |   (Switch Node)    |
                                  |                    |
                                  | Routes on:         |
                                  |  body.type value   |
                                  +--+------+------+---+
                                     |      |      |
                          "text"     |      |      |   "image"
                                     |      |      |
                                     v      |      v
                          +----------+  |  +----------+
                          |  Pass    |  |  | Image    |
                          |  Through |  |  | Stub     |
                          |  (Set)   |  |  | (NoOp)   |
                          +----+-----+  |  | [P3]     |
                               |        |  +----------+
                               |        |
                               |   "voice_memo"
                               |        |
                               |        v
                               |  +----------+
                               |  | Audio    |
                               |  | Stub     |
                               |  | (NoOp)   |
                               |  | [P3]     |
                               |  +----------+
                               |
                               v
                    +---------------------+
                    |   Voice Engine      |
                    |   (Claude AI Node)  |
                    |                     |
                    | System Prompt:      |
                    |  voice-engine.md    |
                    | User Prompt:        |
                    |  "Process this raw  |
                    |   input and produce |
                    |   refined content"  |
                    +----------+----------+
                               |
                               v
                    +---------------------+
                    |  Platform Splitter  |
                    |  (fan-out — two     |
                    |   parallel paths)   |
                    +---+-------------+---+
                        |             |
                        v             v
              +-----------+   +-----------+
              | LinkedIn  |   | Substack  |
              | Transform |   | Transform |
              | (Claude)  |   | (Claude)  |
              |           |   |           |
              | Prompt:   |   | Prompt:   |
              | linkedin- |   | substack- |
              | transform |   | transform |
              | .md       |   | .md       |
              +-----+-----+   +-----+-----+
                    |               |
                    v               v
              +-----------+   +-----------+
              | LinkedIn  |   | Substack  |
              | Formatter |   | Formatter |
              | (Set)     |   | (Set)     |
              | adds:     |   | adds:     |
              | char_count|   | word_count|
              +-----+-----+   +-----+-----+
                    |               |
                    v               v
                    +-------+-------+
                            |
                            v
                    +-------+-------+
                    |   Merge Node  |
                    | Combines both |
                    | platform      |
                    | outputs       |
                    +-------+-------+
                            |
                            v
                    +-------+--------+
                    | Build Response |
                    | (Set Node)     |
                    | Constructs:    |
                    | {linkedin:     |
                    |  {content,     |
                    |   char_count}, |
                    |  substack:     |
                    |  {content,     |
                    |   word_count}, |
                    |  metadata:     |
                    |  {input_type,  |
                    |   timestamp}}  |
                    +-------+--------+
                            |
                            v
                    +------------------+
                    | Respond to       |
                    | Webhook          |
                    | Returns JSON to  |
                    | approval UI      |
                    +------------------+
```

### Node Details

| # | Node Name | n8n Type | Purpose | Credentials Required |
|---|-----------|----------|---------|---------------------|
| 1 | Webhook Trigger | `n8n-nodes-base.webhook` | Receives raw input via POST /webhook/raw-input | None |
| 2 | Input Router | `n8n-nodes-base.switch` | Routes on `body.type`: text, voice_memo, image | None |
| 3 | Text Pass-Through | `n8n-nodes-base.set` | Passes text content directly to voice engine | None |
| 4 | Audio Transcription Stub | `n8n-nodes-base.noOp` | **P3 STUB** — Will be OpenAI Whisper node | OpenAI (P3) |
| 5 | Image Caption Stub | `n8n-nodes-base.noOp` | **P3 STUB** — Will be Vision API node | OpenAI (P3) |
| 6 | Voice Engine | `n8n-nodes-base.httpRequest` | Claude API call with voice-engine.md system prompt | **Anthropic API Key** |
| 7 | LinkedIn Transform | `n8n-nodes-base.httpRequest` | Claude API call with linkedin-transform.md prompt | **Anthropic API Key** |
| 8 | Substack Transform | `n8n-nodes-base.httpRequest` | Claude API call with substack-transform.md prompt | **Anthropic API Key** |
| 9 | LinkedIn Formatter | `n8n-nodes-base.set` | Adds char_count to LinkedIn output | None |
| 10 | Substack Formatter | `n8n-nodes-base.set` | Adds word_count to Substack output | None |
| 11 | Merge | `n8n-nodes-base.merge` | Combines LinkedIn + Substack outputs | None |
| 12 | Build Response | `n8n-nodes-base.set` | Constructs final JSON response | None |
| 13 | Respond to Webhook | `n8n-nodes-base.respondToWebhook` | Returns JSON to caller | None |

### Credential Requirements

| Service | Credential Type | Used By | Phase |
|---------|----------------|---------|-------|
| Anthropic (Claude) | API Key — Header Auth | Voice Engine, LinkedIn Transform, Substack Transform | **P1** |
| OpenAI (Whisper) | API Key | Audio Transcription (stub) | P3 |
| OpenAI (Vision) | API Key | Image Caption (stub) | P3 |

### Webhook Contract

**Request:**
```json
POST /webhook/raw-input
Content-Type: application/json

{
  "type": "text" | "voice_memo" | "image",
  "content": "string — raw text input or description",
  "audio_url": "string (optional) — URL to voice memo file",
  "image_url": "string (optional) — URL to image file"
}
```

**Response:**
```json
{
  "linkedin": {
    "content": "string — formatted LinkedIn post",
    "char_count": 1234
  },
  "substack": {
    "content": "string — formatted Substack article",
    "word_count": 567
  },
  "metadata": {
    "input_type": "text",
    "timestamp": "2026-03-12T12:00:00.000Z"
  }
}
```

### Stub Paths (P3 — Future Implementation)

The following paths are placeholder `noOp` nodes that will be implemented in Phase 3:

1. **Audio Path (voice_memo)**
   - Current: `noOp` placeholder returns stub message
   - P3: OpenAI Whisper node receives `audio_url`, downloads audio, transcribes to text, passes to Voice Engine
   - Required: OpenAI API key, audio file hosting (S3/Cloudflare R2)

2. **Image Path (image)**
   - Current: `noOp` placeholder returns stub message
   - P3: Vision API node receives `image_url`, generates caption/description, passes to Voice Engine
   - Required: OpenAI API key (GPT-4 Vision), image hosting

3. **Video Path (not yet in router)**
   - P3: Add `video` case to Switch node, extract keyframes + transcribe audio track
   - Required: FFmpeg processing, OpenAI Whisper, Vision API

---

## Workflow 2: Approval Distribution (P2 — Document Now, Build Later)

### Purpose
Receive approved content from the approval UI and deploy to the target platform (LinkedIn, Substack). Handle edit/reject flows.

### Architecture

```
              +--------------------+
              |  Webhook Trigger   |
              |  POST /distribute  |
              |  Body: {content,   |
              |   platform,        |
              |   action,          |
              |   edit_content?}   |
              +---------+----------+
                        |
                        v
              +--------------------+
              |  Action Router     |
              |  (Switch Node)     |
              |                    |
              |  Routes on:        |
              |   body.action      |
              +--+------+------+---+
                 |      |      |
      "approve"  |      |      |  "reject"
                 |      |      |
                 v      |      v
          +------+--+   |  +--------+
          | Platform |   |  | Reject |
          | Router   |   |  | Handler|
          | (Switch) |   |  | Discard|
          +--+----+--+   |  +--------+
             |    |       |
    "linkedin"|    |"substack"
             |    |       |
             v    v    "edit"
          +--+-+ ++-+     |
          | LI | |SS|     v
          |API | |API| +--------+
          |Node| |Node|| Return |
          +--+-+ +-+--+| to     |
             |     |    | Pipeline|
             v     v    +--------+
          +--+-----+-+
          | Status    |
          | Callback  |
          | (Webhook) |
          | Notifies  |
          | approval  |
          | UI of     |
          | result    |
          +-----------+
```

### Node Details (P2 — To Be Built)

| # | Node Name | n8n Type | Purpose | Credentials Required |
|---|-----------|----------|---------|---------------------|
| 1 | Webhook Trigger | `n8n-nodes-base.webhook` | Receives approved/edited/rejected content | None |
| 2 | Action Router | `n8n-nodes-base.switch` | Routes on action: approve, edit, reject | None |
| 3 | Platform Router | `n8n-nodes-base.switch` | Routes approved content to correct platform | None |
| 4 | LinkedIn Deploy | `n8n-nodes-base.httpRequest` | Posts to LinkedIn API | **LinkedIn OAuth** |
| 5 | Substack Deploy | `n8n-nodes-base.httpRequest` | Posts via Substack API or webhook | **Substack API/Token** |
| 6 | Edit Return | `n8n-nodes-base.httpRequest` | Sends edited content back to content pipeline | None |
| 7 | Reject Handler | `n8n-nodes-base.set` | Logs rejection reason, discards content | None |
| 8 | Status Callback | `n8n-nodes-base.httpRequest` | Notifies approval UI of deployment result | None |

### Distribution Webhook Contract (P2)

**Request:**
```json
POST /webhook/distribute
Content-Type: application/json

{
  "platform": "linkedin" | "substack",
  "action": "approve" | "edit" | "reject",
  "content": "string — the final content to deploy",
  "edit_content": "string (optional) — revised content if action=edit",
  "reject_reason": "string (optional) — reason for rejection"
}
```

**Response:**
```json
{
  "status": "deployed" | "returned_to_pipeline" | "discarded",
  "platform": "linkedin" | "substack",
  "deploy_url": "string (optional) — URL of published post",
  "timestamp": "2026-03-12T12:00:00.000Z"
}
```

### P2 Credential Requirements

| Service | Credential Type | Purpose |
|---------|----------------|---------|
| LinkedIn | OAuth 2.0 | Post creation via LinkedIn API |
| Substack | API Token or Webhook | Article publishing |

---

## File References

| File | Purpose |
|------|---------|
| `engine/voice-engine.md` | Master system prompt — injected into Voice Engine node |
| `engine/prompts/linkedin-transform.md` | LinkedIn transform prompt — injected into LinkedIn Transform node |
| `engine/prompts/substack-transform.md` | Substack transform prompt — injected into Substack Transform node |
| `voice-profile.json` | Voice identity spec — source of truth for vocabulary, guardrails, rules |
| `workflows/content-pipeline.json` | Importable n8n workflow JSON for the Content Pipeline |

---

## Phase Roadmap

| Phase | What Gets Built | Workflow Impact |
|-------|----------------|-----------------|
| **P1** (current) | Text-only pipeline, approval UI, voice engine | Content Pipeline with text path active |
| **P2** | Approval + distribution | Approval Distribution Workflow built |
| **P3** | Audio transcription, image captioning, video | Stub nodes replaced with real implementations |
| **P4** | Analytics, A/B testing, scheduling | New workflow or extended pipeline |
