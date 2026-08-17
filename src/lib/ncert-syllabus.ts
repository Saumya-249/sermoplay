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

/** key: `${class}|${subject}` */
const SYLLABUS: Record<string, Chapters> = {
  "10|Mathematics": {
    en: [
      "Real Numbers",
      "Polynomials",
      "Pair of Linear Equations in Two Variables",
      "Quadratic Equations",
      "Arithmetic Progressions",
      "Triangles",
      "Coordinate Geometry",
      "Introduction to Trigonometry",
      "Circles",
      "Surface Areas and Volumes",
      "Statistics",
      "Probability",
    ],
    subEn: [
      ["Euclid's Division Lemma", "Fundamental Theorem of Arithmetic", "Irrationality Proofs"],
      ["Geometrical Meaning of Zeroes", "Relationship between Zeroes & Coefficients"],
    ],
    subHi: [
      ["यूक्लिड विभाजन प्रमेयिका", "अंकगणित की आधारभूत प्रमेय", "अपरिमेय संख्याओं की उपपत्ति"],
      ["शून्यकों का ज्यामितीय अर्थ", "शून्यकों और गुणांकों के बीच संबंध"],
    ],
    hi: [
      "वास्तविक संख्याएँ",
      "बहुपद",
      "दो चर वाले रैखिक समीकरण युग्म",
      "द्विघात समीकरण",
      "समांतर श्रेढ़ियाँ",
      "त्रिभुज",
      "निर्देशांक ज्यामिति",
      "त्रिकोणमिति का परिचय",
      "वृत्त",
      "पृष्ठीय क्षेत्रफल और आयतन",
      "सांख्यिकी",
      "प्रायिकता",
    ],
  },
  "11|Mathematics": {
    en: ["Sets & Functions", "Trigonometric Functions", "Linear Inequalities", "Coordinate Geometry"],
    hi: ["समुच्चय एवं फलन", "त्रिकोणमितीय फलन", "रैखिक असमिकाएँ", "निर्देशांक ज्यामिति"],
    subEn: [
      ["Types of Sets", "Venn Diagrams", "Subset Relations", "Domain and Range"],
      ["Positive & Negative Angles", "Trigonometric Identities", "General Solutions"],
      ["Algebraic Solutions", "Graphical Representations on Number Lines"],
      ["Straight Lines Equations", "Conic Sections (Circle, Parabola, Ellipse)"],
    ],
    subHi: [
      ["समुच्चयों के प्रकार", "वेन आरेख", "उपसमुच्चय संबंध", "प्रांत और परिसर"],
      ["धनात्मक एवं ऋणात्मक कोण", "त्रिकोणमितीय सर्वसमिकाएँ", "व्यापक हल"],
      ["बीजगणितीय हल", "संख्या रेखा पर आलेखीय निरूपण"],
      ["सरल रेखा के समीकरण", "शंकु परिच्छेद (वृत्त, परवलय, दीर्घवृत्त)"],
    ],
  },
  "5|Environmental Studies (EVS)": {
    en: [
      "Super Senses",
      "A Snake Charmer's Story",
      "From Tasting to Digesting",
      "Mangoes Round the Year",
      "Seeds and Seeds",
      "Every Drop Counts",
      "Experiments with Water",
      "A Treat for Mosquitoes",
      "Up You Go!",
      "Walls Tell Stories",
    ],
    hi: [
      "कैसे पहचाना (सुपर सेंसेज़)",
      "एक सपेरे की कहानी",
      "चखने से पचने तक",
      "साल भर आम",
      "बीज, बीज, बीज",
      "बूँद-बूँद कीमती",
      "पानी के प्रयोग",
      "मच्छरों की दावत",
      "चढ़ाई ऊपर की",
      "दीवारों की कहानियाँ",
    ],
    subEn: [["How animals see, hear, and smell", "Amazing sense of sight in birds", "Tiger protection"]],
    subHi: [["जानवर कैसे देखते, सुनते और सूँघते हैं", "पक्षियों की अद्भुत दृष्टि", "बाघ संरक्षण"]],
  },
  "9|Science": {
    en: [
      "Matter in Our Surroundings",
      "Is Matter Around Us Pure?",
      "Atoms and Molecules",
      "Structure of the Atom",
      "The Fundamental Unit of Life",
      "Tissues",
      "Motion",
      "Force and Laws of Motion",
      "Gravitation",
      "Work and Energy",
      "Sound",
    ],
    hi: [
      "हमारे आस-पास के पदार्थ",
      "क्या हमारे आस-पास के पदार्थ शुद्ध हैं?",
      "परमाणु एवं अणु",
      "परमाणु की संरचना",
      "जीवन की मौलिक इकाई",
      "ऊतक",
      "गति",
      "बल तथा गति के नियम",
      "गुरुत्वाकर्षण",
      "कार्य तथा ऊर्जा",
      "ध्वनि",
    ],
  },
  "12|Physics": {
    en: [
      "Electric Charges and Fields",
      "Electrostatic Potential and Capacitance",
      "Current Electricity",
      "Moving Charges and Magnetism",
      "Electromagnetic Induction",
      "Alternating Current",
      "Ray Optics and Optical Instruments",
      "Wave Optics",
      "Dual Nature of Radiation and Matter",
      "Atoms and Nuclei",
      "Semiconductor Electronics",
    ],
    hi: [
      "वैद्युत आवेश तथा क्षेत्र",
      "स्थिरवैद्युत विभव तथा धारिता",
      "विद्युत धारा",
      "गतिमान आवेश और चुम्बकत्व",
      "वैद्युतचुम्बकीय प्रेरण",
      "प्रत्यावर्ती धारा",
      "किरण प्रकाशिकी एवं प्रकाशिक यंत्र",
      "तरंग प्रकाशिकी",
      "विकिरण तथा द्रव्य की द्वैत प्रकृति",
      "परमाणु तथा नाभिक",
      "अर्धचालक इलेक्ट्रॉनिकी",
    ],
  },
};

