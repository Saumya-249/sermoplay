/** Deterministic school dataset powering the School & Learning Management Panel. */

import type { ADMIN_EN } from "@/lib/i18n-admin";

export type SubjectKey = "adSubMath" | "adSubScience" | "adSubSocial" | "adSubLang";
export type AdminKey = keyof typeof ADMIN_EN;

export type StudentRecord = {
  id: string;
  name: string;
  classNo: number;
  avgScore: number;
  gamesPlayed: number;
  lastActiveDays: number;
};

const FIRST = ["Aarav","Diya","Kabir","Ananya","Ishaan","Meera","Rohan","Sara","Vihaan","Tanvi","Arjun","Nisha","Kiran","Pooja","Aditya","Riya","Manav","Sneha","Yash","Lata","Dev","Kavya","Nikhil","Anjali","Rahul","Priyanka","Farhan","Ritika","Suresh","Bhavna","Omkar","Ishita","Vikram","Shreya","Naveen","Aisha"];
const LAST = ["Sharma","Patel","Verma","Rao","Gupta","Nair","Das","Khan","Reddy","Iyer","Joshi","Banerjee","Kulkarni","Pillai","Mishra","Chauhan"];

function seeded(i: number, mod: number) {
  return (i * 7919 + 104729) % mod;
}

export const STUDENTS: StudentRecord[] = Array.from({ length: 36 }, (_, i) => ({
  id: `stu-${i + 1}`,
  name: `${FIRST[i % FIRST.length]} ${LAST[seeded(i, LAST.length)]}`,
  classNo: (i % 12) + 1,
  avgScore: 58 + seeded(i, 40),
  gamesPlayed: 6 + seeded(i + 3, 55),
  lastActiveDays: seeded(i + 5, 9),
}));

export type TeacherRecord = {
  id: string;
  name: string;
  subject: SubjectKey;
  quizzes: number;
  decks: number;
  worksheets: number;
};

export const TEACHERS: TeacherRecord[] = [
  { id: "t1", name: "Deepak Kumar", subject: "adSubMath", quizzes: 24, decks: 11, worksheets: 18 },
  { id: "t2", name: "Priya Patel", subject: "adSubScience", quizzes: 19, decks: 15, worksheets: 12 },
  { id: "t3", name: "Lakshmi Iyer", subject: "adSubLang", quizzes: 16, decks: 9, worksheets: 21 },
  { id: "t4", name: "Sanjay Mehta", subject: "adSubSocial", quizzes: 13, decks: 6, worksheets: 9 },
  { id: "t5", name: "Fatima Sheikh", subject: "adSubScience", quizzes: 21, decks: 12, worksheets: 14 },
  { id: "t6", name: "Rakesh Nair", subject: "adSubMath", quizzes: 17, decks: 8, worksheets: 16 },
  { id: "t7", name: "Anita Banerjee", subject: "adSubLang", quizzes: 11, decks: 14, worksheets: 7 },
  { id: "t8", name: "Vivek Kulkarni", subject: "adSubSocial", quizzes: 9, decks: 5, worksheets: 11 },
];

export const CURRICULUM_AUDIT: { subject: SubjectKey; chapters: number; quizzes: number }[] = [
  { subject: "adSubMath", chapters: 148, quizzes: 41 },
  { subject: "adSubScience", chapters: 132, quizzes: 40 },
  { subject: "adSubSocial", chapters: 126, quizzes: 22 },
  { subject: "adSubLang", chapters: 164, quizzes: 27 },
];

export const LANGUAGE_ENGAGEMENT: { key: AdminKey; share: number; color: string }[] = [
  { key: "adLgHindi", share: 40, color: "hsl(var(--chart-1, 24 88% 52%))" },
  { key: "adLgTamil", share: 20, color: "hsl(var(--chart-2, 43 90% 50%))" },
  { key: "adLgTelugu", share: 15, color: "hsl(var(--chart-3, 160 55% 40%))" },
  { key: "adLgEnglish", share: 10, color: "hsl(var(--chart-4, 210 65% 50%))" },
  { key: "adLgOthers", share: 15, color: "hsl(var(--chart-5, 280 45% 55%))" },
];

export type OpsLog =
  | { id: string; kind: "adLogWorksheet"; name: string; cls: number; subject: SubjectKey; topic: AdminKey; days: number }
  | { id: string; kind: "adLogScore"; name: string; score: number; game: string; days: number }
  | { id: string; kind: "adLogDeck"; name: string; cls: number; subject: SubjectKey; days: number }
  | { id: string; kind: "adLogQuiz"; name: string; cls: number; subject: SubjectKey; days: number }
  | { id: string; kind: "adLogJoined"; name: string; cls: number; days: number };

export const OPS_LOG: OpsLog[] = [
  { id: "l1", kind: "adLogWorksheet", name: "Deepak Kumar", cls: 10, subject: "adSubMath", topic: "adTopicGeometry", days: 0 },
  { id: "l2", kind: "adLogScore", name: "Rahul Sharma", score: 90, game: "agFractionT", days: 0 },
  { id: "l3", kind: "adLogDeck", name: "Priya Patel", cls: 5, subject: "adSubScience", days: 0 },
  { id: "l4", kind: "adLogQuiz", name: "Lakshmi Iyer", cls: 7, subject: "adSubLang", days: 1 },
  { id: "l5", kind: "adLogScore", name: "Meera Nair", score: 84, game: "agBazaarT", days: 1 },
  { id: "l6", kind: "adLogWorksheet", name: "Fatima Sheikh", cls: 8, subject: "adSubScience", topic: "adTopicPhotosynthesis", days: 2 },
  { id: "l7", kind: "adLogJoined", name: "Ishita Joshi", cls: 3, days: 2 },
  { id: "l8", kind: "adLogQuiz", name: "Sanjay Mehta", cls: 9, subject: "adSubSocial", days: 3 },
  { id: "l9", kind: "adLogScore", name: "Kabir Verma", score: 76, game: "agOrbitT", days: 3 },
  { id: "l10", kind: "adLogDeck", name: "Anita Banerjee", cls: 6, subject: "adSubLang", days: 4 },
];

export const TOTAL_ASSETS =
  TEACHERS.reduce((a, t) => a + t.quizzes + t.decks + t.worksheets, 0);

export const GLOBAL_ACCURACY = Math.round(
  STUDENTS.reduce((a, s) => a + s.avgScore, 0) / STUDENTS.length,
);

export const TOTAL_ASSESSMENTS = STUDENTS.reduce((a, s) => a + s.gamesPlayed, 0);
