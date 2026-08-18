import type { UiLang } from "@/lib/i18n";

export type ChallengeQuestion = { q: string; options: string[]; correct: number };

export type GameKind = "quiz" | "fraction" | "ecosystem";

export type ChallengeGame = {
  key: string;
  emoji: string;
  title: string;
  titleHi: string;
  desc: string;
  descHi: string;
  badge: string;
  badgeHi: string;
  subject: string;
  topic: string;
  classRange: string;
  kind: GameKind;
  /** Language the AI prompt should be written in, regardless of UI toggle. */
  forceLanguage?: string;
};

export const CHALLENGE_GAMES: ChallengeGame[] = [
  {
    key: "speed-addition-race",
    emoji: "🪙",
    title: "Speed Addition Race",
    titleHi: "मार्केट कैलकुलेटर",
    desc: "Applied money word problems — shopping bills, change and totals.",
    descHi: "बाज़ार के असली सवाल — बिल, छूट और बची हुई राशि।",
    badge: "Math · Class 1-8",
    badgeHi: "गणित · कक्षा 1-8",
    subject: "Math",
    topic: "Applied money word problems: shopping bills, change from a note, unit price and totals in Indian Rupees",
    classRange: "Class 1-8",
    kind: "quiz",
  },
  {
    key: "fraction-pizza-slicer",
    emoji: "🍕",
    title: "Fraction Pizza Slicer",
    titleHi: "भिन्न पिज़्ज़ा स्लाइसर",
    desc: "Visualise divisions — pick the slice that matches the fraction shown.",
    descHi: "भागों को देखिए — दिखाई गई भिन्न से मेल खाता टुकड़ा चुनिए।",
    badge: "Math · Class 3-8",
    badgeHi: "गणित · कक्षा 3-8",
    subject: "Math",
    topic: "Fractions and proportions",
    classRange: "Class 3-8",
    kind: "fraction",
  },
  {
    key: "grammar-ninja",
    emoji: "🥷",
    title: "Grammar Ninja Challenge",
    titleHi: "ग्रामर निंजा चुनौती",
    desc: "Tap the correct word, tense or spelling to complete each sentence.",
    descHi: "वाक्य पूरा करने के लिए सही शब्द, काल या वर्तनी चुनिए।",
    badge: "English · Class 1-8",
    badgeHi: "अंग्रेज़ी · कक्षा 1-8",
    subject: "English",
    topic: "Fill-in-the-blank grammar: parts of speech, verb tense agreement, prepositions and spelling patterns",
    classRange: "Class 1-8",
    kind: "quiz",
    forceLanguage: "English",
  },
  {
    key: "shabd-khoj",
    emoji: "🔤",
    title: "Shabd Khoj / Varnamala Race",
    titleHi: "शब्द खोज / वर्णमाला रेस",
    desc: "Vocabulary and letter-matching puzzles in the selected regional script.",
    descHi: "चुनी हुई भाषा की लिपि में शब्दावली और अक्षर-मिलान पहेलियाँ।",
    badge: "Regional Language · Class 1-8",
    badgeHi: "क्षेत्रीय भाषा · कक्षा 1-8",
    subject: "Language",
    topic: "Vocabulary and alphabet matching: complete the word, matching letter, meaning of a common word, and opposite words",
    classRange: "Class 1-8",
    kind: "quiz",
    forceLanguage: "Hindi",
  },
  {
    key: "map-legend-detective",
    emoji: "🗺️",
    title: "Map Legend Detective",
    titleHi: "मानचित्र जासूस",
    desc: "Randomised spatial clues — state borders, landmarks and historic dates.",
    descHi: "राज्य सीमाएँ, स्मारक और ऐतिहासिक तिथियाँ पहचानिए।",
    badge: "Social Science · GK",
    badgeHi: "सामाजिक विज्ञान · सामान्य ज्ञान",
    subject: "Social Science",
    topic: "Indian geography and history general knowledge: states and capitals, rivers, mountain ranges, landmarks and historic dates",
    classRange: "Class 6-8",
    kind: "quiz",
  },
  {
    key: "ecosystem-balancer",
    emoji: "🌾",
    title: "Eco-system Balancer",
    titleHi: "पारिस्थितिकी संतुलन",
    desc: "Match food chains and crop seasons to their targets before time runs out.",
    descHi: "समय समाप्त होने से पहले आहार शृंखला और फसल ऋतु मिलाइए।",
    badge: "Science · Class 4-8",
    badgeHi: "विज्ञान · कक्षा 4-8",
    subject: "Science",
    topic: "Ecosystems, food chains, habitats and crop seasons",
    classRange: "Class 4-8",
    kind: "ecosystem",
  },
];

