export const GAME_LANGUAGES = ["English", "Hindi"] as const;
export const GAME_SUBJECTS = ["Math", "Science"] as const;
export const GAME_CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] as const;

export type GameLanguage = (typeof GAME_LANGUAGES)[number];

export type BazaarItem = {
  id: string;
  emoji: string;
  name: Record<GameLanguage, string>;
  unitPrice: number;
  quantity: number;
};

/** Bazaar produce priced so Class 1-3 learners can build the amount with real denominations. */
export const BAZAAR_ITEMS: Record<string, BazaarItem[]> = {
  "Class 1": [
    { id: "banana", emoji: "🍌", name: { English: "Banana", Hindi: "केला" }, unitPrice: 5, quantity: 1 },
    { id: "chalk", emoji: "🖍️", name: { English: "Chalk Box", Hindi: "चॉक डिब्बा" }, unitPrice: 10, quantity: 1 },
    { id: "guava", emoji: "🍐", name: { English: "Guava", Hindi: "अमरूद" }, unitPrice: 7, quantity: 1 },
  ],
  "Class 2": [
    { id: "mango", emoji: "🥭", name: { English: "Alphonso Mango", Hindi: "हापुस आम" }, unitPrice: 20, quantity: 1 },
    { id: "milk", emoji: "🥛", name: { English: "Milk Packet", Hindi: "दूध का पैकेट" }, unitPrice: 12, quantity: 2 },
    { id: "notebook", emoji: "📒", name: { English: "Notebook", Hindi: "कॉपी" }, unitPrice: 15, quantity: 1 },
  ],
  "Class 3": [
    { id: "mango3", emoji: "🥭", name: { English: "Alphonso Mango", Hindi: "हापुस आम" }, unitPrice: 20, quantity: 3 },
    { id: "rice", emoji: "🍚", name: { English: "Rice (1 kg)", Hindi: "चावल (1 किलो)" }, unitPrice: 45, quantity: 1 },
    { id: "jaggery", emoji: "🟤", name: { English: "Jaggery Block", Hindi: "गुड़ की भेली" }, unitPrice: 18, quantity: 2 },
  ],
  "Class 4": [
    { id: "oil", emoji: "🫙", name: { English: "Mustard Oil (1 L)", Hindi: "सरसों तेल (1 लीटर)" }, unitPrice: 65, quantity: 1 },
    { id: "basket", emoji: "🧺", name: { English: "Cane Basket", Hindi: "बेंत की टोकरी" }, unitPrice: 34, quantity: 2 },
  ],
  "Class 5": [
    { id: "seeds", emoji: "🌾", name: { English: "Wheat Seed Bag", Hindi: "गेहूँ बीज की बोरी" }, unitPrice: 78, quantity: 1 },
    { id: "lantern", emoji: "🏮", name: { English: "Solar Lantern", Hindi: "सोलर लालटेन" }, unitPrice: 56, quantity: 2 },
  ],
};

export type Denomination = { value: number; kind: "coin" | "note"; label: Record<GameLanguage, string> };

export const DENOMINATIONS: Denomination[] = [
  { value: 1, kind: "coin", label: { English: "₹1 Coin", Hindi: "₹1 सिक्का" } },
  { value: 2, kind: "coin", label: { English: "₹2 Coin", Hindi: "₹2 सिक्का" } },
  { value: 5, kind: "coin", label: { English: "₹5 Coin", Hindi: "₹5 सिक्का" } },
  { value: 10, kind: "coin", label: { English: "₹10 Coin", Hindi: "₹10 सिक्का" } },
  { value: 20, kind: "note", label: { English: "₹20 Note", Hindi: "₹20 का नोट" } },
  { value: 50, kind: "note", label: { English: "₹50 Note", Hindi: "₹50 का नोट" } },
];

export type Crop = {
  id: string;
  emoji: string;
  name: Record<GameLanguage, string>;
  hint: Record<GameLanguage, string>;
};

