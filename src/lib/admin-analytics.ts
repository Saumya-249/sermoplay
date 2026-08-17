/** Deterministic mock analytics dataset for the Administrator Dashboard. */

export type StudentRow = {
  name: string;
  nameHi: string;
  classLevel: string;
  avgScore: number;
  timePerGameSec: number;
  completionRate: number;
  weakestSubject: string;
  weakestSubjectHi: string;
  incorrectShare: number;
};

export type TeacherRow = {
  name: string;
  nameHi: string;
  quizzesGenerated: number;
  topSubject: string;
  topSubjectHi: string;
  activeClasses: number;
  lmsModules: number;
};

export const STUDENT_ROWS: StudentRow[] = [
  { name: "Aarav Sharma", nameHi: "आरव शर्मा", classLevel: "Class 1", avgScore: 81, timePerGameSec: 38, completionRate: 92, weakestSubject: "Maths", weakestSubjectHi: "गणित", incorrectShare: 34 },
  { name: "Diya Patel", nameHi: "दीया पटेल", classLevel: "Class 2", avgScore: 76, timePerGameSec: 44, completionRate: 88, weakestSubject: "Science", weakestSubjectHi: "विज्ञान", incorrectShare: 41 },
  { name: "Kabir Verma", nameHi: "कबीर वर्मा", classLevel: "Class 3", avgScore: 69, timePerGameSec: 51, completionRate: 74, weakestSubject: "Maths", weakestSubjectHi: "गणित", incorrectShare: 47 },
  { name: "Ananya Rao", nameHi: "अनन्या राव", classLevel: "Class 4", avgScore: 84, timePerGameSec: 36, completionRate: 95, weakestSubject: "Social Studies", weakestSubjectHi: "सामाजिक अध्ययन", incorrectShare: 28 },
  { name: "Ishaan Gupta", nameHi: "ईशान गुप्ता", classLevel: "Class 5", avgScore: 72, timePerGameSec: 47, completionRate: 81, weakestSubject: "Language", weakestSubjectHi: "भाषा", incorrectShare: 39 },
  { name: "Meera Nair", nameHi: "मीरा नायर", classLevel: "Class 6", avgScore: 88, timePerGameSec: 33, completionRate: 97, weakestSubject: "Science", weakestSubjectHi: "विज्ञान", incorrectShare: 22 },
  { name: "Rohan Das", nameHi: "रोहन दास", classLevel: "Class 7", avgScore: 65, timePerGameSec: 56, completionRate: 68, weakestSubject: "Maths", weakestSubjectHi: "गणित", incorrectShare: 52 },
  { name: "Sara Khan", nameHi: "सारा खान", classLevel: "Class 8", avgScore: 79, timePerGameSec: 41, completionRate: 86, weakestSubject: "Social Studies", weakestSubjectHi: "सामाजिक अध्ययन", incorrectShare: 31 },
];

export const TEACHER_ROWS: TeacherRow[] = [
  { name: "Sunita Joshi", nameHi: "सुनीता जोशी", quizzesGenerated: 42, topSubject: "Maths", topSubjectHi: "गणित", activeClasses: 4, lmsModules: 11 },
  { name: "Ramesh Iyer", nameHi: "रमेश अय्यर", quizzesGenerated: 35, topSubject: "Science", topSubjectHi: "विज्ञान", activeClasses: 3, lmsModules: 8 },
  { name: "Fatima Ansari", nameHi: "फ़ातिमा अंसारी", quizzesGenerated: 28, topSubject: "Language", topSubjectHi: "भाषा", activeClasses: 5, lmsModules: 14 },
  { name: "Vikram Singh", nameHi: "विक्रम सिंह", quizzesGenerated: 19, topSubject: "Social Studies", topSubjectHi: "सामाजिक अध्ययन", activeClasses: 2, lmsModules: 6 },
  { name: "Priya Menon", nameHi: "प्रिया मेनन", quizzesGenerated: 24, topSubject: "Maths", topSubjectHi: "गणित", activeClasses: 3, lmsModules: 9 },
];

export const COMPLETION_BY_CLASS = STUDENT_ROWS.map((s) => ({
  classLevel: s.classLevel,
  completionRate: s.completionRate,
}));

export const WEAK_SUBJECT_DISTRIBUTION = [
  { subject: "Maths", subjectHi: "गणित", share: 38 },
  { subject: "Science", subjectHi: "विज्ञान", share: 27 },
  { subject: "Language", subjectHi: "भाषा", share: 20 },
  { subject: "Social Studies", subjectHi: "सामाजिक अध्ययन", share: 15 },
];

export const GLOBAL_AVG_SCORE = Math.round(
  STUDENT_ROWS.reduce((a, s) => a + s.avgScore, 0) / STUDENT_ROWS.length,
);

export const AVG_TIMED_GAME_SEC = Math.round(
  STUDENT_ROWS.reduce((a, s) => a + s.timePerGameSec, 0) / STUDENT_ROWS.length,
);

export const TOTAL_LMS_MODULES = TEACHER_ROWS.reduce((a, t) => a + t.lmsModules, 0);

export const FALLBACK_QUIZ_COUNT = TEACHER_ROWS.reduce((a, t) => a + t.quizzesGenerated, 0);
