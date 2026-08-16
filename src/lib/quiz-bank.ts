export type BankQuestion = {
  prompt_en: string;
  prompt_hi: string;
  options_en: string[];
  options_hi: string[];
  answer: number;
};

type Seed = {
  en: string;
  loc: string;
  optionsEn: string[];
  optionsLoc: string[];
  correct: number;
};

/* ------------------------------------------------------------------ *
 * Utilities
 * ------------------------------------------------------------------ */

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rndInt = (r: () => number, min: number, max: number) => min + Math.floor(r() * (max - min + 1));

function pickMany<T>(arr: T[], n: number, r: () => number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (copy.length > 0 && out.length < n) out.push(copy.splice(Math.floor(r() * copy.length), 1)[0]!);
  return out;
}

/** Build 4 unique numeric options around a correct value. */
function numericOptions(correct: number, spread: number, r: () => number): string[] {
  const set = new Set<number>([correct]);
  let guard = 0;
  while (set.size < 4 && guard++ < 50) {
    const delta = rndInt(r, 1, spread) * (r() < 0.5 ? -1 : 1);
    const candidate = correct + delta;
    if (candidate > 0) set.add(candidate);
  }
  while (set.size < 4) set.add(correct + set.size);
  return [...set].map(String);
}

/* ------------------------------------------------------------------ *
 * Maths — procedurally generated real calculations, scaled by class
 * ------------------------------------------------------------------ */

type MathPhrase = {
  sum: (a: number, b: number) => string;
  diff: (a: number, b: number) => string;
  product: (a: number, b: number) => string;
  divide: (a: number, b: number) => string;
  money: (kg: number, rate: number) => string;
  perimeter: (s: number) => string;
  area: (l: number, w: number) => string;
  fraction: () => string;
  cm: (n: number) => string;
  sqcm: (n: number) => string;
};

