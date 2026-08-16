/**
 * WORKING_GAME_LIBRARY
 * A fully offline, static dataset: exactly 4 unique playable games for every
 * combination of Subject (Math, Science, Social Science) x Class (1-5) x Language (English, Hindi).
 * 3 x 5 x 2 x 4 = 120 games, each with 4 real multiple-choice questions.
 */

export type WorkingQuestion = { q: string; options: string[]; correct: number };

export type WorkingGame = {
  id: string;
  title: string;
  subject: "Math" | "Science" | "Social Science";
  classLevel: string;
  language: "English" | "Hindi";
  topic: string;
  emoji: string;
  questions: WorkingQuestion[];
};

type Bi = {
  en: string;
  hi: string;
  optionsEn: string[]; // correct answer FIRST
  optionsHi: string[];
};

type Pack = {
  topic: string;
  titleEn: string;
  titleHi: string;
  emoji: string;
  items: Bi[];
};

/* ------------------------------------------------------------------ */
/* Deterministic shuffle so the correct option lands in varied slots   */
/* ------------------------------------------------------------------ */

function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function shuffleWithCorrect(options: string[], seed: number): { options: string[]; correct: number } {
  const rand = seeded(seed);
  const answer = options[0]!;
  const arr = [...options];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return { options: arr, correct: arr.indexOf(answer) };
}

/* ------------------------------------------------------------------ */
/* MATH — procedurally generated, real calculations, scaled by class    */
/* ------------------------------------------------------------------ */

