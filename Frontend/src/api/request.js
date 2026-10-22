export async function request(path, options = {}) {
  const { headers, ...restOptions } = options;

  const response = await fetch(`/api${path}`, {
    ...restOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Request error");
  }

  return data;
}
