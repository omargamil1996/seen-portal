"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, FileText, Calendar, X, AlertTriangle, Eye, Shield } from "lucide-react";

// Card component
const Card = ({ children, className = "", hover = true }: any) => (
  <div className={`bg-card dark:bg-dark-card rounded-2xl border border-border dark:border-dark-border shadow-card ${hover ? "hover-lift" : ""} ${className}`}>
    {children}
  </div>
);

export const DATA_ROOM_FILES = [
  { id: "000", name: "MASTER_INDEX.md", date: "2026-10-09", summary: "فهرس المستودع الشامل", category: "الأساسيات", sensitive: false, description: "ملف فهرس يربط جميع ملفات المستودع ويوفر نظرة عامة على البنية الكاملة. يساعد الموظفين الجدد والذكاء الاصطناعي على التنقل بسرعة.", reason: "ملف تنظيمي داخلي، لا يحتوي على معلومات حساسة لكن لا يُعرض علنياً للحفاظ على التنظيم." },
  { id: "010", name: "PROJECT_TRUTH.md", date: "2026-10-09", summary: "الحقيقة الحالية للمشروع", category: "الأساسيات", sensitive: false, description: "يحتوي على القرارات النهائية والأرقام المعتمدة (MRR، العملاء المستهدفون، هيكل المضاربة). هذا هو 'مصدر الحقيقة الوحيد' لجميع الملفات الأخرى.", reason: "ملف مرجعي داخلي مهم. الأرقام العامة معروضة بالفعل في الموقع، لكن الوثيقة الكاملة محمية." },
  { id: "020", name: "FOUNDER_PROFILE.md", date: "2026-10-09", summary: "ملف المؤسس التشغيلي", category: "الأساسيات", sensitive: false, description: "السيرة المهنية الكاملة لعمر محمد جميل باعبدالله، الخلفية التعليمية في SEGi University، الخبرة في SABIC، والمهارات التقنية.", reason: "المعلومات العامة معروضة في تبويب الفريق. الوثيقة الكاملة تحتوي على تفاصيل إضافية للاستخدام الداخلي." },
  { id: "030", name: "DR_SEEN_IDENTITY.md", date: "2026-10-09", summary: "هوية الموظف الآلي", category: "الأساسيات", sensitive: true, description: "تحديد شخصية 'د.سين' كمدير العمليات الآلي: دوره، صلاحياته، حدوده، وطريقة تفاعله مع الفريق والمؤسس.", reason: "⚠️ يحتوي على تفاصيل تصميم الموظف الآلي - جزء من الملكية الفكرية للمشروع." },
  { id: "040", name: "GLOSSARY.md", date: "2026-10-09", summary: "قاموس المصطلحات", category: "الأساسيات", sensitive: false, description: "أكثر من 200 مصطلح تقني وتجاري مستخدم في المشروع مع تعريفات موحدة بالعربية والإنجليزية.", reason: "قاموس مرجعي داخلي لضمان توحيد المصطلحات عبر جميع الوثائق." },
  { id: "100", name: "PARTNER_AGREEMENT.md", date: "2026-10-09", summary: "اتفاقية الشراكة", category: "الاستراتيجية", sensitive: true, description: "اتفاقية شراكة بين عمر محمد (المؤسس التشغيلي) وأحمد (الشريك القانوني في ماليزيا). تحدد الأدوار، المسؤوليات، ونسب الملكية.", reason: "⚠️ وثيقة قانونية حساسة. تُعرض فقط بعد توقيع NDA." },
  { id: "110", name: "INVESTOR_STRUCTURE.md", date: "2026-10-09", summary: "هيكل المضاربة الشرعية", category: "الاستراتيجية", sensitive: false, description: "تفاصيل هيكل المضاربة المتوافق مع معايير AAOIFI: المراحل الثلاث، نسب الأرباح، خيار Buyout.", reason: "الهيكل العام معروض في تبويب The Ask. الوثيقة الكاملة للمستثمرين الجادين." },
  { id: "120", name: "MARKET_POSITIONING.md", date: "2026-10-09", summary: "التموضع في السوق", category: "الاستراتيجية", sensitive: false, description: "استراتيجية التموضع: الهندسة كبوابة أولى، ثم التوسع إلى الطب والقانون والتعليم والتجارة. معمارية القلعة والرماح.", reason: "الملخص العام معروض. التفاصيل الاستراتيجية الكاملة للمستثمرين." },
  { id: "130", name: "DECISION_LOG.md", date: "2026-10-09", summary: "سجل القرارات الرسمية", category: "الاستراتيجية", sensitive: true, description: "أكثر من 25 قراراً استراتيجياً موثقاً: من اختيار التقنية إلى التسعير، مع الأسباب والبدائل والنتائج.", reason: "⚠️ يكشف عملية التفكير الاستراتيجي - جزء من الملكية الفكرية." },
  { id: "140", name: "HARDWARE_SPECIFICATIONS.md", date: "2026-10-09", summary: "مواصفات العتاد", category: "الاستراتيجية", sensitive: false, description: "تحليل تفصيلي لـ 5 فئات لابتوب و5 فئات Mini PC، مع السيناريو المختار ($10,197 من ميزانية $12,000).", reason: "الملخص معروض في تبويب Hardware. التفاصيل التقنية الكاملة للمستثمرين." },
  { id: "150", name: "MAIN_WEBSITE_SPECIFICATION.md", date: "2026-10-09", summary: "مواصفات الموقع الرسمي", category: "الاستراتيجية", sensitive: true, description: "مواصفات تفصيلية للموقع الرسمي: المكدس التقني، الألوان، الخطوط، الصفحات، والوظائف.", reason: "⚠️ يكشف البنية التقنية للموقع - معلومات حساسة للمنافسين." },
  { id: "200", name: "COMPETITOR_INTELLIGENCE.md", date: "2026-10-09", summary: "تحليل المنافسين", category: "السوق", sensitive: false, description: "تحليل 23 منافساً في السعودية وماليزيا: UiPath، PROVEN، Hivekind، Wakeb، Calq، AIQ، Elm، G42، وغيرها.", reason: "الملخص العام معروض. التحليل التفصيلي الكامل للمستثمرين." },
  { id: "210", name: "MARKET_SIZING.md", date: "2026-10-09", summary: "حجم السوق", category: "السوق", sensitive: false, description: "تحليل TAM/SAM/SOM للسوق السعودي ($3.5B) والماليزي ($462M) مع 10 مصادر موثقة.", reason: "الأرقام العامة معروضة. التفاصيل والمنهجية للمستثمرين." },
  { id: "220", name: "PRICING_VALIDATION.md", date: "2026-10-09", summary: "التحقق من التسعير", category: "السوق", sensitive: true, description: "تحليل تسعير المنافسين، استراتيجية التسعير الخاصة بـ Seen، وحسابات الهوامش.", reason: "⚠️ استراتيجية التسعير سر تجاري مهم." },
  { id: "230", name: "CUSTOMER_PERSONAS.md", date: "2026-10-09", summary: "شخصيات العملاء", category: "السوق", sensitive: false, description: "شخصيات العملاء المستهدفين في كل قطاع: الدور، نقطة الألم، الحل المقدم.", reason: "الملخصات معروضة في تبويب Sectors. التفاصيل الكاملة للمستثمرين." },
  { id: "300", name: "SERVICES_OFFERS.md", date: "2026-10-09", summary: "باقات الخدمات", category: "العمليات", sensitive: false, description: "تفاصيل الباقات الأربع: Starter، Growth، Enterprise، Lead-Gen مع الميزات والأسعار.", reason: "الباقات العامة معروضة. التفاصيل التشغيلية للمستثمرين." },
  { id: "310", name: "SALES_PROCESS.md", date: "2026-10-09", summary: "إجراءات البيع", category: "العمليات", sensitive: true, description: "عملية البيع من البداية إلى النهاية: Landing Bot، Confirmation Call، الإغلاق.", reason: "⚠️ عملية البيع سر تجاري - لا تُكشف للمنافسين." },
  { id: "320", name: "DELIVERY_PROCESS.md", date: "2026-10-09", summary: "إجراءات التنفيذ", category: "العمليات", sensitive: true, description: "دورة التسليم 2-4 أسابيع: Discovery، Design، Build، Validation، Release، Operate.", reason: "⚠️ منهجية التنفيذ جزء من الملكية الفكرية." },
  { id: "330", name: "QUALITY_CONTROL.md", date: "2026-10-09", summary: "ضبط الجودة", category: "العمليات", sensitive: true, description: "بروتوكول الجودة: 25 هجمة أمنية، 100 سؤال هلوسة، Error Node System.", reason: "⚠️ تفاصيل ضبط الجودة سر تجاري." },
  { id: "340", name: "SOPS_LIBRARY.md", date: "2026-10-09", summary: "مكتبة الإجراءات", category: "العمليات", sensitive: true, description: "26 إجراءً تشغيلياً موحداً (SOP) لكل عملية في الشركة.", reason: "⚠️ مكتبة SOPs هي جوهر الملكية الفكرية التشغيلية." },
  { id: "350", name: "SUPPORT_SLA.md", date: "2026-10-09", summary: "اتفاقية مستوى الدعم", category: "العمليات", sensitive: false, description: "SLA للعملاء: أوقات الاستجابة (5-30 دقيقة)، ساعات العمل، قنوات الدعم.", reason: "SLA العام معروض. التفاصيل التشغيلية للعملاء فقط." },
  { id: "360", name: "OPERATIONAL_COMMANDS.md", date: "2026-10-09", summary: "مكتبة الأوامر", category: "العمليات", sensitive: true, description: "أكثر من 60 أمراً تشغيلياً للذكاء الاصطناعي لإدارة العمليات اليومية.", reason: "⚠️ الأوامر التشغيلية جزء من الملكية الفكرية." },
  { id: "400", name: "FIRST_FIVE_CLIENTS.md", date: "2026-10-09", summary: "خطة أول خمسة عملاء", category: "الانطلاق", sensitive: true, description: "استراتيجية الحصول على أول 5 عملاء هندسيين في Q4 2026: الاستهداف، الاقتراب، الإغلاق.", reason: "⚠️ استراتيجية الدخول للسوق سر تجاري." },
  { id: "410", name: "LANDING_PAGE_COPY.md", date: "2026-10-09", summary: "نص صفحة الهبوط", category: "الانطلاق", sensitive: false, description: "النصوص الكاملة لصفحة الهبوط التفاعلية: العنوان، الوصف، CTAs.", reason: "صفحة الهبوط العامة معروضة بالفعل." },
  { id: "420", name: "SALES_SCRIPTS.md", date: "2026-10-09", summary: "سكريبتات المبيعات", category: "الانطلاق", sensitive: true, description: "سكريبتات مبيعات مستوحاة من Jordan Belfort لمكالمات التأكيد.", reason: "⚠️ سكريبتات المبيعات سر تجاري مهم." },
  { id: "430", name: "PITCH_DECK.md", date: "2026-10-09", summary: "عرض المستثمرين", category: "الانطلاق", sensitive: false, description: "14 شريحة عرض تقديمي احترافية مع محتوى كامل لكل شريحة.", reason: "العرض معروض بالفعل في تبويب The Ask." },
  { id: "440", name: "ONE_PAGER.md", date: "2026-10-09", summary: "الصفحة الواحدة", category: "الانطلاق", sensitive: false, description: "ملخص من صفحة واحدة للمشروع للاستخدام السريع.", reason: "الملخص العام متاح." },
  { id: "450", name: "EMAIL_TEMPLATES.md", date: "2026-10-09", summary: "قوالب البريد", category: "الانطلاق", sensitive: true, description: "17 قالب بريد إلكتروني لمختلف مراحل رحلة العميل.", reason: "⚠️ قوالب التواصل سر تجاري." },
  { id: "500", name: "SECURITY_PROTOCOL.md", date: "2026-10-09", summary: "بروتوكول الحماية", category: "الأمن", sensitive: true, description: "الخطر الثلاثي + بروتوكول الحماية الشامل: Container Isolation، AES-256، TLS 1.3.", reason: "⚠️ تفاصيل الأمن سرية لحمايتها من الاستغلال." },
  { id: "510", name: "HALLUCINATION_TESTS.md", date: "2026-10-09", summary: "اختبارات الهلوسة", category: "الأمن", sensitive: true, description: "100 سؤال هلوسة مُختبر مع الإجابات الصحيحة وآليات التحقق.", reason: "⚠️ أسئلة الاختبار سرية لضمان فعاليتها." },
  { id: "520", name: "ATTACK_SIMULATIONS.md", date: "2026-10-09", summary: "محاكاة الهجمات", category: "الأمن", sensitive: true, description: "25 هجمة أمنية محاكاة مع سيناريوهات الهجوم والدفاع.", reason: "⚠️ تفاصيل الهجمات سرية جداً لحمايتها من الاستغلال." },
  { id: "600", name: "NDA_TEMPLATE.md", date: "2026-10-09", summary: "اتفاقية عدم إفصاح", category: "القانوني", sensitive: false, description: "قالب NDA متوافق مع القانون السعودي والماليزي.", reason: "قالب قانوني قياسي." },
  { id: "610", name: "MSA_TEMPLATE.md", date: "2026-10-09", summary: "اتفاقية خدمات إطارية", category: "القانوني", sensitive: false, description: "Master Service Agreement قياسية للخدمات.", reason: "قالب قانوني قياسي." },
  { id: "620", name: "SOW_TEMPLATE.md", date: "2026-10-09", summary: "نطاق العمل", category: "القانوني", sensitive: false, description: "قالب Scope of Work للمشاريع.", reason: "قالب قانوني قياسي." },
  { id: "630", name: "SLA_TEMPLATE.md", date: "2026-10-09", summary: "اتفاقية مستوى الخدمة", category: "القانوني", sensitive: false, description: "Service Level Agreement مع ضمانات الأداء.", reason: "قالب قانوني قياسي." },
  { id: "640", name: "DPA_TEMPLATE.md", date: "2026-10-09", summary: "معالجة البيانات", category: "القانوني", sensitive: false, description: "Data Processing Agreement متوافق مع PDPL وGDPR.", reason: "قالب قانوني قياسي." },
  { id: "650", name: "MUDARABAH_AGREEMENT.md", date: "2026-10-09", summary: "عقد المضاربة", category: "القانوني", sensitive: true, description: "عقد المضاربة الشرعية المتوافق مع AAOIFI للمستثمر.", reason: "⚠️ عقد قانوني حساس للمستثمرين فقط بعد NDA." },
  { id: "660", name: "BRAND_IDENTITY.md", date: "2026-10-09", summary: "الهوية البصرية", category: "القانوني", sensitive: false, description: "دليل الهوية البصرية: الألوان، الخطوط، الشعار، الاستخدام.", reason: "الهوية معروضة بالفعل في الموقع." },
  { id: "670", name: "CAP_TABLE.md", date: "2026-10-09", summary: "جدول الملكية", category: "القانوني", sensitive: true, description: "جدول الملكية الحالي والمتوقع بعد الاستثمار.", reason: "⚠️ معلومات ملكية حساسة للمستثمرين فقط." },
  { id: "680", name: "DATA_ROOM_INDEX.md", date: "2026-10-09", summary: "فهرس غرفة البيانات", category: "القانوني", sensitive: false, description: "فهرس جميع ملفات غرفة البيانات مع مستويات الوصول.", reason: "هذا الملف نفسه!" },
  { id: "700", name: "NEW_AGENT_SYSTEM_PROMPT.md", date: "2026-10-09", summary: "تعليمات الموظف الآلي", category: "الهجرة", sensitive: true, description: "System Prompt الكامل للموظف الآلي 'د.سين' مع جميع التعليمات والقيود.", reason: "⚠️ System Prompt جزء أساسي من الملكية الفكرية." },
  { id: "710", name: "INTERVIEW_PROTOCOL.md", date: "2026-10-09", summary: "بروتوكول الاستجواب", category: "الهجرة", sensitive: true, description: "230 سؤالاً موجهاً للمؤسس لاستخراج المعرفة الضمنية.", reason: "⚠️ بروتوكول استخراج المعرفة جزء من الملكية الفكرية." },
  { id: "720", name: "ASSUMPTIONS_AND_GAPS.md", date: "2026-10-09", summary: "الافتراضات والفجوات", category: "الهجرة", sensitive: true, description: "قائمة الافتراضات غير المؤكدة والفجوات المعرفية التي تحتاج تحقق.", reason: "⚠️ يكشف نقاط الضعف المحتملة." },
  { id: "730", name: "SOURCE_REGISTER.md", date: "2026-10-09", summary: "سجل المصادر", category: "الهجرة", sensitive: false, description: "48+ مصدراً موثقاً مع تواريخ الوصول والروابط.", reason: "المصادر العامة متاحة." },
  { id: "740", name: "CHANGELOG.md", date: "2026-10-09", summary: "سجل التعديلات", category: "الهجرة", sensitive: false, description: "سجل جميع التعديلات على المستودع مع التواريخ والمبررات.", reason: "سجل داخلي للمراجعة." },
  { id: "750", name: "TEST_CASES.md", date: "2026-10-09", summary: "حالات الاختبار", category: "الهجرة", sensitive: true, description: "25 حالة اختبار للتحقق من صحة الأنظمة.", reason: "⚠️ حالات الاختبار سرية لضمان فعاليتها." },
  { id: "760", name: "HANDOVER_SUMMARY.md", date: "2026-10-09", summary: "ملخص التسليم", category: "الهجرة", sensitive: false, description: "ملخص شامل لعملية التسليم من Claude إلى Qwen.", reason: "وثيقة داخلية." },
  { id: "800", name: "LATEST_SESSION.md", date: "2026-10-09", summary: "آخر ذاكرة جلسة", category: "الجلسات", sensitive: true, description: "آخر ذاكرة جلسة مع Dr. Seen تتضمن الإنجازات والقرارات.", reason: "⚠️ ذاكرة الجلسات داخلية ولا تُكشف." },
  { id: "810", name: "SESSION_MEMORY_ARCHIVE.md", date: "2026-10-09", summary: "أرشيف الجلسات", category: "الجلسات", sensitive: true, description: "أرشيف كامل لجميع جلسات العمل السابقة.", reason: "⚠️ أرشيف داخلي." }
];

