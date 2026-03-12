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

*GSD framework active. Context rot is not an option.*