const MATH: Record<string, MathPhrase> = {
  English: {
    sum: (a, b) => `Find the sum of ${a} and ${b}.`,
    diff: (a, b) => `What is ${a} − ${b}?`,
    product: (a, b) => `What is ${a} × ${b}?`,
    divide: (a, b) => `What is ${a} ÷ ${b}?`,
    money: (kg, rate) => `A shopkeeper sells rice at ₹${rate} per kg. What is the cost of ${kg} kg?`,
    perimeter: (s) => `What is the perimeter of a square of side ${s} cm?`,
    area: (l, w) => `What is the area of a rectangle ${l} cm long and ${w} cm wide?`,
    fraction: () => `Which fraction is the largest?`,
    cm: (n) => `${n} cm`,
    sqcm: (n) => `${n} sq cm`,
  },
  Hindi: {
    sum: (a, b) => `${a} और ${b} का योग क्या होगा?`,
    diff: (a, b) => `${a} − ${b} कितना होता है?`,
    product: (a, b) => `${a} × ${b} का गुणनफल क्या है?`,
    divide: (a, b) => `${a} ÷ ${b} कितना होता है?`,
    money: (kg, rate) => `एक दुकानदार ₹${rate} प्रति किलो की दर से चावल बेचता है। ${kg} किलो का मूल्य कितना होगा?`,
    perimeter: (s) => `${s} सेमी भुजा वाले वर्ग का परिमाप क्या होगा?`,
    area: (l, w) => `${l} सेमी लंबे और ${w} सेमी चौड़े आयत का क्षेत्रफल क्या है?`,
    fraction: () => `इनमें से सबसे बड़ी भिन्न कौन-सी है?`,
    cm: (n) => `${n} सेमी`,
    sqcm: (n) => `${n} वर्ग सेमी`,
  },
  Tamil: {
    sum: (a, b) => `${a} மற்றும் ${b} இன் கூட்டுத்தொகை என்ன?`,
    diff: (a, b) => `${a} − ${b} எவ்வளவு?`,
    product: (a, b) => `${a} × ${b} எவ்வளவு?`,
    divide: (a, b) => `${a} ÷ ${b} எவ்வளவு?`,
    money: (kg, rate) => `கடைக்காரர் அரிசியை கிலோ ₹${rate} விற்கிறார். ${kg} கிலோ விலை என்ன?`,
    perimeter: (s) => `${s} செ.மீ பக்கமுள்ள சதுரத்தின் சுற்றளவு என்ன?`,
    area: (l, w) => `${l} செ.மீ நீளம், ${w} செ.மீ அகலமுள்ள செவ்வகத்தின் பரப்பளவு என்ன?`,
    fraction: () => `இவற்றில் பெரிய பின்னம் எது?`,
    cm: (n) => `${n} செ.மீ`,
    sqcm: (n) => `${n} ச.செ.மீ`,
  },
  Kannada: {
    sum: (a, b) => `${a} ಮತ್ತು ${b} ರ ಮೊತ್ತ ಎಷ್ಟು?`,
    diff: (a, b) => `${a} − ${b} ಎಷ್ಟು?`,
    product: (a, b) => `${a} × ${b} ಎಷ್ಟು?`,
    divide: (a, b) => `${a} ÷ ${b} ಎಷ್ಟು?`,
    money: (kg, rate) => `ಅಂಗಡಿಯವನು ಅಕ್ಕಿಯನ್ನು ಕಿಲೋಗೆ ₹${rate} ಕ್ಕೆ ಮಾರುತ್ತಾನೆ. ${kg} ಕಿಲೋ ಬೆಲೆ ಎಷ್ಟು?`,
    perimeter: (s) => `${s} ಸೆಂ.ಮೀ ಬಾಹುವಿನ ಚೌಕದ ಸುತ್ತಳತೆ ಎಷ್ಟು?`,
    area: (l, w) => `${l} ಸೆಂ.ಮೀ ಉದ್ದ ಮತ್ತು ${w} ಸೆಂ.ಮೀ ಅಗಲದ ಆಯತದ ವಿಸ್ತೀರ್ಣ ಎಷ್ಟು?`,
    fraction: () => `ಇವುಗಳಲ್ಲಿ ದೊಡ್ಡ ಭಿನ್ನರಾಶಿ ಯಾವುದು?`,
    cm: (n) => `${n} ಸೆಂ.ಮೀ`,
    sqcm: (n) => `${n} ಚ.ಸೆಂ.ಮೀ`,
  },
  Bengali: {
    sum: (a, b) => `${a} এবং ${b} এর যোগফল কত?`,
    diff: (a, b) => `${a} − ${b} কত?`,
    product: (a, b) => `${a} × ${b} কত?`,
    divide: (a, b) => `${a} ÷ ${b} কত?`,
    money: (kg, rate) => `দোকানদার প্রতি কেজি চাল ₹${rate} দরে বিক্রি করেন। ${kg} কেজির দাম কত?`,
    perimeter: (s) => `${s} সেমি বাহুবিশিষ্ট বর্গক্ষেত্রের পরিসীমা কত?`,
    area: (l, w) => `${l} সেমি লম্বা ও ${w} সেমি চওড়া আয়তক্ষেত্রের ক্ষেত্রফল কত?`,
    fraction: () => `নিচের কোন ভগ্নাংশটি বৃহত্তম?`,
    cm: (n) => `${n} সেমি`,
    sqcm: (n) => `${n} বর্গ সেমি`,
  },
  Marathi: {
    sum: (a, b) => `${a} आणि ${b} यांची बेरीज किती?`,
    diff: (a, b) => `${a} − ${b} किती?`,
    product: (a, b) => `${a} × ${b} किती?`,
    divide: (a, b) => `${a} ÷ ${b} किती?`,
    money: (kg, rate) => `दुकानदार ₹${rate} प्रति किलो दराने तांदूळ विकतो. ${kg} किलोची किंमत किती?`,
    perimeter: (s) => `${s} सेमी बाजू असलेल्या चौरसाची परिमिती किती?`,
    area: (l, w) => `${l} सेमी लांब आणि ${w} सेमी रुंद आयताचे क्षेत्रफळ किती?`,
    fraction: () => `यापैकी सर्वात मोठा अपूर्णांक कोणता?`,
    cm: (n) => `${n} सेमी`,
    sqcm: (n) => `${n} चौ. सेमी`,
  },
  Telugu: {
    sum: (a, b) => `${a} మరియు ${b} ల మొత్తం ఎంత?`,
    diff: (a, b) => `${a} − ${b} ఎంత?`,
    product: (a, b) => `${a} × ${b} ఎంత?`,
    divide: (a, b) => `${a} ÷ ${b} ఎంత?`,
    money: (kg, rate) => `ఒక దుకాణదారుడు కిలో బియ్యాన్ని ₹${rate} కి అమ్ముతాడు. ${kg} కిలోల ధర ఎంత?`,
    perimeter: (s) => `${s} సెం.మీ భుజం గల చతురస్రం చుట్టుకొలత ఎంత?`,
    area: (l, w) => `${l} సెం.మీ పొడవు, ${w} సెం.మీ వెడల్పు గల దీర్ఘచతురస్రం వైశాల్యం ఎంత?`,
    fraction: () => `వీటిలో అతిపెద్ద భిన్నం ఏది?`,
    cm: (n) => `${n} సెం.మీ`,
    sqcm: (n) => `${n} చ.సెం.మీ`,
  },
};

