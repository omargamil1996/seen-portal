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
  const readinessCount = DATA.checklists.investorReady.filter((c: any) => c.done).length;
  const totalCount = DATA.checklists.investorReady.length;
  
  return (
    <div className="space-y-8">
      {/* HERO BANNER */}
      <Card className="p-10 overflow-hidden relative" hover={false}>
        <div className="absolute inset-0 bg-gradient-to-l from-emerald via-emerald-dark to-emerald noise" />
        <div className="relative z-10 max-w-3xl text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm border border-white/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            {t.common.preSeed} • {t.common.investmentReady}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-amiri font-bold leading-tight mb-4"
          >
            {lang === "ar" ? DATA.company.name_ar : DATA.company.name_en}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xl text-gold font-semibold mb-4 font-amiri"
          >
            {lang === "ar" ? DATA.company.tagline_ar : DATA.company.tagline_en}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-lg text-white/80 leading-relaxed max-w-2xl mb-6"
          >
            {lang === "ar" ? DATA.company.vision_ar : DATA.company.vision_en}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            {["🕌 " + (lang === "ar" ? "حلال 100%" : "100% Halal"), "⚡ Zero-Friction", "🏰 " + (lang === "ar" ? "قلعة + رماح" : "Fortress + Spears"), "🔒 " + (lang === "ar" ? "بروتوكول أمني" : "Security Protocol")].map((tag, i) => (
              <span key={i} className="rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">{tag}</span>
            ))}
          </motion.div>
        </div>
      </Card>

      {/* 3 INTERACTIVE BRIEFCASE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { ...t.briefcases.investorKit, icon: Briefcase, color: "from-emerald to-emerald-dark", iconBg: "bg-gold/20", onClick: () => setTab("financials") },
          { ...t.briefcases.dueDiligence, icon: ShieldCheck, color: "from-gold to-gold-dark", iconBg: "bg-white/20", onClick: () => setTab("data-room") },
          { ...t.briefcases.portfolio, icon: BookOpen, color: "from-accent to-orange-600", iconBg: "bg-white/20", onClick: () => setTab("business-plan") },
        ].map((bc, i) => (
          <motion.button 
            key={i} 
            onClick={bc.onClick}
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: i * 0.15 }} 
            whileHover={{ y: -8, scale: 1.02 }} 
            className="relative overflow-hidden rounded-2xl group text-right"
          >
            <div className={cn("absolute inset-0 bg-gradient-to-br noise", bc.color)} />
            <div className="relative z-10 p-8 text-white h-full">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm", bc.iconBg)}>
                <bc.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-1 font-amiri">{bc.title}</h3>
              <p className="text-xs text-white/70 mb-3">{bc.subtitle}</p>
              <p className="text-sm text-white/90 leading-relaxed mb-4">{bc.description}</p>
              <div className="flex flex-wrap gap-1 mb-6">
                {bc.items.map((item: string, j: number) => (
                  <span key={j} className="text-[10px] px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">{item}</span>
                ))}
              </div>
              <span className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                {bc.cta} <ArrowRight size={16} />
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* TAM/SAM/SOM MARKET SIZE */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target size={20} className="text-emerald dark:text-gold" />
          <h3 className="text-lg font-bold text-emerald dark:text-gold">
            {lang === "ar" ? "حجم السوق" : "Market Size"}
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: "tam", color: "emerald" },
            { key: "sam", color: "gold" },
            { key: "som", color: "accent" },
          ].map(({ key, color }) => {
            const d = DATA.market[key as keyof typeof DATA.market];
            return (
              <motion.div 
                key={key} 
                whileHover={{ scale: 1.05 }} 
                className={cn(
                  "p-6 rounded-2xl text-center border-2",
                  color === "emerald" && "bg-emerald/5 dark:bg-emerald/10 border-emerald/20",
                  color === "gold" && "bg-gold/5 dark:bg-gold/10 border-gold/20",
                  color === "accent" && "bg-accent/5 dark:bg-accent/10 border-accent/20"
                )}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                  {lang === "ar" ? d.label_ar : d.label_en}
                </p>
                <div className={cn(
                  "font-amiri",
                  color === "emerald" && "text-emerald",
                  color === "gold" && "text-gold-dark dark:text-gold",
                  color === "accent" && "text-accent"
                )}>
                  <div className="text-4xl font-bold">{d.value}<span className="text-2xl">{d.unit}</span></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">${d.unit === "B" ? "Billion USD" : "Thousand USD"}</p>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* KPIs GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {DATA.kpis.map((kpi: any, i: number) => (
          <Card key={i} delay={i * 80} className="p-4 text-center">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {lang === "ar" ? kpi.label_ar : kpi.label_en}
            </p>
            <div className="text-2xl font-bold text-emerald dark:text-gold font-amiri">{kpi.value}</div>
            <p className="text-[10px] text-gray-400 mt-1">{kpi.unit}</p>
          </Card>
        ))}
      </div>

      {/* INVESTMENT READINESS CHECKLIST */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-emerald" />
            <h3 className="text-lg font-bold text-emerald dark:text-gold">
              {lang === "ar" ? "جاهزية الاستثمار" : "Investment Readiness"}
            </h3>
          </div>
          <Badge color="green">{readinessCount}/{totalCount}</Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>{lang === "ar" ? "التقدم" : "Progress"}</span>
            <span>{Math.round((readinessCount/totalCount)*100)}%</span>
          </div>
          <div className="h-3 bg-muted dark:bg-dark-muted rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(readinessCount/totalCount)*100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-l from-emerald to-gold rounded-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DATA.checklists.investorReady.map((item: any, i: number) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.05 }} 
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 dark:bg-dark-muted/50 hover:bg-muted dark:hover:bg-dark-muted transition-colors"
            >
              <CheckCircle2 
                size={18} 
                className={item.done ? "text-emerald shrink-0" : "text-gray-300 shrink-0"} 
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {lang === "ar" ? item.label_ar : item.label_en}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* FOUNDER PREVIEW */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald to-emerald-dark flex items-center justify-center text-white text-3xl font-amiri font-bold shadow-lg shrink-0">
            {DATA.company.founder.name[0]}
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-emerald/10 px-3 py-1 rounded-full mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald" />
              <span className="text-xs font-semibold text-emerald">{lang === "ar" ? "المؤسس التشغيلي" : "Operational Founder"}</span>
            </div>
            <h3 className="text-xl font-bold text-emerald dark:text-gold font-amiri">
              {lang === "ar" ? DATA.company.founder.name : DATA.company.founder.name_en}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
              {lang === "ar" ? DATA.company.founder.bio_ar : DATA.company.founder.bio_en}
            </p>
            <button 
              onClick={() => setTab("team")}
              className="text-sm text-accent hover:text-orange-600 font-semibold mt-2 inline-flex items-center gap-1"
            >
              {lang === "ar" ? "عرض الملف الكامل →" : "View full profile →"}
            </button>
          </div>
        </div>
      </Card>

      {/* QUICK NAV BUTTONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { tab: "financials", label_ar: "النمذجة المالية", label_en: "Financial Model", icon: Wallet, color: "emerald" },
          { tab: "business-plan", label_ar: "خطة العمل", label_en: "Business Plan", icon: FileText, color: "gold" },
          { tab: "sectors", label_ar: "القطاعات", label_en: "Sectors", icon: Target, color: "accent" },
          { tab: "the-ask", label_ar: "طلب الاستثمار", label_en: "The Ask", icon: FileCheck, color: "emerald" },
        ].map((nav, i) => (
          <motion.button
            key={i}
            whileHover={{ y: -4 }}
            onClick={() => setTab(nav.tab as any)}
            className={cn(
              "p-4 rounded-2xl border shadow-card hover:shadow-elevated transition-all text-center group",
              nav.color === "emerald" && "bg-emerald/5 border-emerald/20 hover:border-emerald/40",
              nav.color === "gold" && "bg-gold/5 border-gold/20 hover:border-gold/40",
              nav.color === "accent" && "bg-accent/5 border-accent/20 hover:border-accent/40"
            )}
          >
            <nav.icon size={24} className={cn(
              "mx-auto mb-2 transition-colors",
              nav.color === "emerald" && "text-emerald",
              nav.color === "gold" && "text-gold-dark dark:text-gold",
              nav.color === "accent" && "text-accent"
            )} />
            <div className="font-bold text-sm text-foreground">
              {lang === "ar" ? nav.label_ar : nav.label_en}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}


function FinancialsView({ fin, setFin, ltv, ltvCac, payback, be, projectionData, t, lang }: any) {
  const mrr12 = Math.round(fin.arpu * (fin.newCust * 12 * 0.8));
  const mrr36 = Math.round(fin.arpu * (fin.newCust * 36 * 0.6));

  const FinSlider = ({ label, value, min, max, step, unit, onChange }: any) => (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-300 group-hover:text-gold transition-colors">{label}</span>
        <span className="text-sm font-bold text-gold tabular-nums">{typeof value === "number" ? value.toLocaleString() : value} {unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full" />
    </div>
  );

  const MetricCard = ({ label, value, highlight }: any) => (
    <motion.div whileHover={{ scale: 1.03 }} className={cn("p-4 rounded-xl text-center transition-all duration-300", highlight ? "bg-gradient-to-br from-gold/20 to-accent/10 border border-gold/30 shadow-glow-gold" : "bg-white/5 border border-white/10 hover:border-white/20")}>
      <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{label}</div>
      <div className={cn("text-xl font-bold tabular-nums", highlight ? "text-gradient-gold" : "text-white")}>{value}</div>
    </motion.div>
  );

  const unitColorMap: Record<string, string> = {
    emerald: "text-emerald bg-emerald/10 border-emerald/20",
    gold: "text-gold-dark dark:text-gold bg-gold/10 border-gold/20",
    accent: "text-accent bg-accent/10 border-accent/20",
    red: "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  };

  return (
    <div className="space-y-8">
      <SectionHeader icon={Wallet} title={lang === "ar" ? "النمذجة المالية التفاعلية" : "Interactive Financial Model"} subtitle={lang === "ar" ? "حرّك المؤشرات وشاهد التأثير الفوري على الرسوم والمخرجات" : "Move sliders and see instant impact on charts and outputs"} />

      <Card className="p-8 overflow-hidden relative" hover={false}>
        <div className="absolute inset-0 bg-dark-bg dark:bg-black noise" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 text-white">
          <div className="space-y-6">
            <FinSlider label={lang === "ar" ? "ARPU / Setup Value" : "ARPU / Setup Value"} value={fin.arpu} min={500} max={5000} step={100} unit="SAR" onChange={(v: number) => setFin({ ...fin, arpu: v })} />
            <FinSlider label={lang === "ar" ? "Churn Rate" : "Churn Rate"} value={fin.churn} min={1} max={20} step={1} unit="%" onChange={(v: number) => setFin({ ...fin, churn: v })} />
            <FinSlider label="CAC" value={fin.cac} min={500} max={5000} step={100} unit="SAR" onChange={(v: number) => setFin({ ...fin, cac: v })} />
            <FinSlider label={lang === "ar" ? "New Customers / month" : "New Customers / month"} value={fin.newCust} min={1} max={10} step={0.1} unit="" onChange={(v: number) => setFin({ ...fin, newCust: v })} />
            <FinSlider label={lang === "ar" ? "Margin" : "Margin"} value={fin.margin} min={50} max={90} step={5} unit="%" onChange={(v: number) => setFin({ ...fin, margin: v })} />
            <FinSlider label={lang === "ar" ? "Fixed Costs" : "Fixed Costs"} value={fin.fixed} min={1000} max={10000} step={500} unit="SAR" onChange={(v: number) => setFin({ ...fin, fixed: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3 content-start">
            <MetricCard label="LTV" value={`${Math.round(ltv).toLocaleString()} SAR`} />
            <MetricCard label="LTV:CAC" value={`${ltvCac.toFixed(1)}x`} highlight />
            <MetricCard label={lang === "ar" ? "CAC Payback" : "CAC Payback"} value={`${payback.toFixed(1)} ${lang === "ar" ? "شهر" : "mo"}`} />
            <MetricCard label={lang === "ar" ? "Break-even" : "Break-even"} value={`${lang === "ar" ? "شهر" : "Mo"} ${be > 0 && be < 36 ? be : ">36"}`} highlight />
            <MetricCard label={lang === "ar" ? "MRR Month 12" : "MRR Month 12"} value={`${mrr12.toLocaleString()} SAR`} />
            <MetricCard label={lang === "ar" ? "MRR Month 36" : "MRR Month 36"} value={`${mrr36.toLocaleString()} SAR`} highlight />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={18} className="text-emerald dark:text-gold" />
            <h3 className="text-lg font-bold text-emerald dark:text-gold">
              {lang === "ar" ? `توزيع الأموال ($${DATA.financials.useOfFunds.total.toLocaleString()})` : `Use of Funds ($${DATA.financials.useOfFunds.total.toLocaleString()})`}
            </h3>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={DATA.financials.useOfFunds.breakdown.map((b: any) => ({ name: lang === "ar" ? b.category_ar : b.category_en, value: b.percentage }))} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value">
                    {DATA.financials.useOfFunds.breakdown.map((_: any, i: number) => (
                      <Cell key={i} fill={["#0F5132", "#D4AF37", "#F97316", "#6B7280", "#1a7a4c", "#b8962e", "#dc2626", "#3b82f6"][i % 8]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2">
              {DATA.financials.useOfFunds.breakdown.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 bg-muted/30 dark:bg-dark-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="font-semibold">{lang === "ar" ? item.category_ar : item.category_en}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{item.percentage}%</span>
                    <span className="font-bold text-emerald dark:text-gold">${item.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-emerald dark:text-gold" />
            <h3 className="text-lg font-bold text-emerald dark:text-gold">
              {lang === "ar" ? "توزيع مصادر الإيراد (Y1)" : "Revenue Streams (Y1)"}
            </h3>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={DATA.financials.revenueStreams.map((r: any) => ({ name: lang === "ar" ? r.name_ar : r.name_en, value: r.percentage }))} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value">
                    {DATA.financials.revenueStreams.map((r: any, i: number) => (
                      <Cell key={i} fill={r.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2">
              {DATA.financials.revenueStreams.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 bg-muted/30 dark:bg-dark-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold">{lang === "ar" ? item.name_ar : item.name_en}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{item.percentage}%</span>
                    <span className="font-bold text-emerald dark:text-gold">SAR {item.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-emerald dark:text-gold" />
          <h3 className="text-lg font-bold text-emerald dark:text-gold">
            {lang === "ar" ? "اقتصاديات الوحدة" : "Unit Economics"}
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {DATA.financials.unitEconomics.map((item: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className={cn("p-4 rounded-xl border text-center", unitColorMap[item.color] || unitColorMap.emerald)}>
              <div className="text-[10px] uppercase tracking-wider opacity-70 mb-1">{lang === "ar" ? item.metric_ar : item.metric_en}</div>
              <div className="text-lg font-bold font-amiri">{item.value}</div>
            </motion.div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} className="text-emerald dark:text-gold" />
          <h3 className="text-lg font-bold text-emerald dark:text-gold">
            {lang === "ar" ? "مقارنة السيناريوهات" : "Scenarios Comparison"}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DATA.financials.scenarios.map((s: any, i: number) => {
            const isBase = s.name_en.includes("Base");
            return (
              <motion.div key={i} whileHover={{ scale: 1.02 }} className={cn("p-5 rounded-xl border-2 transition-all", isBase ? "bg-gradient-to-br from-emerald/10 to-gold/10 border-emerald shadow-elevated" : "bg-muted/30 dark:bg-dark-muted/30 border-border")}>
                {isBase && (
                  <div className="inline-block px-2 py-0.5 bg-emerald text-white text-[10px] font-bold rounded-full mb-2 uppercase">
                    {lang === "ar" ? "المتوقع" : "Expected"}
                  </div>
                )}
                <h4 className="text-lg font-bold text-emerald dark:text-gold font-amiri mb-1">
                  {lang === "ar" ? s.name_ar : s.name_en}
                </h4>
                <div className="text-xs text-gray-500 mb-4">
                  {lang === "ar" ? "احتمال" : "Probability"}: <span className="font-bold">{s.probability}%</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-card dark:bg-dark-card rounded-lg">
                    <span className="text-gray-500 text-xs">{lang === "ar" ? "عملاء Y1" : "Clients Y1"}</span>
                    <span className="font-bold">{s.clients_y1}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-card dark:bg-dark-card rounded-lg">
                    <span className="text-gray-500 text-xs">{lang === "ar" ? "عملاء Y3" : "Clients Y3"}</span>
                    <span className="font-bold">{s.clients_y3}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-card dark:bg-dark-card rounded-lg">
                    <span className="text-gray-500 text-xs">MRR Y1</span>
                    <span className="font-bold text-emerald">SAR {s.mrr_y1.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-card dark:bg-dark-card rounded-lg">
                    <span className="text-gray-500 text-xs">MRR Y3</span>
                    <span className="font-bold text-gold">SAR {s.mrr_y3.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-emerald/10 dark:bg-emerald/20 rounded-lg border border-emerald/30">
                    <span className="text-xs font-semibold">{lang === "ar" ? "إيراد Y3" : "Revenue Y3"}</span>
                    <span className="font-bold text-emerald dark:text-gold">SAR {s.revenue_y3.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={18} className="text-emerald dark:text-gold" />
          <h3 className="text-lg font-bold text-emerald dark:text-gold">
            {lang === "ar" ? "التدفق النقدي (12 شهراً)" : "12-Month Cash Flow"}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-emerald text-white">
              <tr>
                <th className="p-3 text-right">{lang === "ar" ? "الشهر" : "Month"}</th>
                <th className="p-3 text-right">{lang === "ar" ? "الإيراد" : "Revenue"}</th>
                <th className="p-3 text-right">{lang === "ar" ? "التكاليف" : "Costs"}</th>
                <th className="p-3 text-right">{lang === "ar" ? "الربح" : "Profit"}</th>
                <th className="p-3 text-right">{lang === "ar" ? "التراكمي" : "Cumulative"}</th>
              </tr>
            </thead>
            <tbody>
              {DATA.financials.cashFlow.map((row: any, i: number) => (
                <tr key={i} className={cn("border-b border-border/50 dark:border-dark-border/50 hover:bg-muted/20 transition-colors", row.cumulative > 0 && "bg-emerald/5 dark:bg-emerald/10")}>
                  <td className="p-3 font-bold text-emerald dark:text-gold">{row.month}</td>
                  <td className="p-3">SAR {row.revenue.toLocaleString()}</td>
                  <td className="p-3 text-red-600">SAR {row.costs.toLocaleString()}</td>
                  <td className={cn("p-3 font-bold", row.profit >= 0 ? "text-emerald" : "text-red-600")}>SAR {row.profit.toLocaleString()}</td>
                  <td className={cn("p-3 font-bold", row.cumulative >= 0 ? "text-gold-dark dark:text-gold" : "text-red-600")}>
                    SAR {row.cumulative.toLocaleString()}
                    {i === 2 && row.cumulative > 0 && (
                      <span className="ml-2 text-[9px] bg-gold/20 text-gold-dark dark:text-gold px-1.5 py-0.5 rounded-full font-bold">
                        {lang === "ar" ? "تعادل!" : "Break-even!"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-emerald/5 to-gold/5 border-emerald/20">
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-emerald" />
          <h3 className="text-lg font-bold text-emerald dark:text-gold">
            {lang === "ar" ? `تحليل نقطة التعادل - الشهر ${DATA.financials.breakEven.month}` : `Break-even Analysis - Month ${DATA.financials.breakEven.month}`}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-border text-center">
            <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "التكاليف الثابتة" : "Fixed Costs"}</div>
            <div className="text-xl font-bold text-emerald">SAR {DATA.financials.breakEven.fixed_costs.toLocaleString()}</div>
          </div>
          <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-border text-center">
            <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "هامش المساهمة" : "Contribution Margin"}</div>
            <div className="text-xl font-bold text-gold-dark dark:text-gold">SAR {DATA.financials.breakEven.contribution_margin.toLocaleString()}</div>
          </div>
          <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-emerald/30 text-center">
            <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "شهر التعادل" : "Break-even Month"}</div>
            <div className="text-3xl font-bold text-emerald font-amiri">{DATA.financials.breakEven.month}</div>
          </div>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {lang === "ar" ? DATA.financials.breakEven.description_ar : DATA.financials.breakEven.description_en}
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-emerald dark:text-gold" />
          <h3 className="text-lg font-bold text-emerald dark:text-gold">
            {lang === "ar" ? "نمو الإيراد الشهري المتكرر" : "MRR Growth"} (36 {lang === "ar" ? "شهراً" : "months"})
          </h3>
        </div>
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
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-emerald dark:text-gold" />
          <h3 className="text-lg font-bold text-emerald dark:text-gold">
            {lang === "ar" ? "الربحية الشهرية" : "Monthly Profitability"}
          </h3>
        </div>
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
        <div className="p-4 border-b border-border dark:border-dark-border bg-muted/30 dark:bg-dark-muted/30">
          <h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2">
            <FileText size={16} /> {lang === "ar" ? "قائمة الأرباح والخسائر" : "P&L Statement"}
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-emerald text-white">
            <tr>
              <th className="p-3 text-right">{lang === "ar" ? "البند" : "Item"}</th>
              <th className="p-3 text-right">Y1</th>
              <th className="p-3 text-right">Y2</th>
              <th className="p-3 text-right">Y3</th>
            </tr>
          </thead>
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
  const [selectedPhase, setSelectedPhase] = useState<any>(null);
  
  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Map} 
        title={lang === "ar" ? "رحلة المشروع" : "Project Roadmap"} 
        subtitle={lang === "ar" ? "خريطة طريق تفاعلية من الفكرة إلى القيادة الإقليمية (2026-2028)" : "Interactive roadmap from idea to regional leadership (2026-2028)"} 
      />

      {/* Timeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-5 text-center">
          <div className="text-3xl font-bold text-emerald font-amiri">36</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">{lang === "ar" ? "شهر" : "Months"}</div>
        </Card>
        <Card className="p-5 text-center">
          <div className="text-3xl font-bold text-gold-dark dark:text-gold font-amiri">6</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">{lang === "ar" ? "مراحل رئيسية" : "Key Phases"}</div>
        </Card>
        <Card className="p-5 text-center">
          <div className="text-3xl font-bold text-accent font-amiri">80+</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">{lang === "ar" ? "عميل مستهدف" : "Target Clients"}</div>
        </Card>
        <Card className="p-5 text-center">
          <div className="text-3xl font-bold text-emerald font-amiri">250K</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">MRR {lang === "ar" ? "شهري" : "Monthly"}</div>
        </Card>
      </div>

      {/* Interactive Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald via-gold to-accent hidden md:block" />
        
        <div className="space-y-4">
          {DATA.roadmap.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: lang === "ar" ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute left-6 w-4 h-4 rounded-full bg-gradient-to-br from-emerald to-gold border-4 border-background dark:border-dark-bg shadow-lg hidden md:block z-10" />
              
              {/* Card */}
              <Card 
                className={cn(
                  "ml-0 md:ml-16 p-6 cursor-pointer transition-all hover:shadow-elevated",
                  selectedPhase === item && "ring-2 ring-emerald shadow-elevated"
                )}
                onClick={() => setSelectedPhase(selectedPhase === item ? null : item)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{item.phase_ar.slice(0, 2)}</div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald dark:text-gold font-amiri">
                        {lang === "ar" ? item.phase_ar : item.phase_en}
                      </h3>
                      <Badge color="gold">{lang === "ar" ? item.date_ar : item.date_en}</Badge>
                    </div>
                  </div>
                  <ChevronDown 
                    size={20} 
                    className={cn(
                      "text-gray-400 transition-transform duration-300",
                      selectedPhase === item && "rotate-180 text-accent"
                    )} 
                  />
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {lang === "ar" ? item.desc_ar : item.desc_en}
                </p>

                {/* Expanded details */}
                {selectedPhase === item && item.details && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-border/50"
                  >
                    <h4 className="font-bold text-emerald dark:text-gold mb-2">
                      {lang === "ar" ? "التفاصيل:" : "Details:"}
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {item.details.map((detail: string, j: number) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-emerald mt-0.5 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                    {item.kpis && (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {item.kpis.map((kpi: any, k: number) => (
                          <div key={k} className="bg-muted/50 dark:bg-dark-muted/50 p-3 rounded-lg">
                            <div className="text-xs text-gray-500">{kpi.label}</div>
                            <div className="font-bold text-emerald dark:text-gold">{kpi.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
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
        subtitle={lang === "ar" ? "سجل مخاطر شامل - اضغط على أي مخاطرة لعرض التفاصيل الكاملة وخطة التخفيف" : "Comprehensive risk register - click any risk to see full details and mitigation plan"} 
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

      {/* Risks grouped by category - EXPANDABLE */}
      {Object.entries(risksByCategory).map(([cat, risks]) => (
        <div key={cat} className="space-y-3">
          <div className="bg-emerald text-white p-4 rounded-t-2xl">
            <h3 className="font-bold flex items-center gap-2">
              <AlertTriangle size={18} />
              {lang === "ar" ? (risks[0].category_ar || cat) : cat} ({risks.length})
            </h3>
          </div>
          
          <div className="space-y-2">
            {risks.map((r: any, i: number) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-card dark:bg-dark-card rounded-xl border border-border shadow-card overflow-hidden open:shadow-elevated open:border-emerald/30"
              >
                <summary className="p-5 cursor-pointer flex justify-between items-center select-none hover:bg-muted/50 dark:hover:bg-dark-muted/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald to-emerald-dark text-white flex items-center justify-center text-sm font-bold font-amiri shadow-md shrink-0">
                      {String(DATA.risks.indexOf(r) + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-emerald dark:text-gold mb-1 truncate">
                        {lang === "ar" ? r.name_ar : r.name_en}
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                        <Badge color={r.prob === "high" ? "red" : r.prob === "medium" ? "yellow" : "green"}>
                          {lang === "ar" ? (r.prob === "high" ? "احتمال عالي" : r.prob === "medium" ? "احتمال متوسط" : "احتمال منخفض") : `${r.prob} prob`}
                        </Badge>
                        <Badge color={r.impact === "high" ? "red" : r.impact === "medium" ? "yellow" : "green"}>
                          {lang === "ar" ? `أثر ${r.impact === "high" ? "عالي" : r.impact === "medium" ? "متوسط" : "منخفض"}` : `${r.impact} impact`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <ChevronDown size={20} className="text-gray-400 transition-transform duration-300 group-open:rotate-180 text-accent shrink-0" />
                </summary>
                
                <div className="details-content px-5 pb-5 pt-0">
                  <div className="border-t border-border/50 dark:border-dark-border/50 pt-4 space-y-4">
                    
                    {/* Risk Description */}
                    <div>
                      <h5 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">
                        {lang === "ar" ? "الوصف" : "Description"}
                      </h5>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {lang === "ar" 
                          ? `هذه المخاطرة تتعلق بـ ${r.name_ar}. يمكن أن تحدث بسبب ${r.prob === "high" ? "عوامل متعددة وشائعة" : r.prob === "medium" ? "عوامل متوسطة الاحتمال" : "عوامل نادرة"}.`
                          : `This risk relates to ${r.name_en}. It may occur due to ${r.prob === "high" ? "multiple common factors" : r.prob === "medium" ? "moderate probability factors" : "rare factors"}.`}
                      </p>
                    </div>

                    {/* Mitigation Plan */}
                    <div className="bg-gradient-to-br from-emerald/5 to-gold/5 dark:from-emerald/10 dark:to-gold/10 p-4 rounded-xl border border-emerald/20">
                      <h5 className="text-xs uppercase tracking-wider text-emerald mb-2 font-bold flex items-center gap-2">
                        <ShieldCheck size={14} />
                        {lang === "ar" ? "خطة التخفيف" : "Mitigation Plan"}
                      </h5>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {lang === "ar" ? r.mitigation_ar : r.mitigation_en}
                      </p>
                    </div>

                    {/* Impact Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-muted/30 dark:bg-dark-muted/30 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "التأثير المالي" : "Financial Impact"}</div>
                        <div className="font-bold text-sm">
                          {r.impact === "high" 
                            ? (lang === "ar" ? "عالي (>50K SAR)" : "High (>50K SAR)")
                            : r.impact === "medium"
                            ? (lang === "ar" ? "متوسط (10-50K SAR)" : "Medium (10-50K SAR)")
                            : (lang === "ar" ? "منخفض (<10K SAR)" : "Low (<10K SAR)")
                          }
                        </div>
                      </div>
                      <div className="bg-muted/30 dark:bg-dark-muted/30 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "التأثير التشغيلي" : "Operational Impact"}</div>
                        <div className="font-bold text-sm">
                          {r.impact === "high" 
                            ? (lang === "ar" ? "تعطيل كبير" : "Major Disruption")
                            : r.impact === "medium"
                            ? (lang === "ar" ? "تأخير متوسط" : "Moderate Delay")
                            : (lang === "ar" ? "تأثير محدود" : "Limited Impact")
                          }
                        </div>
                      </div>
                      <div className="bg-muted/30 dark:bg-dark-muted/30 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "المسؤول" : "Owner"}</div>
                        <div className="font-bold text-sm">
                          {lang === "ar" ? "المؤسس + د.سين" : "Founder + Dr. Seen"}
                        </div>
                      </div>
                    </div>

                    {/* Action Steps */}
                    <div>
                      <h5 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">
                        {lang === "ar" ? "خطوات العمل" : "Action Steps"}
                      </h5>
                      <div className="space-y-2">
                        {[1, 2, 3].map((step) => (
                          <div key={step} className="flex items-start gap-3 p-2 bg-muted/20 dark:bg-dark-muted/20 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-emerald/10 flex items-center justify-center text-emerald text-xs font-bold shrink-0">
                              {step}
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              {lang === "ar" 
                                ? `خطوة ${step}: ${step === 1 ? "مراقبة مستمرة وكشف مبكر" : step === 2 ? "تطبيق خطة التخفيف فوراً" : "توثيق الدروس المستفادة وتحديث البروتوكول"}`
                                : `Step ${step}: ${step === 1 ? "Continuous monitoring and early detection" : step === 2 ? "Apply mitigation plan immediately" : "Document lessons learned and update protocol"}`
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


function HardwareView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Cpu} 
        title={lang === "ar" ? "محطة العمل المقترحة" : "Recommended Workstation"} 
        subtitle={lang === "ar" ? "تجميعة كاملة مدروسة لتشغيل نماذج AI محلياً (7B-120B) ضمن ميزانية 12,000$" : "Complete setup for running AI models locally (7B-120B) within $12,000 budget"} 
      />

      {/* Recommended Scenario - HERO */}
      <Card className="p-8 overflow-hidden relative" hover={false}>
        <div className="absolute inset-0 bg-gradient-to-l from-emerald via-emerald-dark to-emerald noise" />
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gold/20 backdrop-blur-sm flex items-center justify-center border border-gold/30">
              <Server size={28} className="text-gold" />
            </div>
            <div>
              <div className="text-xs text-gold-light uppercase tracking-widest">✅ {lang === "ar" ? "التجميعة المختارة" : "Selected Build"}</div>
              <h3 className="text-2xl font-bold text-gold font-amiri">{lang === "ar" ? DATA.hardware.scenario.name_ar : DATA.hardware.scenario.name_en}</h3>
              <p className="text-sm text-white/70">{lang === "ar" ? "الأفضل لتشغيل نماذج 70B-120B محلياً" : "Best for running 70B-120B models locally"}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Laptop with image */}
            <div className="bg-white/10 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=250&fit=crop" 
                alt="HP ZBook Ultra"
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <div className="text-xs text-gray-300 mb-2 uppercase tracking-wider">💻 {lang === "ar" ? "اللابتوب" : "Laptop"}</div>
                <div className="font-bold text-sm mb-2 leading-relaxed">{DATA.hardware.scenario.laptop}</div>
                <div className="text-gold font-bold text-xl">${DATA.hardware.scenario.laptop_price.toLocaleString()}</div>
              </div>
            </div>
            
            {/* Mini PC with image */}
            <div className="bg-white/10 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=250&fit=crop" 
                alt="Minisforum MS-S1 Max"
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <div className="text-xs text-gray-300 mb-2 uppercase tracking-wider">🖥️ Mini PC</div>
                <div className="font-bold text-sm mb-2 leading-relaxed">{DATA.hardware.scenario.minipc}</div>
                <div className="text-gold font-bold text-xl">${DATA.hardware.scenario.minipc_price.toLocaleString()}</div>
              </div>
            </div>
            
            {/* Accessories with image */}
            <div className="bg-white/10 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=250&fit=crop" 
                alt="Accessories"
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <div className="text-xs text-gray-300 mb-2 uppercase tracking-wider">🔌 {lang === "ar" ? "الإكسسوارات" : "Accessories"}</div>
                <div className="font-bold text-sm mb-2 leading-relaxed">{lang === "ar" ? DATA.hardware.scenario.accessories : DATA.hardware.scenario.accessories_en}</div>
                <div className="text-gold font-bold text-xl">${DATA.hardware.scenario.accessories_price.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-gold/20 border border-gold/30 rounded-xl p-5">
            <div className="text-center">
              <div className="text-xs text-gold-light uppercase tracking-wider">{lang === "ar" ? "الإجمالي" : "Total"}</div>
              <div className="text-3xl font-bold text-gold font-amiri">${DATA.hardware.scenario.total.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-300 uppercase tracking-wider">{lang === "ar" ? "المتبقي" : "Remaining"}</div>
              <div className="text-xl font-bold text-white">${DATA.hardware.scenario.remaining.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-300 uppercase tracking-wider">{lang === "ar" ? "الميزانية" : "Budget"}</div>
              <div className="text-xl font-bold text-white/70">${DATA.hardware.scenario.budget.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Laptop Categories - EXPANDABLE CARDS */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border dark:border-dark-border bg-gradient-to-l from-emerald/5 to-transparent">
          <h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2 text-lg">
            <Cpu size={20} /> {lang === "ar" ? "فئات اللابتوب (5 فئات)" : "Laptop Categories (5)"}
          </h3>
        </div>
        <div className="divide-y divide-border dark:divide-dark-border">
          {DATA.hardware.laptops.map((l: any, i: number) => (
            <motion.details
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "group",
                l.category.includes("⭐") && "bg-gradient-to-l from-gold/5 to-transparent"
              )}
            >
              <summary className="p-5 cursor-pointer flex justify-between items-center select-none hover:bg-muted/30 dark:hover:bg-dark-muted/30 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <img 
                    src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop" 
                    alt={l.category}
                    className="w-16 h-16 rounded-lg object-cover border-2 border-border"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-emerald dark:text-gold mb-1 flex items-center gap-2">
                      {l.category}
                      {l.category.includes("⭐") && <span className="text-gold">⭐ {lang === "ar" ? "موصى به" : "Recommended"}</span>}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{l.specs}</p>
                    <div className="flex gap-3 text-xs">
                      <span className="text-accent font-bold">{l.price}</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-600 dark:text-gray-400">{lang === "ar" ? "قدرة AI" : "AI Capacity"}: {l.ai}</span>
                    </div>
                  </div>
                </div>
                <ChevronDown size={20} className="text-gray-400 transition-transform duration-300 group-open:rotate-180 text-accent shrink-0" />
              </summary>
              
              <div className="details-content px-5 pb-5 pt-0">
                <div className="border-t border-border/50 dark:border-dark-border/50 pt-4 grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 dark:bg-dark-muted/30 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "المعالج" : "CPU"}</div>
                    <div className="font-bold text-sm">{l.specs.split(',')[0]}</div>
                  </div>
                  <div className="bg-muted/30 dark:bg-dark-muted/30 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "الذاكرة" : "RAM"}</div>
                    <div className="font-bold text-sm">{l.specs.split(',')[1] || "N/A"}</div>
                  </div>
                  <div className="bg-muted/30 dark:bg-dark-muted/30 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "السعر" : "Price"}</div>
                    <div className="font-bold text-sm text-accent">{l.price}</div>
                  </div>
                  <div className="bg-muted/30 dark:bg-dark-muted/30 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "قدرة AI" : "AI Capacity"}</div>
                    <div className="font-bold text-sm text-emerald">{l.ai}</div>
                  </div>
                </div>
              </div>
            </motion.details>
          ))}
        </div>
      </Card>

      {/* Mini PC Categories - EXPANDABLE CARDS */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border dark:border-dark-border bg-gradient-to-l from-gold/5 to-transparent">
          <h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2 text-lg">
            <Layers size={20} /> {lang === "ar" ? "فئات Mini PC (5 فئات)" : "Mini PC Categories (5)"}
          </h3>
        </div>
        <div className="divide-y divide-border dark:divide-dark-border">
          {DATA.hardware.minipc.map((l: any, i: number) => (
            <motion.details
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <summary className="p-5 cursor-pointer flex justify-between items-center select-none hover:bg-muted/30 dark:hover:bg-dark-muted/30 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <img 
                    src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=100&h=100&fit=crop" 
                    alt={l.category}
                    className="w-16 h-16 rounded-lg object-cover border-2 border-border"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-emerald dark:text-gold mb-1">{l.category}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{l.specs}</p>
                    <div className="text-xs text-accent font-bold">{l.price}</div>
                  </div>
                </div>
                <ChevronDown size={20} className="text-gray-400 transition-transform duration-300 group-open:rotate-180 text-accent shrink-0" />
              </summary>
              
              <div className="details-content px-5 pb-5 pt-0">
                <div className="border-t border-border/50 dark:border-dark-border/50 pt-4 grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 dark:bg-dark-muted/30 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "المعالج" : "CPU"}</div>
                    <div className="font-bold text-sm">{l.specs.split(',')[0]}</div>
                  </div>
                  <div className="bg-muted/30 dark:bg-dark-muted/30 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "الذاكرة" : "RAM"}</div>
                    <div className="font-bold text-sm">{l.specs.split(',')[1] || "N/A"}</div>
                  </div>
                  <div className="bg-muted/30 dark:bg-dark-muted/30 p-3 rounded-lg col-span-2">
                    <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "السعر" : "Price"}</div>
                    <div className="font-bold text-sm text-accent">{l.price}</div>
                  </div>
                </div>
              </div>
            </motion.details>
          ))}
        </div>
      </Card>

      {/* Why Unified Memory */}
      <Card className="p-6 bg-gradient-to-br from-emerald/5 to-gold/5 dark:from-emerald/10 dark:to-gold/10 border-emerald/20">
        <h3 className="text-lg font-bold text-emerald dark:text-gold mb-4 flex items-center gap-2">
          <Zap size={20} />
          {lang === "ar" ? "لماذا Unified Memory؟" : "Why Unified Memory?"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-border">
            <div className="text-3xl mb-2">🚀</div>
            <div className="font-bold text-emerald dark:text-gold mb-1">{lang === "ar" ? "نماذج 120B" : "120B Models"}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{lang === "ar" ? "تشغيل نماذج ضخمة بكفاءة عالية بدون GPU منفصل" : "Run massive models efficiently without separate GPU"}</p>
          </div>
          <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-border">
            <div className="text-3xl mb-2">💰</div>
            <div className="font-bold text-emerald dark:text-gold mb-1">{lang === "ar" ? "توفير كبير" : "Major Savings"}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{lang === "ar" ? "بدلاً من شراء GPU بقيمة 10K+، نحصل على أداء مشابه بـ 3-4K" : "Instead of $10K+ GPU, get similar performance for $3-4K"}</p>
          </div>
          <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-border">
            <div className="text-3xl mb-2">🔒</div>
            <div className="font-bold text-emerald dark:text-gold mb-1">{lang === "ar" ? "خصوصية تامة" : "Full Privacy"}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{lang === "ar" ? "تشغيل محلي 100% بدون إرسال بيانات للسحابة" : "100% local execution without sending data to cloud"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}


function TheAskView({ slideIdx, setSlideIdx, t, lang }: any) {
  // Enhanced slide designs with backgrounds, icons, and better layout
  const slideDesigns = [
    { bg: "from-emerald via-emerald-dark to-emerald", icon: "🏢", accent: "gold" },      // Cover
    { bg: "from-red-900 via-red-800 to-red-900", icon: "⚠️", accent: "white" },        // Problem
    { bg: "from-emerald via-emerald-dark to-gold", icon: "💡", accent: "gold" },        // Solution
    { bg: "from-blue-900 via-blue-800 to-blue-900", icon: "🚀", accent: "gold" },      // Why Now
    { bg: "from-purple-900 via-purple-800 to-emerald", icon: "📊", accent: "gold" },   // Market
    { bg: "from-gold-dark via-gold to-amber-600", icon: "💰", accent: "white" },       // Model
    { bg: "from-emerald-dark via-emerald to-gold", icon: "✅", accent: "white" },      // Readiness
    { bg: "from-slate-900 via-slate-800 to-emerald", icon: "🎯", accent: "gold" },     // Competitors
    { bg: "from-gold via-amber-500 to-emerald", icon: "⭐", accent: "white" },         // Edge
    { bg: "from-blue-900 via-indigo-800 to-purple-900", icon: "📈", accent: "gold" },  // GTM
    { bg: "from-emerald via-emerald-dark to-slate-900", icon: "👥", accent: "gold" },  // Team
    { bg: "from-gold-dark via-gold to-emerald", icon: "📊", accent: "white" },         // Financials
    { bg: "from-emerald via-emerald-dark to-gold", icon: "💎", accent: "gold" },       // Ask
    { bg: "from-slate-900 via-emerald-dark to-gold", icon: "🌟", accent: "gold" },     // Vision
  ];

  const currentSlide = DATA.pitchSlides[slideIdx];
  const currentDesign = slideDesigns[slideIdx];
  const lines = (lang === "ar" ? currentSlide.content_ar : currentSlide.content_en).split("\n").filter((l: string) => l.trim());

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={FileCheck} 
        title={lang === "ar" ? "طلب الاستثمار" : "The Ask"} 
        subtitle={lang === "ar" ? "عرض تقديمي احترافي من 14 شريحة" : "Professional 14-slide pitch deck"} 
      />

      {/* Main Slide Deck */}
      <Card className="overflow-hidden" hover={false}>
        <div className="p-4 border-b border-border dark:border-dark-border flex justify-between items-center bg-muted/30 dark:bg-dark-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald font-bold text-sm">
              {slideIdx + 1}
            </div>
            <div>
              <h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2">
                <Eye size={16} /> Pitch Deck
              </h3>
              <p className="text-xs text-gray-500">{DATA.pitchSlides.length} {lang === "ar" ? "شريحة" : "slides"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSlideIdx(Math.max(0, slideIdx - 1))} 
              disabled={slideIdx === 0}
              className="p-2 rounded-lg hover:bg-muted dark:hover:bg-dark-muted disabled:opacity-30 transition-all"
            >
              <SkipBack size={16} />
            </button>
            <span className="text-xs font-mono text-gray-500 min-w-[50px] text-center">
              {slideIdx + 1}/{DATA.pitchSlides.length}
            </span>
            <button 
              onClick={() => setSlideIdx(Math.min(DATA.pitchSlides.length - 1, slideIdx + 1))} 
              disabled={slideIdx === DATA.pitchSlides.length - 1}
              className="p-2 rounded-lg hover:bg-muted dark:hover:bg-dark-muted disabled:opacity-30 transition-all"
            >
              <SkipForward size={16} />
            </button>
          </div>
        </div>

        {/* Slide Display */}
        <div 
          className={cn(
            "relative min-h-[500px] flex flex-col items-center justify-center p-10 overflow-hidden bg-gradient-to-br",
            currentDesign.bg
          )}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-[200px] leading-none">{currentDesign.icon}</div>
            <div className="absolute bottom-10 right-10 text-[150px] leading-none opacity-50">{currentDesign.icon}</div>
          </div>
          <div className="absolute inset-0 noise opacity-20" />

          {/* Slide Number */}
          <div className="absolute top-4 left-4 text-gold text-xs font-mono bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-gold/30">
            SLIDE {slideIdx + 1} / {DATA.pitchSlides.length}
          </div>

          {/* Slide Content */}
          <motion.div 
            key={slideIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center max-w-3xl"
          >
            <div className="text-6xl mb-6">{currentDesign.icon}</div>
            <h2 className={cn(
              "text-3xl md:text-5xl font-amiri font-bold mb-6",
              currentDesign.accent === "gold" ? "text-gold" : "text-white"
            )}>
              {lang === "ar" ? currentSlide.title_ar : currentSlide.title_en}
            </h2>
            <div className="space-y-4">
              {lines.map((line: string, i: number) => (
                <motion.p 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className={cn(
                    "text-lg md:text-2xl font-semibold",
                    currentDesign.accent === "gold" ? "text-white/90" : "text-gold/90"
                  )}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* Navigation Arrows */}
          <button 
            onClick={() => setSlideIdx(Math.max(0, slideIdx - 1))}
            disabled={slideIdx === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 disabled:opacity-30 transition-all"
          >
            <SkipBack size={20} className="text-white" />
          </button>
          <button 
            onClick={() => setSlideIdx(Math.min(DATA.pitchSlides.length - 1, slideIdx + 1))}
            disabled={slideIdx === DATA.pitchSlides.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 disabled:opacity-30 transition-all"
          >
            <SkipForward size={20} className="text-white" />
          </button>
        </div>

        {/* Slide Thumbnails */}
        <div className="p-4 bg-muted/20 dark:bg-dark-muted/20 border-t border-border">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {DATA.pitchSlides.map((slide: any, i: number) => (
              <button
                key={i}
                onClick={() => setSlideIdx(i)}
                className={cn(
                  "shrink-0 w-16 h-12 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all border",
                  i === slideIdx 
                    ? "bg-emerald text-white border-gold shadow-lg scale-110" 
                    : "bg-card dark:bg-dark-card border-border hover:border-emerald text-gray-500"
                )}
              >
                <span className="text-base">{slideDesigns[i].icon}</span>
                <span>{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Slide List for Quick Access */}
      <Card className="p-6">
        <h3 className="font-bold text-emerald dark:text-gold mb-4 flex items-center gap-2">
          <FileText size={16} /> {lang === "ar" ? "فهرس الشرائح" : "Slide Index"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {DATA.pitchSlides.map((slide: any, i: number) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg text-right transition-all border",
                i === slideIdx
                  ? "bg-emerald/10 border-emerald text-emerald dark:text-gold"
                  : "bg-muted/30 dark:bg-dark-muted/30 border-border hover:border-emerald/50 hover:bg-muted/50"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{lang === "ar" ? slide.title_ar : slide.title_en}</div>
                <div className="text-xs text-gray-500 truncate">{slideDesigns[i].icon} {slideDesigns[i].bg.split(" ")[0].replace("from-", "")}</div>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DataRoomView({ t, lang }: any) {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  
  // Group files by category
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
  
  const filteredFiles = selectedCat === "all" 
    ? DATA_ROOM_FILES 
    : DATA_ROOM_FILES.filter((f: any) => f.category === selectedCat);
  
  const categoryCounts: Record<string, number> = {};
  DATA_ROOM_FILES.forEach((f: any) => {
    categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Briefcase} 
        title={lang === "ar" ? "غرفة البيانات" : "Data Room"} 
        subtitle={lang === "ar" ? "فهرس تفاعلي لـ 49 وثيقة استراتيجية وتشغيلية. المحتوى الكامل متاح عند طلب الوصول." : "Interactive index of 49 strategic and operational documents. Full content available upon access request."} 
      />

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-emerald/10 to-emerald/5 p-5 rounded-2xl border border-emerald/20 text-center">
          <div className="text-3xl font-bold text-emerald font-amiri">49</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "وثيقة موثقة" : "Documented Files"}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-gold/10 to-gold/5 p-5 rounded-2xl border border-gold/20 text-center">
          <div className="text-3xl font-bold text-gold-dark dark:text-gold font-amiri">9</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "فئات" : "Categories"}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-accent/10 to-accent/5 p-5 rounded-2xl border border-accent/20 text-center">
          <div className="text-3xl font-bold text-accent font-amiri">2026</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "سنة التحديث" : "Update Year"}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-emerald/10 to-gold/5 p-5 rounded-2xl border border-emerald/20 text-center">
          <div className="text-3xl font-bold text-emerald font-amiri">🔒</div>
          <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{lang === "ar" ? "NDA مطلوب" : "NDA Required"}</div>
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
                ? "هذه الواجهة تعرض فقط أسماء الملفات وتواريخها وملخصات مختصرة. المحتوى الكامل لا يُعرض علنياً حفاظاً على الأسرار التجارية والملكية الفكرية. للوصول الكامل، يرجى التواصل مباشرة."
                : "This interface shows only file names, dates, and brief summaries. Full content is not publicly displayed to protect trade secrets and intellectual property. Contact us directly for full access."}
            </p>
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const count = cat === "all" ? DATA_ROOM_FILES.length : (categoryCounts[cat] || 0);
            const isActive = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                  isActive 
                    ? "bg-emerald text-white shadow-md" 
                    : "bg-muted dark:bg-dark-muted text-gray-600 dark:text-gray-400 hover:bg-emerald/10"
                )}
              >
                {lang === "ar" ? cat : catEn[cat]} ({count})
              </button>
            );
          })}
        </div>
      </Card>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredFiles.map((file: any, index: number) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ 
              scale: 1.02, 
              borderColor: "#D4AF37",
              boxShadow: "0 0 15px rgba(212,175,55,0.15)"
            }}
            className="group relative bg-card dark:bg-dark-card p-4 rounded-xl border border-border shadow-sm cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-muted dark:bg-dark-muted rounded-lg text-emerald group-hover:text-gold transition-colors">
                    <FileText size={14} />
                  </div>
                  <span className="text-[10px] font-mono text-gold-dark dark:text-gold font-bold">{file.id}</span>
                </div>
                <span className="text-[9px] font-semibold text-gray-500 bg-muted dark:bg-dark-muted px-2 py-0.5 rounded uppercase">
                  {lang === "ar" ? file.category : catEn[file.category]}
                </span>
              </div>
              
              <h3 className="font-bold text-sm mb-1 group-hover:text-emerald dark:group-hover:text-gold transition-colors font-mono">
                {file.name}
              </h3>
              
              <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-2">
                <Calendar size={10} />
                <span>{file.date}</span>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 italic border-t border-border/50 pt-2 mt-2 line-clamp-2">
                "{file.summary}"
              </p>
            </div>

            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1 text-[9px] font-bold text-gold bg-gold/10 px-2 py-1 rounded-full">
                <Lock size={8} /> {lang === "ar" ? "طلب وصول" : "Request"}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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


function TeamView({ t, lang }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'achievements' | 'skills'>('overview');

  const experiences = [
    { period: "2024 - Present", company_ar: "Seen Automation AI Agency", company_en: "Seen Automation AI Agency", role_ar: "المؤسس التشغيلي ومعمار الأنظمة", role_en: "Operational Founder & Systems Architect", desc_ar: "تأسيس وكالة أتمتة ذكاء اصطناعي متخصصة في القطاع الهندسي. بناء 49 ملفاً استراتيجياً، تصميم معمارية القلعة والرماح، تطوير بروتوكول الأمان الشامل.", desc_en: "Founded AI automation agency specialized in engineering sector. Built 49 strategic documents, designed Fortress & Spears architecture, developed comprehensive security protocol.", icon: "🏗️", color: "emerald", current: true },
    { period: "2022 - 2024", company_ar: "SABIC - الشركة السعودية للصناعات الأساسية", company_en: "SABIC - Saudi Basic Industries Corporation", role_ar: "مهندس عمليات وتحسين", role_en: "Operations & Process Improvement Engineer", desc_ar: "العمل في واحدة من أكبر شركات البتروكيماويات في العالم. تحسين العمليات الصناعية، إدارة سلاسل الإمداد، تطبيق معايير الجودة العالمية.", desc_en: "Worked at one of world's largest petrochemical companies. Industrial process optimization, supply chain management, implementing global quality standards.", icon: "⚗️", color: "gold", current: false },
    { period: "2019 - 2022", company_ar: "SEGi University - ماليزيا", company_en: "SEGi University - Malaysia", role_ar: "بكالوريوس هندسة ميكانيكية", role_en: "Bachelor of Mechanical Engineering", desc_ar: "التخصص في تحسين العمليات وسلاسل الإمداد. مشاريع تخرج في الأتمتة الصناعية والذكاء الاصطناعي.", desc_en: "Specialized in process optimization and supply chains. Graduation projects in industrial automation and AI.", icon: "🎓", color: "accent", current: false },
  ];

  const achievements = [
    { title_ar: "بناء 49 ملفاً استراتيجياً", title_en: "Built 49 Strategic Documents", desc_ar: "إنشاء مستودع معرفي شامل يغطي جميع جوانب الشركة.", desc_en: "Created comprehensive knowledge repository covering all company aspects.", icon: "📚", year: "2026" },
    { title_ar: "بروتوكول أمني بـ 25 هجمة", title_en: "Security Protocol with 25 Attacks", desc_ar: "بروتوكول أمني شامل يختبر النظام قبل كل تسليم.", desc_en: "Comprehensive security protocol testing before each delivery.", icon: "🛡️", year: "2026" },
    { title_ar: "100 سؤال هلوسة مُختبر", title_en: "100 Hallucination Questions", desc_ar: "مكتبة شاملة لاختبار دقة نماذج الذكاء الاصطناعي.", desc_en: "Comprehensive library to test AI model accuracy.", icon: "🧪", year: "2026" },
    { title_ar: "معمارية القلعة والرماح", title_en: "Fortress & Spears Architecture", desc_ar: "تصميم يجمع 5 قطاعات تحت هوية واحدة.", desc_en: "Smart design uniting 5 sectors under one identity.", icon: "🏰", year: "2026" },
    { title_ar: "خبرة SABIC الميدانية", title_en: "SABIC Field Experience", desc_ar: "سنتان في واحدة من أكبر شركات البتروكيماويات.", desc_en: "Two years at one of world's largest petrochemical companies.", icon: "⚗️", year: "2024" },
    { title_ar: "نموذج مضاربة شرعي", title_en: "Sharia-Compliant Mudarabah", desc_ar: "هيكل استثماري متوافق مع AAOIFI.", desc_en: "Investment structure aligned with AAOIFI standards.", icon: "🕌", year: "2026" },
  ];

  const skills = [
    { name_ar: "هندسة العمليات", name_en: "Process Engineering", level: 95 },
    { name_ar: "سلاسل الإمداد", name_en: "Supply Chain", level: 90 },
    { name_ar: "أتمتة n8n", name_en: "n8n Automation", level: 92 },
    { name_ar: "Supabase & PostgreSQL", name_en: "Supabase & PostgreSQL", level: 88 },
    { name_ar: "نماذج الذكاء الاصطناعي", name_en: "AI Models", level: 90 },
    { name_ar: "تصميم UX/UI", name_en: "UX/UI Design", level: 85 },
    { name_ar: "إدارة المشاريع", name_en: "Project Management", level: 88 },
    { name_ar: "التفاوض التجاري", name_en: "Business Negotiation", level: 85 },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader icon={Users} title={lang === "ar" ? "الفريق المؤسس" : "Founding Team"} subtitle={lang === "ar" ? "خبرة هندسية ميدانية تلتقي برؤية تشغيلية طموحة" : "Field engineering experience meets ambitious operational vision"} />

      <Card className="p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald/20 to-gold/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
          <div className="shrink-0 relative">
            <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-emerald via-emerald-dark to-gold flex items-center justify-center text-white text-6xl font-amiri font-bold shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 noise opacity-30" />
              <span className="relative z-10">{DATA.company.founder.name[0]}</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-14 h-14 rounded-full bg-gold flex items-center justify-center text-2xl shadow-lg border-4 border-card dark:border-dark-card">⭐</div>
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-emerald/10 dark:bg-emerald/20 px-4 py-1.5 rounded-full mb-3 border border-emerald/20">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
              <span className="text-xs font-bold text-emerald dark:text-gold uppercase tracking-wider">{lang === "ar" ? "المؤسس التشغيلي" : "Operational Founder"}</span>
            </div>
            <h2 className="text-4xl font-bold text-emerald dark:text-gold font-amiri mb-2">{lang === "ar" ? DATA.company.founder.name : DATA.company.founder.name_en}</h2>
            <p className="text-xl text-accent font-bold mb-4">{lang === "ar" ? DATA.company.founder.role_ar : DATA.company.founder.role_en}</p>
            <p className="text-gray-700 dark:text-gray-300 leading-[1.9] text-base mb-6">{lang === "ar" ? DATA.company.founder.bio_ar : DATA.company.founder.bio_en}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-muted/50 dark:bg-dark-muted/50 p-3 rounded-xl text-center"><div className="text-2xl font-bold text-emerald font-amiri">5+</div><div className="text-xs text-gray-500">{lang === "ar" ? "سنوات خبرة" : "Years Exp"}</div></div>
              <div className="bg-muted/50 dark:bg-dark-muted/50 p-3 rounded-xl text-center"><div className="text-2xl font-bold text-gold font-amiri">49</div><div className="text-xs text-gray-500">{lang === "ar" ? "ملف" : "Files"}</div></div>
              <div className="bg-muted/50 dark:bg-dark-muted/50 p-3 rounded-xl text-center"><div className="text-2xl font-bold text-accent font-amiri">25</div><div className="text-xs text-gray-500">{lang === "ar" ? "هجمة" : "Attacks"}</div></div>
              <div className="bg-muted/50 dark:bg-dark-muted/50 p-3 rounded-xl text-center"><div className="text-2xl font-bold text-emerald font-amiri">5</div><div className="text-xs text-gray-500">{lang === "ar" ? "قطاعات" : "Sectors"}</div></div>
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
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn("px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border", activeTab === tab.id ? "bg-emerald text-white border-emerald shadow-md" : "bg-muted/30 dark:bg-dark-muted/30 text-gray-600 dark:text-gray-400 border-transparent hover:border-emerald/40")}>
            <span className="mr-2">{tab.icon}</span>{lang === "ar" ? tab.label_ar : tab.label_en}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 border-emerald/20 bg-gradient-to-br from-emerald/5 to-transparent">
                <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald mb-4"><Users size={24} /></div>
                <h3 className="font-bold text-emerald dark:text-gold mb-2">{lang === "ar" ? "الخبرة الميدانية" : "Field Experience"}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{lang === "ar" ? "خبرة في SABIC، إحدى أكبر شركات البتروكيماويات في العالم." : "Experience at SABIC, one of world's largest petrochemical companies."}</p>
              </Card>
              <Card className="p-6 border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4"><BookOpen size={24} /></div>
                <h3 className="font-bold text-emerald dark:text-gold mb-2">{lang === "ar" ? "التعليم" : "Education"}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{lang === "ar" ? "خريج SEGi University في ماليزيا، هندسة ميكانيكية." : "SEGi University graduate in Malaysia, mechanical engineering."}</p>
              </Card>
              <Card className="p-6 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4"><Zap size={24} /></div>
                <h3 className="font-bold text-emerald dark:text-gold mb-2">{lang === "ar" ? "الرؤية" : "Vision"}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{lang === "ar" ? "تحرير المهندسين من الروتين عبر أتمتة ذكية وحلال." : "Liberating engineers from routine through intelligent Halal automation."}</p>
              </Card>
            </div>
            <Card className="p-6">
              <h3 className="text-lg font-bold text-emerald dark:text-gold mb-4 flex items-center gap-2"><CheckCircle2 size={18} />{lang === "ar" ? "القيم الأساسية" : "Core Values"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { ar: "الامتثال الشرعي: حلال 100%", en: "Sharia Compliance: 100% Halal" },
                  { ar: "الجودة المطلقة: 25 هجمة + 100 سؤال", en: "Absolute Quality: 25 attacks + 100 tests" },
                  { ar: "الشفافية الكاملة", en: "Full Transparency" },
                  { ar: "الابتكار العملي", en: "Practical Innovation" },
                ].map((v, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 p-3 bg-muted/30 dark:bg-dark-muted/30 rounded-lg">
                    <CheckCircle2 size={16} className="text-emerald shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{lang === "ar" ? v.ar : v.en}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'experience' && (
          <motion.div key="experience" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            {experiences.map((exp, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                {i < experiences.length - 1 && <div className="absolute right-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-emerald/40 to-transparent md:right-16" />}
                <Card className={cn("p-6 overflow-hidden relative", exp.current && "border-emerald/30 shadow-elevated")}>
                  {exp.current && <div className="absolute top-0 right-0 bg-emerald text-white text-xs font-bold px-3 py-1 rounded-bl-xl">{lang === "ar" ? "الحالي" : "Current"}</div>}
                  <div className="flex items-start gap-4">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg", exp.color === "emerald" && "bg-gradient-to-br from-emerald to-emerald-dark", exp.color === "gold" && "bg-gradient-to-br from-gold to-gold-dark", exp.color === "accent" && "bg-gradient-to-br from-accent to-orange-600")}>{exp.icon}</div>
                    <div className="flex-1">
                      <span className="text-xs font-mono bg-muted dark:bg-dark-muted px-2 py-1 rounded text-gray-500">{exp.period}</span>
                      <h3 className="text-xl font-bold text-emerald dark:text-gold mb-1 mt-2">{lang === "ar" ? exp.role_ar : exp.role_en}</h3>
                      <p className="text-sm text-accent font-semibold mb-3">{lang === "ar" ? exp.company_ar : exp.company_en}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{lang === "ar" ? exp.desc_ar : exp.desc_en}</p>
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
                <Card className="p-6 h-full bg-gradient-to-br from-gold/5 to-emerald/5 border-gold/20 hover:border-gold/40 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-3xl shadow-lg shrink-0">{ach.icon}</div>
                    <div className="flex-1">
                      <span className="text-xs font-mono bg-gold/10 text-gold-dark dark:text-gold px-2 py-0.5 rounded">{ach.year}</span>
                      <h3 className="text-base font-bold text-emerald dark:text-gold mb-2 mt-2 leading-snug">{lang === "ar" ? ach.title_ar : ach.title_en}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{lang === "ar" ? ach.desc_ar : ach.desc_en}</p>
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
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-card dark:bg-dark-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-emerald dark:text-gold">{lang === "ar" ? skill.name_ar : skill.name_en}</span>
                  <span className="text-sm font-bold text-accent">{skill.level}%</span>
                </div>
                <div className="h-3 bg-muted dark:bg-dark-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }} className={cn("h-full rounded-full", skill.level >= 90 ? "bg-gradient-to-l from-emerald to-gold" : skill.level >= 85 ? "bg-gradient-to-l from-emerald to-emerald-light" : "bg-gradient-to-l from-gold to-amber-500")} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center text-gold text-xl font-bold font-amiri">أ</div>
            <div>
              <h3 className="font-bold text-emerald dark:text-gold">{lang === "ar" ? "أحمد" : "Ahmed"}</h3>
              <p className="text-xs text-accent">{lang === "ar" ? "الشريك القانوني - ماليزيا" : "Legal Partner - Malaysia"}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{lang === "ar" ? "مسؤول عن التأسيس القانوني والامتثال المحلي." : "Responsible for legal entity formation and local compliance."}</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald text-2xl">🤖</div>
            <div>
              <h3 className="font-bold text-emerald dark:text-gold">{lang === "ar" ? "د.سين" : "Dr. Seen"}</h3>
              <p className="text-xs text-accent">{lang === "ar" ? "مدير العمليات الآلي" : "AI Operations Manager"}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{lang === "ar" ? "موظف آلي يعمل 24/7 على توثيق القرارات ومتابعة SOPs." : "AI agent working 24/7 on documenting decisions and following SOPs."}</p>
        </Card>
      </div>
    </div>
  );
}

function SecurityView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={ShieldCheck} 
        title={lang === "ar" ? "الأمن والامتثال" : "Security & Compliance"} 
        subtitle={lang === "ar" ? "بروتوكول أمني شامل يحمي بيانات العملاء والأنظمة" : "Comprehensive security protocol protecting client data and systems"} 
      />

      {/* Big Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center border-emerald/30">
          <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-emerald" />
          </div>
          <div className="text-5xl font-bold text-emerald dark:text-gold font-amiri mb-2">{DATA.securityHighlights.attacks}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">
            {lang === "ar" ? "هجمة محاكاة" : "Simulated Attacks"}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
            {lang === "ar" 
              ? "يتم محاكاة 25 هجمة أمنية مختلفة قبل كل تسليم لضمان صلابة النظام."
              : "25 different security attacks simulated before each delivery to ensure system resilience."}
          </p>
        </Card>

        <Card className="p-6 text-center border-gold/30">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <Activity size={32} className="text-gold" />
          </div>
          <div className="text-5xl font-bold text-gold-dark dark:text-gold font-amiri mb-2">{DATA.securityHighlights.hallucinationTests}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">
            {lang === "ar" ? "سؤال هلوسة مُختبر" : "Hallucination Tests"}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
            {lang === "ar" 
              ? "100 سؤال هلوسة يتم اختبارها على كل نموذج قبل الإطلاق لضمان دقة المخرجات."
              : "100 hallucination questions tested on each model before launch to ensure output accuracy."}
          </p>
        </Card>

        <Card className="p-6 text-center border-accent/30">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-accent" />
          </div>
          <div className="text-3xl font-bold text-accent font-amiri mb-2">{DATA.securityHighlights.encryption}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">
            {lang === "ar" ? "تشفير البيانات" : "Data Encryption"}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
            {lang === "ar" 
              ? "تشفير AES-256 للتخزين، وTLS 1.3 للنقل، لضمان حماية كاملة للبيانات."
              : "AES-256 encryption at rest, TLS 1.3 in transit, ensuring complete data protection."}
          </p>
        </Card>
      </div>

      {/* Security Layers */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-emerald dark:text-gold mb-4 flex items-center gap-2">
          <Layers size={18} />
          {lang === "ar" ? "طبقات الحماية المتعددة" : "Multi-Layer Protection"}
        </h3>
        <div className="space-y-3">
          {[
            { 
              icon: Server,
              ar: "Container Isolation لكل عميل", 
              en: "Container Isolation per client",
              desc_ar: "كل عميل له حاوية Docker معزولة تماماً، لا مشاركة للبيانات.",
              desc_en: "Each client has a fully isolated Docker container, no data sharing."
            },
            { 
              icon: Activity,
              ar: "Error Node System للإشعار الفوري", 
              en: "Error Node System for instant alerts",
              desc_ar: "نظام يكتشف الأخطاء ويُرسل تنبيهاً فورياً للطرفين.",
              desc_en: "System that detects errors and sends instant alerts to both parties."
            },
            { 
              icon: Lock,
              ar: "TLS 1.3 للنقل المشفر", 
              en: "TLS 1.3 encrypted transport",
              desc_ar: "جميع الاتصالات مشفرة بأحدث معايير TLS.",
              desc_en: "All communications encrypted with latest TLS standards."
            },
            { 
              icon: Shield,
              ar: "إدارة المفاتيح المركزية (Doppler)", 
              en: "Centralized key management (Doppler)",
              desc_ar: "مفاتيح API والأسرار محفوظة في Doppler أو Infisical.",
              desc_en: "API keys and secrets stored in Doppler or Infisical."
            },
            { 
              icon: CheckCircle2,
              ar: "Backup يومي مشفر + Offsite", 
              en: "Daily encrypted backup + Offsite",
              desc_ar: "نسخ احتياطية يومية مشفرة مع اختبار استعادة أسبوعي.",
              desc_en: "Daily encrypted backups with weekly recovery testing."
            },
            { 
              icon: FileText,
              ar: "NDA + DPA لكل عميل", 
              en: "NDA + DPA for every client",
              desc_ar: "اتفاقيات سرية ومعالجة بيانات موقعة مع كل عميل.",
              desc_en: "NDA and DPA agreements signed with every client."
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-4 p-4 bg-muted/30 dark:bg-dark-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald shrink-0">
                <item.icon size={18} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-emerald dark:text-gold mb-1">
                  {lang === "ar" ? item.ar : item.en}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {lang === "ar" ? item.desc_ar : item.desc_en}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Compliance Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-to-br from-emerald/5 to-transparent border-emerald/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald text-2xl">🕌</div>
            <h3 className="font-bold text-emerald dark:text-gold text-lg">
              {lang === "ar" ? "الامتثال الشرعي" : "Sharia Compliance"}
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2"><span className="text-emerald mt-1">✓</span> {lang === "ar" ? "لا فوائد ربوية في أي تعامل" : "No riba (interest) in any transaction"}</li>
            <li className="flex items-start gap-2"><span className="text-emerald mt-1">✓</span> {lang === "ar" ? "لا قطاعات محرمة (كحول، قمار، مخدرات)" : "No prohibited sectors (alcohol, gambling, drugs)"}</li>
            <li className="flex items-start gap-2"><span className="text-emerald mt-1">✓</span> {lang === "ar" ? "عقود مراجعة من هيئة شرعية" : "Contracts reviewed by Sharia board"}</li>
            <li className="flex items-start gap-2"><span className="text-emerald mt-1">✓</span> {lang === "ar" ? "مصدر المال حلال 100%" : "100% Halal funding source"}</li>
          </ul>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-gold/5 to-transparent border-gold/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold text-2xl">🛡️</div>
            <h3 className="font-bold text-emerald dark:text-gold text-lg">
              {lang === "ar" ? "الامتثال التنظيمي" : "Regulatory Compliance"}
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2"><span className="text-gold mt-1">✓</span> PDPL {lang === "ar" ? "نظام حماية البيانات السعودي" : "Saudi Data Protection Law"}</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-1">✓</span> GDPR {lang === "ar" ? "متوافق للمتعاملين الأوروبيين" : "Compliant for EU clients"}</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-1">✓</span> {lang === "ar" ? "مراجعة قانونية ربع سنوية" : "Quarterly legal review"}</li>
            <li className="flex items-start gap-2"><span className="text-gold mt-1">✓</span> {lang === "ar" ? "DPA موقّع مع كل عميل" : "DPA signed with every client"}</li>
          </ul>
        </Card>
      </div>
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
