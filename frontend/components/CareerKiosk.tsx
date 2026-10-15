"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  ChevronDown,
  Compass,
  GraduationCap,
  Loader2,
  MessageCircle,
  RotateCcw,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";
import {
  COUNTRY_CODES,
  QUESTIONS,
  ROLES,
  WILAYAS,
  formatInternationalPhone,
  type AnswerMap,
  type DesiredRole,
  type EvaluationResult,
  type Profile,
} from "@/lib/assessment";

const TOTAL_STEPS = QUESTIONS.length + 1;

const roleIcons: Record<string, typeof Wrench> = {
  "التنفيذ والعمليات": Wrench,
  "القيادة والإدارة": Briefcase,
  "التحليل والبحث": GraduationCap,
  "مجال الإبداع": Sparkles,
};

const roleVisuals: Record<DesiredRole, { src: string; alt: string }> = {
  "التنفيذ والعمليات": {
    src: "/gallery/operations.png",
    alt: "موظف يعمل في مجال التنفيذ والعمليات",
  },
  "القيادة والإدارة": {
    src: "/gallery/leadership.png",
    alt: "قائد فريق يشرح خطة العمل",
  },
  "التحليل والبحث": {
    src: "/gallery/reaserch.png",
    alt: "باحث يحلل البيانات ويعمل على تقرير",
  },
  "مجال الإبداع": {
    src: "/gallery/creative.png",
    alt: "مصمم يبتكر خطة تسويقية",
  },
};

function getRoleVisual(role: string) {
  const matchedRole = ROLES.find((candidate) => candidate === role) ?? ROLES[0];
  return roleVisuals[matchedRole];
}

const emptyProfile: Profile = {
  fullName: "",
  countryDial: "+213",
  phone: "",
  residenceCity: "",
  age: "",
  qualification: "",
  desiredRole: "",
};

