# Seen Automation — Investor Portal

بوابة المستثمر التفاعلية لوكالة **Seen Automation** — أول وكالة أتمتة AI حلال في العالم العربي.

> **Automate. Elevate. Halal.**

**Live:** <https://seen-portal-omega.vercel.app>

---

## ⚡ البدء السريع

```bash
npm install --legacy-peer-deps
npm run dev      # http://localhost:3000
npm run build    # production build
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

## 📁 بنية المشروع

```
src/
├── app/
│   ├── layout.tsx         # الخطوط (Amiri · Cairo · Inter) + metadata
│   ├── page.tsx           # البوابة الرئيسية — 12 تبويب
│   └── globals.css        # متغيرات التصميم + أنماط الطباعة
├── components/
│   ├── DataRoomVault.tsx  # خزنة المستندات (49 مستند)
│   ├── SectorModal.tsx    # نافذة تفاصيل القطاع
│   └── AdvancedCharts.tsx # رسوم ECharts المتقدمة
└── lib/
    ├── data.ts            # كل محتوى البوابة (مالية · خطة · قطاعات · مخاطر)
    ├── translations.ts    # نصوص عربي / إنجليزي
    └── utils.ts           # cn() وتنسيق الأرقام
```

### أين أعدّل ماذا؟

| أريد تغيير… | الملف |
| --- | --- |
| رقم مالي، عميل، سيناريو | `src/lib/data.ts` |
| نص أو ترجمة | `src/lib/translations.ts` |
| لون أو خط | `tailwind.config.ts` و `src/app/globals.css` |
| ترتيب التبويبات أو تخطيطها | `src/app/page.tsx` |

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

- **الإنتاج:** Vercel — تلقائي عند الدفع إلى `main`
- **احتياطي:** GitHub Pages عبر `.github/workflows/deploy.yml`

---

## 🔐 ملاحظات أمنية

- `vercel.json` يضبط CSP صارمًا + `X-Frame-Options: DENY`
- لا مفاتيح API داخل الكود أو المستودع
- تفاصيل بروتوكول الأمان الداخلية **غير** مضمّنة هنا (مستودع `seen--automation-os`)

---

## 📚 ملفات مرجعية

- [`CHANGELOG.md`](./CHANGELOG.md) — سجل التغييرات
- [`BACKUP_LOG.md`](./BACKUP_LOG.md) — سجل النسخ الاحتياطية
- [`PROMPT.md`](./PROMPT.md) — مواصفات البناء الأصلية (v5.0)

---

© 2026 Seen Automation · Omar Baabdullah