export type ExplorerLanguage = "English" | "Hindi";

export const EXPLORER_CLASSES = Array.from({ length: 12 }, (_, i) => i + 1);

export const PRIMARY_SUBJECTS = ["Math", "Environmental Studies (EVS)", "English", "Hindi"];
export const MIDDLE_SUBJECTS = ["Mathematics", "Science", "Social Science", "English", "Hindi"];
export const SENIOR_SUBJECTS = [
  "Physics",
  "Chemistry",
  "Mathematics",
  "Biology",
  "History",
  "Political Science",
  "Economics",
  "Accountancy",
];

export function subjectsForClass(classLevel: number): string[] {
  if (classLevel <= 5) return PRIMARY_SUBJECTS;
  if (classLevel <= 10) return MIDDLE_SUBJECTS;
  return SENIOR_SUBJECTS;
}

/** Hindi labels for subject names. */
export const SUBJECT_HI: Record<string, string> = {
  Math: "गणित",
  Mathematics: "गणित",
  "Environmental Studies (EVS)": "पर्यावरण अध्ययन (ई.वी.एस.)",
  English: "अंग्रेज़ी",
  Hindi: "हिंदी",
  Science: "विज्ञान",
  "Social Science": "सामाजिक विज्ञान",
  Physics: "भौतिक विज्ञान",
  Chemistry: "रसायन विज्ञान",
  Biology: "जीव विज्ञान",
  History: "इतिहास",
  "Political Science": "राजनीति विज्ञान",
  Economics: "अर्थशास्त्र",
  Accountancy: "लेखाशास्त्र",
};

type Chapters = {
  en: string[];
  hi: string[];
  /** Optional parallel sub-topic lists, indexed like `en`/`hi`. */
  subEn?: string[][];
  subHi?: string[][];
};

type Stage = "elementary" | "middle" | "secondary" | "senior";

function stageOf(classLevel: number): Stage {
  if (classLevel <= 5) return "elementary";
  if (classLevel <= 8) return "middle";
  if (classLevel <= 10) return "secondary";
  return "senior";
}

/** Normalises the many subject spellings into one routing key per stage. */
function subjectKey(subject: string): string {
  const s = subject.toLowerCase();
  if (s.includes("environmental") || s === "evs") return "EVS";
  if (s.startsWith("math")) return "Mathematics";
  if (s === "physics") return "Physics";
  if (s === "chemistry") return "Chemistry";
  if (s === "biology") return "Biology";
  if (s.includes("science") && !s.includes("social") && !s.includes("political")) return "Science";
  if (s.includes("social")) return "Social Science";
  if (s.includes("political")) return "Political Science";
  if (s === "history") return "History";
  if (s === "economics") return "Economics";
  if (s === "accountancy") return "Accountancy";
  if (s === "hindi") return "Hindi";
  return "English";
}

/**
 * Condition-based curriculum router: `${stage}|${subjectKey}` → chapter matrix.
 * Every stage owns its own academic content; nothing is shared across stages.
 */
