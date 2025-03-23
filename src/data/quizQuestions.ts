
import { shuffleArray } from '../utils/quizHelpers';

export interface QuizQuestion {
  id: number;
  question: string;
  image: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  hint: string;
}

// Expanded questions with proper difficulty categorization
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
  {
    id: 22,
    question: "ما هو لون شعر سانجي؟",
    image: "https://sportshub.cbsistatic.com/i/2021/03/28/ea73e108-1b3b-4e07-a1d9-2469bd57b389/one-piece-sanji-wci-1184520.jpg",
    options: ["أشقر", "أسود", "أخضر", "أحمر"],
    correctAnswer: 0,
    difficulty: 'easy',
    hint: "يغطي عينه اليسرى دائماً"
  },
  {
    id: 23,
    question: "ما هو اسم سيف زورو المفضل؟",
    image: "https://i.pinimg.com/originals/18/47/30/184730e481f8311687404bdf9a1e7feb.png",
    options: ["وادو ايتشيمونجي", "ساندي كيتيتسو", "شوسوي", "إنما"],
    correctAnswer: 0,
    difficulty: 'easy',
    hint: "كان يملكه كوينا في الماضي"
  },
  {
    id: 24,
    question: "ما هو حلم نامي في الحياة؟",
    image: "https://cdn.oneesports.gg/cdn-data/2023/06/OnePiece_Nami_StrawHatPirate.jpg",
    options: ["رسم خريطة للعالم كله", "جمع الكنوز", "إيجاد الون بيس", "أن تصبح قرصانة مشهورة"],
    correctAnswer: 0,
    difficulty: 'easy',
    hint: "تحب الجغرافيا والملاحة"
  },
  {
    id: 25,
    question: "ما هو نوع حيوان شوبر؟",
    image: "https://sportshub.cbsistatic.com/i/2022/06/17/45c866eb-48fc-40a6-9c36-b16e39bfda3b/one-piece-chopper.jpg",
    options: ["أيل", "راكون", "قطة", "كلب"],
    correctAnswer: 0,
    difficulty: 'easy',
    hint: "له أنف أزرق ويمكنه تناول فاكهة هيتو هيتو"
  },
  {
    id: 26,
    question: "ما اسم كابتن طاقم قراصنة قبعة القش؟",
    image: "https://staticg.sportskeeda.com/editor/2022/01/23b92-16428964579381-1920.jpg",
    options: ["مونكي دي لوفي", "رورونوا زورو", "سانجي", "شانكس"],
    correctAnswer: 0,
    difficulty: 'easy',
    hint: "يرتدي قبعة القش التي أعطاها له شانكس"
  },
  {
    id: 27,
    question: "ما هو اسم الدولة التي يحكمها فيفي؟",
    image: "https://staticg.sportskeeda.com/editor/2021/05/8edef-16221558775178-800.jpg",
    options: ["ألاباستا", "دريسروزا", "وانو", "سكاي بيا"],
    correctAnswer: 0,
    difficulty: 'easy',
    hint: "دولة صحراوية قاتل فيها لوفي ضد كروكودايل"
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
  {
    id: 28,
    question: "من هو الشخص الذي علّم لوفي استخدام الهاكي؟",
    image: "https://qph.cf2.quoracdn.net/main-qimg-2b24e1cb3a10fa1ed9ee3c172c7c9d5b-lq",
    options: ["سيلفرس رايلي", "شانكس", "جارب", "دراغون"],
    correctAnswer: 0,
    difficulty: 'medium',
    hint: "كان نائب قائد طاقم روجر"
  },
  {
    id: 29,
    question: "ما هي قدرة فاكهة ترافلغار لو؟",
    image: "https://staticg.sportskeeda.com/editor/2022/09/7f80c-16639633005170-1920.jpg",
    options: ["أوبي أوبي (العملية)", "جورا جورا (الزلزال)", "يامي يامي (الظلام)", "توري توري (الطيور)"],
    correctAnswer: 0,
    difficulty: 'medium',
    hint: "تسمح له بإنشاء مجال يمكنه فيه التلاعب بكل شيء"
  },
  {
    id: 30,
    question: "ما هو اسم السفينة الأولى لطاقم قبعة القش؟",
    image: "https://qph.cf2.quoracdn.net/main-qimg-e2a8e2923ac642adf0bc3ea61c45db00",
    options: ["جوينج ميري", "ثاوزند صني", "أورو جاكسون", "ريد فورس"],
    correctAnswer: 0,
    difficulty: 'medium',
    hint: "أعطاها كايا لأصدقائها"
  },
  {
    id: 31,
    question: "ما هو اسم محاربي البحر السابقين الذين واجهوا لوفي في إنيس لوبي؟",
    image: "https://staticg.sportskeeda.com/editor/2022/09/d30a4-16633752047399-1920.jpg",
    options: ["روب لوتشي", "كروكودايل", "جيكو موريا", "دوفلامينغو"],
    correctAnswer: 0,
    difficulty: 'medium',
    hint: "كان قائد CP9"
  },
  {
    id: 32,
    question: "من هو أبو سانجي الحقيقي؟",
    image: "https://staticg.sportskeeda.com/editor/2022/07/c978c-16579371822841-1920.jpg",
    options: ["فينسموك جادج", "ريد ليج زيف", "دون كريج", "أرلونج"],
    correctAnswer: 0,
    difficulty: 'medium',
    hint: "قائد عائلة فينسموك وجيش جيرما 66"
  },
  {
    id: 33,
    question: "ما اسم التقنية التي طورها لوفي بعد تدريبه مع رايلي؟",
    image: "https://staticg.sportskeeda.com/editor/2023/02/3fb8c-16764075404074-1920.jpg",
    options: ["جير سكند", "ريد هوك", "غوم غوم نو ستورم", "إيليفانت غان"],
    correctAnswer: 0,
    difficulty: 'medium',
    hint: "تستخدم الهاكي مع قدرات الغوم غوم"
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
  },
  {
    id: 34,
    question: "ما الاسم الحقيقي لجزيرة العرش الفارغ؟",
    image: "https://qph.cf2.quoracdn.net/main-qimg-a3bf7f10bf7c2c7cf8da3ef9bc383a46-pjlq",
    options: ["ماريجوا", "رافتيل", "أوهارا", "إلباف"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "مركز الحكومة العالمية"
  },
  {
    id: 35,
    question: "من هم القادة الخمسة للحكومة العالمية (الخمسة الحكماء)؟",
    image: "https://staticg.sportskeeda.com/editor/2023/05/36e24-16835412456825-1920.jpg",
    options: ["الأرستقراطيون العالميون", "الشيشيبوكاي", "الإمبراطورات", "الأدميرالات"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "يحملون أقنعة ويجلسون على رأس الحكومة العالمية"
  },
  {
    id: 36,
    question: "ما هو اسم الفاكهة التي أكلها كايدو؟",
    image: "https://staticg.sportskeeda.com/editor/2022/04/04b9c-16497908934530-1920.jpg",
    options: ["فيش فيش: موديل أزرق (التنين)", "زوان-زوان: نموذج الديناصور", "ميرا ميرا (النار)", "بارا بارا (التقطيع)"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "تتيح له التحول إلى تنين أسطوري"
  },
  {
    id: 37,
    question: "من هو الشخص الذي أنقذ لوفي من ماجيلان في إمبل داون؟",
    image: "https://qph.cf2.quoracdn.net/main-qimg-7e3f2da6456c9bf26349c3d50a0b7adf-lq",
    options: ["إيمبوريو إيفانكوف", "بون كلاي", "كروكودايل", "باغي"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "ثوري وملك أوكاما"
  },
  {
    id: 38,
    question: "ما اسم الخطة التي استخدمها دوفلامينغو للسيطرة على دريسروزا؟",
    image: "https://staticg.sportskeeda.com/editor/2023/05/4c2b4-16842845934451-1920.jpg",
    options: ["عملية SOP", "خطة النهاية العظمى", "مشروع SMILE", "خطة الصفقة"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "خطة لإسقاط عائلة ريكو الملكية"
  },
  {
    id: 39,
    question: "من هو الأخ الأكبر لموز؟",
    image: "https://sportshub.cbsistatic.com/i/2021/03/25/ee8b3e83-fbed-4b99-8dd0-b43e31b03637/one-piece-katakuri-whole-cake-1165042.jpg",
    options: ["شارلوت كاتاكوري", "شارلوت كراكر", "شارلوت سنودينج", "شارلوت داي فونجو"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "له فم غريب يخفيه تحت وشاحه"
  },
  {
    id: 40,
    question: "ما هو الاسم الحقيقي للمعلم (سنوكي) في وانو؟",
    image: "https://staticg.sportskeeda.com/editor/2022/04/c2f35-16508732824881-1920.jpg",
    options: ["كوزوكي أودن", "كاواماتسو", "ياسوي", "موموسوكي"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "كان دايميو كوري ووالد موموسوكي"
  },
  {
    id: 41,
    question: "ما هو اسم السلاح القديم الذي تقول الأسطورة أنه موجود في ألاباستا؟",
    image: "https://staticg.sportskeeda.com/editor/2023/01/98336-16728391862315-1920.jpg",
    options: ["بلوتون", "أورانوس", "بوسايدون", "زيوس"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "سفينة حربية قديمة بقوة تدميرية هائلة"
  },
  {
    id: 42,
    question: "من هو الشخص الذي صنع سيف إنما لزورو؟",
    image: "https://staticg.sportskeeda.com/editor/2022/08/bd4af-16594499311737-1920.jpg",
    options: ["شيموتسوكي هيتتسوجي", "كوزابورو", "تينجو", "سكيبيكي"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "صانع سيوف شهير من وانو كان صديقًا لريوما"
  },
  {
    id: 43,
    question: "من هو العضو الوحيد من طاقم روجر الذي ظهر في أرك وانو؟",
    image: "https://qph.cf2.quoracdn.net/main-qimg-1c8ecd3f44d6e7a6599b0e3c7ff41c61-lq",
    options: ["سكوبر غابان", "راي سيلفرز", "كرولوس", "أورز"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "كان الطباخ في سفينة روجر"
  },
  {
    id: 44,
    question: "من هو والد ريبيكا؟",
    image: "https://qph.cf2.quoracdn.net/main-qimg-b358b4d2b9d66d2d5e7e45a4c9ce8f96-lq",
    options: ["كيروس/سولديرز", "دوفلامينغو", "ديامانتي", "فيرغو"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "كان جنديًا محولًا إلى لعبة"
  },
  {
    id: 45,
    question: "ما هو اسم السجن الذي كان محبوسًا فيه جينبي قبل انضمامه إلى طاقم قبعة القش؟",
    image: "https://qph.cf2.quoracdn.net/main-qimg-4a8e1b8a6ae7e0c0dad0407f54e9d1b5-lq",
    options: ["إمبل داون", "بانك هازارد", "إنيس لوبي", "ماري جويس"],
    correctAnswer: 0,
    difficulty: 'hard',
    hint: "أخطر سجن في عالم ون بيس"
  },
];

export const getQuizQuestions = (difficulty: string, count: number = 10) => {
  let filteredQuestions: QuizQuestion[];
  
  if (difficulty === 'easy') {
    filteredQuestions = quizQuestions.filter(q => q.difficulty === 'easy');
  } else if (difficulty === 'hard') {
    filteredQuestions = quizQuestions.filter(q => q.difficulty === 'hard');
  } else {
    // For medium, mix easy, medium, and hard questions with proper distribution
    const easyQuestions = quizQuestions.filter(q => q.difficulty === 'easy').slice(0, Math.floor(count * 0.3));
    const mediumQuestions = quizQuestions.filter(q => q.difficulty === 'medium');
    const hardQuestions = quizQuestions.filter(q => q.difficulty === 'hard').slice(0, Math.floor(count * 0.2));
    
    filteredQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
  }
  
  // Shuffle and limit questions
  return shuffleArray(filteredQuestions).slice(0, count);
};

export default quizQuestions;
