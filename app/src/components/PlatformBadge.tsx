"use client";

import type { Platform } from "@/lib/types";

const PLATFORM_CONFIG: Record<
  Platform,
  { label: string; className: string }
> = {
  linkedin: {
    label: "LinkedIn",
    className: "bg-[var(--color-primary)] text-white",
  },
  substack: {
    label: "Substack",
    className: "bg-[var(--color-accent)] text-white",
  },
  threads_x: {
    label: "Threads / X",
    className:
      "bg-[var(--color-text)] text-[var(--color-surface)]",
  },
};

interface PlatformBadgeProps {
  platform: Platform;
}

export default function PlatformBadge({ platform }: PlatformBadgeProps) {
  const config = PLATFORM_CONFIG[platform];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold leading-none ${config.className}`}
      aria-label={`Platform: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
