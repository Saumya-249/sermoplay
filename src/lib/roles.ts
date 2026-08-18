export type AppRole = "student" | "teacher" | "admin";

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
    "/analytics",
    "/printables",
    "/sync",
  ],
  admin: [
    "/dashboard",
    "/leaderboard",
    "/quiz-creator",
    "/analytics",
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