export default function CareerKiosk() {
  const [phase, setPhase] = useState<"welcome" | "form" | "result">("welcome");
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [countryOpen, setCountryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [whatsappStatus, setWhatsappStatus] = useState("");

  const progress = useMemo(() => ((step + 1) / TOTAL_STEPS) * 100, [step]);
  const currentQuestion = QUESTIONS[step - 1];
  const selectedCountry =
    COUNTRY_CODES.find((c) => c.dial === profile.countryDial) ?? COUNTRY_CODES[0];

  function updateProfile<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  function toggleOption(questionId: string, optionId: string) {
    setAnswers((prev) => {
      const current = prev[questionId] ?? [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [questionId]: next };
    });
  }

  function canContinue() {
    if (step === 0) {
      return (
        profile.fullName.trim().length >= 2 &&
        profile.phone.replace(/\D/g, "").length >= 8 &&
        Boolean(profile.desiredRole)
      );
    }
    return (answers[currentQuestion.id] ?? []).length > 0;
  }

  async function submitAssessment() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, answers }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر التقييم");
      setResult(data);
      setPhase("result");

      setSending(true);
      const sendRes = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.fullName,
          countryDial: profile.countryDial,
          phone: profile.phone,
          message: data.whatsappMessage,
        }),
      });
      const sendData = await sendRes.json();
      if (sendData.ok) {
        setWhatsappStatus(
          `تم إرسال النتيجة إلى واتساب ${formatInternationalPhone(profile.countryDial, profile.phone)}`,
        );
      } else {
        setWhatsappStatus(
          sendData.message ||
            sendData.error ||
            "النتيجة جاهزة على الشاشة. إعداد واتساب غير مكتمل بعد.",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
      setSending(false);
    }
  }

  function next() {
    if (!canContinue()) return;
    if (step === QUESTIONS.length) {
      void submitAssessment();
      return;
    }
    setStep((s) => s + 1);
  }

  function reset() {
    setPhase("welcome");
    setStep(0);
    setProfile(emptyProfile);
    setAnswers({});
    setResult(null);
    setError("");
    setWhatsappStatus("");
  }

  const resultVisual = getRoleVisual(result?.recommendedRole ?? "");

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/gallery/Boussole2.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#061224]/45" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-5 sm:px-8 sm:py-8">
        <header className="mb-6">
          <div className="mb-2 flex items-center justify-center gap-2 whitespace-nowrap text-white">
            <p className="text-[17px] font-semibold tracking-wide text-cyan-200 sm:text-xl">
              صالون التوظيف
            </p>
            <span aria-hidden="true" className="text-cyan-200/70">·</span>
            <h1 className="text-[22px] font-bold sm:text-[28px]">بوصلة طموحك</h1>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {phase === "welcome" && (
            <motion.section
              key="welcome"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex flex-1 flex-col"
            >
              <div className="relative w-full max-w-4xl self-center rounded-3xl border border-white/15 bg-white/10 px-6 pb-6 pt-20 shadow-2xl backdrop-blur-xl sm:px-10 sm:pb-8 sm:pt-24">
                <HangingLogo />
                {/* <span className="inline-flex items-center gap-2 rounded-full bg-cyan-400/15 px-4 py-2 text-sm text-cyan-100">
                  <Compass className="h-4 w-4" />
                  تقييم شخصي تفاعلي
                </span> */}
                <h2 className="mt-5 text-center text-3xl font-extrabold leading-snug text-white sm:text-5xl">
                  اكتشف المنصب الذي يناسب شخصيتك المهنية
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-8 text-slate-200 sm:text-lg">
                  خلال دقائق، نجمع ملفاً مختصراً عنك ثم نمرّ على عشر أسئلة متعددة
                  الاختيارات. الذكاء الاصطناعي يحلّل أسلوب عملك ويرسل التوصية
                  مباشرة إلى حساب واتسابك.
                </p>
              </div>

              <div className="mt-auto flex flex-col items-center gap-5 pb-2 pt-8 sm:flex-row sm:justify-center sm:gap-8">
                <div className="flex items-center gap-4">
                  {[
                    { label: "البيانات الشخصية", Icon: UserRound },
                    { label: "8 أسئلة سريعة", Icon: Compass },
                    { label: "النتيجة على واتساب", Icon: MessageCircle },
                  ].map(({ label, Icon }, index) => (
                    <div
                      key={label}
                      aria-label={label}
                      title={label}
                      className="flex items-center gap-3 text-cyan-100"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-cyan-200/50 bg-white/10">
                        <Icon className="h-5 w-5" />
                      </span>
                      {index < 2 && (
                        <ArrowLeft
                          aria-hidden="true"
                          className="h-4 w-4 text-cyan-200/80"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setPhase("form")}
                  className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-gradient-to-l from-[#0084d6] to-[#3ab4f0] px-8 text-lg font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:brightness-110"
                >
                  ابدأ التقييم
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>

              {/* <div className="grid grid-cols-2 grid-rows-2 gap-3">
                {[
                  ["/gallery/images_1.jpeg", "وصلات وأنابيب PPR"],
                  ["/gallery/images_2.jpeg", "خرطوم دش مرن"],
                  ["/gallery/images_3.jpeg", "أشرطة عزل بأحجام متعددة"],
                  ["/gallery/images_4.jpeg", "حامل ورق صحي"],
                ].map(([src, caption]) => (
                  <figure
                    key={src}
                    className="relative min-h-44 overflow-hidden rounded-3xl border border-white/10 bg-[#087fbc] sm:min-h-56"
                  >
                    <Image
                      src={src}
                      alt={caption}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-black/55 p-2 text-center text-xs font-medium text-white sm:text-sm">
                      {caption}
                    </figcaption>
                  </figure>
                ))}
              </div> */}
            </motion.section>
          )}

          {phase === "form" && (
            <motion.section
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="relative flex flex-1 flex-col rounded-3xl border border-white/15 bg-white/10 px-5 pb-5 pt-20 shadow-2xl backdrop-blur-xl sm:px-8 sm:pb-8 sm:pt-24"
            >
              <HangingLogo />
              <br/>
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-sm text-cyan-100">
                  <span>
                    {step === 0
                      ? "الخطوة 1 من 9 — الملف الشخصي"
                      : `السؤال ${step} من 9`}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-l from-[#0084d6] to-[#3ab4f0]"
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 0 ? (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    className="grid flex-1 gap-5 lg:grid-cols-2"
                  >
                    <Field label="الاسم الكامل" required>
                      <input
                        value={profile.fullName}
                        onChange={(e) => updateProfile("fullName", e.target.value)}
                        className="kiosk-input"
                        placeholder="مثال: أمين بن علي"
                      />
                    </Field>

                    <Field label="رقم الواتساب" required>
                      <div className="flex gap-2">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setCountryOpen((v) => !v)}
                            className="kiosk-input flex min-w-[132px] items-center justify-between gap-2 px-3"
                          >
                            <span>
                              {selectedCountry.flag} {selectedCountry.dial}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          {countryOpen && (
                            <div className="absolute z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-white/15 bg-[#0b1f3a] shadow-xl">
                              {COUNTRY_CODES.map((country) => (
                                <button
                                  key={country.iso}
                                  type="button"
                                  className="flex w-full items-center justify-between px-4 py-3 text-right hover:bg-white/10"
                                  onClick={() => {
                                    updateProfile("countryDial", country.dial);
                                    setCountryOpen(false);
                                  }}
                                >
                                  <span>
                                    {country.flag} {country.nameAr}
                                  </span>
                                  <span className="text-cyan-200">{country.dial}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          value={profile.phone}
                          onChange={(e) => updateProfile("phone", e.target.value)}
                          className="kiosk-input flex-1"
                          inputMode="tel"
                          placeholder="555123456"
                        />
                      </div>
                    </Field>

                    <Field label="ولاية الإقامة">
                      <select
                        value={profile.residenceCity}
                        onChange={(e) =>
                          updateProfile("residenceCity", e.target.value)
                        }
                        className="kiosk-input"
                      >
                        <option value="">اختر الولاية</option>
                        {WILAYAS.map((wilaya) => (
                          <option key={wilaya} value={wilaya}>
                            {wilaya}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="السن">
                      <input
                        value={profile.age}
                        onChange={(e) => updateProfile("age", e.target.value)}
                        className="kiosk-input"
                        inputMode="numeric"
                        placeholder="25"
                      />
                    </Field>

                    <Field label="الشهادة الأخيرة / المؤهل العلمي">
                      <input
                        value={profile.qualification}
                        onChange={(e) =>
                          updateProfile("qualification", e.target.value)
                        }
                        className="kiosk-input"
                        placeholder="ليسانس، تقني سامي..."
                      />
                    </Field>

                    <div className="lg:col-span-2">
                      <Field label="المنصب المرغوب فيه" required>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {ROLES.map((role) => {
                            const Icon = roleIcons[role];
                            const active = profile.desiredRole === role;
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => updateProfile("desiredRole", role)}
                                className={`flex min-h-16 items-center justify-center gap-2 rounded-2xl border px-3 text-base font-semibold transition ${
                                  active
                                    ? "border-cyan-300 bg-cyan-400/20 text-white shadow-inner"
                                    : "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                                {role}
                              </button>
                            );
                          })}
                        </div>
                      </Field>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    className="flex flex-1 flex-col"
                  >
                    <p className="text-sm text-cyan-200">يمكن اختيار أكثر من إجابة</p>
                    <h3 className="mt-2 text-2xl font-bold leading-relaxed sm:text-3xl">
                      {currentQuestion.title}
                    </h3>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {currentQuestion.options.map((option) => {
                        const active = (answers[currentQuestion.id] ?? []).includes(
                          option.id,
                        );
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              toggleOption(currentQuestion.id, option.id)
                            }
                            className={`flex min-h-20 items-center justify-between rounded-2xl border px-5 py-4 text-right text-lg transition ${
                              active
                                ? "border-cyan-300 bg-cyan-400/20 text-white"
                                : "border-white/10 bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <span>{option.label}</span>
                            <span
                              className={`grid h-7 w-7 place-items-center rounded-full border ${
                                active
                                  ? "border-cyan-200 bg-cyan-400 text-[#061224]"
                                  : "border-white/20"
                              }`}
                            >
                              {active && <Check className="h-4 w-4" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <p className="mt-4 rounded-xl bg-rose-500/15 px-4 py-3 text-rose-100">
                  {error}
                </p>
              )}

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => (step === 0 ? setPhase("welcome") : setStep(step - 1))}
                  className="inline-flex min-h-14 items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 text-base font-semibold"
                >
                  <ArrowRight className="h-5 w-5" />
                  رجوع
                </button>
                <button
                  type="button"
                  disabled={!canContinue() || loading}
                  onClick={next}
                  className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-gradient-to-l from-[#0084d6] to-[#3ab4f0] px-8 text-lg font-bold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جارٍ التحليل...
                    </>
                  ) : step === QUESTIONS.length ? (
                    "احصل على النتيجة"
                  ) : (
                    <>
                      التالي
                      <ArrowLeft className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.section>
          )}

          {phase === "result" && result && (
            <motion.section
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid flex-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="relative rounded-3xl border border-white/15 bg-white/10 px-6 pb-6 pt-20 backdrop-blur-xl sm:px-8 sm:pb-8 sm:pt-24">
                <HangingLogo />
                <p className="text-cyan-200">نتيجة بوصلة طموحك</p>
                <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                  {profile.fullName}
                </h2>
                <div className="mt-6 rounded-2xl bg-gradient-to-l from-[#0084d6] to-[#3ab4f0] p-5 text-white">
                  <p className="text-sm opacity-90">المنصب الأنسب لك</p>
                  <p className="mt-1 text-3xl font-black">{result.recommendedRole}</p>
                </div>
                <div className="mt-5 grid gap-4">
                  <ResultCard title="نقاط القوة وأسلوب العمل" text={result.summary.strengths} />
                  <ResultCard title="المنصب الأنسب لك وتوافقه" text={result.summary.fit} />
                  <ResultCard
                    title="مجالات وظيفية قريبة"
                    text={result.relatedRoles.join("، ")}
                  />
                  <ResultCard title="نصيحة للتطور المهني" text={result.summary.advice} />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-white/10 sm:min-h-[480px] lg:min-h-[600px]">
                  <Image
                    src={resultVisual.src}
                    alt={resultVisual.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061224] via-transparent" />
                  {/* <div className="absolute bottom-4 right-4 left-4 rounded-xl border border-white/10 bg-[#061224]/75 p-4 backdrop-blur-sm">
                    <p className="text-xs font-semibold text-cyan-200">
                      المجال المقترح
                    </p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {result.recommendedRole}
                    </p>
                  </div> */}
                </div>
                <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-cyan-100">
                    <MessageCircle className="h-5 w-5" />
                    واتساب
                  </div>
                  <p className="mt-3 leading-7 text-slate-100">
                    {sending
                      ? "جارٍ إرسال النتيجة إلى واتساب..."
                      : whatsappStatus || "تم تجهيز الرسالة."}
                  </p>
                  <pre className="mt-4 max-h-48 overflow-auto whitespace-pre-wrap rounded-2xl bg-black/25 p-4 text-sm leading-7">
                    {result.whatsappMessage}
                  </pre>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 text-lg font-semibold"
                  >
                    <RotateCcw className="h-5 w-5" />
                    تقييم مترشح جديد
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function HangingLogo() {
  return (
    <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-b-xl bg-white px-3 pb-1 pt-1 shadow-lg sm:px-4">
      <Image
        src="/ima.jpg"
        alt="IMA Plomberie"
        width={160}
        height={90}
        className="h-auto w-[112px] object-contain sm:w-32"
        priority
      />
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-cyan-100">
        {label}
        {required && <span className="mr-1 text-rose-300">*</span>}
      </span>
      {children}
    </label>
  );
}

function ResultCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h3 className="font-bold text-cyan-100">{title}</h3>
      <p className="mt-2 leading-8 text-slate-100">{text}</p>
    </article>
  );
}
