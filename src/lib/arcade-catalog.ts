/** Config factory for the Educational Arcade Arena — 15 applied-learning games. */

export type ArcadeSubject = "Math" | "Science" | "Social Science" | "General Knowledge";

export type ArcadeEngine = "tokens" | "fraction" | "choice" | "sort" | "order" | "meters";

export type ChoiceRound = { q: string; options: string[]; correct: number };
export type TokenRound = { label: string; emoji?: string; target: number };
export type FractionRound = { label: string; emoji?: string; numerator: number; denominator: number };
export type SortItem = { label: string; bin: string };
export type OrderItem = { label: string; order: number };

export type ArcadeData = {
  title?: string;
  prompt?: string;
  rounds?: ChoiceRound[];
  tokens?: TokenRound[];
  fractions?: FractionRound[];
  bins?: string[];
  items?: SortItem[];
  sequence?: OrderItem[];
  crop?: { name: string; hint: string };
};

export type ArcadeGame = {
  key: string;
  emoji: string;
  title: string;
  description: string;
  subject: ArcadeSubject;
  engine: ArcadeEngine;
  seconds: number;
  tokenSet?: "currency" | "weight";
  /** Offline-safe content used when live synthesis is unavailable. */
  fallback: ArcadeData;
};

const choice = (rounds: ChoiceRound[]): ArcadeData => ({ rounds });

export const ARCADE_SUBJECTS: ArcadeSubject[] = [
  "Math",
  "Science",
  "Social Science",
  "General Knowledge",
];

