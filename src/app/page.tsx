"use client";
import { useState, useEffect, useRef } from "react";
import { DATA } from "@/lib/data";
import { 
  LayoutDashboard, Wallet, FileText, Target, Map as MapIcon, 
  AlertTriangle, Cpu, FileCheck, Globe, SkipBack, SkipForward,
  ChevronDown, TrendingUp, Shield, Zap, Users, Clock, DollarSign,
  BarChart3, PieChart, Activity, CheckCircle2, XCircle, AlertCircle,
  ArrowUpRight, Layers, Server, Lock, Eye
} from "lucide-react";

// ─── Animated Counter Hook ───
function useCounter(end: number, duration = 1500, start = 0) {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let startTime: number;
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(start + (end - start) * eased));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, start]);
  return { count, ref };
}

// ─── KPI Card Component ───
function KPICard({ label, value, sub, color, delay }: { label: string; value: string; sub: string; color: string; delay: number }) {
  const colorClasses: Record<string, string> = {
    emerald: "from-emerald/10 to-emerald/5 border-emerald/20",
    gold: "from-gold/10 to-gold/5 border-gold/20",
    accent: "from-accent/10 to-accent/5 border-accent/20",
  };
  const textColors: Record<string, string> = {
    emerald: "text-emerald", gold: "text-gold-dark", accent: "text-accent",
  };
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 hover-lift opacity-0 animate-fade-up ${colorClasses[color] || colorClasses.emerald}`} style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}>
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{label}</p>
        <p className={`text-3xl font-bold font-amiri ${textColors[color] || "text-emerald"}`}>{value}</p>
        <p className="text-xs text-gray-400 mt-2">{sub}</p>
      </div>
      <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-current opacity-[0.03]" />
    </div>
  );
}

// ─── Financial Slider Component ───
function FinSlider({ label, value, min, max, step, unit, onChange }: any) {
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-300 group-hover:text-gold transition-colors">{label}</span>
        <span className="text-sm font-bold text-gold tabular-nums">{typeof value === "number" ? value.toLocaleString() : value} {unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full" />
    </div>
  );
}

// ─── Metric Card (Dark) ───
function MetricCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-xl text-center transition-all duration-300 ${highlight ? "bg-gradient-to-br from-gold/20 to-accent/10 border border-gold/30 shadow-glow" : "bg-white/5 border border-white/10 hover:border-white/20"}`}>
      <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{label}</div>
      <div className={`text-xl font-bold tabular-nums ${highlight ? "text-gradient-gold" : "text-white"}`}>{value}</div>
    </div>
  );
}

