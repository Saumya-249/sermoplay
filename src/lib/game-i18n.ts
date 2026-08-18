import type { UiLang } from "@/lib/i18n";

/**
 * Word-level localizer for the static game catalogue (titles, subjects,
 * class labels) which is authored in English/Hindi only.
 */
const WORD_MAPS: Partial<Record<UiLang, Record<string, string>>> = {
  ta: {
    Challenge: "சவால்",
    Sprint: "பந்தயம்",
    Quest: "தேடல்",
    Hunt: "வேட்டை",
    Match: "பொருத்து",
    Race: "ஓட்டம்",
    Puzzle: "புதிர்",
    Quiz: "வினாடி வினா",
    Counting: "எண்ணுதல்",
    Addition: "கூட்டல்",
    Subtraction: "கழித்தல்",
    Multiplication: "பெருக்கல்",
    Division: "வகுத்தல்",
    Shapes: "வடிவங்கள்",
    Numbers: "எண்கள்",
    Math: "கணிதம்",
    Science: "அறிவியல்",
    "Social Science": "சமூக அறிவியல்",
    Class: "வகுப்பு",
    English: "ஆங்கிலம்",
    Hindi: "இந்தி",
    to: "வரை",
    "Single-Digit": "ஒற்றை இலக்க",
    questions: "கேள்விகள்",
  },
  kn: {
    Challenge: "ಸವಾಲು",
    Sprint: "ಓಟ",
    Race: "ಓಟ",
    Quiz: "ರಸಪ್ರಶ್ನೆ",
    Counting: "ಎಣಿಕೆ",
    Addition: "ಸಂಕಲನ",
    Subtraction: "ವ್ಯವಕಲನ",
    Math: "ಗಣಿತ",
    Science: "ವಿಜ್ಞಾನ",
    "Social Science": "ಸಮಾಜ ವಿಜ್ಞಾನ",
    Class: "ತರಗತಿ",
    English: "ಇಂಗ್ಲಿಷ್",
    Hindi: "ಹಿಂದಿ",
    questions: "ಪ್ರಶ್ನೆಗಳು",
  },
  bn: {
    Challenge: "চ্যালেঞ্জ",
    Sprint: "দৌড়",
    Race: "দৌড়",
    Quiz: "কুইজ",
    Counting: "গণনা",
    Addition: "যোগ",
    Subtraction: "বিয়োগ",
    Math: "গণিত",
    Science: "বিজ্ঞান",
    "Social Science": "সমাজবিজ্ঞান",
    Class: "শ্রেণি",
    English: "ইংরেজি",
    Hindi: "হিন্দি",
    questions: "প্রশ্ন",
  },
  mr: {
    Challenge: "आव्हान",
    Sprint: "शर्यत",
    Race: "शर्यत",
    Quiz: "क्विझ",
    Counting: "मोजणी",
    Addition: "बेरीज",
    Subtraction: "वजाबाकी",
    Math: "गणित",
    Science: "विज्ञान",
    "Social Science": "समाजशास्त्र",
    Class: "वर्ग",
    English: "इंग्रजी",
    Hindi: "हिंदी",
    questions: "प्रश्न",
  },
  te: {
    Challenge: "సవాలు",
    Sprint: "పరుగు",
    Race: "పరుగు",
    Quiz: "క్విజ్",
    Counting: "లెక్కింపు",
    Addition: "కూడిక",
    Subtraction: "తీసివేత",
    Math: "గణితం",
    Science: "సైన్స్",
    "Social Science": "సాంఘిక శాస్త్రం",
    Class: "తరగతి",
    English: "ఆంగ్లం",
    Hindi: "హిందీ",
    questions: "ప్రశ్నలు",
  },
  hi: {
    Challenge: "चुनौती",
    Sprint: "दौड़",
    Race: "दौड़",
    Quiz: "क्विज़",
    Counting: "गिनती",
    Addition: "जोड़",
    Subtraction: "घटाव",
    Math: "गणित",
    Science: "विज्ञान",
    "Social Science": "सामाजिक विज्ञान",
    Class: "कक्षा",
    English: "अंग्रेज़ी",
    Hindi: "हिंदी",
    questions: "प्रश्न",
  },
};

/** Translate English word tokens inside a catalogue string for the active language. */
export function localizeGameText(text: string, lang: UiLang): string {
  const map = WORD_MAPS[lang];
  if (!map || lang === "en") return text;
  let out = text;
  // Longest keys first so multi-word phrases win.
  for (const key of Object.keys(map).sort((a, b) => b.length - a.length)) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
    out = out.replace(new RegExp(`\\b${escaped}\\b`, "g"), map[key]!);
  }
  return out;
}
