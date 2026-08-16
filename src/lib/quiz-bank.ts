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

/** Pre-written, realistic question sets keyed by `${Language}|${Subject}`. */
const BANK: Record<string, Seed[]> = {
  "Hindi|Science": [
    {
      en: "What is essential for photosynthesis?",
      loc: "प्रकाश संश्लेषण (Photosynthesis) के लिए क्या आवश्यक है?",
      optionsEn: ["Sunlight, water and carbon dioxide", "Only soil", "Moonlight", "Salt water"],
      optionsLoc: ["सूर्य का प्रकाश, जल और कार्बन डाइऑक्साइड", "केवल मिट्टी", "चाँदनी", "नमकीन पानी"],
      correct: 0,
    },
    {
      en: "Which gas do plants release during the day?",
      loc: "दिन में पौधे कौन-सी गैस छोड़ते हैं?",
      optionsEn: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
      optionsLoc: ["ऑक्सीजन", "नाइट्रोजन", "कार्बन डाइऑक्साइड", "हाइड्रोजन"],
      correct: 0,
    },
    {
      en: "Which part of the plant absorbs water from the soil?",
      loc: "पौधे का कौन-सा भाग मिट्टी से जल सोखता है?",
      optionsEn: ["Root", "Leaf", "Flower", "Fruit"],
      optionsLoc: ["जड़", "पत्ती", "फूल", "फल"],
      correct: 0,
    },
    {
      en: "Water boils at what temperature at sea level?",
      loc: "समुद्र तल पर पानी किस तापमान पर उबलता है?",
      optionsEn: ["100°C", "50°C", "0°C", "150°C"],
      optionsLoc: ["100°C", "50°C", "0°C", "150°C"],
      correct: 0,
    },
    {
      en: "Which of these is a source of light?",
      loc: "इनमें से कौन प्रकाश का स्रोत है?",
      optionsEn: ["The Sun", "A mirror", "The Moon", "A window"],
      optionsLoc: ["सूर्य", "दर्पण", "चंद्रमा", "खिड़की"],
      correct: 0,
    },
  ],
  "Hindi|Maths": [
    {
      en: "A shopkeeper sells 3 kg of rice at ₹45 per kg. What is the total?",
      loc: "एक दुकानदार ₹45 प्रति किलो की दर से 3 किलो चावल बेचता है। कुल कितने रुपये हुए?",
      optionsEn: ["₹135", "₹120", "₹145", "₹90"],
      optionsLoc: ["₹135", "₹120", "₹145", "₹90"],
      correct: 0,
    },
    {
      en: "What is 248 + 176?",
      loc: "248 + 176 कितना होता है?",
      optionsEn: ["424", "414", "434", "324"],
      optionsLoc: ["424", "414", "434", "324"],
      correct: 0,
    },
    {
      en: "Which fraction is the largest?",
      loc: "कौन-सी भिन्न सबसे बड़ी है?",
      optionsEn: ["3/4", "1/2", "2/5", "1/3"],
      optionsLoc: ["3/4", "1/2", "2/5", "1/3"],
      correct: 0,
    },
    {
      en: "The perimeter of a square of side 7 cm is:",
      loc: "7 सेमी भुजा वाले वर्ग का परिमाप है:",
      optionsEn: ["28 cm", "49 cm", "14 cm", "21 cm"],
      optionsLoc: ["28 सेमी", "49 सेमी", "14 सेमी", "21 सेमी"],
      correct: 0,
    },
    {
      en: "If a bus leaves at 9:15 and travels 45 minutes, when does it arrive?",
      loc: "यदि बस 9:15 पर चलती है और 45 मिनट चलती है, तो कब पहुँचेगी?",
      optionsEn: ["10:00", "9:45", "10:15", "9:55"],
      optionsLoc: ["10:00", "9:45", "10:15", "9:55"],
      correct: 0,
    },
  ],
  "Hindi|Social Studies": [
    {
      en: "Which river is called the lifeline of North India?",
      loc: "उत्तर भारत की जीवनरेखा किस नदी को कहा जाता है?",
      optionsEn: ["Ganga", "Kaveri", "Narmada", "Tapti"],
      optionsLoc: ["गंगा", "कावेरी", "नर्मदा", "ताप्ती"],
      correct: 0,
    },
    {
      en: "What is the capital of India?",
      loc: "भारत की राजधानी क्या है?",
      optionsEn: ["New Delhi", "Mumbai", "Kolkata", "Chennai"],
      optionsLoc: ["नई दिल्ली", "मुंबई", "कोलकाता", "चेन्नई"],
      correct: 0,
    },
    {
      en: "Who is known as the Father of the Nation in India?",
      loc: "भारत में राष्ट्रपिता किसे कहा जाता है?",
      optionsEn: ["Mahatma Gandhi", "Bhagat Singh", "Subhas Chandra Bose", "Jawaharlal Nehru"],
      optionsLoc: ["महात्मा गांधी", "भगत सिंह", "सुभाष चंद्र बोस", "जवाहरलाल नेहरू"],
      correct: 0,
    },
    {
      en: "In which year did India become independent?",
      loc: "भारत किस वर्ष स्वतंत्र हुआ?",
      optionsEn: ["1947", "1950", "1930", "1962"],
      optionsLoc: ["1947", "1950", "1930", "1962"],
      correct: 0,
    },
    {
      en: "A map's directions are shown by which symbol?",
      loc: "मानचित्र में दिशाएँ किस चिह्न से दिखाई जाती हैं?",
      optionsEn: ["Compass rose", "Scale bar", "Legend", "Title"],
      optionsLoc: ["दिशा-सूचक", "मापनी", "संकेत-सूची", "शीर्षक"],
      correct: 0,
    },
  ],
  "Hindi|Language": [
    {
      en: "Which of these is a noun (संज्ञा)?",
      loc: "इनमें से संज्ञा कौन-सी है?",
      optionsEn: ["Village", "Runs", "Quickly", "Beautifully"],
      optionsLoc: ["गाँव", "दौड़ता", "जल्दी", "सुंदरता से"],
      correct: 0,
    },
    {
      en: "Choose the correct plural of 'पुस्तक'.",
      loc: "'पुस्तक' का सही बहुवचन चुनिए।",
      optionsEn: ["पुस्तकें", "पुस्तकों", "पुस्तका", "पुस्तकी"],
      optionsLoc: ["पुस्तकें", "पुस्तकों", "पुस्तका", "पुस्तकी"],
      correct: 0,
    },
    {
      en: "What is the opposite (विलोम) of 'दिन'?",
      loc: "'दिन' का विलोम शब्द क्या है?",
      optionsEn: ["रात", "सुबह", "शाम", "दोपहर"],
      optionsLoc: ["रात", "सुबह", "शाम", "दोपहर"],
      correct: 0,
    },
    {
      en: "Which word is a verb (क्रिया)?",
      loc: "कौन-सा शब्द क्रिया है?",
      optionsEn: ["खाना", "मेज़", "लाल", "धीरे"],
      optionsLoc: ["खाना", "मेज़", "लाल", "धीरे"],
      correct: 0,
    },
    {
      en: "Complete the idiom: 'नाच न जाने ___ टेढ़ा'.",
      loc: "मुहावरा पूरा कीजिए: 'नाच न जाने ___ टेढ़ा'।",
      optionsEn: ["आँगन", "घर", "रास्ता", "मन"],
      optionsLoc: ["आँगन", "घर", "रास्ता", "मन"],
      correct: 0,
    },
  ],
  "Tamil|Science": [
    {
      en: "What is needed for photosynthesis?",
      loc: "ஒளிச்சேர்க்கைக்கு எது தேவை?",
      optionsEn: ["Sunlight, water and carbon dioxide", "Only soil", "Moonlight", "Salt water"],
      optionsLoc: ["சூரிய ஒளி, நீர் மற்றும் கார்பன் டை ஆக்சைடு", "மண் மட்டும்", "நிலவொளி", "உப்பு நீர்"],
      correct: 0,
    },
    {
      en: "Which organ pumps blood in the human body?",
      loc: "மனித உடலில் இரத்தத்தை செலுத்தும் உறுப்பு எது?",
      optionsEn: ["Heart", "Lungs", "Liver", "Kidney"],
      optionsLoc: ["இதயம்", "நுரையீரல்", "கல்லீரல்", "சிறுநீரகம்"],
      correct: 0,
    },
    {
      en: "Which of these is a source of light?",
      loc: "இவற்றில் ஒளியின் மூலம் எது?",
      optionsEn: ["The Sun", "A mirror", "The Moon", "A window"],
      optionsLoc: ["சூரியன்", "கண்ணாடி", "நிலா", "ஜன்னல்"],
      correct: 0,
    },
    {
      en: "Water freezes at what temperature?",
      loc: "நீர் எந்த வெப்பநிலையில் உறைகிறது?",
      optionsEn: ["0°C", "10°C", "100°C", "50°C"],
      optionsLoc: ["0°C", "10°C", "100°C", "50°C"],
      correct: 0,
    },
    {
      en: "Which part of the plant makes food?",
      loc: "தாவரத்தின் எந்தப் பகுதி உணவு தயாரிக்கிறது?",
      optionsEn: ["Leaf", "Root", "Stem", "Flower"],
      optionsLoc: ["இலை", "வேர்", "தண்டு", "பூ"],
      correct: 0,
    },
  ],
  "Tamil|Maths": [
    {
      en: "What is 125 + 238?",
      loc: "125 + 238 எவ்வளவு?",
      optionsEn: ["363", "353", "373", "263"],
      optionsLoc: ["363", "353", "373", "263"],
      correct: 0,
    },
    {
      en: "How many minutes are there in 2 hours?",
      loc: "2 மணி நேரத்தில் எத்தனை நிமிடங்கள்?",
      optionsEn: ["120", "100", "60", "180"],
      optionsLoc: ["120", "100", "60", "180"],
      correct: 0,
    },
    {
      en: "The area of a rectangle 6 cm by 4 cm is:",
      loc: "6 செ.மீ × 4 செ.மீ செவ்வகத்தின் பரப்பளவு:",
      optionsEn: ["24 sq cm", "20 sq cm", "10 sq cm", "12 sq cm"],
      optionsLoc: ["24 ச.செ.மீ", "20 ச.செ.மீ", "10 ச.செ.மீ", "12 ச.செ.மீ"],
      correct: 0,
    },
    {
      en: "Which number is even?",
      loc: "எந்த எண் இரட்டைப்படை?",
      optionsEn: ["48", "37", "51", "29"],
      optionsLoc: ["48", "37", "51", "29"],
      correct: 0,
    },
    {
      en: "Rice costs ₹52 per kg. What do 2 kg cost?",
      loc: "அரிசி கிலோ ₹52. 2 கிலோ விலை என்ன?",
      optionsEn: ["₹104", "₹94", "₹114", "₹52"],
      optionsLoc: ["₹104", "₹94", "₹114", "₹52"],
      correct: 0,
    },
  ],
};

