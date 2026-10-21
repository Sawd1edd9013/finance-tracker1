import { request } from "./request";

export function getCategories(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", String(params.page));
  if (params.limit) searchParams.append("limit", String(params.limit));

  const query = searchParams.toString();

  return request(`/categories${query ? `?${query}` : ""}`);
}

export function createCategory({ name, type }) {
  return request("/categories", {
    method: "POST",
    body: JSON.stringify({
      name,
      type,
    }),
  });
}

export function updateCategory(id, { name, type }) {
  return request(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name,
      type,
    }),
  });
}

export function deleteCategory(id, { strategy, targetId } = {}) {
  const searchParams = new URLSearchParams();

  if (strategy) searchParams.append("strategy", strategy);
  if (targetId) searchParams.append("targetId", targetId);

  const query = searchParams.toString();

  return request(`/categories/${id}${query ? `?${query}` : ""}`, {
    method: "DELETE",
  });
}
