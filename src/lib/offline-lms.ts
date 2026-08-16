/**
 * OFFLINE_LMS_RESOURCES
 * Fully offline study material engine: 4 study summaries / teaching guides for every
 * Subject (Math, Science, Social Science) x Class (1-5) x Language (English, Hindi).
 * Each resource ships a 3-bullet core summary plus 4 hardcoded flashcards.
 * No network calls, no API dependencies.
 */

export type Flashcard = { front: string; back: string };

export type LmsResource = {
  id: string;
  title: string;
  subject: "Math" | "Science" | "Social Science";
  classLevel: string;
  language: "English" | "Hindi";
  topic: string;
  emoji: string;
  summary: string[];
  flashcards: Flashcard[];
};

export const LMS_SUBJECTS = ["Math", "Science", "Social Science"] as const;
export const LMS_CLASSES = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] as const;
export const LMS_LANGUAGES = ["English", "Hindi"] as const;

type BiPack = {
  topicEn: string;
  topicHi: string;
  titleEn: string;
  titleHi: string;
  emoji: string;
  summaryEn: string[];
  summaryHi: string[];
  cardsEn: Flashcard[];
  cardsHi: Flashcard[];
};

/* ------------------------------------------------------------------ */
/* Topic packs: 4 per subject per class band                           */
/* Band A = Class 1-2 (foundational), Band B = Class 3-5 (core)        */
/* ------------------------------------------------------------------ */

const MATH_A: BiPack[] = [
  {
    topicEn: "Counting & Number Sense", topicHi: "गिनती और संख्या ज्ञान",
    titleEn: "Counting & Number Sense", titleHi: "गिनती और संख्या ज्ञान", emoji: "🔢",
    summaryEn: [
      "Counting forward: every next number is exactly 1 more than the number before it.",
      "Place value: in 47 the digit 4 means 4 tens (40) and 7 means 7 ones.",
      "Comparing: the number with more tens is larger; if tens match, compare the ones.",
    ],
    summaryHi: [
      "आगे गिनना: हर अगली संख्या पिछली संख्या से ठीक 1 अधिक होती है।",
      "स्थानीय मान: 47 में अंक 4 का अर्थ 4 दहाई (40) और 7 का अर्थ 7 इकाई है।",
      "तुलना: जिसमें दहाई अधिक हो वह बड़ी संख्या है; दहाई बराबर हों तो इकाई देखें।",
    ],
    cardsEn: [
      { front: "What is the place value of 4 in 47?", back: "4 tens, that is 40." },
      { front: "Which number comes just after 29?", back: "30." },
      { front: "Which is larger, 63 or 36?", back: "63, because it has 6 tens against 3 tens." },
      { front: "How many ones make one ten?", back: "10 ones make 1 ten." },
    ],
    cardsHi: [
      { front: "47 में 4 का स्थानीय मान क्या है?", back: "4 दहाई, अर्थात् 40।" },
      { front: "29 के ठीक बाद कौन-सी संख्या आती है?", back: "30।" },
      { front: "63 और 36 में बड़ी संख्या कौन-सी है?", back: "63, क्योंकि इसमें 6 दहाई हैं जबकि दूसरी में 3 दहाई।" },
      { front: "एक दहाई में कितनी इकाई होती हैं?", back: "10 इकाई से 1 दहाई बनती है।" },
    ],
  },
  {
    topicEn: "Addition & Subtraction", topicHi: "जोड़ और घटाव",
    titleEn: "Addition & Subtraction", titleHi: "जोड़ और घटाव", emoji: "➕",
    summaryEn: [
      "Addition joins groups: 8 + 5 = 13, and the order can be swapped without changing the sum.",
      "Subtraction finds the difference or what is left: 13 − 5 = 8.",
      "Carrying: when the ones column crosses 9, move one ten into the tens column.",
    ],
    summaryHi: [
      "जोड़ समूहों को मिलाता है: 8 + 5 = 13, और क्रम बदलने पर योग नहीं बदलता।",
      "घटाव अंतर या शेष बताता है: 13 − 5 = 8।",
      "हासिल: जब इकाई का योग 9 से आगे बढ़े तो एक दहाई दहाई के स्तंभ में ले जाएँ।",
    ],
    cardsEn: [
      { front: "What is 8 + 5?", back: "13." },
      { front: "What is 13 − 5?", back: "8." },
      { front: "Does 7 + 9 equal 9 + 7?", back: "Yes, both equal 16; addition order does not matter." },
      { front: "What do we carry when the ones add up to 16?", back: "Write 6 in ones and carry 1 ten." },
    ],
    cardsHi: [
      { front: "8 + 5 कितना होता है?", back: "13।" },
      { front: "13 − 5 कितना होता है?", back: "8।" },
      { front: "क्या 7 + 9 और 9 + 7 बराबर हैं?", back: "हाँ, दोनों 16 हैं; जोड़ में क्रम से अंतर नहीं पड़ता।" },
      { front: "इकाई का योग 16 आने पर क्या करें?", back: "इकाई में 6 लिखें और 1 दहाई हासिल ले जाएँ।" },
    ],
  },
  {
    topicEn: "Shapes & Patterns", topicHi: "आकृतियाँ और पैटर्न",
    titleEn: "Shapes & Patterns", titleHi: "आकृतियाँ और पैटर्न", emoji: "🔺",
    summaryEn: [
      "A triangle has 3 sides, a square has 4 equal sides, a rectangle has 4 sides with opposite sides equal.",
      "A circle has no straight sides and no corners.",
      "A pattern repeats by a fixed rule, such as 2, 4, 6, 8 growing by 2 each time.",
    ],
    summaryHi: [
      "त्रिभुज में 3 भुजाएँ, वर्ग में 4 बराबर भुजाएँ और आयत में 4 भुजाएँ होती हैं जिनकी सामने की भुजाएँ बराबर होती हैं।",
      "वृत्त में कोई सीधी भुजा या कोना नहीं होता।",
      "पैटर्न एक निश्चित नियम से दोहराता है, जैसे 2, 4, 6, 8 जो हर बार 2 बढ़ता है।",
    ],
    cardsEn: [
      { front: "How many sides does a triangle have?", back: "3 sides." },
      { front: "How many corners does a square have?", back: "4 corners." },
      { front: "Which shape has no corners?", back: "The circle." },
      { front: "What comes next: 2, 4, 6, 8, __?", back: "10, the pattern grows by 2." },
    ],
    cardsHi: [
      { front: "त्रिभुज में कितनी भुजाएँ होती हैं?", back: "3 भुजाएँ।" },
      { front: "वर्ग में कितने कोने होते हैं?", back: "4 कोने।" },
      { front: "किस आकृति में कोई कोना नहीं होता?", back: "वृत्त।" },
      { front: "आगे क्या आएगा: 2, 4, 6, 8, __?", back: "10, पैटर्न हर बार 2 बढ़ता है।" },
    ],
  },
  {
    topicEn: "Measurement & Money", topicHi: "मापन और मुद्रा",
    titleEn: "Measurement & Money", titleHi: "मापन और मुद्रा", emoji: "📏",
    summaryEn: [
      "Length is measured in centimetres and metres: 100 cm make 1 metre.",
      "Mass uses grams and kilograms: 1000 g make 1 kilogram.",
      "Indian money: 100 paise make ₹1, and ₹50 + ₹30 = ₹80.",
    ],
    summaryHi: [
      "लंबाई सेंटीमीटर और मीटर में मापी जाती है: 100 सेमी से 1 मीटर बनता है।",
      "भार ग्राम और किलोग्राम में होता है: 1000 ग्राम से 1 किलोग्राम बनता है।",
      "भारतीय मुद्रा: 100 पैसे से ₹1 बनता है, और ₹50 + ₹30 = ₹80।",
    ],
    cardsEn: [
      { front: "How many centimetres make one metre?", back: "100 centimetres." },
      { front: "How many grams make one kilogram?", back: "1000 grams." },
      { front: "What is ₹50 + ₹30?", back: "₹80." },
      { front: "How many paise make one rupee?", back: "100 paise." },
    ],
    cardsHi: [
      { front: "एक मीटर में कितने सेंटीमीटर होते हैं?", back: "100 सेंटीमीटर।" },
      { front: "एक किलोग्राम में कितने ग्राम होते हैं?", back: "1000 ग्राम।" },
      { front: "₹50 + ₹30 कितना होगा?", back: "₹80।" },
      { front: "एक रुपये में कितने पैसे होते हैं?", back: "100 पैसे।" },
    ],
  },
];