const CURRICULUM: Record<string, Chapters> = {
  /* ---------------- A. Elementary (Classes 1–5) ---------------- */
  "elementary|Mathematics": {
    en: [
      "Shapes and Space",
      "Numbers from One to Nine",
      "Addition",
      "Subtraction",
      "How Many Times? (Multiplication)",
      "Sharing (Division)",
    ],
    hi: [
      "आकृतियाँ और स्थान",
      "एक से नौ तक की संख्याएँ",
      "जोड़",
      "घटाव",
      "कितनी बार? (गुणा)",
      "बाँटना (भाग)",
    ],
  },
  "elementary|EVS": {
    en: [
      "Super Senses",
      "A Snake Charmer's Story",
      "From Tasting to Digesting",
      "Mangoes Round the Year",
      "Seeds and Seeds",
    ],
    hi: [
      "कैसे पहचाना (सुपर सेंसेज़)",
      "एक सपेरे की कहानी",
      "चखने से पचने तक",
      "साल भर आम",
      "बीज, बीज, बीज",
    ],
    subEn: [["How animals see, hear and smell", "Amazing sense of sight in birds", "Tiger and wildlife protection"]],
    subHi: [["जानवर कैसे देखते, सुनते और सूँघते हैं", "पक्षियों की अद्भुत दृष्टि", "बाघ एवं वन्यजीव संरक्षण"]],
  },
  "elementary|English": {
    en: ["Rhymes and Poems", "Short Stories", "Nouns, Verbs and Adjectives", "Reading Comprehension", "Picture Composition", "Speaking and Listening"],
    hi: ["कविताएँ एवं तुकबंदी", "छोटी कहानियाँ", "संज्ञा, क्रिया और विशेषण", "पठन बोध", "चित्र वर्णन", "श्रवण एवं वाचन"],
  },
  "elementary|Hindi": {
    en: ["Varnamala and Matras", "Poems (Kavita)", "Stories (Kahani)", "Word Building", "Simple Grammar", "Oral Expression"],
    hi: ["वर्णमाला एवं मात्राएँ", "कविता", "कहानी", "शब्द रचना", "सरल व्याकरण", "मौखिक अभिव्यक्ति"],
  },

  /* ---------------- B. Middle (Classes 6–8) ---------------- */
  "middle|Mathematics": {
    en: [
      "Knowing Our Numbers",
      "Whole Numbers",
      "Playing with Numbers",
      "Integers",
      "Fractions & Decimals",
      "Data Handling",
    ],
    hi: [
      "अपनी संख्याओं की जानकारी",
      "पूर्ण संख्याएँ",
      "संख्याओं के साथ खेलना",
      "पूर्णांक",
      "भिन्न एवं दशमलव",
      "आँकड़ों का प्रबंधन",
    ],
  },
  "middle|Science": {
    en: [
      "Components of Food",
      "Sorting Materials into Groups",
      "Separation of Substances",
      "Getting to Know Plants",
      "Body Movements",
    ],
    hi: [
      "भोजन के घटक",
      "वस्तुओं के समूह बनाना",
      "पदार्थों का पृथक्करण",
      "पौधों को जानिए",
      "शरीर में गति",
    ],
  },
  "middle|Social Science": {
    en: ["Our Pasts (History)", "The Earth Our Habitat (Geography)", "Social and Political Life (Civics)"],
    hi: ["हमारे अतीत (इतिहास)", "पृथ्वी हमारा आवास (भूगोल)", "सामाजिक एवं राजनीतिक जीवन (नागरिक शास्त्र)"],
  },
  "middle|English": {
    en: ["Prose: Stories and Essays", "Poetry Section", "Tenses and Sentence Structure", "Vocabulary Building", "Comprehension Practice", "Letter and Paragraph Writing"],
    hi: ["गद्य: कहानियाँ एवं निबंध", "काव्य खंड", "काल एवं वाक्य रचना", "शब्द भंडार", "अपठित बोध अभ्यास", "पत्र एवं अनुच्छेद लेखन"],
  },
  "middle|Hindi": {
    en: ["Gadya Khand (Prose)", "Kavya Khand (Poetry)", "Vyakaran: Sandhi and Samas", "Muhavare aur Lokoktiyan", "Apathit Gadyansh", "Nibandh Lekhan"],
    hi: ["गद्य खंड", "काव्य खंड", "व्याकरण: संधि एवं समास", "मुहावरे और लोकोक्तियाँ", "अपठित गद्यांश", "निबंध लेखन"],
  },

  /* ---------------- C. Secondary (Classes 9–10) ---------------- */
  "secondary|Mathematics": {
    en: [
      "Real Numbers",
      "Polynomials",
      "Pair of Linear Equations",
      "Quadratic Equations",
      "Coordinate Geometry",
      "Trigonometry",
    ],
    hi: [
      "वास्तविक संख्याएँ",
      "बहुपद",
      "दो चर वाले रैखिक समीकरण युग्म",
      "द्विघात समीकरण",
      "निर्देशांक ज्यामिति",
      "त्रिकोणमिति",
    ],
    subEn: [
      ["Euclid's Division Lemma", "Fundamental Theorem of Arithmetic", "Irrationality Proofs"],
      ["Geometrical Meaning of Zeroes", "Relationship between Zeroes & Coefficients", "Division Algorithm"],
    ],
    subHi: [
      ["यूक्लिड विभाजन प्रमेयिका", "अंकगणित की आधारभूत प्रमेय", "अपरिमेय संख्याओं की उपपत्ति"],
      ["शून्यकों का ज्यामितीय अर्थ", "शून्यकों और गुणांकों के बीच संबंध", "विभाजन एल्गोरिथ्म"],
    ],
  },
  "secondary|Science": {
    en: [
      "Chemical Reactions and Equations",
      "Acids, Bases and Salts",
      "Metals and Non-metals",
      "Life Processes",
      "Light - Reflection and Refraction",
    ],
    hi: [
      "रासायनिक अभिक्रियाएँ एवं समीकरण",
      "अम्ल, क्षारक एवं लवण",
      "धातु एवं अधातु",
      "जैव प्रक्रम",
      "प्रकाश - परावर्तन तथा अपवर्तन",
    ],
  },
  "secondary|Social Science": {
    en: ["India and the Contemporary World (History)", "Contemporary India (Geography)", "Democratic Politics (Civics)", "Understanding Economic Development"],
    hi: ["भारत और समकालीन विश्व (इतिहास)", "समकालीन भारत (भूगोल)", "लोकतांत्रिक राजनीति (नागरिक शास्त्र)", "आर्थिक विकास की समझ"],
  },
  "secondary|English": {
    en: ["Prose: First Flight", "Poetry: First Flight", "Supplementary Reader: Footprints Without Feet", "Grammar and Editing", "Reading Comprehension", "Writing Skills: Letters and Analytical Paragraphs"],
    hi: ["गद्य: फर्स्ट फ्लाइट", "काव्य: फर्स्ट फ्लाइट", "पूरक पाठ्यपुस्तक", "व्याकरण एवं संपादन", "अपठित बोध", "लेखन कौशल: पत्र एवं विश्लेषणात्मक अनुच्छेद"],
  },
  "secondary|Hindi": {
    en: ["Kshitij: Kavya Khand", "Kshitij: Gadya Khand", "Kritika: Supplementary", "Vyakaran: Rachana ke Aadhar par Vakya Bhed", "Apathit Bodh", "Rachnatmak Lekhan"],
    hi: ["क्षितिज: काव्य खंड", "क्षितिज: गद्य खंड", "कृतिका: पूरक पाठ्यपुस्तक", "व्याकरण: रचना के आधार पर वाक्य भेद", "अपठित बोध", "रचनात्मक लेखन"],
  },

  /* ---------------- D. Senior Secondary (Classes 11–12) ---------------- */
  "senior|Physics": {
    en: [
      "Electric Charges and Fields",
      "Electrostatic Potential",
      "Current Electricity",
      "Moving Charges and Magnetism",
      "Electromagnetic Induction",
      "Wave Optics",
    ],
    hi: [
      "वैद्युत आवेश तथा क्षेत्र",
      "स्थिरवैद्युत विभव",
      "विद्युत धारा",
      "गतिमान आवेश और चुम्बकत्व",
      "वैद्युतचुम्बकीय प्रेरण",
      "तरंग प्रकाशिकी",
    ],
  },
  "senior|Chemistry": {
    en: [
      "Solutions",
      "Electrochemistry",
      "Chemical Kinetics",
      "d- and f-Block Elements",
      "Coordination Compounds",
      "Organic Chemistry Principles",
    ],
    hi: [
      "विलयन",
      "वैद्युतरसायन",
      "रासायनिक बलगतिकी",
      "d- एवं f-ब्लॉक के तत्व",
      "उपसहसंयोजन यौगिक",
      "कार्बनिक रसायन के सिद्धांत",
    ],
  },
  "senior|Biology": {
    en: [
      "Sexual Reproduction in Flowering Plants",
      "Human Reproduction",
      "Principles of Inheritance",
      "Molecular Basis of Inheritance",
      "Biotechnology",
    ],
    hi: [
      "पुष्पी पादपों में लैंगिक जनन",
      "मानव जनन",
      "वंशागति के सिद्धांत",
      "वंशागति का आणविक आधार",
      "जैव प्रौद्योगिकी",
    ],
  },
  "senior|Mathematics": {
    en: ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices and Determinants", "Continuity and Differentiability", "Integrals and Applications", "Probability"],
    hi: ["संबंध एवं फलन", "प्रतिलोम त्रिकोणमितीय फलन", "आव्यूह एवं सारणिक", "सांतत्य तथा अवकलनीयता", "समाकलन एवं अनुप्रयोग", "प्रायिकता"],
  },
  "senior|History": {
    en: ["Bricks, Beads and Bones: The Harappan Civilisation", "Kings, Farmers and Towns", "Kinship, Caste and Class", "Bhakti-Sufi Traditions", "Colonialism and the Countryside", "Framing the Constitution"],
    hi: ["ईंटें, मनके तथा अस्थियाँ: हड़प्पा सभ्यता", "राजा, किसान और नगर", "बंधुत्व, जाति तथा वर्ग", "भक्ति-सूफी परंपराएँ", "उपनिवेशवाद और देहात", "संविधान का निर्माण"],
  },
  "senior|Political Science": {
    en: ["The Cold War Era", "The End of Bipolarity", "Contemporary Centres of Power", "Challenges of Nation Building", "Era of One-Party Dominance", "Indian Foreign Policy"],
    hi: ["शीतयुद्ध का दौर", "दो ध्रुवीयता का अंत", "सत्ता के समकालीन केंद्र", "राष्ट्र निर्माण की चुनौतियाँ", "एक दल के प्रभुत्व का दौर", "भारत की विदेश नीति"],
  },
  "senior|Economics": {
    en: ["Introduction to Macroeconomics", "National Income Accounting", "Money and Banking", "Determination of Income and Employment", "Government Budget and the Economy", "Balance of Payments"],
    hi: ["समष्टि अर्थशास्त्र का परिचय", "राष्ट्रीय आय का लेखांकन", "मुद्रा एवं बैंकिंग", "आय और रोज़गार का निर्धारण", "सरकारी बजट एवं अर्थव्यवस्था", "भुगतान संतुलन"],
  },
  "senior|Accountancy": {
    en: ["Accounting for Partnership Firms", "Reconstitution of a Partnership", "Dissolution of Partnership Firm", "Accounting for Share Capital", "Issue and Redemption of Debentures", "Analysis of Financial Statements"],
    hi: ["साझेदारी फर्मों का लेखांकन", "साझेदारी का पुनर्गठन", "साझेदारी फर्म का विघटन", "अंश पूँजी का लेखांकन", "ऋणपत्रों का निर्गमन एवं शोधन", "वित्तीय विवरणों का विश्लेषण"],
  },
  "senior|English": {
    en: ["Flamingo: Prose", "Flamingo: Poetry", "Vistas: Supplementary Reader", "Advanced Grammar and Usage", "Reading Comprehension and Note Making", "Writing Skills: Reports, Articles and Letters"],
    hi: ["फ्लेमिंगो: गद्य", "फ्लेमिंगो: काव्य", "विस्टास: पूरक पाठ्यपुस्तक", "उच्च व्याकरण एवं प्रयोग", "अपठित बोध एवं नोट लेखन", "लेखन कौशल: रिपोर्ट, लेख एवं पत्र"],
  },
  "senior|Hindi": {
    en: ["Aroh: Kavya Khand", "Aroh: Gadya Khand", "Vitan: Supplementary", "Abhivyakti aur Madhyam", "Apathit Bodh", "Jansanchar Madhyam Lekhan"],
    hi: ["आरोह: काव्य खंड", "आरोह: गद्य खंड", "वितान: पूरक पाठ्यपुस्तक", "अभिव्यक्ति और माध्यम", "अपठित बोध", "जनसंचार माध्यम लेखन"],
  },
};