export const CROPS: Record<string, Crop> = {
  "Class 3": {
    id: "rice",
    emoji: "🌾",
    name: { English: "Paddy (Rice)", Hindi: "धान (चावल)" },
    hint: {
      English: "Paddy loves standing water, but too much water washes away soil nutrients.",
      Hindi: "धान को भरपूर पानी चाहिए, पर अधिक पानी मिट्टी के पोषक तत्व बहा देता है।",
    },
  },
  "Class 4": {
    id: "wheat",
    emoji: "🌾",
    name: { English: "Wheat", Hindi: "गेहूँ" },
    hint: {
      English: "Wheat needs balanced watering and compost-rich soil to grow strong ears.",
      Hindi: "गेहूँ को संतुलित सिंचाई और कम्पोस्ट युक्त मिट्टी चाहिए।",
    },
  },
  "Class 5": {
    id: "cotton",
    emoji: "🪴",
    name: { English: "Cotton", Hindi: "कपास" },
    hint: {
      English: "Cotton is pest-prone — ladybugs control aphids without chemicals.",
      Hindi: "कपास में कीट अधिक लगते हैं — लेडीबग बिना रसायन के माहू को रोकती है।",
    },
  },
};

export type EcoAction = {
  id: string;
  emoji: string;
  tone: string;
  label: Record<GameLanguage, string>;
  effect: { water: number; nutrients: number; pest: number };
  note: Record<GameLanguage, string>;
};

export const ECO_ACTIONS: EcoAction[] = [
  {
    id: "rain",
    emoji: "🌧️",
    tone: "bg-sky-500/10 border-sky-500/40",
    label: { English: "Cloud Rain Drop", Hindi: "वर्षा की बूँद" },
    effect: { water: 25, nutrients: -5, pest: 0 },
    note: { English: "Water +25%, Nutrients -5%", Hindi: "पानी +25%, पोषक -5%" },
  },
  {
    id: "compost",
    emoji: "🍂",
    tone: "bg-amber-600/10 border-amber-600/40",
    label: { English: "Organic Compost", Hindi: "जैविक कम्पोस्ट" },
    effect: { water: -5, nutrients: 25, pest: 5 },
    note: { English: "Nutrients +25%, Water -5%, Pest +5%", Hindi: "पोषक +25%, पानी -5%, कीट सुरक्षा +5%" },
  },
  {
    id: "ladybug",
    emoji: "🐞",
    tone: "bg-rose-500/10 border-rose-500/40",
    label: { English: "Friendly Ladybugs", Hindi: "मित्र लेडीबग" },
    effect: { water: 0, nutrients: 0, pest: 25 },
    note: { English: "Pest Protection +25%", Hindi: "कीट सुरक्षा +25%" },
  },
  {
    id: "flood",
    emoji: "🚿",
    tone: "bg-destructive/10 border-destructive/40",
    label: { English: "Over-Watering", Hindi: "अत्यधिक सिंचाई" },
    effect: { water: 40, nutrients: -20, pest: -10 },
    note: { English: "Water +40%, Nutrients -20%, Pest -10%", Hindi: "पानी +40%, पोषक -20%, कीट सुरक्षा -10%" },
  },
];

export const T = {
  hubTitle: { English: "Interactive Contextual Games Hub", Hindi: "इंटरैक्टिव प्रासंगिक खेल केंद्र" },
  yourAmount: { English: "₹ Amount you gave", Hindi: "₹ आपकी दी गई राशि" },
  total: { English: "Total", Hindi: "कुल राशि" },
  reset: { English: "🔄 Reset", Hindi: "🔄 हटाएं" },
  price: { English: "Price", Hindi: "मूल्य" },
  tapHint: { English: "Tap the coins and notes below", Hindi: "नीचे सिक्के और नोट दबाएँ" },
  celebrate: { English: "🎉 Excellent Work!", Hindi: "🎉 अद्भुत कार्य!" },
  celebrateSub: { English: "You counted the exact amount.", Hindi: "आपने बिल्कुल सही राशि गिनी।" },
  playAgain: { English: "Play again", Hindi: "फिर से खेलें" },
  water: { English: "Water Requirement", Hindi: "जल आवश्यकता" },
  nutrients: { English: "Soil Nutrients", Hindi: "मिट्टी के पोषक तत्व" },
  pest: { English: "Pest Protection", Hindi: "कीट सुरक्षा" },
  balanced: { English: "🎉 Crop is perfectly balanced!", Hindi: "🎉 फसल पूरी तरह संतुलित!" },
  goal: { English: "Balance all three bars to exactly 100%.", Hindi: "तीनों बार को ठीक 100% पर संतुलित करें।" },
} as const;