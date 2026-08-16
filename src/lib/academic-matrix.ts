/* Academic Question Synthesis Matrix — curriculum-aligned MCQ bank (EN + HI). */

export type MatrixItem = { q: string; options: string[]; correct: number };
export type MatrixSubject = Record<string, MatrixItem[]>;
export type MatrixLang = Record<string, MatrixSubject>;

export const ACADEMIC_MATRIX: { english: MatrixLang; hindi: MatrixLang } = {
  english: {
    mathematics: {
      trigonometry: [
        { q: "What is the exact numerical value of sin(30°)?", options: ["1/2", "√3/2", "1", "0"], correct: 0 },
        { q: "In a right-angled triangle, what ratio defines the tangent (tan) of an angle?", options: ["Opposite / Adjacent", "Opposite / Hypotenuse", "Adjacent / Hypotenuse", "Hypotenuse / Opposite"], correct: 0 },
        { q: "If cos(θ) = 4/5 in a right triangle, what is the value of sin(θ)?", options: ["3/5", "5/4", "3/4", "1/5"], correct: 0 },
        { q: "Which trigonometric identity is universally correct?", options: ["sin²θ + cos²θ = 1", "sin²θ - cos²θ = 1", "tan²θ + 1 = sin²θ", "1 - cos²θ = tan²θ"], correct: 0 },
        { q: "What is the value of tan(45°)?", options: ["1", "0", "√3", "1/√3"], correct: 0 },
      ],
      geometry: [
        { q: "How many total degrees are there in the interior angles of a triangle?", options: ["180°", "360°", "90°", "270°"], correct: 0 },
        { q: "What is an angle called if its measurement is strictly between 90° and 180°?", options: ["Obtuse Angle", "Acute Angle", "Right Angle", "Reflex Angle"], correct: 0 },
        { q: "How many vertices does a standard cube have?", options: ["8", "6", "12", "4"], correct: 0 },
        { q: "What is the formula used to calculate the area of a circle?", options: ["πr²", "2πr", "πd", "2πr²"], correct: 0 },
        { q: "A polygon with exactly eight sides is classified as a:", options: ["Octagon", "Hexagon", "Pentagon", "Heptagon"], correct: 0 },
      ],
      ratio: [
        { q: "Simplify the mathematical ratio 24:36 to its lowest terms:", options: ["2:3", "3:4", "4:6", "1:2"], correct: 0 },
        { q: "Divide ₹120 between two students in a strict ratio of 2:3. What is the smaller share?", options: ["₹48", "₹72", "₹40", "₹60"], correct: 0 },
        { q: "If a map scale is 1:100,000, what actual distance does 5 cm on the map represent?", options: ["5 km", "50 km", "500 m", "50,000 m"], correct: 0 },
        { q: "Are the numbers 4, 6, 8, and 12 in a true proportion?", options: ["Yes, because 4/6 = 8/12", "No, because 4+12 ≠ 6+8", "Yes, because 4x6 = 8x12", "No, because 4/12 ≠ 6/8"], correct: 0 },
        { q: "If 5 clear tokens represent 20 items, how many items do 8 tokens represent?", options: ["32", "40", "25", "16"], correct: 0 },
      ],
      fraction: [
        { q: "Which fraction value is mathematically equivalent to 3/4?", options: ["9/12", "6/10", "5/8", "12/18"], correct: 0 },
        { q: "In the fraction 7/12, what is the accurate academic term for the number 12?", options: ["Denominator", "Numerator", "Quotient", "Remainder"], correct: 0 },
        { q: "Solve the expression: 1/3 + 2/5", options: ["11/15", "3/8", "3/15", "2/15"], correct: 0 },
        { q: "Convert the improper fraction 11/4 into a mixed number:", options: ["2 ¾", "3 ¼", "2 ¼", "3 ¾"], correct: 0 },
        { q: "What is 2/3 multiplied by 9/10?", options: ["3/5", "11/13", "18/30", "1/5"], correct: 0 },
      ],
    },
    science: {
      photosynthesis: [
        { q: "Which pigment inside plant cells is primarily responsible for capturing sunlight?", options: ["Chlorophyll", "Carotenoid", "Hemoglobin", "Xanthophyll"], correct: 0 },
        { q: "What are the primary chemical outputs produced during photosynthesis?", options: ["Glucose and Oxygen", "Carbon Dioxide and Water", "Oxygen and Methane", "Glucose and Carbon Dioxide"], correct: 0 },
        { q: "Through which specific microscopic structure do leaves absorb carbon dioxide gas?", options: ["Stomata", "Xylem", "Phloem", "Cuticle"], correct: 0 },
        { q: "Which form of energy is light converted into during photosynthesis?", options: ["Chemical Energy", "Thermal Energy", "Kinetic Energy", "Nuclear Energy"], correct: 0 },
        { q: "Which primary resource is absorbed by roots to supply electrons for photosynthesis?", options: ["Water", "Nitrogen", "Soil Minerals", "Oxygen"], correct: 0 },
      ],
      watercycle: [
        { q: "What is the scientific term for liquid water converting into water vapour due to heat?", options: ["Evaporation", "Condensation", "Precipitation", "Transpiration"], correct: 0 },
        { q: "Which atmospheric process directly causes clouds to form from cooling water vapour?", options: ["Condensation", "Sublimation", "Evaporation", "Runoff"], correct: 0 },
        { q: "What is the release of water vapour specifically from plant leaves into the air called?", options: ["Transpiration", "Respiration", "Infiltration", "Precipitation"], correct: 0 },
        { q: "Rain, snow, sleet, and hail are all explicit examples of physical:", options: ["Precipitation", "Condensation", "Evaporation", "Collection"], correct: 0 },
        { q: "What force drives precipitation back down to Earth's surface to collect in rivers?", options: ["Gravity", "Magnetism", "Atmospheric Pressure", "Wind Friction"], correct: 0 },
      ],
    },
    socialscience: {
      maps: [
        { q: "Which lines on a global map measure distances north or south of the Equator?", options: ["Lines of Latitude", "Lines of Longitude", "Prime Meridians", "Contours"], correct: 0 },
        { q: "What specific map feature relates a measured distance on paper to actual earth distance?", options: ["Map Scale", "Compass Rose", "Map Legend", "Topography Key"], correct: 0 },
        { q: "If you face directly North and turn 90 degrees to your right, which direction do you face?", options: ["East", "West", "South", "South-East"], correct: 0 },
        { q: "What do closely packed contour lines indicate on a physical topographic map?", options: ["Steep Terrain", "Flat Plains", "Deep Water", "Forest Density"], correct: 0 },
        { q: "The 0-degree line of longitude passing through Greenwich is globally known as the:", options: ["Prime Meridian", "Equator", "Tropic of Cancer", "International Date Line"], correct: 0 },
      ],
      history: [
        { q: "In which year did India officially achieve independence from British colonial rule?", options: ["1947", "1950", "1942", "1935"], correct: 0 },
        { q: "Who is widely recognized for leading the Dandi March to protest the colonial salt tax?", options: ["Mahatma Gandhi", "Subhas Chandra Bose", "Bhagat Singh", "Jawaharlal Nehru"], correct: 0 },
        { q: "Which major global conflict took place explicitly between the calendar years 1914 and 1918?", options: ["World War I", "World War II", "The French Revolution", "The Cold War"], correct: 0 },
        { q: "The ancient civilization discovered along the banks of the Indus River is known as:", options: ["Harappan Civilization", "Mesopotamian Civilization", "Egyptian Civilization", "Inca Civilization"], correct: 0 },
        { q: "Who was the primary architect and Chairman of the Drafting Committee for India's Constitution?", options: ["Dr. B.R. Ambedkar", "Dr. Rajendra Prasad", "Sardar Vallabhbhai Patel", "Mahatma Gandhi"], correct: 0 },
      ],
      civics: [
        { q: "What is the legally mandated minimum voting age for citizens in democratic India?", options: ["18 Years", "21 Years", "25 Years", "16 Years"], correct: 0 },
        { q: "Which organ of government is explicitly responsible for making and amending laws?", options: ["The Legislature", "The Executive", "The Judiciary", "The Media"], correct: 0 },
        { q: "What is the local self-government system implemented at the rural village level in India?", options: ["Panchayati Raj", "Municipal Corporation", "Legislative Assembly", "Zila Parishad"], correct: 0 },
        { q: "How many Fundamental Rights are guaranteed to citizens under the Constitution of India?", options: ["6", "7", "10", "5"], correct: 0 },
        { q: "Who holds the constitutional position of the Supreme Commander of the Armed Forces in India?", options: ["The President", "The Prime Minister", "The Chief of Defence Staff", "The Defence Minister"], correct: 0 },
      ],
    },
  },
  hindi: {
    mathematics: {
      trigonometry: [
        { q: "sin(30°) का सटीक संख्यात्मक मान क्या है?", options: ["1/2", "√3/2", "1", "0"], correct: 0 },
        { q: "समकोण त्रिभुज में किसी कोण की स्पर्शज्या (tan) किस अनुपात से परिभाषित होती है?", options: ["सम्मुख भुजा / आसन्न भुजा", "सम्मुख भुजा / कर्ण", "आसन्न भुजा / कर्ण", "कर्ण / सम्मुख भुजा"], correct: 0 },
        { q: "यदि समकोण त्रिभुज में cos(θ) = 4/5 है, तो sin(θ) का मान क्या होगा?", options: ["3/5", "5/4", "3/4", "1/5"], correct: 0 },
        { q: "निम्न में से कौन-सा त्रिकोणमितीय सर्वसमिका सदैव सत्य है?", options: ["sin²θ + cos²θ = 1", "sin²θ - cos²θ = 1", "tan²θ + 1 = sin²θ", "1 - cos²θ = tan²θ"], correct: 0 },
        { q: "tan(45°) का मान क्या है?", options: ["1", "0", "√3", "1/√3"], correct: 0 },
      ],
      geometry: [
        { q: "त्रिभुज के तीनों आंतरिक कोणों का योग कितने अंश होता है?", options: ["180°", "360°", "90°", "270°"], correct: 0 },
        { q: "जिस कोण का माप 90° और 180° के बीच हो, उसे क्या कहते हैं?", options: ["अधिक कोण", "न्यून कोण", "समकोण", "प्रतिवर्ती कोण"], correct: 0 },
        { q: "एक घन में कुल कितने शीर्ष होते हैं?", options: ["8", "6", "12", "4"], correct: 0 },
        { q: "वृत्त का क्षेत्रफल ज्ञात करने का सूत्र क्या है?", options: ["πr²", "2πr", "πd", "2πr²"], correct: 0 },
        { q: "ठीक आठ भुजाओं वाले बहुभुज को क्या कहा जाता है?", options: ["अष्टभुज", "षट्भुज", "पंचभुज", "सप्तभुज"], correct: 0 },
      ],
      ratio: [
        { q: "अनुपात 24:36 को उसके सरलतम रूप में लिखिए:", options: ["2:3", "3:4", "4:6", "1:2"], correct: 0 },
        { q: "₹120 को दो विद्यार्थियों में 2:3 के अनुपात में बाँटा जाए, तो छोटा हिस्सा कितना होगा?", options: ["₹48", "₹72", "₹40", "₹60"], correct: 0 },
        { q: "यदि मानचित्र का पैमाना 1:1,00,000 है, तो मानचित्र पर 5 सेमी वास्तव में कितनी दूरी दर्शाता है?", options: ["5 किमी", "50 किमी", "500 मीटर", "50,000 मीटर"], correct: 0 },
        { q: "क्या संख्याएँ 4, 6, 8 और 12 समानुपात में हैं?", options: ["हाँ, क्योंकि 4/6 = 8/12", "नहीं, क्योंकि 4+12 ≠ 6+8", "हाँ, क्योंकि 4x6 = 8x12", "नहीं, क्योंकि 4/12 ≠ 6/8"], correct: 0 },
        { q: "यदि 5 टोकन 20 वस्तुएँ दर्शाते हैं, तो 8 टोकन कितनी वस्तुएँ दर्शाएँगे?", options: ["32", "40", "25", "16"], correct: 0 },
      ],
      fraction: [
        { q: "निम्न में से कौन-सी भिन्न 3/4 के तुल्य है?", options: ["9/12", "6/10", "5/8", "12/18"], correct: 0 },
        { q: "भिन्न 7/12 में संख्या 12 को क्या कहा जाता है?", options: ["हर", "अंश", "भागफल", "शेषफल"], correct: 0 },
        { q: "हल कीजिए: 1/3 + 2/5", options: ["11/15", "3/8", "3/15", "2/15"], correct: 0 },
        { q: "विषम भिन्न 11/4 को मिश्रित संख्या में बदलिए:", options: ["2 ¾", "3 ¼", "2 ¼", "3 ¾"], correct: 0 },
        { q: "2/3 को 9/10 से गुणा करने पर क्या प्राप्त होगा?", options: ["3/5", "11/13", "18/30", "1/5"], correct: 0 },
      ],
    },
    science: {
      photosynthesis: [
        { q: "पादप कोशिकाओं में सूर्य के प्रकाश को ग्रहण करने वाला मुख्य वर्णक कौन-सा है?", options: ["क्लोरोफिल", "कैरोटीनॉयड", "हीमोग्लोबिन", "ज़ैंथोफिल"], correct: 0 },
        { q: "प्रकाश संश्लेषण में मुख्य रूप से कौन-से उत्पाद बनते हैं?", options: ["ग्लूकोज़ और ऑक्सीजन", "कार्बन डाइऑक्साइड और जल", "ऑक्सीजन और मीथेन", "ग्लूकोज़ और कार्बन डाइऑक्साइड"], correct: 0 },
        { q: "पत्तियाँ कार्बन डाइऑक्साइड किस सूक्ष्म संरचना द्वारा ग्रहण करती हैं?", options: ["रंध्र", "जाइलम", "फ्लोएम", "उपचर्म"], correct: 0 },
        { q: "प्रकाश संश्लेषण में प्रकाश ऊर्जा किस ऊर्जा में परिवर्तित होती है?", options: ["रासायनिक ऊर्जा", "ऊष्मीय ऊर्जा", "गतिज ऊर्जा", "नाभिकीय ऊर्जा"], correct: 0 },
        { q: "जड़ों द्वारा अवशोषित कौन-सा पदार्थ प्रकाश संश्लेषण के लिए इलेक्ट्रॉन प्रदान करता है?", options: ["जल", "नाइट्रोजन", "मृदा खनिज", "ऑक्सीजन"], correct: 0 },
      ],
      watercycle: [
        { q: "ऊष्मा से द्रव जल के जलवाष्प में बदलने की प्रक्रिया को क्या कहते हैं?", options: ["वाष्पीकरण", "संघनन", "वर्षण", "वाष्पोत्सर्जन"], correct: 0 },
        { q: "ठंडी होती जलवाष्प से बादल बनने की प्रक्रिया कौन-सी है?", options: ["संघनन", "ऊर्ध्वपातन", "वाष्पीकरण", "अपवाह"], correct: 0 },
        { q: "पत्तियों से जलवाष्प के वायु में निकलने को क्या कहते हैं?", options: ["वाष्पोत्सर्जन", "श्वसन", "अंतःस्यंदन", "वर्षण"], correct: 0 },
        { q: "वर्षा, हिम, ओले और सहिम वृष्टि किसके उदाहरण हैं?", options: ["वर्षण", "संघनन", "वाष्पीकरण", "संग्रहण"], correct: 0 },
        { q: "वर्षण को पृथ्वी की सतह तक लाकर नदियों में एकत्र करने वाला बल कौन-सा है?", options: ["गुरुत्वाकर्षण", "चुंबकत्व", "वायुमंडलीय दाब", "पवन घर्षण"], correct: 0 },
      ],
    },
    socialscience: {
      maps: [
        { q: "मानचित्र पर भूमध्य रेखा से उत्तर या दक्षिण की दूरी कौन-सी रेखाएँ मापती हैं?", options: ["अक्षांश रेखाएँ", "देशांतर रेखाएँ", "प्रधान याम्योत्तर", "समोच्च रेखाएँ"], correct: 0 },
        { q: "कागज़ पर मापी गई दूरी को वास्तविक दूरी से कौन-सी विशेषता जोड़ती है?", options: ["मानचित्र का पैमाना", "दिक् सूचक", "मानचित्र संकेत सूची", "स्थलाकृति कुंजी"], correct: 0 },
        { q: "यदि आप उत्तर की ओर मुख करके 90 अंश दाईं ओर घूमें, तो किस दिशा में मुख होगा?", options: ["पूर्व", "पश्चिम", "दक्षिण", "दक्षिण-पूर्व"], correct: 0 },
        { q: "स्थलाकृतिक मानचित्र पर पास-पास खिंची समोच्च रेखाएँ क्या दर्शाती हैं?", options: ["तीव्र ढाल", "समतल मैदान", "गहरा जल", "वन घनत्व"], correct: 0 },
        { q: "ग्रीनविच से गुजरने वाली 0 अंश देशांतर रेखा को क्या कहते हैं?", options: ["प्रधान याम्योत्तर", "भूमध्य रेखा", "कर्क रेखा", "अंतर्राष्ट्रीय तिथि रेखा"], correct: 0 },
      ],
      history: [
        { q: "भारत ने ब्रिटिश शासन से स्वतंत्रता किस वर्ष प्राप्त की?", options: ["1947", "1950", "1942", "1935"], correct: 0 },
        { q: "नमक कर के विरोध में दांडी मार्च का नेतृत्व किसने किया था?", options: ["महात्मा गांधी", "सुभाष चंद्र बोस", "भगत सिंह", "जवाहरलाल नेहरू"], correct: 0 },
        { q: "1914 से 1918 के बीच कौन-सा वैश्विक युद्ध हुआ था?", options: ["प्रथम विश्व युद्ध", "द्वितीय विश्व युद्ध", "फ्रांसीसी क्रांति", "शीत युद्ध"], correct: 0 },
        { q: "सिंधु नदी के तट पर खोजी गई प्राचीन सभ्यता कौन-सी है?", options: ["हड़प्पा सभ्यता", "मेसोपोटामिया सभ्यता", "मिस्र सभ्यता", "इंका सभ्यता"], correct: 0 },
        { q: "भारतीय संविधान की प्रारूप समिति के अध्यक्ष कौन थे?", options: ["डॉ. भीमराव आंबेडकर", "डॉ. राजेंद्र प्रसाद", "सरदार वल्लभभाई पटेल", "महात्मा गांधी"], correct: 0 },
      ],
      civics: [
        { q: "भारत में मतदान की न्यूनतम आयु कितनी निर्धारित है?", options: ["18 वर्ष", "21 वर्ष", "25 वर्ष", "16 वर्ष"], correct: 0 },
        { q: "कानून बनाने और उनमें संशोधन करने का कार्य सरकार का कौन-सा अंग करता है?", options: ["विधायिका", "कार्यपालिका", "न्यायपालिका", "संचार माध्यम"], correct: 0 },
        { q: "भारत में ग्रामीण स्तर पर स्थानीय स्वशासन की व्यवस्था कौन-सी है?", options: ["पंचायती राज", "नगर निगम", "विधान सभा", "ज़िला परिषद"], correct: 0 },
        { q: "भारतीय संविधान नागरिकों को कितने मौलिक अधिकार प्रदान करता है?", options: ["6", "7", "10", "5"], correct: 0 },
        { q: "भारत में सशस्त्र सेनाओं का सर्वोच्च सेनापति कौन होता है?", options: ["राष्ट्रपति", "प्रधानमंत्री", "प्रमुख रक्षा अध्यक्ष", "रक्षा मंत्री"], correct: 0 },
      ],
    },
  },
};

