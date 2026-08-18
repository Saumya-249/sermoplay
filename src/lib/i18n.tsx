import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UiLang = "en" | "hi" | "ta" | "kn" | "bn" | "mr" | "te";

export const LANGUAGES: { code: UiLang; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिंदी (Hindi)", short: "हि" },
  { code: "ta", label: "தமிழ் (Tamil)", short: "த" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)", short: "ಕ" },
  { code: "bn", label: "বাংলা (Bengali)", short: "বা" },
  { code: "mr", label: "मराठी (Marathi)", short: "मरा" },
  { code: "te", label: "తెలుగు (Telugu)", short: "తె" },
];

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
  analytics: "Teacher Analytics",
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


type PartialDict = Partial<Record<I18nKey, string>>;

const TA: PartialDict = {
  appName: "செர்மோ ப்ளே",
  classroom: "வகுப்பறை",
  dashboard: "டாஷ்போர்டு",
  library: "விளையாட்டு நூலகம்",
  lms: "ஆஃப்லைன் எல்எம்எஸ் & ஃபிளாஷ்கார்டு",
  games: "விளையாட்டு மையம்",
  challenges: "நேர சவால்கள்",
  quizCreator: "வினாடி வினா உருவாக்கி",
  printables: "அச்சிடும் மையம்",
  sync: "ஒத்திசைவு பலகை",
  leaderboard: "தரவரிசை பட்டியல்",
  admin: "நிர்வாக பலகை",
  quizPlayer: "வினாடி வினா",
  signOut: "வெளியேறு",
  language: "மொழி",
  theme: "தீம்",
  online: "ஆன்லைன்",
  offline: "ஆஃப்லைன்",
  student: "மாணவர்",
  teacher: "ஆசிரியர்",
  administrator: "நிர்வாகி",
  greeting: "வணக்கம் 👋",
};

const KN: PartialDict = {
  appName: "ಸೆರ್ಮೊ ಪ್ಲೇ",
  classroom: "ತರಗತಿ",
  dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  library: "ಆಟದ ಗ್ರಂಥಾಲಯ",
  lms: "ಆಫ್‌ಲೈನ್ ಎಲ್‌ಎಂಎಸ್ ಮತ್ತು ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್",
  games: "ಆಟಗಳ ಕೇಂದ್ರ",
  challenges: "ಸಮಯದ ಸವಾಲುಗಳು",
  quizCreator: "ರಸಪ್ರಶ್ನೆ ರಚನೆಕಾರ",
  printables: "ಮುದ್ರಣ ಕೇಂದ್ರ",
  sync: "ಸಿಂಕ್ ಫಲಕ",
  leaderboard: "ಶ್ರೇಯಾಂಕ ಪಟ್ಟಿ",
  admin: "ನಿರ್ವಾಹಕ ಕನ್ಸೋಲ್",
  quizPlayer: "ರಸಪ್ರಶ್ನೆ ಆಟಗಾರ",
  signOut: "ಲಾಗ್ ಔಟ್",
  language: "ಭಾಷೆ",
  theme: "ಥೀಮ್",
  online: "ಆನ್‌ಲೈನ್",
  offline: "ಆಫ್‌ಲೈನ್",
  student: "ವಿದ್ಯಾರ್ಥಿ",
  teacher: "ಶಿಕ್ಷಕ",
  administrator: "ನಿರ್ವಾಹಕ",
  greeting: "ನಮಸ್ಕಾರ 👋",
};

const BN: PartialDict = {
  appName: "সার্মো প্লে",
  classroom: "শ্রেণিকক্ষ",
  dashboard: "ড্যাশবোর্ড",
  library: "গেম লাইব্রেরি",
  lms: "অফলাইন এলএমএস ও ফ্ল্যাশকার্ড",
  games: "গেম হাব",
  challenges: "সময়সীমার চ্যালেঞ্জ",
  quizCreator: "কুইজ নির্মাতা",
  printables: "প্রিন্ট হাব",
  sync: "সিঙ্ক প্যানেল",
  leaderboard: "লিডারবোর্ড",
  admin: "অ্যাডমিন কনসোল",
  quizPlayer: "কুইজ প্লেয়ার",
  signOut: "লগআউট",
  language: "ভাষা",
  theme: "থিম",
  online: "অনলাইন",
  offline: "অফলাইন",
  student: "শিক্ষার্থী",
  teacher: "শিক্ষক",
  administrator: "প্রশাসক",
  greeting: "নমস্কার 👋",
};

const MR: PartialDict = {
  appName: "सर्मो प्ले",
  classroom: "वर्ग",
  dashboard: "डॅशबोर्ड",
  library: "गेम लायब्ररी",
  lms: "ऑफलाइन एलएमएस आणि फ्लॅशकार्ड",
  games: "गेम हब",
  challenges: "वेळेची आव्हाने",
  quizCreator: "क्विझ निर्माता",
  printables: "प्रिंट हब",
  sync: "सिंक पॅनेल",
  leaderboard: "लीडरबोर्ड",
  admin: "अ‍ॅडमिन कन्सोल",
  quizPlayer: "क्विझ प्लेअर",
  signOut: "लॉगआउट",
  language: "भाषा",
  theme: "थीम",
  online: "ऑनलाइन",
  offline: "ऑफलाइन",
  student: "विद्यार्थी",
  teacher: "शिक्षक",
  administrator: "प्रशासक",
  greeting: "नमस्कार 👋",
};

const TE: PartialDict = {
  appName: "సెర్మో ప్లే",
  classroom: "తరగతి",
  dashboard: "డాష్‌బోర్డ్",
  library: "గేమ్ లైబ్రరీ",
  lms: "ఆఫ్‌లైన్ ఎల్‌ఎమ్‌ఎస్ & ఫ్లాష్‌కార్డులు",
  games: "గేమ్స్ హబ్",
  challenges: "సమయ సవాళ్లు",
  quizCreator: "క్విజ్ సృష్టికర్త",
  printables: "ప్రింట్ హబ్",
  sync: "సింక్ ప్యానెల్",
  leaderboard: "లీడర్‌బోర్డ్",
  admin: "అడ్మిన్ కన్సోల్",
  quizPlayer: "క్విజ్ ప్లేయర్",
  signOut: "లాగ్అవుట్",
  language: "భాష",
  theme: "థీమ్",
  online: "ఆన్‌లైన్",
  offline: "ఆఫ్‌లైన్",
  student: "విద్యార్థి",
  teacher: "ఉపాధ్యాయుడు",
  administrator: "నిర్వాహకుడు",
  greeting: "నమస్కారం 👋",
};

const DICTS: Record<UiLang, PartialDict> = { en: EN, hi: HI, ta: TA, kn: KN, bn: BN, mr: MR, te: TE };


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
    if (stored && LANGUAGES.some((l) => l.code === stored)) setLangState(stored as UiLang);
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
      t: (key: I18nKey) => DICTS[lang]?.[key] ?? EN[key],
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
