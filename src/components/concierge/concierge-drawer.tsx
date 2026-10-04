"use client";

import * as React from "react";
import { Sparkles, Send, Crown, Bot, User as UserIcon, BookOpen, ShieldCheck } from "lucide-react";
import { useConcierge } from "@/hooks/use-concierge";
import { conciergeContent } from "@/content/concierge.content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function ConciergeDrawer() {
  const { messages, isOpen, isStreaming, toggleOpen, setOpen, sendMessage } = useConcierge();
  const [inputQuery, setInputQuery] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isStreaming, scrollToBottom]);

  const handleSend = async () => {
    if (!inputQuery.trim() || isStreaming) return;
    const text = inputQuery;
    setInputQuery("");
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (promptText: string) => {
    sendMessage(promptText);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {/* Floating Pill Trigger (Fixed at Bottom-Right) */}
      <SheetTrigger asChild>
        <Button
          onClick={toggleOpen}
          size="lg"
          className="fixed bottom-6 right-6 z-40 rounded-full shadow-2xl gap-2.5 h-12 px-5 bg-gradient-to-r from-amber-600 via-primary to-amber-700 hover:from-amber-700 hover:to-amber-800 text-primary-foreground font-semibold border border-amber-300/30 transition-transform duration-300 hover:scale-105"
        >
          <Sparkles className="h-5 w-5 animate-pulse text-amber-300" />
          <span className="font-serif">AI Concierge</span>
          <Badge
            variant="secondary"
            className="bg-primary-foreground/20 text-primary-foreground border-none text-[10px] px-1.5 py-0 font-bold uppercase"
          >
            24/7
          </Badge>
        </Button>
      </SheetTrigger>

      {/* Sliding Sheet Drawer */}
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full bg-background border-l border-border/50">
        {/* Header */}
        <SheetHeader className="p-5 border-b border-border/40 bg-gradient-to-r from-primary/10 via-primary/5 to-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm border border-primary/20">
              <Crown className="h-6 w-6" />
            </div>
            <div className="flex flex-col text-left">
              <SheetTitle className="font-serif text-lg font-bold text-foreground">
                {conciergeContent.title}
              </SheetTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Grounded in Hotel Policy
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Message History Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={cn("flex gap-3 text-sm", isUser ? "justify-end" : "justify-start")}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div className={cn("flex flex-col space-y-2 max-w-[82%]", isUser ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                      isUser
                        ? "bg-primary text-primary-foreground rounded-br-none font-medium"
                        : "bg-card border border-border/50 text-foreground rounded-bl-none"
                    )}
                  >
                    {msg.content}
                  </div>

                  {/* Grounded RAG Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground flex items-center gap-1 w-full">
                        <BookOpen className="h-3 w-3 text-primary" /> Verified Policy Sources:
                      </span>
                      {msg.sources.map((src, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[10px] py-0.5 px-2 border-primary/30 bg-primary/5 text-primary gap-1"
                        >
                          <span>{src.title}</span>
                          <span className="font-mono text-[9px] opacity-75">
                            ({(src.similarity * 100).toFixed(0)}%)
                          </span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground mt-1 font-bold text-xs">
                    <UserIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Streaming Skeleton */}
          {isStreaming && (
            <div className="flex gap-3 text-sm justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary mt-1">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-card border border-border/50 text-muted-foreground flex items-center gap-1.5 rounded-bl-none">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Chips (If messages list is short) */}
        {messages.length <= 3 && (
          <div className="p-3 border-t border-border/30 bg-muted/20">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2 px-1">
              Suggested Concierge Queries
            </span>
            <div className="flex flex-wrap gap-1.5">
              {conciergeContent.quickPrompts.map((qp) => (
                <button
                  key={qp.id}
                  onClick={() => handlePromptClick(qp.prompt)}
                  disabled={isStreaming}
                  className="text-left text-xs py-1 px-2.5 rounded-lg border border-border/50 bg-card hover:bg-primary/10 hover:border-primary/40 text-foreground transition-colors"
                >
                  {qp.shortLabel}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-border/40 bg-card flex items-center gap-2">
          <Input
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about breakfast, checkout, or valet..."
            disabled={isStreaming}
            className="flex-1 h-11 text-sm bg-background border-border/60"
          />
          <Button
            onClick={handleSend}
            disabled={isStreaming || !inputQuery.trim()}
            size="icon"
            className="h-11 w-11 shrink-0 shadow-md"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
