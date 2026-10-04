"use client";

import * as React from "react";
import { Bot, Send, ShieldAlert, CheckCircle2, XCircle, Sparkles, Terminal } from "lucide-react";
import { useAgentStream } from "@/hooks/use-agent-stream";
import { AgentRunStatus } from "@/types/agent.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusBadgeConfig: Record<AgentRunStatus, { label: string; className: string }> = {
  QUEUED: { label: "Queued", className: "border-slate-500/40 bg-slate-500/10 text-slate-600 dark:text-slate-400" },
  RUNNING: { label: "Running Steps", className: "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 animate-pulse" },
  AWAITING_APPROVAL: { label: "Human Approval Required", className: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold" },
  COMPLETED: { label: "Run Completed", className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold" },
  FAILED: { label: "Rejected / Failed", className: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400" },
};

const DEMO_PROMPTS = [
  "Turnover Room 101 with High Priority",
  "Check availability for next weekend and calculate rate difference",
  "Inspect active guest requests and generate breakfast summary",
];

export default function AgentControlPage() {
  const { activeRun, isLoading, dispatchRun, approveStep } = useAgentStream();
  const [triggerEvent, setTriggerEvent] = React.useState("GUEST_REQUEST");
  const [prompt, setPrompt] = React.useState("");

  const handleDispatch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    await dispatchRun(triggerEvent, prompt);
  };

  const handleChipClick = (demoText: string) => {
    setPrompt(demoText);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
          <Bot className="h-3.5 w-3.5" />
          Sovereign Autonomous Agent Oversight
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">AI Control Center</h1>
        <p className="text-sm text-muted-foreground">
          Dispatch autonomous agent operations, inspect tool invocation logs, and execute Human-in-the-Loop (HITL) step approvals.
        </p>
      </div>

      {/* Prompt Dispatch Bar Card */}
      <Card className="border border-border/50 shadow-lg bg-card/60 backdrop-blur-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-amber-500/10 border-b border-border/40">
          <CardTitle className="font-serif text-lg font-bold flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            Dispatch Agent Task
          </CardTitle>
          <CardDescription>Specify operational instructions & trigger context</CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleDispatch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Trigger Event Context
                </label>
                <select
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="GUEST_REQUEST">GUEST_REQUEST</option>
                  <option value="ROOM_TURNOVER">ROOM_TURNOVER</option>
                  <option value="MANUAL_DISPATCH">MANUAL_DISPATCH</option>
                </select>
              </div>

              <div className="md:col-span-8 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Agent Instruction Prompt
                </label>
                <div className="flex gap-2">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter task instruction..."
                    className="h-11 text-sm flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !prompt.trim()} className="h-11 px-6 font-semibold shadow-md shrink-0">
                    {isLoading ? "Dispatching..." : "Dispatch Agent"}
                    {!isLoading && <Send className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* Demo Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Demos:</span>
            {DEMO_PROMPTS.map((dp, i) => (
              <Badge
                key={i}
                variant="outline"
                onClick={() => handleChipClick(dp)}
                className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors py-1 px-2.5 text-xs"
              >
                {dp}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Run Execution Feed */}
      {activeRun && (
        <div className="space-y-6">
          {/* Status & Plan Summary Card */}
          <Card className="border border-border/50 shadow-md bg-card/60">
            <CardHeader className="p-5 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-mono text-muted-foreground">RUN ID: {activeRun.id}</span>
                <h3 className="font-serif text-xl font-bold text-foreground">Operational Plan Summary</h3>
              </div>
              <Badge variant="outline" className={statusBadgeConfig[activeRun.status]?.className}>
                {statusBadgeConfig[activeRun.status]?.label}
              </Badge>
            </CardHeader>

            <CardContent className="p-5 text-sm leading-relaxed text-muted-foreground">
              {activeRun.planSummary || "Executing multi-step reasoning plan..."}
            </CardContent>
          </Card>

          {/* Sequential Tool Execution Steps */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Tool Execution Timeline ({activeRun.steps.length} Steps)
            </h3>

            <div className="space-y-4">
              {activeRun.steps.map((step) => {
                const requiresAction = step.requiresApproval && step.isApproved === null;

                return (
                  <Card
                    key={step.id}
                    className={cn(
                      "border shadow-sm transition-all duration-300",
                      requiresAction
                        ? "border-amber-500/50 bg-amber-500/10 shadow-lg ring-2 ring-amber-500/30"
                        : step.isApproved === false
                        ? "border-red-500/30 bg-red-500/5"
                        : "border-border/50 bg-card/60"
                    )}
                  >
                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/15 text-primary border-primary/30 font-bold font-mono">
                          Step #{step.stepNumber}
                        </Badge>
                        <span className="font-mono text-sm font-bold text-foreground">{step.toolName}</span>
                      </div>

                      {step.isApproved === true && (
                        <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1 text-xs">
                          <CheckCircle2 className="h-3 w-3" /> Executed
                        </Badge>
                      )}

                      {step.isApproved === false && (
                        <Badge variant="outline" className="border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 gap-1 text-xs">
                          <XCircle className="h-3 w-3" /> Rejected
                        </Badge>
                      )}

                      {requiresAction && (
                        <Badge variant="outline" className="border-amber-500/40 bg-amber-500/20 text-amber-700 dark:text-amber-300 gap-1 text-xs font-bold animate-pulse">
                          <ShieldAlert className="h-3.5 w-3.5" /> Approval Required
                        </Badge>
                      )}
                    </CardHeader>

                    <CardContent className="p-4 pt-2 space-y-3 text-xs">
                      {/* Tool Inputs */}
                      <div className="space-y-1">
                        <span className="font-semibold text-muted-foreground uppercase tracking-wider">Invocation Parameters:</span>
                        <pre className="p-2.5 rounded-lg bg-background/80 border border-border/40 font-mono text-muted-foreground overflow-x-auto">
                          {JSON.stringify(step.toolInput, null, 2)}
                        </pre>
                      </div>

                      {/* Tool Output if present */}
                      {step.toolOutput && (
                        <div className="space-y-1">
                          <span className="font-semibold text-muted-foreground uppercase tracking-wider">Tool Output:</span>
                          <pre className="p-2.5 rounded-lg bg-background/80 border border-border/40 font-mono text-emerald-600 dark:text-emerald-400 overflow-x-auto">
                            {JSON.stringify(step.toolOutput, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* HITL Action Card inside step when approval required */}
                      {requiresAction && (
                        <div className="pt-3 border-t border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-500/10 p-3.5 rounded-xl">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-amber-700 dark:text-amber-300 text-sm block">
                              Human Operator Approval Required
                            </span>
                            <p className="text-xs text-muted-foreground">
                              This tool modifies operational room state or dispatches staff tasks. Confirm execution.
                            </p>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                            <Button
                              size="sm"
                              onClick={() => approveStep(activeRun.id, step.id, true)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex-1 sm:flex-initial"
                            >
                              Approve Execution
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => approveStep(activeRun.id, step.id, false)}
                              className="flex-1 sm:flex-initial"
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