function mathPacks(cls: number): Pack[] {
  const k = cls;
  if (k === 1)
    return [
      {
        topic: "counting",
        titleEn: "Counting to 20 Challenge",
        titleHi: "20 तक गिनती चुनौती",
        emoji: "🔢",
        items: [
          { en: "What number comes just after 13?", hi: "13 के तुरंत बाद कौन-सी संख्या आती है?", optionsEn: ["14", "12", "15", "31"], optionsHi: ["14", "12", "15", "31"] },
          { en: "Count the tens: how many are there in 20?", hi: "20 में कितने दहाई हैं?", optionsEn: ["2", "1", "20", "10"], optionsHi: ["2", "1", "20", "10"] },
          { en: "Which number is missing: 7, 8, __, 10?", hi: "कौन-सी संख्या छूट गई है: 7, 8, __, 10?", optionsEn: ["9", "11", "6", "12"], optionsHi: ["9", "11", "6", "12"] },
          { en: "Count backwards from 5. Which number comes third?", hi: "5 से उल्टी गिनती करें। तीसरी संख्या कौन-सी है?", optionsEn: ["3", "4", "2", "1"], optionsHi: ["3", "4", "2", "1"] },
        ],
      },
      {
        topic: "addition",
        titleEn: "Single-Digit Addition Sprint",
        titleHi: "एक अंक जोड़ दौड़",
        emoji: "➕",
        items: [
          { en: "6 + 3 = ?", hi: "6 + 3 = ?", optionsEn: ["9", "8", "10", "63"], optionsHi: ["9", "8", "10", "63"] },
          { en: "4 + 5 = ?", hi: "4 + 5 = ?", optionsEn: ["9", "10", "8", "45"], optionsHi: ["9", "10", "8", "45"] },
          { en: "Rani has 5 marbles and gets 4 more. How many now?", hi: "रानी के पास 5 कंचे हैं और उसे 4 और मिले। अब कितने हैं?", optionsEn: ["9", "1", "54", "10"], optionsHi: ["9", "1", "54", "10"] },
          { en: "7 + 2 + 1 = ?", hi: "7 + 2 + 1 = ?", optionsEn: ["10", "9", "11", "721"], optionsHi: ["10", "9", "11", "721"] },
        ],
      },
      {
        topic: "shapes",
        titleEn: "Shape Detective",
        titleHi: "आकृति जासूस",
        emoji: "🔺",
        items: [
          { en: "How many sides does a triangle have?", hi: "त्रिभुज में कितनी भुजाएँ होती हैं?", optionsEn: ["3", "4", "2", "5"], optionsHi: ["3", "4", "2", "5"] },
          { en: "A shape with 4 equal sides is called a:", hi: "4 बराबर भुजाओं वाली आकृति कहलाती है:", optionsEn: ["Square", "Circle", "Triangle", "Oval"], optionsHi: ["वर्ग", "वृत्त", "त्रिभुज", "अंडाकार"] },
          { en: "Which shape has no corners?", hi: "किस आकृति में कोई कोना नहीं होता?", optionsEn: ["Circle", "Square", "Triangle", "Rectangle"], optionsHi: ["वृत्त", "वर्ग", "त्रिभुज", "आयत"] },
          { en: "How many corners does a rectangle have?", hi: "आयत में कितने कोने होते हैं?", optionsEn: ["4", "3", "6", "2"], optionsHi: ["4", "3", "6", "2"] },
        ],
      },
      {
        topic: "comparison",
        titleEn: "Bigger or Smaller",
        titleHi: "बड़ा या छोटा",
        emoji: "⚖️",
        items: [
          { en: "Which number is greater: 8 or 12?", hi: "कौन-सी संख्या बड़ी है: 8 या 12?", optionsEn: ["12", "8", "Both equal", "Cannot say"], optionsHi: ["12", "8", "दोनों बराबर", "कह नहीं सकते"] },
          { en: "Which is the smallest: 5, 2, 9?", hi: "सबसे छोटी कौन-सी है: 5, 2, 9?", optionsEn: ["2", "5", "9", "None"], optionsHi: ["2", "5", "9", "कोई नहीं"] },
          { en: "Arrange 3, 1, 2 in order. Which comes first?", hi: "3, 1, 2 को क्रम में रखें। पहले कौन आएगा?", optionsEn: ["1", "2", "3", "0"], optionsHi: ["1", "2", "3", "0"] },
          { en: "10 is ___ than 7.", hi: "10, 7 से ___ है।", optionsEn: ["greater", "smaller", "equal", "half"], optionsHi: ["बड़ा", "छोटा", "बराबर", "आधा"] },
        ],
      },
    ];
  if (k === 2)
    return [
      {
        topic: "subtraction",
        titleEn: "Two-Digit Subtraction Race",
        titleHi: "दो अंक घटाव दौड़",
        emoji: "➖",
        items: [
          { en: "45 - 18 = ?", hi: "45 - 18 = ?", optionsEn: ["27", "37", "26", "33"], optionsHi: ["27", "37", "26", "33"] },
          { en: "60 - 25 = ?", hi: "60 - 25 = ?", optionsEn: ["35", "45", "25", "40"], optionsHi: ["35", "45", "25", "40"] },
          { en: "A shop had 52 pencils and sold 19. How many are left?", hi: "एक दुकान में 52 पेंसिलें थीं और 19 बिक गईं। कितनी बचीं?", optionsEn: ["33", "43", "31", "37"], optionsHi: ["33", "43", "31", "37"] },
          { en: "What must be added to 36 to make 50?", hi: "36 में क्या जोड़ें कि 50 बने?", optionsEn: ["14", "24", "16", "13"], optionsHi: ["14", "24", "16", "13"] },
        ],
      },
      {
        topic: "tables",
        titleEn: "Times Table Trainer",
        titleHi: "पहाड़ा अभ्यास",
        emoji: "✖️",
        items: [
          { en: "3 x 7 = ?", hi: "3 x 7 = ?", optionsEn: ["21", "24", "18", "27"], optionsHi: ["21", "24", "18", "27"] },
          { en: "5 x 6 = ?", hi: "5 x 6 = ?", optionsEn: ["30", "35", "25", "36"], optionsHi: ["30", "35", "25", "36"] },
          { en: "4 x 8 = ?", hi: "4 x 8 = ?", optionsEn: ["32", "28", "36", "24"], optionsHi: ["32", "28", "36", "24"] },
          { en: "How many legs do 6 cows have?", hi: "6 गायों के कितने पैर होंगे?", optionsEn: ["24", "18", "20", "12"], optionsHi: ["24", "18", "20", "12"] },
        ],
      },
      {
        topic: "money",
        titleEn: "Rupee Shopping Maths",
        titleHi: "रुपये की खरीदारी गणित",
        emoji: "💰",
        items: [
          { en: "A pen costs ₹12 and a notebook ₹25. Total cost?", hi: "एक पेन ₹12 का और कॉपी ₹25 की है। कुल कितना?", optionsEn: ["₹37", "₹35", "₹47", "₹13"], optionsHi: ["₹37", "₹35", "₹47", "₹13"] },
          { en: "You pay ₹50 for a ₹34 toy. What is the change?", hi: "₹34 के खिलौने के लिए ₹50 दिए। कितने वापस मिलेंगे?", optionsEn: ["₹16", "₹26", "₹14", "₹24"], optionsHi: ["₹16", "₹26", "₹14", "₹24"] },
          { en: "How many ₹5 coins make ₹40?", hi: "₹40 बनाने के लिए ₹5 के कितने सिक्के चाहिए?", optionsEn: ["8", "6", "10", "4"], optionsHi: ["8", "6", "10", "4"] },
          { en: "3 biscuit packets cost ₹10 each. Total?", hi: "3 बिस्कुट पैकेट ₹10 प्रति हैं। कुल कितना?", optionsEn: ["₹30", "₹13", "₹20", "₹33"], optionsHi: ["₹30", "₹13", "₹20", "₹33"] },
        ],
      },
      {
        topic: "time",
        titleEn: "Clock and Calendar Quest",
        titleHi: "घड़ी और कैलेंडर खोज",
        emoji: "⏰",
        items: [
          { en: "How many minutes are there in one hour?", hi: "एक घंटे में कितने मिनट होते हैं?", optionsEn: ["60", "30", "100", "24"], optionsHi: ["60", "30", "100", "24"] },
          { en: "How many days are there in a week?", hi: "एक सप्ताह में कितने दिन होते हैं?", optionsEn: ["7", "5", "12", "30"], optionsHi: ["7", "5", "12", "30"] },
          { en: "School starts at 9:00 and ends at 2:00. How long is it?", hi: "स्कूल 9:00 बजे शुरू और 2:00 बजे बंद होता है। कितने घंटे?", optionsEn: ["5 hours", "4 hours", "6 hours", "3 hours"], optionsHi: ["5 घंटे", "4 घंटे", "6 घंटे", "3 घंटे"] },
          { en: "How many months are there in a year?", hi: "एक वर्ष में कितने महीने होते हैं?", optionsEn: ["12", "10", "24", "7"], optionsHi: ["12", "10", "24", "7"] },
        ],
      },
    ];
  if (k === 3)
    return [
      {
        topic: "multiplication",
        titleEn: "Multiplication Power Play",
        titleHi: "गुणा शक्ति खेल",
        emoji: "✖️",
        items: [
          { en: "24 x 3 = ?", hi: "24 x 3 = ?", optionsEn: ["72", "68", "76", "64"], optionsHi: ["72", "68", "76", "64"] },
          { en: "15 x 6 = ?", hi: "15 x 6 = ?", optionsEn: ["90", "80", "96", "85"], optionsHi: ["90", "80", "96", "85"] },
          { en: "A box holds 12 mangoes. How many in 7 boxes?", hi: "एक पेटी में 12 आम हैं। 7 पेटियों में कितने?", optionsEn: ["84", "74", "96", "72"], optionsHi: ["84", "74", "96", "72"] },
          { en: "9 x 9 = ?", hi: "9 x 9 = ?", optionsEn: ["81", "72", "91", "99"], optionsHi: ["81", "72", "91", "99"] },
        ],
      },
      {
        topic: "division",
        titleEn: "Fair Share Division",
        titleHi: "बराबर बाँट भाग",
        emoji: "➗",
        items: [
          { en: "56 ÷ 7 = ?", hi: "56 ÷ 7 = ?", optionsEn: ["8", "7", "9", "6"], optionsHi: ["8", "7", "9", "6"] },
          { en: "45 sweets shared equally among 9 children. Each gets?", hi: "45 मिठाइयाँ 9 बच्चों में बराबर बाँटी गईं। हर एक को कितनी?", optionsEn: ["5", "6", "4", "9"], optionsHi: ["5", "6", "4", "9"] },
          { en: "What is the remainder when 29 is divided by 5?", hi: "29 को 5 से भाग देने पर शेषफल क्या है?", optionsEn: ["4", "5", "3", "0"], optionsHi: ["4", "5", "3", "0"] },
          { en: "100 ÷ 4 = ?", hi: "100 ÷ 4 = ?", optionsEn: ["25", "20", "30", "40"], optionsHi: ["25", "20", "30", "40"] },
        ],
      },
      {
        topic: "fractions",
        titleEn: "Fraction Basics Builder",
        titleHi: "भिन्न की बुनियाद",
        emoji: "🍕",
        items: [
          { en: "Which fraction is half of a whole?", hi: "पूर्ण का आधा कौन-सी भिन्न है?", optionsEn: ["1/2", "1/3", "2/3", "1/4"], optionsHi: ["1/2", "1/3", "2/3", "1/4"] },
          { en: "A pizza is cut into 8 slices. You eat 2. What fraction is eaten?", hi: "एक पिज़्ज़ा 8 टुकड़ों में कटा है। आपने 2 खाए। कितना भाग खाया?", optionsEn: ["2/8", "8/2", "2/6", "1/8"], optionsHi: ["2/8", "8/2", "2/6", "1/8"] },
          { en: "Which is greater: 1/2 or 1/4?", hi: "कौन बड़ी है: 1/2 या 1/4?", optionsEn: ["1/2", "1/4", "Both equal", "Cannot compare"], optionsHi: ["1/2", "1/4", "दोनों बराबर", "तुलना नहीं"] },
          { en: "1/4 + 1/4 = ?", hi: "1/4 + 1/4 = ?", optionsEn: ["1/2", "2/8", "1/8", "1"], optionsHi: ["1/2", "2/8", "1/8", "1"] },
        ],
      },
      {
        topic: "measurement",
        titleEn: "Measure It Right",
        titleHi: "सही माप",
        emoji: "📏",
        items: [
          { en: "How many centimetres are in 1 metre?", hi: "1 मीटर में कितने सेंटीमीटर होते हैं?", optionsEn: ["100", "10", "1000", "50"], optionsHi: ["100", "10", "1000", "50"] },
          { en: "How many grams are in 1 kilogram?", hi: "1 किलोग्राम में कितने ग्राम होते हैं?", optionsEn: ["1000", "100", "10", "500"], optionsHi: ["1000", "100", "10", "500"] },
          { en: "A rope is 250 cm long. How many metres is that?", hi: "एक रस्सी 250 सेमी लंबी है। यह कितने मीटर है?", optionsEn: ["2.5 m", "25 m", "0.25 m", "250 m"], optionsHi: ["2.5 मी", "25 मी", "0.25 मी", "250 मी"] },
          { en: "How many millilitres are in 2 litres?", hi: "2 लीटर में कितने मिलीलीटर होते हैं?", optionsEn: ["2000", "200", "20", "1000"], optionsHi: ["2000", "200", "20", "1000"] },
        ],
      },
    ];
  if (k === 4)
    return [
      {
        topic: "factors",
        titleEn: "Factors and Multiples Hunt",
        titleHi: "गुणनखंड और गुणज खोज",
        emoji: "🧮",
        items: [
          { en: "Which of these is a factor of 24?", hi: "इनमें से कौन 24 का गुणनखंड है?", optionsEn: ["6", "5", "7", "9"], optionsHi: ["6", "5", "7", "9"] },
          { en: "What is the LCM of 4 and 6?", hi: "4 और 6 का ल.स. क्या है?", optionsEn: ["12", "24", "10", "6"], optionsHi: ["12", "24", "10", "6"] },
          { en: "What is the HCF of 18 and 27?", hi: "18 और 27 का म.स. क्या है?", optionsEn: ["9", "3", "6", "18"], optionsHi: ["9", "3", "6", "18"] },
          { en: "Which number is prime?", hi: "कौन-सी संख्या अभाज्य है?", optionsEn: ["17", "21", "15", "27"], optionsHi: ["17", "21", "15", "27"] },
        ],
      },
      {
        topic: "decimals",
        titleEn: "Decimal Point Drill",
        titleHi: "दशमलव अभ्यास",
        emoji: "🔟",
        items: [
          { en: "2.5 + 1.75 = ?", hi: "2.5 + 1.75 = ?", optionsEn: ["4.25", "3.25", "4.75", "3.75"], optionsHi: ["4.25", "3.25", "4.75", "3.75"] },
          { en: "Write 3/10 as a decimal.", hi: "3/10 को दशमलव में लिखें।", optionsEn: ["0.3", "0.03", "3.10", "0.13"], optionsHi: ["0.3", "0.03", "3.10", "0.13"] },
          { en: "Which is greater: 0.7 or 0.65?", hi: "कौन बड़ा है: 0.7 या 0.65?", optionsEn: ["0.7", "0.65", "Both equal", "Cannot say"], optionsHi: ["0.7", "0.65", "दोनों बराबर", "कह नहीं सकते"] },
          { en: "6.4 - 2.9 = ?", hi: "6.4 - 2.9 = ?", optionsEn: ["3.5", "4.5", "3.3", "4.3"], optionsHi: ["3.5", "4.5", "3.3", "4.3"] },
        ],
      },
      {
        topic: "area",
        titleEn: "Area and Perimeter Lab",
        titleHi: "क्षेत्रफल और परिमाप प्रयोगशाला",
        emoji: "📐",
        items: [
          { en: "Area of a rectangle 8 cm by 5 cm?", hi: "8 सेमी x 5 सेमी वाले आयत का क्षेत्रफल?", optionsEn: ["40 sq cm", "26 sq cm", "13 sq cm", "45 sq cm"], optionsHi: ["40 वर्ग सेमी", "26 वर्ग सेमी", "13 वर्ग सेमी", "45 वर्ग सेमी"] },
          { en: "Perimeter of a square with side 9 cm?", hi: "9 सेमी भुजा वाले वर्ग का परिमाप?", optionsEn: ["36 cm", "81 cm", "18 cm", "27 cm"], optionsHi: ["36 सेमी", "81 सेमी", "18 सेमी", "27 सेमी"] },
          { en: "Area of a square with side 7 m?", hi: "7 मी भुजा वाले वर्ग का क्षेत्रफल?", optionsEn: ["49 sq m", "28 sq m", "14 sq m", "42 sq m"], optionsHi: ["49 वर्ग मी", "28 वर्ग मी", "14 वर्ग मी", "42 वर्ग मी"] },
          { en: "Perimeter of a rectangle 12 m by 4 m?", hi: "12 मी x 4 मी वाले आयत का परिमाप?", optionsEn: ["32 m", "48 m", "16 m", "24 m"], optionsHi: ["32 मी", "48 मी", "16 मी", "24 मी"] },
        ],
      },
      {
        topic: "large numbers",
        titleEn: "Large Number Place Value",
        titleHi: "बड़ी संख्या स्थानीय मान",
        emoji: "🏦",
        items: [
          { en: "What is the place value of 7 in 47,302?", hi: "47,302 में 7 का स्थानीय मान क्या है?", optionsEn: ["7,000", "700", "70", "7"], optionsHi: ["7,000", "700", "70", "7"] },
          { en: "Round 6,847 to the nearest hundred.", hi: "6,847 को निकटतम सैकड़े में पूर्णांकित करें।", optionsEn: ["6,800", "6,900", "6,850", "7,000"], optionsHi: ["6,800", "6,900", "6,850", "7,000"] },
          { en: "Which number is the largest?", hi: "कौन-सी संख्या सबसे बड़ी है?", optionsEn: ["9,081", "8,910", "9,018", "8,999"], optionsHi: ["9,081", "8,910", "9,018", "8,999"] },
          { en: "How many zeros are there in one lakh?", hi: "एक लाख में कितने शून्य होते हैं?", optionsEn: ["5", "4", "6", "3"], optionsHi: ["5", "4", "6", "3"] },
        ],
      },
    ];
  return [
    {
      topic: "ratio",
      titleEn: "Ratio & Proportion Challenge",
      titleHi: "अनुपात एवं समानुपात चुनौती",
      emoji: "⚖️",
      items: [
        { en: "Simplify the ratio 12:18 to its lowest terms:", hi: "अनुपात 12:18 को सरलतम रूप में लिखें:", optionsEn: ["2:3", "3:4", "4:6", "1:2"], optionsHi: ["2:3", "3:4", "4:6", "1:2"] },
        { en: "Divide ₹100 between two people in a 3:2 ratio. What is the larger share?", hi: "₹100 को दो लोगों में 3:2 के अनुपात में बाँटें। बड़ा हिस्सा कितना है?", optionsEn: ["₹60", "₹40", "₹50", "₹70"], optionsHi: ["₹60", "₹40", "₹50", "₹70"] },
        { en: "Are the ratios 2:3 and 4:6 proportional?", hi: "क्या अनुपात 2:3 और 4:6 समानुपाती हैं?", optionsEn: ["Yes", "No", "Only if added", "Only if multiplied"], optionsHi: ["हाँ", "नहीं", "केवल जोड़ने पर", "केवल गुणा करने पर"] },
        { en: "If a map scale is 1:1000, what does 5 cm represent in reality?", hi: "यदि मानचित्र का पैमाना 1:1000 है, तो 5 सेमी वास्तव में कितना दर्शाता है?", optionsEn: ["50 metres", "5 metres", "500 metres", "5000 metres"], optionsHi: ["50 मीटर", "5 मीटर", "500 मीटर", "5000 मीटर"] },
      ],
    },
    {
      topic: "fractions",
      titleEn: "Fraction Operations Master",
      titleHi: "भिन्न संक्रिया महारत",
      emoji: "🍰",
      items: [
        { en: "1/2 + 1/3 = ?", hi: "1/2 + 1/3 = ?", optionsEn: ["5/6", "2/5", "1/6", "3/5"], optionsHi: ["5/6", "2/5", "1/6", "3/5"] },
        { en: "3/4 x 8 = ?", hi: "3/4 x 8 = ?", optionsEn: ["6", "5", "12", "4"], optionsHi: ["6", "5", "12", "4"] },
        { en: "Convert 7/2 into a mixed number.", hi: "7/2 को मिश्रित संख्या में बदलें।", optionsEn: ["3 1/2", "2 1/3", "3 1/3", "2 1/2"], optionsHi: ["3 1/2", "2 1/3", "3 1/3", "2 1/2"] },
        { en: "Which fraction is equivalent to 4/10?", hi: "4/10 के बराबर कौन-सी भिन्न है?", optionsEn: ["2/5", "1/4", "3/5", "4/5"], optionsHi: ["2/5", "1/4", "3/5", "4/5"] },
      ],
    },
    {
      topic: "percentage",
      titleEn: "Percentage Power Quiz",
      titleHi: "प्रतिशत शक्ति प्रश्नोत्तरी",
      emoji: "％",
      items: [
        { en: "What is 25% of 200?", hi: "200 का 25% कितना है?", optionsEn: ["50", "40", "25", "75"], optionsHi: ["50", "40", "25", "75"] },
        { en: "A shirt costing ₹800 gets 10% off. What is the new price?", hi: "₹800 की कमीज़ पर 10% छूट है। नया मूल्य क्या है?", optionsEn: ["₹720", "₹780", "₹700", "₹750"], optionsHi: ["₹720", "₹780", "₹700", "₹750"] },
        { en: "Write 3/5 as a percentage.", hi: "3/5 को प्रतिशत में लिखें।", optionsEn: ["60%", "35%", "53%", "30%"], optionsHi: ["60%", "35%", "53%", "30%"] },
        { en: "A student scored 45 out of 50. What percentage is that?", hi: "एक छात्र ने 50 में से 45 अंक पाए। यह कितने प्रतिशत है?", optionsEn: ["90%", "85%", "95%", "80%"], optionsHi: ["90%", "85%", "95%", "80%"] },
      ],
    },
    {
      topic: "volume",
      titleEn: "Volume & Capacity Lab",
      titleHi: "आयतन एवं धारिता प्रयोगशाला",
      emoji: "🧊",
      items: [
        { en: "Volume of a cube with edge 4 cm?", hi: "4 सेमी किनारे वाले घन का आयतन?", optionsEn: ["64 cu cm", "16 cu cm", "12 cu cm", "48 cu cm"], optionsHi: ["64 घन सेमी", "16 घन सेमी", "12 घन सेमी", "48 घन सेमी"] },
        { en: "Volume of a box 5 cm x 3 cm x 2 cm?", hi: "5 सेमी x 3 सेमी x 2 सेमी वाले बक्से का आयतन?", optionsEn: ["30 cu cm", "10 cu cm", "25 cu cm", "60 cu cm"], optionsHi: ["30 घन सेमी", "10 घन सेमी", "25 घन सेमी", "60 घन सेमी"] },
        { en: "How many millilitres does a 1.5 litre bottle hold?", hi: "1.5 लीटर की बोतल में कितने मिलीलीटर आते हैं?", optionsEn: ["1500", "150", "15", "15000"], optionsHi: ["1500", "150", "15", "15000"] },
        { en: "A tank holds 20 litres. How many 500 ml jugs fill it?", hi: "एक टंकी में 20 लीटर आते हैं। 500 मि.ली. के कितने जग भरेंगे?", optionsEn: ["40", "20", "10", "50"], optionsHi: ["40", "20", "10", "50"] },
      ],
    },
  ];
}