function classTier(classLevel: string): number {
  const n = Number(classLevel.replace(/\D+/g, "")) || 5;
  return n;
}

function mathSeeds(classLevel: string, language: string, r: () => number): Seed[] {
  const en = MATH["English"]!;
  const lc = MATH[language] ?? en;
  const n = classTier(classLevel);
  const big = n <= 2 ? 20 : n <= 4 ? 200 : n <= 6 ? 900 : 5000;
  const small = n <= 2 ? 5 : n <= 4 ? 9 : 12;

  const seeds: Seed[] = [];

  // 1. Addition
  {
    const a = rndInt(r, Math.floor(big / 4), big);
    const b = rndInt(r, Math.floor(big / 5), big);
    const opts = numericOptions(a + b, Math.max(4, Math.round(big / 20)), r);
    seeds.push({
      en: en.sum(a, b),
      loc: lc.sum(a, b),
      optionsEn: opts,
      optionsLoc: opts,
      correct: opts.indexOf(String(a + b)),
    });
  }
  // 2. Subtraction
  {
    const a = rndInt(r, Math.floor(big / 2), big);
    const b = rndInt(r, 10, Math.max(11, Math.floor(a / 2)));
    const opts = numericOptions(a - b, Math.max(3, Math.round(big / 25)), r);
    seeds.push({
      en: en.diff(a, b),
      loc: lc.diff(a, b),
      optionsEn: opts,
      optionsLoc: opts,
      correct: opts.indexOf(String(a - b)),
    });
  }
  // 3. Multiplication or division
  {
    const a = rndInt(r, 3, small);
    const b = rndInt(r, 3, small);
    if (r() < 0.5) {
      const opts = numericOptions(a * b, Math.max(3, small), r);
      seeds.push({
        en: en.product(a, b),
        loc: lc.product(a, b),
        optionsEn: opts,
        optionsLoc: opts,
        correct: opts.indexOf(String(a * b)),
      });
    } else {
      const prod = a * b;
      const opts = numericOptions(a, Math.max(3, Math.round(small / 2)), r);
      seeds.push({
        en: en.divide(prod, b),
        loc: lc.divide(prod, b),
        optionsEn: opts,
        optionsLoc: opts,
        correct: opts.indexOf(String(a)),
      });
    }
  }
  // 4. Money word problem
  {
    const rate = rndInt(r, 25, 90);
    const kg = rndInt(r, 2, 9);
    const total = rate * kg;
    const opts = numericOptions(total, 30, r).map((v) => `₹${v}`);
    seeds.push({
      en: en.money(kg, rate),
      loc: lc.money(kg, rate),
      optionsEn: opts,
      optionsLoc: opts,
      correct: opts.indexOf(`₹${total}`),
    });
  }
  // 5. Geometry or fractions
  if (r() < 0.6) {
    if (r() < 0.5) {
      const s = rndInt(r, 4, 15);
      const opts = numericOptions(4 * s, 12, r);
      seeds.push({
        en: en.perimeter(s),
        loc: lc.perimeter(s),
        optionsEn: opts.map((v) => en.cm(Number(v))),
        optionsLoc: opts.map((v) => lc.cm(Number(v))),
        correct: opts.indexOf(String(4 * s)),
      });
    } else {
      const l = rndInt(r, 4, 14);
      const w = rndInt(r, 3, 12);
      const opts = numericOptions(l * w, 15, r);
      seeds.push({
        en: en.area(l, w),
        loc: lc.area(l, w),
        optionsEn: opts.map((v) => en.sqcm(Number(v))),
        optionsLoc: opts.map((v) => lc.sqcm(Number(v))),
        correct: opts.indexOf(String(l * w)),
      });
    }
  } else {
    const pool = ["3/4", "1/2", "2/5", "1/3", "5/6", "2/3", "1/4", "7/8"];
    const chosen = pickMany(pool, 4, r);
    const value = (f: string) => {
      const [a, b] = f.split("/").map(Number);
      return a! / b!;
    };
    const best = chosen.reduce((m, f) => (value(f) > value(m) ? f : m), chosen[0]!);
    seeds.push({
      en: en.fraction(),
      loc: lc.fraction(),
      optionsEn: chosen,
      optionsLoc: chosen,
      correct: chosen.indexOf(best),
    });
  }

  return seeds;
}