// ─── Main App ───
type Tab = "dashboard" | "financials" | "business-plan" | "sectors" | "roadmap" | "risks" | "hardware" | "the-ask";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fin, setFin] = useState({ arpu: DATA.arpu, churn: DATA.churn, cac: DATA.cac, newCust: DATA.newCustomers, margin: DATA.margin, fixed: DATA.fixedCosts });
  const [slideIdx, setSlideIdx] = useState(0);

  // Financial calculations
  const ltv = (fin.arpu * (fin.margin / 100)) / (fin.churn / 100);
  const ltvCac = ltv / fin.cac;
  const payback = fin.cac / (fin.arpu * (fin.margin / 100));
  const mrr12 = Math.round(fin.arpu * (fin.newCust * 12 * 0.8));
  const mrr36 = Math.round(fin.arpu * (fin.newCust * 36 * 0.6));
  const be = Math.max(1, Math.ceil(fin.fixed / (fin.newCust * fin.arpu * (fin.margin / 100) - fin.newCust * fin.cac)));

  const menuItems: { id: Tab; label: string; en: string; icon: any }[] = [
    { id: "dashboard", label: "لوحة التحكم", en: "Dashboard", icon: LayoutDashboard },
    { id: "financials", label: "المالية", en: "Financials", icon: Wallet },
    { id: "business-plan", label: "خطة العمل", en: "Business Plan", icon: FileText },
    { id: "sectors", label: "القطاعات", en: "Sectors", icon: Target },
    { id: "roadmap", label: "خريطة الطريق", en: "Roadmap", icon: MapIcon },
    { id: "risks", label: "المخاطر", en: "Risks", icon: AlertTriangle },
    { id: "hardware", label: "العتاد", en: "Hardware", icon: Cpu },
    { id: "the-ask", label: "الطلب", en: "The Ask", icon: FileCheck },
  ];

  // ─── RENDER TABS ───
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return (
        <div className="space-y-8">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-emerald via-emerald-dark to-emerald p-10 text-white noise">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm border border-white/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                ما قبل الإطلاق — Pre-Seed
              </div>
              <h1 className="text-4xl md:text-5xl font-amiri font-bold leading-tight mb-4">
                {DATA.company.name_ar}
              </h1>
              <p className="text-lg text-white/80 leading-relaxed max-w-2xl mb-6">
                {DATA.company.vision} نعمل بنموذج Zero-Friction ومعمارية القلعة والرماح لتقديم حلول أتمتة ذكية حلال 100%.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-lg bg-gold/20 border border-gold/30 px-4 py-2 text-sm font-semibold text-gold-light backdrop-blur-sm">🕌 حلال 100%</span>
                <span className="rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">⚡ Zero-Friction</span>
                <span className="rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">🏰 قلعة + رماح</span>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {DATA.kpis.map((kpi, i) => (
              <KPICard key={i} label={kpi.label} value={kpi.value} sub={kpi.sub} color={kpi.color} delay={i * 100} />
            ))}
          </div>

          {/* Founder + Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-8 shadow-card hover-lift">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald to-emerald-dark flex items-center justify-center text-white text-3xl font-amiri font-bold shadow-lg shrink-0">ع</div>
                <div>
                  <h3 className="text-xl font-bold text-emerald mb-1">{DATA.company.founder}</h3>
                  <p className="text-sm text-accent font-semibold mb-3">{DATA.company.founder_role}</p>
                  <p className="text-gray-600 leading-relaxed text-sm">{DATA.company.founder_bio}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: Users, label: "عملاء Y1", value: DATA.customersY1, color: "text-emerald" },
                { icon: TrendingUp, label: "عملاء Y3", value: DATA.customersY3, color: "text-gold-dark" },
                { icon: Clock, label: "نقطة التعادل", value: `شهر ${DATA.breakEven}`, color: "text-accent" },
              ].map((stat, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 shadow-card hover-lift opacity-0 animate-fade-up" style={{ animationDelay: `${600 + i * 100}ms`, animationFillMode: "forwards" }}>
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}><stat.icon size={20} /></div>
                  <div><div className="text-xs text-gray-500">{stat.label}</div><div className="text-xl font-bold">{stat.value}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

      case "financials": return (
        <div className="space-y-6">
          <div className="bg-dark text-white rounded-3xl p-8 md:p-10 shadow-elevated noise relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center"><DollarSign size={20} className="text-gold" /></div>
                <div>
                  <h2 className="text-2xl font-amiri font-bold text-gold">النمذجة المالية التفاعلية</h2>
                  <p className="text-sm text-gray-400">حرّك المؤشرات وشاهد التأثير الفوري على جميع المخرجات</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <FinSlider label="Setup Fees (رسوم التأسيس)" value={fin.arpu} min={500} max={5000} step={100} unit="SAR" onChange={(v: number) => setFin({...fin, arpu: v})} />
                  <FinSlider label="Churn Rate (نسبة التسرب)" value={fin.churn} min={1} max={20} step={1} unit="%" onChange={(v: number) => setFin({...fin, churn: v})} />
                  <FinSlider label="CAC (تكلفة الاكتساب)" value={fin.cac} min={500} max={5000} step={100} unit="SAR" onChange={(v: number) => setFin({...fin, cac: v})} />
                  <FinSlider label="New Customers (عملاء جدد/شهر)" value={fin.newCust} min={1} max={10} step={0.1} unit="" onChange={(v: number) => setFin({...fin, newCust: v})} />
                  <FinSlider label="Margin (هامش الربح)" value={fin.margin} min={50} max={90} step={5} unit="%" onChange={(v: number) => setFin({...fin, margin: v})} />
                  <FinSlider label="Fixed Costs (تكاليف ثابتة)" value={fin.fixed} min={1000} max={10000} step={500} unit="SAR" onChange={(v: number) => setFin({...fin, fixed: v})} />
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <MetricCard label="LTV" value={`${Math.round(ltv).toLocaleString()} SAR`} />
                    <MetricCard label="LTV:CAC" value={`${ltvCac.toFixed(1)}x`} highlight />
                    <MetricCard label="استرداد CAC" value={`${payback.toFixed(1)} شهر`} />
                    <MetricCard label="نقطة التعادل" value={`شهر ${be > 0 && be < 36 ? be : ">36"}`} highlight />
                    <MetricCard label="MRR شهر 12" value={`${mrr12.toLocaleString()} SAR`} />
                    <MetricCard label="MRR شهر 36" value={`${mrr36.toLocaleString()} SAR`} highlight />
                  </div>
                  <div className="mt-6 p-5 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-bold text-center mb-4 text-gray-300">توزيع استخدام الأموال (SAR {DATA.ask.toLocaleString()})</h4>
                    <div className="flex h-12 rounded-full overflow-hidden shadow-inner">
                      <div className="bg-emerald w-[60%] flex items-center justify-center text-xs font-bold text-white transition-all duration-500">60% عمليات<br/><span className="text-[10px] opacity-75">SAR {DATA.useOfFunds.opsAmount.toLocaleString()}</span></div>
                      <div className="bg-accent w-[40%] flex items-center justify-center text-xs font-bold text-white transition-all duration-500">40% تسويق<br/><span className="text-[10px] opacity-75">SAR {DATA.useOfFunds.mktAmount.toLocaleString()}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      case "business-plan": return (
        <div className="space-y-4">
          <div className="mb-6 p-6 bg-gradient-to-l from-emerald/5 to-transparent rounded-2xl border border-emerald/10">
            <h2 className="text-2xl font-amiri font-bold text-emerald mb-2">خطة العمل الشاملة</h2>
            <p className="text-gray-600 text-sm">وثيقة حية تحتوي على {DATA.businessPlan.length} أقسام استراتيجية وتشغيلية، مستمدة من مستودع Seen Automation OS (49 ملف).</p>
          </div>
          {DATA.businessPlan.map((sec, i) => (
            <details key={i} className="group bg-card rounded-2xl border border-border shadow-card overflow-hidden transition-all duration-300 open:shadow-elevated open:border-emerald/20">
              <summary className="p-6 cursor-pointer flex justify-between items-center select-none hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-emerald/10 text-emerald flex items-center justify-center text-sm font-bold font-amiri">{i + 1}</span>
                  <span className="text-lg font-bold text-emerald group-open:text-accent transition-colors">{sec.title}</span>
                </div>
                <ChevronDown size={20} className="text-gray-400 transition-transform duration-300 group-open:rotate-180 group-open:text-accent" />
              </summary>
              <div className="details-content px-6 pb-6 pt-0">
                <div className="border-t border-border/50 pt-4 text-gray-700 leading-loose text-sm">{sec.content}</div>
              </div>
            </details>
          ))}
        </div>
      );

      case "sectors": return (
        <div className="space-y-6">
          <div className="mb-4 p-6 bg-gradient-to-l from-emerald/5 to-transparent rounded-2xl border border-emerald/10">
            <h2 className="text-2xl font-amiri font-bold text-emerald mb-2">معمارية القلعة والرماح</h2>
            <p className="text-gray-600 text-sm">Seen هي القلعة الأم التي تجمع كل الرماح تحت هوية واحدة. كل رمح له تخصصه وهويته البصرية المستقلة.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DATA.sectors.map((s, i) => (
              <div key={s.id} className={`relative overflow-hidden rounded-2xl border p-6 shadow-card hover-lift opacity-0 animate-fade-up ${s.status === "active" ? "border-emerald/30 bg-gradient-to-br from-emerald/5 to-transparent" : "border-border bg-card"}`} style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}>
                {s.status === "active" && <div className="absolute top-0 right-0 w-20 h-20 bg-emerald/10 rounded-bl-full" />}
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald font-bold text-lg font-amiri">{s.ar[0]}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.status === "active" ? "bg-emerald text-white" : "bg-yellow-100 text-yellow-800"}`}>
                      {s.status === "active" ? "🟢 نشط" : "🟡 قريباً"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-emerald mb-1">{s.ar}</h3>
                  <p className="text-xs text-accent font-semibold mb-3">{s.timeline} • {s.clients} عميل مستهدف</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      case "roadmap": return (
        <div className="space-y-6">
          <div className="mb-4 p-6 bg-gradient-to-l from-emerald/5 to-transparent rounded-2xl border border-emerald/10">
            <h2 className="text-2xl font-amiri font-bold text-emerald mb-2">خريطة الطريق — 36 شهراً</h2>
            <p className="text-gray-600 text-sm">من التأسيس إلى القيادة الإقليمية في 3 سنوات.</p>
          </div>
          <div className="relative">
            <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald via-gold to-accent hidden md:block" />
            <div className="space-y-6">
              {DATA.roadmap.map((r, i) => (
                <div key={i} className={`relative flex gap-6 items-start opacity-0 animate-fade-up`} style={{ animationDelay: `${i * 150}ms`, animationFillMode: "forwards" }}>
                  <div className="hidden md:flex flex-col items-center shrink-0">
                    <div className="w-12 h-12 rounded-full bg-emerald text-white flex items-center justify-center font-bold text-sm shadow-lg border-4 border-background z-10">{r.quarter}</div>
                  </div>
                  <div className="flex-1 bg-card rounded-2xl border border-border p-6 shadow-card hover-lift">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold text-emerald">{r.title}</h3>
                      <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">السنة {r.year}</span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {r.tasks.map((t, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 size={14} className="text-emerald mt-0.5 shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 text-xs font-bold text-gold-dark bg-gold/10 px-3 py-2 rounded-lg w-fit">
                      <Activity size={12} /> {r.milestone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

      case "risks":
        const colorMap: Record<string, { bg: string; text: string; dot: string }> = {
          red: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
          yellow: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
          green: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
        };
        return (
          <div className="space-y-6">
            <div className="mb-4 p-6 bg-gradient-to-l from-emerald/5 to-transparent rounded-2xl border border-emerald/10">
              <h2 className="text-2xl font-amiri font-bold text-emerald mb-2">سجل المخاطر والتخفيف</h2>
              <p className="text-gray-600 text-sm">10 مخاطر رئيسية موثقة مع خطط تخفيف مفصلة وبروتوكول أمني شامل.</p>
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="bg-emerald text-white">
                    <tr>
                      <th className="p-4 font-semibold">#</th>
                      <th className="p-4 font-semibold">المخاطرة</th>
                      <th className="p-4 font-semibold">الاحتمال</th>
                      <th className="p-4 font-semibold">الأثر</th>
                      <th className="p-4 font-semibold">خطة التخفيف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DATA.risks.map((r, i) => {
                      const c = colorMap[r.color] || colorMap.green;
                      return (
                        <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-4 text-gray-400 font-mono text-xs">{String(i + 1).padStart(2, "0")}</td>
                          <td className="p-4 font-semibold text-foreground">{r.name}</td>
                          <td className="p-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text}`}><span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{r.prob}</span></td>
                          <td className="p-4 text-gray-600">{r.impact}</td>
                          <td className="p-4 text-gray-600 text-xs leading-relaxed max-w-md">{r.mitigation}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "hardware": return (
        <div className="space-y-6">
          <div className="mb-4 p-6 bg-gradient-to-l from-emerald/5 to-transparent rounded-2xl border border-emerald/10">
            <h2 className="text-2xl font-amiri font-bold text-emerald mb-2">مواصفات العتاد الفيزيائي</h2>
            <p className="text-gray-600 text-sm">بيئة عمل قادرة على تشغيل نماذج AI محلياً (7B-120B) ضمن ميزانية $12,000.</p>
          </div>
          
          {/* Selected Scenario Highlight */}
          <div className="bg-gradient-to-l from-emerald via-emerald-dark to-emerald rounded-2xl p-8 text-white shadow-elevated noise relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center"><Server size={20} className="text-gold" /></div>
                <h3 className="text-xl font-bold text-gold">✅ السيناريو المختار: {DATA.hardware.scenario.name}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-white/10 border border-white/10"><span className="text-gray-300 text-xs block mb-1">💻 اللابتوب</span><strong>{DATA.hardware.scenario.laptop}</strong><span className="text-gold block mt-1">{DATA.hardware.scenario.laptopPrice}</span></div>
                  <div className="p-3 rounded-lg bg-white/10 border border-white/10"><span className="text-gray-300 text-xs block mb-1">🖥️ Mini PC</span><strong>{DATA.hardware.scenario.minipc}</strong><span className="text-gold block mt-1">{DATA.hardware.scenario.minipcPrice}</span></div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-white/10 border border-white/10"><span className="text-gray-300 text-xs block mb-1">🔌 الإكسسوارات</span><strong>{DATA.hardware.scenario.accessories}</strong><span className="text-gold block mt-1">{DATA.hardware.scenario.accessoriesPrice}</span></div>
                  <div className="p-4 rounded-xl bg-gold/20 border border-gold/30 flex justify-between items-center">
                    <div><span className="text-xs text-gold-light block">الإجمالي</span><span className="text-2xl font-bold text-gold">{DATA.hardware.scenario.total}</span></div>
                    <div className="text-left"><span className="text-xs text-gray-300 block">المتبقي</span><span className="text-lg font-bold text-white">{DATA.hardware.scenario.remaining}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30"><h3 className="font-bold text-emerald flex items-center gap-2"><Cpu size={16} /> فئات اللابتوب (5)</h3></div>
              <table className="w-full text-xs text-right">
                <thead className="bg-muted/50"><tr><th className="p-3">الفئة</th><th className="p-3">المواصفات</th><th className="p-3">السعر</th><th className="p-3">AI</th></tr></thead>
                <tbody>{DATA.hardware.laptops.map((l, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/20"><td className="p-3 font-semibold">{l.category}</td><td className="p-3 text-gray-600">{l.specs}</td><td className="p-3 text-accent font-bold">{l.price}</td><td className="p-3 text-gray-500">{l.ai}</td></tr>
                ))}</tbody>
              </table>
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30"><h3 className="font-bold text-emerald flex items-center gap-2"><Layers size={16} /> فئات Mini PC (5)</h3></div>
              <table className="w-full text-xs text-right">
                <thead className="bg-muted/50"><tr><th className="p-3">الفئة</th><th className="p-3">المواصفات</th><th className="p-3">السعر</th></tr></thead>
                <tbody>{DATA.hardware.minipc.map((l, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/20"><td className="p-3 font-semibold">{l.category}</td><td className="p-3 text-gray-600">{l.specs}</td><td className="p-3 text-accent font-bold">{l.price}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      );

      case "the-ask": return (
        <div className="space-y-6">
          {/* Ask Hero */}
          <div className="bg-gradient-to-l from-emerald via-emerald-dark to-emerald rounded-3xl p-10 text-center text-white shadow-elevated noise relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm font-semibold text-gold-light uppercase tracking-widest mb-3">طلب الاستثمار</p>
              <div className="text-6xl font-bold font-amiri text-gold mb-4 animate-pulse-gold rounded-2xl inline-block px-8 py-2">SAR {DATA.ask.toLocaleString()}</div>
              <p className="text-lg text-white/90 max-w-xl mx-auto leading-relaxed">
                هيكل مضاربة شرعي متوافق مع معايير AAOIFI: {DATA.mudarabah.phase1}% من كل بيعة حتى استرداد رأس المال، ثم {DATA.mudarabah.phase2}% لمدة {DATA.mudarabah.phase2} شهراً.
              </p>
              <div className="flex justify-center gap-4 mt-6 text-sm">
                <span className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">Buyout: {DATA.mudarabah.buyoutMonths} شهر × {DATA.mudarabah.buyoutMultiple}</span>
                <span className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">Max: {DATA.mudarabah.maxYears} سنة</span>
              </div>
            </div>
          </div>

          {/* Pitch Deck */}
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-emerald flex items-center gap-2"><Eye size={16} /> Pitch Deck ({DATA.pitchSlides.length} شريحة)</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setSlideIdx(Math.max(0, slideIdx - 1))} className="p-2 rounded-lg hover:bg-muted transition-colors"><SkipBack size={16} /></button>
                <span className="text-xs font-mono text-gray-500">{slideIdx + 1}/{DATA.pitchSlides.length}</span>
                <button onClick={() => setSlideIdx(Math.min(DATA.pitchSlides.length - 1, slideIdx + 1))} className="p-2 rounded-lg hover:bg-muted transition-colors"><SkipForward size={16} /></button>
              </div>
            </div>
            <div className="bg-dark text-white p-10 min-h-[300px] flex flex-col items-center justify-center text-center relative">
              <div className="absolute top-4 left-4 text-gold/50 text-xs font-mono">SLIDE {slideIdx + 1}</div>
              <h3 className="text-2xl font-amiri font-bold text-gold mb-6">{DATA.pitchSlides[slideIdx].title}</h3>
              <p className="text-lg text-white/90 whitespace-pre-line leading-relaxed max-w-2xl">{DATA.pitchSlides[slideIdx].content}</p>
              <p className="text-sm text-gray-500 mt-6 italic">{DATA.pitchSlides[slideIdx].subtitle}</p>
              <div className="flex gap-1.5 mt-8">
                {DATA.pitchSlides.map((_, i) => (
                  <button key={i} onClick={() => setSlideIdx(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === slideIdx ? "w-8 bg-gold" : "w-1.5 bg-gray-600 hover:bg-gray-500"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Data Room */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <h3 className="font-bold text-emerald mb-4 flex items-center gap-2"><Lock size={16} /> غرفة البيانات (Data Room)</h3>
            <div className="space-y-3">
              {[
                { name: "NDA & MSA Templates", level: "public", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "🟢 عام" },
                { name: "Partner & Mudarabah Agreements", level: "nda", icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50", label: "🟡 NDA مطلوب" },
                { name: "Cap Table & Financial Model", level: "nda", icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50", label: "🟡 NDA مطلوب" },
                { name: "System Prompts & Source Code", level: "restricted", icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "🔴 مقيد" },
              ].map((item, i) => (
                <div key={i} className={`flex justify-between items-center p-4 rounded-xl border transition-all ${item.level === "restricted" ? "border-red-100 bg-red-50/30 opacity-60" : "border-border hover:border-emerald/20 hover:shadow-sm"}`}>
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className={item.color} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.bg} ${item.color}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-72" : "w-20"} bg-card border-l border-border flex flex-col transition-all duration-300 ease-in-out z-20 shadow-sm`}>
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-emerald-dark flex items-center justify-center text-gold font-bold font-amiri text-lg shadow-md shrink-0">S</div>
          {sidebarOpen && <div><h1 className="text-lg font-amiri font-bold text-emerald leading-none">Seen</h1><p className="text-[10px] text-gray-400 mt-0.5">Automation AI</p></div>}
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === item.id ? "bg-emerald text-white shadow-md sidebar-active" : "text-gray-500 hover:bg-muted hover:text-emerald"}`}>
              <item.icon size={18} className={activeTab === item.id ? "text-gold" : ""} />
              {sidebarOpen && <span>{lang === "ar" ? item.label : item.en}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl hover:bg-muted text-gray-500 text-sm transition-colors">
            {sidebarOpen ? "◀ طي" : "▶"}
          </button>
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-muted text-sm font-semibold transition-colors">
            <Globe size={14} /> {lang === "ar" ? "English" : "العربية"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-10">
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-amiri font-bold text-gradient">{menuItems.find(m => m.id === activeTab)?.label}</h2>
              <p className="text-gray-400 mt-1 text-sm">Interactive Visual Reference • {DATA.company.tagline}</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              v3.0 • Live
            </div>
          </header>
          {renderContent()}
          <footer className="mt-16 pt-8 border-t border-border text-center text-xs text-gray-400 pb-8">
            <p>© 2026 {DATA.company.name_en} • {DATA.company.tagline}</p>
          </footer>
        </div>
      </main>
    </div>
  );
}