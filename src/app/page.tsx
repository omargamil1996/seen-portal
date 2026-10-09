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
            <div className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="text-xs text-gray-300 mb-2 uppercase tracking-wider">💻 {lang === "ar" ? "اللابتوب" : "Laptop"}</div>
              <div className="font-bold text-sm mb-2 leading-relaxed">{DATA.hardware.scenario.laptop}</div>
              <div className="text-gold font-bold text-xl">${DATA.hardware.scenario.laptop_price.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="text-xs text-gray-300 mb-2 uppercase tracking-wider">🖥️ Mini PC</div>
              <div className="font-bold text-sm mb-2 leading-relaxed">{DATA.hardware.scenario.minipc}</div>
              <div className="text-gold font-bold text-xl">${DATA.hardware.scenario.minipc_price.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="text-xs text-gray-300 mb-2 uppercase tracking-wider">🔌 {lang === "ar" ? "الإكسسوارات" : "Accessories"}</div>
              <div className="font-bold text-sm mb-2 leading-relaxed">{lang === "ar" ? DATA.hardware.scenario.accessories : DATA.hardware.scenario.accessories_en}</div>
              <div className="text-gold font-bold text-xl">${DATA.hardware.scenario.accessories_price.toLocaleString()}</div>
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

      {/* Comparison Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border dark:border-dark-border bg-gradient-to-l from-emerald/5 to-transparent">
            <h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2">
              <Cpu size={16} /> {lang === "ar" ? "فئات اللابتوب (5)" : "Laptop Categories (5)"}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 dark:bg-dark-muted/50">
                <tr>
                  <th className="p-3 text-right">{lang === "ar" ? "الفئة" : "Category"}</th>
                  <th className="p-3 text-right">{lang === "ar" ? "المواصفات" : "Specs"}</th>
                  <th className="p-3 text-right">{lang === "ar" ? "السعر" : "Price"}</th>
                  <th className="p-3 text-right">{lang === "ar" ? "قدرة AI" : "AI Capacity"}</th>
                </tr>
              </thead>
              <tbody>
                {DATA.hardware.laptops.map((l, i) => (
                  <tr key={i} className={cn(
                    "border-b border-border/50 dark:border-dark-border/50 transition-colors",
                    l.category.includes("⭐") ? "bg-gold/5 dark:bg-gold/10" : "hover:bg-muted/20"
                  )}>
                    <td className="p-3 font-semibold text-emerald dark:text-gold">{l.category}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">{l.specs}</td>
                    <td className="p-3 text-accent font-bold">{l.price}</td>
                    <td className="p-3 text-gray-500">{l.ai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border dark:border-dark-border bg-gradient-to-l from-gold/5 to-transparent">
            <h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2">
              <Layers size={16} /> {lang === "ar" ? "فئات Mini PC (5)" : "Mini PC Categories (5)"}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 dark:bg-dark-muted/50">
                <tr>
                  <th className="p-3 text-right">{lang === "ar" ? "الفئة" : "Category"}</th>
                  <th className="p-3 text-right">{lang === "ar" ? "المواصفات" : "Specs"}</th>
                  <th className="p-3 text-right">{lang === "ar" ? "السعر" : "Price"}</th>
                </tr>
              </thead>
              <tbody>
                {DATA.hardware.minipc.map((l, i) => (
                  <tr key={i} className="border-b border-border/50 dark:border-dark-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-semibold text-emerald dark:text-gold">{l.category}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">{l.specs}</td>
                    <td className="p-3 text-accent font-bold">{l.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Why Unified Memory */}
      <Card className="p-6 bg-gradient-to-br from-emerald/5 to-gold/5 dark:from-emerald/10 dark:to-gold/10 border-emerald/20">
        <h3 className="text-lg font-bold text-emerald dark:text-gold mb-4 flex items-center gap-2">
          <Zap size={20} />
          {lang === "ar" ? "لماذا Unified Memory؟" : "Why Unified Memory?"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-border">
            <div className="text-2xl mb-2">🚀</div>
            <div className="font-bold text-emerald dark:text-gold mb-1">{lang === "ar" ? "نماذج 120B" : "120B Models"}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{lang === "ar" ? "تشغيل نماذج ضخمة بكفاءة عالية" : "Run massive models with high efficiency"}</p>
          </div>
          <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-border">
            <div className="text-2xl mb-2">💰</div>
            <div className="font-bold text-emerald dark:text-gold mb-1">{lang === "ar" ? "توفير كبير" : "Major Savings"}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{lang === "ar" ? "بدلاً من شراء GPU بقيمة 10K+" : "Instead of $10K+ GPU purchase"}</p>
          </div>
          <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-border">
            <div className="text-2xl mb-2">🔒</div>
            <div className="font-bold text-emerald dark:text-gold mb-1">{lang === "ar" ? "خصوصية تامة" : "Full Privacy"}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{lang === "ar" ? "تشغيل محلي بدون سحابة" : "Local execution without cloud"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}


function TheAskView({ slideIdx, setSlideIdx, t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={FileCheck} 
        title={lang === "ar" ? "طلب الاستثمار" : "Investment Ask"} 
        subtitle={lang === "ar" ? "هيكل مضاربة شرعي متوافق مع معايير AAOIFI" : "Sharia-compliant Mudarabah structure aligned with AAOIFI standards"} 
      />

      {/* Main Ask Hero */}
      <Card className="p-10 text-center overflow-hidden relative" hover={false}>
        <div className="absolute inset-0 bg-gradient-to-l from-emerald via-emerald-dark to-emerald noise" />
        <div className="relative z-10 text-white">
          <p className="text-sm font-semibold text-gold-light uppercase tracking-widest mb-3">
            {lang === "ar" ? "طلب الاستثمار" : "Investment Ask"}
          </p>
          <div className="text-7xl font-bold font-amiri text-gold mb-4 animate-pulse-gold rounded-2xl inline-block px-8 py-2">
            SAR {DATA.ask.amount.toLocaleString()}
          </div>
          <div className="text-2xl text-white/80 mb-4 font-semibold">
            ≈ USD {DATA.ask.amount_usd.toLocaleString()}
          </div>
          <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm px-6 py-3 rounded-full border border-gold/30">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold font-semibold">{lang === "ar" ? DATA.ask.structure_ar : DATA.ask.structure_en}</span>
          </div>
        </div>
      </Card>

      {/* Mudarabah Structure - 3 Phases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-emerald/30 bg-gradient-to-br from-emerald/5 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald font-bold font-amiri text-xl">1</div>
            <div>
              <h3 className="font-bold text-emerald dark:text-gold">Phase 1</h3>
              <p className="text-xs text-gray-500">{lang === "ar" ? "حتى استرداد رأس المال" : "Until capital recovery"}</p>
            </div>
          </div>
          <div className="text-4xl font-bold text-emerald font-amiri mb-2">{DATA.ask.phase1}%</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {lang === "ar" 
              ? `${DATA.ask.phase1}% من الأرباح للمستثمر حتى يتم استرداد كامل رأس المال.`
              : `${DATA.ask.phase1}% of profits to investor until full capital is recovered.`}
          </p>
        </Card>

        <Card className="p-6 border-gold/30 bg-gradient-to-br from-gold/5 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-bold font-amiri text-xl">2</div>
            <div>
              <h3 className="font-bold text-emerald dark:text-gold">Phase 2</h3>
              <p className="text-xs text-gray-500">{lang === "ar" ? `لمدة ${DATA.ask.phase2_months} شهر` : `For ${DATA.ask.phase2_months} months`}</p>
            </div>
          </div>
          <div className="text-4xl font-bold text-gold-dark dark:text-gold font-amiri mb-2">{DATA.ask.phase2}%</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {lang === "ar" 
              ? `${DATA.ask.phase2}% من الأرباح للمستثمر لمدة ${DATA.ask.phase2_months} شهراً بعد استرداد رأس المال.`
              : `${DATA.ask.phase2}% of profits to investor for ${DATA.ask.phase2_months} months after capital recovery.`}
          </p>
        </Card>

        <Card className="p-6 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold font-amiri text-xl">★</div>
            <div>
              <h3 className="font-bold text-emerald dark:text-gold">{lang === "ar" ? "خيار الشراء" : "Buyout Option"}</h3>
              <p className="text-xs text-gray-500">{lang === "ar" ? `بعد ${DATA.ask.buyout_months} شهر` : `After ${DATA.ask.buyout_months} months`}</p>
            </div>
          </div>
          <div className="text-4xl font-bold text-accent font-amiri mb-2">×{DATA.ask.buyout_multiple}</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {lang === "ar" 
              ? `يمكن للمؤسس شراء حصة المستثمر بعد ${DATA.ask.buyout_months} شهراً بقيمة ${DATA.ask.buyout_multiple}x من الاستثمار الأصلي.`
              : `Founder can buy out investor's share after ${DATA.ask.buyout_months} months at ${DATA.ask.buyout_multiple}x the original investment.`}
          </p>
        </Card>
      </div>

      {/* Key Terms */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-emerald dark:text-gold mb-4 flex items-center gap-2">
          <FileText size={18} />
          {lang === "ar" ? "الشروط الرئيسية" : "Key Terms"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label_ar: "المدة القصوى", label_en: "Max Duration", value: `${DATA.ask.max_years} ${lang === "ar" ? "سنة" : "years"}`, icon: Clock },
            { label_ar: "استرداد رأس المال", label_en: "Capital Recovery", value: `${DATA.ask.phase1}%`, icon: DollarSign },
            { label_ar: "نسبة الأرباح بعد الاسترداد", label_en: "Post-Recovery Profit Share", value: `${DATA.ask.phase2}%`, icon: TrendingUp },
            { label_ar: "نقطة Buyout", label_en: "Buyout Point", value: `${DATA.ask.buyout_months} ${lang === "ar" ? "شهراً" : "months"}`, icon: Target },
          ].map((term, i) => (
            <div key={i} className="bg-muted/30 dark:bg-dark-muted/30 p-4 rounded-xl border border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald">
                <term.icon size={18} />
              </div>
              <div>
                <div className="text-xs text-gray-500">{lang === "ar" ? term.label_ar : term.label_en}</div>
                <div className="font-bold text-emerald dark:text-gold">{term.value}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ROI Projection */}
      <Card className="p-6 bg-gradient-to-br from-gold/5 to-emerald/5">
        <h3 className="text-lg font-bold text-emerald dark:text-gold mb-4">
          {lang === "ar" ? "العائد المتوقع للمستثمر" : "Expected Investor Return"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-border text-center">
            <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "الاستثمار" : "Investment"}</div>
            <div className="text-2xl font-bold text-emerald">${DATA.ask.amount_usd.toLocaleString()}</div>
          </div>
          <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-border text-center">
            <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "العائد المتوقع (Y3)" : "Expected Return (Y3)"}</div>
            <div className="text-2xl font-bold text-gold-dark dark:text-gold">~$45K</div>
          </div>
          <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-border text-center">
            <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "معدل العائد" : "ROI"}</div>
            <div className="text-2xl font-bold text-accent">~3.5x</div>
          </div>
          <div className="bg-card dark:bg-dark-card p-4 rounded-xl border border-border text-center">
            <div className="text-xs text-gray-500 mb-1">{lang === "ar" ? "فترة الاسترداد" : "Payback Period"}</div>
            <div className="text-2xl font-bold text-emerald">~18 {lang === "ar" ? "شهراً" : "mo"}</div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center italic">
          * {lang === "ar" ? "تقدير مبني على السيناريو الأساسي في النموذج المالي. النتائج الفعلية قد تختلف." : "Estimate based on base-case financial model. Actual results may vary."}
        </p>
      </Card>

      {/* Pitch Deck */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border dark:border-dark-border flex justify-between items-center">
          <h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2">
            <Eye size={16} /> Pitch Deck ({DATA.pitchSlides.length} {lang === "ar" ? "شريحة" : "slides"})
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setSlideIdx(Math.max(0, slideIdx - 1))} className="p-2 rounded-lg hover:bg-muted dark:hover:bg-dark-muted"><SkipBack size={16} /></button>
            <span className="text-xs font-mono text-gray-500">{slideIdx + 1}/{DATA.pitchSlides.length}</span>
            <button onClick={() => setSlideIdx(Math.min(DATA.pitchSlides.length - 1, slideIdx + 1))} className="p-2 rounded-lg hover:bg-muted dark:hover:bg-dark-muted"><SkipForward size={16} /></button>
          </div>
        </div>
        <div className="bg-dark-bg text-white p-10 min-h-[300px] flex flex-col items-center justify-center text-center">
          <h3 className="text-2xl font-amiri font-bold text-gold mb-6">{lang === "ar" ? DATA.pitchSlides[slideIdx].title_ar : DATA.pitchSlides[slideIdx].title_en}</h3>
          <p className="text-lg text-white/90 whitespace-pre-line leading-relaxed max-w-2xl">{lang === "ar" ? DATA.pitchSlides[slideIdx].content_ar : DATA.pitchSlides[slideIdx].content_en}</p>
          <div className="flex gap-1.5 mt-8">
            {DATA.pitchSlides.map((_, i) => (
              <button key={i} onClick={() => setSlideIdx(i)} className={cn("h-1.5 rounded-full transition-all", i === slideIdx ? "w-8 bg-gold" : "w-1.5 bg-gray-600 hover:bg-gray-500")} />
            ))}
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-8 text-center bg-gradient-to-br from-emerald via-emerald-dark to-emerald text-white relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-10" />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold font-amiri mb-3 text-gold">
            {lang === "ar" ? "جاهز للاستثمار؟" : "Ready to Invest?"}
          </h3>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            {lang === "ar" 
              ? "تواصل معنا اليوم لمناقشة الشروط وتوقيع اتفاقية عدم الإفصاح."
              : "Contact us today to discuss terms and sign the NDA."}
          </p>
          <a 
            href="mailto:hello@seen-agency.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-emerald-dark rounded-xl font-bold hover:bg-gold-light transition-all shadow-lg"
          >
            hello@seen-agency.com
          </a>
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
  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Users} 
        title={lang === "ar" ? "الفريق المؤسس" : "Founding Team"} 
        subtitle={lang === "ar" ? "خبرة هندسية ميدانية تلتقي برؤية تشغيلية طموحة" : "Field engineering experience meets ambitious operational vision"} 
      />

      {/* Founder Card */}
      <Card className="p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald/10 to-gold/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
          <div className="shrink-0">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald to-emerald-dark flex items-center justify-center text-white text-5xl font-amiri font-bold shadow-xl">
              {(lang === "ar" ? DATA.company.founder.name : DATA.company.founder.name_en)[0]}
            </div>
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-emerald/10 px-3 py-1 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald" />
              <span className="text-xs font-semibold text-emerald">{lang === "ar" ? "المؤسس التشغيلي" : "Operational Founder"}</span>
            </div>
            <h2 className="text-3xl font-bold text-emerald dark:text-gold font-amiri mb-2">
              {lang === "ar" ? DATA.company.founder.name : DATA.company.founder.name_en}
            </h2>
            <p className="text-lg text-accent font-semibold mb-4">
              {lang === "ar" ? DATA.company.founder.role_ar : DATA.company.founder.role_en}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-[1.9] text-base">
              {lang === "ar" ? DATA.company.founder.bio_ar : DATA.company.founder.bio_en}
            </p>
          </div>
        </div>
      </Card>

      {/* Founder Experience */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-emerald/20 bg-gradient-to-br from-emerald/5 to-transparent">
          <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald mb-4">
            <Users size={24} />
          </div>
          <h3 className="font-bold text-emerald dark:text-gold mb-2">{lang === "ar" ? "الخبرة الميدانية" : "Field Experience"}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {lang === "ar" 
              ? "خبرة في SABIC، إحدى أكبر شركات البتروكيماويات في العالم، مع فهم عميق للاختناقات التشغيلية في المكاتب الهندسية."
              : "Experience at SABIC, one of the world's largest petrochemical companies, with deep understanding of operational bottlenecks in engineering firms."}
          </p>
        </Card>

        <Card className="p-6 border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4">
            <BookOpen size={24} />
          </div>
          <h3 className="font-bold text-emerald dark:text-gold mb-2">{lang === "ar" ? "التعليم" : "Education"}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {lang === "ar" 
              ? "خريج SEGi University في ماليزيا، تخصص هندسة ميكانيكية مع تركيز على تحسين العمليات وسلاسل الإمداد."
              : "SEGi University graduate in Malaysia, mechanical engineering major focused on process optimization and supply chains."}
          </p>
        </Card>

        <Card className="p-6 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
            <Zap size={24} />
          </div>
          <h3 className="font-bold text-emerald dark:text-gold mb-2">{lang === "ar" ? "الرؤية" : "Vision"}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {lang === "ar" 
              ? "تحرير المهندسين من الروتين الإداري للتركيز على الابتكار والتصميم، من خلال أتمتة ذكية وحلال."
              : "Liberating engineers from administrative routine to focus on innovation and design, through intelligent Halal automation."}
          </p>
        </Card>
      </div>

      {/* Core Values */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-emerald dark:text-gold mb-4 flex items-center gap-2">
          <CheckCircle2 size={18} />
          {lang === "ar" ? "القيم الأساسية" : "Core Values"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { ar: "الامتثال الشرعي: حلال 100% في كل تعامل", en: "Sharia Compliance: 100% Halal in every transaction" },
            { ar: "الجودة المطلقة: 25 هجمة أمنية + 100 سؤال هلوسة", en: "Absolute Quality: 25 security attacks + 100 hallucination tests" },
            { ar: "الشفافية الكاملة: لا تكاليف خفية ولا وعود كاذبة", en: "Full Transparency: No hidden costs, no false promises" },
            { ar: "الابتكار العملي: نخصص الحلول الجاهزة ولا نعيد الاختراع", en: "Practical Innovation: Customize existing solutions, don't reinvent" },
          ].map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-3 bg-muted/30 dark:bg-dark-muted/30 rounded-lg"
            >
              <CheckCircle2 size={16} className="text-emerald shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {lang === "ar" ? v.ar : v.en}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Supporting Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center text-gold text-xl font-bold font-amiri">أ</div>
            <div>
              <h3 className="font-bold text-emerald dark:text-gold">{lang === "ar" ? "أحمد" : "Ahmed"}</h3>
              <p className="text-xs text-accent">{lang === "ar" ? "الشريك القانوني - ماليزيا" : "Legal Partner - Malaysia"}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {lang === "ar" 
              ? "مسؤول عن التأسيس القانوني للكيان في ماليزيا، والامتثال المحلي، ومراجعة العقود والاتفاقيات."
              : "Responsible for legal entity formation in Malaysia, local compliance, and contract/agreement review."}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald text-xl font-bold font-amiri">🤖</div>
            <div>
              <h3 className="font-bold text-emerald dark:text-gold">{lang === "ar" ? "د.سين" : "Dr. Seen"}</h3>
              <p className="text-xs text-accent">{lang === "ar" ? "مدير العمليات الآلي" : "AI Operations Manager"}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {lang === "ar" 
              ? "موظف آلي يعمل 24/7 على توثيق القرارات، متابعة SOPs، ومنع فقدان المعرفة التشغيلية."
              : "AI agent working 24/7 on documenting decisions, following SOPs, and preventing operational knowledge loss."}
          </p>
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