const MATH_B: BiPack[] = [
  {
    topicEn: "Ratio & Proportion", topicHi: "अनुपात और समानुपात",
    titleEn: "Ratio & Proportion", titleHi: "अनुपात और समानुपात", emoji: "⚖️",
    summaryEn: [
      "A ratio compares two quantities of the same kind, written as 3 : 4 or 3/4.",
      "Equivalent ratios are obtained by multiplying or dividing both terms by the same number: 3 : 4 = 6 : 8.",
      "In a proportion the cross products are equal: if 2 : 5 = 6 : 15 then 2 × 15 = 5 × 6.",
    ],
    summaryHi: [
      "अनुपात एक ही प्रकार की दो राशियों की तुलना करता है, जिसे 3 : 4 या 3/4 लिखते हैं।",
      "दोनों पदों को एक ही संख्या से गुणा या भाग करने पर तुल्य अनुपात मिलते हैं: 3 : 4 = 6 : 8।",
      "समानुपात में वज्र गुणनफल बराबर होते हैं: यदि 2 : 5 = 6 : 15 तो 2 × 15 = 5 × 6।",
    ],
    cardsEn: [
      { front: "What is a ratio?", back: "A mathematical comparison of two numbers showing their relative size." },
      { front: "Simplify the ratio 12 : 18.", back: "2 : 3, after dividing both terms by 6." },
      { front: "If 2 : 5 = x : 15, what is x?", back: "x = 6, because 2 × 15 ÷ 5 = 6." },
      { front: "Share ₹100 in the ratio 3 : 2.", back: "₹60 and ₹40, since the 5 parts are ₹20 each." },
    ],
    cardsHi: [
      { front: "अनुपात क्या होता है?", back: "दो संख्याओं की गणितीय तुलना जो उनका सापेक्ष आकार बताती है।" },
      { front: "अनुपात 12 : 18 को सरल कीजिए।", back: "2 : 3, दोनों पदों को 6 से भाग देने पर।" },
      { front: "यदि 2 : 5 = x : 15 है तो x क्या है?", back: "x = 6, क्योंकि 2 × 15 ÷ 5 = 6।" },
      { front: "₹100 को 3 : 2 के अनुपात में बाँटिए।", back: "₹60 और ₹40, क्योंकि 5 भागों में हर भाग ₹20 का है।" },
    ],
  },
  {
    topicEn: "Fractions", topicHi: "भिन्न",
    titleEn: "Fractions", titleHi: "भिन्न", emoji: "🍕",
    summaryEn: [
      "A fraction has a numerator (parts taken) over a denominator (equal parts in the whole).",
      "Like fractions share a denominator and can be added directly: 1/5 + 2/5 = 3/5.",
      "Equivalent fractions name the same value: 1/2 = 2/4 = 5/10.",
    ],
    summaryHi: [
      "भिन्न में अंश (लिए गए भाग) ऊपर और हर (पूर्ण के बराबर भाग) नीचे होता है।",
      "समान हर वाली भिन्नों को सीधे जोड़ा जा सकता है: 1/5 + 2/5 = 3/5।",
      "तुल्य भिन्न एक ही मान बताती हैं: 1/2 = 2/4 = 5/10।",
    ],
    cardsEn: [
      { front: "In 3/8, what does 8 represent?", back: "The denominator: the whole is divided into 8 equal parts." },
      { front: "What is 1/5 + 2/5?", back: "3/5." },
      { front: "Which fraction equals 1/2?", back: "2/4, and also 5/10." },
      { front: "Which is greater, 3/4 or 2/3?", back: "3/4, because 9/12 is greater than 8/12." },
    ],
    cardsHi: [
      { front: "3/8 में 8 क्या दर्शाता है?", back: "हर: पूर्ण को 8 बराबर भागों में बाँटा गया है।" },
      { front: "1/5 + 2/5 कितना होता है?", back: "3/5।" },
      { front: "कौन-सी भिन्न 1/2 के बराबर है?", back: "2/4, और 5/10 भी।" },
      { front: "3/4 और 2/3 में बड़ी कौन-सी है?", back: "3/4, क्योंकि 9/12 > 8/12।" },
    ],
  },
  {
    topicEn: "Area & Perimeter", topicHi: "क्षेत्रफल और परिमाप",
    titleEn: "Area & Perimeter", titleHi: "क्षेत्रफल और परिमाप", emoji: "📐",
    summaryEn: [
      "Perimeter is the total boundary length: for a rectangle it is 2 × (length + breadth).",
      "Area is the surface covered: for a rectangle it is length × breadth, measured in square units.",
      "A square of side 6 cm has perimeter 24 cm and area 36 sq cm.",
    ],
    summaryHi: [
      "परिमाप सीमा की कुल लंबाई है: आयत के लिए यह 2 × (लंबाई + चौड़ाई) होता है।",
      "क्षेत्रफल ढका गया पृष्ठ है: आयत के लिए यह लंबाई × चौड़ाई होता है और वर्ग इकाई में मापा जाता है।",
      "6 सेमी भुजा वाले वर्ग का परिमाप 24 सेमी और क्षेत्रफल 36 वर्ग सेमी होता है।",
    ],
    cardsEn: [
      { front: "What is the area of a rectangle 8 cm by 5 cm?", back: "40 square centimetres." },
      { front: "What is the perimeter of a square of side 6 cm?", back: "24 centimetres." },
      { front: "Which formula gives the perimeter of a rectangle?", back: "2 × (length + breadth)." },
      { front: "In which units is area measured?", back: "Square units, such as square centimetres." },
    ],
    cardsHi: [
      { front: "8 सेमी × 5 सेमी वाले आयत का क्षेत्रफल क्या है?", back: "40 वर्ग सेंटीमीटर।" },
      { front: "6 सेमी भुजा वाले वर्ग का परिमाप क्या है?", back: "24 सेंटीमीटर।" },
      { front: "आयत का परिमाप किस सूत्र से निकलता है?", back: "2 × (लंबाई + चौड़ाई)।" },
      { front: "क्षेत्रफल किन इकाइयों में मापा जाता है?", back: "वर्ग इकाइयों में, जैसे वर्ग सेंटीमीटर।" },
    ],
  },
  {
    topicEn: "Multiplication & Division", topicHi: "गुणा और भाग",
    titleEn: "Multiplication & Division", titleHi: "गुणा और भाग", emoji: "✖️",
    summaryEn: [
      "Multiplication is repeated addition: 6 × 4 means four groups of six, giving 24.",
      "Division splits into equal groups: 24 ÷ 4 = 6, and any number divided by 1 stays the same.",
      "A remainder is what is left over: 25 ÷ 4 gives 6 with remainder 1.",
    ],
    summaryHi: [
      "गुणा बार-बार जोड़ना है: 6 × 4 का अर्थ है छह के चार समूह, अर्थात् 24।",
      "भाग बराबर समूहों में बाँटता है: 24 ÷ 4 = 6, और किसी संख्या को 1 से भाग देने पर वही रहती है।",
      "शेषफल वह है जो बच जाता है: 25 ÷ 4 में भागफल 6 और शेषफल 1 होता है।",
    ],
    cardsEn: [
      { front: "What is 6 × 4?", back: "24." },
      { front: "What is 24 ÷ 4?", back: "6." },
      { front: "What is the remainder when 25 is divided by 4?", back: "1, with quotient 6." },
      { front: "What is 9 × 0?", back: "0, any number multiplied by zero is zero." },
    ],
    cardsHi: [
      { front: "6 × 4 कितना होता है?", back: "24।" },
      { front: "24 ÷ 4 कितना होता है?", back: "6।" },
      { front: "25 को 4 से भाग देने पर शेषफल क्या है?", back: "1, और भागफल 6।" },
      { front: "9 × 0 कितना होता है?", back: "0, किसी भी संख्या को शून्य से गुणा करने पर शून्य आता है।" },
    ],
  },
];