function resolve(classLevel: number, subject: string): Chapters | undefined {
  const stage = stageOf(classLevel);
  const key = subjectKey(subject);
  return CURRICULUM[`${stage}|${key}`] ?? CURRICULUM[`${stage}|English`];
}

export function getSyllabus(classLevel: number, subject: string, language: ExplorerLanguage): string[] {
  const pack = resolve(classLevel, subject);
  if (!pack) return [];
  return language === "Hindi" ? pack.hi : pack.en;
}

export function isCurated(classLevel: number, subject: string) {
  return Boolean(CURRICULUM[`${stageOf(classLevel)}|${subjectKey(subject)}`]);
}

/** Sub-topics for a chapter; falls back to an academic 3-point breakdown. */
export function getSubtopics(
  classLevel: number,
  subject: string,
  chapterIndex: number,
  chapterTitle: string,
  language: ExplorerLanguage,
): string[] {
  const pack = resolve(classLevel, subject);
  const list = language === "Hindi" ? pack?.subHi : pack?.subEn;
  const found = list?.[chapterIndex];
  if (found && found.length) return found;

  return language === "Hindi"
    ? [
        `${chapterTitle} की मूल सैद्धांतिक अवधारणाएँ, परिभाषाएँ एवं सूत्र`,
        "एन.सी.ई.आर.टी. पाठ्यपुस्तक के अंतर्पाठ प्रश्न एवं हल किए गए उदाहरण",
        "व्यावहारिक वास्तविक-जीवन अनुप्रयोग एवं इंटरैक्टिव मॉक मूल्यांकन",
      ]
    : [
        `Core Theoretical Concepts, Definitions & Formulas of ${chapterTitle}`,
        "NCERT Textbook In-Text Questions & Solved Examples",
        "Practical Real-World Applications & Interactive Mock Assessment",
      ];
}