/** Localized fallback templates for language/subject combos not in the bank. */
const LOCALE: Record<
  string,
  { concept: (s: string, c: string) => string; correct: string; near: string; wrong: string; unrelated: string }
> = {
  Hindi: {
    concept: (s, c) => `${c} के ${s} विषय की एक मुख्य अवधारणा क्या है?`,
    correct: "पाठ्यपुस्तक में दी गई मूल अवधारणा",
    near: "आंशिक रूप से सही कथन",
    wrong: "असंबंधित नियम",
    unrelated: "इनमें से कोई नहीं",
  },
  Tamil: {
    concept: (s, c) => `${c} வகுப்பின் ${s} பாடத்தின் முக்கிய கருத்து எது?`,
    correct: "பாடநூலில் உள்ள அடிப்படைக் கருத்து",
    near: "பகுதியளவு சரியான கூற்று",
    wrong: "தொடர்பற்ற விதி",
    unrelated: "இவற்றில் எதுவும் இல்லை",
  },
  Kannada: {
    concept: (s, c) => `${c} ನ ${s} ವಿಷಯದ ಪ್ರಮುಖ ಪರಿಕಲ್ಪನೆ ಯಾವುದು?`,
    correct: "ಪಠ್ಯಪುಸ್ತಕದ ಮೂಲ ಪರಿಕಲ್ಪನೆ",
    near: "ಭಾಗಶಃ ಸರಿಯಾದ ಹೇಳಿಕೆ",
    wrong: "ಸಂಬಂಧವಿಲ್ಲದ ನಿಯಮ",
    unrelated: "ಇವುಗಳಲ್ಲಿ ಯಾವುದೂ ಅಲ್ಲ",
  },
  Bengali: {
    concept: (s, c) => `${c}-এর ${s} বিষয়ের একটি প্রধান ধারণা কী?`,
    correct: "পাঠ্যবইয়ের মূল ধারণা",
    near: "আংশিকভাবে সঠিক বিবৃতি",
    wrong: "অসম্পর্কিত নিয়ম",
    unrelated: "এর কোনোটিই নয়",
  },
  Marathi: {
    concept: (s, c) => `${c} च्या ${s} विषयातील एक मुख्य संकल्पना कोणती?`,
    correct: "पाठ्यपुस्तकातील मूळ संकल्पना",
    near: "अंशतः बरोबर विधान",
    wrong: "असंबंधित नियम",
    unrelated: "यापैकी काहीही नाही",
  },
  Telugu: {
    concept: (s, c) => `${c} ${s} విషయంలో ప్రధాన భావన ఏమిటి?`,
    correct: "పాఠ్యపుస్తకంలోని మూల భావన",
    near: "పాక్షికంగా సరైన ప్రకటన",
    wrong: "సంబంధం లేని నియమం",
    unrelated: "వీటిలో ఏదీ కాదు",
  },
};

