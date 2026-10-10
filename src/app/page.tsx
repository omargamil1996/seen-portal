

// ===== Business Plan =====
function BusinessPlanView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={FileText} title={lang === "ar" ? "خطة العمل الشاملة" : "Comprehensive Business Plan"} subtitle={lang === "ar" ? `${DATA.businessPlan.length} قسماً مفصلاً` : `${DATA.businessPlan.length} detailed sections`} />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-emerald/5 to-emerald/10 p-4 rounded-xl border border-emerald/20 text-center">
          <div className="text-2xl font-bold text-emerald font-amiri">{DATA.businessPlan.length}</div>
          <div className="text-xs text-gray-600 mt-1">{lang === "ar" ? "قسم" : "Sections"}</div>
        </div>
        <div className="bg-gradient-to-br from-gold/5 to-gold/10 p-4 rounded-xl border border-gold/20 text-center">
          <div className="text-2xl font-bold text-gold-dark dark:text-gold font-amiri">AR + EN</div>
          <div className="text-xs text-gray-600 mt-1">{lang === "ar" ? "ثنائي اللغة" : "Bilingual"}</div>
        </div>
        <div className="bg-gradient-to-br from-accent/5 to-accent/10 p-4 rounded-xl border border-accent/20 text-center">
          <div className="text-2xl font-bold text-accent font-amiri">49+</div>
          <div className="text-xs text-gray-600 mt-1">{lang === "ar" ? "ملف" : "Files"}</div>
        </div>
        <div className="bg-gradient-to-br from-emerald/5 to-gold/5 p-4 rounded-xl border border-emerald/20 text-center">
          <div className="text-2xl font-bold text-emerald font-amiri">100%</div>
          <div className="text-xs text-gray-600 mt-1">{lang === "ar" ? "جاهز" : "Ready"}</div>
        </div>
      </div>

      {DATA.businessPlan.map((sec: any, i: number) => (
        <motion.details key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} open={i < 3} className="group bg-card dark:bg-dark-card rounded-2xl border border-border shadow-card overflow-hidden">
          <summary className="p-6 cursor-pointer flex justify-between items-center select-none hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald to-emerald-dark text-gold flex items-center justify-center text-sm font-bold font-amiri shadow-md">{i + 1}</span>
              <div>
                <span className="text-lg font-bold text-emerald dark:text-gold block">{lang === "ar" ? sec.title_ar : sec.title_en}</span>
                <span className="text-xs text-gray-500">{lang === "ar" ? sec.title_en : sec.title_ar}</span>
              </div>
            </div>
            <ChevronDown size={20} className="text-gray-400 transition-transform duration-300 group-open:rotate-180 text-accent" />
          </summary>
          <div className="px-6 pb-6 pt-0">
            <div className="border-t border-border/50 pt-4 text-gray-700 dark:text-gray-300 leading-[2] text-sm whitespace-pre-line">
              {lang === "ar" ? sec.content_ar : sec.content_en}
            </div>
          </div>
        </motion.details>
      ))}
    </div>
  );
}