/* ------------------------------------------------------------------ *
 * Fact-based subjects — curricular questions, translated per language
 * ------------------------------------------------------------------ */

type Fact = {
  q: Record<string, string>;
  o: Record<string, string[]>; // options, correct answer always first here
};

const L = (en: string, hi: string, ta?: string) => ({ English: en, Hindi: hi, ...(ta ? { Tamil: ta } : {}) });

const SCIENCE: Fact[] = [
  {
    q: L("Which organ helps a fish breathe underwater?", "मछली पानी के अंदर किस अंग से साँस लेती है?", "மீன் நீருக்குள் எந்த உறுப்பால் சுவாசிக்கிறது?"),
    o: {
      English: ["Gills", "Lungs", "Fins", "Scales"],
      Hindi: ["गलफड़े", "फेफड़े", "पंख", "शल्क"],
      Tamil: ["செவுள்கள்", "நுரையீரல்", "துடுப்புகள்", "செதில்கள்"],
    },
  },
  {
    q: L("What do green plants need for photosynthesis?", "प्रकाश संश्लेषण के लिए हरे पौधों को क्या चाहिए?", "ஒளிச்சேர்க்கைக்கு பச்சைத் தாவரங்களுக்கு எது தேவை?"),
    o: {
      English: ["Sunlight, water and carbon dioxide", "Only soil", "Moonlight and salt", "Oxygen and sand"],
      Hindi: ["सूर्य का प्रकाश, जल और कार्बन डाइऑक्साइड", "केवल मिट्टी", "चाँदनी और नमक", "ऑक्सीजन और रेत"],
      Tamil: ["சூரிய ஒளி, நீர், கார்பன் டை ஆக்சைடு", "மண் மட்டும்", "நிலவொளியும் உப்பும்", "ஆக்சிஜனும் மணலும்"],
    },
  },
  {
    q: L("At what temperature does water boil at sea level?", "समुद्र तल पर पानी किस तापमान पर उबलता है?", "கடல் மட்டத்தில் நீர் எந்த வெப்பநிலையில் கொதிக்கிறது?"),
    o: {
      English: ["100°C", "50°C", "0°C", "150°C"],
      Hindi: ["100°C", "50°C", "0°C", "150°C"],
      Tamil: ["100°C", "50°C", "0°C", "150°C"],
    },
  },
  {
    q: L("Which organ pumps blood through the human body?", "मानव शरीर में रक्त को पंप करने वाला अंग कौन-सा है?", "மனித உடலில் இரத்தத்தை செலுத்தும் உறுப்பு எது?"),
    o: {
      English: ["Heart", "Liver", "Kidney", "Stomach"],
      Hindi: ["हृदय", "यकृत", "गुर्दा", "आमाशय"],
      Tamil: ["இதயம்", "கல்லீரல்", "சிறுநீரகம்", "இரைப்பை"],
    },
  },
  {
    q: L("Which part of a plant absorbs water from the soil?", "पौधे का कौन-सा भाग मिट्टी से जल सोखता है?", "தாவரத்தின் எந்தப் பகுதி மண்ணிலிருந்து நீரை உறிஞ்சுகிறது?"),
    o: {
      English: ["Root", "Leaf", "Flower", "Fruit"],
      Hindi: ["जड़", "पत्ती", "फूल", "फल"],
      Tamil: ["வேர்", "இலை", "பூ", "பழம்"],
    },
  },
  {
    q: L("Which of these is a natural source of light?", "इनमें से प्रकाश का प्राकृतिक स्रोत कौन-सा है?", "இவற்றில் இயற்கை ஒளி மூலம் எது?"),
    o: {
      English: ["The Sun", "A mirror", "The Moon", "A torch"],
      Hindi: ["सूर्य", "दर्पण", "चंद्रमा", "टॉर्च"],
      Tamil: ["சூரியன்", "கண்ணாடி", "நிலா", "டார்ச்"],
    },
  },
  {
    q: L("Which gas do humans breathe in to stay alive?", "जीवित रहने के लिए मनुष्य कौन-सी गैस साँस में लेते हैं?", "உயிர்வாழ மனிதர்கள் எந்த வாயுவை சுவாசிக்கிறார்கள்?"),
    o: {
      English: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
      Hindi: ["ऑक्सीजन", "कार्बन डाइऑक्साइड", "नाइट्रोजन", "हाइड्रोजन"],
      Tamil: ["ஆக்சிஜன்", "கார்பன் டை ஆக்சைடு", "நைட்ரஜன்", "ஹைட்ரஜன்"],
    },
  },
  {
    q: L("Which state of matter has a fixed shape and volume?", "पदार्थ की किस अवस्था का आकार और आयतन निश्चित होता है?", "பொருளின் எந்த நிலைக்கு நிலையான வடிவமும் கனஅளவும் உண்டு?"),
    o: {
      English: ["Solid", "Liquid", "Gas", "Vapour"],
      Hindi: ["ठोस", "द्रव", "गैस", "वाष्प"],
      Tamil: ["திடம்", "திரவம்", "வாயு", "நீராவி"],
    },
  },
  {
    q: L("How many planets are there in our solar system?", "हमारे सौरमंडल में कितने ग्रह हैं?", "நமது சூரியக் குடும்பத்தில் எத்தனை கோள்கள் உள்ளன?"),
    o: {
      English: ["8", "9", "7", "10"],
      Hindi: ["8", "9", "7", "10"],
      Tamil: ["8", "9", "7", "10"],
    },
  },
  {
    q: L("Which animal is a mammal?", "इनमें से कौन-सा जानवर स्तनधारी है?", "இவற்றில் எந்த விலங்கு பாலூட்டி?"),
    o: {
      English: ["Cow", "Crocodile", "Frog", "Sparrow"],
      Hindi: ["गाय", "मगरमच्छ", "मेंढक", "गौरैया"],
      Tamil: ["பசு", "முதலை", "தவளை", "சிட்டுக்குருவி"],
    },
  },
];