/** Generic textbook-style chapter index when no curated list exists. */
const GENERIC: Record<string, Chapters> = {
  Mathematics: {
    en: ["Number Systems", "Algebraic Expressions", "Linear Equations", "Geometry Basics", "Mensuration", "Data Handling", "Ratio and Proportion", "Practical Problem Solving"],
    hi: ["संख्या पद्धति", "बीजीय व्यंजक", "रैखिक समीकरण", "ज्यामिति के आधार", "क्षेत्रमिति", "आँकड़ों का प्रबंधन", "अनुपात और समानुपात", "व्यावहारिक समस्या समाधान"],
  },
  Science: {
    en: ["Matter and Materials", "Living World", "Human Body and Health", "Force, Motion and Energy", "Light and Sound", "Natural Resources", "Environment and Ecosystem", "Science in Daily Life"],
    hi: ["पदार्थ एवं सामग्री", "सजीव जगत", "मानव शरीर एवं स्वास्थ्य", "बल, गति और ऊर्जा", "प्रकाश और ध्वनि", "प्राकृतिक संसाधन", "पर्यावरण एवं पारितंत्र", "दैनिक जीवन में विज्ञान"],
  },
  Social: {
    en: ["Our Past and Heritage", "The Earth and Its Features", "Resources and Livelihood", "Government and Democracy", "Society and Culture", "Rights and Duties", "Maps and Geography Skills", "India and the World"],
    hi: ["हमारा अतीत और विरासत", "पृथ्वी और उसकी विशेषताएँ", "संसाधन और आजीविका", "सरकार और लोकतंत्र", "समाज और संस्कृति", "अधिकार और कर्तव्य", "मानचित्र एवं भूगोल कौशल", "भारत और विश्व"],
  },
  Language: {
    en: ["Prose: Stories and Essays", "Poetry Section", "Grammar Foundations", "Vocabulary Building", "Comprehension Practice", "Creative Writing", "Letter and Application Writing", "Speaking and Listening Skills"],
    hi: ["गद्य: कहानियाँ एवं निबंध", "काव्य खंड", "व्याकरण की नींव", "शब्द भंडार", "अपठित बोध अभ्यास", "रचनात्मक लेखन", "पत्र एवं आवेदन लेखन", "श्रवण एवं वाचन कौशल"],
  },
  EVS: {
    en: ["Family and Friends", "Food We Eat", "Water and Its Uses", "Shelter and Homes", "Plants Around Us", "Animals Around Us", "Travel and Transport", "Keeping Clean and Healthy"],
    hi: ["परिवार और मित्र", "हमारा भोजन", "पानी और उसके उपयोग", "आश्रय और घर", "हमारे आस-पास के पौधे", "हमारे आस-पास के जानवर", "यात्रा और परिवहन", "स्वच्छता और स्वास्थ्य"],
  },
};

function genericKey(subject: string): keyof typeof GENERIC {
  if (subject === "Math" || subject === "Mathematics" || subject === "Accountancy" || subject === "Economics") return "Mathematics";
  if (["Science", "Physics", "Chemistry", "Biology"].includes(subject)) return "Science";
  if (["Social Science", "History", "Political Science"].includes(subject)) return "Social";
  if (subject.includes("Environmental")) return "EVS";
  return "Language";
}

export function getSyllabus(classLevel: number, subject: string, language: ExplorerLanguage): string[] {
  const curated = SYLLABUS[`${classLevel}|${subject}`];
  const pack = curated ?? GENERIC[genericKey(subject)]!;
  return language === "Hindi" ? pack.hi : pack.en;
}

export function isCurated(classLevel: number, subject: string) {
  return Boolean(SYLLABUS[`${classLevel}|${subject}`]);
}

/** Sub-topics for a chapter; falls back to an algorithmic 3-point breakdown. */
export function getSubtopics(
  classLevel: number,
  subject: string,
  chapterIndex: number,
  chapterTitle: string,
  language: ExplorerLanguage,
): string[] {
  const curated = SYLLABUS[`${classLevel}|${subject}`];
  const list = language === "Hindi" ? curated?.subHi : curated?.subEn;
  const found = list?.[chapterIndex];
  if (found && found.length) return found;

  return language === "Hindi"
    ? [
        `${chapterTitle} की मूल अवधारणाएँ एवं परिभाषाएँ`,
        "व्यावहारिक अनुप्रयोग एवं हल किए गए उदाहरण",
        "एन.सी.ई.आर.टी. अभ्यास प्रश्न एवं अभ्यास क्विज़",
      ]
    : [
        `Core Concepts & Definitions of ${chapterTitle}`,
        "Practical Application & Solved Examples",
        "NCERT Exercise Problems & Practice Quiz Links",
      ];
}