/* ------------------------------------------------------------------ */
/* SCIENCE                                                             */
/* ------------------------------------------------------------------ */

function sciencePacks(cls: number): Pack[] {
  if (cls === 1)
    return [
      {
        topic: "body parts", titleEn: "My Body Parts Explorer", titleHi: "मेरे शरीर के अंग खोज", emoji: "🧍",
        items: [
          { en: "Which body part do we use to see?", hi: "हम देखने के लिए किस अंग का उपयोग करते हैं?", optionsEn: ["Eyes", "Ears", "Nose", "Hands"], optionsHi: ["आँखें", "कान", "नाक", "हाथ"] },
          { en: "Which part helps us smell flowers?", hi: "फूलों की गंध किस अंग से आती है?", optionsEn: ["Nose", "Tongue", "Eyes", "Feet"], optionsHi: ["नाक", "जीभ", "आँखें", "पैर"] },
          { en: "How many fingers are there on one hand?", hi: "एक हाथ में कितनी उँगलियाँ होती हैं?", optionsEn: ["5", "4", "6", "10"], optionsHi: ["5", "4", "6", "10"] },
          { en: "Which part helps us taste food?", hi: "भोजन का स्वाद किस अंग से मिलता है?", optionsEn: ["Tongue", "Nose", "Ear", "Skin"], optionsHi: ["जीभ", "नाक", "कान", "त्वचा"] },
        ],
      },
      {
        topic: "animals", titleEn: "Animal Friends Quiz", titleHi: "पशु मित्र प्रश्नोत्तरी", emoji: "🐄",
        items: [
          { en: "Which animal gives us milk?", hi: "कौन-सा पशु हमें दूध देता है?", optionsEn: ["Cow", "Dog", "Crow", "Fish"], optionsHi: ["गाय", "कुत्ता", "कौआ", "मछली"] },
          { en: "Which animal lives in water?", hi: "कौन-सा जीव पानी में रहता है?", optionsEn: ["Fish", "Goat", "Hen", "Cat"], optionsHi: ["मछली", "बकरी", "मुर्गी", "बिल्ली"] },
          { en: "Which bird cannot fly?", hi: "कौन-सा पक्षी उड़ नहीं सकता?", optionsEn: ["Ostrich", "Parrot", "Pigeon", "Sparrow"], optionsHi: ["शुतुरमुर्ग", "तोता", "कबूतर", "गौरैया"] },
          { en: "Which animal is called the ship of the desert?", hi: "किस पशु को रेगिस्तान का जहाज़ कहते हैं?", optionsEn: ["Camel", "Horse", "Elephant", "Donkey"], optionsHi: ["ऊँट", "घोड़ा", "हाथी", "गधा"] },
        ],
      },
      {
        topic: "plants", titleEn: "Plants Around Us", titleHi: "हमारे आस-पास के पौधे", emoji: "🌱",
        items: [
          { en: "Which part of the plant is underground?", hi: "पौधे का कौन-सा भाग ज़मीन के नीचे होता है?", optionsEn: ["Root", "Leaf", "Flower", "Fruit"], optionsHi: ["जड़", "पत्ती", "फूल", "फल"] },
          { en: "Plants need which of these to grow?", hi: "पौधों को उगने के लिए इनमें से क्या चाहिए?", optionsEn: ["Water", "Plastic", "Paper", "Stone"], optionsHi: ["पानी", "प्लास्टिक", "कागज़", "पत्थर"] },
          { en: "Which part of the plant makes food?", hi: "पौधे का कौन-सा भाग भोजन बनाता है?", optionsEn: ["Leaf", "Root", "Stem", "Seed"], optionsHi: ["पत्ती", "जड़", "तना", "बीज"] },
          { en: "A small plant with a soft green stem is called a:", hi: "नरम हरे तने वाला छोटा पौधा कहलाता है:", optionsEn: ["Herb", "Tree", "Rock", "Bird"], optionsHi: ["शाक (हर्ब)", "वृक्ष", "चट्टान", "पक्षी"] },
        ],
      },
      {
        topic: "weather", titleEn: "Weather Watch Game", titleHi: "मौसम निरीक्षण खेल", emoji: "🌦️",
        items: [
          { en: "In which season does it rain the most in India?", hi: "भारत में सबसे अधिक वर्षा किस ऋतु में होती है?", optionsEn: ["Monsoon", "Winter", "Summer", "Spring"], optionsHi: ["वर्षा ऋतु", "शीत ऋतु", "ग्रीष्म ऋतु", "बसंत"] },
          { en: "What do we use to stay dry in the rain?", hi: "बारिश में सूखा रहने के लिए हम क्या उपयोग करते हैं?", optionsEn: ["Umbrella", "Fan", "Blanket", "Bucket"], optionsHi: ["छाता", "पंखा", "कंबल", "बाल्टी"] },
          { en: "Which season is the coldest?", hi: "सबसे ठंडी ऋतु कौन-सी है?", optionsEn: ["Winter", "Summer", "Monsoon", "Autumn"], optionsHi: ["शीत ऋतु", "ग्रीष्म ऋतु", "वर्षा ऋतु", "शरद"] },
          { en: "The sun gives us light and:", hi: "सूर्य हमें प्रकाश और क्या देता है?", optionsEn: ["Heat", "Rain", "Ice", "Wind"], optionsHi: ["ऊष्मा", "वर्षा", "बर्फ", "हवा"] },
        ],
      },
    ];
  if (cls === 2)
    return [
      {
        topic: "food", titleEn: "Healthy Food Sorting", titleHi: "स्वस्थ भोजन छँटाई", emoji: "🥗",
        items: [
          { en: "Which food gives us the most energy?", hi: "कौन-सा भोजन हमें सबसे अधिक ऊर्जा देता है?", optionsEn: ["Rice", "Water", "Salt", "Ice"], optionsHi: ["चावल", "पानी", "नमक", "बर्फ"] },
          { en: "Which of these is a protein-rich food?", hi: "इनमें से कौन प्रोटीन युक्त भोजन है?", optionsEn: ["Dal (pulses)", "Sugar", "Butter", "Rice"], optionsHi: ["दाल", "चीनी", "मक्खन", "चावल"] },
          { en: "Which fruit is rich in vitamin C?", hi: "कौन-सा फल विटामिन सी से भरपूर है?", optionsEn: ["Orange", "Potato", "Wheat", "Rice"], optionsHi: ["संतरा", "आलू", "गेहूँ", "चावल"] },
          { en: "Milk mainly gives our bones:", hi: "दूध मुख्य रूप से हमारी हड्डियों को क्या देता है?", optionsEn: ["Calcium", "Iron", "Sugar", "Oil"], optionsHi: ["कैल्शियम", "लोहा", "चीनी", "तेल"] },
        ],
      },
      {
        topic: "water", titleEn: "Water Cycle Starter", titleHi: "जल चक्र शुरुआत", emoji: "💧",
        items: [
          { en: "Water turning into vapour is called:", hi: "पानी का वाष्प में बदलना कहलाता है:", optionsEn: ["Evaporation", "Freezing", "Melting", "Mixing"], optionsHi: ["वाष्पीकरण", "जमना", "पिघलना", "मिलना"] },
          { en: "At what temperature does water freeze?", hi: "पानी किस तापमान पर जमता है?", optionsEn: ["0°C", "10°C", "50°C", "100°C"], optionsHi: ["0°C", "10°C", "50°C", "100°C"] },
          { en: "Clouds are formed from:", hi: "बादल किससे बनते हैं?", optionsEn: ["Water vapour", "Smoke", "Dust only", "Sand"], optionsHi: ["जलवाष्प", "धुआँ", "केवल धूल", "रेत"] },
          { en: "Which of these saves water at home?", hi: "इनमें से कौन घर में पानी बचाता है?", optionsEn: ["Closing the tap", "Leaking pipes", "Long showers", "Washing roads"], optionsHi: ["नल बंद करना", "टपकते पाइप", "लंबा स्नान", "सड़क धोना"] },
        ],
      },
      {
        topic: "senses", titleEn: "Five Senses Adventure", titleHi: "पाँच ज्ञानेंद्रियाँ साहसिक", emoji: "👂",
        items: [
          { en: "How many sense organs does the human body have?", hi: "मानव शरीर में कितनी ज्ञानेंद्रियाँ होती हैं?", optionsEn: ["5", "3", "7", "10"], optionsHi: ["5", "3", "7", "10"] },
          { en: "Skin is the sense organ for:", hi: "त्वचा किस अनुभूति की ज्ञानेंद्रिय है?", optionsEn: ["Touch", "Sight", "Hearing", "Smell"], optionsHi: ["स्पर्श", "दृष्टि", "श्रवण", "गंध"] },
          { en: "Which organ helps us hear sounds?", hi: "कौन-सा अंग हमें ध्वनि सुनने में मदद करता है?", optionsEn: ["Ear", "Eye", "Nose", "Tongue"], optionsHi: ["कान", "आँख", "नाक", "जीभ"] },
          { en: "A sweet taste is sensed mainly by the:", hi: "मीठा स्वाद मुख्य रूप से किससे पहचाना जाता है?", optionsEn: ["Tongue", "Nose", "Skin", "Ear"], optionsHi: ["जीभ", "नाक", "त्वचा", "कान"] },
        ],
      },
      {
        topic: "air", titleEn: "Air Around Us", titleHi: "हमारे चारों ओर हवा", emoji: "🌬️",
        items: [
          { en: "Which gas do we breathe in to stay alive?", hi: "जीवित रहने के लिए हम कौन-सी गैस अंदर लेते हैं?", optionsEn: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"], optionsHi: ["ऑक्सीजन", "कार्बन डाइऑक्साइड", "नाइट्रोजन", "हीलियम"] },
          { en: "Moving air is called:", hi: "गतिमान हवा को क्या कहते हैं?", optionsEn: ["Wind", "Rain", "Cloud", "Soil"], optionsHi: ["पवन", "वर्षा", "बादल", "मिट्टी"] },
          { en: "Which of these runs on wind energy?", hi: "इनमें से कौन पवन ऊर्जा से चलता है?", optionsEn: ["Windmill", "Bulb", "Radio", "Clock"], optionsHi: ["पवनचक्की", "बल्ब", "रेडियो", "घड़ी"] },
          { en: "Air pollution is mainly caused by:", hi: "वायु प्रदूषण मुख्य रूप से किससे होता है?", optionsEn: ["Smoke from vehicles", "Planting trees", "Rainfall", "Sunlight"], optionsHi: ["वाहनों का धुआँ", "पेड़ लगाना", "वर्षा", "धूप"] },
        ],
      },
    ];
  if (cls === 3)
    return [
      {
        topic: "plant parts", titleEn: "Parts of a Plant Lab", titleHi: "पौधे के भाग प्रयोगशाला", emoji: "🌿",
        items: [
          { en: "Which part carries water from roots to leaves?", hi: "कौन-सा भाग जड़ों से पत्तियों तक पानी पहुँचाता है?", optionsEn: ["Stem", "Flower", "Fruit", "Seed"], optionsHi: ["तना", "फूल", "फल", "बीज"] },
          { en: "Which part of the plant becomes a fruit?", hi: "पौधे का कौन-सा भाग फल बनता है?", optionsEn: ["Flower", "Root", "Leaf", "Stem"], optionsHi: ["फूल", "जड़", "पत्ती", "तना"] },
          { en: "Carrot is an example of an edible:", hi: "गाजर किस खाने योग्य भाग का उदाहरण है?", optionsEn: ["Root", "Leaf", "Flower", "Seed"], optionsHi: ["जड़", "पत्ती", "फूल", "बीज"] },
          { en: "Green colour in leaves is due to:", hi: "पत्तियों का हरा रंग किसके कारण होता है?", optionsEn: ["Chlorophyll", "Water", "Soil", "Air"], optionsHi: ["क्लोरोफिल", "पानी", "मिट्टी", "हवा"] },
        ],
      },
      {
        topic: "living things", titleEn: "Living and Non-Living", titleHi: "सजीव और निर्जीव", emoji: "🧬",
        items: [
          { en: "Which of these is a living thing?", hi: "इनमें से कौन सजीव है?", optionsEn: ["Tree", "Chair", "Stone", "Cycle"], optionsHi: ["पेड़", "कुर्सी", "पत्थर", "साइकिल"] },
          { en: "All living things need which of these?", hi: "सभी सजीवों को इनमें से क्या चाहिए?", optionsEn: ["Food", "Paint", "Plastic", "Glass"], optionsHi: ["भोजन", "रंग", "प्लास्टिक", "काँच"] },
          { en: "Growth and reproduction are features of:", hi: "वृद्धि और प्रजनन किसकी विशेषताएँ हैं?", optionsEn: ["Living things", "Non-living things", "Metals", "Rocks"], optionsHi: ["सजीवों", "निर्जीवों", "धातुओं", "चट्टानों"] },
          { en: "Which non-living thing can move?", hi: "कौन-सी निर्जीव वस्तु चल सकती है?", optionsEn: ["A car", "A rock", "A wall", "A book"], optionsHi: ["कार", "चट्टान", "दीवार", "किताब"] },
        ],
      },
      {
        topic: "housing", titleEn: "Homes and Shelters", titleHi: "घर और आश्रय", emoji: "🏠",
        items: [
          { en: "A bird's home is called a:", hi: "पक्षी के घर को क्या कहते हैं?", optionsEn: ["Nest", "Den", "Stable", "Burrow"], optionsHi: ["घोंसला", "माँद", "अस्तबल", "बिल"] },
          { en: "Which animal lives in a burrow?", hi: "कौन-सा जीव बिल में रहता है?", optionsEn: ["Rabbit", "Cow", "Crow", "Fish"], optionsHi: ["खरगोश", "गाय", "कौआ", "मछली"] },
          { en: "Houses in very rainy areas often have:", hi: "बहुत वर्षा वाले क्षेत्रों के घरों में अक्सर क्या होता है?", optionsEn: ["Sloping roofs", "Flat mud roofs", "No walls", "Glass floors"], optionsHi: ["ढलवाँ छतें", "सपाट मिट्टी की छतें", "बिना दीवारें", "काँच के फर्श"] },
          { en: "A honey bee lives in a:", hi: "मधुमक्खी कहाँ रहती है?", optionsEn: ["Hive", "Nest", "Kennel", "Web"], optionsHi: ["छत्ता", "घोंसला", "कुत्ताघर", "जाला"] },
        ],
      },
      {
        topic: "safety", titleEn: "Health and Safety Rules", titleHi: "स्वास्थ्य एवं सुरक्षा नियम", emoji: "🩺",
        items: [
          { en: "We should wash hands before:", hi: "हमें हाथ कब धोने चाहिए?", optionsEn: ["Eating food", "Sleeping only", "Reading", "Running"], optionsHi: ["भोजन से पहले", "केवल सोने से पहले", "पढ़ने से पहले", "दौड़ने से पहले"] },
          { en: "Which colour of a traffic light means stop?", hi: "यातायात बत्ती का कौन-सा रंग रुकने का संकेत है?", optionsEn: ["Red", "Green", "Yellow", "Blue"], optionsHi: ["लाल", "हरा", "पीला", "नीला"] },
          { en: "Drinking water should be:", hi: "पीने का पानी कैसा होना चाहिए?", optionsEn: ["Clean and filtered", "Muddy", "Warm and stale", "From a puddle"], optionsHi: ["स्वच्छ और छना हुआ", "गंदला", "बासी", "गड्ढे का"] },
          { en: "Brushing teeth twice a day prevents:", hi: "दिन में दो बार दाँत साफ़ करने से क्या रुकता है?", optionsEn: ["Tooth decay", "Hair fall", "Cold weather", "Hunger"], optionsHi: ["दाँतों की सड़न", "बाल झड़ना", "ठंड", "भूख"] },
        ],
      },
    ];
  if (cls === 4)
    return [
      {
        topic: "digestion", titleEn: "Digestive System Journey", titleHi: "पाचन तंत्र की यात्रा", emoji: "🫁",
        items: [
          { en: "Where does digestion begin in the human body?", hi: "मानव शरीर में पाचन कहाँ से शुरू होता है?", optionsEn: ["Mouth", "Stomach", "Liver", "Small intestine"], optionsHi: ["मुँह", "आमाशय", "यकृत", "छोटी आँत"] },
          { en: "Most absorption of digested food happens in the:", hi: "पचे हुए भोजन का अधिकांश अवशोषण कहाँ होता है?", optionsEn: ["Small intestine", "Mouth", "Large intestine", "Throat"], optionsHi: ["छोटी आँत", "मुँह", "बड़ी आँत", "गला"] },
          { en: "Which organ produces bile?", hi: "कौन-सा अंग पित्त बनाता है?", optionsEn: ["Liver", "Heart", "Lungs", "Kidney"], optionsHi: ["यकृत", "हृदय", "फेफड़े", "गुर्दा"] },
          { en: "Teeth used for tearing food are called:", hi: "भोजन फाड़ने वाले दाँत क्या कहलाते हैं?", optionsEn: ["Canines", "Molars", "Incisors", "Premolars"], optionsHi: ["रदनक (कैनाइन)", "चर्वणक", "कृंतक", "अग्रचर्वणक"] },
        ],
      },
      {
        topic: "matter", titleEn: "States of Matter Explorer", titleHi: "पदार्थ की अवस्थाएँ खोज", emoji: "🧪",
        items: [
          { en: "Which state of matter has a fixed shape and volume?", hi: "पदार्थ की किस अवस्था का आकार और आयतन निश्चित होता है?", optionsEn: ["Solid", "Liquid", "Gas", "Vapour"], optionsHi: ["ठोस", "द्रव", "गैस", "वाष्प"] },
          { en: "Ice melting into water is a change from:", hi: "बर्फ का पानी में पिघलना किस परिवर्तन को दर्शाता है?", optionsEn: ["Solid to liquid", "Liquid to gas", "Gas to solid", "Solid to gas"], optionsHi: ["ठोस से द्रव", "द्रव से गैस", "गैस से ठोस", "ठोस से गैस"] },
          { en: "At what temperature does water boil at sea level?", hi: "समुद्र तल पर पानी किस तापमान पर उबलता है?", optionsEn: ["100°C", "50°C", "0°C", "212°C"], optionsHi: ["100°C", "50°C", "0°C", "212°C"] },
          { en: "Gases can be compressed because their particles are:", hi: "गैसें संपीड़ित हो सकती हैं क्योंकि उनके कण होते हैं:", optionsEn: ["Far apart", "Tightly packed", "Fixed", "Frozen"], optionsHi: ["दूर-दूर", "कसकर जुड़े", "स्थिर", "जमे हुए"] },
        ],
      },
      {
        topic: "force", titleEn: "Force and Motion Play", titleHi: "बल और गति खेल", emoji: "🏹",
        items: [
          { en: "A push or a pull is called a:", hi: "धक्का या खिंचाव को क्या कहते हैं?", optionsEn: ["Force", "Speed", "Mass", "Volume"], optionsHi: ["बल", "चाल", "द्रव्यमान", "आयतन"] },
          { en: "Which force pulls objects towards the Earth?", hi: "कौन-सा बल वस्तुओं को पृथ्वी की ओर खींचता है?", optionsEn: ["Gravity", "Magnetism", "Friction", "Tension"], optionsHi: ["गुरुत्वाकर्षण", "चुंबकत्व", "घर्षण", "तनाव"] },
          { en: "Friction between a ball and the ground makes it:", hi: "गेंद और ज़मीन के बीच घर्षण उसे क्या करता है?", optionsEn: ["Slow down", "Speed up", "Float", "Disappear"], optionsHi: ["धीमा", "तेज़", "तैरता", "गायब"] },
          { en: "A magnet attracts objects made of:", hi: "चुंबक किस धातु की वस्तुओं को आकर्षित करता है?", optionsEn: ["Iron", "Wood", "Plastic", "Glass"], optionsHi: ["लोहा", "लकड़ी", "प्लास्टिक", "काँच"] },
        ],
      },
      {
        topic: "environment", titleEn: "Save the Environment", titleHi: "पर्यावरण बचाओ", emoji: "♻️",
        items: [
          { en: "Which of these is a renewable source of energy?", hi: "इनमें से कौन नवीकरणीय ऊर्जा स्रोत है?", optionsEn: ["Solar energy", "Coal", "Petrol", "Diesel"], optionsHi: ["सौर ऊर्जा", "कोयला", "पेट्रोल", "डीज़ल"] },
          { en: "Which waste is biodegradable?", hi: "कौन-सा कचरा जैव-अपघटनीय है?", optionsEn: ["Vegetable peels", "Plastic bags", "Glass bottles", "Metal cans"], optionsHi: ["सब्ज़ी के छिलके", "प्लास्टिक थैली", "काँच की बोतलें", "धातु के डिब्बे"] },
          { en: "Planting trees mainly helps by:", hi: "पेड़ लगाने से मुख्य रूप से क्या लाभ है?", optionsEn: ["Giving oxygen", "Making noise", "Raising heat", "Using fuel"], optionsHi: ["ऑक्सीजन देना", "शोर करना", "गर्मी बढ़ाना", "ईंधन खर्च"] },
          { en: "The three R's of waste management are reduce, reuse and:", hi: "कचरा प्रबंधन के तीन आर हैं: कम करना, पुनः उपयोग और:", optionsEn: ["Recycle", "Rebuild", "Remove", "Repeat"], optionsHi: ["पुनर्चक्रण", "पुनर्निर्माण", "हटाना", "दोहराना"] },
        ],
      },
    ];
  return [
    {
      topic: "photosynthesis", titleEn: "Photosynthesis Quiz", titleHi: "प्रकाश संश्लेषण प्रश्नोत्तरी", emoji: "🌞",
      items: [
        { en: "Which pigment absorbs sunlight in plants?", hi: "पौधों में सूर्य का प्रकाश अवशोषित करने वाले पिगमेंट को क्या कहते हैं?", optionsEn: ["Chlorophyll", "Carotenoid", "Haemoglobin", "Xanthophyll"], optionsHi: ["क्लोरोफिल", "कैरोटीनॉयड", "हीमोग्लोबिन", "ज़ैंथोफिल"] },
        { en: "What are the main outputs of photosynthesis?", hi: "प्रकाश संश्लेषण के मुख्य उत्पाद क्या हैं?", optionsEn: ["Glucose and oxygen", "Carbon dioxide and water", "Oxygen and methane", "Glucose and carbon dioxide"], optionsHi: ["ग्लूकोज और ऑक्सीजन", "कार्बन डाइऑक्साइड और पानी", "ऑक्सीजन और मीथेन", "ग्लूकोज और कार्बन डाइऑक्साइड"] },
        { en: "Through which tiny structures do leaves absorb carbon dioxide?", hi: "पत्तियाँ किस सूक्ष्म संरचना से कार्बन डाइऑक्साइड अवशोषित करती हैं?", optionsEn: ["Stomata", "Xylem", "Phloem", "Cuticle"], optionsHi: ["रंध्र", "जाइलम", "फ्लोएम", "क्यूटिकल"] },
        { en: "What do roots mainly absorb for photosynthesis?", hi: "प्रकाश संश्लेषण के लिए जड़ें मुख्यतः क्या अवशोषित करती हैं?", optionsEn: ["Water", "Nitrogen gas", "Soil minerals only", "Oxygen"], optionsHi: ["पानी", "नाइट्रोजन गैस", "केवल मिट्टी के खनिज", "ऑक्सीजन"] },
      ],
    },
    {
      topic: "human body", titleEn: "Human Body Systems", titleHi: "मानव शरीर तंत्र", emoji: "🫀",
      items: [
        { en: "How many chambers does the human heart have?", hi: "मानव हृदय में कितने कक्ष होते हैं?", optionsEn: ["4", "2", "3", "6"], optionsHi: ["4", "2", "3", "6"] },
        { en: "Which organ pumps blood through the body?", hi: "कौन-सा अंग शरीर में रक्त पंप करता है?", optionsEn: ["Heart", "Lungs", "Liver", "Brain"], optionsHi: ["हृदय", "फेफड़े", "यकृत", "मस्तिष्क"] },
        { en: "How many bones are there in an adult human body?", hi: "वयस्क मानव शरीर में कितनी हड्डियाँ होती हैं?", optionsEn: ["206", "300", "150", "260"], optionsHi: ["206", "300", "150", "260"] },
        { en: "Which organ controls the nervous system?", hi: "कौन-सा अंग तंत्रिका तंत्र को नियंत्रित करता है?", optionsEn: ["Brain", "Stomach", "Kidney", "Skin"], optionsHi: ["मस्तिष्क", "आमाशय", "गुर्दा", "त्वचा"] },
      ],
    },
    {
      topic: "solar system", titleEn: "Solar System Voyage", titleHi: "सौर मंडल यात्रा", emoji: "🪐",
      items: [
        { en: "Which is the largest planet in the solar system?", hi: "सौर मंडल का सबसे बड़ा ग्रह कौन-सा है?", optionsEn: ["Jupiter", "Saturn", "Earth", "Mars"], optionsHi: ["बृहस्पति", "शनि", "पृथ्वी", "मंगल"] },
        { en: "Which planet is known as the Red Planet?", hi: "किस ग्रह को लाल ग्रह कहते हैं?", optionsEn: ["Mars", "Venus", "Mercury", "Neptune"], optionsHi: ["मंगल", "शुक्र", "बुध", "वरुण"] },
        { en: "How long does the Earth take to revolve around the Sun?", hi: "पृथ्वी को सूर्य की परिक्रमा में कितना समय लगता है?", optionsEn: ["365 days", "30 days", "24 hours", "100 days"], optionsHi: ["365 दिन", "30 दिन", "24 घंटे", "100 दिन"] },
        { en: "Which is the natural satellite of the Earth?", hi: "पृथ्वी का प्राकृतिक उपग्रह कौन-सा है?", optionsEn: ["Moon", "Sun", "Mars", "Venus"], optionsHi: ["चंद्रमा", "सूर्य", "मंगल", "शुक्र"] },
      ],
    },
    {
      topic: "electricity", titleEn: "Electricity and Circuits", titleHi: "विद्युत और परिपथ", emoji: "💡",
      items: [
        { en: "Which material is a good conductor of electricity?", hi: "कौन-सा पदार्थ विद्युत का अच्छा चालक है?", optionsEn: ["Copper", "Rubber", "Wood", "Plastic"], optionsHi: ["ताँबा", "रबर", "लकड़ी", "प्लास्टिक"] },
        { en: "A bulb glows only when the circuit is:", hi: "बल्ब तभी जलता है जब परिपथ हो:", optionsEn: ["Closed", "Open", "Broken", "Wet"], optionsHi: ["बंद (पूर्ण)", "खुला", "टूटा", "गीला"] },
        { en: "Which device stores electrical energy for a torch?", hi: "टॉर्च के लिए विद्युत ऊर्जा कौन संग्रह करता है?", optionsEn: ["Cell (battery)", "Switch", "Wire", "Bulb"], optionsHi: ["सेल (बैटरी)", "स्विच", "तार", "बल्ब"] },
        { en: "What is used to break or complete a circuit?", hi: "परिपथ को जोड़ने या तोड़ने के लिए क्या प्रयोग होता है?", optionsEn: ["Switch", "Bulb", "Cell", "Magnet"], optionsHi: ["स्विच", "बल्ब", "सेल", "चुंबक"] },
      ],
    },
  ];
}

/* ------------------------------------------------------------------ */
/* SOCIAL SCIENCE                                                      */
/* ------------------------------------------------------------------ */

function socialPacks(cls: number): Pack[] {
  if (cls === 1)
    return [
      {
        topic: "my family", titleEn: "My Family and Me", titleHi: "मेरा परिवार और मैं", emoji: "👨‍👩‍👧",
        items: [
          { en: "Your mother's mother is your:", hi: "आपकी माता की माता आपकी कौन हैं?", optionsEn: ["Grandmother", "Aunt", "Sister", "Cousin"], optionsHi: ["नानी", "मौसी", "बहन", "चचेरी बहन"] },
          { en: "A family with parents, children and grandparents is called:", hi: "माता-पिता, बच्चों और दादा-दादी वाला परिवार कहलाता है:", optionsEn: ["Joint family", "Nuclear family", "Single family", "Village"], optionsHi: ["संयुक्त परिवार", "एकल परिवार", "अकेला परिवार", "गाँव"] },
          { en: "Your father's brother is your:", hi: "आपके पिता का भाई आपके कौन हैं?", optionsEn: ["Uncle", "Grandfather", "Brother", "Nephew"], optionsHi: ["चाचा", "दादा", "भाई", "भतीजा"] },
          { en: "Who takes care of us when we are ill at home?", hi: "घर पर बीमार होने पर हमारी देखभाल कौन करता है?", optionsEn: ["Family members", "Strangers", "Shopkeepers", "Drivers"], optionsHi: ["परिवार के सदस्य", "अजनबी", "दुकानदार", "चालक"] },
        ],
      },
      {
        topic: "my school", titleEn: "My School Community", titleHi: "मेरा विद्यालय समुदाय", emoji: "🏫",
        items: [
          { en: "Who teaches students in a school?", hi: "विद्यालय में छात्रों को कौन पढ़ाता है?", optionsEn: ["Teacher", "Driver", "Farmer", "Doctor"], optionsHi: ["शिक्षक", "चालक", "किसान", "डॉक्टर"] },
          { en: "Where do we borrow books in school?", hi: "विद्यालय में किताबें कहाँ से मिलती हैं?", optionsEn: ["Library", "Playground", "Kitchen", "Office gate"], optionsHi: ["पुस्तकालय", "खेल का मैदान", "रसोई", "मुख्य द्वार"] },
          { en: "We should keep our classroom:", hi: "हमें अपनी कक्षा कैसी रखनी चाहिए?", optionsEn: ["Clean", "Dirty", "Noisy", "Dark"], optionsHi: ["स्वच्छ", "गंदी", "शोरगुल वाली", "अँधेरी"] },
          { en: "Which is the correct way to greet a teacher?", hi: "शिक्षक का अभिवादन करने का सही तरीका कौन-सा है?", optionsEn: ["Say Namaste politely", "Shout loudly", "Ignore them", "Run away"], optionsHi: ["विनम्रता से नमस्ते कहना", "ज़ोर से चिल्लाना", "अनदेखा करना", "भाग जाना"] },
        ],
      },
      {
        topic: "neighbourhood", titleEn: "People in My Neighbourhood", titleHi: "मेरे पड़ोस के लोग", emoji: "🏘️",
        items: [
          { en: "Who delivers letters to our homes?", hi: "हमारे घरों तक चिट्ठियाँ कौन पहुँचाता है?", optionsEn: ["Postman", "Cobbler", "Barber", "Tailor"], optionsHi: ["डाकिया", "मोची", "नाई", "दर्जी"] },
          { en: "Who stitches our clothes?", hi: "हमारे कपड़े कौन सिलता है?", optionsEn: ["Tailor", "Farmer", "Doctor", "Driver"], optionsHi: ["दर्जी", "किसान", "डॉक्टर", "चालक"] },
          { en: "Who treats us when we are sick?", hi: "बीमार होने पर हमारा इलाज कौन करता है?", optionsEn: ["Doctor", "Teacher", "Postman", "Carpenter"], optionsHi: ["डॉक्टर", "शिक्षक", "डाकिया", "बढ़ई"] },
          { en: "Who grows food grains for us?", hi: "हमारे लिए अनाज कौन उगाता है?", optionsEn: ["Farmer", "Painter", "Pilot", "Barber"], optionsHi: ["किसान", "चित्रकार", "पायलट", "नाई"] },
        ],
      },
      {
        topic: "festivals", titleEn: "Festivals of India", titleHi: "भारत के त्योहार", emoji: "🪔",
        items: [
          { en: "Which festival is called the festival of lights?", hi: "किस त्योहार को रोशनी का त्योहार कहते हैं?", optionsEn: ["Diwali", "Holi", "Eid", "Pongal"], optionsHi: ["दीवाली", "होली", "ईद", "पोंगल"] },
          { en: "Which festival is known for playing with colours?", hi: "रंगों से खेलने वाला त्योहार कौन-सा है?", optionsEn: ["Holi", "Diwali", "Baisakhi", "Onam"], optionsHi: ["होली", "दीवाली", "बैसाखी", "ओणम"] },
          { en: "Onam is a harvest festival of which state?", hi: "ओणम किस राज्य का फसल त्योहार है?", optionsEn: ["Kerala", "Punjab", "Assam", "Gujarat"], optionsHi: ["केरल", "पंजाब", "असम", "गुजरात"] },
          { en: "On which date is Independence Day celebrated?", hi: "स्वतंत्रता दिवस किस तारीख को मनाया जाता है?", optionsEn: ["15 August", "26 January", "2 October", "14 November"], optionsHi: ["15 अगस्त", "26 जनवरी", "2 अक्टूबर", "14 नवंबर"] },
        ],
      },
    ];
  if (cls === 2)
    return [
      {
        topic: "transport", titleEn: "Means of Transport", titleHi: "परिवहन के साधन", emoji: "🚌",
        items: [
          { en: "Which of these is an air transport?", hi: "इनमें से कौन वायु परिवहन है?", optionsEn: ["Aeroplane", "Bus", "Ship", "Bicycle"], optionsHi: ["वायुयान", "बस", "जहाज़", "साइकिल"] },
          { en: "Which vehicle runs on rails?", hi: "कौन-सा वाहन पटरी पर चलता है?", optionsEn: ["Train", "Truck", "Boat", "Scooter"], optionsHi: ["रेलगाड़ी", "ट्रक", "नाव", "स्कूटर"] },
          { en: "Which transport is used on water?", hi: "पानी पर कौन-सा साधन प्रयोग होता है?", optionsEn: ["Boat", "Auto", "Cycle", "Bus"], optionsHi: ["नाव", "ऑटो", "साइकिल", "बस"] },
          { en: "Which vehicle carries patients quickly to hospital?", hi: "कौन-सा वाहन रोगियों को शीघ्र अस्पताल ले जाता है?", optionsEn: ["Ambulance", "Tractor", "Taxi", "Van"], optionsHi: ["एम्बुलेंस", "ट्रैक्टर", "टैक्सी", "वैन"] },
        ],
      },
      {
        topic: "occupations", titleEn: "Community Helpers Quiz", titleHi: "समुदाय सहायक प्रश्नोत्तरी", emoji: "👮",
        items: [
          { en: "Who maintains law and order in a city?", hi: "शहर में कानून व्यवस्था कौन बनाए रखता है?", optionsEn: ["Police", "Tailor", "Farmer", "Cook"], optionsHi: ["पुलिस", "दर्जी", "किसान", "रसोइया"] },
          { en: "Who puts out fires?", hi: "आग कौन बुझाता है?", optionsEn: ["Firefighter", "Postman", "Barber", "Teacher"], optionsHi: ["अग्निशमन कर्मी", "डाकिया", "नाई", "शिक्षक"] },
          { en: "Who makes wooden furniture?", hi: "लकड़ी का फर्नीचर कौन बनाता है?", optionsEn: ["Carpenter", "Blacksmith", "Potter", "Weaver"], optionsHi: ["बढ़ई", "लोहार", "कुम्हार", "बुनकर"] },
          { en: "Who makes clay pots?", hi: "मिट्टी के बर्तन कौन बनाता है?", optionsEn: ["Potter", "Carpenter", "Doctor", "Driver"], optionsHi: ["कुम्हार", "बढ़ई", "डॉक्टर", "चालक"] },
        ],
      },
      {
        topic: "national symbols", titleEn: "National Symbols of India", titleHi: "भारत के राष्ट्रीय प्रतीक", emoji: "🇮🇳",
        items: [
          { en: "What is the national animal of India?", hi: "भारत का राष्ट्रीय पशु कौन-सा है?", optionsEn: ["Tiger", "Lion", "Elephant", "Deer"], optionsHi: ["बाघ", "शेर", "हाथी", "हिरण"] },
          { en: "What is the national bird of India?", hi: "भारत का राष्ट्रीय पक्षी कौन-सा है?", optionsEn: ["Peacock", "Parrot", "Crow", "Eagle"], optionsHi: ["मोर", "तोता", "कौआ", "गरुड़"] },
          { en: "How many colours are there in the Indian flag?", hi: "भारतीय ध्वज में कितने रंग होते हैं?", optionsEn: ["3", "2", "4", "5"], optionsHi: ["3", "2", "4", "5"] },
          { en: "What is the national flower of India?", hi: "भारत का राष्ट्रीय पुष्प कौन-सा है?", optionsEn: ["Lotus", "Rose", "Marigold", "Sunflower"], optionsHi: ["कमल", "गुलाब", "गेंदा", "सूरजमुखी"] },
        ],
      },
      {
        topic: "our village and city", titleEn: "Village and City Life", titleHi: "गाँव और शहर का जीवन", emoji: "🌾",
        items: [
          { en: "Which is the main occupation in villages?", hi: "गाँवों का मुख्य व्यवसाय क्या है?", optionsEn: ["Farming", "Banking", "Software work", "Air travel"], optionsHi: ["कृषि", "बैंकिंग", "सॉफ्टवेयर कार्य", "हवाई यात्रा"] },
          { en: "Where would you find tall buildings and heavy traffic?", hi: "ऊँची इमारतें और अधिक यातायात कहाँ मिलते हैं?", optionsEn: ["City", "Village", "Forest", "Desert"], optionsHi: ["शहर", "गाँव", "जंगल", "रेगिस्तान"] },
          { en: "A village head in a panchayat is called:", hi: "पंचायत के मुखिया को क्या कहते हैं?", optionsEn: ["Sarpanch", "Mayor", "Collector", "Governor"], optionsHi: ["सरपंच", "महापौर", "कलेक्टर", "राज्यपाल"] },
          { en: "Which place in a village stores grains?", hi: "गाँव में अनाज कहाँ रखा जाता है?", optionsEn: ["Granary", "Bank", "Cinema", "Airport"], optionsHi: ["अनाज भंडार", "बैंक", "सिनेमा", "हवाई अड्डा"] },
        ],
      },
    ];
  if (cls === 3)
    return [
      {
        topic: "maps", titleEn: "Reading Maps and Directions", titleHi: "मानचित्र और दिशाएँ", emoji: "🧭",
        items: [
          { en: "The sun rises in which direction?", hi: "सूर्य किस दिशा में उगता है?", optionsEn: ["East", "West", "North", "South"], optionsHi: ["पूर्व", "पश्चिम", "उत्तर", "दक्षिण"] },
          { en: "Which instrument shows direction?", hi: "कौन-सा यंत्र दिशा बताता है?", optionsEn: ["Compass", "Thermometer", "Clock", "Ruler"], optionsHi: ["दिक्सूचक (कंपास)", "थर्मामीटर", "घड़ी", "पैमाना"] },
          { en: "On a map, blue colour usually shows:", hi: "मानचित्र पर नीला रंग सामान्यतः क्या दर्शाता है?", optionsEn: ["Water bodies", "Mountains", "Forests", "Deserts"], optionsHi: ["जल क्षेत्र", "पर्वत", "वन", "रेगिस्तान"] },
          { en: "How many main directions are there?", hi: "मुख्य दिशाएँ कितनी होती हैं?", optionsEn: ["4", "2", "6", "8"], optionsHi: ["4", "2", "6", "8"] },
        ],
      },
      {
        topic: "our country", titleEn: "Know Your India", titleHi: "अपने भारत को जानें", emoji: "🗺️",
        items: [
          { en: "What is the capital of India?", hi: "भारत की राजधानी क्या है?", optionsEn: ["New Delhi", "Mumbai", "Kolkata", "Chennai"], optionsHi: ["नई दिल्ली", "मुंबई", "कोलकाता", "चेन्नई"] },
          { en: "Which is the longest river of India?", hi: "भारत की सबसे लंबी नदी कौन-सी है?", optionsEn: ["Ganga", "Yamuna", "Godavari", "Narmada"], optionsHi: ["गंगा", "यमुना", "गोदावरी", "नर्मदा"] },
          { en: "Which mountain range lies to the north of India?", hi: "भारत के उत्तर में कौन-सी पर्वत श्रृंखला है?", optionsEn: ["Himalayas", "Aravalli", "Nilgiri", "Vindhya"], optionsHi: ["हिमालय", "अरावली", "नीलगिरि", "विंध्य"] },
          { en: "Which ocean lies to the south of India?", hi: "भारत के दक्षिण में कौन-सा महासागर है?", optionsEn: ["Indian Ocean", "Pacific Ocean", "Arctic Ocean", "Atlantic Ocean"], optionsHi: ["हिंद महासागर", "प्रशांत महासागर", "आर्कटिक महासागर", "अटलांटिक महासागर"] },
        ],
      },
      {
        topic: "food and farming", titleEn: "From Farm to Plate", titleHi: "खेत से थाली तक", emoji: "🌾",
        items: [
          { en: "Which crop is grown mainly in the rainy season?", hi: "कौन-सी फसल मुख्यतः वर्षा ऋतु में उगाई जाती है?", optionsEn: ["Rice", "Wheat", "Mustard", "Barley"], optionsHi: ["धान", "गेहूँ", "सरसों", "जौ"] },
          { en: "Which tool is used to plough the field?", hi: "खेत जोतने के लिए कौन-सा उपकरण प्रयोग होता है?", optionsEn: ["Plough", "Hammer", "Saw", "Needle"], optionsHi: ["हल", "हथौड़ा", "आरी", "सुई"] },
          { en: "Wheat is used mainly to make:", hi: "गेहूँ से मुख्य रूप से क्या बनता है?", optionsEn: ["Flour", "Sugar", "Oil", "Salt"], optionsHi: ["आटा", "चीनी", "तेल", "नमक"] },
          { en: "Crops grown in winter are called:", hi: "सर्दियों में उगाई जाने वाली फसलें कहलाती हैं:", optionsEn: ["Rabi crops", "Kharif crops", "Zaid crops", "Cash crops"], optionsHi: ["रबी फसलें", "खरीफ फसलें", "जायद फसलें", "नकदी फसलें"] },
        ],
      },
      {
        topic: "clothing", titleEn: "Clothes We Wear", titleHi: "हमारे वस्त्र", emoji: "👗",
        items: [
          { en: "Cotton clothes are best for which season?", hi: "सूती कपड़े किस ऋतु के लिए सर्वोत्तम हैं?", optionsEn: ["Summer", "Winter", "Snowfall", "Night only"], optionsHi: ["ग्रीष्म ऋतु", "शीत ऋतु", "बर्फबारी", "केवल रात"] },
          { en: "Wool comes from which animal?", hi: "ऊन किस पशु से मिलता है?", optionsEn: ["Sheep", "Cow", "Hen", "Fish"], optionsHi: ["भेड़", "गाय", "मुर्गी", "मछली"] },
          { en: "Silk is obtained from:", hi: "रेशम किससे प्राप्त होता है?", optionsEn: ["Silkworm", "Cotton plant", "Jute plant", "Sheep"], optionsHi: ["रेशम कीट", "कपास का पौधा", "जूट का पौधा", "भेड़"] },
          { en: "Which fibre comes from a plant?", hi: "कौन-सा रेशा पौधे से मिलता है?", optionsEn: ["Cotton", "Wool", "Silk", "Nylon"], optionsHi: ["कपास", "ऊन", "रेशम", "नायलॉन"] },
        ],
      },
    ];
  if (cls === 4)
    return [
      {
        topic: "states of india", titleEn: "States and Capitals", titleHi: "राज्य और राजधानियाँ", emoji: "🏛️",
        items: [
          { en: "What is the capital of Maharashtra?", hi: "महाराष्ट्र की राजधानी क्या है?", optionsEn: ["Mumbai", "Pune", "Nagpur", "Nashik"], optionsHi: ["मुंबई", "पुणे", "नागपुर", "नासिक"] },
          { en: "What is the capital of Tamil Nadu?", hi: "तमिलनाडु की राजधानी क्या है?", optionsEn: ["Chennai", "Madurai", "Coimbatore", "Salem"], optionsHi: ["चेन्नई", "मदुरै", "कोयंबटूर", "सेलम"] },
          { en: "Jaipur is the capital of which state?", hi: "जयपुर किस राज्य की राजधानी है?", optionsEn: ["Rajasthan", "Gujarat", "Punjab", "Haryana"], optionsHi: ["राजस्थान", "गुजरात", "पंजाब", "हरियाणा"] },
          { en: "Which state is known for its tea gardens in the north-east?", hi: "पूर्वोत्तर में चाय बागानों के लिए कौन-सा राज्य प्रसिद्ध है?", optionsEn: ["Assam", "Bihar", "Odisha", "Goa"], optionsHi: ["असम", "बिहार", "ओडिशा", "गोवा"] },
        ],
      },
      {
        topic: "rivers", titleEn: "Rivers of India", titleHi: "भारत की नदियाँ", emoji: "🏞️",
        items: [
          { en: "The Ganga originates from which glacier?", hi: "गंगा किस हिमनद से निकलती है?", optionsEn: ["Gangotri", "Yamunotri", "Siachen", "Zemu"], optionsHi: ["गंगोत्री", "यमुनोत्री", "सियाचिन", "ज़ेमू"] },
          { en: "Which river flows through Delhi?", hi: "दिल्ली से कौन-सी नदी बहती है?", optionsEn: ["Yamuna", "Ganga", "Kaveri", "Krishna"], optionsHi: ["यमुना", "गंगा", "कावेरी", "कृष्णा"] },
          { en: "Which river is called the Dakshin Ganga?", hi: "किस नदी को दक्षिण गंगा कहते हैं?", optionsEn: ["Godavari", "Narmada", "Tapi", "Mahanadi"], optionsHi: ["गोदावरी", "नर्मदा", "ताप्ती", "महानदी"] },
          { en: "Rivers are important mainly because they provide:", hi: "नदियाँ मुख्यतः किस कारण महत्वपूर्ण हैं?", optionsEn: ["Water for irrigation", "Metal ores", "Petrol", "Cotton cloth"], optionsHi: ["सिंचाई के लिए जल", "धातु अयस्क", "पेट्रोल", "सूती कपड़ा"] },
        ],
      },
      {
        topic: "freedom fighters", titleEn: "Freedom Fighters of India", titleHi: "भारत के स्वतंत्रता सेनानी", emoji: "🕊️",
        items: [
          { en: "Who is known as the Father of the Nation in India?", hi: "भारत में राष्ट्रपिता किसे कहा जाता है?", optionsEn: ["Mahatma Gandhi", "Bhagat Singh", "Nehru", "Tilak"], optionsHi: ["महात्मा गांधी", "भगत सिंह", "नेहरू", "तिलक"] },
          { en: "Who gave the slogan 'Jai Hind'?", hi: "'जय हिंद' का नारा किसने दिया?", optionsEn: ["Subhash Chandra Bose", "Gandhi ji", "Sardar Patel", "Rajendra Prasad"], optionsHi: ["सुभाष चंद्र बोस", "गांधी जी", "सरदार पटेल", "राजेंद्र प्रसाद"] },
          { en: "Who was the first Prime Minister of India?", hi: "भारत के पहले प्रधानमंत्री कौन थे?", optionsEn: ["Jawaharlal Nehru", "Sardar Patel", "Indira Gandhi", "Lal Bahadur Shastri"], optionsHi: ["जवाहरलाल नेहरू", "सरदार पटेल", "इंदिरा गांधी", "लाल बहादुर शास्त्री"] },
          { en: "Rani Lakshmibai was the queen of:", hi: "रानी लक्ष्मीबाई किसकी रानी थीं?", optionsEn: ["Jhansi", "Mysore", "Awadh", "Gwalior"], optionsHi: ["झाँसी", "मैसूर", "अवध", "ग्वालियर"] },
        ],
      },
      {
        topic: "natural resources", titleEn: "Natural Resources Around Us", titleHi: "हमारे चारों ओर प्राकृतिक संसाधन", emoji: "⛏️",
        items: [
          { en: "Which of these is a natural resource?", hi: "इनमें से कौन प्राकृतिक संसाधन है?", optionsEn: ["Forest", "Plastic chair", "Cement road", "Steel gate"], optionsHi: ["वन", "प्लास्टिक कुर्सी", "सीमेंट सड़क", "स्टील गेट"] },
          { en: "Coal and petroleum are called:", hi: "कोयला और पेट्रोलियम क्या कहलाते हैं?", optionsEn: ["Fossil fuels", "Renewable fuels", "Minerals only", "Metals"], optionsHi: ["जीवाश्म ईंधन", "नवीकरणीय ईंधन", "केवल खनिज", "धातुएँ"] },
          { en: "Which resource can be replaced quickly by nature?", hi: "कौन-सा संसाधन प्रकृति शीघ्र पुनः बना देती है?", optionsEn: ["Sunlight", "Coal", "Petroleum", "Natural gas"], optionsHi: ["सूर्य का प्रकाश", "कोयला", "पेट्रोलियम", "प्राकृतिक गैस"] },
          { en: "Cutting down forests is called:", hi: "वनों की कटाई को क्या कहते हैं?", optionsEn: ["Deforestation", "Afforestation", "Irrigation", "Cultivation"], optionsHi: ["वनोन्मूलन", "वनरोपण", "सिंचाई", "खेती"] },
        ],
      },
    ];
  return [
    {
      topic: "government", titleEn: "How Our Government Works", titleHi: "हमारी सरकार कैसे काम करती है", emoji: "🏛️",
      items: [
        { en: "Who is the head of the Indian government?", hi: "भारत सरकार का प्रमुख कौन होता है?", optionsEn: ["Prime Minister", "President", "Governor", "Mayor"], optionsHi: ["प्रधानमंत्री", "राष्ट्रपति", "राज्यपाल", "महापौर"] },
        { en: "The Indian Constitution came into force on:", hi: "भारतीय संविधान कब लागू हुआ?", optionsEn: ["26 January 1950", "15 August 1947", "2 October 1948", "26 November 1949"], optionsHi: ["26 जनवरी 1950", "15 अगस्त 1947", "2 अक्टूबर 1948", "26 नवंबर 1949"] },
        { en: "At what age can an Indian citizen vote?", hi: "भारतीय नागरिक किस आयु में मतदान कर सकता है?", optionsEn: ["18 years", "16 years", "21 years", "25 years"], optionsHi: ["18 वर्ष", "16 वर्ष", "21 वर्ष", "25 वर्ष"] },
        { en: "Local government in villages is run by the:", hi: "गाँवों में स्थानीय शासन कौन चलाता है?", optionsEn: ["Gram Panchayat", "Municipality", "Parliament", "High Court"], optionsHi: ["ग्राम पंचायत", "नगरपालिका", "संसद", "उच्च न्यायालय"] },
      ],
    },
    {
      topic: "climate", titleEn: "Climate and Seasons of India", titleHi: "भारत की जलवायु और ऋतुएँ", emoji: "🌡️",
      items: [
        { en: "Which winds bring rain to most of India?", hi: "अधिकांश भारत में वर्षा कौन-सी पवनें लाती हैं?", optionsEn: ["South-west monsoon", "Trade winds", "Polar winds", "Loo winds"], optionsHi: ["दक्षिण-पश्चिम मानसून", "व्यापारिक पवनें", "ध्रुवीय पवनें", "लू"] },
        { en: "Which Indian state receives the highest rainfall?", hi: "भारत के किस राज्य में सर्वाधिक वर्षा होती है?", optionsEn: ["Meghalaya", "Rajasthan", "Punjab", "Haryana"], optionsHi: ["मेघालय", "राजस्थान", "पंजाब", "हरियाणा"] },
        { en: "The hot dry wind of north India in summer is called:", hi: "उत्तर भारत में ग्रीष्म की गर्म शुष्क हवा को क्या कहते हैं?", optionsEn: ["Loo", "Monsoon", "Cyclone", "Blizzard"], optionsHi: ["लू", "मानसून", "चक्रवात", "हिमझंझा"] },
        { en: "Which region of India is a cold desert?", hi: "भारत का कौन-सा क्षेत्र शीत मरुस्थल है?", optionsEn: ["Ladakh", "Thar", "Konkan", "Sundarbans"], optionsHi: ["लद्दाख", "थार", "कोंकण", "सुंदरबन"] },
      ],
    },
    {
      topic: "ancient india", titleEn: "Ancient India Time Travel", titleHi: "प्राचीन भारत समय यात्रा", emoji: "🏺",
      items: [
        { en: "Mohenjo-daro was a city of which civilisation?", hi: "मोहनजोदड़ो किस सभ्यता का नगर था?", optionsEn: ["Indus Valley", "Maurya", "Gupta", "Chola"], optionsHi: ["सिंधु घाटी", "मौर्य", "गुप्त", "चोल"] },
        { en: "Which emperor spread Buddhism after the Kalinga war?", hi: "कलिंग युद्ध के बाद किस सम्राट ने बौद्ध धर्म का प्रसार किया?", optionsEn: ["Ashoka", "Chandragupta II", "Akbar", "Harsha"], optionsHi: ["अशोक", "चंद्रगुप्त द्वितीय", "अकबर", "हर्ष"] },
        { en: "The Sanchi Stupa is located in which state?", hi: "साँची स्तूप किस राज्य में है?", optionsEn: ["Madhya Pradesh", "Bihar", "Odisha", "Karnataka"], optionsHi: ["मध्य प्रदेश", "बिहार", "ओडिशा", "कर्नाटक"] },
        { en: "Which script was used on Ashoka's edicts?", hi: "अशोक के अभिलेखों में कौन-सी लिपि प्रयुक्त हुई?", optionsEn: ["Brahmi", "Devanagari", "Roman", "Persian"], optionsHi: ["ब्राह्मी", "देवनागरी", "रोमन", "फ़ारसी"] },
      ],
    },
    {
      topic: "transport and communication", titleEn: "Transport & Communication Today", titleHi: "आज का परिवहन एवं संचार", emoji: "📡",
      items: [
        { en: "Which is the fastest means of long-distance travel?", hi: "लंबी दूरी की यात्रा का सबसे तेज़ साधन कौन-सा है?", optionsEn: ["Aeroplane", "Train", "Bus", "Ship"], optionsHi: ["वायुयान", "रेलगाड़ी", "बस", "जहाज़"] },
        { en: "Indian Railways is mainly used to carry:", hi: "भारतीय रेल मुख्य रूप से किसे ढोती है?", optionsEn: ["Passengers and goods", "Only letters", "Only fuel", "Only animals"], optionsHi: ["यात्री और माल", "केवल पत्र", "केवल ईंधन", "केवल पशु"] },
        { en: "Which invention lets us talk to people far away instantly?", hi: "कौन-सा आविष्कार दूर बैठे लोगों से तुरंत बात कराता है?", optionsEn: ["Telephone", "Printing press", "Plough", "Compass"], optionsHi: ["टेलीफोन", "छापाखाना", "हल", "दिक्सूचक"] },
        { en: "Satellites are mainly used for communication and:", hi: "उपग्रह मुख्यतः संचार और किसमें प्रयुक्त होते हैं?", optionsEn: ["Weather forecasting", "Farming ploughs", "Cooking", "Tailoring"], optionsHi: ["मौसम पूर्वानुमान", "खेत जोतना", "खाना बनाना", "सिलाई"] },
      ],
    },
  ];
}

/* ------------------------------------------------------------------ */
/* BUILD THE MATRIX                                                    */
/* ------------------------------------------------------------------ */

export const SUBJECT_LIST = ["Math", "Science", "Social Science"] as const;
export const CLASS_LIST = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"] as const;
export const LANGUAGE_LIST = ["English", "Hindi"] as const;

const SUBJECT_CODE: Record<string, string> = { Math: "m", Science: "s", "Social Science": "ss" };

function packsFor(subject: string, cls: number): Pack[] {
  if (subject === "Math") return mathPacks(cls);
  if (subject === "Science") return sciencePacks(cls);
  return socialPacks(cls);
}

function build(): WorkingGame[] {
  const out: WorkingGame[] = [];
  SUBJECT_LIST.forEach((subject) => {
    CLASS_LIST.forEach((classLevel, ci) => {
      const cls = ci + 1;
      const packs = packsFor(subject, cls);
      LANGUAGE_LIST.forEach((language) => {
        packs.forEach((pack, pi) => {
          const langCode = language === "English" ? "e" : "h";
          const id = `${SUBJECT_CODE[subject]}-c${cls}-${langCode}-${pi + 1}`;
          const questions = pack.items.map((item, qi) => {
            const raw = language === "English" ? item.optionsEn : item.optionsHi;
            const { options, correct } = shuffleWithCorrect(raw, cls * 977 + pi * 131 + qi * 17 + (langCode === "e" ? 3 : 11));
            return { q: language === "English" ? item.en : item.hi, options, correct };
          });
          out.push({
            id,
            title: language === "English" ? pack.titleEn : `${pack.titleHi} (${pack.titleEn})`,
            subject: subject as WorkingGame["subject"],
            classLevel,
            language,
            topic: pack.topic,
            emoji: pack.emoji,
            questions,
          });
        });
      });
    });
  });
  return out;
}

export const WORKING_GAME_LIBRARY: WorkingGame[] = build();

export function findWorkingGame(id: string): WorkingGame | undefined {
  return WORKING_GAME_LIBRARY.find((g) => g.id === id);
}

export const TOTAL_WORKING_GAMES = WORKING_GAME_LIBRARY.length;