const SCI_A: BiPack[] = [
  {
    topicEn: "Parts of a Plant", topicHi: "पौधे के भाग",
    titleEn: "Parts of a Plant", titleHi: "पौधे के भाग", emoji: "🌱",
    summaryEn: [
      "Roots hold the plant in the soil and absorb water and minerals.",
      "The stem carries water upward and holds leaves, flowers and fruits.",
      "Leaves make food for the plant using sunlight, and flowers grow into fruits with seeds.",
    ],
    summaryHi: [
      "जड़ें पौधे को मिट्टी में जमाए रखती हैं और जल तथा खनिज सोखती हैं।",
      "तना जल को ऊपर पहुँचाता है तथा पत्तियों, फूलों और फलों को थामे रखता है।",
      "पत्तियाँ सूर्य के प्रकाश से पौधे का भोजन बनाती हैं, और फूल से बीज वाले फल बनते हैं।",
    ],
    cardsEn: [
      { front: "Which part of the plant absorbs water?", back: "The root." },
      { front: "Where does a plant make its food?", back: "In the leaves." },
      { front: "Which part carries water from root to leaves?", back: "The stem." },
      { front: "Which part of the plant grows into a fruit?", back: "The flower." },
    ],
    cardsHi: [
      { front: "पौधे का कौन-सा भाग जल सोखता है?", back: "जड़।" },
      { front: "पौधा अपना भोजन कहाँ बनाता है?", back: "पत्तियों में।" },
      { front: "जड़ से पत्तियों तक जल कौन पहुँचाता है?", back: "तना।" },
      { front: "पौधे का कौन-सा भाग फल बनता है?", back: "फूल।" },
    ],
  },
  {
    topicEn: "Our Sense Organs", topicHi: "हमारे ज्ञानेंद्रियाँ",
    titleEn: "Our Sense Organs", titleHi: "हमारी ज्ञानेंद्रियाँ", emoji: "👁️",
    summaryEn: [
      "We have five sense organs: eyes, ears, nose, tongue and skin.",
      "The tongue detects taste and the skin senses touch, heat and pain.",
      "Sense organs send signals to the brain, which decides how the body responds.",
    ],
    summaryHi: [
      "हमारी पाँच ज्ञानेंद्रियाँ हैं: आँख, कान, नाक, जीभ और त्वचा।",
      "जीभ स्वाद पहचानती है और त्वचा स्पर्श, गर्मी तथा दर्द का अनुभव कराती है।",
      "ज्ञानेंद्रियाँ मस्तिष्क को संकेत भेजती हैं, जो शरीर की प्रतिक्रिया तय करता है।",
    ],
    cardsEn: [
      { front: "How many sense organs do we have?", back: "Five." },
      { front: "Which organ helps us taste food?", back: "The tongue." },
      { front: "Which organ senses touch?", back: "The skin." },
      { front: "Where do sense organs send their signals?", back: "To the brain." },
    ],
    cardsHi: [
      { front: "हमारी कितनी ज्ञानेंद्रियाँ होती हैं?", back: "पाँच।" },
      { front: "भोजन का स्वाद कौन-सा अंग बताता है?", back: "जीभ।" },
      { front: "स्पर्श का अनुभव कौन-सा अंग कराता है?", back: "त्वचा।" },
      { front: "ज्ञानेंद्रियाँ अपने संकेत कहाँ भेजती हैं?", back: "मस्तिष्क को।" },
    ],
  },
  {
    topicEn: "Water Cycle", topicHi: "जल चक्र",
    titleEn: "Water Cycle", titleHi: "जल चक्र", emoji: "💧",
    summaryEn: [
      "Evaporation: liquid water turning to vapour via heat from the Sun.",
      "Condensation: vapour cooling high in the sky to form cloud droplets.",
      "Precipitation: water falling back to the earth as rain, hail or snow.",
    ],
    summaryHi: [
      "वाष्पीकरण: सूर्य की गर्मी से द्रव जल का वाष्प में बदलना।",
      "संघनन: ऊँचाई पर वाष्प का ठंडा होकर बादल की बूँदें बनाना।",
      "वर्षण: जल का वर्षा, ओले या हिम के रूप में धरती पर लौटना।",
    ],
    cardsEn: [
      { front: "What is evaporation?", back: "Liquid water turning into vapour because of heat." },
      { front: "What forms when water vapour cools in the sky?", back: "Cloud droplets, through condensation." },
      { front: "What is precipitation?", back: "Water falling back to the ground as rain, hail or snow." },
      { front: "Which energy source drives the water cycle?", back: "Heat energy from the Sun." },
    ],
    cardsHi: [
      { front: "वाष्पीकरण क्या है?", back: "गर्मी के कारण द्रव जल का वाष्प में बदलना।" },
      { front: "आकाश में जलवाष्प ठंडी होने पर क्या बनता है?", back: "बादल की बूँदें, संघनन द्वारा।" },
      { front: "वर्षण किसे कहते हैं?", back: "जल का वर्षा, ओले या हिम के रूप में धरती पर गिरना।" },
      { front: "जल चक्र किस ऊर्जा से चलता है?", back: "सूर्य की ऊष्मा ऊर्जा से।" },
    ],
  },
  {
    topicEn: "Animals & Their Homes", topicHi: "जानवर और उनके घर",
    titleEn: "Animals & Their Homes", titleHi: "जानवर और उनके घर", emoji: "🐾",
    summaryEn: [
      "Animals live in shelters that protect them: birds in nests, bees in hives, rabbits in burrows.",
      "Herbivores eat plants, carnivores eat other animals, and omnivores eat both.",
      "Fish breathe through gills in water while land animals breathe with lungs.",
    ],
    summaryHi: [
      "जानवर अपने आश्रयों में रहते हैं: पक्षी घोंसले में, मधुमक्खी छत्ते में, खरगोश बिल में।",
      "शाकाहारी पौधे खाते हैं, मांसाहारी दूसरे जानवरों को खाते हैं और सर्वाहारी दोनों खाते हैं।",
      "मछलियाँ जल में गलफड़ों से साँस लेती हैं जबकि थलचर फेफड़ों से साँस लेते हैं।",
    ],
    cardsEn: [
      { front: "Where do bees live?", back: "In a hive." },
      { front: "What do we call animals that eat only plants?", back: "Herbivores." },
      { front: "How do fish breathe under water?", back: "Through gills." },
      { front: "What is the home of a rabbit called?", back: "A burrow." },
    ],
    cardsHi: [
      { front: "मधुमक्खियाँ कहाँ रहती हैं?", back: "छत्ते में।" },
      { front: "केवल पौधे खाने वाले जानवर क्या कहलाते हैं?", back: "शाकाहारी।" },
      { front: "मछलियाँ पानी में कैसे साँस लेती हैं?", back: "गलफड़ों से।" },
      { front: "खरगोश के घर को क्या कहते हैं?", back: "बिल।" },
    ],
  },
];

