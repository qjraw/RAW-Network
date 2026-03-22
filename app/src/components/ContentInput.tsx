"use client";

import { useCallback, useRef, useState } from "react";

interface ContentInputProps {
  onSubmit: (input: {
    type: "text" | "voice_memo";
    content: string;
    file?: File;
  }) => void;
  isLoading?: boolean;
}

const ACCEPTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
  "audio/x-m4a",
];

export default function ContentInput({
  onSubmit,
  isLoading = false,
}: ContentInputProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = text.length;

  const handleFileSelect = useCallback((selected: File | null) => {
    if (!selected) return;
    if (!ACCEPTED_AUDIO_TYPES.includes(selected.type)) {
      // Silently reject non-audio files — the accept attribute on the input
      // handles the primary filtering; this is a safety net.
      return;
    }
    setFile(selected);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragOver) setIsDragOver(true);
    },
    [isDragOver]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFileSelect(dropped);
    },
    [handleFileSelect]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading) return;

      if (file) {
        onSubmit({ type: "voice_memo", content: file.name, file });
      } else if (text.trim()) {
        onSubmit({ type: "text", content: text.trim() });
      }
    },
    [file, text, isLoading, onSubmit]
  );

  const canSubmit = !isLoading && (file !== null || text.trim().length > 0);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4"
      aria-label="Submit raw content"
    >
      {/* ── Voice Memo Upload (Primary) ── */}
      <fieldset className="border-none p-0 m-0">
        <legend className="text-base font-semibold text-[var(--color-text)] mb-2">
          Voice Memo
          <span className="ml-2 text-xs font-normal text-[var(--color-text-muted)]">
            (recommended)
          </span>
        </legend>

        <div
          role="button"
          tabIndex={0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload voice memo. Click or drag and drop an audio file."
          className={`
            flex min-h-[120px] cursor-pointer flex-col items-center justify-center
            gap-2 rounded-xl border-2 border-dashed p-6
            transition-colors duration-[var(--duration-fast)]
            ${
              isDragOver
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                : "border-[var(--color-border)] bg-[var(--color-surface-raised)]"
            }
            ${isLoading ? "opacity-[0.42] cursor-not-allowed" : "hover:border-[var(--color-primary)]"}
          `}
        >
          {/* Mic icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-[var(--color-primary)]"
            aria-hidden="true"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>

          {file ? (
            <span className="text-sm font-medium text-[var(--color-text)]">
              {file.name}
            </span>
          ) : (
            <>
              <span className="text-sm font-medium text-[var(--color-text)]">
                Drop audio file here or click to upload
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                MP3, M4A, WAV, WebM, OGG
              </span>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          disabled={isLoading}
        />

        {file && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="
              mt-2 inline-flex min-h-[44px] min-w-[44px] items-center
              rounded-lg px-3 py-2 text-sm font-medium
              text-[var(--color-error)]
              transition-colors duration-[var(--duration-fast)]
              hover:bg-[var(--color-error)]/10
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-[var(--color-focus-ring)]
            "
            aria-label="Remove selected file"
          >
            Remove file
          </button>
        )}
      </fieldset>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-[var(--color-border)]" />
        <span className="text-xs text-[var(--color-text-muted)]">or type</span>
        <div className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      {/* ── Text Input (Secondary) ── */}
      <fieldset className="border-none p-0 m-0">
        <legend className="text-sm font-medium text-[var(--color-text-muted)] mb-2">
          Text Input
        </legend>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your raw content..."
            rows={4}
            disabled={isLoading || file !== null}
            aria-label="Raw content text"
            className={`
              w-full resize-y rounded-lg border border-[var(--color-border)]
              bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text)]
              placeholder:text-[var(--color-text-muted)]
              transition-colors duration-[var(--duration-fast)]
              focus:border-[var(--color-primary)] focus:ring-0
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-[var(--color-focus-ring)]
              ${(isLoading || file !== null) ? "opacity-[0.42] cursor-not-allowed" : ""}
            `}
          />
          <span
            className="absolute bottom-2 right-3 text-xs text-[var(--color-text-muted)]"
            aria-live="polite"
            aria-label={`${charCount} characters`}
          >
            {charCount.toLocaleString()} chars
          </span>
        </div>
      </fieldset>

      {/* ── Submit Button ── */}
      <button
        type="submit"
        disabled={!canSubmit}
        className={`
          inline-flex min-h-[44px] min-w-[44px] w-full items-center justify-center
          rounded-lg px-6 py-3 text-base font-semibold
          bg-[var(--color-primary)] text-white
          transition-colors duration-[var(--duration-fast)]
          hover:bg-[var(--color-primary-hover)]
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-[var(--color-focus-ring)]
          sm:w-auto
          ${!canSubmit ? "opacity-[0.42] cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
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
            Processing...
          </span>
        ) : (
          "Generate Content"
        )}
      </button>
    </form>
  );
}
