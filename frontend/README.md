# بوصلة طموحك — صالون التوظيف

تطبيق كiosk بواجهة عربية RTL لشركة **IMA Plomberie**. يجمع بيانات المترشح، يمر على تقييم من 10 أسئلة، يحلّل الإجابات عبر Gemini، يخزن البيانات في PostgreSQL، ويرسل النتيجة إلى واتساب.

## التشغيل

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

## متغيرات البيئة

- `GEMINI_API_KEY` و `GEMINI_MODEL` (الافتراضي `gemini-2.5-flash`)
- `POSTGRES_CONNECTION_STRING` للاتصال بقاعدة البيانات. يتم إنشاء جدول `career_assessments` تلقائياً عند أول تقييم.
- واتساب عبر أحد المزودين:
  - UltraMsg: `WHATSAPP_PROVIDER=ultramsg` + `ULTRAMSG_INSTANCE_ID` + `ULTRAMSG_TOKEN`
  - Twilio: `WHATSAPP_PROVIDER=twilio` + بيانات الحساب
  - ويب هوك (Zapier/Make/Green API): `WHATSAPP_PROVIDER=webhook` + `WHATSAPP_WEBHOOK_URL`

بدون مفاتيح، يعمل التقييم بخوارزمية احتياطية وتظهر النتيجة على الشاشة دون إرسال واتساب.
