export const ROLES = [
  "التنفيذ والعمليات",
  "القيادة والإدارة",
  "التحليل والبحث",
  "مجال الإبداع",
] as const;

export type DesiredRole = (typeof ROLES)[number];

export const WILAYAS = [
  "أدرار",
  "الشلف",
  "الأغواط",
  "أم البواقي",
  "باتنة",
  "بجاية",
  "بسكرة",
  "بشار",
  "البليدة",
  "البويرة",
  "تمنراست",
  "تبسة",
  "تلمسان",
  "تيارت",
  "تيزي وزو",
  "الجزائر",
  "الجلفة",
  "جيجل",
  "سطيف",
  "سعيدة",
  "سكيكدة",
  "سيدي بلعباس",
  "عنابة",
  "قالمة",
  "قسنطينة",
  "المدية",
  "مستغانم",
  "المسيلة",
  "معسكر",
  "ورقلة",
  "وهران",
  "البيض",
  "إليزي",
  "برج بوعريريج",
  "بومرداس",
  "الطارف",
  "تندوف",
  "تيسمسيلت",
  "الوادي",
  "خنشلة",
  "سوق أهراس",
  "تيبازة",
  "ميلة",
  "عين الدفلى",
  "النعامة",
  "عين تموشنت",
  "غرداية",
  "غليزان",
  "تيميمون",
  "برج باجي مختار",
  "أولاد جلال",
  "بني عباس",
  "عين صالح",
  "عين قزام",
  "تقرت",
  "جانت",
  "المغير",
  "المنيعة",
] as const;

export type CountryCode = {
  iso: string;
  name: string;
  nameAr: string;
  dial: string;
  flag: string;
};

export const COUNTRY_CODES: CountryCode[] = [
  { iso: "DZ", name: "Algeria", nameAr: "الجزائر", dial: "+213", flag: "🇩🇿" },
  { iso: "TN", name: "Tunisia", nameAr: "تونس", dial: "+216", flag: "🇹🇳" },
  { iso: "MA", name: "Morocco", nameAr: "المغرب", dial: "+212", flag: "🇲🇦" },
  { iso: "FR", name: "France", nameAr: "فرنسا", dial: "+33", flag: "🇫🇷" },
  { iso: "SA", name: "Saudi Arabia", nameAr: "السعودية", dial: "+966", flag: "🇸🇦" },
  { iso: "AE", name: "UAE", nameAr: "الإمارات", dial: "+971", flag: "🇦🇪" },
  { iso: "QA", name: "Qatar", nameAr: "قطر", dial: "+974", flag: "🇶🇦" },
  { iso: "EG", name: "Egypt", nameAr: "مصر", dial: "+20", flag: "🇪🇬" },
];

export type Profile = {
  fullName: string;
  countryDial: string;
  phone: string;
  residenceCity: string;
  age: string;
  qualification: string;
  desiredRole: DesiredRole | "";
};

export type AnswerMap = Record<string, string[]>;