export const LANGUAGE_NAME: Record<UiLang, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  kn: "Kannada",
  bn: "Bengali",
  mr: "Marathi",
  te: "Telugu",
};

function shuffleAnswer(correct: string, wrong: string[]): ChallengeQuestion["options"] {
  return [correct, ...wrong];
}

function pack(q: string, correct: string, wrong: string[]): ChallengeQuestion {
  const options = shuffleAnswer(correct, wrong);
  const order = options
    .map((o, i) => ({ o, i, r: Math.random() }))
    .sort((a, b) => a.r - b.r);
  return {
    q,
    options: order.map((x) => x.o),
    correct: order.findIndex((x) => x.i === 0),
  };
}

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Deterministic offline fallbacks — used whenever the live AI stream is unavailable. */
export function offlineQuestions(key: string, hi: boolean, count = 10): ChallengeQuestion[] {
  const out: ChallengeQuestion[] = [];
  for (let n = 0; n < count; n++) {
    if (key === "speed-addition-race") {
      const price = rnd(5, 40);
      const qty = rnd(2, 6);
      const note = [50, 100, 200, 500].find((v) => v > price * qty) ?? 500;
      const change = note - price * qty;
      out.push(
        pack(
          hi
            ? `आप ₹${price} की ${qty} कॉपियाँ खरीदते हैं और ₹${note} का नोट देते हैं। कितने पैसे वापस मिलेंगे?`
            : `You buy ${qty} notebooks at ₹${price} each and hand over a ₹${note} note. What change do you get?`,
          `₹${change}`,
          [`₹${change + rnd(1, 9)}`, `₹${Math.max(1, change - rnd(1, 9))}`, `₹${price * qty}`],
        ),
      );
    } else if (key === "grammar-ninja") {
      const bank = [
        { s: "She ____ to school every morning.", a: "goes", w: ["go", "gone", "going"] },
        { s: "They ____ playing in the field yesterday.", a: "were", w: ["was", "is", "are"] },
        { s: "The book is ____ the table.", a: "on", w: ["in", "at", "of"] },
        { s: "Which word is spelled correctly?", a: "necessary", w: ["neccessary", "necesary", "necessery"] },
        { s: "Ravi is the ____ boy in the class.", a: "tallest", w: ["tall", "taller", "most tall"] },
        { s: "Identify the noun: 'The garden looks beautiful.'", a: "garden", w: ["looks", "beautiful", "the"] },
      ];
      const b = bank[n % bank.length]!;
      out.push(pack(b.s, b.a, b.w));
    } else if (key === "shabd-khoj") {
      const bank = [
        { s: "'क' से शुरू होने वाला फल कौन सा है?", a: "केला", w: ["आम", "सेब", "अंगूर"] },
        { s: "'पुस्तक' शब्द का अर्थ क्या है?", a: "किताब", w: ["कलम", "मेज़", "कुर्सी"] },
        { s: "'दिन' का विलोम शब्द क्या है?", a: "रात", w: ["सुबह", "शाम", "समय"] },
        { s: "'वि___ालय' में कौन सा अक्षर आएगा?", a: "द्य", w: ["ध", "द", "ज्ञ"] },
        { s: "'जल' का पर्यायवाची शब्द कौन सा है?", a: "नीर", w: ["अग्नि", "वायु", "धरा"] },
        { s: "वर्णमाला में 'च' के बाद कौन सा अक्षर आता है?", a: "छ", w: ["ज", "झ", "ट"] },
      ];
      const b = bank[n % bank.length]!;
      out.push(pack(b.s, b.a, b.w));
    } else {
      const bank = hi
        ? [
            { s: "🗺️ राजस्थान की राजधानी कौन सी है?", a: "जयपुर", w: ["जोधपुर", "उदयपुर", "अजमेर"] },
            { s: "🏛️ भारत को स्वतंत्रता किस वर्ष मिली?", a: "1947", w: ["1930", "1942", "1950"] },
            { s: "🌊 वाराणसी से कौन सी नदी बहती है?", a: "गंगा", w: ["यमुना", "गोदावरी", "नर्मदा"] },
            { s: "⛰️ भारत के उत्तर में कौन सी पर्वत श्रृंखला है?", a: "हिमालय", w: ["अरावली", "सतपुड़ा", "पश्चिमी घाट"] },
            { s: "📜 भारत का संविधान किस वर्ष लागू हुआ?", a: "1950", w: ["1947", "1948", "1952"] },
            { s: "🌾 चाय का सबसे बड़ा उत्पादक राज्य कौन सा है?", a: "असम", w: ["पंजाब", "गुजरात", "बिहार"] },
          ]
        : [
            { s: "🗺️ Which city is the capital of Rajasthan?", a: "Jaipur", w: ["Jodhpur", "Udaipur", "Ajmer"] },
            { s: "🏛️ In which year did India gain independence?", a: "1947", w: ["1930", "1942", "1950"] },
            { s: "🌊 Which river flows through Varanasi?", a: "Ganga", w: ["Yamuna", "Godavari", "Narmada"] },
            { s: "⛰️ Which range lies to the north of India?", a: "Himalaya", w: ["Aravalli", "Satpura", "Western Ghats"] },
            { s: "📜 The Constitution of India came into force in?", a: "1950", w: ["1947", "1948", "1952"] },
            { s: "🌾 Which state produces the most tea in India?", a: "Assam", w: ["Punjab", "Gujarat", "Bihar"] },
          ];
      const b = bank[n % bank.length]!;
      out.push(pack(b.s, b.a, b.w));
    }
  }
  return out;
}