export default function DataRoomVault({ lang }: { lang: "ar" | "en" }) {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  
  const categories = ["all", "الأساسيات", "الاستراتيجية", "السوق", "العمليات", "الانطلاق", "الأمن", "القانوني", "الهجرة", "الجلسات"];
  const catEn: Record<string, string> = {
    "all": "All",
    "الأساسيات": "Foundation",
    "الاستراتيجية": "Strategy",
    "السوق": "Market",
    "العمليات": "Operations",
    "الانطلاق": "Launch",
    "الأمن": "Security",
    "القانوني": "Legal",
    "الهجرة": "Migration",
    "الجلسات": "Sessions",
  };
  
  const catColors: Record<string, string> = {
    "الأساسيات": "emerald",
    "الاستراتيجية": "gold",
    "السوق": "accent",
    "العمليات": "blue",
    "الانطلاق": "purple",
    "الأمن": "red",
    "القانوني": "green",
    "الهجرة": "indigo",
    "الجلسات": "pink",
  };
  
  const filteredFiles = selectedCat === "all" 
    ? DATA_ROOM_FILES 
    : DATA_ROOM_FILES.filter((f: any) => f.category === selectedCat);
  
  const sensitiveCount = DATA_ROOM_FILES.filter((f: any) => f.sensitive).length;
  const publicCount = DATA_ROOM_FILES.length - sensitiveCount;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-amiri font-bold text-emerald dark:text-gold mb-2">
          {lang === "ar" ? "غرفة البيانات" : "Data Room"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {lang === "ar"
            ? "فهرس تفاعلي لـ 49 وثيقة استراتيجية وتشغيلية. اضغط على أي ملف لعرض التفاصيل العامة."
            : "Interactive index of 49 strategic and operational documents. Click any file to see public details."}
        </p>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-emerald/10 to-emerald/5 p-5 rounded-2xl border border-emerald/20 text-center">
          <div className="text-3xl font-bold text-emerald font-amiri">{DATA_ROOM_FILES.length}</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "وثيقة" : "Files"}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-gold/10 to-gold/5 p-5 rounded-2xl border border-gold/20 text-center">
          <div className="text-3xl font-bold text-gold-dark dark:text-gold font-amiri">{categories.length - 1}</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "فئات" : "Categories"}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-5 rounded-2xl border border-red-200 dark:border-red-800 text-center">
          <div className="text-3xl font-bold text-red-700 dark:text-red-400 font-amiri">{sensitiveCount}</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "حساس" : "Sensitive"}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-5 rounded-2xl border border-green-200 dark:border-green-800 text-center">
          <div className="text-3xl font-bold text-green-700 dark:text-green-400 font-amiri">{publicCount}</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "عام" : "Public"}</div>
        </motion.div>
      </div>

      {/* Security Notice */}
      <Card className="p-5 bg-gradient-to-l from-emerald/5 to-gold/5 border-emerald/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center shrink-0">
            <Lock size={18} className="text-emerald" />
          </div>
          <div>
            <h3 className="font-bold text-emerald dark:text-gold mb-1">
              {lang === "ar" ? "ملاحظة أمنية" : "Security Notice"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {lang === "ar" 
                ? "هذه الواجهة تعرض فقط أسماء الملفات وملخصات مختصرة. اضغط على أي ملف لمعرفة الوصف العام وسبب الحماية. للوصول الكامل للمحتوى، يرجى التواصل المباشر."
                : "This interface shows only file names and brief summaries. Click any file to see general description and protection reason. For full content access, please contact us directly."}
            </p>
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const count = cat === "all" ? DATA_ROOM_FILES.length : DATA_ROOM_FILES.filter(f => f.category === cat).length;
            const isActive = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border",
                  isActive 
                    ? "bg-emerald text-white border-emerald shadow-md" 
                    : "bg-muted dark:bg-dark-muted text-gray-600 dark:text-gray-400 border-transparent hover:border-emerald/40"
                )}
              >
                {lang === "ar" ? cat : catEn[cat]} ({count})
              </button>
            );
          })}
        </div>
      </Card>

      {/* Files Grid - Interactive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredFiles.map((file: any, index: number) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.015 }}
            whileHover={{ 
              scale: 1.02, 
              borderColor: "#D4AF37",
              boxShadow: "0 0 20px rgba(212,175,55,0.15)"
            }}
            onClick={() => setSelectedFile(file)}
            className="group relative bg-card dark:bg-dark-card p-5 rounded-xl border border-border shadow-sm cursor-pointer overflow-hidden hover:shadow-elevated transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-muted dark:bg-dark-muted rounded-lg text-emerald group-hover:text-gold transition-colors">
                    <FileText size={18} />
                  </div>
                  <span className="text-[10px] font-mono text-gold-dark dark:text-gold font-bold">#{file.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  {file.sensitive && (
                    <div className="w-6 h-6 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                      <Lock size={12} className="text-red-600 dark:text-red-400" />
                    </div>
                  )}
                  <span className={cn(
                    "text-[9px] font-bold px-2 py-0.5 rounded uppercase border",
                    catColors[file.category] === "emerald" && "bg-emerald/10 text-emerald border-emerald/20",
                    catColors[file.category] === "gold" && "bg-gold/10 text-gold-dark dark:text-gold border-gold/20",
                    catColors[file.category] === "accent" && "bg-accent/10 text-accent border-accent/20",
                    catColors[file.category] === "blue" && "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200",
                    catColors[file.category] === "purple" && "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200",
                    catColors[file.category] === "red" && "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200",
                    catColors[file.category] === "green" && "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200",
                    catColors[file.category] === "indigo" && "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200",
                    catColors[file.category] === "pink" && "bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 border-pink-200",
                  )}>
                    {lang === "ar" ? file.category : catEn[file.category]}
                  </span>
                </div>
              </div>
              
              <h3 className="font-bold text-sm mb-2 group-hover:text-emerald dark:group-hover:text-gold transition-colors font-mono">
                {file.name}
              </h3>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <Calendar size={12} />
                <span>{file.date}</span>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 italic border-t border-border/50 pt-3 mt-2 line-clamp-2">
                "{file.summary}"
              </p>

              <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald dark:text-gold font-semibold">
                <Eye size={12} />
                <span>{lang === "ar" ? "اضغط للتفاصيل" : "Click for details"}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* File Details Modal */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelectedFile(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card dark:bg-dark-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className={cn(
                "p-6 border-b border-border flex justify-between items-start",
                selectedFile.sensitive 
                  ? "bg-gradient-to-l from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20" 
                  : "bg-gradient-to-l from-emerald/5 to-gold/5"
              )}>
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                    selectedFile.sensitive ? "bg-red-100 dark:bg-red-900/30" : "bg-emerald/10"
                  )}>
                    {selectedFile.sensitive ? <Lock size={24} className="text-red-600" /> : <FileText size={24} className="text-emerald" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gold font-bold">#{selectedFile.id}</span>
                      {selectedFile.sensitive && (
                        <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full font-bold">
                          {lang === "ar" ? "🔒 حساس" : "🔒 Sensitive"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold font-mono text-emerald dark:text-gold">
                      {selectedFile.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {selectedFile.date}
                      </span>
                      <span className="px-2 py-0.5 bg-muted dark:bg-dark-muted rounded">{selectedFile.category}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="p-2 rounded-lg hover:bg-muted dark:hover:bg-dark-muted transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Description */}
                <div>
                  <h4 className="text-sm font-bold text-emerald dark:text-gold mb-2 flex items-center gap-2">
                    <FileText size={14} />
                    {lang === "ar" ? "الوصف" : "Description"}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedFile.description}
                  </p>
                </div>

                {/* Why Protected */}
                <div className={cn(
                  "p-4 rounded-xl border",
                  selectedFile.sensitive 
                    ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800" 
                    : "bg-emerald/5 border-emerald/20"
                )}>
                  <h4 className={cn(
                    "text-sm font-bold mb-2 flex items-center gap-2",
                    selectedFile.sensitive ? "text-amber-700 dark:text-amber-400" : "text-emerald"
                  )}>
                    {selectedFile.sensitive ? <AlertTriangle size={14} /> : <Shield size={14} />}
                    {lang === "ar" ? "سبب الحماية" : "Protection Reason"}
                  </h4>
                  <p className={cn(
                    "text-sm leading-relaxed",
                    selectedFile.sensitive ? "text-amber-900 dark:text-amber-200" : "text-gray-700 dark:text-gray-300"
                  )}>
                    {selectedFile.reason}
                  </p>
                </div>

                {/* Summary */}
                <div className="p-4 bg-muted/30 dark:bg-dark-muted/30 rounded-xl">
                  <h4 className="text-sm font-bold text-emerald dark:text-gold mb-2">
                    {lang === "ar" ? "الملخص" : "Summary"}
                  </h4>
                  <p className="text-sm italic text-gray-600 dark:text-gray-400">
                    "{selectedFile.summary}"
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-border bg-muted/20 dark:bg-dark-muted/20 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {lang === "ar" 
                    ? "للوصول الكامل، تواصل مع hello@seen-agency.com"
                    : "For full access, contact hello@seen-agency.com"}
                </p>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="px-6 py-2 bg-emerald text-white rounded-lg font-bold hover:bg-emerald-dark transition-colors"
                >
                  {lang === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact CTA */}
      <Card className="p-6 text-center bg-gradient-to-br from-emerald/5 via-gold/5 to-accent/5">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-emerald dark:text-gold mb-2 font-amiri">
            {lang === "ar" ? "للوصول الكامل للمحتوى" : "For Full Content Access"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {lang === "ar" 
              ? "يرجى التواصل مع المؤسس عبر البريد الإلكتروني بعد توقيع اتفاقية عدم الإفصاح (NDA)."
              : "Please contact the founder via email after signing a Non-Disclosure Agreement (NDA)."}
          </p>
          <a 
            href="mailto:hello@seen-agency.com" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald text-white rounded-xl font-bold hover:bg-emerald-dark transition-all shadow-md"
          >
            <Lock size={16} />
            hello@seen-agency.com
          </a>
        </div>
      </Card>
    </div>
  );
}
