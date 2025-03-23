
export interface QuizQuestion {
  id: number;
  question: string;
  image: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  hint: string;
}

// Sample questions - could be expanded
const quizQuestions: QuizQuestion[] = [
  // Easy Questions
  {
    id: 1,
    question: "ما هو اسم قبعة لوفي؟",
    image: "https://staticg.sportskeeda.com/editor/2022/02/4f237-16444131741309-1920.jpg",
    options: ["قبعة القش", "قبعة السلام", "قبعة الملك", "قبعة الأحلام"],
    correctAnswer: 0,
    difficulty: 'easy',
    hint: "أعطاها له شانكس"
  },
  {
    id: 2,
    question: "ما هو اسم سفينة طاقم قبعة القش الحالية؟",
    image: "https://qph.cf2.quoracdn.net/main-qimg-e161f26fd88f50edf8a1a242c24ec78f-lq",
    options: ["ثاوزند صني", "ميري جو", "أورا جاكسون", "موبي ديك"],
    correctAnswer: 0,
    difficulty: 'easy',
    hint: "صنعها فرانكي بعد أحداث إنيس لوبي"
  },
  {
    id: 3,
    question: "ما هو الاسم الحقيقي لبورتغاس دي إيس؟",
    image: "https://i.pinimg.com/originals/ee/d0/71/eed071ee6a27119ecebe634f6613324e.jpg",
    options: ["غول دي روجر", "مونكي دي إيس", "بورتغاس دي روجر", "جول دي إيس"],
    correctAnswer: 0,
    difficulty: 'easy',
    hint: "ابن ملك القراصنة"
  },
  {
    id: 4,
    question: "ما هو طموح زورو في الحياة؟",
    image: "https://staticg.sportskeeda.com/editor/2022/08/1b02f-16601163782892-1920.jpg",
    options: ["أن يصبح أقوى سياف في العالم", "أن يجد الون بيس", "أن يرسم خريطة العالم", "أن يجد أول بيس"],
    correctAnswer: 0,
    difficulty: 'easy',
    hint: "وعد صديقته كوينا بهذا الهدف"
  },
  {
    id: 5,
    question: "ما اسم الفاكهة التي أكلها لوفي؟",
    image: "https://i.ytimg.com/vi/Wc6oPsxmfJE/maxresdefault.jpg",
    options: ["غوم غوم", "ميرا ميرا", "بارا بارا", "هانا هانا"],
    correctAnswer: 0,
    difficulty: 'easy',
    hint: "تمنحه جسدًا مطاطيًا"
  },
  {
    id: 6,
    question: "من هو قائد منظمة الثوريين؟",
    image: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/01/monkey-d-dragon-in-one-piece.jpg",
    options: ["مونكي دي دراغون", "غول دي روجر", "سبو", "إمبل داون"],
    correctAnswer: 0,
    difficulty: 'easy',
    hint: "والد لوفي"
  },
  {
    id: 7,
    question: "ما هو المكان الذي نشأ فيه لوفي؟",
    image: "https://www.gamenguides.com/wp-content/uploads/2022/06/Foosha-Village-One-Piece-Luffy-childhood-village.png",
    options: ["قرية فوشا", "مملكة ألاباستا", "جزيرة دروم", "واتر سفن"],
    correctAnswer: 0,
    difficulty: 'easy',
    hint: "في الإيست بلو حيث التقى شانكس"
  },
  
  // Medium Questions
  {
    id: 8,
    question: "ما هو اسم سيف زورو الأسود؟",
    image: "https://qph.cf2.quoracdn.net/main-qimg-1eacd72311d43dd0f6acef68e0d7049c-lq",
    options: ["شوسوي", "واداموراساكي", "ساندي كيتيتسو", "إينما"],
    correctAnswer: 0,
    difficulty: 'medium',
    hint: "حصل عليه في وانو"
  },
  {
    id: 9,
    question: "من هو أول شخص انضم إلى طاقم قبعة القش؟",
    image: "https://staticg.sportskeeda.com/editor/2022/11/acd5e-16678402219774-1920.jpg",
    options: ["رورونوا زورو", "نامي", "أوسوب", "سانجي"],
    correctAnswer: 0,
    difficulty: 'medium',
    hint: "كان مقيدًا في قاعدة مشاة البحرية"
  },
  {
    id: 10,
    question: "من هو العضو الثامن في طاقم قبعة القش؟",
    image: "https://staticg.sportskeeda.com/editor/2022/08/c2e88-16612566022574-1920.jpg",
    options: ["بروك", "فرانكي", "روبن", "جينبي"],
    correctAnswer: 0,
    difficulty: 'medium',
    hint: "هيكل عظمي حي"
  },
  {
    id: 11,
    question: "ما اسم المنظمة التي كانت تنتمي إليها نيكو روبن؟",
    image: "https://staticg.sportskeeda.com/editor/2022/10/1f91a-16660376312865-1920.jpg",
    options: ["أوهارا", "CP9", "بارو وركس", "بيراتس"],
    correctAnswer: 0,
    difficulty: 'medium',
    hint: "جزيرة العلماء التي دمرتها الحكومة العالمية"
  },
  {
    id: 12,
    question: "ما هي المكافأة الأولى للوفي؟",
    image: "https://i0.wp.com/doublesama.com/wp-content/uploads/2020/05/One-Piece-episode-45-Luffys-first-bounty.jpg",
    options: ["30,000,000 بيلي", "100,000,000 بيلي", "300,000 بيلي", "10,000,000 بيلي"],
    correctAnswer: 0,
    difficulty: 'medium',
    hint: "بعد هزيمة أرلونج"
  },
  {
    id: 13,
    question: "ما اسم سيف ميهوك الأسود؟",
    image: "https://staticg.sportskeeda.com/editor/2022/07/548d0-16591118375499-1920.jpg",
    options: ["يورو شيكي", "وادو إتشيمونجي", "ساندي كيتيتسو", "شوسوي"],
    correctAnswer: 0,
    difficulty: 'medium',
    hint: "أحد السيوف السوداء العظيمة"
  },
  {
    id: 14,
    question: "كم عدد أنواع الهاكي الرئيسية في عالم ون بيس؟",
    image: "https://staticg.sportskeeda.com/editor/2022/06/9ae88-16539060464109-1920.jpg",
    options: ["3", "2", "4", "5"],
    correctAnswer: 0,
    difficulty: 'medium',
    hint: "الملاحظة، التسليح، والملوك"
  },
  
  // Hard Questions
  {
    id: 15,
    question: "ما هو الاسم الحقيقي للأدميرال الأزرق (أوكيجي) السابق؟",
    image: "https://i.pinimg.com/originals/3c/f1/81/3cf18122fd2fd8b42e2ba20b9f5fee74.jpg",
    options: ["كوزان", "ساكازوكي", "بورسالينو", "إيسهو"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "ترك البحرية بعد حادثة بانك هازارد"
  },
  {
    id: 16,
    question: "من هو أول شخص استخدم الهاكي في المانجا؟",
    image: "https://staticg.sportskeeda.com/editor/2022/09/7fc2f-16621723232912-1920.jpg",
    options: ["شانكس", "جوراكومول", "زيفير", "غارب"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "استخدمه لإنقاذ لوفي من الوحش البحري"
  },
  {
    id: 17,
    question: "ما هو اسم الكنز الذي تركه غول دي روجر في رافتيل؟",
    image: "https://qph.cf2.quoracdn.net/main-qimg-8b2fd7c92aa6c8db96aa50b79c98cc2a-lq",
    options: ["ون بيس", "ريو بونيجليف", "مقاييس الأرض السوداء", "إيتيرنال لوغ بوس"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "اسم الأنمي نفسه مستوحى منه"
  },
  {
    id: 18,
    question: "ما هو الاسم الحقيقي لـ(لاو)؟",
    image: "https://i.pinimg.com/originals/9e/04/0a/9e040a1bf48cfa5bce321adca341759f.jpg",
    options: ["ترافالغار دي واتر لاو", "ترافالغار لاو", "دونكيشوت روسينانتي", "ديالتون"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "يحمل الحرف D السري"
  },
  {
    id: 19,
    question: "ما اسم الفاكهة التي أكلها مارشال دي تيتش (بلاكبيرد)؟",
    image: "https://www.cbr.com/wp-content/uploads/2019/08/Blackbeard-Devil-Fruit-in-One-Piece-Cropped.jpg",
    options: ["يامي يامي", "غورا غورا", "أوبي أوبي", "سونا سونا"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "فاكهة الظلام"
  },
  {
    id: 20,
    question: "من هم الملوك البحريون الخمسة الحاليون؟",
    image: "https://staticg.sportskeeda.com/editor/2021/12/3c88d-16390283889732-1920.jpg",
    options: [
      "شانكس، ميهوك، هانكوك، باغي، لاو", 
      "دوفلامينغو، كروكودايل، كوما، جينبي، ويفل", 
      "لوفي، لاو، كيد، بلاكبيرد، شانكس", 
      "باغي، لوفي، دوفلامينغو، كروكودايل، ميهوك"
    ],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "تم تعيينهم بعد إلغاء نظام الشيشيبوكاي"
  },
  {
    id: 21,
    question: "ما هو الاسم الحقيقي للكائن الذي تحول إليه لوفي في حالة الجير 5؟",
    image: "https://www.hindustantimes.com/ht-img/img/2023/08/17/550x309/Screenshot_2023-08-18_092658_1692333428768_1692333444311.png",
    options: ["نيكا", "جوي بوي", "صن غود", "لونا"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "إله الشمس"
  }
];

export const getQuizQuestions = (difficulty: string, count: number = 10) => {
  let filteredQuestions: QuizQuestion[];
  
  if (difficulty === 'easy') {
    filteredQuestions = quizQuestions.filter(q => q.difficulty === 'easy');
  } else if (difficulty === 'hard') {
    filteredQuestions = quizQuestions.filter(q => q.difficulty === 'hard');
  } else {
    // For medium, mix easy, medium, and hard questions
    const easyQuestions = quizQuestions.filter(q => q.difficulty === 'easy').slice(0, Math.floor(count * 0.3));
    const mediumQuestions = quizQuestions.filter(q => q.difficulty === 'medium');
    const hardQuestions = quizQuestions.filter(q => q.difficulty === 'hard').slice(0, Math.floor(count * 0.2));
    
    filteredQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
  }
  
  // Shuffle and limit questions
  return shuffleArray(filteredQuestions).slice(0, count);
};

// Fisher-Yates (Knuth) shuffle
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default quizQuestions;
