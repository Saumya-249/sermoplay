import type { UiLang } from "@/lib/i18n";

/* ---------------------------------------------------------------------------
 * Unified translation dictionary for the Timed Challenge Games workspace.
 * Every user-visible string of that module lives here — no hardcoded English
 * is allowed inside the component tree.
 * ------------------------------------------------------------------------ */

const EN = {
  pageTitle: "⏱️ Timed Challenge Games",
  pageSub: "Sixty-second races for Class 1 to 8 — pick a game to unfold its dashboard, every launch streams a fresh question set.",
  launch: "Launch Game",
  back: "Back to all games",
  roundBadge: "60s round",
  roundLabel: "60 second round",
  hurry: "⏰ Hurry!",
  start: "▶️ Start",
  restart: "🔄 Restart",
  question: "Question",
  liveAi: "Live AI set",
  offlineSet: "Offline set",
  streaming: "Streaming a fresh AI question set…",
  roundDone: "🎉 Round complete!",
  roundDoneSub: "You answered {score} questions correctly in 60 seconds.",
  playAgain: "Play again",
  fractionPrompt: "Slice the pizza that matches this fraction",
  fractionDone: "🎉 Great slicing!",
  fractionDoneSub: "You matched {score} fractions in 60 seconds.",
  targetAmount: "Target amount",
  yourTotal: "Your total",
  noTokens: "No tokens yet",
  score: "Score",
} as const;

export type ChallengeKey = keyof typeof EN;
type Dict = Partial<Record<ChallengeKey, string>>;

const HI: Dict = {
  pageTitle: "⏱️ समयबद्ध चुनौतियाँ",
  pageSub: "कक्षा 1 से 8 के लिए साठ सेकंड की दौड़ — खेल चुनें, हर बार नए प्रश्न बनते हैं।",
  launch: "गेम शुरू करें",
  back: "सभी खेलों पर लौटें",
  roundBadge: "60 सेकंड",
  roundLabel: "60 सेकंड राउंड",
  hurry: "⏰ जल्दी!",
  start: "▶️ शुरू करें",
  restart: "🔄 फिर से",
  question: "प्रश्न",
  liveAi: "लाइव एआई सेट",
  offlineSet: "ऑफ़लाइन सेट",
  streaming: "एआई ताज़े प्रश्न बना रहा है…",
  roundDone: "🎉 शानदार राउंड!",
  roundDoneSub: "आपने 60 सेकंड में {score} प्रश्न सही किए।",
  playAgain: "फिर से खेलें",
  fractionPrompt: "इस भिन्न से मेल खाता पिज़्ज़ा चुनिए",
  fractionDone: "🎉 बढ़िया कटाई!",
  fractionDoneSub: "आपने 60 सेकंड में {score} भिन्न सही मिलाईं।",
  targetAmount: "लक्ष्य राशि",
  yourTotal: "आपका कुल",
  noTokens: "अभी कोई टोकन नहीं",
  score: "अंक",
};

const TA: Dict = {
  pageTitle: "⏱️ நேர சவால்கள்",
  pageSub: "வகுப்பு 1 முதல் 8 வரையிலான அறுபது வினாடி பந்தயங்கள் — முழுமையாக ஆஃப்லைனில், நெட்வொர்க் தேவையில்லை.",
  launch: "விளையாட்டைத் தொடங்கு",
  back: "அனைத்து விளையாட்டுகளுக்கும் திரும்பு",
  roundBadge: "60 வினாடி சுற்று",
  roundLabel: "60 வினாடி சுற்று",
  hurry: "⏰ விரைவாக!",
  start: "▶️ தொடங்கு",
  restart: "🔄 மீண்டும்",
  question: "கேள்வி",
  liveAi: "நேரடி AI தொகுப்பு",
  offlineSet: "ஆஃப்லைன் தொகுப்பு",
  streaming: "AI புதிய கேள்விகளை உருவாக்குகிறது…",
  roundDone: "🎉 சுற்று முடிந்தது!",
  roundDoneSub: "60 வினாடிகளில் {score} கேள்விகளுக்கு சரியாக பதிலளித்தீர்கள்.",
  playAgain: "மீண்டும் விளையாடு",
  fractionPrompt: "இந்த பின்னத்திற்கு பொருந்தும் பீட்சாவைத் தேர்ந்தெடு",
  fractionDone: "🎉 அருமையான வெட்டு!",
  fractionDoneSub: "60 வினாடிகளில் {score} பின்னங்களைப் பொருத்தினீர்கள்.",
  targetAmount: "இலக்கு தொகை",
  yourTotal: "உங்களின் மொத்தம்",
  noTokens: "இன்னும் டோக்கன்கள் இல்லை",
  score: "மதிப்பெண்",
};