const SOCIAL: Fact[] = [
  {
    q: L("What is the capital of India?", "भारत की राजधानी क्या है?", "இந்தியாவின் தலைநகரம் எது?"),
    o: {
      English: ["New Delhi", "Mumbai", "Kolkata", "Chennai"],
      Hindi: ["नई दिल्ली", "मुंबई", "कोलकाता", "चेन्नई"],
      Tamil: ["புது தில்லி", "மும்பை", "கொல்கத்தா", "சென்னை"],
    },
  },
  {
    q: L("In which year did India gain independence?", "भारत किस वर्ष स्वतंत्र हुआ?", "இந்தியா எந்த ஆண்டு சுதந்திரம் பெற்றது?"),
    o: { English: ["1947", "1950", "1930", "1962"], Hindi: ["1947", "1950", "1930", "1962"], Tamil: ["1947", "1950", "1930", "1962"] },
  },
  {
    q: L("Which river is the longest in India?", "भारत की सबसे लंबी नदी कौन-सी है?", "இந்தியாவின் மிக நீளமான நதி எது?"),
    o: {
      English: ["Ganga", "Kaveri", "Narmada", "Tapti"],
      Hindi: ["गंगा", "कावेरी", "नर्मदा", "ताप्ती"],
      Tamil: ["கங்கை", "காவிரி", "நர்மதா", "தபதி"],
    },
  },
  {
    q: L("Who is called the Father of the Nation in India?", "भारत में राष्ट्रपिता किसे कहा जाता है?", "இந்தியாவில் தேசப்பிதா என்று அழைக்கப்படுபவர் யார்?"),
    o: {
      English: ["Mahatma Gandhi", "Bhagat Singh", "Subhas Chandra Bose", "Jawaharlal Nehru"],
      Hindi: ["महात्मा गांधी", "भगत सिंह", "सुभाष चंद्र बोस", "जवाहरलाल नेहरू"],
      Tamil: ["மகாத்மா காந்தி", "பகத் சிங்", "சுபாஷ் சந்திர போஸ்", "ஜவகர்லால் நேரு"],
    },
  },
  {
    q: L("Which is the highest mountain range in India?", "भारत की सबसे ऊँची पर्वत श्रृंखला कौन-सी है?", "இந்தியாவின் மிக உயரமான மலைத்தொடர் எது?"),
    o: {
      English: ["Himalayas", "Aravalli", "Western Ghats", "Vindhya"],
      Hindi: ["हिमालय", "अरावली", "पश्चिमी घाट", "विंध्य"],
      Tamil: ["இமயமலை", "ஆரவல்லி", "மேற்குத் தொடர்ச்சி மலை", "விந்தியம்"],
    },
  },
  {
    q: L("Which direction does the Sun rise from?", "सूर्य किस दिशा से उगता है?", "சூரியன் எந்தத் திசையில் உதிக்கிறது?"),
    o: {
      English: ["East", "West", "North", "South"],
      Hindi: ["पूर्व", "पश्चिम", "उत्तर", "दक्षिण"],
      Tamil: ["கிழக்கு", "மேற்கு", "வடக்கு", "தெற்கு"],
    },
  },
  {
    q: L("Which is the national animal of India?", "भारत का राष्ट्रीय पशु कौन-सा है?", "இந்தியாவின் தேசிய விலங்கு எது?"),
    o: {
      English: ["Tiger", "Lion", "Elephant", "Peacock"],
      Hindi: ["बाघ", "शेर", "हाथी", "मोर"],
      Tamil: ["புலி", "சிங்கம்", "யானை", "மயில்"],
    },
  },
  {
    q: L("Which ocean lies to the south of India?", "भारत के दक्षिण में कौन-सा महासागर है?", "இந்தியாவின் தெற்கே உள்ள பெருங்கடல் எது?"),
    o: {
      English: ["Indian Ocean", "Pacific Ocean", "Atlantic Ocean", "Arctic Ocean"],
      Hindi: ["हिंद महासागर", "प्रशांत महासागर", "अटलांटिक महासागर", "आर्कटिक महासागर"],
      Tamil: ["இந்தியப் பெருங்கடல்", "பசிபிக் பெருங்கடல்", "அட்லாண்டிக் பெருங்கடல்", "ஆர்க்டிக் பெருங்கடல்"],
    },
  },
];

