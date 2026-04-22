import { api } from "./api";
import type { AuthTokens } from "@/types";

export async function login(username: string, password: string): Promise<AuthTokens> {
  const tokens = await api.post<AuthTokens>("/token/", { username, password });
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
    localStorage.setItem("username", tokens.username);
    localStorage.setItem("is_staff", String(tokens.is_staff));
  }
  return tokens;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("is_staff");
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredToken());
}

export function isStaff(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("is_staff") === "true";
}
