# GSD Framework — Active Rules for RAW Network

> Sourced from: github.com/glittercowboy/get-shit-done (v1.x core spec)
> Applied: 2026-03-12

---

## ACTIVE GSD OPERATING RULES

### 1. Context Management

- **PROJECT.md** is ALWAYS loaded first — it is the north star.
- **STATE.md** is memory across sessions — update it at the end of every work session.
- **REQUIREMENTS.md** scopes deliverables per phase with traceability.
- **ROADMAP.md** tracks phased progression and completion status.
- Phase-scoped files follow the pattern: `{phase}-CONTEXT.md`, `{phase}-PLAN.md`, `{phase}-SUMMARY.md`.
- All files are kept under token-budget limits. Do not let any single context file exceed ~2,000 words.

### 2. Sub-Agent Handling

- The **orchestrator** (main Claude session) coordinates and routes — it does NOT do the heavy implementation lifting.
- Keep the main context window at **30–40% utilization** by delegating execution to subagents.
- Each subagent receives a **fresh 200k-token context** — zero accumulated session garbage.
- Sub-agent roles per stage:
  - **Research:** 4 parallel agents covering stack, features, architecture, known pitfalls.
  - **Planning:** Planner agent drafts → Checker agent verifies against phase goals → loop until passing.
  - **Execution:** Executor agents implement independently in parallel waves.
  - **Verification:** Verifier agent checks goal completion → Debugger agents diagnose failures if needed.

### 3. Planning Rules

- Every task uses XML structure:
  ```xml
  <task type="auto">
    <name>Human-readable task name</name>
    <files>Affected file paths</files>
    <action>What to build and how</action>
    <verify>Command or check to validate</verify>
    <done>Observable definition of done</done>
  </task>
  ```
- Plans are checked against REQUIREMENTS.md before execution — loop until they pass.
- Gray areas (visual decisions, API shapes, content structure) are resolved in the **discuss phase**, not during execution.

### 4. Execution Rules

- **Atomic commits** after every completed task: `feat(phase-N): description`
- **Wave execution:** Group independent tasks → run in parallel. Dependent tasks queue to the next wave.
- **No skipping verification.** Every phase ends with a verify step before moving forward.
- Use `/gsd:quick` for ad-hoc fixes that don't warrant a full planning cycle.

### 5. Phase Lifecycle

```
discuss → plan → execute → verify → (iterate or advance)
```

Each phase produces:
1. `{phase}-CONTEXT.md` — implementation preferences captured in discuss
2. `{phase}-PLAN.md` — XML task plan, verified against requirements
3. `{phase}-SUMMARY.md` — committed changes and outcomes

### 6. Session Hygiene

- On session start: read PROJECT.md → STATE.md → current phase PLAN.md.
- On session end: update STATE.md with decisions made, blockers hit, current position.
- Never carry implementation details in the orchestrator session — offload to agents.

---

## COMMAND REFERENCE (adapted for this workspace)

| Command Intent | Action |
|---|---|
| New phase | Create `{phase}-CONTEXT.md` → `{phase}-PLAN.md` |
| Execute phase | Run wave-grouped tasks via subagents |
| Check progress | Read ROADMAP.md + STATE.md |
| Quick fix | Ad-hoc task, single atomic commit, no full cycle |
| Pause session | Update STATE.md before closing |
| Resume session | Read PROJECT.md → STATE.md → current PLAN.md |

---

## UIUX PROMAX — Front-End Design Constraints

> Sourced from: github.com/nextlevelbuilder/ui-ux-pro-max-skill
> These rules are NON-NEGOTIABLE for any interface component.

### Critical (Must Never Violate)

- **Contrast:** Minimum 4.5:1 ratio for all normal text (WCAG AA).
- **Touch targets:** Minimum 44x44px with 8px spacing between interactive elements.
- **Feedback latency:** Interactive feedback must appear within 100ms of user input.

### High Priority

- **Performance:** Use WebP/AVIF for images. Cumulative Layout Shift (CLS) < 0.1.
- **Responsive:** Mobile-first design with systematic breakpoints.
- **No generic AI slop:** Every visual decision must serve a functional purpose. No decorative gradients, no gratuitous shadows, no placeholder aesthetics.

### Typography

- Base body text: 16px minimum, line-height 1.5–1.75.
- Font pairings must come from validated pairing databases, not arbitrary selection.

### Color & Theming

- Use **semantic color tokens** (e.g., `--color-primary`, `--color-surface`), never raw hex values in components.
- All components must support light and dark modes.
- Disabled states use reduced opacity (0.38–0.5), never hidden elements.

### Interaction & Accessibility

- Keyboard navigation support on all interactive elements.
- Screen reader compatibility (semantic HTML, ARIA labels where needed).
- Respect `prefers-reduced-motion` — animations 150–300ms for micro-interactions.

### Design System Generation Protocol

When creating any new UI component or page:
1. **Analyze** — Identify product type, audience, and style requirements.
2. **Generate** — Produce a design system spec (tokens, spacing scale, type scale) before writing any component code.
3. **Search** — Query for domain-specific patterns (SaaS, dashboard, portfolio, etc.).
4. **Apply** — Use stack-appropriate guidelines (React, Next.js, Tailwind, etc.).

---

## N8N MCP INTEGRATION — Automation Engine

> Sourced from: github.com/czlonkowski/n8n-mcp
> MCP server providing access to 1,084 n8n nodes (537 core + 547 community).

### What's Available

- 99% property coverage with detailed schemas
- 265 AI-capable tool variants
- 2,646 real-world workflow examples
- 2,709 workflow templates with metadata

### MCP Configuration

The n8n MCP server is configured in `.mcp.json` at project root.

To add via CLI:
```bash
claude mcp add n8n-mcp \
  -e MCP_MODE=stdio \
  -e LOG_LEVEL=error \
  -e DISABLE_CONSOLE_OUTPUT=true \
  -- npx n8n-mcp
```

For full n8n instance management, add:
```
-e N8N_API_URL=<your-n8n-url>
-e N8N_API_KEY=<your-api-key>
```

### Verification

```bash
claude mcp list
claude mcp get n8n-mcp
```

In-session: use `/mcp` to confirm ~39 tools are available.

### Safety Rules

- **NEVER** edit production workflows directly via AI.
- Always create workflow copies before modification.
- Test in development environments first.
- Export backups before deploying changes.

---

*GSD framework active. UIUX Promax locked. n8n MCP indexed. Context rot is not an option.*