export type FractionRound = { num: number; den: number; options: { num: number; den: number }[]; correct: number };

export function makeFractionRound(): FractionRound {
  const den = [2, 3, 4, 5, 6, 8][rnd(0, 5)]!;
  const num = rnd(1, den - 1);
  const pool = new Set<string>([`${num}/${den}`]);
  const options = [{ num, den }];
  while (options.length < 4) {
    const d = [2, 3, 4, 5, 6, 8][rnd(0, 5)]!;
    const nu = rnd(1, d - 1);
    if (pool.has(`${nu}/${d}`) || Math.abs(nu / d - num / den) < 0.01) continue;
    pool.add(`${nu}/${d}`);
    options.push({ num: nu, den: d });
  }
  const shuffled = options.map((o, i) => ({ o, i, r: Math.random() })).sort((a, b) => a.r - b.r);
  return {
    num,
    den,
    options: shuffled.map((s) => s.o),
    correct: shuffled.findIndex((s) => s.i === 0),
  };
}

export type EcoRound = { prompt: string; correct: string; options: string[]; answer: number };

const ECO_EN = [
  { p: "Complete the food chain: Grass → Grasshopper → ?", a: "Frog", w: ["Tiger", "Wheat", "Mushroom"] },
  { p: "Which crop is grown in the Kharif (monsoon) season?", a: "Rice", w: ["Wheat", "Mustard", "Barley"] },
  { p: "Which animal is a herbivore in a forest chain?", a: "Deer", w: ["Lion", "Eagle", "Snake"] },
  { p: "Wheat is sown in which season?", a: "Rabi", w: ["Kharif", "Zaid", "Monsoon"] },
  { p: "Who is the producer in a pond ecosystem?", a: "Algae", w: ["Fish", "Frog", "Crane"] },
  { p: "Which is a decomposer?", a: "Fungi", w: ["Goat", "Sparrow", "Cactus"] },
];
const ECO_HI = [
  { p: "आहार शृंखला पूरी कीजिए: घास → टिड्डा → ?", a: "मेंढक", w: ["बाघ", "गेहूँ", "कुकुरमुत्ता"] },
  { p: "खरीफ (मानसून) ऋतु में कौन सी फसल उगाई जाती है?", a: "धान", w: ["गेहूँ", "सरसों", "जौ"] },
  { p: "वन शृंखला में शाकाहारी जीव कौन है?", a: "हिरण", w: ["शेर", "बाज", "साँप"] },
  { p: "गेहूँ किस ऋतु में बोया जाता है?", a: "रबी", w: ["खरीफ", "ज़ायद", "मानसून"] },
  { p: "तालाब पारिस्थितिकी में उत्पादक कौन है?", a: "शैवाल", w: ["मछली", "मेंढक", "सारस"] },
  { p: "अपघटक कौन है?", a: "कवक", w: ["बकरी", "गौरैया", "नागफनी"] },
];

export function makeEcoRound(hi: boolean): EcoRound {
  const bank = hi ? ECO_HI : ECO_EN;
  const b = bank[rnd(0, bank.length - 1)]!;
  const q = pack(b.p, b.a, b.w);
  return { prompt: b.p, correct: b.a, options: q.options, answer: q.correct };
}
