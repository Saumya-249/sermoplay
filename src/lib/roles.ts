export type AppRole = "student" | "teacher" | "admin";

export const GUEST_KEY = "sermo-guest";

export function isGuestMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GUEST_KEY) === "true";
}

export function enterGuestMode() {
  localStorage.setItem(GUEST_KEY, "true");
}

export function exitGuestMode() {
  localStorage.removeItem(GUEST_KEY);
}

/** Which navigation destinations each role may reach. */
export const ROLE_ROUTES: Record<AppRole, string[]> = {
  student: ["/dashboard", "/library", "/lms", "/games", "/challenges", "/leaderboard"],
  teacher: [
    "/dashboard",
    "/library",
    "/lms",
    "/games",
    "/challenges",
    "/leaderboard",
    "/quiz-creator",
    "/printables",
    "/sync",
  ],
  admin: [
    "/dashboard",
    "/library",
    "/lms",
    "/games",
    "/challenges",
    "/leaderboard",
    "/quiz-creator",
    "/printables",
    "/sync",
    "/admin",
  ],
};

export function canAccess(role: AppRole, path: string): boolean {
  return ROLE_ROUTES[role].includes(path);
}

export function roleLabel(role: AppRole): string {
  return role === "admin" ? "Administrator" : role === "teacher" ? "Teacher" : "Student";
}
