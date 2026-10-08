export const DATA = {
  company: {
    name_ar: "سين أوتوميشن",
    name_en: "Seen Automation AI Agency",
    founder: "عمر محمد جميل باعبدالله",
    tagline: "Automate. Elevate. Halal."
  },
  ask: 82500,
  tam: "3.5B", sam: "1.95B", som: "320K",
  mrrY1: 32000, mrrY3: 78000,
  arpu: 1600, churn: 6, cac: 1500, margin: 70,
  fixedCosts: 3500, newCustomers: 2.3,
  customersY1: 20, customersY3: 50, breakEven: 2,
  useOfFunds: { operations: 60, marketing: 40 },
  mudarabah: { phase1: 15, phase2: 15, buyoutMonths: 24, buyoutMultiple: 1.5, maxYears: 15 },
  sectors: [
    { id: "eng", name: "Engineering", ar: "الهندسة", status: "active", desc: "أتمتة RFIs، QOO، Submittals للمكاتب الهندسية" },
    { id: "med", name: "Medical", ar: "الطب", status: "upcoming", desc: "أتمتة السجلات والتقارير الطبية" },
    { id: "leg", name: "Legal", ar: "القانون", status: "upcoming", desc: "مراجعة العقود وصياغة المستندات" },
    { id: "edu", name: "Education", ar: "التعليم", status: "upcoming", desc: "أتمتة العمليات الإدارية" },
    { id: "com", name: "Commerce", ar: "التجارة", status: "upcoming", desc: "أتمتة سلاسل الإمداد والمخازن" }
  ],
  risks: [
    { id: 1, name: "تأخر اعتماد العميل", prob: "عالي", impact: "متوسط", mitigation: "تضمين بنود SLA واضحة", color: "red" },
    { id: 2, name: "تغير متطلبات المشروع", prob: "متوسط", impact: "عالي", mitigation: "نموذج Change Request رسمي", color: "yellow" },
    { id: 3, name: "فشل تكامل API خارجي", prob: "منخفض", impact: "عالي", mitigation: "Fallback mechanisms + Error Node", color: "green" },
    { id: 4, name: "تسرب بيانات العملاء", prob: "منخفض", impact: "عالي", mitigation: "تشفير AES-256 + عزل Containers", color: "green" },
    { id: 5, name: "منافسة أسعار قوية", prob: "عالي", impact: "متوسط", mitigation: "التركيز على القيمة والـ ROI", color: "red" },
    { id: 6, name: "نقص الكفاءات التقنية", prob: "متوسط", impact: "متوسط", mitigation: "الاعتماد على الأتمتة و Freelancers", color: "yellow" },
    { id: 7, name: "تغير تنظيمي (PDPL)", prob: "منخفض", impact: "عالي", mitigation: "مراجعة قانونية ربع سنوية", color: "green" },
    { id: 8, name: "هلوسة النماذج (AI)", prob: "متوسط", impact: "عالي", mitigation: "100 سؤال اختبار + RAG صارم", color: "yellow" },
    { id: 9, name: "تأخر دفع الفواتير", prob: "متوسط", impact: "متوسط", mitigation: "دفع مقدم + بنود تأخير حلال", color: "yellow" },
    { id: 10, name: "فقدان النسخ الاحتياطي", prob: "منخفض", impact: "عالي", mitigation: "نسخ يومية مشفرة + اختبار استعادة", color: "green" }
  ],
  hardware: {
    laptops: [
      { category: "Entry-Level", specs: "Ryzen AI 7, 32GB RAM", price: "$700-900", ai: "4B-8B" },
      { category: "Mid-Range", specs: "Ryzen AI 9, 32GB RAM", price: "$1,100-1,500", ai: "7B-13B" },
      { category: "High-End GPU", specs: "RTX 5070, 64GB RAM", price: "$1,600-2,500", ai: "13B-30B" },
      { category: "Extreme", specs: "RTX 5090 24GB, 128GB RAM", price: "$3,500-7,000", ai: "30B-70B" },
      { category: "Unified Memory", specs: "Ryzen AI Max+ 395, 128GB", price: "$3,000-4,000", ai: "70B-120B" }
    ],
    minipc: [
      { category: "Entry", specs: "Ryzen 7 255, 32GB", price: "$700-900" },
      { category: "Mid-Range", specs: "Ryzen AI 9 HX 370, 32GB", price: "$1,100-1,700" },
      { category: "High-End", specs: "Ryzen AI Max+ 395, 128GB", price: "$2,600-4,000" },
      { category: "Ultra GPU", specs: "RTX 5070/5090", price: "$1,600-3,500" },
      { category: "Extreme", specs: "RTX PRO 6000", price: "$6,000-12,000" }
    ],
    scenario: {
      name: "Unified Memory ($12,000)",
      laptop: "HP ZBook Ultra G1a 14 — Ryzen AI Max+ PRO 395, 128GB",
      minipc: "Minisforum MS-S1 Max — Ryzen AI Max+ 395, 128GB, 2TB",
      total: "$10,197",
      remaining: "$1,803"
    }
  },
  roadmap: [
    { quarter: "Q1", year: 1, title: "التأسيس", tasks: ["تسجيل الكيان", "إطلاق البوابة", "أول 5 عملاء"] },
    { quarter: "Q2", year: 1, title: "التحقق", tasks: ["تحسين البوت", "3 دراسات حالة", "MRR: SAR 10K"] },
    { quarter: "Q3", year: 1, title: "التوسع الأول", tasks: ["إطلاق رمح الطب", "20 عميل", "MRR: SAR 32K"] },
    { quarter: "Q4", year: 1, title: "النضج", tasks: ["أتمتة كاملة", "فريق دعم", "MRR: SAR 50K"] },
    { quarter: "Q1-Q4", year: 2, title: "التوسع الإقليمي", tasks: ["رمح القانون", "رمح التعليم", "MRR: SAR 100K"] },
    { quarter: "Q1-Q4", year: 3, title: "القيادة", tasks: ["Micro-SaaS", "80+ عميل", "MRR: SAR 250K"] }
  ],
  pitchSlides: [
    "1. الغلاف: Seen Automation AI Agency",
    "2. المشكلة: 7.6 ساعة/أسبوع مهدرة = 44 يوم/سنة",
    "3. الحل: AI Backend Pipelines + Zero-Friction",
    "4. لماذا الآن؟ Vision 2030 + 56.25% زيادة إنفاق AI",
    "5. حجم السوق: TAM $3.5B | SAM $1.95B | SOM $320K",
    "6. نموذج العمل: باقات + 15-20% من التأسيس شهرياً",
    "7. الجاهزية: 49 ملف استراتيجي + 25 هجمة أمنية",
    "8. المنافسون: تفوق في السعر، التخصص، والامتثال الشرعي",
    "9. الميزة التنافسية: حلال 100% + Error Node System",
    "10. استراتيجية الدخول: Landing Bot + Confirmation Call",
    "11. الفريق: عمر محمد جميل باعبدالله (المؤسس)",
    "12. المالية: نمو مستدام وهامش 70%+",
    "13. الطلب: SAR 82,500 مضاربة شرعية",
    "14. التواصل: hello@seen-agency.com"
  ]
};