// ===== Sectors =====
function SectorsView({ t, lang }: any) {
  const [selected, setSelected] = useState<any>(null);
  const activeCount = DATA.sectors.filter((s: any) => s.status === "active").length;
  const totalClients = DATA.sectors.reduce((sum: number, s: any) => sum + s.target_clients, 0);
  const avgReadiness = Math.round(DATA.sectors.reduce((sum: number, s: any) => sum + s.readiness.percentage, 0) / DATA.sectors.length);

  return (
    <div className="space-y-6">
      <SectionHeader icon={Target} title={lang === "ar" ? "القطاعات والرماح" : "Sectors & Spears"} subtitle={lang === "ar" ? "اضغط على أي قطاع للتحليل الكامل" : "Click any sector for full analysis"} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-emerald/5 to-emerald/10 p-5 rounded-2xl border border-emerald/20 text-center">
          <div className="text-3xl font-bold text-emerald font-amiri">{DATA.sectors.length}</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "قطاعات" : "Sectors"}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 p-5 rounded-2xl border border-green-200 text-center">
          <div className="text-3xl font-bold text-green-700 dark:text-green-400 font-amiri">{activeCount}</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "نشط" : "Active"}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-accent/5 to-accent/10 p-5 rounded-2xl border border-accent/20 text-center">
          <div className="text-3xl font-bold text-accent font-amiri">{totalClients}</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "عميل" : "Clients"}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-gold/5 to-gold/10 p-5 rounded-2xl border border-gold/20 text-center">
          <div className="text-3xl font-bold text-gold-dark dark:text-gold font-amiri">{avgReadiness}%</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "جاهزية" : "Readiness"}</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DATA.sectors.map((s: any, i: number) => (
          <motion.button key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6, scale: 1.01 }} onClick={() => setSelected(s)} className={cn("text-right bg-card dark:bg-dark-card rounded-2xl border shadow-card overflow-hidden", s.status === "active" ? "border-emerald/40" : "border-border")}>
            <div className={cn("p-4 flex justify-between items-center", s.status === "active" ? "bg-gradient-to-l from-emerald to-emerald-dark text-white" : "bg-muted dark:bg-dark-muted")}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{s.icon}</span>
                <div>
                  <h3 className="font-bold text-xl">{lang === "ar" ? s.name_ar : s.name_en}</h3>
                  <p className="text-xs opacity-80">{s.name_en}</p>
                </div>
              </div>
              <Badge color={s.status === "active" ? "green" : "yellow"}>{s.status === "active" ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "قادم" : "Coming")}</Badge>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{lang === "ar" ? s.desc_ar : s.desc_en}</p>
              <div className="bg-emerald/5 p-3 rounded-lg border-r-4 border-emerald">
                <p className="text-xs text-gray-600 line-clamp-2 italic">"{lang === "ar" ? s.justification_ar : s.justification_en}"</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {(lang === "ar" ? s.subSectors_ar : s.subSectors_en).slice(0, 3).map((sub: string, j: number) => (
                  <span key={j} className="text-[10px] px-2 py-1 rounded-full bg-gold/10 text-gold-dark dark:text-gold border border-gold/20">{sub}</span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-muted/50 p-3 rounded-lg text-center"><div className="text-[10px] text-gray-500 uppercase">{lang === "ar" ? "الإطلاق" : "Launch"}</div><div className="font-bold text-emerald text-sm">{s.timeline}</div></div>
                <div className="bg-muted/50 p-3 rounded-lg text-center"><div className="text-[10px] text-gray-500 uppercase">{lang === "ar" ? "العملاء" : "Clients"}</div><div className="font-bold text-accent text-sm">{s.target_clients}</div></div>
                <div className="bg-muted/50 p-3 rounded-lg text-center"><div className="text-[10px] text-gray-500 uppercase">{lang === "ar" ? "جاهزية" : "Ready"}</div><div className="font-bold text-gold-dark text-sm">{s.readiness.percentage}%</div></div>
              </div>
              <div className="w-full py-2.5 bg-emerald/10 text-emerald rounded-xl text-sm font-bold text-center">{lang === "ar" ? "عرض التحليل الكامل ←" : "View Full Analysis →"}</div>
            </div>
          </motion.button>
        ))}
      </div>
      {selected && <SectorModal sector={selected} lang={lang} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ===== Roadmap =====
function RoadmapView({ t, lang }: any) {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const phaseDetails = [
    { milestones_ar: ["دراسة شاملة للسوق", "تحليل 23 منافساً", "إنشاء 49 ملفاً استراتيجياً"], milestones_en: ["Comprehensive market study", "23 competitor analysis", "Built 49 strategic docs"], kpis_ar: ["✅ TAM/SAM/SOM", "✅ رؤية واضحة", "✅ هوية"], kpis_en: ["✅ TAM/SAM/SOM", "✅ Clear vision", "✅ Identity"] },
    { milestones_ar: ["تسجيل Sdn Bhd", "شراء العتاد ($10K)", "Supabase + n8n", "مراجعة شرعية"], milestones_en: ["Register Sdn Bhd", "Hardware ($10K)", "Supabase + n8n", "Sharia review"], kpis_ar: ["✅ كيان قانوني", "✅ بنية تحتية", "✅ امتثال"], kpis_en: ["✅ Legal entity", "✅ Infrastructure", "✅ Compliance"] },
    { milestones_ar: ["إطلاق بوابة المستثمرين", "Landing Bot", "50 زائر", "ضبط الأنظمة"], milestones_en: ["Investor portal", "Landing Bot", "50 visitors", "Systems tuning"], kpis_ar: ["🟡 50 زائر", "🟡 10 تحاليل", "🟡 3 مكالمات"], kpis_en: ["🟡 50 visitors", "🟡 10 analyses", "🟡 3 calls"] },
    { milestones_ar: ["أول عقد مدفوع", "Error Node", "دراسة حالة", "شهادة عميل"], milestones_en: ["First paid contract", "Error Node", "Case study", "Testimonial"], kpis_ar: ["⭐ أول عميل", "⭐ SAR 6K", "⭐ SLA"], kpis_en: ["⭐ First client", "⭐ SAR 6K", "⭐ SLA"] },
    { milestones_ar: ["20 عميل", "رمح الطب", "أول موظف دعم", "MRR 32K"], milestones_en: ["20 clients", "Medical spear", "First support", "MRR 32K"], kpis_ar: ["🎯 20 عميل", "🎯 قطاعان", "🎯 MRR 32K"], kpis_en: ["🎯 20 clients", "🎯 2 sectors", "🎯 MRR 32K"] },
    { milestones_ar: ["80+ عميل", "Micro-SaaS", "توسع جغرافي", "MRR 250K"], milestones_en: ["80+ clients", "Micro-SaaS", "Geographic", "MRR 250K"], kpis_ar: ["🏆 80+ عميل", "🏆 SaaS", "🏆 ARR $500K+"], kpis_en: ["🏆 80+ clients", "🏆 SaaS", "🏆 ARR $500K+"] },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader icon={MapIcon} title={lang === "ar" ? "رحلة المشروع" : "Project Journey"} subtitle={lang === "ar" ? "اضغط على أي مرحلة للتفاصيل" : "Click any phase for details"} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 text-center"><div className="text-3xl font-bold text-emerald font-amiri">{DATA.roadmap.length}</div><div className="text-xs text-gray-500 uppercase">{lang === "ar" ? "مراحل" : "Phases"}</div></Card>
        <Card className="p-4 text-center"><div className="text-3xl font-bold text-gold-dark font-amiri">3</div><div className="text-xs text-gray-500 uppercase">{lang === "ar" ? "سنوات" : "Years"}</div></Card>
        <Card className="p-4 text-center"><div className="text-3xl font-bold text-accent font-amiri">80+</div><div className="text-xs text-gray-500 uppercase">{lang === "ar" ? "عميل Y3" : "Clients Y3"}</div></Card>
        <Card className="p-4 text-center"><div className="text-3xl font-bold text-emerald font-amiri">250K</div><div className="text-xs text-gray-500 uppercase">MRR Y3</div></Card>
      </div>

      <div className="relative">
        <div className={cn("absolute top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-emerald to-accent hidden md:block rounded-full", lang === "ar" ? "right-6" : "left-6")} />
        <div className="space-y-6">
          {DATA.roadmap.map((item: any, i: number) => {
            const isSelected = selectedPhase === i;
            const phase = phaseDetails[i];
            return (
              <motion.div key={i} initial={{ opacity: 0, x: lang === "ar" ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative flex gap-6 items-start">
                <div className={cn("hidden md:flex flex-col items-center shrink-0", lang === "ar" ? "order-2" : "order-1")}>
                  <motion.button onClick={() => setSelectedPhase(isSelected ? null : i)} whileHover={{ scale: 1.2 }} className={cn("w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-lg border-4 z-10", isSelected ? "bg-gold text-white border-gold scale-110" : "bg-emerald text-white border-background")}>{item.phase_ar.slice(0, 2)}</motion.button>
                  {i < DATA.roadmap.length - 1 && <div className="w-0.5 h-4 bg-emerald/30 mt-1" />}
                </div>
                <Card className={cn("flex-1 overflow-hidden", lang === "ar" ? "order-1" : "order-2", isSelected && "border-emerald/40 ring-2 ring-emerald/20")}>
                  <button onClick={() => setSelectedPhase(isSelected ? null : i)} className="w-full p-6 text-right hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? item.phase_ar : item.phase_en}</h3>
                      <div className="flex items-center gap-2"><Badge color="gold">{lang === "ar" ? item.date_ar : item.date_en}</Badge><ChevronDown size={18} className={cn("text-accent transition-transform", isSelected && "rotate-180")} /></div>
                    </div>
                    <p className="text-gray-600 text-sm">{lang === "ar" ? item.desc_ar : item.desc_en}</p>
                  </button>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border">
                        <div className="p-6 space-y-4 bg-gradient-to-br from-emerald/5 to-gold/5">
                          <div>
                            <h4 className="font-bold text-emerald mb-3 flex items-center gap-2"><Target size={16} />{lang === "ar" ? "المعالم" : "Milestones"}</h4>
                            <div className="space-y-2">
                              {(lang === "ar" ? phase.milestones_ar : phase.milestones_en).map((m: string, j: number) => (
                                <motion.div key={j} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: j * 0.05 }} className="flex items-start gap-2 text-sm"><span className="text-gold mt-0.5">▸</span><span className="text-gray-700">{m}</span></motion.div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-emerald mb-3 flex items-center gap-2"><Activity size={16} />KPIs</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {(lang === "ar" ? phase.kpis_ar : phase.kpis_en).map((kpi: string, j: number) => (
                                <motion.div key={j} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: j * 0.08 }} className="bg-card p-3 rounded-lg border border-border text-xs font-semibold text-emerald text-center">{kpi}</motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Card className="p-8 text-center bg-gradient-to-br from-emerald via-emerald-dark to-gold text-white">
        <div className="text-5xl mb-4">🎯</div>
        <h3 className="text-2xl font-bold font-amiri mb-2 text-gold">{lang === "ar" ? "الوجهة النهائية" : "Final Destination"}</h3>
        <p className="text-white/90 max-w-xl mx-auto">{lang === "ar" ? "قيادة سوق الأتمتة الهندسي في العالم العربي، مع ARR يتجاوز $2M و80+ عميل نشط." : "Leading engineering automation market in Arab world, with ARR exceeding $2M and 80+ active clients."}</p>
      </Card>
    </div>
  );
}

// ===== Risks =====
function RisksView({ t, lang }: any) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const risksByCategory: Record<string, any[]> = {};
  DATA.risks.forEach((r: any) => {
    const cat = r.category_en;
    if (!risksByCategory[cat]) risksByCategory[cat] = [];
    risksByCategory[cat].push(r);
  });
  const highCount = DATA.risks.filter((r: any) => r.prob === "high").length;
  const medCount = DATA.risks.filter((r: any) => r.prob === "medium").length;
  const lowCount = DATA.risks.filter((r: any) => r.prob === "low").length;

  return (
    <div className="space-y-6">
      <SectionHeader icon={AlertTriangle} title={lang === "ar" ? "إدارة المخاطر" : "Risk Management"} subtitle={lang === "ar" ? "اضغط على أي خطر للتحليل الكامل" : "Click any risk for full analysis"} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div whileHover={{ scale: 1.03 }} className="bg-card p-5 rounded-2xl border border-border text-center"><div className="text-3xl font-bold text-emerald font-amiri">{DATA.risks.length}</div><div className="text-xs text-gray-500 uppercase">{lang === "ar" ? "إجمالي" : "Total"}</div></motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-red-50 dark:bg-red-900/20 p-5 rounded-2xl border border-red-200 text-center"><div className="text-3xl font-bold text-red-700 font-amiri">{highCount}</div><div className="text-xs text-gray-500 uppercase">{lang === "ar" ? "عالي" : "High"}</div></motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-2xl border border-yellow-200 text-center"><div className="text-3xl font-bold text-yellow-700 font-amiri">{medCount}</div><div className="text-xs text-gray-500 uppercase">{lang === "ar" ? "متوسط" : "Medium"}</div></motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-green-50 dark:bg-green-900/20 p-5 rounded-2xl border border-green-200 text-center"><div className="text-3xl font-bold text-green-700 font-amiri">{lowCount}</div><div className="text-xs text-gray-500 uppercase">{lang === "ar" ? "منخفض" : "Low"}</div></motion.div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-emerald mb-4 flex items-center gap-2"><BarChart3 size={18} />{lang === "ar" ? "مصفوفة المخاطر 3×3" : "Risk Matrix 3×3"}</h3>
        <div className="grid grid-cols-4 gap-2">
          <div></div>
          <div className="text-center text-xs font-bold p-2">{lang === "ar" ? "أثر منخفض" : "Low Impact"}</div>
          <div className="text-center text-xs font-bold p-2">{lang === "ar" ? "أثر متوسط" : "Med"}</div>
          <div className="text-center text-xs font-bold p-2">{lang === "ar" ? "أثر عالي" : "High"}</div>
          <div className="text-right text-xs font-bold p-2">{lang === "ar" ? "عالي" : "High"}</div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 text-sm text-center">{DATA.risks.filter((r: any) => r.prob === "high" && r.impact === "low").length}</div>
          <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3 text-sm text-center">{DATA.risks.filter((r: any) => r.prob === "high" && r.impact === "medium").length}</div>
          <div className="bg-red-200 dark:bg-red-800 rounded-lg p-3 text-sm text-center font-bold text-white">{DATA.risks.filter((r: any) => r.prob === "high" && r.impact === "high").length}</div>
          <div className="text-right text-xs font-bold p-2">{lang === "ar" ? "متوسط" : "Med"}</div>
          <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3 text-sm text-center">{DATA.risks.filter((r: any) => r.prob === "medium" && r.impact === "low").length}</div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 text-sm text-center">{DATA.risks.filter((r: any) => r.prob === "medium" && r.impact === "medium").length}</div>
          <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3 text-sm text-center">{DATA.risks.filter((r: any) => r.prob === "medium" && r.impact === "high").length}</div>
          <div className="text-right text-xs font-bold p-2">{lang === "ar" ? "منخفض" : "Low"}</div>
          <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3 text-sm text-center">{DATA.risks.filter((r: any) => r.prob === "low" && r.impact === "low").length}</div>
          <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3 text-sm text-center">{DATA.risks.filter((r: any) => r.prob === "low" && r.impact === "medium").length}</div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 text-sm text-center">{DATA.risks.filter((r: any) => r.prob === "low" && r.impact === "high").length}</div>
        </div>
      </Card>

      {Object.entries(risksByCategory).map(([cat, risks]) => (
        <Card key={cat} className="overflow-hidden">
          <div className="bg-emerald text-white p-4">
            <h3 className="font-bold flex items-center gap-2"><AlertTriangle size={18} />{lang === "ar" ? (risks[0].category_ar || cat) : cat} ({risks.length})</h3>
          </div>
          <div className="divide-y divide-border">
            {risks.map((r: any, i: number) => {
              const globalIdx = DATA.risks.indexOf(r);
              const isExpanded = expanded === globalIdx;
              return (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="p-5 hover:bg-muted/30 transition-colors">
                  <button onClick={() => setExpanded(isExpanded ? null : globalIdx)} className="w-full text-right">
                    <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                      <h4 className="font-bold text-emerald flex items-center gap-2">
                        <span className="text-xs bg-emerald/10 px-2 py-0.5 rounded font-mono">#{String(globalIdx + 1).padStart(2, "0")}</span>
                        {lang === "ar" ? r.name_ar : r.name_en}
                      </h4>
                      <div className="flex gap-2">
                        <Badge color={r.prob === "high" ? "red" : r.prob === "medium" ? "yellow" : "green"}>{r.prob}</Badge>
                        <Badge color={r.impact === "high" ? "red" : r.impact === "medium" ? "yellow" : "green"}>{r.impact}</Badge>
                      </div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="bg-muted/30 p-3 rounded-lg border-r-4 border-emerald mt-2">
                          <div className="text-xs text-gray-500 mb-1 uppercase">{lang === "ar" ? "خطة التخفيف" : "Mitigation Plan"}</div>
                          <p className="text-sm text-gray-700 leading-relaxed">{lang === "ar" ? r.mitigation_ar : r.mitigation_en}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}


// ===== Hardware =====
function HardwareView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Cpu} title={lang === "ar" ? "محطة العمل" : "Workstation"} subtitle={lang === "ar" ? "تشغيل AI محلياً (7B-120B)" : "Run AI locally (7B-120B)"} />

      <Card className="p-8 overflow-hidden relative bg-gradient-to-l from-emerald via-emerald-dark to-emerald text-white" hover={false}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gold/20 backdrop-blur-sm flex items-center justify-center border border-gold/30"><Server size={28} className="text-gold" /></div>
          <div>
            <div className="text-xs text-gold-light uppercase tracking-widest">⭐ {lang === "ar" ? "التجميعة المختارة" : "Selected Build"}</div>
            <h3 className="text-2xl font-bold text-gold font-amiri">{lang === "ar" ? DATA.hardware.scenario.name_ar : DATA.hardware.scenario.name_en}</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
            <div className="text-xs text-gray-300 mb-2 uppercase">💻 {lang === "ar" ? "اللابتوب" : "Laptop"}</div>
            <div className="font-bold text-sm mb-2">{DATA.hardware.scenario.laptop}</div>
            <div className="text-gold font-bold text-xl">${DATA.hardware.scenario.laptop_price.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
            <div className="text-xs text-gray-300 mb-2 uppercase">🖥️ Mini PC</div>
            <div className="font-bold text-sm mb-2">{DATA.hardware.scenario.minipc}</div>
            <div className="text-gold font-bold text-xl">${DATA.hardware.scenario.minipc_price.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
            <div className="text-xs text-gray-300 mb-2 uppercase">🔌 {lang === "ar" ? "الإكسسوارات" : "Accessories"}</div>
            <div className="font-bold text-sm mb-2">{lang === "ar" ? DATA.hardware.scenario.accessories : DATA.hardware.scenario.accessories_en}</div>
            <div className="text-gold font-bold text-xl">${DATA.hardware.scenario.accessories_price.toLocaleString()}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 bg-gold/20 border border-gold/30 rounded-xl p-5">
          <div className="text-center"><div className="text-xs text-gold-light uppercase">{lang === "ar" ? "الإجمالي" : "Total"}</div><div className="text-3xl font-bold text-gold font-amiri">${DATA.hardware.scenario.total.toLocaleString()}</div></div>
          <div className="text-center"><div className="text-xs text-gray-300 uppercase">{lang === "ar" ? "المتبقي" : "Remaining"}</div><div className="text-xl font-bold">${DATA.hardware.scenario.remaining.toLocaleString()}</div></div>
          <div className="text-center"><div className="text-xs text-gray-300 uppercase">{lang === "ar" ? "الميزانية" : "Budget"}</div><div className="text-xl font-bold">${DATA.hardware.scenario.budget.toLocaleString()}</div></div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-gradient-to-l from-emerald/5 to-transparent">
          <h3 className="font-bold text-emerald flex items-center gap-2"><Cpu size={18} />{lang === "ar" ? "فئات اللابتوب (5)" : "Laptops (5)"}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/50"><tr><th className="p-3 text-right">{lang === "ar" ? "الفئة" : "Category"}</th><th className="p-3 text-right">{lang === "ar" ? "المواصفات" : "Specs"}</th><th className="p-3 text-right">{lang === "ar" ? "السعر" : "Price"}</th><th className="p-3 text-right">AI</th></tr></thead>
            <tbody>
              {DATA.hardware.laptops.map((l: any, i: number) => (
                <tr key={i} className={cn("border-b border-border/50", l.category.includes("⭐") && "bg-gold/5")}>
                  <td className="p-3 font-semibold text-emerald">{l.category}</td>
                  <td className="p-3 text-gray-600">{l.specs}</td>
                  <td className="p-3 text-accent font-bold">{l.price}</td>
                  <td className="p-3 text-gray-500">{l.ai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-gradient-to-l from-gold/5 to-transparent">
          <h3 className="font-bold text-emerald flex items-center gap-2"><Layers size={18} />{lang === "ar" ? "فئات Mini PC (5)" : "Mini PC (5)"}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/50"><tr><th className="p-3 text-right">{lang === "ar" ? "الفئة" : "Category"}</th><th className="p-3 text-right">{lang === "ar" ? "المواصفات" : "Specs"}</th><th className="p-3 text-right">{lang === "ar" ? "السعر" : "Price"}</th></tr></thead>
            <tbody>
              {DATA.hardware.minipc.map((l: any, i: number) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="p-3 font-semibold text-emerald">{l.category}</td>
                  <td className="p-3 text-gray-600">{l.specs}</td>
                  <td className="p-3 text-accent font-bold">{l.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-emerald/5 to-gold/5 border-emerald/20">
        <h3 className="text-xl font-bold text-emerald mb-6 flex items-center gap-2 font-amiri"><Zap size={24} />{lang === "ar" ? "لماذا Unified Memory؟" : "Why Unified Memory?"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-5 rounded-xl border border-border"><div className="text-3xl mb-3">🚀</div><h4 className="font-bold text-emerald mb-2">{lang === "ar" ? "نماذج 120B" : "120B Models"}</h4><p className="text-xs text-gray-600">{lang === "ar" ? "تشغيل نماذج ضخمة بكفاءة" : "Run massive models efficiently"}</p></div>
          <div className="bg-card p-5 rounded-xl border border-border"><div className="text-3xl mb-3">💰</div><h4 className="font-bold text-emerald mb-2">{lang === "ar" ? "توفير كبير" : "Major Savings"}</h4><p className="text-xs text-gray-600">{lang === "ar" ? "بدلاً من GPU 10K+" : "Instead of $10K+ GPU"}</p></div>
          <div className="bg-card p-5 rounded-xl border border-border"><div className="text-3xl mb-3">🔒</div><h4 className="font-bold text-emerald mb-2">{lang === "ar" ? "خصوصية تامة" : "Full Privacy"}</h4><p className="text-xs text-gray-600">{lang === "ar" ? "تشغيل محلي بالكامل" : "Completely local"}</p></div>
        </div>
      </Card>
    </div>
  );
}

// ===== The Ask =====
function TheAskView({ slideIdx, setSlideIdx, t, lang }: any) {
  const slideDesigns = [
    { bg: "from-emerald via-emerald-dark to-emerald", icon: "🏢", accent: "gold" },
    { bg: "from-red-900 via-red-800 to-red-900", icon: "⚠️", accent: "white" },
    { bg: "from-emerald via-emerald-dark to-gold", icon: "💡", accent: "gold" },
    { bg: "from-blue-900 via-blue-800 to-blue-900", icon: "🚀", accent: "gold" },
    { bg: "from-purple-900 via-purple-800 to-emerald", icon: "📊", accent: "gold" },
    { bg: "from-gold-dark via-gold to-amber-600", icon: "💰", accent: "white" },
    { bg: "from-emerald-dark via-emerald to-gold", icon: "✅", accent: "white" },
    { bg: "from-slate-900 via-slate-800 to-emerald", icon: "🎯", accent: "gold" },
    { bg: "from-gold via-amber-500 to-emerald", icon: "⭐", accent: "white" },
    { bg: "from-blue-900 via-indigo-800 to-purple-900", icon: "📈", accent: "gold" },
    { bg: "from-emerald via-emerald-dark to-slate-900", icon: "👥", accent: "gold" },
    { bg: "from-gold-dark via-gold to-emerald", icon: "📊", accent: "white" },
    { bg: "from-emerald via-emerald-dark to-gold", icon: "💎", accent: "gold" },
    { bg: "from-slate-900 via-emerald-dark to-gold", icon: "🌟", accent: "gold" },
  ];

  const currentSlide = DATA.pitchSlides[slideIdx];
  const currentDesign = slideDesigns[slideIdx];

  return (
    <div className="space-y-6">
      <SectionHeader icon={FileCheck} title={lang === "ar" ? "طلب الاستثمار" : "The Ask"} subtitle={lang === "ar" ? "عرض 14 شريحة احترافي" : "Professional 14-slide deck"} />

      <Card className="p-10 text-center overflow-hidden relative" hover={false}>
        <div className="absolute inset-0 bg-gradient-to-l from-emerald via-emerald-dark to-emerald noise" />
        <div className="relative z-10 text-white">
          <p className="text-sm font-semibold text-gold-light uppercase tracking-widest mb-3">{lang === "ar" ? "طلب الاستثمار" : "Investment Ask"}</p>
          <div className="text-7xl font-bold font-amiri text-gold mb-4">SAR {DATA.ask.amount.toLocaleString()}</div>
          <div className="text-2xl text-white/80 mb-4">≈ USD {DATA.ask.amount_usd.toLocaleString()}</div>
          <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm px-6 py-3 rounded-full border border-gold/30">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold font-semibold">{lang === "ar" ? DATA.ask.structure_ar : DATA.ask.structure_en}</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-emerald/30">
          <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald font-bold text-xl">1</div><div><h3 className="font-bold text-emerald">Phase 1</h3><p className="text-xs text-gray-500">{lang === "ar" ? "حتى استرداد رأس المال" : "Until capital recovery"}</p></div></div>
          <div className="text-4xl font-bold text-emerald font-amiri mb-2">{DATA.ask.phase1}%</div>
          <p className="text-sm text-gray-600">{lang === "ar" ? `${DATA.ask.phase1}% من الأرباح حتى الاسترداد` : `${DATA.ask.phase1}% of profits until recovery`}</p>
        </Card>
        <Card className="p-6 border-gold/30">
          <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-bold text-xl">2</div><div><h3 className="font-bold text-emerald">Phase 2</h3><p className="text-xs text-gray-500">{lang === "ar" ? `${DATA.ask.phase2_months} شهر` : `${DATA.ask.phase2_months} months`}</p></div></div>
          <div className="text-4xl font-bold text-gold-dark font-amiri mb-2">{DATA.ask.phase2}%</div>
          <p className="text-sm text-gray-600">{lang === "ar" ? `${DATA.ask.phase2}% لمدة ${DATA.ask.phase2_months} شهراً` : `${DATA.ask.phase2}% for ${DATA.ask.phase2_months} months`}</p>
        </Card>
        <Card className="p-6 border-accent/30">
          <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">★</div><div><h3 className="font-bold text-emerald">Buyout</h3><p className="text-xs text-gray-500">{lang === "ar" ? `${DATA.ask.buyout_months} شهر` : `${DATA.ask.buyout_months} months`}</p></div></div>
          <div className="text-4xl font-bold text-accent font-amiri mb-2">×{DATA.ask.buyout_multiple}</div>
          <p className="text-sm text-gray-600">{lang === "ar" ? `شراء الحصة بعد ${DATA.ask.buyout_months} شهراً` : `Buy out after ${DATA.ask.buyout_months} months`}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald font-bold">{slideIdx + 1}</div><div><h3 className="font-bold text-emerald flex items-center gap-2"><Eye size={16} />Pitch Deck</h3><p className="text-xs text-gray-500">{DATA.pitchSlides.length} {lang === "ar" ? "شريحة" : "slides"}</p></div></div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSlideIdx(Math.max(0, slideIdx - 1))} disabled={slideIdx === 0} className="p-2 rounded-lg hover:bg-muted disabled:opacity-30"><SkipBack size={16} /></button>
            <span className="text-xs font-mono">{slideIdx + 1}/{DATA.pitchSlides.length}</span>
            <button onClick={() => setSlideIdx(Math.min(DATA.pitchSlides.length - 1, slideIdx + 1))} disabled={slideIdx === DATA.pitchSlides.length - 1} className="p-2 rounded-lg hover:bg-muted disabled:opacity-30"><SkipForward size={16} /></button>
          </div>
        </div>

        <div className={cn("relative min-h-[500px] flex flex-col items-center justify-center p-10 overflow-hidden bg-gradient-to-br", currentDesign.bg)}>
          <div className="absolute inset-0 opacity-10"><div className="absolute top-10 left-10 text-[200px]">{currentDesign.icon}</div></div>
          <motion.div key={slideIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 text-center max-w-3xl">
            <div className="text-6xl mb-6">{currentDesign.icon}</div>
            <h2 className={cn("text-3xl md:text-5xl font-amiri font-bold mb-6", currentDesign.accent === "gold" ? "text-gold" : "text-white")}>{lang === "ar" ? currentSlide.title_ar : currentSlide.title_en}</h2>
            <p className={cn("text-lg md:text-2xl", currentDesign.accent === "gold" ? "text-white/90" : "text-gold/90")}>{lang === "ar" ? currentSlide.content_ar : currentSlide.content_en}</p>
          </motion.div>
          <button onClick={() => setSlideIdx(Math.max(0, slideIdx - 1))} disabled={slideIdx === 0} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 disabled:opacity-30"><SkipBack size={20} className="text-white" /></button>
          <button onClick={() => setSlideIdx(Math.min(DATA.pitchSlides.length - 1, slideIdx + 1))} disabled={slideIdx === DATA.pitchSlides.length - 1} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 disabled:opacity-30"><SkipForward size={20} className="text-white" /></button>
        </div>

        <div className="p-4 bg-muted/20 border-t border-border">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {DATA.pitchSlides.map((slide: any, i: number) => (
              <button key={i} onClick={() => setSlideIdx(i)} className={cn("shrink-0 w-16 h-12 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all border", i === slideIdx ? "bg-emerald text-white border-gold scale-110" : "bg-card border-border hover:border-emerald/50 text-gray-500")}>
                <span className="text-base">{slideDesigns[i].icon}</span><span>{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ===== Data Room =====
function DataRoomView({ t, lang }: any) {
  return <DataRoomVault lang={lang} />;
}

// ===== Team =====
function TeamView({ t, lang }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'achievements' | 'skills'>('overview');

  const experiences = [
    { period: "2024 - Present", company_ar: "Seen Automation AI Agency", company_en: "Seen Automation AI Agency", role_ar: "المؤسس التشغيلي ومعمار الأنظمة", role_en: "Operational Founder & Systems Architect", desc_ar: "تأسيس وكالة أتمتة ذكاء اصطناعي متخصصة في القطاع الهندسي.", desc_en: "Founded AI automation agency specialized in engineering.", icon: "🏗️", color: "emerald", current: true },
    { period: "2022 - 2024", company_ar: "SABIC", company_en: "SABIC", role_ar: "مهندس عمليات وتحسين", role_en: "Operations & Process Improvement Engineer", desc_ar: "العمل في واحدة من أكبر شركات البتروكيماويات في العالم.", desc_en: "Worked at one of world's largest petrochemical companies.", icon: "⚗️", color: "gold", current: false },
    { period: "2019 - 2022", company_ar: "SEGi University", company_en: "SEGi University", role_ar: "بكالوريوس هندسة ميكانيكية", role_en: "Bachelor of Mechanical Engineering", desc_ar: "التخصص في تحسين العمليات وسلاسل الإمداد.", desc_en: "Specialized in process optimization and supply chains.", icon: "🎓", color: "accent", current: false },
  ];

  const achievements = [
    { title_ar: "بناء 49 ملفاً استراتيجياً", title_en: "Built 49 Strategic Documents", desc_ar: "إنشاء مستودع معرفي شامل.", desc_en: "Created comprehensive knowledge repository.", icon: "📚", year: "2026" },
    { title_ar: "بروتوكول أمني بـ 25 هجمة", title_en: "Security Protocol with 25 Attacks", desc_ar: "بروتوكول أمني شامل.", desc_en: "Comprehensive security protocol.", icon: "🛡️", year: "2026" },
    { title_ar: "100 سؤال هلوسة", title_en: "100 Hallucination Tests", desc_ar: "مكتبة شاملة لاختبار النماذج.", desc_en: "Comprehensive test library.", icon: "🧪", year: "2026" },
    { title_ar: "معمارية القلعة والرماح", title_en: "Fortress & Spears Architecture", desc_ar: "تصميم يجمع 5 قطاعات.", desc_en: "Design uniting 5 sectors.", icon: "🏰", year: "2026" },
    { title_ar: "خبرة SABIC", title_en: "SABIC Experience", desc_ar: "سنتان في البتروكيماويات.", desc_en: "Two years in petrochemicals.", icon: "⚗️", year: "2024" },
    { title_ar: "نموذج مضاربة شرعي", title_en: "Sharia Mudarabah", desc_ar: "هيكل متوافق مع AAOIFI.", desc_en: "AAOIFI-aligned structure.", icon: "🕌", year: "2026" },
  ];

  const skills = [
    { name_ar: "هندسة العمليات", name_en: "Process Engineering", level: 95 },
    { name_ar: "سلاسل الإمداد", name_en: "Supply Chain", level: 90 },
    { name_ar: "أتمتة n8n", name_en: "n8n Automation", level: 92 },
    { name_ar: "Supabase", name_en: "Supabase & PostgreSQL", level: 88 },
    { name_ar: "نماذج AI", name_en: "AI Models", level: 90 },
    { name_ar: "UX/UI", name_en: "UX/UI Design", level: 85 },
    { name_ar: "إدارة المشاريع", name_en: "Project Management", level: 88 },
    { name_ar: "التفاوض", name_en: "Business Negotiation", level: 85 },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader icon={Users} title={lang === "ar" ? "الفريق المؤسس" : "Founding Team"} subtitle={lang === "ar" ? "خبرة هندسية ورؤية طموحة" : "Engineering experience & ambitious vision"} />

      <Card className="p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald/20 to-gold/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
          <div className="shrink-0 relative">
            <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-emerald via-emerald-dark to-gold flex items-center justify-center text-white text-6xl font-amiri font-bold shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 noise opacity-30" />
              <span className="relative z-10">{DATA.company.founder.name[0]}</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-14 h-14 rounded-full bg-gold flex items-center justify-center text-2xl shadow-lg border-4 border-card">⭐</div>
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-emerald/10 px-4 py-1.5 rounded-full mb-3 border border-emerald/20"><span className="w-2 h-2 rounded-full bg-emerald animate-pulse" /><span className="text-xs font-bold text-emerald uppercase">{lang === "ar" ? "المؤسس التشغيلي" : "Operational Founder"}</span></div>
            <h2 className="text-4xl font-bold text-emerald font-amiri mb-2">{lang === "ar" ? DATA.company.founder.name : DATA.company.founder.name_en}</h2>
            <p className="text-xl text-accent font-bold mb-4">{lang === "ar" ? DATA.company.founder.role_ar : DATA.company.founder.role_en}</p>
            <p className="text-gray-700 leading-[1.9] text-base mb-6">{lang === "ar" ? DATA.company.founder.bio_ar : DATA.company.founder.bio_en}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-muted/50 p-3 rounded-xl text-center"><div className="text-2xl font-bold text-emerald font-amiri">5+</div><div className="text-xs text-gray-500">{lang === "ar" ? "سنوات" : "Years"}</div></div>
              <div className="bg-muted/50 p-3 rounded-xl text-center"><div className="text-2xl font-bold text-gold font-amiri">49</div><div className="text-xs text-gray-500">{lang === "ar" ? "ملف" : "Files"}</div></div>
              <div className="bg-muted/50 p-3 rounded-xl text-center"><div className="text-2xl font-bold text-accent font-amiri">25</div><div className="text-xs text-gray-500">{lang === "ar" ? "هجمة" : "Attacks"}</div></div>
              <div className="bg-muted/50 p-3 rounded-xl text-center"><div className="text-2xl font-bold text-emerald font-amiri">5</div><div className="text-xs text-gray-500">{lang === "ar" ? "قطاعات" : "Sectors"}</div></div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label_ar: 'نظرة عامة', label_en: 'Overview', icon: '📊' },
          { id: 'experience', label_ar: 'الخبرات', label_en: 'Experience', icon: '💼' },
          { id: 'achievements', label_ar: 'الإنجازات', label_en: 'Achievements', icon: '🏆' },
          { id: 'skills', label_ar: 'المهارات', label_en: 'Skills', icon: '🎯' },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn("px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border", activeTab === tab.id ? "bg-emerald text-white border-emerald shadow-md" : "bg-muted/30 text-gray-600 border-transparent hover:border-emerald/40")}>
            <span className="mr-2">{tab.icon}</span>{lang === "ar" ? tab.label_ar : tab.label_en}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 border-emerald/20"><div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald mb-4"><Users size={24} /></div><h3 className="font-bold text-emerald mb-2">{lang === "ar" ? "الخبرة الميدانية" : "Field Experience"}</h3><p className="text-sm text-gray-600">{lang === "ar" ? "خبرة في SABIC" : "Experience at SABIC"}</p></Card>
              <Card className="p-6 border-gold/20"><div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4"><BookOpen size={24} /></div><h3 className="font-bold text-emerald mb-2">{lang === "ar" ? "التعليم" : "Education"}</h3><p className="text-sm text-gray-600">{lang === "ar" ? "SEGi University" : "SEGi University"}</p></Card>
              <Card className="p-6 border-accent/20"><div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4"><Zap size={24} /></div><h3 className="font-bold text-emerald mb-2">{lang === "ar" ? "الرؤية" : "Vision"}</h3><p className="text-sm text-gray-600">{lang === "ar" ? "تحرير المهندسين" : "Liberating engineers"}</p></Card>
            </div>
          </motion.div>
        )}
        {activeTab === 'experience' && (
          <motion.div key="experience" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            {experiences.map((exp, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className={cn("p-6 relative", exp.current && "border-emerald/30")}>
                  {exp.current && <div className="absolute top-0 right-0 bg-emerald text-white text-xs font-bold px-3 py-1 rounded-bl-xl">{lang === "ar" ? "الحالي" : "Current"}</div>}
                  <div className="flex items-start gap-4">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0", exp.color === "emerald" && "bg-gradient-to-br from-emerald to-emerald-dark", exp.color === "gold" && "bg-gradient-to-br from-gold to-gold-dark", exp.color === "accent" && "bg-gradient-to-br from-accent to-orange-600")}>{exp.icon}</div>
                    <div className="flex-1">
                      <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-gray-500">{exp.period}</span>
                      <h3 className="text-xl font-bold text-emerald mb-1 mt-2">{lang === "ar" ? exp.role_ar : exp.role_en}</h3>
                      <p className="text-sm text-accent font-semibold mb-3">{lang === "ar" ? exp.company_ar : exp.company_en}</p>
                      <p className="text-sm text-gray-600">{lang === "ar" ? exp.desc_ar : exp.desc_en}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
        {activeTab === 'achievements' && (
          <motion.div key="achievements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((ach, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}>
                <Card className="p-6 h-full bg-gradient-to-br from-gold/5 to-emerald/5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-3xl shadow-lg shrink-0">{ach.icon}</div>
                    <div className="flex-1">
                      <span className="text-xs font-mono bg-gold/10 text-gold px-2 py-0.5 rounded">{ach.year}</span>
                      <h3 className="text-base font-bold text-emerald mb-2 mt-2">{lang === "ar" ? ach.title_ar : ach.title_en}</h3>
                      <p className="text-xs text-gray-600">{lang === "ar" ? ach.desc_ar : ach.desc_en}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
        {activeTab === 'skills' && (
          <motion.div key="skills" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            {skills.map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-card p-4 rounded-xl border border-border">
                <div className="flex justify-between items-center mb-2"><span className="font-semibold text-emerald">{lang === "ar" ? skill.name_ar : skill.name_en}</span><span className="text-sm font-bold text-accent">{skill.level}%</span></div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }} className={cn("h-full rounded-full", skill.level >= 90 ? "bg-gradient-to-l from-emerald to-gold" : "bg-gradient-to-l from-gold to-amber-500")} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6"><div className="flex items-center gap-4 mb-3"><div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center text-gold text-xl font-bold font-amiri">أ</div><div><h3 className="font-bold text-emerald">{lang === "ar" ? "أحمد" : "Ahmed"}</h3><p className="text-xs text-accent">{lang === "ar" ? "الشريك القانوني - ماليزيا" : "Legal Partner - Malaysia"}</p></div></div><p className="text-sm text-gray-600">{lang === "ar" ? "مسؤول عن التأسيس القانوني والامتثال المحلي." : "Responsible for legal formation and compliance."}</p></Card>
        <Card className="p-6"><div className="flex items-center gap-4 mb-3"><div className="w-14 h-14 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald text-2xl">🤖</div><div><h3 className="font-bold text-emerald">{lang === "ar" ? "د.سين" : "Dr. Seen"}</h3><p className="text-xs text-accent">{lang === "ar" ? "مدير العمليات الآلي" : "AI Operations Manager"}</p></div></div><p className="text-sm text-gray-600">{lang === "ar" ? "موظف آلي 24/7 لتوثيق القرارات." : "AI agent 24/7 documenting decisions."}</p></Card>
      </div>
    </div>
  );
}

// ===== Security =====
function SecurityView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Shield} title={lang === "ar" ? "الأمن والامتثال" : "Security & Compliance"} subtitle={lang === "ar" ? "بروتوكول شامل لحماية البيانات" : "Comprehensive data protection protocol"} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center border-emerald/30"><div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-4"><Shield size={32} className="text-emerald" /></div><div className="text-5xl font-bold text-emerald font-amiri mb-2">{DATA.securityHighlights.attacks}</div><div className="text-sm text-gray-500 uppercase">{lang === "ar" ? "هجمة محاكاة" : "Simulated Attacks"}</div></Card>
        <Card className="p-6 text-center border-gold/30"><div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4"><Activity size={32} className="text-gold" /></div><div className="text-5xl font-bold text-gold-dark font-amiri mb-2">{DATA.securityHighlights.hallucinationTests}</div><div className="text-sm text-gray-500 uppercase">{lang === "ar" ? "اختبار هلوسة" : "Hallucination Tests"}</div></Card>
        <Card className="p-6 text-center border-accent/30"><div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4"><Lock size={32} className="text-accent" /></div><div className="text-3xl font-bold text-accent font-amiri mb-2">{DATA.securityHighlights.encryption}</div><div className="text-sm text-gray-500 uppercase">{lang === "ar" ? "تشفير" : "Encryption"}</div></Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-emerald mb-4 flex items-center gap-2"><Layers size={18} />{lang === "ar" ? "طبقات الحماية" : "Protection Layers"}</h3>
        <div className="space-y-3">
          {[
            { icon: Server, ar: "Container Isolation لكل عميل", en: "Container Isolation per client" },
            { icon: Activity, ar: "Error Node للإشعار الفوري", en: "Error Node for instant alerts" },
            { icon: Lock, ar: "TLS 1.3 للنقل المشفر", en: "TLS 1.3 encrypted transport" },
            { icon: Shield, ar: "إدارة مفاتيح مركزية", en: "Centralized key management" },
            { icon: CheckCircle2, ar: "Backup يومي + Offsite", en: "Daily backup + Offsite" },
            { icon: FileText, ar: "NDA + DPA لكل عميل", en: "NDA + DPA for every client" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald shrink-0"><item.icon size={18} /></div>
              <div><div className="font-bold text-emerald mb-1">{lang === "ar" ? item.ar : item.en}</div></div>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-to-br from-emerald/5 to-transparent">
          <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald text-2xl">🕌</div><h3 className="font-bold text-emerald text-lg">{lang === "ar" ? "الامتثال الشرعي" : "Sharia Compliance"}</h3></div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2"><span className="text-emerald mt-1">✓</span>{lang === "ar" ? "لا ربا" : "No riba"}</li>
            <li className="flex items-start gap-2"><span className="text-emerald mt-1">✓</span>{lang === "ar" ? "لا قطاعات محرمة" : "No prohibited sectors"}</li>
            <li className="flex items-start gap-2"><span className="text-emerald mt-1">✓</span>{lang === "ar" ? "عقود مراجعة شرعية" : "Sharia-reviewed contracts"}</li>
            <li className="flex items-start gap-2"><span className="text-emerald mt-1">✓</span>{lang === "ar" ? "مصدر المال حلال" : "100% Halal funding"}</li>
          </ul>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-gold/5 to-transparent">
          <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold text-2xl">🛡️</div><h3 className="font-bold text-emerald text-lg">{lang === "ar" ? "الامتثال التنظيمي" : "Regulatory"}</h3></div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2"><span className="text-gold mt-1">✓</span>PDPL</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-1">✓</span>GDPR</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-1">✓</span>{lang === "ar" ? "مراجعة ربع سنوية" : "Quarterly review"}</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-1">✓</span>DPA</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

// ===== Settings =====
function SettingsView({ t, lang, dark, setDark, setLang }: any) {
  const [fontSize, setFontSize] = useState(16);
  const [accentColor, setAccentColor] = useState("#F97316");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const colorOptions = [
    { name: "Emerald", value: "#0F5132" },
    { name: "Gold", value: "#D4AF37" },
    { name: "Orange", value: "#F97316" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Blue", value: "#3B82F6" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader icon={Settings} title={lang === "ar" ? "الإعدادات" : "Settings"} subtitle={lang === "ar" ? "تخصيص التجربة" : "Customize experience"} />

      <Card className="p-6">
        <h3 className="font-bold text-emerald mb-4 flex items-center gap-2"><Globe size={18} />{lang === "ar" ? "اللغة" : "Language"}</h3>
        <div className="grid grid-cols-2 gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setLang("ar")} className={cn("p-5 rounded-xl font-bold transition-all border-2 text-right", lang === "ar" ? "bg-emerald text-white border-emerald shadow-lg" : "bg-muted border-transparent hover:border-emerald/40")}><div className="text-2xl mb-2">🇸🇦</div><div className="text-lg font-amiri">العربية</div></motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setLang("en")} className={cn("p-5 rounded-xl font-bold transition-all border-2", lang === "en" ? "bg-emerald text-white border-emerald shadow-lg" : "bg-muted border-transparent hover:border-emerald/40")}><div className="text-2xl mb-2">🇬🇧</div><div className="text-lg">English</div></motion.button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-emerald mb-4 flex items-center gap-2">{dark ? <Moon size={18} /> : <Sun size={18} />}{lang === "ar" ? "المظهر" : "Appearance"}</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => setDark(false)} className={cn("p-5 rounded-xl font-bold transition-all border-2 bg-white", !dark ? "border-emerald shadow-lg ring-2 ring-emerald/20" : "border-gray-200 hover:border-emerald/40")}><Sun size={32} className="mx-auto mb-2 text-amber-500" /><div className="text-emerald">{lang === "ar" ? "فاتح" : "Light"}</div></motion.button>
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => setDark(true)} className={cn("p-5 rounded-xl font-bold transition-all border-2 bg-dark-bg", dark ? "border-gold shadow-lg ring-2 ring-gold/20" : "border-gray-700 hover:border-gold/40")}><Moon size={32} className="mx-auto mb-2 text-gold" /><div className="text-white">{lang === "ar" ? "داكن" : "Dark"}</div></motion.button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2"><label className="text-sm font-semibold">{lang === "ar" ? "حجم الخط" : "Font Size"}</label><span className="text-sm font-bold text-emerald">{fontSize}px</span></div>
          <input type="range" min="12" max="24" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-emerald" />
          <p className="mt-2 text-sm text-gray-600" style={{ fontSize: `${fontSize}px` }}>{lang === "ar" ? "نص تجريبي" : "Sample text"}</p>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-3">{lang === "ar" ? "اللون المميز" : "Accent Color"}</label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <motion.button key={color.value} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setAccentColor(color.value)} className={cn("w-12 h-12 rounded-xl border-2 transition-all", accentColor === color.value ? "border-emerald ring-4 ring-emerald/20 scale-110" : "border-transparent hover:border-border")} style={{ backgroundColor: color.value }} title={color.name} />
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-emerald mb-4 flex items-center gap-2"><Zap size={18} />{lang === "ar" ? "التفاعل" : "Interaction"}</h3>
        <div className="space-y-4">
          {[
            { label_ar: "الحركات", label_en: "Animations", desc_ar: "تفعيل الحركات", desc_en: "Enable animations", value: animationsEnabled, onChange: () => setAnimationsEnabled(!animationsEnabled), icon: Sparkles },
            { label_ar: "الأصوات", label_en: "Sounds", desc_ar: "أصوات التفاعل", desc_en: "Interaction sounds", value: soundEnabled, onChange: () => setSoundEnabled(!soundEnabled), icon: Volume2 },
            { label_ar: "الإشعارات", label_en: "Notifications", desc_ar: "إشعارات التحديثات", desc_en: "Update notifications", value: notificationsEnabled, onChange: () => setNotificationsEnabled(!notificationsEnabled), icon: Bell },
            { label_ar: "الحفظ التلقائي", label_en: "Auto-Save", desc_ar: "حفظ تلقائي", desc_en: "Auto-save", value: autoSaveEnabled, onChange: () => setAutoSaveEnabled(!autoSaveEnabled), icon: Save },
          ].map((setting, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald"><setting.icon size={18} /></div>
                <div><div className="font-semibold text-sm">{lang === "ar" ? setting.label_ar : setting.label_en}</div><div className="text-xs text-gray-500">{lang === "ar" ? setting.desc_ar : setting.desc_en}</div></div>
              </div>
              <button onClick={setting.onChange} className={cn("relative w-14 h-8 rounded-full transition-all", setting.value ? "bg-emerald" : "bg-gray-300 dark:bg-gray-700")}>
                <motion.div animate={{ x: setting.value ? 28 : 4 }} className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-emerald/5 to-gold/5 border-emerald/20">
        <h3 className="font-bold text-emerald mb-4 flex items-center gap-2 font-amiri"><Info size={18} />{lang === "ar" ? "حول المشروع" : "About"}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between p-2 bg-card rounded-lg"><span className="text-gray-500">{lang === "ar" ? "الإصدار" : "Version"}</span><span className="font-bold text-emerald">v5.1.0</span></div>
          <div className="flex justify-between p-2 bg-card rounded-lg"><span className="text-gray-500">{lang === "ar" ? "آخر تحديث" : "Last Update"}</span><span className="font-bold text-gold">2026-10-10</span></div>
          <div className="flex justify-between p-2 bg-card rounded-lg"><span className="text-gray-500">Next.js</span><span className="font-bold">14.2.0</span></div>
          <div className="flex justify-between p-2 bg-card rounded-lg"><span className="text-gray-500">React</span><span className="font-bold">18.3.1</span></div>
          <div className="flex justify-between p-2 bg-card rounded-lg"><span className="text-gray-500">TypeScript</span><span className="font-bold">5.9.3</span></div>
        </div>
        <div className="mt-4 p-4 bg-emerald/10 rounded-xl border border-emerald/20">
          <p className="text-xs text-center text-emerald font-semibold">{lang === "ar" ? "مبني بـ ❤️ بواسطة د.سين وفريق Seen" : "Built with ❤️ by Dr. Seen & Seen Team"}</p>
        </div>
      </Card>
    </div>
  );
}