const LANGUAGE_FACTS: Record<string, Fact[]> = {
  Hindi: [
    {
      q: { English: "Which of these words is a noun?", Hindi: "इनमें से कौन-सा शब्द संज्ञा है?" },
      o: { English: ["गाँव", "दौड़ता", "जल्दी", "सुंदर"], Hindi: ["गाँव", "दौड़ता", "जल्दी", "सुंदर"] },
    },
    {
      q: { English: "What is the plural of 'पुस्तक'?", Hindi: "'पुस्तक' का बहुवचन क्या है?" },
      o: { English: ["पुस्तकें", "पुस्तका", "पुस्तकी", "पुस्तकु"], Hindi: ["पुस्तकें", "पुस्तका", "पुस्तकी", "पुस्तकु"] },
    },
    {
      q: { English: "What is the opposite of 'दिन'?", Hindi: "'दिन' का विलोम शब्द क्या है?" },
      o: { English: ["रात", "सुबह", "शाम", "दोपहर"], Hindi: ["रात", "सुबह", "शाम", "दोपहर"] },
    },
    {
      q: { English: "Which word is a verb?", Hindi: "इनमें से कौन-सा शब्द क्रिया है?" },
      o: { English: ["खाना", "मेज़", "लाल", "धीरे"], Hindi: ["खाना", "मेज़", "लाल", "धीरे"] },
    },
    {
      q: { English: "Complete the idiom: 'नाच न जाने ___ टेढ़ा'.", Hindi: "मुहावरा पूरा कीजिए: 'नाच न जाने ___ टेढ़ा'।" },
      o: { English: ["आँगन", "घर", "रास्ता", "मन"], Hindi: ["आँगन", "घर", "रास्ता", "मन"] },
    },
    {
      q: { English: "Which is the correct synonym of 'जल'?", Hindi: "'जल' का पर्यायवाची शब्द कौन-सा है?" },
      o: { English: ["पानी", "अग्नि", "वायु", "पृथ्वी"], Hindi: ["पानी", "अग्नि", "वायु", "पृथ्वी"] },
    },
  ],
  English: [
    {
      q: { English: "Which word is a noun?" },
      o: { English: ["Village", "Runs", "Quickly", "Bright"] },
    },
    {
      q: { English: "What is the plural of 'child'?" },
      o: { English: ["Children", "Childs", "Childes", "Childrens"] },
    },
    {
      q: { English: "What is the opposite of 'ancient'?" },
      o: { English: ["Modern", "Old", "Historic", "Past"] },
    },
    {
      q: { English: "Choose the correctly spelled word." },
      o: { English: ["Necessary", "Neccessary", "Necesary", "Necessery"] },
    },
    {
      q: { English: "Which sentence uses the past tense correctly?" },
      o: { English: ["She went to the market.", "She go to the market.", "She goed to the market.", "She gone to the market."] },
    },
    {
      q: { English: "What is a synonym of 'happy'?" },
      o: { English: ["Joyful", "Angry", "Tired", "Silent"] },
    },
  ],
  Tamil: [
    {
      q: { English: "Which word is a noun in Tamil?", Tamil: "இவற்றில் பெயர்ச்சொல் எது?" },
      o: { English: ["கிராமம்", "ஓடுகிறான்", "விரைவாக", "அழகான"], Tamil: ["கிராமம்", "ஓடுகிறான்", "விரைவாக", "அழகான"] },
    },
    {
      q: { English: "What is the opposite of 'பகல்'?", Tamil: "'பகல்' என்பதன் எதிர்ச்சொல் எது?" },
      o: { English: ["இரவு", "காலை", "மாலை", "நண்பகல்"], Tamil: ["இரவு", "காலை", "மாலை", "நண்பகல்"] },
    },
    {
      q: { English: "Which word is a verb in Tamil?", Tamil: "இவற்றில் வினைச்சொல் எது?" },
      o: { English: ["சாப்பிடு", "மேசை", "சிவப்பு", "மெதுவாக"], Tamil: ["சாப்பிடு", "மேசை", "சிவப்பு", "மெதுவாக"] },
    },
    {
      q: { English: "What is a synonym of 'நீர்'?", Tamil: "'நீர்' என்பதன் ஒத்த சொல் எது?" },
      o: { English: ["தண்ணீர்", "நெருப்பு", "காற்று", "மண்"], Tamil: ["தண்ணீர்", "நெருப்பு", "காற்று", "மண்"] },
    },
    {
      q: { English: "How many letters are in the Tamil vowel set?", Tamil: "தமிழ் உயிர் எழுத்துக்கள் எத்தனை?" },
      o: { English: ["12", "18", "10", "24"], Tamil: ["12", "18", "10", "24"] },
    },
  ],
};