export const ARCADE_GAMES: ArcadeGame[] = [
  /* ---------------- Mathematics track ---------------- */
  {
    key: "bazaar-currency-counter",
    emoji: "🏪",
    title: "Regional Bazaar Currency Counter",
    description: "Tap notes and coins to build the exact vendor receipt total.",
    subject: "Math",
    engine: "tokens",
    tokenSet: "currency",
    seconds: 120,
    fallback: {
      tokens: [
        { label: "Mangoes (3 kg)", emoji: "🥭", target: 60 },
        { label: "Rice bag (1 kg)", emoji: "🍚", target: 45 },
        { label: "Mustard oil (1 L)", emoji: "🫙", target: 165 },
        { label: "Solar lantern", emoji: "🏮", target: 320 },
      ],
    },
  },
  {
    key: "fraction-pizza-slicer",
    emoji: "🍕",
    title: "Fraction Pizza Slicer",
    description: "Slice roti and pizza into the exact fraction each hungry customer ordered.",
    subject: "Math",
    engine: "fraction",
    seconds: 90,
    fallback: {
      fractions: [
        { label: "Village roti", emoji: "🫓", numerator: 1, denominator: 2 },
        { label: "Farm pizza", emoji: "🍕", numerator: 3, denominator: 4 },
        { label: "Jaggery cake", emoji: "🍰", numerator: 2, denominator: 3 },
        { label: "Coconut barfi", emoji: "🍬", numerator: 5, denominator: 6 },
      ],
    },
  },
  {
    key: "speed-multiplication-express",
    emoji: "🚂",
    title: "Speed Multiplication Express",
    description: "Switch the rail track to the correct factor before the express train crashes.",
    subject: "Math",
    engine: "choice",
    seconds: 60,
    fallback: choice([
      { q: "7 × 8", options: ["56", "54", "48", "63"], correct: 0 },
      { q: "9 × 6", options: ["54", "56", "45", "63"], correct: 0 },
      { q: "12 × 7", options: ["84", "72", "94", "78"], correct: 0 },
      { q: "11 × 9", options: ["99", "89", "108", "91"], correct: 0 },
      { q: "6 × 12", options: ["72", "66", "60", "76"], correct: 0 },
    ]),
  },
  {
    key: "decimal-weight-balance",
    emoji: "⚖️",
    title: "Decimal Weight Balance",
    description: "Stack metric weights on the market scale to match the harvest bag exactly.",
    subject: "Math",
    engine: "tokens",
    tokenSet: "weight",
    seconds: 120,
    fallback: {
      tokens: [
        { label: "Wheat bag", emoji: "🌾", target: 2.75 },
        { label: "Onion sack", emoji: "🧅", target: 4.5 },
        { label: "Groundnut tin", emoji: "🥜", target: 3.25 },
        { label: "Millet basket", emoji: "🧺", target: 6.75 },
      ],
    },
  },
  {
    key: "profit-loss-merchant",
    emoji: "🧾",
    title: "Profit & Loss Merchant",
    description: "Read the shop ledger and declare instantly whether the deal made profit or loss.",
    subject: "Math",
    engine: "choice",
    seconds: 60,
    fallback: choice([
      { q: "Bought at ₹120, sold at ₹150", options: ["Profit ₹30", "Loss ₹30", "Profit ₹20", "No change"], correct: 0 },
      { q: "Bought at ₹480, sold at ₹430", options: ["Loss ₹50", "Profit ₹50", "Loss ₹40", "No change"], correct: 0 },
      { q: "Bought at ₹75, sold at ₹75", options: ["No profit, no loss", "Profit ₹75", "Loss ₹75", "Profit ₹5"], correct: 0 },
      { q: "Bought at ₹200, sold at ₹260", options: ["Profit ₹60", "Loss ₹60", "Profit ₹40", "Loss ₹40"], correct: 0 },
    ]),
  },

  /* ---------------- Science track ---------------- */
  {
    key: "eco-system-balance-rush",
    emoji: "🚜",
    title: "Eco-System Balance Rush",
    description: "Irrigate, compost and release bio-pests to hold every meter at a safe 100%.",
    subject: "Science",
    engine: "meters",
    seconds: 120,
    fallback: { crop: { name: "Paddy field", hint: "Paddy loves standing water and steady compost." } },
  },
  {
    key: "state-of-matter-compressor",
    emoji: "🧊",
    title: "State of Matter Compressor",
    description: "Heat or cool the chamber to reach the target state before the pressure blows.",
    subject: "Science",
    engine: "choice",
    seconds: 60,
    fallback: choice([
      { q: "Ice is heated until it melts. New state?", options: ["Liquid", "Solid", "Gas", "Plasma"], correct: 0 },
      { q: "Water vapour is cooled sharply. New state?", options: ["Liquid", "Gas", "Solid", "No change"], correct: 0 },
      { q: "Which state has a fixed shape and volume?", options: ["Solid", "Liquid", "Gas", "None"], correct: 0 },
      { q: "Camphor turns straight into vapour. This is called", options: ["Sublimation", "Condensation", "Melting", "Freezing"], correct: 0 },
    ]),
  },
  {
    key: "food-web-energy-connector",
    emoji: "🌿",
    title: "Food Web Energy Connector",
    description: "Route energy from producers to consumers and keep the forest web alive.",
    subject: "Science",
    engine: "sort",
    seconds: 90,
    fallback: {
      bins: ["Producer", "Primary consumer", "Secondary consumer"],
      items: [
        { label: "Mango tree", bin: "Producer" },
        { label: "Grass", bin: "Producer" },
        { label: "Goat", bin: "Primary consumer" },
        { label: "Grasshopper", bin: "Primary consumer" },
        { label: "Snake", bin: "Secondary consumer" },
        { label: "Hawk", bin: "Secondary consumer" },
      ],
    },
  },
  {
    key: "solar-system-orbit-tracker",
    emoji: "🪐",
    title: "Solar System Orbit Tracker",
    description: "Tune the gravity slider and answer orbit questions to lock each planet in path.",
    subject: "Science",
    engine: "choice",
    seconds: 60,
    fallback: choice([
      { q: "Which planet is closest to the Sun?", options: ["Mercury", "Venus", "Mars", "Earth"], correct: 0 },
      { q: "Which planet takes the longest to orbit the Sun?", options: ["Neptune", "Mars", "Earth", "Jupiter"], correct: 0 },
      { q: "Earth completes one orbit in about", options: ["365 days", "30 days", "24 hours", "687 days"], correct: 0 },
      { q: "Which planet is known as the red planet?", options: ["Mars", "Venus", "Saturn", "Mercury"], correct: 0 },
    ]),
  },
  {
    key: "human-organ-sort-engine",
    emoji: "🫀",
    title: "Human Organ Sort Engine",
    description: "Scan floating organ tokens into the digestive, respiratory or circulatory bins.",
    subject: "Science",
    engine: "sort",
    seconds: 90,
    fallback: {
      bins: ["Digestive", "Respiratory", "Circulatory"],
      items: [
        { label: "Stomach", bin: "Digestive" },
        { label: "Small intestine", bin: "Digestive" },
        { label: "Lungs", bin: "Respiratory" },
        { label: "Windpipe", bin: "Respiratory" },
        { label: "Heart", bin: "Circulatory" },
        { label: "Arteries", bin: "Circulatory" },
      ],
    },
  },

  /* ---------------- Social Science & GK track ---------------- */
  {
    key: "time-travel-map-detective",
    emoji: "🗺️",
    title: "Time-Travel Map Detective",
    description: "Borders flash on the map — name the capital, river or region before time ends.",
    subject: "Social Science",
    engine: "choice",
    seconds: 60,
    fallback: choice([
      { q: "Capital of Karnataka", options: ["Bengaluru", "Mysuru", "Hubballi", "Belagavi"], correct: 0 },
      { q: "River flowing through Varanasi", options: ["Ganga", "Yamuna", "Godavari", "Kaveri"], correct: 0 },
      { q: "State famous for the Sundarbans delta", options: ["West Bengal", "Odisha", "Kerala", "Gujarat"], correct: 0 },
      { q: "Capital of Tamil Nadu", options: ["Chennai", "Madurai", "Coimbatore", "Salem"], correct: 0 },
    ]),
  },
  {
    key: "freedom-timeline-builder",
    emoji: "🕰️",
    title: "Freedom Movement Timeline Builder",
    description: "Drop the freedom-struggle landmarks into the correct chronological slots.",
    subject: "Social Science",
    engine: "order",
    seconds: 90,
    fallback: {
      sequence: [
        { label: "Revolt of 1857", order: 1 },
        { label: "Indian National Congress founded (1885)", order: 2 },
        { label: "Jallianwala Bagh (1919)", order: 3 },
        { label: "Dandi March (1930)", order: 4 },
        { label: "Quit India Movement (1942)", order: 5 },
        { label: "Independence (1947)", order: 6 },
      ],
    },
  },
  {
    key: "panchayat-election-advisor",
    emoji: "🏛️",
    title: "Panchayat Election Advisor",
    description: "Pick the right constitutional right to settle each villager's civic dispute.",
    subject: "Social Science",
    engine: "choice",
    seconds: 75,
    fallback: choice([
      { q: "A child is refused school admission due to caste. Which right applies?", options: ["Right to Equality", "Right to Property", "Right to Vote", "Right to Trade"], correct: 0 },
      { q: "A worker is forced to labour without pay. Which right applies?", options: ["Right against Exploitation", "Right to Equality", "Right to Religion", "Right to Vote"], correct: 0 },
      { q: "Minimum age to vote in a Panchayat election", options: ["18 years", "16 years", "21 years", "25 years"], correct: 0 },
      { q: "Villagers wish to hold a peaceful meeting. Which freedom applies?", options: ["Freedom of Assembly", "Freedom of Trade", "Right to Property", "Right to Education"], correct: 0 },
    ]),
  },
  {
    key: "global-climate-compass",
    emoji: "🧭",
    title: "Global Climate Compass",
    description: "Read latitude, longitude and compass headings to pin the right weather hub.",
    subject: "General Knowledge",
    engine: "choice",
    seconds: 60,
    fallback: choice([
      { q: "0° latitude is called", options: ["Equator", "Prime Meridian", "Tropic of Cancer", "Arctic Circle"], correct: 0 },
      { q: "Which zone lies near the equator?", options: ["Torrid zone", "Frigid zone", "Temperate zone", "Polar zone"], correct: 0 },
      { q: "The needle of a compass always points", options: ["North", "South", "East", "West"], correct: 0 },
      { q: "Longitude lines meet at the", options: ["Poles", "Equator", "Tropics", "Ocean"], correct: 0 },
    ]),
  },
  {
    key: "cultural-heritage-explorer",
    emoji: "🪘",
    title: "Cultural Heritage Explorer",
    description: "Match instruments, dances and dress styles to the region they belong to.",
    subject: "General Knowledge",
    engine: "sort",
    seconds: 90,
    fallback: {
      bins: ["Tamil Nadu", "Punjab", "West Bengal"],
      items: [
        { label: "Bharatanatyam", bin: "Tamil Nadu" },
        { label: "Veena", bin: "Tamil Nadu" },
        { label: "Bhangra", bin: "Punjab" },
        { label: "Dhol", bin: "Punjab" },
        { label: "Rabindra Sangeet", bin: "West Bengal" },
        { label: "Baul ektara", bin: "West Bengal" },
      ],
    },
  },
];

export function getArcadeGame(key: string): ArcadeGame | undefined {
  return ARCADE_GAMES.find((g) => g.key === key);
}

export const CURRENCY_TOKENS = [1, 2, 5, 10, 20, 50, 100, 200, 500];
export const WEIGHT_TOKENS = [0.25, 0.5, 1, 1.25, 2, 5];