const SCI_B: BiPack[] = [
  {
    topicEn: "Photosynthesis", topicHi: "प्रकाश संश्लेषण",
    titleEn: "Photosynthesis", titleHi: "प्रकाश संश्लेषण", emoji: "🍃",
    summaryEn: [
      "Green leaves use sunlight, carbon dioxide and water to prepare glucose food.",
      "Chlorophyll is the green pigment that traps sunlight for the reaction.",
      "Oxygen is released as a by-product, which is why plants keep the air fresh.",
    ],
    summaryHi: [
      "हरी पत्तियाँ सूर्य के प्रकाश, कार्बन डाइऑक्साइड और जल से ग्लूकोज भोजन बनाती हैं।",
      "क्लोरोफिल वह हरा वर्णक है जो सूर्य का प्रकाश ग्रहण करता है।",
      "उपोत्पाद के रूप में ऑक्सीजन निकलती है, इसीलिए पौधे वायु को शुद्ध रखते हैं।",
    ],
    cardsEn: [
      { front: "What gas do plants absorb?", back: "Carbon Dioxide (CO2)." },
      { front: "Which pigment traps sunlight in leaves?", back: "Chlorophyll." },
      { front: "Which gas is released during photosynthesis?", back: "Oxygen." },
      { front: "What food is made during photosynthesis?", back: "Glucose, a simple sugar." },
    ],
    cardsHi: [
      { front: "पौधे कौन-सी गैस ग्रहण करते हैं?", back: "कार्बन डाइऑक्साइड (CO2)।" },
      { front: "पत्तियों में सूर्य का प्रकाश कौन-सा वर्णक ग्रहण करता है?", back: "क्लोरोफिल।" },
      { front: "प्रकाश संश्लेषण में कौन-सी गैस निकलती है?", back: "ऑक्सीजन।" },
      { front: "प्रकाश संश्लेषण में कौन-सा भोजन बनता है?", back: "ग्लूकोज, एक सरल शर्करा।" },
    ],
  },
  {
    topicEn: "Human Body Systems", topicHi: "मानव शरीर तंत्र",
    titleEn: "Human Body Systems", titleHi: "मानव शरीर तंत्र", emoji: "🫀",
    summaryEn: [
      "The heart pumps blood through the body and an adult heart beats about 72 times a minute.",
      "Lungs take in oxygen and push out carbon dioxide during breathing.",
      "The skeleton of an adult human has 206 bones and protects organs like the brain and heart.",
    ],
    summaryHi: [
      "हृदय पूरे शरीर में रक्त पंप करता है और वयस्क हृदय लगभग 72 बार प्रति मिनट धड़कता है।",
      "फेफड़े साँस लेते समय ऑक्सीजन लेते हैं और कार्बन डाइऑक्साइड बाहर निकालते हैं।",
      "वयस्क मानव कंकाल में 206 हड्डियाँ होती हैं जो मस्तिष्क और हृदय जैसे अंगों की रक्षा करती हैं।",
    ],
    cardsEn: [
      { front: "How many bones are there in an adult human body?", back: "206 bones." },
      { front: "Which organ pumps blood?", back: "The heart." },
      { front: "Which gas do the lungs remove from the body?", back: "Carbon dioxide." },
      { front: "Which bone structure protects the brain?", back: "The skull." },
    ],
    cardsHi: [
      { front: "वयस्क मानव शरीर में कितनी हड्डियाँ होती हैं?", back: "206 हड्डियाँ।" },
      { front: "रक्त पंप करने वाला अंग कौन-सा है?", back: "हृदय।" },
      { front: "फेफड़े शरीर से कौन-सी गैस बाहर निकालते हैं?", back: "कार्बन डाइऑक्साइड।" },
      { front: "मस्तिष्क की रक्षा कौन-सी अस्थि संरचना करती है?", back: "खोपड़ी।" },
    ],
  },
  {
    topicEn: "Solar System", topicHi: "सौर मंडल",
    titleEn: "Solar System", titleHi: "सौर मंडल", emoji: "🪐",
    summaryEn: [
      "Eight planets revolve around the Sun; Mercury is nearest and Neptune is farthest.",
      "Jupiter is the largest planet and Earth is the only one known to support life.",
      "The Moon is Earth's natural satellite and its light is reflected sunlight.",
    ],
    summaryHi: [
      "सूर्य के चारों ओर आठ ग्रह परिक्रमा करते हैं; बुध सबसे निकट और वरुण सबसे दूर है।",
      "बृहस्पति सबसे बड़ा ग्रह है और पृथ्वी ही एकमात्र ज्ञात ग्रह है जहाँ जीवन है।",
      "चंद्रमा पृथ्वी का प्राकृतिक उपग्रह है और उसका प्रकाश परावर्तित सूर्य प्रकाश है।",
    ],
    cardsEn: [
      { front: "Which is the largest planet in the solar system?", back: "Jupiter." },
      { front: "Which planet is closest to the Sun?", back: "Mercury." },
      { front: "How many planets revolve around the Sun?", back: "Eight." },
      { front: "What is the Moon to the Earth?", back: "Its natural satellite." },
    ],
    cardsHi: [
      { front: "सौर मंडल का सबसे बड़ा ग्रह कौन-सा है?", back: "बृहस्पति।" },
      { front: "सूर्य के सबसे निकट कौन-सा ग्रह है?", back: "बुध।" },
      { front: "सूर्य की परिक्रमा कितने ग्रह करते हैं?", back: "आठ।" },
      { front: "चंद्रमा पृथ्वी का क्या है?", back: "उसका प्राकृतिक उपग्रह।" },
    ],
  },
  {
    topicEn: "States of Matter", topicHi: "पदार्थ की अवस्थाएँ",
    titleEn: "States of Matter", titleHi: "पदार्थ की अवस्थाएँ", emoji: "🧊",
    summaryEn: [
      "Matter exists as solid, liquid and gas; solids have a fixed shape and volume.",
      "Water boils at 100 °C and freezes at 0 °C at normal atmospheric pressure.",
      "Melting turns solid to liquid, while evaporation turns liquid to gas.",
    ],
    summaryHi: [
      "पदार्थ ठोस, द्रव और गैस के रूप में होता है; ठोस का आकार और आयतन निश्चित होता है।",
      "सामान्य वायुदाब पर जल 100 °C पर उबलता है और 0 °C पर जमता है।",
      "गलन ठोस को द्रव बनाता है, जबकि वाष्पीकरण द्रव को गैस बनाता है।",
    ],
    cardsEn: [
      { front: "At what temperature does water boil?", back: "100 degrees Celsius." },
      { front: "At what temperature does water freeze?", back: "0 degrees Celsius." },
      { front: "Which state of matter has a fixed shape and volume?", back: "Solid." },
      { front: "What is the change from solid to liquid called?", back: "Melting." },
    ],
    cardsHi: [
      { front: "जल किस तापमान पर उबलता है?", back: "100 डिग्री सेल्सियस।" },
      { front: "जल किस तापमान पर जमता है?", back: "0 डिग्री सेल्सियस।" },
      { front: "किस अवस्था का आकार और आयतन निश्चित होता है?", back: "ठोस।" },
      { front: "ठोस से द्रव बनने की क्रिया क्या कहलाती है?", back: "गलन।" },
    ],
  },
];

