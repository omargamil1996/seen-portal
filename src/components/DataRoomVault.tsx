"use client";
import { motion } from "framer-motion";
import { Lock, FileText, Calendar } from "lucide-react";

export const DATA_ROOM_FILES = [
  { id: "000", name: "MASTER_INDEX.md", date: "2026-10-09", summary: "فهرس المستودع الشامل", category: "الأساسيات" },
  { id: "010", name: "PROJECT_TRUTH.md", date: "2026-10-09", summary: "الحقيقة الحالية للمشروع", category: "الأساسيات" },
  { id: "020", name: "FOUNDER_PROFILE.md", date: "2026-10-09", summary: "ملف المؤسس التشغيلي", category: "الأساسيات" },
  { id: "030", name: "DR_SEEN_IDENTITY.md", date: "2026-10-09", summary: "هوية الموظف الآلي", category: "الأساسيات" },
  { id: "040", name: "GLOSSARY.md", date: "2026-10-09", summary: "قاموس المصطلحات", category: "الأساسيات" },
  { id: "100", name: "PARTNER_AGREEMENT.md", date: "2026-10-09", summary: "اتفاقية الشراكة", category: "الاستراتيجية" },
  { id: "110", name: "INVESTOR_STRUCTURE.md", date: "2026-10-09", summary: "هيكل المضاربة الشرعية", category: "الاستراتيجية" },
  { id: "120", name: "MARKET_POSITIONING.md", date: "2026-10-09", summary: "التموضع في السوق", category: "الاستراتيجية" },
  { id: "130", name: "DECISION_LOG.md", date: "2026-10-09", summary: "سجل القرارات الرسمية", category: "الاستراتيجية" },
  { id: "140", name: "HARDWARE_SPECIFICATIONS.md", date: "2026-10-09", summary: "مواصفات العتاد", category: "الاستراتيجية" },
  { id: "150", name: "MAIN_WEBSITE_SPECIFICATION.md", date: "2026-10-09", summary: "مواصفات الموقع الرسمي", category: "الاستراتيجية" },
  { id: "200", name: "COMPETITOR_INTELLIGENCE.md", date: "2026-10-09", summary: "تحليل المنافسين", category: "السوق" },
  { id: "210", name: "MARKET_SIZING.md", date: "2026-10-09", summary: "حجم السوق", category: "السوق" },
  { id: "220", name: "PRICING_VALIDATION.md", date: "2026-10-09", summary: "التحقق من التسعير", category: "السوق" },
  { id: "230", name: "CUSTOMER_PERSONAS.md", date: "2026-10-09", summary: "شخصيات العملاء", category: "السوق" },
  { id: "300", name: "SERVICES_OFFERS.md", date: "2026-10-09", summary: "باقات الخدمات", category: "العمليات" },
  { id: "310", name: "SALES_PROCESS.md", date: "2026-10-09", summary: "إجراءات البيع", category: "العمليات" },
  { id: "320", name: "DELIVERY_PROCESS.md", date: "2026-10-09", summary: "إجراءات التنفيذ", category: "العمليات" },
  { id: "330", name: "QUALITY_CONTROL.md", date: "2026-10-09", summary: "ضبط الجودة", category: "العمليات" },
  { id: "340", name: "SOPS_LIBRARY.md", date: "2026-10-09", summary: "مكتبة الإجراءات", category: "العمليات" },
  { id: "350", name: "SUPPORT_SLA.md", date: "2026-10-09", summary: "اتفاقية مستوى الدعم", category: "العمليات" },
  { id: "360", name: "OPERATIONAL_COMMANDS.md", date: "2026-10-09", summary: "مكتبة الأوامر", category: "العمليات" },
  { id: "400", name: "FIRST_FIVE_CLIENTS.md", date: "2026-10-09", summary: "خطة أول خمسة عملاء", category: "الانطلاق" },
  { id: "410", name: "LANDING_PAGE_COPY.md", date: "2026-10-09", summary: "نص صفحة الهبوط", category: "الانطلاق" },
  { id: "420", name: "SALES_SCRIPTS.md", date: "2026-10-09", summary: "سكريبتات المبيعات", category: "الانطلاق" },
  { id: "430", name: "PITCH_DECK.md", date: "2026-10-09", summary: "عرض المستثمرين", category: "الانطلاق" },
  { id: "440", name: "ONE_PAGER.md", date: "2026-10-09", summary: "الصفحة الواحدة", category: "الانطلاق" },
  { id: "450", name: "EMAIL_TEMPLATES.md", date: "2026-10-09", summary: "قوالب البريد", category: "الانطلاق" },
  { id: "500", name: "SECURITY_PROTOCOL.md", date: "2026-10-09", summary: "بروتوكول الحماية", category: "الأمن" },
  { id: "510", name: "HALLUCINATION_TESTS.md", date: "2026-10-09", summary: "اختبارات الهلوسة", category: "الأمن" },
  { id: "520", name: "ATTACK_SIMULATIONS.md", date: "2026-10-09", summary: "محاكاة الهجمات", category: "الأمن" },
  { id: "600", name: "NDA_TEMPLATE.md", date: "2026-10-09", summary: "اتفاقية عدم إفصاح", category: "القانوني" },
  { id: "610", name: "MSA_TEMPLATE.md", date: "2026-10-09", summary: "اتفاقية خدمات إطارية", category: "القانوني" },
  { id: "620", name: "SOW_TEMPLATE.md", date: "2026-10-09", summary: "نطاق العمل", category: "القانوني" },
  { id: "630", name: "SLA_TEMPLATE.md", date: "2026-10-09", summary: "اتفاقية مستوى الخدمة", category: "القانوني" },
  { id: "640", name: "DPA_TEMPLATE.md", date: "2026-10-09", summary: "معالجة البيانات", category: "القانوني" },
  { id: "650", name: "MUDARABAH_AGREEMENT.md", date: "2026-10-09", summary: "عقد المضاربة", category: "القانوني" },
  { id: "660", name: "BRAND_IDENTITY.md", date: "2026-10-09", summary: "الهوية البصرية", category: "القانوني" },
  { id: "670", name: "CAP_TABLE.md", date: "2026-10-09", summary: "جدول الملكية", category: "القانوني" },
  { id: "680", name: "DATA_ROOM_INDEX.md", date: "2026-10-09", summary: "فهرس غرفة البيانات", category: "القانوني" },
  { id: "700", name: "NEW_AGENT_SYSTEM_PROMPT.md", date: "2026-10-09", summary: "تعليمات الموظف الآلي", category: "الهجرة" },
  { id: "710", name: "INTERVIEW_PROTOCOL.md", date: "2026-10-09", summary: "بروتوكول الاستجواب", category: "الهجرة" },
  { id: "720", name: "ASSUMPTIONS_AND_GAPS.md", date: "2026-10-09", summary: "الافتراضات والفجوات", category: "الهجرة" },
  { id: "730", name: "SOURCE_REGISTER.md", date: "2026-10-09", summary: "سجل المصادر", category: "الهجرة" },
  { id: "740", name: "CHANGELOG.md", date: "2026-10-09", summary: "سجل التعديلات", category: "الهجرة" },
  { id: "750", name: "TEST_CASES.md", date: "2026-10-09", summary: "حالات الاختبار", category: "الهجرة" },
  { id: "760", name: "HANDOVER_SUMMARY.md", date: "2026-10-09", summary: "ملخص التسليم", category: "الهجرة" },
  { id: "800", name: "LATEST_SESSION.md", date: "2026-10-09", summary: "آخر ذاكرة جلسة", category: "الجلسات" },
  { id: "810", name: "SESSION_MEMORY_ARCHIVE.md", date: "2026-10-09", summary: "أرشيف الجلسات", category: "الجلسات" },
];

