const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown>;
};

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.message ||
      Object.values(data?.errors || {})
        .flat()
        .join(" ") ||
      "Terjadi kesalahan saat menghubungi server.";

    throw new Error(message);
  }

  return data as T;
}

