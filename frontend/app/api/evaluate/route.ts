import { NextResponse } from "next/server";
import { saveAssessment } from "@/lib/database";
import {
  ROLES,
  QUESTIONS,
  buildWhatsappMessage,
  heuristicEvaluate,
  type AnswerMap,
  type DesiredRole,
  type Profile,
} from "@/lib/assessment";

async function persistAssessment(
  profile: Profile,
  answers: AnswerMap,
  result: ReturnType<typeof heuristicEvaluate>,
) {
  try {
    await saveAssessment(profile, answers, result);
  } catch (error) {
    console.error("Could not save assessment to PostgreSQL:", error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      profile?: Profile;
      answers?: AnswerMap;
    };

    const profile = body.profile;
    const answers = body.answers;

    if (!profile?.fullName || !profile.phone || !answers) {
      return NextResponse.json(
        { error: "البيانات غير مكتملة. الاسم ورقم الواتساب والإجابات مطلوبة." },
        { status: 400 },
      );
    }

    const fallback = heuristicEvaluate(profile, answers);

    if (!process.env.GEMINI_API_KEY) {
      await persistAssessment(profile, answers, fallback);
      return NextResponse.json(fallback);
    }

    const formattedAnswers = QUESTIONS.map((question) => {
      const selected = answers[question.id] ?? [];
      const labels = question.options
        .filter((option) => selected.includes(option.id))
        .map((option) => option.label);
      return `${question.title}\n- ${labels.join("\n- ") || "بدون إجابة"}`;
    }).join("\n\n");

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const prompt = `أنت مستشار توظيف في جناح شركة IMA Plomberie خلال صالون التوظيف.
حلّل شخصية المترشح بالعربية الفصحى الواضحة والمشجّعة.
قيّم سمات: القيادة، العمل الجماعي، الدقة، التحليل، التنفيذ، والابتكار.
قارن الإجابات مع المجال المرغوب، واجعل توصيتك متوافقة مع واحد فقط من هذه المجالات: ${ROLES.join("، ")}.
اقترح مجالين قريبين على أن يختلفا عن المجال الأنسب.
أرجع JSON فقط بالمفاتيح:
recommendedRole (string),
summary: { strengths, fit, advice } (كل قيمة جملة عربية موجزة)،
whatsappMessage (نص واتساب جاهز يتضمن المجال الأنسب والمجالين القريبين).
whatsappMessage يجب أن يتبع هذا القالب حرفياً مع تعويض القيم:
مرحباً [الاسم]! 🌟
شكراً لزيارتك جناحنا في صالون التوظيف.

إليك نتيجة تقييم "بوصلة طموحك":
🎯 المجال الأنسب لك: [المجال]
🔎 مجالات أخرى قريبة: [المجالان]
💡 أبرز نقاط قوتك: [ملخص القوة]
🚀 نصيحة لمسارك المهني: [النصيحة]

نتمنى لك كامل التوفيق في مسيرتك المهنية!
IMA Plomberie

بيانات المترشح:
الاسم: ${profile.fullName}
العمر: ${profile.age || "غير محدد"}
المؤهل: ${profile.qualification || "غير محدد"}
ولاية الإقامة: ${profile.residenceCity || "غير محددة"}
المجال المرغوب: ${profile.desiredRole || "غير محدد"}

الإجابات:
${formattedAnswers}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4,
              responseMimeType: "application/json",
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Gemini API request failed with status ${response.status}`);
      }

      const geminiResult = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };

      const raw = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) throw new Error("Gemini returned no evaluation");

      const parsed = JSON.parse(raw) as typeof fallback;
      const recommendedRole = ROLES.includes(parsed.recommendedRole as DesiredRole)
        ? (parsed.recommendedRole as DesiredRole)
        : fallback.recommendedRole;
      const candidateRelatedRoles = Array.isArray(parsed.relatedRoles)
        ? parsed.relatedRoles.filter(
            (role): role is DesiredRole => ROLES.includes(role as DesiredRole),
          )
        : fallback.relatedRoles;
      const relatedRoles = [...new Set(candidateRelatedRoles)]
        .filter((role) => role !== recommendedRole)
        .slice(0, 2);
      const strengths = parsed.summary?.strengths || fallback.summary.strengths;
      const advice = parsed.summary?.advice || fallback.summary.advice;
      const result = {
        recommendedRole,
        relatedRoles: relatedRoles.length ? relatedRoles : fallback.relatedRoles,
        summary: {
          strengths,
          fit: parsed.summary?.fit || fallback.summary.fit,
          advice,
        },
        whatsappMessage: buildWhatsappMessage(
          profile,
          recommendedRole,
          relatedRoles.length ? relatedRoles : fallback.relatedRoles,
          strengths,
          advice,
        ),
      };

      await persistAssessment(profile, answers, result);
      return NextResponse.json(result);
    } catch (error) {
      console.error("Gemini evaluation unavailable, using fallback:", error);
      await persistAssessment(profile, answers, fallback);
      return NextResponse.json(fallback);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "تعذر تقييم الإجابات حالياً. حاول مرة أخرى." },
      { status: 500 },
    );
  }
}