const SOC_A: BiPack[] = [
  {
    topicEn: "My Family & Neighbourhood", topicHi: "मेरा परिवार और पड़ोस",
    titleEn: "My Family & Neighbourhood", titleHi: "मेरा परिवार और पड़ोस", emoji: "🏘️",
    summaryEn: [
      "A nuclear family has parents and children; a joint family also includes grandparents and relatives.",
      "Community helpers such as doctors, teachers, farmers and postmen serve the neighbourhood.",
      "Rules like keeping the street clean and helping neighbours keep a community healthy.",
    ],
    summaryHi: [
      "एकल परिवार में माता-पिता और बच्चे होते हैं; संयुक्त परिवार में दादा-दादी और अन्य संबंधी भी होते हैं।",
      "डॉक्टर, शिक्षक, किसान और डाकिया जैसे समाजसेवी पड़ोस की सेवा करते हैं।",
      "गली साफ रखना और पड़ोसियों की मदद करना जैसे नियम समुदाय को स्वस्थ रखते हैं।",
    ],
    cardsEn: [
      { front: "Who delivers letters to our homes?", back: "The postman." },
      { front: "What is a family with parents and children called?", back: "A nuclear family." },
      { front: "Who grows the food we eat?", back: "The farmer." },
      { front: "Which family type includes grandparents living together?", back: "A joint family." },
    ],
    cardsHi: [
      { front: "हमारे घरों तक पत्र कौन पहुँचाता है?", back: "डाकिया।" },
      { front: "माता-पिता और बच्चों वाले परिवार को क्या कहते हैं?", back: "एकल परिवार।" },
      { front: "हमारा अनाज कौन उगाता है?", back: "किसान।" },
      { front: "किस परिवार में दादा-दादी भी साथ रहते हैं?", back: "संयुक्त परिवार।" },
    ],
  },
  {
    topicEn: "Our National Symbols", topicHi: "हमारे राष्ट्रीय प्रतीक",
    titleEn: "Our National Symbols", titleHi: "हमारे राष्ट्रीय प्रतीक", emoji: "🇮🇳",
    summaryEn: [
      "The national flag has saffron, white and green bands with the Ashoka Chakra of 24 spokes.",
      "The national animal is the tiger and the national bird is the peacock.",
      "'Jana Gana Mana' is the national anthem, written by Rabindranath Tagore.",
    ],
    summaryHi: [
      "राष्ट्रीय ध्वज में केसरिया, सफेद और हरी पट्टियाँ तथा 24 तीलियों वाला अशोक चक्र होता है।",
      "राष्ट्रीय पशु बाघ है और राष्ट्रीय पक्षी मोर है।",
      "'जन गण मन' राष्ट्रगान है, जिसे रवींद्रनाथ टैगोर ने लिखा था।",
    ],
    cardsEn: [
      { front: "How many spokes does the Ashoka Chakra have?", back: "24 spokes." },
      { front: "Which is the national bird of India?", back: "The peacock." },
      { front: "Who wrote the national anthem of India?", back: "Rabindranath Tagore." },
      { front: "Which is the national animal of India?", back: "The tiger." },
    ],
    cardsHi: [
      { front: "अशोक चक्र में कितनी तीलियाँ होती हैं?", back: "24 तीलियाँ।" },
      { front: "भारत का राष्ट्रीय पक्षी कौन-सा है?", back: "मोर।" },
      { front: "भारत का राष्ट्रगान किसने लिखा था?", back: "रवींद्रनाथ टैगोर।" },
      { front: "भारत का राष्ट्रीय पशु कौन-सा है?", back: "बाघ।" },
    ],
  },
  {
    topicEn: "Festivals of India", topicHi: "भारत के त्योहार",
    titleEn: "Festivals of India", titleHi: "भारत के त्योहार", emoji: "🪔",
    summaryEn: [
      "Diwali is the festival of lights celebrated with lamps, rangoli and sweets.",
      "Holi is the festival of colours marking the arrival of spring.",
      "Independence Day is observed on 15 August and Republic Day on 26 January.",
    ],
    summaryHi: [
      "दीवाली प्रकाश का पर्व है जिसे दीपक, रंगोली और मिठाइयों के साथ मनाया जाता है।",
      "होली रंगों का त्योहार है जो वसंत के आगमन का प्रतीक है।",
      "स्वतंत्रता दिवस 15 अगस्त को और गणतंत्र दिवस 26 जनवरी को मनाया जाता है।",
    ],
    cardsEn: [
      { front: "Which festival is called the festival of lights?", back: "Diwali." },
      { front: "On which date is Independence Day celebrated?", back: "15 August." },
      { front: "Which festival is celebrated with colours?", back: "Holi." },
      { front: "On which date is Republic Day celebrated?", back: "26 January." },
    ],
    cardsHi: [
      { front: "कौन-सा त्योहार प्रकाश का पर्व कहलाता है?", back: "दीवाली।" },
      { front: "स्वतंत्रता दिवस किस तारीख को मनाया जाता है?", back: "15 अगस्त।" },
      { front: "रंगों से कौन-सा त्योहार मनाया जाता है?", back: "होली।" },
      { front: "गणतंत्र दिवस किस तारीख को मनाया जाता है?", back: "26 जनवरी।" },
    ],
  },
  {
    topicEn: "Directions & Maps", topicHi: "दिशाएँ और मानचित्र",
    titleEn: "Directions & Maps", titleHi: "दिशाएँ और मानचित्र", emoji: "🧭",
    summaryEn: [
      "The four cardinal directions are north, south, east and west.",
      "The Sun rises in the east and sets in the west.",
      "A map uses symbols and a scale to show places in a small drawing.",
    ],
    summaryHi: [
      "चार प्रमुख दिशाएँ हैं: उत्तर, दक्षिण, पूर्व और पश्चिम।",
      "सूर्य पूर्व में उगता है और पश्चिम में अस्त होता है।",
      "मानचित्र प्रतीकों और मापनी की सहायता से स्थानों को छोटे चित्र में दिखाता है।",
    ],
    cardsEn: [
      { front: "In which direction does the Sun rise?", back: "In the east." },
      { front: "How many cardinal directions are there?", back: "Four." },
      { front: "Which direction is opposite to north?", back: "South." },
      { front: "What does a map scale show?", back: "How real distance is reduced on the map." },
    ],
    cardsHi: [
      { front: "सूर्य किस दिशा में उगता है?", back: "पूर्व दिशा में।" },
      { front: "प्रमुख दिशाएँ कितनी होती हैं?", back: "चार।" },
      { front: "उत्तर के विपरीत कौन-सी दिशा है?", back: "दक्षिण।" },
      { front: "मानचित्र की मापनी क्या दर्शाती है?", back: "वास्तविक दूरी मानचित्र पर कितनी घटाई गई है।" },
    ],
  },
];

