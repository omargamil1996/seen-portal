# Seen Automation — Investor Portal

بوابة المستثمر التفاعلية لوكالة **Seen Automation** — أول وكالة أتمتة AI حلال في العالم العربي.

> **Automate. Elevate. Halal.**

**Live:** <https://seen-portal-omega.vercel.app>

---

## ⚡ البدء السريع

```bash
npm install --legacy-peer-deps
npm run dev       # http://localhost:3000
npm run build     # production build (static export)
```

> `--legacy-peer-deps` ضروري بسبب تعارض peer deps في `echarts-for-react`.

---

## 🧱 التقنيات

| الطبقة | التقنية |
| --- | --- |
| الإطار | Next.js 14.2 (App Router) |
| اللغة | TypeScript strict |
| التنسيق | Tailwind CSS 3.4 + نظام تصميم مخصص |
| الحركة | Framer Motion 11 |
| الرسوم البيانية | Recharts 2.15 + ECharts 5 |
| الأيقونات | Lucide React |

---

## 📁 بنية المشروع — المسارات الحقيقية

```
.
├── src/
│   ├── app/
│   │   ├── globals.css       #   2.5 KB — متغيرات التصميم + أنماط الطباعة
│   │   ├── layout.tsx        #   1.0 KB — الخطوط (Amiri · Cairo · Inter) + metadata
│   │   └── page.tsx          # ⚠️ 147 KB — البوابة كاملة: 12 تبويبًا في ملف واحد
│   ├── components/
│   │   ├── AdvancedCharts.tsx  #   6.1 KB — رسوم ECharts
│   │   ├── DataRoomVault.tsx   #  35.7 KB — خزنة المستندات (49 مستند)
│   │   └── SectorModal.tsx     #   6.7 KB — نافذة تفاصيل القطاع
│   └── lib/
│       ├── data.ts             #  62.8 KB — كل محتوى البوابة (مالية · قطاعات · مخاطر)
│       ├── translations.ts     #   3.7 KB — نصوص عربي / إنجليزي
│       └── utils.ts            #   0.4 KB — cn() وتنسيق الأرقام
├── .github/workflows/
│   └── deploy.yml            # GitHub Pages (احتياطي — معطّل)
├── next.config.mjs           # output: 'export' + إعدادات الصور
├── tailwind.config.ts        # الألوان والخطوط
├── tsconfig.json             # strict · @/* → ./src/*
├── vercel.json               # رؤوس الأمان + CORS
├── CHANGELOG.md              # سجل التغييرات
├── BACKUP_LOG.md             # سجل النسخ الاحتياطية
├── PROMPT.md                 # مواصفات البناء الأصلية (v5.0)
└── README.md                 # هذا الملف
```

> `@/*` يُحلّ إلى `./src/*` — لذلك `import { DATA } from "@/lib/data"` يشير إلى `src/lib/data.ts`.

---

## 🗺️ أين أعدّل ماذا؟

| أريد تغيير… | الملف |
| --- | --- |
| رقم مالي، قطاع، سعر، خطر، عميل | `src/lib/data.ts` |
| نص عربي أو إنجليزي | `src/lib/translations.ts` |
| لون أو خط | `tailwind.config.ts` + `src/app/globals.css` |
| ترتيب التبويبات أو تخطيطها | `src/app/page.tsx` |
| مستندات Data Room | `src/components/DataRoomVault.tsx` |
| الرسوم البيانية | `src/components/AdvancedCharts.tsx` |
| نافذة تفاصيل القطاع | `src/components/SectorModal.tsx` |

**قاعدة عملية:** أي تغيير في **أرقام أو نصوص** → `lib/` فقط، ولا تقترب من `page.tsx`. أغلب التعديلات المتوقعة لا تحتاج فتح الملف الكبير إطلاقًا.

---

## 🎨 الهوية البصرية

| اللون | القيمة | الاستخدام |
| --- | --- | --- |
| Emerald | `#0F5132` | اللون الأساسي |
| Gold | `#D4AF37` | التمييز والحدود |
| Orange | `#F97316` | التحذير / CTA |
| Light BG | `#FAFAF8` | خلفية الوضع الفاتح |
| Dark BG | `#0A0A0A` | خلفية الوضع الداكن |

---

## 🌍 اللغات

عربي (RTL) وإنجليزي (LTR) — تُدار من `src/lib/translations.ts`.

---

## 🚀 النشر

| المسار | الحالة |
| --- | --- |
| **Vercel** (الإنتاج) | ✅ ينشر تلقائيًا عند الدفع إلى `main` |
| **GitHub Pages** | ❌ معطّل — `deploy.yml` يفشل عند `npm run build` |

عند فشل بناء Vercel، **يبقى آخر نشر ناجح شغّالًا** — البوابة لا تسقط.

---

## 🔐 ملاحظات أمنية

- `vercel.json` يضبط CSP صارمًا + `X-Frame-Options: DENY`
- لا مفاتيح API داخل الكود أو المستودع
- بروتوكول الأمان الداخلي التفصيلي **غير** مضمن هنا (مستودع `seen--automation-os`)

---

## ⚠️ ديون تقنية معروفة

1. **`src/app/page.tsx` = 147 KB في ملف واحد** — يحتوي التبويبات الاثني عشر معًا.
   هذا هو العائق الأول أمام أي تعديل هيكلي. المرشح للتقسيم إلى
   `src/components/tabs/*.tsx` بمكوّن واحد لكل تبويب.
2. **`deploy.yml` معطّل** منذ 13 أكتوبر (فشل `next build`) — لا يؤثر على Vercel،
   لكنه يعني غياب فحص CI للأنواع (type-check).
3. **`next.config.mjs` يستخدم `output: 'export'`** — لا يمكن استخدام أي ميزة تحتاج
   خادمًا (Route Handlers · ISR · Middleware).

---

## 📚 ملفات مرجعية

- [CHANGELOG.md](./CHANGELOG.md) — سجل التغييرات
- [BACKUP_LOG.md](./BACKUP_LOG.md) — سجل النسخ الاحتياطية
- [PROMPT.md](./PROMPT.md) — مواصفات البناء الأصلية (v5.0)
- `seen-backup-2026-10-17` — نسخة كاملة من المستودع قبل التنظيف (17 أكتوبر 2026)

---

© 2026 Seen Automation · Omar Baabdullah