const GENERAL: Fact[] = [
  {
    q: L("How many days are there in a leap year?", "लीप वर्ष में कितने दिन होते हैं?", "லீப் ஆண்டில் எத்தனை நாட்கள்?"),
    o: { English: ["366", "365", "364", "367"], Hindi: ["366", "365", "364", "367"], Tamil: ["366", "365", "364", "367"] },
  },
  {
    q: L("How many colours are there in a rainbow?", "इंद्रधनुष में कितने रंग होते हैं?", "வானவில்லில் எத்தனை நிறங்கள்?"),
    o: { English: ["7", "5", "6", "8"], Hindi: ["7", "5", "6", "8"], Tamil: ["7", "5", "6", "8"] },
  },
  {
    q: L("Which is the largest animal on Earth?", "पृथ्वी का सबसे बड़ा जानवर कौन-सा है?", "பூமியின் மிகப்பெரிய விலங்கு எது?"),
    o: {
      English: ["Blue whale", "Elephant", "Giraffe", "Hippopotamus"],
      Hindi: ["नीली व्हेल", "हाथी", "जिराफ़", "दरियाई घोड़ा"],
      Tamil: ["நீலத் திமிங்கிலம்", "யானை", "ஒட்டகச்சிவிங்கி", "நீர்யானை"],
    },
  },
  {
    q: L("How many minutes make one hour?", "एक घंटे में कितने मिनट होते हैं?", "ஒரு மணி நேரத்தில் எத்தனை நிமிடங்கள்?"),
    o: { English: ["60", "50", "100", "30"], Hindi: ["60", "50", "100", "30"], Tamil: ["60", "50", "100", "30"] },
  },
  {
    q: L("Which vitamin do we get from sunlight?", "सूर्य के प्रकाश से हमें कौन-सा विटामिन मिलता है?", "சூரிய ஒளியிலிருந்து நமக்குக் கிடைக்கும் வைட்டமின் எது?"),
    o: {
      English: ["Vitamin D", "Vitamin A", "Vitamin C", "Vitamin K"],
      Hindi: ["विटामिन D", "विटामिन A", "विटामिन C", "विटामिन K"],
      Tamil: ["வைட்டமின் D", "வைட்டமின் A", "வைட்டமின் C", "வைட்டமின் K"],
    },
  },
  {
    q: L("How many sides does a triangle have?", "त्रिभुज में कितनी भुजाएँ होती हैं?", "முக்கோணத்திற்கு எத்தனை பக்கங்கள்?"),
    o: { English: ["3", "4", "5", "2"], Hindi: ["3", "4", "5", "2"], Tamil: ["3", "4", "5", "2"] },
  },
];

