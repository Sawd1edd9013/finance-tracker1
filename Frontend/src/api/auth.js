import { request } from "./request";

export function loginUser({ login, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  });
}

export function registerUser({ login, password }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  });
}

export function logoutUser() {
  return request("/auth/logout", {
    method: "POST",
  });
}

export function getUserName() {
  return request("/auth/username");
}

export function updateUserSettings({ login, password }) {
  return request("/auth/settings", {
    method: "PATCH",
    body: JSON.stringify({
      login,
      password,
    }),
  });
}
