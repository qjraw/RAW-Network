"use client";

import type { Platform, ApprovalStatus } from "@/lib/types";
import PlatformBadge from "./PlatformBadge";

interface ContentCardProps {
  platform: Platform;
  content: string;
  charCount?: number;
  wordCount?: number;
  status: ApprovalStatus;
  children?: React.ReactNode;
}

const STATUS_INDICATOR: Record<
  ApprovalStatus,
  { label: string; className: string; icon: string }
> = {
  pending: {
    label: "Pending review",
    className: "text-[var(--color-accent)]",
    icon: "⏳",
  },
  approved: {
    label: "Approved",
    className: "text-[var(--color-success)]",
    icon: "✓",
  },
  rejected: {
    label: "Rejected",
    className: "text-[var(--color-error)]",
    icon: "✗",
  },
};

export default function ContentCard({
  platform,
  content,
  charCount,
  wordCount,
  status,
  children,
}: ContentCardProps) {
  const statusInfo = STATUS_INDICATOR[status];

  return (
    <article
      className="
        w-full rounded-xl border border-[var(--color-border)]
        bg-[var(--color-surface-raised)] p-4 sm:p-6
        shadow-sm transition-shadow duration-[var(--duration-fast)]
      "
      aria-label={`${platform} content — ${statusInfo.label}`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <PlatformBadge platform={platform} />
        <span
          className={`inline-flex items-center gap-1 text-sm font-medium ${statusInfo.className}`}
          aria-label={`Status: ${statusInfo.label}`}
        >
          <span aria-hidden="true">{statusInfo.icon}</span>
          {statusInfo.label}
        </span>
      </div>

      {/* Content preview */}
      <div
        className="
          mt-4 whitespace-pre-wrap break-words rounded-lg
          border border-[var(--color-border)] bg-[var(--color-surface)]
          p-3 text-sm leading-relaxed text-[var(--color-text)]
          sm:p-4 sm:text-base
        "
      >
        {content}
      </div>

      {/* Metadata row */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)]">
        {charCount !== undefined && (
          <span>
            {charCount.toLocaleString()} character{charCount !== 1 ? "s" : ""}
          </span>
        )}
        {wordCount !== undefined && (
          <span>
            {wordCount.toLocaleString()} word{wordCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Action slot (ApprovalActions goes here) */}
      {children && <div className="mt-4">{children}</div>}
    </article>
  );
}
