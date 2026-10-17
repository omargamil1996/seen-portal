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

> `--legacy-peer-deps` ضروري بسبب تعارض peer deps بين `echarts-for-react` و React 18.

---

## 🧱 التقنيات

| الطبقة | التقنية |
| --- | --- |
| الإطار | Next.js 14.2 (App Router) |
| اللغة | TypeScript (strict) |
| التنسيق | Tailwind CSS 3.4 + نظام تصميم مخصص |
| الحركة | Framer Motion 11 |
| الرسوم البيانية | Recharts 2.15 + ECharts 5 |
| الأيقونات | Lucide React |

---

## 📁 بنية المشروع — المسارات الحقيقية

> ⚠️ لا يوجد مجلد `src/` في هذا المشروع. الملفات في جذر المستودع مباشرة.

```
.
├── app/
│   ├── layout.tsx          # الخطوط (Amiri · Cairo · Inter) + metadata
│   ├── page.tsx            # ⚠️ البوابة الرئيسية — 150 KB · 12 تبويب · ملف واحد
│   └── globals.css         # متغيرات التصميم + أنماط الطباعة
├── components/
│   ├── DataRoomVault.tsx   # خزنة المستندات (49 مستند)
│   ├── SectorModal.tsx     # نافذة تفاصيل القطاع
│   └── AdvancedCharts.tsx  # رسوم ECharts المتقدمة
├── lib/
│   ├── data.ts             # كل محتوى البوابة (مالية · خطب · قطاعات · مخاطر)
│   ├── translations.ts     # نصوص عربي / إنجليزي
│   └── utils.ts            # cn() وتنسيق الأرقام
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages (غير مستخدم للإنتاج)
├── next.config.mjs         # output: 'export' + إعدادات الصور
├── tailwind.config.ts      # الألوان والخطوط المخصصة
├── tsconfig.json           # strict · paths: @/* → ./src/*  ⚠️ قديم
├── vercel.json             # رؤوس الأمان + CORS
├── CHANGELOG.md            # سجل التغييرات
├── BACKUP_LOG.md           # سجل النسخ الاحتياطية
├── PROMPT.md               # مواصفات البناء الأصلية (v5.0)
└── README.md               # هذا الملف
```

### أين أعدّل ماذا؟

| أريد تغيير… | الملف |
| --- | --- |
| رقم مالي، عميل، سعر، خطر | `lib/data.ts` |
| نص عربي أو إنجليزي | `lib/translations.ts` |
| لون أو خط | `tailwind.config.ts` + `app/globals.css` |
| ترتيب التبويبات أو تخطيطها | `app/page.tsx` |
| مستندات Data Room | `components/DataRoomVault.tsx` |
| الرسوم البيانية | `components/AdvancedCharts.tsx` |

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

عربي (RTL) وإنجليزي (LTR) — تُدار من `lib/translations.ts`.

---

## 🚀 النشر

- **الإنتاج:** Vercel — تنشر تلقائيًا عند الدفع إلى `main`
- **GitHub Pages:** عبر `.github/workflows/deploy.yml` (احتياطي — البناء فيه معطّل حاليًا)

---

## 🔐 ملاحظات أمنية

- `vercel.json` يضبط CSP صارمًا + `X-Frame-Options: DENY`
- لا مفاتيح API داخل الكود أو المستودع
- تفاصيل بروتوكول الأمان الداخلية **غير** مضمنة هنا (مستودع `seen--automation-os`)

---

## ⚠️ ديون تقنية معروفة

1. **`app/page.tsx` ملف واحد بحجم 150 KB** — يحتوي الـ 12 تبويبًا معًا. أي تعديل عليه يحتاج حذرًا، وهو أول مرشح للتقسيم إلى `components/tabs/`.
2. **`tsconfig.json`** يحوي `paths: { "@/*": ["./src/*"] }` و `include: ["src/**/*"]` — مسارات قديمة من نسخة سابقة بُنيت داخل `src/`. الملفات الحالية لا تستخدم `@/`.
3. **GitHub Actions build معطّل** منذ 13 أكتوبر — لا يؤثر على Vercel، لكنه يعني غياب فحص CI للأنواع (type-check).
4. **`next.config.mjs`** يستخدم `output: 'export'`، أي لا يمكن استخدام أي ميزة تحتاج خادمًا (Route Handlers، ISR، Middleware).

---

## 📚 ملفات مرجعية

- [CHANGELOG.md](./CHANGELOG.md) — سجل التغييرات
- [BACKUP_LOG.md](./BACKUP_LOG.md) — سجل النسخ الاحتياطية
- [PROMPT.md](./PROMPT.md) — مواصفات البناء الأصلية (v5.0)

---

© 2026 Seen Automation · Omar Baabdullah
