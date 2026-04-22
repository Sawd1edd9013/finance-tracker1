import { request } from "./request";

export function getTransactions(filters = {}) {
  const searchParams = new URLSearchParams();

  if (filters.from) searchParams.append("from", filters.from);
  if (filters.to) searchParams.append("to", filters.to);
  if (filters.type) searchParams.append("type", filters.type);
  if (filters.accountId) searchParams.append("accountId", filters.accountId);
  if (filters.categoryId) searchParams.append("categoryId", filters.categoryId);
  if (filters.page) searchParams.append("page", String(filters.page));
  if (filters.limit) searchParams.append("limit", String(filters.limit));

  const query = searchParams.toString();

  return request(`/transactions${query ? `?${query}` : ""}`);
}

export function createTransaction(data) {
  return request("/transactions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteTransaction(id) {
  return request(`/transactions/${id}`, {
    method: "DELETE",
  });
}

export function updateTransaction(id, data) {
  return request(`/transactions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