const KN: Dict = {
  pageTitle: "⏱️ ಸಮಯದ ಸವಾಲುಗಳು",
  pageSub: "1ರಿಂದ 8ನೇ ತರಗತಿಗೆ ಅರವತ್ತು ಸೆಕೆಂಡುಗಳ ಓಟಗಳು — ಸಂಪೂರ್ಣ ಆಫ್‌ಲೈನ್, ನೆಟ್‌ವರ್ಕ್ ಅಗತ್ಯವಿಲ್ಲ.",
  launch: "ಆಟ ಪ್ರಾರಂಭಿಸಿ",
  back: "ಎಲ್ಲಾ ಆಟಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
  roundBadge: "60 ಸೆಕೆಂಡ್ ಸುತ್ತು",
  roundLabel: "60 ಸೆಕೆಂಡ್ ಸುತ್ತು",
  hurry: "⏰ ಬೇಗ!",
  start: "▶️ ಪ್ರಾರಂಭಿಸಿ",
  restart: "🔄 ಮತ್ತೆ",
  question: "ಪ್ರಶ್ನೆ",
  liveAi: "ಲೈವ್ AI ಸೆಟ್",
  offlineSet: "ಆಫ್‌ಲೈನ್ ಸೆಟ್",
  streaming: "AI ಹೊಸ ಪ್ರಶ್ನೆಗಳನ್ನು ರಚಿಸುತ್ತಿದೆ…",
  roundDone: "🎉 ಸುತ್ತು ಪೂರ್ಣ!",
  roundDoneSub: "60 ಸೆಕೆಂಡುಗಳಲ್ಲಿ {score} ಪ್ರಶ್ನೆಗಳಿಗೆ ಸರಿಯಾಗಿ ಉತ್ತರಿಸಿದ್ದೀರಿ.",
  playAgain: "ಮತ್ತೆ ಆಡಿ",
  fractionPrompt: "ಈ ಭಿನ್ನರಾಶಿಗೆ ಹೊಂದುವ ಪಿಜ್ಜಾ ಆಯ್ಕೆಮಾಡಿ",
  fractionDone: "🎉 ಉತ್ತಮ ಕತ್ತರಿಸುವಿಕೆ!",
  fractionDoneSub: "60 ಸೆಕೆಂಡುಗಳಲ್ಲಿ {score} ಭಿನ್ನರಾಶಿಗಳನ್ನು ಹೊಂದಿಸಿದ್ದೀರಿ.",
  targetAmount: "ಗುರಿ ಮೊತ್ತ",
  yourTotal: "ನಿಮ್ಮ ಒಟ್ಟು",
  noTokens: "ಇನ್ನೂ ಟೋಕನ್‌ಗಳಿಲ್ಲ",
  score: "ಅಂಕ",
};

const BN: Dict = {
  pageTitle: "⏱️ সময়সীমার চ্যালেঞ্জ",
  pageSub: "প্রথম থেকে অষ্টম শ্রেণির জন্য ষাট সেকেন্ডের দৌড় — সম্পূর্ণ অফলাইন, নেটওয়ার্ক লাগে না।",
  launch: "গেম শুরু করুন",
  back: "সব গেমে ফিরে যান",
  roundBadge: "৬০ সেকেন্ড রাউন্ড",
  roundLabel: "৬০ সেকেন্ড রাউন্ড",
  hurry: "⏰ তাড়াতাড়ি!",
  start: "▶️ শুরু",
  restart: "🔄 আবার",
  question: "প্রশ্ন",
  liveAi: "লাইভ AI সেট",
  offlineSet: "অফলাইন সেট",
  streaming: "AI নতুন প্রশ্ন তৈরি করছে…",
  roundDone: "🎉 রাউন্ড সম্পূর্ণ!",
  roundDoneSub: "৬০ সেকেন্ডে আপনি {score}টি প্রশ্নের সঠিক উত্তর দিয়েছেন।",
  playAgain: "আবার খেলুন",
  fractionPrompt: "এই ভগ্নাংশের সঙ্গে মেলে এমন পিৎজা বেছে নিন",
  fractionDone: "🎉 দারুণ কাটা!",
  fractionDoneSub: "৬০ সেকেন্ডে {score}টি ভগ্নাংশ মিলিয়েছেন।",
  targetAmount: "লক্ষ্য পরিমাণ",
  yourTotal: "আপনার মোট",
  noTokens: "এখনো কোনো টোকেন নেই",
  score: "স্কোর",
};

