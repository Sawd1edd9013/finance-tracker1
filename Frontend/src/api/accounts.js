import { request } from "./request";

export function getAccounts(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", String(params.page));
  if (params.limit) searchParams.append("limit", String(params.limit));

  const query = searchParams.toString();

  return request(`/accounts${query ? `?${query}` : ""}`);
}

export function createAccount({ name, type, balance }) {
  return request("/accounts", {
    method: "POST",
    body: JSON.stringify({
      name,
      type,
      balance,
    }),
  });
}

export function updateAccount(id, { name, type, balance }) {
  return request(`/accounts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name,
      type,
      balance,
    }),
  });
}

export function deleteAccount(id) {
  return request(`/accounts/${id}`, {
    method: "DELETE",
  });
}