const TOPIC_ALIASES: Record<string, { subject: string; topic: string }> = {
  trigonometry: { subject: "mathematics", topic: "trigonometry" },
  trig: { subject: "mathematics", topic: "trigonometry" },
  sine: { subject: "mathematics", topic: "trigonometry" },
  त्रिकोणमिति: { subject: "mathematics", topic: "trigonometry" },
  geometry: { subject: "mathematics", topic: "geometry" },
  shapes: { subject: "mathematics", topic: "geometry" },
  angles: { subject: "mathematics", topic: "geometry" },
  ज्यामिति: { subject: "mathematics", topic: "geometry" },
  ratio: { subject: "mathematics", topic: "ratio" },
  proportion: { subject: "mathematics", topic: "ratio" },
  अनुपात: { subject: "mathematics", topic: "ratio" },
  समानुपात: { subject: "mathematics", topic: "ratio" },
  fraction: { subject: "mathematics", topic: "fraction" },
  fractions: { subject: "mathematics", topic: "fraction" },
  भिन्न: { subject: "mathematics", topic: "fraction" },
  photosynthesis: { subject: "science", topic: "photosynthesis" },
  "प्रकाश संश्लेषण": { subject: "science", topic: "photosynthesis" },
  watercycle: { subject: "science", topic: "watercycle" },
  "water cycle": { subject: "science", topic: "watercycle" },
  rain: { subject: "science", topic: "watercycle" },
  "जल चक्र": { subject: "science", topic: "watercycle" },
  maps: { subject: "socialscience", topic: "maps" },
  map: { subject: "socialscience", topic: "maps" },
  geography: { subject: "socialscience", topic: "maps" },
  मानचित्र: { subject: "socialscience", topic: "maps" },
  history: { subject: "socialscience", topic: "history" },
  freedom: { subject: "socialscience", topic: "history" },
  इतिहास: { subject: "socialscience", topic: "history" },
  civics: { subject: "socialscience", topic: "civics" },
  constitution: { subject: "socialscience", topic: "civics" },
  democracy: { subject: "socialscience", topic: "civics" },
  "नागरिक शास्त्र": { subject: "socialscience", topic: "civics" },
  संविधान: { subject: "socialscience", topic: "civics" },
};

