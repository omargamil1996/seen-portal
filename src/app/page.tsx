"use client";
import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DATA } from "@/lib/data";
import { translations, type Lang } from "@/lib/translations";
import { cn } from "@/lib/utils";
import SectorModal from "@/components/SectorModal";
import DataRoomVault from "@/components/DataRoomVault";
import {
  LayoutDashboard, Wallet, FileText, Target, Map as MapIcon,
  AlertTriangle, Cpu, FileCheck, Globe, SkipBack, SkipForward,
  ChevronDown, TrendingUp, Shield, Users, Clock, DollarSign,
  BarChart3, PieChart as PieChartIcon, Activity, CheckCircle2,
  Layers, Server, Eye, Download, Settings, BookOpen, Briefcase,
  Moon, Sun, ArrowRight, ShieldCheck,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";

const AppContext = createContext<any>({});

function useCounter(end: number, duration = 1500, decimals = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start: number;
        const step = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setCount(Number((end * eased).toFixed(decimals)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration, decimals]);
  return { count, ref };
}

const Card = ({ children, className, delay = 0, hover = true }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: delay / 1000 }} className={cn("bg-card dark:bg-dark-card rounded-2xl border border-border dark:border-dark-border shadow-card", hover && "hover-lift", className)}>
    {children}
  </motion.div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 p-6 bg-gradient-to-l from-emerald/5 to-transparent dark:from-emerald/10 rounded-2xl border border-emerald/10">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl bg-emerald/10 dark:bg-emerald/20 flex items-center justify-center text-emerald"><Icon size={20} /></div>
      <h2 className="text-2xl font-amiri font-bold text-emerald dark:text-gold">{title}</h2>
    </div>
    <p className="text-gray-600 dark:text-gray-400 text-sm mr-13">{subtitle}</p>
  </motion.div>
);

const Badge = ({ children, color = "emerald" }: any) => {
  const colors: any = { emerald: "bg-emerald/10 text-emerald border-emerald/20", gold: "bg-gold/10 text-gold-dark dark:text-gold border-gold/20", accent: "bg-accent/10 text-accent border-accent/20", red: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200", yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200", green: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200" };
  return <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border", colors[color])}>{children}</span>;
};

type Tab = "dashboard" | "financials" | "business-plan" | "sectors" | "roadmap" | "risks" | "hardware" | "the-ask" | "data-room" | "team" | "security" | "settings";

export default function InvestorBriefcase() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [lang, setLang] = useState<Lang>("ar");
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fin, setFin] = useState({ arpu: DATA.financials.arpu, churn: DATA.financials.churn, cac: DATA.financials.cac, newCust: DATA.financials.newCustomers, margin: DATA.financials.margin, fixed: DATA.financials.fixedCosts });
  const [slideIdx, setSlideIdx] = useState(0);
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [lang, dark]);

  const ltv = (fin.arpu * (fin.margin / 100)) / (fin.churn / 100);
  const ltvCac = ltv / fin.cac;
  const payback = fin.cac / (fin.arpu * (fin.margin / 100));
  const be = Math.max(1, Math.ceil(fin.fixed / (fin.newCust * fin.arpu * (fin.margin / 100) - fin.newCust * fin.cac)));

  const projectionData = Array.from({ length: 36 }, (_, i) => {
    const m = i + 1;
    const customers = Math.round(fin.newCust * m * Math.pow(1 - fin.churn / 100, m / 2));
    const mrr = Math.round(customers * fin.arpu);
    const profit = Math.round(mrr * (fin.margin / 100) - fin.fixed - fin.newCust * fin.cac);
    return { month: m, customers, mrr, profit };
  });

  const menuItems: { id: Tab; icon: any }[] = [
    { id: "dashboard", icon: LayoutDashboard },
    { id: "financials", icon: Wallet },
    { id: "business-plan", icon: FileText },
    { id: "sectors", icon: Target },
    { id: "roadmap", icon: MapIcon },
    { id: "risks", icon: AlertTriangle },
    { id: "hardware", icon: Cpu },
    { id: "the-ask", icon: FileCheck },
    { id: "data-room", icon: Briefcase },
    { id: "team", icon: Users },
    { id: "security", icon: ShieldCheck },
    { id: "settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (tab) {
      case "dashboard": return <DashboardView t={t} lang={lang} setTab={setTab} />;
      case "financials": return <FinancialsView fin={fin} setFin={setFin} ltv={ltv} ltvCac={ltvCac} payback={payback} be={be} projectionData={projectionData} t={t} lang={lang} />;
      case "business-plan": return <BusinessPlanView t={t} lang={lang} />;
      case "sectors": return <SectorsView t={t} lang={lang} />;
      case "roadmap": return <RoadmapView t={t} lang={lang} />;
      case "risks": return <RisksView t={t} lang={lang} />;
      case "hardware": return <HardwareView t={t} lang={lang} />;
      case "the-ask": return <TheAskView slideIdx={slideIdx} setSlideIdx={setSlideIdx} t={t} lang={lang} />;
      case "data-room": return <DataRoomView t={t} lang={lang} />;
      case "team": return <TeamView t={t} lang={lang} />;
      case "security": return <SecurityView t={t} lang={lang} />;
      case "settings": return <SettingsView lang={lang} setLang={setLang} dark={dark} setDark={setDark} t={t} />;
      default: return null;
    }
  };

  return (
    <AppContext.Provider value={{ lang, setLang, dark, setDark }}>
      <div className="flex h-screen overflow-hidden bg-background dark:bg-dark-bg">
        <motion.aside animate={{ width: sidebarOpen ? 288 : 80 }} className="bg-card dark:bg-dark-card border-l dark:border-dark-border flex flex-col z-20 shadow-sm">
          <div className="p-6 border-b border-border dark:border-dark-border flex items-center gap-3">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-emerald-dark flex items-center justify-center text-gold font-bold font-amiri text-lg shadow-md shrink-0">S</motion.div>
            {sidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><h1 className="text-lg font-amiri font-bold text-emerald dark:text-gold leading-none">Seen</h1><p className="text-[10px] text-gray-400 mt-0.5">{t.common.investorBriefcase}</p></motion.div>}
          </div>
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map((item) => (
              <motion.button key={item.id} whileHover={{ x: lang === "ar" ? -4 : 4 }} onClick={() => setTab(item.id)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all", tab === item.id ? "bg-emerald text-white shadow-md sidebar-active" : "text-gray-500 dark:text-gray-400 hover:bg-muted dark:hover:bg-dark-muted hover:text-emerald dark:hover:text-gold")}>
                <item.icon size={18} className={tab === item.id ? "text-gold" : ""} />
                {sidebarOpen && <span>{t.menu[item.id as keyof typeof t.menu]}</span>}
              </motion.button>
            ))}
          </nav>
          <div className="p-3 border-t border-border dark:border-dark-border space-y-1">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl hover:bg-muted dark:hover:bg-dark-muted text-gray-500 text-sm">{sidebarOpen ? (lang === "ar" ? "◀ طي" : "◀ Collapse") : "▶"}</button>
          </div>
        </motion.aside>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 md:p-10">
            <header className="mb-8 flex justify-between items-center">
              <div>
                <motion.h2 key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-amiri font-bold text-gradient">{t.menu[tab as keyof typeof t.menu]}</motion.h2>
                <p className="text-gray-400 mt-1 text-sm">{t.common.investorBriefcase} v5.0 • {t.common.tagline}</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setDark(!dark)} className="p-2.5 rounded-xl border border-border dark:border-dark-border hover:bg-muted dark:hover:bg-dark-muted" title="Toggle Dark Mode">{dark ? <Sun size={16} /> : <Moon size={16} />}</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="px-4 py-2.5 rounded-xl border border-border dark:border-dark-border hover:bg-muted dark:hover:bg-dark-muted text-sm font-semibold flex items-center gap-2"><Globe size={14} /> {lang === "ar" ? "EN" : "عربي"}</motion.button>
                <div className="hidden md:flex items-center gap-3 text-xs text-gray-400 ml-4">
                  <a href="/briefcase" className="px-3 py-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors font-bold">{lang === "ar" ? "الحقيبة الثابتة" : "Static Briefcase"}</a>
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />{t.common.livePlan}</span>
                </div>
              </div>
            </header>
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>{renderContent()}</motion.div>
            </AnimatePresence>
            <footer className="mt-16 pt-8 border-t border-border dark:border-dark-border text-center text-xs text-gray-400 pb-8">
              <p>© 2026 {DATA.company.name_en} • {t.common.tagline} • Investor Briefcase v5.0</p>
            </footer>
          </div>
        </main>
      </div>
    </AppContext.Provider>
  );
}

