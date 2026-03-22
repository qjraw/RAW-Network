"use client";

import { useCallback, useState } from "react";
import ContentInput from "@/components/ContentInput";
import ContentCard from "@/components/ContentCard";
import ApprovalActions from "@/components/ApprovalActions";
import type {
  ApprovalStatus,
  PipelineResponse,
  Platform,
} from "@/lib/types";

type PlatformStatus = Record<Platform, ApprovalStatus>;

type AppPhase = "input" | "loading" | "review";

export default function HomePage() {
  const [phase, setPhase] = useState<AppPhase>("input");
  const [pipeline, setPipeline] = useState<PipelineResponse | null>(null);
  const [statuses, setStatuses] = useState<PlatformStatus>({
    linkedin: "pending",
    substack: "pending",
    threads_x: "pending",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (input: { type: "text" | "voice_memo"; content: string; file?: File }) => {
      setPhase("loading");
      setError(null);

      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: input.type, content: input.content }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Submission failed");
        }

        const data: PipelineResponse = await res.json();
        setPipeline(data);
        setStatuses({
          linkedin: "pending",
          substack: "pending",
          threads_x: "pending",
        });
        setPhase("review");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        setPhase("input");
      }
    },
    []
  );

  const handleAction = useCallback(
    async (platform: Platform, action: "approve" | "edit" | "reject") => {
      if (!pipeline) return;

      try {
        const res = await fetch("/api/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: pipeline.id,
            platform,
            action,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Action failed");
        }

        setStatuses((prev) => ({
          ...prev,
          [platform]: action === "approve" ? "approved" : action === "reject" ? "rejected" : prev[platform],
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      }
    },
    [pipeline]
  );

  const handleReset = useCallback(() => {
    setPhase("input");
    setPipeline(null);
    setStatuses({ linkedin: "pending", substack: "pending", threads_x: "pending" });
    setError(null);
  }, []);

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
            Content Pipeline
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)] sm:text-base">
            Submit raw content, review generated output, then approve or reject
            for each platform.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div
            role="alert"
            className="
              mb-6 rounded-lg border border-[var(--color-error)]
              bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]
            "
          >
            {error}
          </div>
        )}

        {/* ── Input Phase ── */}
        {phase === "input" && (
          <ContentInput onSubmit={handleSubmit} isLoading={false} />
        )}

        {/* ── Loading Phase ── */}
        {phase === "loading" && (
          <div
            className="flex flex-col items-center justify-center gap-4 py-16"
            role="status"
            aria-label="Processing content"
          >
            <svg
              className="h-10 w-10 animate-spin text-[var(--color-primary)]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              Generating platform content...
            </p>
          </div>
        )}

        {/* ── Review Phase ── */}
        {phase === "review" && pipeline && (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* LinkedIn Card */}
              <ContentCard
                platform="linkedin"
                content={pipeline.linkedin.content}
                charCount={pipeline.linkedin.char_count}
                status={statuses.linkedin}
              >
                <ApprovalActions
                  status={statuses.linkedin}
                  onApprove={() => handleAction("linkedin", "approve")}
                  onEdit={() => handleAction("linkedin", "edit")}
                  onReject={() => handleAction("linkedin", "reject")}
                />
              </ContentCard>

              {/* Substack Card */}
              <ContentCard
                platform="substack"
                content={pipeline.substack.content}
                wordCount={pipeline.substack.word_count}
                status={statuses.substack}
              >
                <ApprovalActions
                  status={statuses.substack}
                  onApprove={() => handleAction("substack", "approve")}
                  onEdit={() => handleAction("substack", "edit")}
                  onReject={() => handleAction("substack", "reject")}
                />
              </ContentCard>
            </div>

            {/* Metadata */}
            <div className="mt-6 text-xs text-[var(--color-text-muted)]">
              <p>
                ID: <code className="font-mono">{pipeline.id}</code> | Input:{" "}
                {pipeline.metadata.input_type} | Generated:{" "}
                {new Date(pipeline.metadata.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Start over */}
            <button
              type="button"
              onClick={handleReset}
              className="
                mt-6 inline-flex min-h-[44px] min-w-[44px] items-center
                rounded-lg border border-[var(--color-border)] px-4 py-2
                text-sm font-medium text-[var(--color-text)]
                transition-colors duration-[var(--duration-fast)]
                hover:bg-[var(--color-surface-raised)]
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-[var(--color-focus-ring)]
              "
            >
              Start Over
            </button>
          </>
        )}
      </div>
    </section>
  );
}
