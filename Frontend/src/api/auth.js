import { request } from "./request";

export function loginUser({ login, password }) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  });
}

export function registerUser({ login, password }) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  });
}

export function logoutUser() {
  return request("/logout", {
    method: "POST",
  });
}
