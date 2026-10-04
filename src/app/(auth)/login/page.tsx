"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Crown, KeyRound, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { siteConfig } from "@/content/site.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const searchParams = useSearchParams();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const urlError = searchParams?.get("error");

  React.useEffect(() => {
    if (urlError === "unauthorized") {
      setErrorMessage("Please sign in to access that page.");
    }
  }, [urlError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await login({ email, password });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed. Please check your credentials.";
      setErrorMessage(msg);
    }
  };

  const handleDemoSelect = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-background via-background/95 to-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-2xl border border-border/50 shadow-2xl bg-card"
      >
        {/* Left Side: Luxury Branding Banner */}
        <div className="lg:col-span-5 relative p-8 lg:p-10 bg-gradient-to-br from-primary/95 via-primary to-amber-900 text-primary-foreground flex flex-col justify-between overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur-md border border-primary-foreground/20">
              <Crown className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight">{siteConfig.name}</h2>
              <p className="text-xs uppercase tracking-widest text-primary-foreground/80 font-medium mt-1">
                {siteConfig.tagline}
              </p>
            </div>
          </div>

          <div className="relative z-10 my-8 space-y-4 text-sm text-primary-foreground/90">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-amber-300" />
              <span>Encrypted VIP Guest & Staff Portal</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 shrink-0 text-amber-300" />
              <span>24/7 AI Concierge & Direct Reservations</span>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-primary-foreground/20 text-xs text-primary-foreground/70">
            Protected by Sovereign Identity & Data Shield.
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="space-y-2 mb-6">
            <h3 className="text-2xl font-bold font-serif text-foreground">Sign In to Your Account</h3>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your reservation or staff portal.
            </p>
          </div>

          {/* Demo Chips Selector */}
          <div className="mb-6 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Quick Demo Access
            </span>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                onClick={() => handleDemoSelect("admin@hotel.com", "Password123!")}
                className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors py-1 px-3 gap-1.5"
              >
                <UserCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                Admin Demo
              </Badge>
              <Badge
                variant="outline"
                onClick={() => handleDemoSelect("frontdesk@hotel.com", "Password123!")}
                className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors py-1 px-3 gap-1.5"
              >
                <UserCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Front Desk Demo
              </Badge>
              <Badge
                variant="outline"
                onClick={() => handleDemoSelect("guest@example.com", "Password123!")}
                className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors py-1 px-3 gap-1.5"
              >
                <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Guest Demo
              </Badge>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 p-3.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Password</label>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-11 text-base font-semibold shadow-md mt-2">
              {isLoading ? "Signing In..." : "Sign In"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Create guest account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
