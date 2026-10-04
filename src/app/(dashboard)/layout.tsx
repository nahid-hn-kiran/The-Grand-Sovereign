import { redirect } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { User } from "@/types/auth.types";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: User | null = null;

  try {
    const res = await apiClient.get<any>("/auth/me");
    const data = res?.data ?? res;
    const extracted = data?.user ?? data;
    if (extracted && typeof extracted === "object" && extracted.id) {
      user = extracted as User;
    }
  } catch {
    user = null;
  }

  if (!user || !user.id || user.role === "GUEST") {
    redirect("/login?error=unauthorized");
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
