import { request } from "./request";

export function getCategories() {
  return request("/categories");
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

export function deleteCategory(id) {
  return request(`/categories/${id}`, {
    method: "DELETE",
  });
}