function normalize(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

function matchTopic(topic: string) {
  const key = normalize(topic);
  if (!key) return null;
  const compact = key.replace(/[^a-z\u0900-\u097F]/g, "");
  for (const [alias, target] of Object.entries(TOPIC_ALIASES)) {
    const a = normalize(alias);
    const ac = a.replace(/[^a-z\u0900-\u097F]/g, "");
    if (key.includes(a) || compact.includes(ac)) return target;
  }
  return null;
}

/* ---------------- Universal fallback synthesis ---------------- */

type FallbackBucket = "mathematics" | "science" | "socialscience";

function bucketFor(subject: string): FallbackBucket {
  const s = normalize(subject);
  if (s.includes("math")) return "mathematics";
  if (s.includes("sci") && !s.includes("social")) return "science";
  if (s.includes("social") || s.includes("civic") || s.includes("histor")) return "socialscience";
  return "science";
}

function fallbackItems(topic: string, bucket: FallbackBucket, hindi: boolean): MatrixItem[] {
  const t = topic.trim();
  if (bucket === "mathematics") {
    return hindi
      ? [
          { q: `${t} को नियंत्रित करने वाला मूल संबंध हल कीजिए:`, options: ["परिभाषित सूत्र का सीधा अनुप्रयोग", "मानों का यादृच्छिक अनुमान", "इकाइयों की अदला-बदली", "पदों की मनमानी पुनरावृत्ति"], correct: 0 },
          { q: `${t} से जुड़ी गणनाओं में सबसे पहले कौन-सा चरण किया जाता है?`, options: ["ज्ञात राशियों की पहचान", "उत्तर को दोगुना करना", "दशमलव हटाना", "इकाई बदल देना"], correct: 0 },
          { q: `${t} की गणना में प्राप्त परिणाम किसके साथ लिखा जाना चाहिए?`, options: ["सही मात्रक के साथ", "बिना किसी मात्रक के", "केवल प्रतिशत में", "केवल भिन्न में"], correct: 0 },
          { q: `${t} पर आधारित प्रश्न में उत्तर की जाँच का सर्वोत्तम तरीका क्या है?`, options: ["प्रतिस्थापन द्वारा सत्यापन", "उत्तर को घटाना", "प्रश्न बदल देना", "अनुमान लगाना"], correct: 0 },
          { q: `${t} से संबंधित सूत्र में चर राशियाँ किसका प्रतिनिधित्व करती हैं?`, options: ["मापी जाने वाली मात्राएँ", "स्थिर अक्षर", "केवल शून्य", "केवल ऋणात्मक मान"], correct: 0 },
        ]
      : [
          { q: `Calculate or solve the primary relationship governing ${t}:`, options: ["Apply its defining formula directly", "Guess the values at random", "Swap the measurement units", "Repeat the terms arbitrarily"], correct: 0 },
          { q: `Which is the first correct step when solving a numerical problem on ${t}?`, options: ["Identify the known quantities", "Double the final answer", "Remove all decimals", "Change the unit system"], correct: 0 },
          { q: `A calculated result for ${t} must always be reported with:`, options: ["The correct unit of measurement", "No unit at all", "Only a percentage sign", "Only a fraction bar"], correct: 0 },
          { q: `What is the most reliable way to verify an answer involving ${t}?`, options: ["Substitute the result back into the relation", "Subtract ten from it", "Rewrite the question", "Estimate visually"], correct: 0 },
          { q: `In a formula describing ${t}, the variables represent:`, options: ["Measurable quantities", "Fixed letters only", "Zero values only", "Negative values only"], correct: 0 },
        ];
  }
  if (bucket === "science") {
    return hindi
      ? [
          { q: `निम्न में से कौन ${t} की जैविक, रासायनिक या भौतिक क्रियाविधि का वर्णन करता है?`, options: ["ऊर्जा एवं पदार्थ का क्रमबद्ध रूपांतरण", "बिना कारण होने वाला परिवर्तन", "केवल कल्पित घटना", "मापन से स्वतंत्र प्रक्रिया"], correct: 0 },
          { q: `${t} से जुड़ी प्रक्रिया का अध्ययन किस विधि से किया जाता है?`, options: ["नियंत्रित प्रयोग एवं प्रेक्षण", "केवल अनुमान", "कहानियों के आधार पर", "बिना आँकड़ों के"], correct: 0 },
          { q: `${t} में परिवर्तन की दर मुख्यतः किस पर निर्भर करती है?`, options: ["ताप, सांद्रता जैसी भौतिक दशाएँ", "प्रेक्षक का नाम", "दिन का सप्ताह", "प्रयोगशाला का रंग"], correct: 0 },
          { q: `${t} से संबंधित प्रयोग में मापन की शुद्धता किससे बढ़ती है?`, options: ["बार-बार दोहराए गए मापन", "एक ही जल्दबाज़ी में लिया पाठ्यांक", "उपकरण बदलते रहना", "अनुमानित मान लिखना"], correct: 0 },
          { q: `${t} की व्याख्या करने वाला वैज्ञानिक कथन कब स्वीकार्य होता है?`, options: ["जब प्रमाणों से पुष्टि हो", "जब वह लोकप्रिय हो", "जब वह छोटा हो", "जब वह पुराना हो"], correct: 0 },
        ]
      : [
          { q: `Which of the following describes the biological, chemical, or physical mechanism of ${t}?`, options: ["An ordered transformation of matter and energy", "A change occurring without any cause", "A purely imaginary event", "A process independent of measurement"], correct: 0 },
          { q: `How is a process such as ${t} best studied scientifically?`, options: ["Controlled experiments and observation", "Guesswork alone", "Storytelling accounts", "Ignoring recorded data"], correct: 0 },
          { q: `The rate of change observed in ${t} depends mainly on:`, options: ["Physical conditions such as temperature and concentration", "The observer's name", "The day of the week", "The colour of the laboratory"], correct: 0 },
          { q: `Measurement accuracy in an experiment on ${t} improves with:`, options: ["Repeated readings and averaging", "One hurried reading", "Constantly changing instruments", "Writing estimated values"], correct: 0 },
          { q: `A scientific statement explaining ${t} is accepted when it is:`, options: ["Supported by reproducible evidence", "Popular among students", "Short and simple", "Very old"], correct: 0 },
        ];
  }
  return hindi
    ? [
        { q: `${t} के पीछे के ऐतिहासिक संदर्भ, संरचनात्मक अवधारणा या सामाजिक व्यवस्था को पहचानिए:`, options: ["समय के साथ विकसित संस्थागत व्यवस्था", "बिना कारण घटी घटना", "केवल काल्पनिक कथा", "आँकड़ों से रहित धारणा"], correct: 0 },
        { q: `${t} का अध्ययन करते समय कौन-सा स्रोत सर्वाधिक विश्वसनीय माना जाता है?`, options: ["प्राथमिक अभिलेख एवं दस्तावेज़", "अफ़वाहें", "अपुष्ट सुनी-सुनाई बातें", "व्यक्तिगत पसंद"], correct: 0 },
        { q: `${t} से जुड़े निर्णय किस स्तर पर लागू होते हैं?`, options: ["शासन एवं समुदाय की संस्थाओं द्वारा", "केवल एक व्यक्ति द्वारा", "बिना किसी नियम के", "केवल विद्यालय में"], correct: 0 },
        { q: `${t} के सामाजिक प्रभाव को मापने का उपयुक्त तरीका क्या है?`, options: ["जनसंख्या एवं सर्वेक्षण आँकड़ों का विश्लेषण", "केवल राय", "अनुमान", "एक उदाहरण"], correct: 0 },
        { q: `${t} में समय-क्रम का महत्व क्यों है?`, options: ["कारण और परिणाम स्पष्ट होते हैं", "इससे केवल तिथियाँ याद रहती हैं", "इसका कोई महत्व नहीं", "यह केवल परीक्षा हेतु है"], correct: 0 },
      ]
    : [
        { q: `Identify the critical historical context, structural concept, or societal layout behind ${t}:`, options: ["An institutional arrangement developed over time", "An event with no cause", "A purely fictional tale", "A claim with no recorded evidence"], correct: 0 },
        { q: `Which source is considered most reliable when studying ${t}?`, options: ["Primary records and documents", "Rumours", "Unverified hearsay", "Personal preference"], correct: 0 },
        { q: `Decisions related to ${t} are implemented at the level of:`, options: ["Governing and community institutions", "One individual alone", "No rules at all", "Only a single school"], correct: 0 },
        { q: `The societal impact of ${t} is best measured by:`, options: ["Analysing census and survey data", "Opinion alone", "Rough guessing", "A single example"], correct: 0 },
        { q: `Why does chronological order matter when studying ${t}?`, options: ["It reveals cause and consequence", "It only helps memorise dates", "It has no importance", "It matters only in exams"], correct: 0 },
      ];
}

/* ---------------- Public API ---------------- */

export type SynthesizedQuestion = {
  prompt_en: string;
  prompt_hi: string;
  options_en: string[];
  options_hi: string[];
  answer: number;
};

function rotate<T>(arr: T[], by: number): T[] {
  if (arr.length === 0) return arr;
  const n = ((by % arr.length) + arr.length) % arr.length;
  return [...arr.slice(n), ...arr.slice(0, n)];
}

function pair(en: MatrixItem, hi: MatrixItem, shift: number): SynthesizedQuestion {
  // Shuffle option order deterministically per set so the answer isn't always A.
  const order = rotate([0, 1, 2, 3].slice(0, en.options.length), shift);
  return {
    prompt_en: en.q,
    prompt_hi: hi.q,
    options_en: order.map((i) => en.options[i]!),
    options_hi: order.map((i) => (hi.options[i] ?? en.options[i])!),
    answer: order.indexOf(en.correct),
  };
}

/** Matrix lookup + universal fallback synthesis. Always returns 5 items. */
export function synthesizeQuestions(args: {
  topic: string;
  subject: string;
  language: string;
  set?: number;
}): SynthesizedQuestion[] {
  const set = args.set ?? 0;
  const match = matchTopic(args.topic);
  let enItems: MatrixItem[];
  let hiItems: MatrixItem[];

  if (match) {
    enItems = ACADEMIC_MATRIX.english[match.subject]![match.topic]!;
    hiItems = ACADEMIC_MATRIX.hindi[match.subject]![match.topic]!;
  } else {
    const bucket = bucketFor(args.subject);
    const t = args.topic.trim() || args.subject;
    enItems = fallbackItems(t, bucket, false);
    hiItems = fallbackItems(t, bucket, true);
  }

  return enItems
    .slice(0, 5)
    .map((en, i) => pair(en, hiItems[i] ?? en, set + i + 1));
}

export function hasMatrixTopic(topic: string) {
  return matchTopic(topic) !== null;
}
