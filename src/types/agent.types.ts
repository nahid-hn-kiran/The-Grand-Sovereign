export type AgentRunStatus =
  | "QUEUED"
  | "RUNNING"
  | "AWAITING_APPROVAL"
  | "COMPLETED"
  | "FAILED";

export interface AgentStep {
  id: string;
  runId: string;
  stepNumber: number;
  toolName: string;
  toolInput: Record<string, unknown>;
  toolOutput?: Record<string, unknown> | null;
  requiresApproval: boolean;
  isApproved?: boolean | null;
  createdAt: string;
}

export interface AgentRun {
  id: string;
  triggerEvent: string;
  status: AgentRunStatus;
  planSummary?: string | null;
  steps: AgentStep[];
  createdAt: string;
  updatedAt: string;
}

export interface TriggerAgentPayload {
  triggerEvent: string;
  prompt: string;
}
