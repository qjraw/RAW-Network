"use client";

import type { ApprovalStatus } from "@/lib/types";

interface ApprovalActionsProps {
  onApprove: () => void;
  onEdit: () => void;
  onReject: () => void;
  status: ApprovalStatus;
  disabled?: boolean;
}

export default function ApprovalActions({
  onApprove,
  onEdit,
  onReject,
  status,
  disabled = false,
}: ApprovalActionsProps) {
  const isDisabled = disabled || status !== "pending";

  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Approval actions"
    >
      <button
        type="button"
        onClick={onApprove}
        disabled={isDisabled}
        aria-label="Approve content"
        className={`
          inline-flex min-h-[44px] min-w-[44px] items-center justify-center
          rounded-lg px-4 py-2 text-sm font-semibold
          bg-[var(--color-success)] text-white
          transition-colors duration-[var(--duration-fast)]
          hover:brightness-110
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-[var(--color-focus-ring)]
          ${isDisabled ? "opacity-[0.42] cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {status === "approved" ? "Approved" : "Approve"}
      </button>

      <button
        type="button"
        onClick={onEdit}
        disabled={isDisabled}
        aria-label="Edit content"
        className={`
          inline-flex min-h-[44px] min-w-[44px] items-center justify-center
          rounded-lg px-4 py-2 text-sm font-semibold
          bg-[var(--color-accent)] text-white
          transition-colors duration-[var(--duration-fast)]
          hover:brightness-110
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-[var(--color-focus-ring)]
          ${isDisabled ? "opacity-[0.42] cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        Edit
      </button>

      <button
        type="button"
        onClick={onReject}
        disabled={isDisabled}
        aria-label="Reject content"
        className={`
          inline-flex min-h-[44px] min-w-[44px] items-center justify-center
          rounded-lg px-4 py-2 text-sm font-semibold
          bg-[var(--color-error)] text-white
          transition-colors duration-[var(--duration-fast)]
          hover:brightness-110
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-[var(--color-focus-ring)]
          ${isDisabled ? "opacity-[0.42] cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {status === "rejected" ? "Rejected" : "Reject"}
      </button>
    </div>
  );
}
