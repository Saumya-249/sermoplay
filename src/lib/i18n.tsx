import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UiLang = "en" | "hi";

const EN = {
  appName: "Sermo Play",
  appTagline: "Regional-language",
  classroom: "Classroom",
  dashboard: "Dashboard",
  library: "Game Library",
  lms: "Offline LMS & Flashcards",
  games: "Contextual Games Hub",
  challenges: "Timed Challenges",
  quizCreator: "Quiz Creator",
  printables: "Printable Hub",
  sync: "Sync Panel",
  leaderboard: "Leaderboard",
  admin: "Admin Console",
  quizPlayer: "Quiz Player",
  networkStatus: "Network Status",
  online: "Online",
  offline: "Offline",
  onlineFull: "Online (Connected to Cloud Server)",
  offlineFull: "Offline Mode (Local Sandbox Active)",
  goOffline: "Go offline",
  goOnline: "Go online",
  pendingSync: "Pending Sync",
  itemsPendingSync: "items pending sync",
  syncing: "Detecting network connection... Synchronizing local data to cloud repository...",
  signOut: "Logout",
  language: "Language",
  theme: "Theme",
  light: "Light",
  dark: "Dark",
  role: "Role",
  student: "Student",
  teacher: "Teacher",
  administrator: "Administrator",
  guest: "Guest",
  guestBanner: "Guest mode — read-only. Sign in to save progress.",
  play: "Play",
  open: "Open",
  reset: "Reset",
  next: "Next",
  previous: "Previous",
  start: "Start",
  restart: "Restart",
  score: "Score",
  timeLeft: "Time left",
  correct: "Correct",
  wrong: "Try again",
  greeting: "Namaste 👋",
  greetingSub: "Download once, teach anywhere — even without internet.",
  totalGames: "Total games available",
  playableQuestions: "Playable questions",
  storageUsed: "Local storage used",
  pendingItems: "Pending sync items",
  readyOffline: "Ready to play offline",
  readyOfflineSub: "Every game is bundled on this device — tap play to start instantly.",
  browseLibrary: "Browse full library",
  syncStatus: "Offline sync status",
  connectedCloud: "Connected to cloud",
  workingOffline: "Working offline",
  deviceStorage: "Device storage",
  recordsQueued: "records queued",
  openSyncPanel: "Open sync panel",
} as const;

export type I18nKey = keyof typeof EN;

const HI: Record<I18nKey, string> = {
  appName: "सर्मो प्ले",
  appTagline: "क्षेत्रीय भाषा",
  classroom: "कक्षा",
  dashboard: "डैशबोर्ड",
  library: "गेम लाइब्रेरी",
  lms: "ऑफ़लाइन एलएमएस और फ्लैशकार्ड",
  games: "प्रासंगिक गेम हब",
  challenges: "समयबद्ध चुनौतियाँ",
  quizCreator: "क्विज़ निर्माता",
  printables: "प्रिंट करने योग्य हब",
  sync: "सिंक पैनल",
  leaderboard: "लीडरबोर्ड",
  admin: "एडमिन कंसोल",
  quizPlayer: "क्विज़ प्लेयर",
  networkStatus: "नेटवर्क स्थिति",
  online: "ऑनलाइन",
  offline: "ऑफ़लाइन",
  onlineFull: "ऑनलाइन (क्लाउड सर्वर से जुड़ा)",
  offlineFull: "ऑफ़लाइन मोड (स्थानीय सैंडबॉक्स सक्रिय)",
  goOffline: "ऑफ़लाइन जाएँ",
  goOnline: "ऑनलाइन जाएँ",
  pendingSync: "सिंक होना बाकी",
  itemsPendingSync: "आइटम सिंक होना बाकी",
  syncing: "नेटवर्क कनेक्शन जाँच रहे हैं... स्थानीय डेटा क्लाउड पर भेजा जा रहा है...",
  signOut: "लॉगआउट",
  language: "भाषा",
  theme: "थीम",
  light: "उजाला",
  dark: "अँधेरा",
  role: "भूमिका",
  student: "छात्र",
  teacher: "शिक्षक",
  administrator: "प्रशासक",
  guest: "अतिथि",
  guestBanner: "अतिथि मोड — केवल पढ़ें। प्रगति सहेजने के लिए साइन इन करें।",
  play: "खेलें",
  open: "खोलें",
  reset: "हटाएं",
  next: "आगे",
  previous: "पीछे",
  start: "शुरू करें",
  restart: "फिर से शुरू करें",
  score: "अंक",
  timeLeft: "शेष समय",
  correct: "सही",
  wrong: "फिर कोशिश करें",
  greeting: "नमस्ते 👋",
  greetingSub: "एक बार डाउनलोड करें, कहीं भी पढ़ाएँ — बिना इंटरनेट के भी।",
  totalGames: "कुल उपलब्ध गेम",
  playableQuestions: "खेलने योग्य प्रश्न",
  storageUsed: "स्थानीय स्टोरेज उपयोग",
  pendingItems: "सिंक होना बाकी आइटम",
  readyOffline: "ऑफ़लाइन खेलने के लिए तैयार",
  readyOfflineSub: "हर गेम इस डिवाइस पर मौजूद है — खेलने के लिए टैप करें।",
  browseLibrary: "पूरी लाइब्रेरी देखें",
  syncStatus: "ऑफ़लाइन सिंक स्थिति",
  connectedCloud: "क्लाउड से जुड़ा",
  workingOffline: "ऑफ़लाइन कार्यरत",
  deviceStorage: "डिवाइस स्टोरेज",
  recordsQueued: "रिकॉर्ड कतार में",
  openSyncPanel: "सिंक पैनल खोलें",
};

const DICTS: Record<UiLang, Record<I18nKey, string>> = { en: EN, hi: HI };

type I18nState = {
  lang: UiLang;
  setLang: (l: UiLang) => void;
  toggleLang: () => void;
  t: (key: I18nKey) => string;
};

const g = globalThis as typeof globalThis & {
  __sermoI18nCtx?: React.Context<I18nState | null>;
};
const I18nCtx = (g.__sermoI18nCtx ??= createContext<I18nState | null>(null));

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<UiLang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("sermo-lang");
    if (stored === "hi" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((l: UiLang) => {
    setLangState(l);
    localStorage.setItem("sermo-lang", l);
  }, []);

  const value = useMemo<I18nState>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang(lang === "en" ? "hi" : "en"),
      t: (key: I18nKey) => DICTS[lang][key] ?? EN[key],
    }),
    [lang, setLang],
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n(): I18nState {
  const ctx = useContext(I18nCtx);
  if (ctx) return ctx;
  return {
    lang: "en",
    setLang: () => {},
    toggleLang: () => {},
    t: (key: I18nKey) => EN[key],
  };
}