function DashboardView({ t, lang, setTab }: any) {
  return (
    <div className="space-y-8">
      <Card className="p-10 overflow-hidden relative" hover={false}>
        <div className="absolute inset-0 bg-gradient-to-l from-emerald via-emerald-dark to-emerald noise" />
        <div className="relative z-10 max-w-3xl text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm border border-white/20 mb-6"><span className="w-2 h-2 rounded-full bg-gold animate-pulse" />{t.common.preSeed} • {t.common.investmentReady}</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-amiri font-bold leading-tight mb-4">{lang === "ar" ? DATA.company.name_ar : DATA.company.name_en}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-white/80 leading-relaxed max-w-2xl mb-6">{lang === "ar" ? DATA.company.vision_ar : DATA.company.vision_en}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3">
            {["🕌 حلال 100%", "⚡ Zero-Friction", "🏰 قلعة + رماح", "🔒 بروتوكول أمني شامل"].map((tag, i) => (
              <span key={i} className="rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">{tag}</span>
            ))}
          </motion.div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { ...t.briefcases.investorKit, icon: Briefcase, color: "from-emerald to-emerald-dark", iconBg: "bg-gold/20" },
          { ...t.briefcases.dueDiligence, icon: ShieldCheck, color: "from-gold to-gold-dark", iconBg: "bg-white/20" },
          { ...t.briefcases.portfolio, icon: BookOpen, color: "from-accent to-orange-600", iconBg: "bg-white/20" },
        ].map((bc, i) => {
            const action = i === 0 ? () => setTab("financials") : i === 1 ? () => setTab("data-room") : null;
            const href = i === 2 ? "/briefcase" : null;
            const inner = (
              <>
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm", bc.iconBg)}><bc.icon size={28} /></div>
                <h3 className="text-xl font-bold mb-1">{bc.title}</h3>
                <p className="text-xs text-white/70 mb-3">{bc.subtitle}</p>
                <p className="text-sm text-white/90 leading-relaxed mb-4">{bc.description}</p>
                <div className="flex flex-wrap gap-1 mb-6">{bc.items.map((item: string, j: number) => <span key={j} className="text-[10px] px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">{item}</span>)}</div>
                <span className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">{bc.cta} <ArrowRight size={16} /></span>
              </>
            );
            return href ? (
              <motion.a key={i} href={href} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} whileHover={{ y: -8, scale: 1.02 }} className="relative overflow-hidden rounded-2xl cursor-pointer group block">
                <div className={cn("absolute inset-0 bg-gradient-to-br noise", bc.color)} />
                <div className="relative z-10 p-8 text-white h-full">{inner}</div>
              </motion.a>
            ) : (
              <motion.button key={i} onClick={action || undefined} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} whileHover={{ y: -8, scale: 1.02 }} className="relative overflow-hidden rounded-2xl cursor-pointer group w-full text-right">
                <div className={cn("absolute inset-0 bg-gradient-to-br noise", bc.color)} />
                <div className="relative z-10 p-8 text-white h-full">{inner}</div>
              </motion.button>
            );
          })}
      </div>

      <Card className="p-6" delay={100}>
        <div className="flex items-center gap-2 mb-6"><Target size={20} className="text-emerald dark:text-gold" /><h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? "حجم السوق" : "Market Size"}</h3></div>
        <div className="grid grid-cols-3 gap-4">
          {([
            { key: "tam", color: "emerald" },
            { key: "sam", color: "gold" },
            { key: "som", color: "accent" },
          ] as const).map(({ key, color }) => {
            const data = DATA.market[key];
            const Counter = () => {
              const { count, ref } = useCounter(data.value, 1500, data.unit === "K" ? 0 : 2);
              return <div ref={ref} className="text-4xl font-bold">{count}</div>;
            };
            return (
              <motion.div key={key} whileHover={{ scale: 1.05 }} className={cn("p-6 rounded-2xl text-center border-2", color === "emerald" && "bg-emerald/5 dark:bg-emerald/10 border-emerald/20", color === "gold" && "bg-gold/5 dark:bg-gold/10 border-gold/20", color === "accent" && "bg-accent/5 dark:bg-accent/10 border-accent/20")}>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{lang === "ar" ? data.label_ar : data.label_en}</p>
                <div className={cn("font-amiri", color === "emerald" && "text-emerald", color === "gold" && "text-gold-dark dark:text-gold", color === "accent" && "text-accent")}><Counter /><span className="text-2xl">{data.unit === "B" ? "B" : "K"}</span></div>
                <p className="text-xs text-gray-400 mt-1">${data.unit === "B" ? "Billion" : "Thousand"}</p>
              </motion.div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {DATA.kpis.map((kpi, i) => (
          <Card key={i} delay={i * 80} className="p-4 text-center">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{lang === "ar" ? kpi.label_ar : kpi.label_en}</p>
            <div className="text-2xl font-bold text-emerald dark:text-gold font-amiri">{kpi.value}</div>
            <p className="text-[10px] text-gray-400 mt-1">{kpi.unit}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6" delay={200}>
        <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-2"><CheckCircle2 size={20} className="text-emerald" /><h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? "جاهزية الاستثمار" : "Investment Readiness"}</h3></div><Badge color="green">{DATA.checklists.investorReady.filter(c => c.done).length}/{DATA.checklists.investorReady.length}</Badge></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DATA.checklists.investorReady.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 dark:bg-dark-muted/50"><CheckCircle2 size={16} className={item.done ? "text-emerald" : "text-gray-300"} /><span className="text-sm">{lang === "ar" ? item.label_ar : item.label_en}</span></motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function FinancialsView({ fin, setFin, ltv, ltvCac, payback, be, projectionData, t, lang }: any) {
  const mrr12 = Math.round(fin.arpu * (fin.newCust * 12 * 0.8));
  const mrr36 = Math.round(fin.arpu * (fin.newCust * 36 * 0.6));

  const FinSlider = ({ label, value, min, max, step, unit, onChange }: any) => (
    <div className="group">
      <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium text-gray-300 group-hover:text-gold transition-colors">{label}</span><span className="text-sm font-bold text-gold tabular-nums">{typeof value === "number" ? value.toLocaleString() : value} {unit}</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full" />
    </div>
  );

  const MetricCard = ({ label, value, highlight }: any) => (
    <motion.div whileHover={{ scale: 1.03 }} className={cn("p-4 rounded-xl text-center transition-all duration-300", highlight ? "bg-gradient-to-br from-gold/20 to-accent/10 border border-gold/30 shadow-glow-gold" : "bg-white/5 border border-white/10 hover:border-white/20")}>
      <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{label}</div>
      <div className={cn("text-xl font-bold tabular-nums", highlight ? "text-gradient-gold" : "text-white")}>{value}</div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <SectionHeader icon={Wallet} title={lang === "ar" ? "النمذجة المالية التفاعلية" : "Interactive Financial Model"} subtitle={lang === "ar" ? "حرّك المؤشرات وشاهد التأثير الفوري" : "Move sliders and see instant impact"} />
      <Card className="p-8 overflow-hidden relative" hover={false}>
        <div className="absolute inset-0 bg-dark-bg dark:bg-black noise" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 text-white">
          <div className="space-y-6">
            <FinSlider label={lang === "ar" ? "Setup Fees" : "Setup Fees"} value={fin.arpu} min={500} max={5000} step={100} unit="SAR" onChange={(v: number) => setFin({ ...fin, arpu: v })} />
            <FinSlider label={lang === "ar" ? "Churn Rate" : "Churn Rate"} value={fin.churn} min={1} max={20} step={1} unit="%" onChange={(v: number) => setFin({ ...fin, churn: v })} />
            <FinSlider label="CAC" value={fin.cac} min={500} max={5000} step={100} unit="SAR" onChange={(v: number) => setFin({ ...fin, cac: v })} />
            <FinSlider label={lang === "ar" ? "New Customers/mo" : "New Customers/mo"} value={fin.newCust} min={1} max={10} step={0.1} unit="" onChange={(v: number) => setFin({ ...fin, newCust: v })} />
            <FinSlider label={lang === "ar" ? "Margin" : "Margin"} value={fin.margin} min={50} max={90} step={5} unit="%" onChange={(v: number) => setFin({ ...fin, margin: v })} />
            <FinSlider label={lang === "ar" ? "Fixed Costs" : "Fixed Costs"} value={fin.fixed} min={1000} max={10000} step={500} unit="SAR" onChange={(v: number) => setFin({ ...fin, fixed: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3 content-start">
            <MetricCard label="LTV" value={`${Math.round(ltv).toLocaleString()} SAR`} />
            <MetricCard label="LTV:CAC" value={`${ltvCac.toFixed(1)}x`} highlight />
            <MetricCard label={lang === "ar" ? "استرداد CAC" : "CAC Payback"} value={`${payback.toFixed(1)} ${lang === "ar" ? "شهر" : "mo"}`} />
            <MetricCard label={lang === "ar" ? "نقطة التعادل" : "Break-even"} value={`${lang === "ar" ? "شهر" : "Mo"} ${be > 0 && be < 36 ? be : ">36"}`} highlight />
            <MetricCard label={lang === "ar" ? "MRR M12" : "MRR Month 12"} value={`${mrr12.toLocaleString()} SAR`} />
            <MetricCard label={lang === "ar" ? "MRR M36" : "MRR Month 36"} value={`${mrr36.toLocaleString()} SAR`} highlight />
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4"><TrendingUp size={18} className="text-emerald dark:text-gold" /><h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? "نمو الإيراد الشهري المتكرر" : "MRR Growth"} (36 {lang === "ar" ? "شهراً" : "months"})</h3></div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs><linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0F5132" stopOpacity={0.4} /><stop offset="95%" stopColor="#0F5132" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" className="dark:opacity-20" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: any) => [`SAR ${Number(v).toLocaleString()}`, "MRR"]} />
              <Area type="monotone" dataKey="mrr" stroke="#0F5132" strokeWidth={2} fillOpacity={1} fill="url(#colorMrr)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4"><BarChart3 size={18} className="text-emerald dark:text-gold" /><h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? "الربحية الشهرية" : "Monthly Profitability"}</h3></div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" className="dark:opacity-20" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: any) => [`SAR ${Number(v).toLocaleString()}`, ""]} />
              <Line type="monotone" dataKey="profit" stroke="#F97316" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="customers" stroke="#D4AF37" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border dark:border-dark-border bg-muted/30 dark:bg-dark-muted/30"><h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2"><FileText size={16} /> {lang === "ar" ? "قائمة الأرباح والخسائر" : "P&L Statement"}</h3></div>
        <table className="w-full text-sm">
          <thead className="bg-emerald text-white"><tr><th className="p-3 text-right">{lang === "ar" ? "البند" : "Item"}</th><th className="p-3 text-right">Y1</th><th className="p-3 text-right">Y2</th><th className="p-3 text-right">Y3</th></tr></thead>
          <tbody>
            {[
              { label: lang === "ar" ? "الإيراد" : "Revenue", y1: DATA.financials.projections.y1.revenue, y2: DATA.financials.projections.y2.revenue, y3: DATA.financials.projections.y3.revenue },
              { label: lang === "ar" ? "التكاليف" : "Costs", y1: DATA.financials.projections.y1.costs, y2: DATA.financials.projections.y2.costs, y3: DATA.financials.projections.y3.costs },
              { label: lang === "ar" ? "صافي الربح" : "Net Profit", y1: DATA.financials.projections.y1.profit, y2: DATA.financials.projections.y2.profit, y3: DATA.financials.projections.y3.profit, highlight: true },
            ].map((row, i) => (
              <tr key={i} className={cn("border-b border-border/50 dark:border-dark-border/50", row.highlight && "bg-emerald/5 dark:bg-emerald/10 font-bold")}>
                <td className="p-3">{row.label}</td>
                <td className={cn("p-3", row.highlight && "text-emerald dark:text-gold")}>SAR {row.y1.toLocaleString()}</td>
                <td className={cn("p-3", row.highlight && "text-emerald dark:text-gold")}>SAR {row.y2.toLocaleString()}</td>
                <td className={cn("p-3", row.highlight && "text-emerald dark:text-gold")}>SAR {row.y3.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4"><PieChartIcon size={18} className="text-emerald dark:text-gold" /><h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? "توزيع استخدام الأموال" : "Use of Funds"}</h3></div>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DATA.financials.useOfFunds.breakdown.filter((b: any) => b.percentage > 0).map((b: any) => ({ name: lang === "ar" ? b.category_ar : b.category_en, value: b.percentage }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {DATA.financials.useOfFunds.breakdown.filter((b: any) => b.percentage > 0).map((_: any, i: number) => (
                    <Cell key={i} fill={["#0F5132", "#D4AF37", "#F97316", "#6B7280"][i % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 flex-1">
            {DATA.financials.useOfFunds.breakdown.filter((b: any) => b.percentage > 0).map((item: any, i: number) => {
              const colors = ["bg-emerald", "bg-gold", "bg-accent", "bg-gray-500"];
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${colors[i % 4]}`} />
                  <div>
                    <strong>{item.percentage}% {lang === "ar" ? item.category_ar : item.category_en}</strong>
                    <br />
                    <span className="text-xs text-gray-500">${item.amount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

function BusinessPlanView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={FileText} title={lang === "ar" ? "خطة العمل الشاملة" : "Comprehensive Business Plan"} subtitle={lang === "ar" ? `${DATA.businessPlan.length} قسماً استراتيجياً وتشغيلياً بمحتوى كامل ومفصل` : `${DATA.businessPlan.length} strategic and operational sections with complete detailed content`} />
      
      {/* Stats banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-emerald/5 to-emerald/10 p-4 rounded-xl border border-emerald/20 text-center">
          <div className="text-2xl font-bold text-emerald">{DATA.businessPlan.length}</div>
          <div className="text-xs text-gray-600 mt-1">{lang === "ar" ? "قسم شامل" : "Full Sections"}</div>
        </div>
        <div className="bg-gradient-to-br from-gold/5 to-gold/10 p-4 rounded-xl border border-gold/20 text-center">
          <div className="text-2xl font-bold text-gold-dark dark:text-gold">AR + EN</div>
          <div className="text-xs text-gray-600 mt-1">{lang === "ar" ? "ثنائي اللغة" : "Bilingual"}</div>
        </div>
        <div className="bg-gradient-to-br from-accent/5 to-accent/10 p-4 rounded-xl border border-accent/20 text-center">
          <div className="text-2xl font-bold text-accent">49+</div>
          <div className="text-xs text-gray-600 mt-1">{lang === "ar" ? "ملف استراتيجي" : "Strategic Files"}</div>
        </div>
        <div className="bg-gradient-to-br from-emerald/5 to-gold/5 p-4 rounded-xl border border-emerald/20 text-center">
          <div className="text-2xl font-bold text-emerald">100%</div>
          <div className="text-xs text-gray-600 mt-1">{lang === "ar" ? "جاهز للتنفيذ" : "Ready to Execute"}</div>
        </div>
      </div>

      {DATA.businessPlan.map((sec, i) => (
        <motion.details 
          key={i} 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: i * 0.03 }} 
          open={i < 4}
          className="group bg-card dark:bg-dark-card rounded-2xl border border-border dark:border-dark-border shadow-card overflow-hidden open:shadow-elevated open:border-emerald/30"
        >
          <summary className="p-6 cursor-pointer flex justify-between items-center select-none hover:bg-muted/50 dark:hover:bg-dark-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald to-emerald-dark text-gold flex items-center justify-center text-sm font-bold font-amiri shadow-md">{i + 1}</span>
              <div>
                <span className="text-lg font-bold text-emerald dark:text-gold block">{lang === "ar" ? sec.title_ar : sec.title_en}</span>
                <span className="text-xs text-gray-500">{lang === "ar" ? sec.title_en : sec.title_ar}</span>
              </div>
            </div>
            <ChevronDown size={20} className="text-gray-400 transition-transform duration-300 group-open:rotate-180 text-accent" />
          </summary>
          <div className="details-content px-6 pb-6 pt-0">
            <div className="border-t border-border/50 dark:border-dark-border/50 pt-4 text-gray-700 dark:text-gray-300 leading-[2] text-sm whitespace-pre-line">
              {lang === "ar" ? sec.content_ar : sec.content_en}
            </div>
          </div>
        </motion.details>
      ))}
    </div>
  );
}

function SectorsView({ t, lang }: any) {
  const [selected, setSelected] = useState<any>(null);
  const activeCount = DATA.sectors.filter((s: any) => s.status === "active").length;
  const totalClients = DATA.sectors.reduce((sum: number, s: any) => sum + s.target_clients, 0);
  const avgReadiness = Math.round(DATA.sectors.reduce((sum: number, s: any) => sum + s.readiness.percentage, 0) / DATA.sectors.length);
  
  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Target} 
        title={lang === "ar" ? "القطاعات والرماح" : "Sectors & Spears"} 
        subtitle={lang === "ar" ? "معمارية القلعة والرماح: Seen تجمع، وكل رمح يتخصص. اضغط على أي قطاع لفتح التحليل الاستراتيجي الكامل." : "Fortress and Spears architecture: Seen unites, each spear specializes. Click any sector to open full strategic analysis."} 
      />

      {/* Sector Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-emerald/5 to-emerald/10 p-5 rounded-2xl border border-emerald/20 text-center shadow-sm"
        >
          <div className="text-3xl font-bold text-emerald font-amiri">{DATA.sectors.length}</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "قطاعات مستهدفة" : "Target Sectors"}</div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-5 rounded-2xl border border-green-200 dark:border-green-800 text-center shadow-sm"
        >
          <div className="text-3xl font-bold text-green-700 dark:text-green-400 font-amiri">{activeCount}</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "نشط الآن" : "Active Now"}</div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-accent/5 to-accent/10 p-5 rounded-2xl border border-accent/20 text-center shadow-sm"
        >
          <div className="text-3xl font-bold text-accent font-amiri">{totalClients}</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "عميل مستهدف" : "Target Clients"}</div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-gold/5 to-gold/10 p-5 rounded-2xl border border-gold/20 text-center shadow-sm"
        >
          <div className="text-3xl font-bold text-gold-dark dark:text-gold font-amiri">{avgReadiness}%</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "جاهزية متوسطة" : "Avg Readiness"}</div>
        </motion.div>
      </div>

      {/* Fortress & Spears Visual */}
      <div className="bg-card dark:bg-dark-card rounded-2xl border border-border p-6 shadow-card">
        <h3 className="text-lg font-bold text-emerald dark:text-gold mb-4 flex items-center gap-2">
          <span className="text-2xl">🏰</span>
          {lang === "ar" ? "معمارية القلعة والرماح" : "Fortress & Spears Architecture"}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
          {lang === "ar" 
            ? "Seen هي القلعة الأم التي تجمع كل الرماح تحت هوية واحدة. كل رمح له تخصصه وهويته البصرية المستقلة، لكنهم يشتركون في البنية التحتية، البروتوكولات الأمنية، ومعايير الجودة."
            : "Seen is the mother fortress that unites all spears under one identity. Each spear has its own specialization and visual identity, but they share infrastructure, security protocols, and quality standards."
          }
        </p>
        <div className="flex justify-center items-center gap-2 flex-wrap py-4">
          <div className="px-4 py-3 bg-emerald text-white rounded-xl font-bold text-sm shadow-lg">🏰 Seen</div>
          <div className="text-gray-400">→</div>
          {DATA.sectors.map((s: any) => (
            <div key={s.id} className={cn("px-3 py-2 rounded-lg text-xs font-semibold border", s.status === "active" ? "bg-gold/20 border-gold text-gold-dark dark:text-gold" : "bg-muted border-border text-gray-500")}>
              {s.icon} {s.name_en}
            </div>
          ))}
        </div>
      </div>

      {/* Sector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DATA.sectors.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6, scale: 1.01 }}
            onClick={() => setSelected(s)}
            className={cn("text-right bg-card dark:bg-dark-card rounded-2xl border shadow-card overflow-hidden transition-all", 
              s.status === "active" 
                ? "border-emerald/40 dark:border-emerald/60 shadow-glow" 
                : "border-border dark:border-dark-border"
            )}
          >
            <div className={cn("p-4 flex justify-between items-center", s.status === "active" ? "bg-gradient-to-l from-emerald to-emerald-dark text-white" : "bg-muted dark:bg-dark-muted")}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{s.icon}</span>
                <div>
                  <h3 className="font-bold text-xl">{lang === "ar" ? s.name_ar : s.name_en}</h3>
                  <p className="text-xs opacity-80">{s.name_en}</p>
                </div>
              </div>
              <Badge color={s.status === "active" ? "green" : "yellow"}>
                {s.status === "active" ? (lang === "ar" ? "🟢 نشط" : "🟢 Active") : (lang === "ar" ? "🟡 قريباً" : "🟡 Coming")}
              </Badge>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{lang === "ar" ? s.desc_ar : s.desc_en}</p>
              
              {/* Strategic Justification Preview */}
              <div className="bg-emerald/5 dark:bg-emerald/10 p-3 rounded-lg border-r-4 border-emerald">
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 italic">
                  "{lang === "ar" ? s.justification_ar : s.justification_en}"
                </p>
              </div>

              {/* Sub-sectors preview */}
              <div>
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{lang === "ar" ? "التخصصات الفرعية" : "Sub-specializations"}</div>
                <div className="flex flex-wrap gap-1">
                  {(lang === "ar" ? s.subSectors_ar : s.subSectors_en).slice(0, 3).map((sub: string, j: number) => (
                    <span key={j} className="text-[10px] px-2 py-1 rounded-full bg-gold/10 text-gold-dark dark:text-gold border border-gold/20">
                      {sub}
                    </span>
                  ))}
                  {(lang === "ar" ? s.subSectors_ar : s.subSectors_en).length > 3 && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-muted text-gray-500">
                      +{(lang === "ar" ? s.subSectors_ar : s.subSectors_en).length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-muted/50 dark:bg-dark-muted/50 p-3 rounded-lg text-center">
                  <div className="text-[10px] text-gray-500 uppercase">{lang === "ar" ? "الإطلاق" : "Launch"}</div>
                  <div className="font-bold text-emerald dark:text-gold text-sm">{s.timeline}</div>
                </div>
                <div className="bg-muted/50 dark:bg-dark-muted/50 p-3 rounded-lg text-center">
                  <div className="text-[10px] text-gray-500 uppercase">{lang === "ar" ? "العملاء" : "Clients"}</div>
                  <div className="font-bold text-accent text-sm">{s.target_clients}</div>
                </div>
                <div className="bg-muted/50 dark:bg-dark-muted/50 p-3 rounded-lg text-center">
                  <div className="text-[10px] text-gray-500 uppercase">{lang === "ar" ? "الجاهزية" : "Ready"}</div>
                  <div className="font-bold text-gold-dark dark:text-gold text-sm">{s.readiness.percentage}%</div>
                </div>
              </div>
              <div className="w-full py-2.5 bg-gradient-to-l from-emerald/10 to-gold/10 text-emerald dark:text-gold rounded-xl text-sm font-bold text-center border border-emerald/20 hover:border-emerald/40 transition-colors">
                {lang === "ar" ? "عرض التحليل الكامل ←" : "View Full Analysis →"}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      {selected && <SectorModal sector={selected} lang={lang} onClose={() => setSelected(null)} />}
    </div>
  );
}

function RoadmapView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={MapIcon} title={lang === "ar" ? "رحلة المشروع" : "Project Journey"} subtitle={lang === "ar" ? "من الفكرة إلى القيادة الإقليمية" : "From idea to regional leadership"} />
      <div className="relative">
        <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-emerald to-accent hidden md:block" />
        <div className="space-y-6">
          {DATA.roadmap.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: lang === "ar" ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.1 }} className="relative flex gap-6 items-start">
              <div className="hidden md:flex flex-col items-center shrink-0"><motion.div whileHover={{ scale: 1.1 }} className="w-12 h-12 rounded-full bg-emerald text-white flex items-center justify-center text-lg shadow-lg border-4 border-background dark:border-dark-bg z-10">{item.phase_ar.slice(0, 2)}</motion.div></div>
              <Card className="flex-1 p-6">
                <div className="flex justify-between items-center mb-2"><h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? item.phase_ar : item.phase_en}</h3><Badge color="gold">{lang === "ar" ? item.date_ar : item.date_en}</Badge></div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{lang === "ar" ? item.desc_ar : item.desc_en}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RisksView({ t, lang }: any) {
  // Group risks by category
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
      <SectionHeader 
        icon={AlertTriangle} 
        title={lang === "ar" ? "إدارة المخاطر" : "Risk Management"} 
        subtitle={lang === "ar" ? "سجل مخاطر شامل موثق مع خطط تخفيف قابلة للتنفيذ" : "Comprehensive documented risk register with executable mitigation plans"} 
      />
      
      {/* Risk Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div whileHover={{ scale: 1.03 }} className="bg-card dark:bg-dark-card p-5 rounded-2xl border border-border shadow-card text-center">
          <div className="text-3xl font-bold text-emerald dark:text-gold font-amiri">{DATA.risks.length}</div>
          <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{lang === "ar" ? "إجمالي المخاطر" : "Total Risks"}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-red-50 dark:bg-red-900/20 p-5 rounded-2xl border border-red-200 dark:border-red-800 shadow-card text-center">
          <div className="text-3xl font-bold text-red-700 dark:text-red-400 font-amiri">{highCount}</div>
          <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{lang === "ar" ? "عالي الاحتمال" : "High Probability"}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-2xl border border-yellow-200 dark:border-yellow-800 shadow-card text-center">
          <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-400 font-amiri">{medCount}</div>
          <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{lang === "ar" ? "متوسط" : "Medium"}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-green-50 dark:bg-green-900/20 p-5 rounded-2xl border border-green-200 dark:border-green-800 shadow-card text-center">
          <div className="text-3xl font-bold text-green-700 dark:text-green-400 font-amiri">{lowCount}</div>
          <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{lang === "ar" ? "منخفض" : "Low"}</div>
        </motion.div>
      </div>

      {/* Risk Matrix */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-emerald dark:text-gold mb-4 flex items-center gap-2">
          <BarChart3 size={18} />
          {lang === "ar" ? "مصفوفة المخاطر (3x3)" : "Risk Matrix (3×3)"}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-1"></div>
          <div className="text-center text-xs font-bold p-2">{lang === "ar" ? "أثر منخفض" : "Low Impact"}</div>
          <div className="text-center text-xs font-bold p-2">{lang === "ar" ? "أثر متوسط" : "Med Impact"}</div>
          <div className="text-center text-xs font-bold p-2">{lang === "ar" ? "أثر عالي" : "High Impact"}</div>
          
          <div className="text-right text-xs font-bold p-2">{lang === "ar" ? "احتمال عالي" : "High"}</div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 text-sm text-center font-bold">{DATA.risks.filter((r: any) => r.prob === "high" && r.impact === "low").length}</div>
          <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3 text-sm text-center font-bold">{DATA.risks.filter((r: any) => r.prob === "high" && r.impact === "medium").length}</div>
          <div className="bg-red-200 dark:bg-red-800 rounded-lg p-3 text-sm text-center font-bold text-white">{DATA.risks.filter((r: any) => r.prob === "high" && r.impact === "high").length}</div>
          
          <div className="text-right text-xs font-bold p-2">{lang === "ar" ? "احتمال متوسط" : "Med"}</div>
          <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3 text-sm text-center">{DATA.risks.filter((r: any) => r.prob === "medium" && r.impact === "low").length}</div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 text-sm text-center font-bold">{DATA.risks.filter((r: any) => r.prob === "medium" && r.impact === "medium").length}</div>
          <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3 text-sm text-center font-bold">{DATA.risks.filter((r: any) => r.prob === "medium" && r.impact === "high").length}</div>
          
          <div className="text-right text-xs font-bold p-2">{lang === "ar" ? "احتمال منخفض" : "Low"}</div>
          <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3 text-sm text-center">{DATA.risks.filter((r: any) => r.prob === "low" && r.impact === "low").length}</div>
          <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3 text-sm text-center">{DATA.risks.filter((r: any) => r.prob === "low" && r.impact === "medium").length}</div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 text-sm text-center font-bold">{DATA.risks.filter((r: any) => r.prob === "low" && r.impact === "high").length}</div>
        </div>
      </Card>

      {/* Risks grouped by category */}
      {Object.entries(risksByCategory).map(([cat, risks]) => (
        <Card key={cat} className="overflow-hidden">
          <div className="bg-emerald text-white p-4">
            <h3 className="font-bold flex items-center gap-2">
              <AlertTriangle size={18} />
              {lang === "ar" ? (risks[0].category_ar || cat) : cat} ({risks.length})
            </h3>
          </div>
          <div className="divide-y divide-border dark:divide-dark-border">
            {risks.map((r: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 hover:bg-muted/30 dark:hover:bg-dark-muted/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                  <h4 className="font-bold text-emerald dark:text-gold flex items-center gap-2">
                    <span className="text-xs bg-emerald/10 dark:bg-emerald/20 px-2 py-0.5 rounded font-mono">#{String(DATA.risks.indexOf(r) + 1).padStart(2, "0")}</span>
                    {lang === "ar" ? r.name_ar : r.name_en}
                  </h4>
                  <div className="flex gap-2">
                    <Badge color={r.prob === "high" ? "red" : r.prob === "medium" ? "yellow" : "green"}>
                      {lang === "ar" ? (r.prob === "high" ? "احتمال عالي" : r.prob === "medium" ? "احتمال متوسط" : "احتمال منخفض") : `${r.prob} prob`}
                    </Badge>
                    <Badge color={r.impact === "high" ? "red" : r.impact === "medium" ? "yellow" : "green"}>
                      {lang === "ar" ? `أثر ${r.impact === "high" ? "عالي" : r.impact === "medium" ? "متوسط" : "منخفض"}` : `${r.impact} impact`}
                    </Badge>
                  </div>
                </div>
                <div className="bg-muted/30 dark:bg-dark-muted/30 p-3 rounded-lg border-r-4 border-emerald">
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
                    {lang === "ar" ? "خطة التخفيف" : "Mitigation Plan"}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {lang === "ar" ? r.mitigation_ar : r.mitigation_en}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}


function HardwareView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Cpu} title={lang === "ar" ? "محطة العمل المقترحة" : "Recommended Workstation"} subtitle={lang === "ar" ? "تجميعة كاملة" : "Complete setup"} />
      <Card className="p-8 overflow-hidden relative" hover={false}>
        <div className="absolute inset-0 bg-gradient-to-l from-emerald via-emerald-dark to-emerald noise" />
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center"><Server size={24} className="text-gold" /></div><div><h3 className="text-xl font-bold text-gold">✅ {lang === "ar" ? "التجميعة المختارة:" : "Selected:"} {lang === "ar" ? DATA.hardware.scenario.name_ar : DATA.hardware.scenario.name_en}</h3><p className="text-sm text-white/70">{lang === "ar" ? "الأفضل لنماذج 70B-120B" : "Best for 70B-120B models"}</p></div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm"><div className="text-xs text-gray-300 mb-2">💻 {lang === "ar" ? "اللابتوب" : "Laptop"}</div><div className="font-bold text-sm mb-1">{DATA.hardware.scenario.laptop}</div><div className="text-gold font-bold">${DATA.hardware.scenario.laptop_price.toLocaleString()}</div></div>
            <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm"><div className="text-xs text-gray-300 mb-2">🖥️ Mini PC</div><div className="font-bold text-sm mb-1">{DATA.hardware.scenario.minipc}</div><div className="text-gold font-bold">${DATA.hardware.scenario.minipc_price.toLocaleString()}</div></div>
            <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur-sm"><div className="text-xs text-gray-300 mb-2">🔌 {lang === "ar" ? "الإكسسوارات" : "Accessories"}</div><div className="font-bold text-sm mb-1">{lang === "ar" ? DATA.hardware.scenario.accessories : DATA.hardware.scenario.accessories_en}</div><div className="text-gold font-bold">${DATA.hardware.scenario.accessories_price.toLocaleString()}</div></div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 bg-gold/20 border border-gold/30 rounded-xl p-4">
            <div><span className="text-xs text-gold-light">{lang === "ar" ? "الإجمالي" : "Total"}</span><div className="text-2xl font-bold text-gold">${DATA.hardware.scenario.total.toLocaleString()}</div></div>
            <div><span className="text-xs text-gray-300">{lang === "ar" ? "المتبقي" : "Remaining"}</span><div className="text-xl font-bold text-white">${DATA.hardware.scenario.remaining.toLocaleString()}</div></div>
            <div><span className="text-xs text-gray-300">{lang === "ar" ? "الميزانية" : "Budget"}</span><div className="text-xl font-bold text-white/70">${DATA.hardware.scenario.budget.toLocaleString()}</div></div>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border dark:border-dark-border bg-muted/30 dark:bg-dark-muted/30"><h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2"><Cpu size={16} /> {lang === "ar" ? "فئات اللابتوب" : "Laptops"}</h3></div>
          <table className="w-full text-xs"><thead className="bg-muted/50 dark:bg-dark-muted/50"><tr><th className="p-3 text-right">{lang === "ar" ? "الفئة" : "Category"}</th><th className="p-3 text-right">{lang === "ar" ? "المواصفات" : "Specs"}</th><th className="p-3 text-right">{lang === "ar" ? "السعر" : "Price"}</th><th className="p-3 text-right">AI</th></tr></thead><tbody>{DATA.hardware.laptops.map((l, i) => <tr key={i} className="border-b border-border/50 dark:border-dark-border/50 hover:bg-muted/20"><td className="p-3 font-semibold">{l.category}</td><td className="p-3 text-gray-600 dark:text-gray-400">{l.specs}</td><td className="p-3 text-accent font-bold">{l.price}</td><td className="p-3 text-gray-500">{l.ai}</td></tr>)}</tbody></table>
        </Card>
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border dark:border-dark-border bg-muted/30 dark:bg-dark-muted/30"><h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2"><Layers size={16} /> {lang === "ar" ? "فئات Mini PC" : "Mini PCs"}</h3></div>
          <table className="w-full text-xs"><thead className="bg-muted/50 dark:bg-dark-muted/50"><tr><th className="p-3 text-right">{lang === "ar" ? "الفئة" : "Category"}</th><th className="p-3 text-right">{lang === "ar" ? "المواصفات" : "Specs"}</th><th className="p-3 text-right">{lang === "ar" ? "السعر" : "Price"}</th></tr></thead><tbody>{DATA.hardware.minipc.map((l, i) => <tr key={i} className="border-b border-border/50 dark:border-dark-border/50 hover:bg-muted/20"><td className="p-3 font-semibold">{l.category}</td><td className="p-3 text-gray-600 dark:text-gray-400">{l.specs}</td><td className="p-3 text-accent font-bold">{l.price}</td></tr>)}</tbody></table>
        </Card>
      </div>
    </div>
  );
}

function TheAskView({ slideIdx, setSlideIdx, t, lang }: any) {
  return (
    <div className="space-y-6">
      <Card className="p-10 text-center overflow-hidden relative" hover={false}>
        <div className="absolute inset-0 bg-gradient-to-l from-emerald via-emerald-dark to-emerald noise" />
        <div className="relative z-10 text-white">
          <p className="text-sm font-semibold text-gold-light uppercase tracking-widest mb-3">{lang === "ar" ? "طلب الاستثمار" : "Investment Ask"}</p>
          <div className="text-6xl font-bold font-amiri text-gold mb-4">SAR {DATA.ask.amount.toLocaleString()}</div>
          <p className="text-lg text-white/90 max-w-xl mx-auto">{lang === "ar" ? `هيكل ${DATA.ask.structure_ar}: ${DATA.ask.phase1}% حتى استرداد رأس المال، ثم ${DATA.ask.phase2}% لمدة ${DATA.ask.phase2_months} شهراً` : `${DATA.ask.structure_en}: ${DATA.ask.phase1}% until recovery, then ${DATA.ask.phase2}% for ${DATA.ask.phase2_months} months`}</p>
          <div className="flex justify-center gap-4 mt-6 text-sm flex-wrap"><span className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">Buyout: {DATA.ask.buyout_months} {lang === "ar" ? "شهر" : "mo"} × {DATA.ask.buyout_multiple}</span><span className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">Max: {DATA.ask.max_years} {lang === "ar" ? "سنة" : "yrs"}</span></div>
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border dark:border-dark-border flex justify-between items-center">
          <h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2"><Eye size={16} /> Pitch Deck ({DATA.pitchSlides.length} {lang === "ar" ? "شريحة" : "slides"})</h3>
          <div className="flex items-center gap-2"><button onClick={() => setSlideIdx(Math.max(0, slideIdx - 1))} className="p-2 rounded-lg hover:bg-muted dark:hover:bg-dark-muted"><SkipBack size={16} /></button><span className="text-xs font-mono text-gray-500">{slideIdx + 1}/{DATA.pitchSlides.length}</span><button onClick={() => setSlideIdx(Math.min(DATA.pitchSlides.length - 1, slideIdx + 1))} className="p-2 rounded-lg hover:bg-muted dark:hover:bg-dark-muted"><SkipForward size={16} /></button></div>
        </div>
        <div className="bg-dark-bg text-white p-10 min-h-[300px] flex flex-col items-center justify-center text-center">
          <h3 className="text-2xl font-amiri font-bold text-gold mb-6">{lang === "ar" ? DATA.pitchSlides[slideIdx].title_ar : DATA.pitchSlides[slideIdx].title_en}</h3>
          <p className="text-lg text-white/90 whitespace-pre-line leading-relaxed max-w-2xl">{lang === "ar" ? DATA.pitchSlides[slideIdx].content_ar : DATA.pitchSlides[slideIdx].content_en}</p>
          <div className="flex gap-1.5 mt-8">{DATA.pitchSlides.map((_, i) => <button key={i} onClick={() => setSlideIdx(i)} className={cn("h-1.5 rounded-full transition-all", i === slideIdx ? "w-8 bg-gold" : "w-1.5 bg-gray-600 hover:bg-gray-500")} />)}</div>
        </div>
      </Card>
    </div>
  );
}

function DataRoomView({ t, lang }: any) {
  return <DataRoomVault lang={lang} />;
}

function TeamView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Users} title={lang === "ar" ? "الفريق" : "Team"} subtitle={lang === "ar" ? "الهيكل التنظيمي" : "Organizational structure"} />
      <Card className="p-8">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald to-emerald-dark flex items-center justify-center text-white text-4xl font-amiri font-bold shadow-lg shrink-0">{(lang === "ar" ? DATA.company.founder.name : DATA.company.founder.name_en)[0]}</div>
          <div><h3 className="text-2xl font-bold text-emerald dark:text-gold mb-1">{lang === "ar" ? DATA.company.founder.name : DATA.company.founder.name_en}</h3><p className="text-accent font-semibold mb-4">{lang === "ar" ? DATA.company.founder.role_ar : DATA.company.founder.role_en}</p><p className="text-gray-600 dark:text-gray-400 leading-relaxed">{lang === "ar" ? DATA.company.founder.bio_ar : DATA.company.founder.bio_en}</p></div>
        </div>
      </Card>
    </div>
  );
}

function SecurityView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={ShieldCheck} title={lang === "ar" ? "الأمن والامتثال" : "Security & Compliance"} subtitle={lang === "ar" ? "بروتوكول أمني شامل" : "Comprehensive security protocol"} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center"><div className="text-4xl font-bold text-emerald dark:text-gold mb-2">{DATA.securityHighlights.attacks}</div><div className="text-sm text-gray-500">{lang === "ar" ? "هجمة محاكاة" : "Simulated attacks"}</div></Card>
        <Card className="p-6 text-center"><div className="text-4xl font-bold text-gold-dark dark:text-gold mb-2">{DATA.securityHighlights.hallucinationTests}</div><div className="text-sm text-gray-500">{lang === "ar" ? "سؤال هلوسة" : "Hallucination tests"}</div></Card>
        <Card className="p-6 text-center"><div className="text-2xl font-bold text-accent mb-2">{DATA.securityHighlights.encryption}</div><div className="text-sm text-gray-500">{lang === "ar" ? "تشفير البيانات" : "Data encryption"}</div></Card>
      </div>
      <Card className="p-6">
        <h3 className="font-bold text-emerald dark:text-gold mb-4">{lang === "ar" ? "طبقات الحماية" : "Protection Layers"}</h3>
        <div className="space-y-3">
          {[
            { ar: "Container Isolation لكل عميل", en: "Container Isolation per client" },
            { ar: "Error Node System", en: "Error Node System" },
            { ar: "TLS 1.3 للنقل المشفر", en: "TLS 1.3 encrypted transport" },
            { ar: "إدارة المفاتيح المركزية", en: "Centralized key management" },
            { ar: "Backup يومي مشفر", en: "Daily encrypted backup" },
            { ar: "NDA + DPA لكل عميل", en: "NDA + DPA for every client" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 text-sm"><CheckCircle2 size={16} className="text-emerald shrink-0" /><span className="text-gray-700 dark:text-gray-300">{lang === "ar" ? item.ar : item.en}</span></motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SettingsView({ lang, setLang, dark, setDark, t }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Settings} title={lang === "ar" ? "الإعدادات" : "Settings"} subtitle={lang === "ar" ? "تخصيص تجربة العرض" : "Customize experience"} />
      <Card className="p-6">
        <h3 className="font-bold text-emerald dark:text-gold mb-4">{lang === "ar" ? "اللغة" : "Language"}</h3>
        <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setLang("ar")} className={cn("px-6 py-3 rounded-xl font-bold transition-all", lang === "ar" ? "bg-emerald text-white" : "bg-muted dark:bg-dark-muted text-gray-600 dark:text-gray-400")}>العربية</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setLang("en")} className={cn("px-6 py-3 rounded-xl font-bold transition-all", lang === "en" ? "bg-emerald text-white" : "bg-muted dark:bg-dark-muted text-gray-600 dark:text-gray-400")}>English</motion.button>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="font-bold text-emerald dark:text-gold mb-4">{lang === "ar" ? "المظهر" : "Appearance"}</h3>
        <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setDark(false)} className={cn("px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2", !dark ? "bg-emerald text-white" : "bg-muted dark:bg-dark-muted text-gray-600 dark:text-gray-400")}><Sun size={16} /> {lang === "ar" ? "فاتح" : "Light"}</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setDark(true)} className={cn("px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2", dark ? "bg-emerald text-white" : "bg-muted dark:bg-dark-muted text-gray-600 dark:text-gray-400")}><Moon size={16} /> {lang === "ar" ? "داكن" : "Dark"}</motion.button>
        </div>
      </Card>
    </div>
  );
}
