export type UserRole = "mahasiswa" | "admin";

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  student?: {
    id: number;
    nim: string;
    name: string;
  } | null;
}

const SESSION_KEY = "meltalcare_current_user";

export function getCurrentUser(): CurrentUser | null {
  if (typeof window === "undefined") return null;

  const rawUser = localStorage.getItem(SESSION_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as CurrentUser;
  } catch {
    clearSession();
    return null;
  }
}

export function saveSession(user: CurrentUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  document.cookie = `meltalcare_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
  window.dispatchEvent(new Event("meltalcare-session-updated"));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  document.cookie = "meltalcare_role=; path=/; max-age=0; SameSite=Lax";
}

export function getInitials(name?: string) {
  return (name || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
