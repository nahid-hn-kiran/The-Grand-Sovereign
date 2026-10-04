"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";
import { User, LoginCredentials, RegisterCredentials, UserRole } from "@/types/auth.types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

function getRedirectPathForRole(role: UserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin";
    case "FRONT_DESK":
      return "/front-desk";
    case "HOUSEKEEPING":
      return "/housekeeping";
    case "GUEST":
    default:
      return "/rooms";
  }
}

function AuthProviderContent({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = React.useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const refreshUser = React.useCallback(async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<User | { data: User } | { user: User }>("/auth/me");
      const fetchedUser =
        (res as { data?: User; user?: User }).data ||
        (res as { data?: User; user?: User }).user ||
        (res as User);
      const validUser = fetchedUser && fetchedUser.id ? fetchedUser : null;
      setUser(validUser);
      return validUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (initialUser !== undefined && initialUser !== null) {
      setUser(initialUser);
    }
  }, [initialUser]);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<User | { data: User } | { user: User }>(
        "/auth/login",
        credentials
      );
      const authenticatedUser =
        (res as { data?: User; user?: User }).data ||
        (res as { data?: User; user?: User }).user ||
        (res as User);

      if (!authenticatedUser || !authenticatedUser.id) {
        throw new ApiError("Invalid response format from login endpoint", 500);
      }

      setUser(authenticatedUser);

      const redirectParam = searchParams?.get("redirect");
      const defaultPath = getRedirectPathForRole(authenticatedUser.role);
      const targetPath = redirectParam || defaultPath;

      router.push(targetPath);
      router.refresh();
      return authenticatedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<User | { data: User } | { user: User }>(
        "/auth/register",
        credentials
      );
      const registeredUser =
        (res as { data?: User; user?: User }).data ||
        (res as { data?: User; user?: User }).user ||
        (res as User);

      if (registeredUser && registeredUser.id) {
        setUser(registeredUser);
        const redirectParam = searchParams?.get("redirect");
        const defaultPath = getRedirectPathForRole(registeredUser.role);
        router.push(redirectParam || defaultPath);
        router.refresh();
        return registeredUser;
      }

      return await login({ email: credentials.email, password: credentials.password });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await apiClient.post("/auth/logout");
    } catch (err) {
      console.warn("Logout request failed or endpoint unavailable:", err);
    } finally {
      setUser(null);
      setIsLoading(false);
      router.push("/login");
      router.refresh();
    }
  };

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  return (
    <React.Suspense fallback={null}>
      <AuthProviderContent initialUser={initialUser}>{children}</AuthProviderContent>
    </React.Suspense>
  );
}
