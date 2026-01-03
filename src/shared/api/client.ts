export type FetchOptions = {
  revalidate?: number;
  tags?: string[];
  credentials?: RequestCredentials;
  headers?: HeadersInit;
};

export async function apiGet<T>(url: string, opts: FetchOptions = {}): Promise<T> {
  const res = await fetch(url, {
    next: opts.revalidate ? { revalidate: opts.revalidate, tags: opts.tags } : undefined,
    credentials: opts.credentials ?? "include",
    headers: opts.headers,
  });
  if (!res.ok) throw new Error(`GET ${url} failed`);
  return res.json();
}

export async function apiPost<T>(url: string, body: unknown, opts: FetchOptions = {}): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) },
    body: JSON.stringify(body),
    credentials: opts.credentials ?? "include",
  });
  if (!res.ok) throw new Error(`POST ${url} failed`);
  return res.json();
}

export async function apiPut<T>(url: string, body: unknown, opts: FetchOptions = {}): Promise<T> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) },
    body: JSON.stringify(body),
    credentials: opts.credentials ?? "include",
  });
  if (!res.ok) throw new Error(`PUT ${url} failed`);
  return res.json();
}

export async function apiDelete<T>(url: string, body?: unknown, opts: FetchOptions = {}): Promise<T> {
  const res = await fetch(url, {
    method: "DELETE",
    headers: body ? { "Content-Type": "application/json", ...(opts.headers ?? {}) } : opts.headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: opts.credentials ?? "include",
  });
  if (!res.ok) throw new Error(`DELETE ${url} failed`);
  return res.json();
}