export type Question = {
  id: string;
  title: string;
  options: { id: string; label: string; traits: string[] }[];
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "أكثر شيء تركز عليه في بيئة العمل:",
    options: [
      { id: "q1a", label: "النتائج والسرعة", traits: ["التنفيذ والعمليات"] },
      { id: "q1b", label: "الدقة والجودة", traits: ["التحليل والبحث", "التنفيذ والعمليات"] },
      { id: "q1c", label: "الحرية في العمل", traits: ["مجال الإبداع"] },
      { id: "q1d", label: "العلاقات بين الفريق", traits: ["القيادة والإدارة"] },
      { id: "q1e", label: "الاحترام", traits: ["القيادة والإدارة"] },
    ],
  },
  {
    id: "q2",
    title: "كيف تفضل نوعية مسؤولك المباشر:",
    options: [
      { id: "q2a", label: "الحازم والقوي", traits: ["القيادة والإدارة", "التنفيذ والعمليات"] },
      { id: "q2b", label: "الذكي والاستراتيجي", traits: ["التحليل والبحث", "مجال الإبداع"] },
      { id: "q2c", label: "القريب من الموظفين", traits: ["القيادة والإدارة"] },
      { id: "q2d", label: "الهادئ وغير المتدخل كثيراً", traits: ["التحليل والبحث"] },
    ],
  },
  {
    id: "q3",
    title: "أين تفضل قضاء وقت فراغك:",
    options: [
      { id: "q3a", label: "تعلم مهارات جديدة أو إنجاز شيء", traits: ["التنفيذ والعمليات", "مجال الإبداع"] },
      { id: "q3b", label: "التفكير والتأمل أو القراءة", traits: ["التحليل والبحث"] },
      { id: "q3c", label: "الخروج مع الأصدقاء", traits: ["القيادة والإدارة", "مجال الإبداع"] },
      { id: "q3d", label: "الراحة وعدم القيام بشيء", traits: ["التحليل والبحث"] },
      { id: "q3e", label: "عمل اجتماعي او نادي رياضي", traits: ["مجال الإبداع"] },
    ],
  },
  {
    id: "q4",
    title: "أي تجربة عمل تختارها أكثر:",
    options: [
      { id: "q4a", label: "مشروع فيه مخاطرة عالية وربح كبير", traits: ["مجال الإبداع"] },
      { id: "q4b", label: "مشروع آمن وربح متوسط", traits: ["التحليل والبحث", "القيادة والإدارة"] },
      { id: "q4c", label: "عمل مستقر بدون توتر", traits: ["التحليل والبحث", "التنفيذ والعمليات"] },
      { id: "q4d", label: "عمل حر غير ثابت لكن مرن", traits: ["مجال الإبداع"] },
    ],
  },
  {
    id: "q5",
    title: "كيف تتعامل مع الخلافات داخل العمل:",
    options: [
      { id: "q5a", label: "أفرض النظام بسرعة", traits: ["القيادة والإدارة"] },
      { id: "q5b", label: "أستمع لكل طرف ثم أحلل المشكلة", traits: ["القيادة والإدارة", "التحليل والبحث"] },
      { id: "q5c", label: "أضبط توتري أولا قبل التصرف", traits: ["القيادة والإدارة"] },
      { id: "q5d", label: "ترك الفريق يحل المشكلة بنفسه", traits: ["القيادة والإدارة"] },
    ],
  },
  {
    id: "q6",
    title: "إذا أعطوك منصباً عالياً:",
    options: [
      { id: "q6a", label: "أتحمس للتحدي فوراً", traits: ["القيادة والإدارة", "مجال الإبداع"] },
      { id: "q6b", label: "أدرس المسؤوليات أولاً", traits: ["التحليل والبحث", "القيادة والإدارة"] },
      { id: "q6c", label: "أفكر في تأثيري على الفريق", traits: ["القيادة والإدارة"] },
      { id: "q6d", label: "أخاف من الضغط الزائد", traits: ["التنفيذ والعمليات", "التحليل والبحث"] },
    ],
  },
  {
    id: "q7",
    title: "عندما يحقق فريق العمل نجاحا, ما أكثر ما يهمك:",
    options: [
      { id: "q7a", label: "أن يكون لمساهمتي دور واضح في هذا النجاح", traits: ["مجال الإبداع", "القيادة والإدارة"] },
      { id: "q7b", label: "أن نتقاسم النجاح ونفرح بانجاح الفريق", traits: ["القيادة والإدارة"] },
      { id: "q7c", label: "أن نحقق الاهداف والنتائج المطلوبة", traits: ["التحليل والبحث", "التنفيذ والعمليات"] },
      { id: "q7d", label: "أن نحتفل بالانجاز ونعيش اجواء الاجابية", traits: ["مجال الإبداع", "القيادة والإدارة"] },
    ],
  },
  // {
  //   id: "q8",
  //   title: "إذا أخفقت في مهمة داخل العمل:",
  //   options: [
  //     { id: "q8a", label: "أتحمل المسؤولية وأعيد المحاولة", traits: ["التنفيذ والعمليات", "القيادة والإدارة"] },
  //     { id: "q8b", label: "أحلل الخطأ بدقة", traits: ["التحليل والبحث"] },
  //     { id: "q8c", label: "أغير الاتجاه بالكامل", traits: ["مجال الإبداع"] },
  //     { id: "q8d", label: "أركز على دعم الفريق", traits: ["القيادة والإدارة"] },
  //   ],
  // },
  {
    id: "q9",
    title: "كيف تفضل بيئة العمل:",
    options: [
      { id: "q9a", label: "منظمة وواضحة", traits: ["القيادة والإدارة", "التحليل والبحث"] },
      { id: "q9b", label: "تحليلية وهادئة", traits: ["التحليل والبحث"] },
      { id: "q9c", label: "مرنة ومبدعة", traits: ["مجال الإبداع"] },
      { id: "q9d", label: "عملية ومباشرة", traits: ["التنفيذ والعمليات"] },
    ],
  },
  // {
  //   id: "q10",
  //   title: "كيف ترى مستقبلك المهني:",
  //   options: [
  //     { id: "q10a", label: "في التنفيذ والعمليات", traits: ["التنفيذ والعمليات"] },
  //     { id: "q10b", label: "في القيادة والإدارة", traits: ["القيادة والإدارة"] },
  //     { id: "q10c", label: "في التحليل والبحث", traits: ["التحليل والبحث"] },
  //     { id: "q10d", label: "في مجال الإبداع", traits: ["مجال الإبداع"] },
  //   ],
  // },
];


