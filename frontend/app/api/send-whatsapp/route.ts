import { NextResponse } from "next/server";
import { formatInternationalPhone } from "@/lib/assessment";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      countryDial?: string;
      phone?: string;
      message?: string;
      name?: string;
    };

    if (!body.phone || !body.message) {
      return NextResponse.json(
        { error: "رقم الواتساب والرسالة مطلوبان." },
        { status: 400 },
      );
    }

    const to = formatInternationalPhone(body.countryDial || "+213", body.phone);
    const provider = (process.env.WHATSAPP_PROVIDER || "ultramsg").toLowerCase();

    if (provider === "ultramsg") {
      const instance = process.env.ULTRAMSG_INSTANCE_ID;
      const token = process.env.ULTRAMSG_TOKEN;
      if (!instance || !token) {
        return NextResponse.json(
          {
            ok: false,
            skipped: true,
            message:
              "تم حفظ النتيجة محلياً. أضف بيانات UltraMsg في ملف البيئة لإرسال واتساب.",
          },
          { status: 200 },
        );
      }

      const payload = new URLSearchParams({
        token,
        to,
        body: body.message,
      });

      const response = await fetch(
        `https://api.ultramsg.com/${instance}/messages/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: payload,
          signal: AbortSignal.timeout(10000),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        return NextResponse.json(
          { error: "فشل إرسال واتساب عبر UltraMsg.", details: data },
          { status: 502 },
        );
      }

      return NextResponse.json({ ok: true, provider, to, data });
    }

    if (provider === "twilio") {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_WHATSAPP_FROM;
      if (!sid || !token || !from) {
        return NextResponse.json(
          {
            ok: false,
            skipped: true,
            message: "أضف بيانات Twilio في ملف البيئة لإرسال واتساب.",
          },
          { status: 200 },
        );
      }

      const auth = Buffer.from(`${sid}:${token}`).toString("base64");
      const payload = new URLSearchParams({
        From: from,
        To: `whatsapp:${to}`,
        Body: body.message,
      });

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: payload,
          signal: AbortSignal.timeout(10000),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        return NextResponse.json(
          { error: "فشل إرسال واتساب عبر Twilio.", details: data },
          { status: 502 },
        );
      }

      return NextResponse.json({ ok: true, provider, to, data });
    }

    const webhook = process.env.WHATSAPP_WEBHOOK_URL;
    if (!webhook) {
      return NextResponse.json(
        {
          ok: false,
          skipped: true,
          message: "لم يتم ضبط رابط الويب هوك. النتيجة جاهزة للعرض فقط.",
        },
        { status: 200 },
      );
    }

    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: body.name,
        phone: to,
        message: body.message,
        source: "IMA صالون التوظيف",
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "فشل إرسال الرسالة عبر الويب هوك." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, provider: "webhook", to });
  } catch (error) {
    console.error("WhatsApp provider unavailable:", error);
    return NextResponse.json(
      {
        ok: false,
        skipped: true,
        message:
          "تعذر الاتصال بمزود واتساب حالياً. النتيجة محفوظة وجاهزة للعرض على الشاشة.",
      },
      { status: 200 },
    );
  }
}