export default function DataRoomVault({ lang }: { lang: "ar" | "en" }) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-amiri font-bold text-emerald dark:text-gold mb-2">
          {lang === "ar" ? "غرفة البيانات" : "Data Room"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {lang === "ar"
            ? "فهرس تفاعلي لـ 49 وثيقة استراتيجية وتشغيلية. لا يُعرض المحتوى الكامل هنا، ويُطلب الوصول عبر تواصل مباشر."
            : "Interactive index of 49 strategic and operational documents. Full content is not displayed here; access is requested through direct contact."}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-emerald/10 dark:bg-emerald/20 px-4 py-2 rounded-full">
          <Lock size={16} className="text-emerald" />
          <span className="text-sm font-semibold text-emerald">
            {lang === "ar" ? "49 ملفاً موثقاً" : "49 documented files"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DATA_ROOM_FILES.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.015 }}
            whileHover={{ scale: 1.02, borderColor: "#D4AF37", boxShadow: "0 0 15px rgba(212,175,55,0.15)" }}
            className="group relative bg-card dark:bg-dark-card p-5 rounded-xl border border-border shadow-sm cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex justify-between items-start mb-3">
              <div className="p-2 bg-muted dark:bg-dark-muted rounded-lg text-emerald group-hover:text-gold transition-colors">
                <FileText size={20} />
              </div>
              <span className="text-[10px] font-mono text-gray-400 bg-muted dark:bg-dark-muted px-2 py-1 rounded">
                {file.category}
              </span>
            </div>
            <h3 className="font-bold text-sm mb-1 group-hover:text-emerald dark:group-hover:text-gold transition-colors">
              {file.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <Calendar size={12} />
              <span>{file.date}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 italic border-t border-border/50 pt-3 mt-2">
              {file.summary}
            </p>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1 text-[10px] font-bold text-gold bg-gold/10 px-2 py-1 rounded-full">
                <Lock size={10} />
                {lang === "ar" ? "طلب وصول" : "Request access"}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8 p-6 bg-muted/30 dark:bg-dark-muted/30 rounded-xl border border-border">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {lang === "ar"
            ? "للوصول الكامل، يرجى التواصل عبر hello@seen-agency.com بعد توقيع اتفاقية عدم الإفصاح عند الحاجة."
            : "For full access, contact hello@seen-agency.com, subject to NDA where required."}
        </p>
      </div>
    </div>
  );
}