const MR: Dict = {
  pageTitle: "⏱️ वेळेची आव्हाने",
  pageSub: "इयत्ता 1 ते 8 साठी साठ सेकंदांच्या शर्यती — पूर्णपणे ऑफलाइन, नेटवर्कची गरज नाही.",
  launch: "गेम सुरू करा",
  back: "सर्व गेमकडे परत",
  roundBadge: "60 सेकंद फेरी",
  roundLabel: "60 सेकंद फेरी",
  hurry: "⏰ लवकर!",
  start: "▶️ सुरू करा",
  restart: "🔄 पुन्हा",
  question: "प्रश्न",
  liveAi: "लाइव्ह AI संच",
  offlineSet: "ऑफलाइन संच",
  streaming: "AI नवीन प्रश्न तयार करत आहे…",
  roundDone: "🎉 फेरी पूर्ण!",
  roundDoneSub: "60 सेकंदांत तुम्ही {score} प्रश्न बरोबर सोडवले.",
  playAgain: "पुन्हा खेळा",
  fractionPrompt: "या अपूर्णांकाशी जुळणारा पिझ्झा निवडा",
  fractionDone: "🎉 छान कापणी!",
  fractionDoneSub: "60 सेकंदांत {score} अपूर्णांक जुळवले.",
  targetAmount: "लक्ष्य रक्कम",
  yourTotal: "तुमची एकूण",
  noTokens: "अजून टोकन नाहीत",
  score: "गुण",
};

const TE: Dict = {
  pageTitle: "⏱️ సమయ సవాళ్లు",
  pageSub: "1 నుండి 8 తరగతుల కోసం అరవై సెకన్ల పందాలు — పూర్తిగా ఆఫ్‌లైన్, నెట్‌వర్క్ అవసరం లేదు.",
  launch: "గేమ్ ప్రారంభించు",
  back: "అన్ని గేమ్‌లకు తిరిగి",
  roundBadge: "60 సెకన్ల రౌండ్",
  roundLabel: "60 సెకన్ల రౌండ్",
  hurry: "⏰ త్వరగా!",
  start: "▶️ ప్రారంభించు",
  restart: "🔄 మళ్లీ",
  question: "ప్రశ్న",
  liveAi: "లైవ్ AI సెట్",
  offlineSet: "ఆఫ్‌లైన్ సెట్",
  streaming: "AI కొత్త ప్రశ్నలను తయారు చేస్తోంది…",
  roundDone: "🎉 రౌండ్ పూర్తి!",
  roundDoneSub: "60 సెకన్లలో మీరు {score} ప్రశ్నలకు సరైన సమాధానం ఇచ్చారు.",
  playAgain: "మళ్లీ ఆడు",
  fractionPrompt: "ఈ భిన్నానికి సరిపోయే పిజ్జాను ఎంచుకో",
  fractionDone: "🎉 అద్భుతమైన కోత!",
  fractionDoneSub: "60 సెకన్లలో {score} భిన్నాలను సరిపోల్చారు.",
  targetAmount: "లక్ష్య మొత్తం",
  yourTotal: "మీ మొత్తం",
  noTokens: "ఇంకా టోకెన్లు లేవు",
  score: "స్కోరు",
};

const DICTS: Record<UiLang, Dict> = { en: EN, hi: HI, ta: TA, kn: KN, bn: BN, mr: MR, te: TE };

