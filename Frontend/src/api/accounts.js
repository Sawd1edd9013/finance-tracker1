import { request } from "./request";

export function getAccounts() {
  return request("/accounts");
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
