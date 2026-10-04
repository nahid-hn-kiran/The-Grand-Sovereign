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
    const res = await apiClient.get<User | { data: User } | { user: User }>("/auth/me");
    user =
      (res as { data?: User; user?: User }).data ||
      (res as { data?: User; user?: User }).user ||
      (res as User);
  } catch {
    user = null;
  }

  if (!user || !user.id || user.role === "GUEST") {
    redirect("/login?error=unauthorized");
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
