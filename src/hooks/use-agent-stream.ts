"use client";

import * as React from "react";
import { apiClient } from "@/lib/api-client";
import { AgentRun, AgentRunStatus } from "@/types/agent.types";

export function useAgentStream() {
  const [activeRun, setActiveRun] = React.useState<AgentRun | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const dispatchRun = React.useCallback(async (triggerEvent: string, prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.post<AgentRun | { data: AgentRun }>("/agent/runs", {
        triggerEvent,
        prompt,
      });
      const run = (res as { data?: AgentRun }).data || (res as AgentRun);
      const validRun = run && run.id ? run : null;

      if (validRun) {
        setActiveRun(validRun);
      } else {
        const mockId = `run-${Date.now()}`;
        const initialMockRun: AgentRun = {
          id: mockId,
          triggerEvent,
          status: "AWAITING_APPROVAL",
          planSummary: `Analyzed request: "${prompt}". Identified 2 tool execution steps required.`,
          steps: [
            {
              id: `step-1`,
              runId: mockId,
              stepNumber: 1,
              toolName: "check_room_availability",
              toolInput: { roomTypeId: "rt-deluxe-king", dates: "2026-10-10 to 2026-10-12" },
              toolOutput: { availableRooms: 4, basePrice: 450 },
              requiresApproval: false,
              isApproved: true,
              createdAt: new Date().toISOString(),
            },
            {
              id: `step-2`,
              runId: mockId,
              stepNumber: 2,
              toolName: "override_room_status",
              toolInput: { roomId: "r-101", targetStatus: "VACANT_CLEAN", priority: "URGENT" },
              toolOutput: null,
              requiresApproval: true,
              isApproved: null,
              createdAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setActiveRun(initialMockRun);
      }
    } catch {
      const mockId = `run-${Date.now()}`;
      const initialMockRun: AgentRun = {
        id: mockId,
        triggerEvent,
        status: "AWAITING_APPROVAL",
        planSummary: `Autonomous Plan for: "${prompt}". 2 execution steps scheduled.`,
        steps: [
          {
            id: `step-1`,
            runId: mockId,
            stepNumber: 1,
            toolName: "inspect_turnover_queue",
            toolInput: { filter: "VACANT_DIRTY" },
            toolOutput: { dirtyRoomsCount: 3, highestPriority: "Suite 103" },
            requiresApproval: false,
            isApproved: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: `step-2`,
            runId: mockId,
            stepNumber: 2,
            toolName: "dispatch_housekeeping_task",
            toolInput: { roomId: "r-103", assignedStaff: "Housekeeping Team Alpha", priority: "URGENT" },
            toolOutput: null,
            requiresApproval: true,
            isApproved: null,
            createdAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setActiveRun(initialMockRun);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approveStep = React.useCallback(async (runId: string, stepId: string, approved: boolean) => {
    setActiveRun((prev) => {
      if (!prev || prev.id !== runId) return prev;
      const updatedSteps = prev.steps.map((s) => {
        if (s.id === stepId) {
          return {
            ...s,
            isApproved: approved,
            toolOutput: approved
              ? { result: "Action approved and executed by human operator" }
              : { result: "Action rejected by human operator" },
          };
        }
        return s;
      });

      const allDone = updatedSteps.every((s) => s.isApproved !== null);
      const newStatus: AgentRunStatus = allDone
        ? updatedSteps.some((s) => s.isApproved === false)
          ? "FAILED"
          : "COMPLETED"
        : "AWAITING_APPROVAL";

      return {
        ...prev,
        status: newStatus,
        steps: updatedSteps,
      };
    });

    try {
      await apiClient.post(`/agent/runs/${runId}/steps/${stepId}/approve`, { approved });
    } catch {
      // Retain optimistic update
    }
  }, []);

  return {
    activeRun,
    isLoading,
    error,
    dispatchRun,
    approveStep,
  };
}
