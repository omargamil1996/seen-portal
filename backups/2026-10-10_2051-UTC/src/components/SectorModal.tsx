"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Users, CheckCircle, Zap } from "lucide-react";

export default function SectorModal({ sector, lang, onClose }: { sector: any; lang: "ar" | "en"; onClose: () => void }) {
  if (!sector) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          className="bg-card dark:bg-dark-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-card dark:bg-dark-card border-b border-border p-6 flex justify-between items-center z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald/10 dark:bg-emerald/20 flex items-center justify-center text-3xl">
                {sector.icon}
              </div>
              <div>
                <h2 className="text-2xl font-amiri font-bold text-emerald dark:text-gold">
                  {lang === "ar" ? sector.name_ar : sector.name_en}
                </h2>
                <p className="text-sm text-gray-500">
                  {lang === "ar" ? "قطاع مستهدف استراتيجي" : "Strategic target sector"}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted dark:hover:bg-dark-muted transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/30 dark:bg-dark-muted/30 p-5 rounded-xl border border-border">
              <h3 className="flex items-center gap-2 font-bold text-emerald dark:text-gold mb-3">
                <Target size={18} />
                {lang === "ar" ? "لماذا هذا القطاع؟" : "Why this sector?"}
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {lang === "ar" ? sector.justification_ar : sector.justification_en}
              </p>
            </div>

            <div className="bg-muted/30 dark:bg-dark-muted/30 p-5 rounded-xl border border-border">
              <h3 className="flex items-center gap-2 font-bold text-emerald dark:text-gold mb-3">
                <CheckCircle size={18} />
                {lang === "ar" ? "مجالات التخصص" : "Specialization areas"}
              </h3>
              <ul className="space-y-2">
                {(lang === "ar" ? sector.subSectors_ar : sector.subSectors_en).map((sub: string, i: number) => (
                  <li key={i} className="text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" /> {sub}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-muted/30 dark:bg-dark-muted/30 p-5 rounded-xl border border-border md:col-span-2">
              <h3 className="flex items-center gap-2 font-bold text-emerald dark:text-gold mb-3">
                <Users size={18} />
                {lang === "ar" ? "العميل المثالي" : "Ideal customer"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block text-xs mb-1">{lang === "ar" ? "الدور" : "Role"}</span>
                  <strong>{lang === "ar" ? sector.persona.role_ar : sector.persona.role_en}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs mb-1">{lang === "ar" ? "نقطة الألم" : "Pain point"}</span>
                  <strong>{lang === "ar" ? sector.persona.pain_ar : sector.persona.pain_en}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs mb-1">{lang === "ar" ? "الحل" : "Solution"}</span>
                  <strong>{lang === "ar" ? sector.persona.solution_ar : sector.persona.solution_en}</strong>
                </div>
              </div>
            </div>

            <div className="bg-emerald/5 dark:bg-emerald/10 p-5 rounded-xl border border-emerald/20 md:col-span-2">
              <h3 className="flex items-center gap-2 font-bold text-emerald dark:text-gold mb-3">
                <Zap size={18} />
                {lang === "ar" ? "مؤشر الجاهزية التشغيلية" : "Operational readiness indicator"}
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-card dark:bg-dark-card rounded-lg border border-border">
                  <div className="text-2xl font-bold text-gold">{sector.readiness.workflows}</div>
                  <div className="text-xs text-gray-500">{lang === "ar" ? "نماذج n8n" : "n8n workflows"}</div>
                </div>
                <div className="p-3 bg-card dark:bg-dark-card rounded-lg border border-border">
                  <div className="text-2xl font-bold text-gold">{sector.readiness.sops}</div>
                  <div className="text-xs text-gray-500">SOPs</div>
                </div>
                <div className="p-3 bg-card dark:bg-dark-card rounded-lg border border-border">
                  <div className="text-2xl font-bold text-gold">{sector.readiness.percentage}%</div>
                  <div className="text-xs text-gray-500">{lang === "ar" ? "جاهزية" : "Readiness"}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border p-6 bg-muted/20 dark:bg-dark-muted/20">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {lang === "ar"
                  ? `الإطلاق: ${sector.timeline} | العملاء المستهدفون: ${sector.target_clients}`
                  : `Launch: ${sector.timeline} | Target clients: ${sector.target_clients}`
                }
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-emerald text-white rounded-lg hover:bg-emerald-dark transition-colors font-semibold"
              >
                {lang === "ar" ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