const SOC_B: BiPack[] = [
  {
    topicEn: "Democracy & Civics", topicHi: "लोकतंत्र और नागरिक शास्त्र",
    titleEn: "Democracy & Civics", titleHi: "लोकतंत्र और नागरिक शास्त्र", emoji: "🗳️",
    summaryEn: [
      "Democracy is a system where citizens elect their representatives by voting.",
      "The Constitution of India came into force on 26 January 1950 and guarantees fundamental rights.",
      "Every Indian citizen aged 18 years and above can vote in elections.",
    ],
    summaryHi: [
      "लोकतंत्र वह व्यवस्था है जिसमें नागरिक मतदान द्वारा अपने प्रतिनिधि चुनते हैं।",
      "भारत का संविधान 26 जनवरी 1950 को लागू हुआ और यह मौलिक अधिकारों की गारंटी देता है।",
      "18 वर्ष या उससे अधिक आयु का प्रत्येक भारतीय नागरिक चुनाव में मतदान कर सकता है।",
    ],
    cardsEn: [
      { front: "What is the minimum voting age in India?", back: "18 Years." },
      { front: "When did the Constitution of India come into force?", back: "26 January 1950." },
      { front: "What is democracy?", back: "A system of government in which citizens elect their representatives by voting." },
      { front: "Who is the head of the Indian government?", back: "The Prime Minister." },
    ],
    cardsHi: [
      { front: "भारत में मतदान की न्यूनतम आयु क्या है?", back: "18 वर्ष।" },
      { front: "भारत का संविधान कब लागू हुआ?", back: "26 जनवरी 1950।" },
      { front: "लोकतंत्र क्या है?", back: "वह शासन प्रणाली जिसमें नागरिक मतदान द्वारा अपने प्रतिनिधि चुनते हैं।" },
      { front: "भारत सरकार का प्रमुख कौन होता है?", back: "प्रधानमंत्री।" },
    ],
  },
  {
    topicEn: "Geography of India", topicHi: "भारत का भूगोल",
    titleEn: "Geography of India", titleHi: "भारत का भूगोल", emoji: "🗺️",
    summaryEn: [
      "The Himalayas form India's northern boundary and hold the highest peaks.",
      "The Ganga is the longest river flowing within India, starting from the Gangotri glacier.",
      "India has 28 states and 8 union territories, with New Delhi as the capital.",
    ],
    summaryHi: [
      "हिमालय भारत की उत्तरी सीमा बनाता है और यहाँ सबसे ऊँची चोटियाँ हैं।",
      "गंगा भारत में बहने वाली सबसे लंबी नदी है, जो गंगोत्री हिमनद से निकलती है।",
      "भारत में 28 राज्य और 8 केंद्र शासित प्रदेश हैं, और राजधानी नई दिल्ली है।",
    ],
    cardsEn: [
      { front: "Which is the longest river in India?", back: "The Ganga." },
      { front: "How many states does India have?", back: "28 states." },
      { front: "Which mountain range lies to the north of India?", back: "The Himalayas." },
      { front: "What is the capital of India?", back: "New Delhi." },
    ],
    cardsHi: [
      { front: "भारत की सबसे लंबी नदी कौन-सी है?", back: "गंगा।" },
      { front: "भारत में कितने राज्य हैं?", back: "28 राज्य।" },
      { front: "भारत के उत्तर में कौन-सी पर्वत शृंखला है?", back: "हिमालय।" },
      { front: "भारत की राजधानी क्या है?", back: "नई दिल्ली।" },
    ],
  },
  {
    topicEn: "Freedom Movement", topicHi: "स्वतंत्रता आंदोलन",
    titleEn: "Freedom Movement", titleHi: "स्वतंत्रता आंदोलन", emoji: "🕊️",
    summaryEn: [
      "India became independent on 15 August 1947 after a long non-violent struggle.",
      "Mahatma Gandhi led movements such as the Dandi Salt March of 1930.",
      "Jawaharlal Nehru became the first Prime Minister of independent India.",
    ],
    summaryHi: [
      "लंबे अहिंसक संघर्ष के बाद भारत 15 अगस्त 1947 को स्वतंत्र हुआ।",
      "महात्मा गांधी ने 1930 की दांडी नमक यात्रा जैसे आंदोलनों का नेतृत्व किया।",
      "जवाहरलाल नेहरू स्वतंत्र भारत के पहले प्रधानमंत्री बने।",
    ],
    cardsEn: [
      { front: "On which date did India become independent?", back: "15 August 1947." },
      { front: "Who led the Dandi Salt March?", back: "Mahatma Gandhi, in 1930." },
      { front: "Who was the first Prime Minister of India?", back: "Jawaharlal Nehru." },
      { front: "Which principle guided Gandhi's movements?", back: "Ahimsa, that is non-violence." },
    ],
    cardsHi: [
      { front: "भारत किस तारीख को स्वतंत्र हुआ?", back: "15 अगस्त 1947।" },
      { front: "दांडी नमक यात्रा का नेतृत्व किसने किया?", back: "महात्मा गांधी ने, 1930 में।" },
      { front: "भारत के पहले प्रधानमंत्री कौन थे?", back: "जवाहरलाल नेहरू।" },
      { front: "गांधी जी के आंदोलनों का मूल सिद्धांत क्या था?", back: "अहिंसा।" },
    ],
  },
  {
    topicEn: "Transport & Communication", topicHi: "परिवहन और संचार",
    titleEn: "Transport & Communication", titleHi: "परिवहन और संचार", emoji: "🚂",
    summaryEn: [
      "Transport is of three kinds: land, water and air.",
      "Indian Railways is one of the largest rail networks in the world and carries goods and people.",
      "Communication has moved from letters and telegrams to telephones and the internet.",
    ],
    summaryHi: [
      "परिवहन तीन प्रकार का होता है: थल, जल और वायु।",
      "भारतीय रेल विश्व के सबसे बड़े रेल नेटवर्कों में से एक है और माल तथा यात्रियों को ढोती है।",
      "संचार पत्र और तार से बढ़कर अब टेलीफोन और इंटरनेट तक पहुँच गया है।",
    ],
    cardsEn: [
      { front: "What are the three kinds of transport?", back: "Land, water and air transport." },
      { front: "Which is the fastest means of transport?", back: "Air transport." },
      { front: "What carries most goods across India by land?", back: "Indian Railways and trucks." },
      { front: "Which invention made instant long-distance talking possible?", back: "The telephone." },
    ],
    cardsHi: [
      { front: "परिवहन के तीन प्रकार कौन-से हैं?", back: "थल, जल और वायु परिवहन।" },
      { front: "सबसे तेज परिवहन साधन कौन-सा है?", back: "वायु परिवहन।" },
      { front: "भारत में थल मार्ग से अधिकांश माल कौन ढोता है?", back: "भारतीय रेल और ट्रक।" },
      { front: "किस आविष्कार से तुरंत दूरसंचार संभव हुआ?", back: "टेलीफोन।" },
    ],
  },
];

