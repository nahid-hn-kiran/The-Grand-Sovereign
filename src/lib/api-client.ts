export class ApiError extends Error {
  public status: number;
  public code?: string;
  public data?: unknown;

  constructor(message: string, status: number, code?: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  meta?: Record<string, unknown>;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, headers: customHeaders, ...customConfig } = options;

  let url = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();
      if (cookieHeader) {
        defaultHeaders["Cookie"] = cookieHeader;
      }
    } catch {
      // Ignore outside request context
    }
  }

  const config: RequestInit = {
    method: "GET",
    headers: {
      ...defaultHeaders,
      ...customHeaders,
    },
    credentials: "include",
    ...customConfig,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Network request failed";
    throw new ApiError(message, 0, "NETWORK_ERROR");
  }

  let data: unknown;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      (data as { message?: string; error?: string })?.message ||
      (data as { message?: string; error?: string })?.error ||
      `Request failed with status ${response.status}`;
    const errorCode = (data as { code?: string })?.code || `HTTP_${response.status}`;
    throw new ApiError(errorMessage, response.status, errorCode, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "POST", body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
