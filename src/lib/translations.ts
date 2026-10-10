export const translations = {
  ar: {
    common: { livePlan: "خطة حية", investorBriefcase: "حقيبة المستثمر", tagline: "أتمتة. ارتقاء. حلال.", preSeed: "ما قبل البذرة", investmentReady: "جاهز للاستثمار" },
    menu: { dashboard: "لوحة التحكم", financials: "النمذجة المالية", businessPlan: "خطة العمل", sectors: "القطاعات", roadmap: "رحلة المشروع", risks: "المخاطر", hardware: "محطة العمل", theAsk: "طلب الاستثمار", dataRoom: "غرفة البيانات", team: "الفريق", security: "الأمن", settings: "الإعدادات" },
    briefcases: {
      investorKit: { title: "حقيبة المستثمر", subtitle: "Investor Pitch Kit", description: "مجموعة شاملة من الوثائق والبيانات المصممة خصيصاً لإقناع المستثمرين وإعطاءهم صورة كاملة عن الفرصة الاستثمارية.", cta: "استكشف الحقيبة", items: ["Pitch Deck", "النموذج المالي", "خطة العمل", "تحليل السوق"] },
      dueDiligence: { title: "وثائق الاستعداد للاستثمار", subtitle: "Investment-Ready Documentation", description: "جميع الوثائق القانونية والمالية جاهزة للفحص النافي للجهالة (Due Diligence) — لا حاجة لطلبات إضافية.", cta: "ابدأ الفحص", items: ["NDA", "MSA", "SOW", "SLA", "DPA"] },
      portfolio: { title: "الملف التعريفي الشامل", subtitle: "Comprehensive Business Portfolio", description: "عرض كامل للقصة والرؤية والفريق والفرصة — كل ما يحتاجه صانع القرار في مكان واحد.", cta: "اقرأ القصة الكاملة", items: ["القصة", "الرؤية", "الفريق", "الفرصة"] },
    },
    actions: { explore: "استكشف", download: "تحميل", viewDetails: "عرض التفاصيل", collaborate: "تعاون معنا", startReview: "ابدأ المراجعة", requestAccess: "طلب وصول", contactUs: "تواصل معنا" },
  },
  ms: {
    common: { livePlan: "Pelan Langsung", investorBriefcase: "Fail Pelabur", tagline: "Automasi. Peningkatan. Halal.", preSeed: "Pra-Benih", investmentReady: "Sedia untuk Pelaburan" },
    menu: { dashboard: "Papan Pemuka", financials: "Model Kewangan", businessPlan: "Pelan Perniagaan", sectors: "Sektor", roadmap: "Perjalanan Projek", risks: "Risiko", hardware: "Stesen Kerja", theAsk: "Permintaan Pelaburan", dataRoom: "Bilik Data", team: "Pasukan", security: "Keselamatan", settings: "Tetapan" },
    briefcases: {
      investorKit: { title: "Fail Pelabur", subtitle: "Kit Pitching Pelabur", description: "Koleksi dokumen dan data yang direka khas untuk meyakinkan pelabur dan memberi gambaran penuh tentang peluang pelaburan.", cta: "Terokai fail", items: ["Dek Pitching", "Model Kewangan", "Pelan Perniagaan", "Analisis Pasaran"] },
      dueDiligence: { title: "Dokumen Sedia Pelaburan", subtitle: "Dokumentasi Sedia Pelaburan", description: "Semua dokumen undang-undang dan kewangan sedia untuk semakan Due Diligence, tanpa permintaan tambahan.", cta: "Mula semakan", items: ["NDA", "MSA", "SOW", "SLA", "DPA"] },
      portfolio: { title: "Profil Perniagaan Menyeluruh", subtitle: "Portfolio Perniagaan Menyeluruh", description: "Gambaran lengkap tentang cerita, visi, pasukan dan peluang, semua dalam satu tempat.", cta: "Baca cerita penuh", items: ["Cerita", "Visi", "Pasukan", "Peluang"] },
    },
    actions: { explore: "Terokai", download: "Muat turun", viewDetails: "Lihat butiran", collaborate: "Bekerjasama", startReview: "Mula semakan", requestAccess: "Minta akses", contactUs: "Hubungi kami" },
  },
  en: {
    common: { livePlan: "Live Plan", investorBriefcase: "Investor Briefcase", tagline: "Automate. Elevate. Halal.", preSeed: "Pre-Seed", investmentReady: "Investment-Ready" },
    menu: { dashboard: "Dashboard", financials: "Financial Model", businessPlan: "Business Plan", sectors: "Sectors", roadmap: "Journey", risks: "Risks", hardware: "Workstation", theAsk: "The Ask", dataRoom: "Data Room", team: "Team", security: "Security", settings: "Settings" },
    briefcases: {
      investorKit: { title: "Investor Briefcase", subtitle: "Pitch Kit", description: "Comprehensive collection of documents and data specifically designed to convince investors and give them a complete picture of the opportunity.", cta: "Explore Kit", items: ["Pitch Deck", "Financial Model", "Business Plan", "Market Analysis"] },
      dueDiligence: { title: "Investment-Ready Documentation", subtitle: "Due Diligence Ready", description: "All legal and financial documents ready for Due Diligence review — no additional requests needed.", cta: "Start Review", items: ["NDA", "MSA", "SOW", "SLA", "DPA"] },
      portfolio: { title: "Comprehensive Business Portfolio", subtitle: "Full Story", description: "Complete presentation of the story, vision, team, and opportunity — everything a decision-maker needs in one place.", cta: "Read Full Story", items: ["Story", "Vision", "Team", "Opportunity"] },
    },
    actions: { explore: "Explore", download: "Download", viewDetails: "View Details", collaborate: "Collaborate", startReview: "Start Review", requestAccess: "Request Access", contactUs: "Contact Us" },
  },
};
export type Lang = keyof typeof translations;