const PACKS: Record<string, { a: BiPack[]; b: BiPack[] }> = {
  Math: { a: MATH_A, b: MATH_B },
  Science: { a: SCI_A, b: SCI_B },
  "Social Science": { a: SOC_A, b: SOC_B },
};

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function build(): LmsResource[] {
  const out: LmsResource[] = [];
  LMS_SUBJECTS.forEach((subject) => {
    LMS_CLASSES.forEach((classLevel) => {
      const classNum = Number(classLevel.split(" ")[1]);
      const packs = classNum <= 2 ? PACKS[subject]!.a : PACKS[subject]!.b;
      LMS_LANGUAGES.forEach((language) => {
        packs.forEach((p, i) => {
          const hi = language === "Hindi";
          out.push({
            id: `lms-${slug(subject)}-c${classNum}-${hi ? "hi" : "en"}-${i + 1}`,
            title: hi ? `${p.titleHi} · ${classLevel.replace("Class", "कक्षा")}` : `${p.titleEn} · ${classLevel}`,
            subject,
            classLevel,
            language,
            topic: hi ? p.topicHi : p.topicEn,
            emoji: p.emoji,
            summary: hi ? p.summaryHi : p.summaryEn,
            flashcards: hi ? p.cardsHi : p.cardsEn,
          });
        });
      });
    });
  });
  return out;
}

export const OFFLINE_LMS_RESOURCES: LmsResource[] = build();