export function challengeText(lang: UiLang) {
  return (key: ChallengeKey, vars?: Record<string, string | number>) => {
    let s = DICTS[lang]?.[key] ?? EN[key];
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

/* --------------------------- per-game localisation ------------------------- */

type GameText = { title: string; desc: string; badge: string };
type GameDict = Partial<Record<UiLang, GameText>>;

export const GAME_TEXT: Record<string, GameDict> = {
  "speed-addition-race": {
    en: {
      title: "Speed Addition Race",
      desc: "Applied money word problems — shopping bills, change and totals.",
      badge: "Math · Class 1-8",
    },
    hi: {
      title: "मार्केट कैलकुलेटर",
      desc: "बाज़ार के असली सवाल — बिल, छूट और बची हुई राशि।",
      badge: "गणित · कक्षा 1-8",
    },
    ta: {
      title: "வேகமான கூட்டல் பந்தயம்",
      desc: "60 வினாடிகளில் உங்களால் முடிந்த அளவு இலக்கு தொகையை அடைய நாணயங்கள் மற்றும் நோட்டுகளை தட்டவும்.",
      badge: "கணிதம் · வகுப்பு 1-8",
    },
    kn: {
      title: "ವೇಗದ ಸಂಕಲನ ಓಟ",
      desc: "ಹಣದ ಪ್ರಾಯೋಗಿಕ ಸಮಸ್ಯೆಗಳು — ಬಿಲ್, ಚಿಲ್ಲರೆ ಮತ್ತು ಒಟ್ಟು ಮೊತ್ತ.",
      badge: "ಗಣಿತ · ತರಗತಿ 1-8",
    },
    bn: {
      title: "দ্রুত যোগ দৌড়",
      desc: "বাস্তব টাকার সমস্যা — বাজার বিল, ফেরত ও মোট হিসাব।",
      badge: "গণিত · শ্রেণি 1-8",
    },
    mr: {
      title: "वेगवान बेरीज शर्यत",
      desc: "पैशांची व्यावहारिक उदाहरणे — बिल, परतावा आणि एकूण रक्कम.",
      badge: "गणित · इयत्ता 1-8",
    },
    te: {
      title: "వేగవంతమైన కూడిక పందెం",
      desc: "డబ్బు ఆధారిత సమస్యలు — బిల్లులు, చిల్లర మరియు మొత్తాలు.",
      badge: "గణితం · తరగతి 1-8",
    },
  },
  "fraction-pizza-slicer": {
    en: {
      title: "Fraction Pizza Slicer",
      desc: "Visualise divisions — pick the slice that matches the fraction shown.",
      badge: "Math · Class 3-8",
    },
    hi: {
      title: "भिन्न पिज़्ज़ा स्लाइसर",
      desc: "भागों को देखिए — दिखाई गई भिन्न से मेल खाता टुकड़ा चुनिए।",
      badge: "गणित · कक्षा 3-8",
    },
    ta: {
      title: "பின்ன பீட்சா வெட்டி",
      desc: "பிரிவுகளைக் காணுங்கள் — காட்டப்பட்ட பின்னத்திற்கு பொருந்தும் துண்டைத் தேர்ந்தெடுங்கள்.",
      badge: "கணிதம் · வகுப்பு 3-8",
    },
    kn: {
      title: "ಭಿನ್ನರಾಶಿ ಪಿಜ್ಜಾ ಕತ್ತರಿ",
      desc: "ಭಾಗಗಳನ್ನು ನೋಡಿ — ತೋರಿಸಿದ ಭಿನ್ನರಾಶಿಗೆ ಹೊಂದುವ ತುಂಡನ್ನು ಆರಿಸಿ.",
      badge: "ಗಣಿತ · ತರಗತಿ 3-8",
    },
    bn: {
      title: "ভগ্নাংশ পিৎজা স্লাইসার",
      desc: "ভাগ দেখুন — দেখানো ভগ্নাংশের সঙ্গে মেলে এমন টুকরো বেছে নিন।",
      badge: "গণিত · শ্রেণি 3-8",
    },
    mr: {
      title: "अपूर्णांक पिझ्झा स्लायसर",
      desc: "भाग पाहा — दाखवलेल्या अपूर्णांकाशी जुळणारा तुकडा निवडा.",
      badge: "गणित · इयत्ता 3-8",
    },
    te: {
      title: "భిన్న పిజ్జా స్లైసర్",
      desc: "భాగాలను చూడండి — చూపిన భిన్నానికి సరిపోయే ముక్కను ఎంచుకోండి.",
      badge: "గణితం · తరగతి 3-8",
    },
  },
  "grammar-ninja": {
    en: {
      title: "Grammar Ninja Challenge",
      desc: "Tap the correct word, tense or spelling to complete each sentence.",
      badge: "English · Class 1-8",
    },
    hi: {
      title: "ग्रामर निंजा चुनौती",
      desc: "वाक्य पूरा करने के लिए सही शब्द, काल या वर्तनी चुनिए।",
      badge: "अंग्रेज़ी · कक्षा 1-8",
    },
    ta: {
      title: "இலக்கண நிஞ்ஜா சவால்",
      desc: "ஒவ்வொரு வாக்கியத்தையும் நிறைவு செய்ய சரியான சொல், காலம் அல்லது எழுத்துப்பிழையைத் தட்டவும்.",
      badge: "ஆங்கிலம் · வகுப்பு 1-8",
    },
    kn: {
      title: "ವ್ಯಾಕರಣ ನಿಂಜಾ ಸವಾಲು",
      desc: "ಪ್ರತಿ ವಾಕ್ಯ ಪೂರ್ಣಗೊಳಿಸಲು ಸರಿಯಾದ ಪದ, ಕಾಲ ಅಥವಾ ಕಾಗುಣಿತ ಆರಿಸಿ.",
      badge: "ಆಂಗ್ಲ · ತರಗತಿ 1-8",
    },
    bn: {
      title: "ব্যাকরণ নিনজা চ্যালেঞ্জ",
      desc: "প্রতিটি বাক্য সম্পূর্ণ করতে সঠিক শব্দ, কাল বা বানান বেছে নিন।",
      badge: "ইংরেজি · শ্রেণি 1-8",
    },
    mr: {
      title: "व्याकरण निन्जा आव्हान",
      desc: "प्रत्येक वाक्य पूर्ण करण्यासाठी योग्य शब्द, काळ किंवा शुद्धलेखन निवडा.",
      badge: "इंग्रजी · इयत्ता 1-8",
    },
    te: {
      title: "వ్యాకరణ నింజా సవాల్",
      desc: "ప్రతి వాక్యాన్ని పూర్తి చేయడానికి సరైన పదం, కాలం లేదా స్పెల్లింగ్ ఎంచుకోండి.",
      badge: "ఆంగ్లం · తరగతి 1-8",
    },
  },
  "shabd-khoj": {
    en: {
      title: "Shabd Khoj / Varnamala Race",
      desc: "Vocabulary and letter-matching puzzles in the selected regional script.",
      badge: "Regional Language · Class 1-8",
    },
    hi: {
      title: "शब्द खोज / वर्णमाला रेस",
      desc: "चुनी हुई भाषा की लिपि में शब्दावली और अक्षर-मिलान पहेलियाँ।",
      badge: "क्षेत्रीय भाषा · कक्षा 1-8",
    },
    ta: {
      title: "சொல் தேடல் / எழுத்து பந்தயம்",
      desc: "தேர்ந்தெடுத்த மொழியின் எழுத்துருவில் சொற்களஞ்சியம் மற்றும் எழுத்துப் பொருத்தல் புதிர்கள்.",
      badge: "பிராந்திய மொழி · வகுப்பு 1-8",
    },
    kn: {
      title: "ಪದ ಹುಡುಕಾಟ / ವರ್ಣಮಾಲೆ ಓಟ",
      desc: "ಆಯ್ಕೆಮಾಡಿದ ಭಾಷೆಯ ಲಿಪಿಯಲ್ಲಿ ಪದಸಂಪತ್ತು ಮತ್ತು ಅಕ್ಷರ ಹೊಂದಾಣಿಕೆ ಒಗಟುಗಳು.",
      badge: "ಪ್ರಾದೇಶಿಕ ಭಾಷೆ · ತರಗತಿ 1-8",
    },
    bn: {
      title: "শব্দ খোঁজ / বর্ণমালা দৌড়",
      desc: "নির্বাচিত ভাষার লিপিতে শব্দভাণ্ডার ও বর্ণ মেলানোর ধাঁধা।",
      badge: "আঞ্চলিক ভাষা · শ্রেণি 1-8",
    },
    mr: {
      title: "शब्द शोध / वर्णमाला शर्यत",
      desc: "निवडलेल्या भाषेच्या लिपीत शब्दसंग्रह आणि अक्षरजुळणी कोडी.",
      badge: "प्रादेशिक भाषा · इयत्ता 1-8",
    },
    te: {
      title: "పద అన్వేషణ / వర్ణమాల పందెం",
      desc: "ఎంచుకున్న భాష లిపిలో పదజాలం మరియు అక్షర సరిపోలిక పజిల్స్.",
      badge: "ప్రాంతీయ భాష · తరగతి 1-8",
    },
  },
  "map-legend-detective": {
    en: {
      title: "Map Legend Detective",
      desc: "Randomised spatial clues — state borders, landmarks and historic dates.",
      badge: "Social Science · GK",
    },
    hi: {
      title: "मानचित्र जासूस",
      desc: "राज्य सीमाएँ, स्मारक और ऐतिहासिक तिथियाँ पहचानिए।",
      badge: "सामाजिक विज्ञान · सामान्य ज्ञान",
    },
    ta: {
      title: "வரைபட துப்பறிவாளர்",
      desc: "மாநில எல்லைகள், சின்னங்கள் மற்றும் வரலாற்று தேதிகள் குறித்த சீரற்ற துப்புகள்.",
      badge: "சமூக அறிவியல் · பொது அறிவு",
    },
    kn: {
      title: "ನಕ್ಷೆ ಪತ್ತೇದಾರ",
      desc: "ರಾಜ್ಯ ಗಡಿಗಳು, ಸ್ಮಾರಕಗಳು ಮತ್ತು ಐತಿಹಾಸಿಕ ದಿನಾಂಕಗಳ ಸುಳಿವುಗಳು.",
      badge: "ಸಮಾಜ ವಿಜ್ಞಾನ · ಸಾಮಾನ್ಯ ಜ್ಞಾನ",
    },
    bn: {
      title: "মানচিত্র গোয়েন্দা",
      desc: "রাজ্য সীমানা, স্মৃতিসৌধ ও ঐতিহাসিক তারিখের এলোমেলো সূত্র।",
      badge: "সমাজবিজ্ঞান · সাধারণ জ্ঞান",
    },
    mr: {
      title: "नकाशा गुप्तहेर",
      desc: "राज्य सीमा, स्मारके आणि ऐतिहासिक तारखांचे यादृच्छिक संकेत.",
      badge: "समाजशास्त्र · सामान्य ज्ञान",
    },
    te: {
      title: "మ్యాప్ డిటెక్టివ్",
      desc: "రాష్ట్ర సరిహద్దులు, కట్టడాలు మరియు చారిత్రక తేదీల యాదృచ్ఛిక ఆధారాలు.",
      badge: "సాంఘిక శాస్త్రం · సామాన్య జ్ఞానం",
    },
  },
  "ecosystem-balancer": {
    en: {
      title: "Eco-system Balancer",
      desc: "Match food chains and crop seasons to their targets before time runs out.",
      badge: "Science · Class 4-8",
    },
    hi: {
      title: "पारिस्थितिकी संतुलन",
      desc: "समय समाप्त होने से पहले आहार शृंखला और फसल ऋतु मिलाइए।",
      badge: "विज्ञान · कक्षा 4-8",
    },
    ta: {
      title: "சூழல் சமநிலை",
      desc: "நேரம் முடிவதற்குள் உணவுச் சங்கிலிகளையும் பயிர் பருவங்களையும் பொருத்துங்கள்.",
      badge: "அறிவியல் · வகுப்பு 4-8",
    },
    kn: {
      title: "ಪರಿಸರ ಸಮತೋಲನ",
      desc: "ಸಮಯ ಮುಗಿಯುವ ಮೊದಲು ಆಹಾರ ಸರಪಳಿ ಮತ್ತು ಬೆಳೆ ಋತುಗಳನ್ನು ಹೊಂದಿಸಿ.",
      badge: "ವಿಜ್ಞಾನ · ತರಗತಿ 4-8",
    },
    bn: {
      title: "বাস্তুতন্ত্র ভারসাম্য",
      desc: "সময় শেষ হওয়ার আগে খাদ্যশৃঙ্খল ও ফসলের ঋতু মেলান।",
      badge: "বিজ্ঞান · শ্রেণি 4-8",
    },
    mr: {
      title: "परिसंस्था संतुलन",
      desc: "वेळ संपण्यापूर्वी अन्नसाखळी आणि पीक हंगाम जुळवा.",
      badge: "विज्ञान · इयत्ता 4-8",
    },
    te: {
      title: "పర్యావరణ సమతుల్యత",
      desc: "సమయం ముగియకముందే ఆహార గొలుసులు మరియు పంట కాలాలను సరిపోల్చండి.",
      badge: "సైన్స్ · తరగతి 4-8",
    },
  },
};

export function gameText(key: string, lang: UiLang, fallback: GameText): GameText {
  const entry = GAME_TEXT[key];
  return entry?.[lang] ?? entry?.en ?? fallback;
}