export type EvaluationResult = {
  recommendedRole: string;
  relatedRoles: DesiredRole[];
  summary: {
    strengths: string;
    fit: string;
    advice: string;
  };
  whatsappMessage: string;
};

export function formatInternationalPhone(dial: string, local: string) {
  const digits = local.replace(/\D/g, "").replace(/^0+/, "");
  return `${dial}${digits}`;
}

export function buildWhatsappMessage(
  profile: Profile,
  recommendedRole: string,
  relatedRoles: DesiredRole[],
  strengths: string,
  advice: string,
) {
  return [
    `مرحباً ${profile.fullName}! 🌟`,
    "شكراً لزيارتك جناحنا في صالون التوظيف.",
    "",
    'إليك نتيجة تقييم "بوصلة طموحك":',
    `🎯 المجال الأنسب لك: ${recommendedRole}`,
    `🔎 مجالات أخرى قريبة: ${relatedRoles.join("، ")}`,
    `💡 أبرز نقاط قوتك: ${strengths}`,
    `🚀 نصيحة لمسارك المهني: ${advice}`,
    "",
    "نتمنى لك كامل التوفيق في مسيرتك المهنية!",
    "IMA Plomberie",
  ].join("\n");
}

export function heuristicEvaluate(profile: Profile, answers: AnswerMap): EvaluationResult {
  const scores: Record<DesiredRole, number> = {
    "التنفيذ والعمليات": 0,
    "القيادة والإدارة": 0,
    "التحليل والبحث": 0,
    "مجال الإبداع": 0,
  };

  for (const question of QUESTIONS) {
    const selected = answers[question.id] ?? [];
    for (const option of question.options) {
      if (!selected.includes(option.id)) continue;
      for (const trait of option.traits) {
        if (ROLES.includes(trait as DesiredRole)) {
          scores[trait as DesiredRole] += 1;
        }
      }
    }
  }

  if (profile.desiredRole && scores[profile.desiredRole] !== undefined) {
    scores[profile.desiredRole] += 1.5;
  }

  const rankedRoles = ROLES.map((role) => ({ role, score: scores[role] })).sort(
    (a, b) => b.score - a.score,
  );
  const recommendedRole = rankedRoles[0]?.role ?? ROLES[0];
  const relatedRoles = rankedRoles.slice(1, 3).map(({ role }) => role);

  const strengths =
    "تتميز بأسلوب عملي متوازن يجمع بين الالتزام بالنتائج والقدرة على التعاون داخل الفريق، مع ميل واضح للدقة في التنفيذ.";
  const fit = `المنصب الأنسب لك هو «${recommendedRole}»، وهو يتوافق مع اختياراتك في بيئة العمل وأسلوب اتخاذ القرار${
    profile.desiredRole
      ? `، ويقترب من رغبتك في «${profile.desiredRole}»`
      : ""
  }. المجالات القريبة المناسبة لك: ${relatedRoles.join("، ")}.`;
  const advice =
    "طوّر مهارة واحدة قابلة للقياس خلال 90 يوماً (شهادة قصيرة أو مشروع ميداني) لتزيد فرصك في صالونات التوظيف والمقابلات.";

  const whatsappMessage = buildWhatsappMessage(
    profile,
    recommendedRole,
    relatedRoles,
    strengths,
    advice,
  );

  return {
    recommendedRole,
    relatedRoles,
    summary: { strengths, fit, advice },
    whatsappMessage,
  };
}
