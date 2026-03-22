/**
 * TypeScript types for the RAW Network content pipeline.
 */

/** Supported distribution platforms. */
export type Platform = "linkedin" | "substack" | "threads_x";

/** Status of a content piece through the approval workflow. */
export type ApprovalStatus = "pending" | "approved" | "rejected";

/** Actions a reviewer can take on a content piece. */
export type ApprovalActionType = "approve" | "edit" | "reject";

/** Type of raw input submitted by the creator. */
export type InputType = "text" | "voice_memo";

/** A single platform-specific content piece. */
export interface ContentPiece {
  platform: Platform;
  content: string;
  charCount?: number;
  wordCount?: number;
  status: ApprovalStatus;
}

/** Payload sent when a reviewer acts on a content piece. */
export interface ApprovalAction {
  id: string;
  platform: Platform;
  action: ApprovalActionType;
  editedContent?: string;
}

/** Payload sent when submitting raw input. */
export interface InputPayload {
  type: InputType;
  content: string;
  file?: File;
}

/** Platform-specific content in the pipeline response. */
export interface PlatformContent {
  content: string;
  char_count?: number;
  word_count?: number;
}

/** Response from the content generation pipeline. */
export interface PipelineResponse {
  id: string;
  linkedin: PlatformContent;
  substack: PlatformContent;
  threads_x?: PlatformContent;
  metadata: {
    input_type: InputType;
    timestamp: string;
  };
}