/** Generic but believable English seeds, specialised by subject and set variant. */
function genericSeeds(
  subject: string,
  classLevel: string,
  language: string,
  topic: string,
  setIndex = 0,
): Seed[] {
  const loc = LOCALE[language] ?? LOCALE["Hindi"]!;
  const t = topic.trim() || subject;

  const templateSets = [
    {
      askEn: [
        `What is a primary concept of ${subject} for ${classLevel} in ${language}?`,
        `Which statement about "${t}" is correct for ${classLevel}?`,
        `A teacher explains "${t}". Which example fits best?`,
        `Which everyday situation uses "${t}"?`,
        `Which of these best defines "${t}" in ${subject}?`,
      ],
      optsEn: [
        [`The core idea of ${t} taught in ${classLevel}`, `A partly correct statement about ${t}`, `A rule from a different chapter`, "None of these"],
        [`${t} is applied step by step`, `${t} is only memorised`, `${t} has no examples`, `${t} is not part of ${subject}`],
        [`Measuring or observing ${t} in class`, `Ignoring ${t} completely`, `Copying without understanding`, "Guessing the answer"],
        [`Using ${t} at the market or at home`, `Only in exams`, `Never in daily life`, "Only in higher classes"],
        [`A clear, textbook definition of ${t}`, `An unrelated definition`, `A definition from another subject`, "No definition exists"],
      ],
    },
    {
      askEn: [
        `Which skill in ${subject} is most important for ${classLevel} students?`,
        `What would happen if you ignored "${t}" while studying ${subject}?`,
        `Choose the best example of "${t}" from daily life.`,
        `How can a ${classLevel} student check whether they understand "${t}"?`,
        `Which question about "${t}" would a teacher most likely ask?`,
      ],
      optsEn: [
        ["Solving problems step by step", "Memorising without understanding", "Skipping practice", "Avoiding the topic"],
        ["They would make many mistakes", "They would finish faster", "The topic becomes easier", "Nothing changes"],
        ["A real-life use they have seen", "A made-up example", "A rule from a different subject", "No example at all"],
        ["They can explain it to a friend", "They can only copy notes", "They can read the heading", "They can guess the answer"],
        ["A question that needs thinking", "A question with no answer", "A question from another language", "A question about the textbook cover"],
      ],
    },
  ];

  const set = templateSets[setIndex % templateSets.length]!;

  return set.askEn.map((en, i) => ({
    en,
    loc: i === 0 ? loc.concept(subject, classLevel) : `${loc.concept(subject, classLevel)} (${t} — ${i + 1})`,
    optionsEn: set.optsEn[i]!,
    optionsLoc: [loc.correct, loc.near, loc.wrong, loc.unrelated],
    correct: 0,
  }));
}


function shuffleOptions(seed: Seed): BankQuestion {
  const idx = [0, 1, 2, 3];
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j]!, idx[i]!];
  }
  return {
    prompt_en: seed.en,
    prompt_hi: seed.loc,
    options_en: idx.map((k) => seed.optionsEn[k]!),
    options_hi: idx.map((k) => seed.optionsLoc[k]!),
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
  const key = `${args.language}|${args.subject}`;
  const seeds =
    setIndex === 0 && BANK[key]
      ? BANK[key]
      : genericSeeds(args.subject, args.classLevel, args.language, args.topic, setIndex);
  return seeds.slice(0, 5).map(shuffleOptions);
}