function factToSeed(f: Fact, language: string): Seed {
  const en = f.q["English"] ?? Object.values(f.q)[0]!;
  const optsEn = f.o["English"] ?? Object.values(f.o)[0]!;
  const loc = f.q[language] ?? en;
  const optsLoc = f.o[language] ?? optsEn;
  return { en, loc, optionsEn: optsEn, optionsLoc: optsLoc, correct: 0 };
}

function factPool(subject: string, language: string): Fact[] {
  if (subject === "Science") return SCIENCE;
  if (subject === "Social Studies") return SOCIAL;
  if (subject === "Language") return LANGUAGE_FACTS[language] ?? LANGUAGE_FACTS["English"]!;
  return GENERAL;
}

/* ------------------------------------------------------------------ *
 * Public API
 * ------------------------------------------------------------------ */

function shuffleOptions(seed: Seed, r: () => number): BankQuestion {
  const idx = [0, 1, 2, 3];
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [idx[i], idx[j]] = [idx[j]!, idx[i]!];
  }
  return {
    prompt_en: seed.en,
    prompt_hi: seed.loc,
    options_en: idx.map((k) => seed.optionsEn[k] ?? ""),
    options_hi: idx.map((k) => seed.optionsLoc[k] ?? seed.optionsEn[k] ?? ""),
    answer: idx.indexOf(seed.correct),
  };
}

export function buildQuestions(args: {
  topic: string;
  subject: string;
  classLevel: string;
  language: string;
  set?: number;
}): BankQuestion[] {
  const setIndex = args.set ?? 0;
  const r = mulberry32(Math.floor(Math.random() * 1e9) + setIndex * 7919);
  const lang = MATH[args.language] ? args.language : "English";

  if (args.subject === "Maths") {
    return mathSeeds(args.classLevel, lang, r)
      .slice(0, 5)
      .map((s) => shuffleOptions(s, r));
  }

  const pool = factPool(args.subject, lang);
  const chosen = pickMany(pool, 5, r);
  const seeds = chosen.map((f) => factToSeed(f, lang));
  // Top up with maths-style items only if the pool was too small.
  while (seeds.length < 5) seeds.push(...mathSeeds(args.classLevel, lang, r).slice(0, 5 - seeds.length));
  return seeds.slice(0, 5).map((s) => shuffleOptions(s, r));
}
