"use client";

import { useState, useEffect, useRef, createContext } from "react";
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
  BarChart3, Activity, CheckCircle2, XCircle, ArrowUpRight,
  Layers, Server, Lock, Eye, Download, Settings, BookOpen,
  Briefcase, Calendar, CreditCard, ShieldCheck, Zap, Sparkles,
  Volume2, Bell, Save, Trash2, Info, Sun, Moon, ArrowRight,
  PieChart as PieChartIcon
} from "lucide-react";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

import { SankeyChart, TreemapChart, SunburstChart, RadarChart, BubbleChart, GanttChart, ChordDiagram } from "@/components/AdvancedCharts";

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

export default function Home() {
  const [lang, setLang] = useState<Lang>("ar");
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [slideIdx, setSlideIdx] = useState(0);
  const [fin, setFin] = useState(DATA.financials);
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const ltv = (fin.arpu * 12 * (1 - fin.churn / 100)) / (fin.churn / 100) * (fin.margin / 100);
  const ltvCac = ltv / fin.cac;
  const payback = fin.cac / (fin.arpu * (fin.margin / 100));
  const be = Math.ceil(fin.fixed / (fin.arpu * (fin.newCust * (fin.margin / 100))));

  const projectionData = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const cust = Math.round(fin.newCust * m * Math.pow(1 - fin.churn / 100, m));
    const mrr = cust * fin.arpu;
    const costs = fin.fixed + cust * (fin.cac / 12);
    return { month: `M${m}`, customers: cust, mrr: Math.round(mrr), profit: Math.round(mrr - costs) };
  });

  const tabs = [
    { id: "dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { id: "financials", label: t.nav.financials, icon: Wallet },
    { id: "business-plan", label: t.nav.businessPlan, icon: FileText },
    { id: "sectors", label: t.nav.sectors, icon: Target },
    { id: "roadmap", label: t.nav.roadmap, icon: MapIcon },
    { id: "risks", label: t.nav.risks, icon: AlertTriangle },
    { id: "hardware", label: t.nav.hardware, icon: Cpu },
    { id: "the-ask", label: t.nav.theAsk, icon: FileCheck },
    { id: "data-room", label: t.nav.dataRoom, icon: Briefcase },
    { id: "team", label: t.nav.team, icon: Users },
    { id: "security", label: t.nav.security, icon: Shield },
    { id: "advanced-analytics", label: lang === "ar" ? "التحليلات المتقدمة" : "Advanced Analytics", icon: BarChart3 },
    { id: "settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <AppContext.Provider value={{ lang, setLang, dark, setDark }}>
      <div className="min-h-screen bg-background dark:bg-dark-bg text-foreground dark:text-white font-cairo transition-colors duration-300">
        <header className="sticky top-0 z-50 bg-card/90 dark:bg-dark-card/90 backdrop-blur-xl border-b border-border dark:border-dark-border shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-gold flex items-center justify-center text-white font-bold text-xl shadow-lg">S</div>
              <div>
                <h1 className="text-lg font-bold text-emerald dark:text-gold font-amiri">
                  {DATA.company.name_ar}
                  <span className="text-xs bg-emerald/10 text-emerald px-2 py-1 rounded-full ml-2">V5.2.0</span>
                </h1>
                <p className="text-xs text-gray-500">{t.common.investorBriefcase}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setDark(!dark)} className="p-2.5 rounded-xl border border-border dark:border-dark-border hover:bg-muted dark:hover:bg-dark-muted transition-all">
                {dark ? <Sun size={18} className="text-gold" /> : <Moon size={18} className="text-emerald" />}
              </button>
              <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="px-4 py-2.5 rounded-xl border border-border dark:border-dark-border hover:bg-muted dark:hover:bg-dark-muted text-sm font-semibold flex items-center gap-2 transition-all">
                <Globe size={14} /> {lang === "ar" ? "EN" : "عربي"}
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 pb-3 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 shadow-sm",
                    activeTab === tab.id
                      ? "bg-gradient-to-l from-emerald to-emerald-dark text-white shadow-md scale-105 border border-emerald/50"
                      : "bg-card dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-muted dark:hover:bg-dark-muted border border-border dark:border-dark-border hover:border-emerald/30"
                  )}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {activeTab === "dashboard" && <DashboardView t={t} lang={lang} />}
              {activeTab === "financials" && <FinancialsView fin={fin} setFin={setFin} ltv={ltv} ltvCac={ltvCac} payback={payback} be={be} projectionData={projectionData} t={t} lang={lang} />}
              {activeTab === "business-plan" && <BusinessPlanView t={t} lang={lang} />}
              {activeTab === "sectors" && <SectorsView t={t} lang={lang} />}
              {activeTab === "roadmap" && <RoadmapView t={t} lang={lang} />}
              {activeTab === "risks" && <RisksView t={t} lang={lang} />}
              {activeTab === "hardware" && <HardwareView t={t} lang={lang} />}
              {activeTab === "the-ask" && <TheAskView slideIdx={slideIdx} setSlideIdx={setSlideIdx} t={t} lang={lang} />}
              {activeTab === "data-room" && <DataRoomView t={t} lang={lang} />}
              {activeTab === "team" && <TeamView t={t} lang={lang} />}
              {activeTab === "security" && <SecurityView t={t} lang={lang} />}
              {activeTab === "advanced-analytics" && <AdvancedAnalyticsView t={t} lang={lang} />}
              {activeTab === "settings" && <SettingsView t={t} lang={lang} dark={dark} setDark={setDark} setLang={setLang} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </AppContext.Provider>
  );
}

const Card = ({ children, className, delay = 0, hover = true }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay: delay / 1000, ease: "easeOut" }}
    whileHover={hover ? { y: -6, scale: 1.01 } : {}}
    className={cn("bg-card dark:bg-dark-card rounded-2xl border border-border dark:border-dark-border shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden", className)}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }: any) => (
  <div className="mb-8">
    <div className="flex items-center gap-4 mb-3">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald/20 to-gold/20 flex items-center justify-center border border-emerald/30 dark:border-gold/30 shadow-sm">
        <Icon size={28} className="text-emerald dark:text-gold" />
      </div>
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-emerald dark:text-gold font-amiri">{title}</h2>
        {subtitle && <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const Badge = ({ children, color = "emerald" }: any) => {
  const colors: any = {
    emerald: "bg-emerald/10 text-emerald border-emerald/20",
    gold: "bg-gold/10 text-gold-dark dark:text-gold border-gold/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    red: "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
    green: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
  };
  return <span className={cn("px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1", colors[color])}>{children}</span>;
};

function DashboardView({ t, lang }: any) {
  return (
    <div className="space-y-8">
      <Card className="p-10 overflow-hidden relative" hover={false}>
        <div className="absolute inset-0 bg-gradient-to-l from-emerald via-emerald-dark to-emerald opacity-90" />
        <div className="relative z-10 max-w-3xl text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm border border-white/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />{t.common.preSeed} • {t.common.investmentReady}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-amiri font-bold leading-tight mb-4">{DATA.company.name_ar}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gold font-semibold mb-4 font-amiri">{DATA.company.tagline_ar}</motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg text-white/80 leading-relaxed max-w-2xl mb-6">{DATA.company.vision_ar}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-3">
            {[" حلال 100%", "⚡ Zero-Friction", "🏰 قلعة + رماح", "🔒 بروتوكول أمني"].map((tag, i) => (
              <span key={i} className="rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">{tag}</span>
            ))}
          </motion.div>
        </div>
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {DATA.kpis.map((kpi: any, i: number) => {
          const { count, ref } = useCounter(parseFloat(kpi.value), 1500, 0);
          return (
            <Card key={i} delay={i * 100} className="p-6 text-center">
              <div ref={ref} className="text-3xl md:text-4xl font-bold text-emerald dark:text-gold font-amiri mb-2">{count}{kpi.unit}</div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">{lang === "ar" ? kpi.label_ar : kpi.label_en}</div>
            </Card>
          );
        })}
      </div>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target size={20} className="text-emerald dark:text-gold" />
          <h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? "حجم السوق" : "Market Size"}</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[{ key: "tam", color: "emerald" }, { key: "sam", color: "gold" }, { key: "som", color: "accent" }].map(({ key, color }) => {
            const d = DATA.market[key as keyof typeof DATA.market];
            return (
              <motion.div key={key} whileHover={{ scale: 1.05 }} className={cn("p-6 rounded-2xl text-center border-2 transition-all", color === "emerald" && "bg-emerald/5 dark:bg-emerald/10 border-emerald/20", color === "gold" && "bg-gold/5 dark:bg-gold/10 border-gold/20", color === "accent" && "bg-accent/5 dark:bg-accent/10 border-accent/20")}>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{lang === "ar" ? d.label_ar : d.label_en}</p>
                <div className={cn("font-amiri", color === "emerald" && "text-emerald", color === "gold" && "text-gold-dark dark:text-gold", color === "accent" && "text-accent")}>
                  <div className="text-4xl font-bold">{d.value}<span className="text-2xl">{d.unit}</span></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function FinancialsView({ fin, setFin, ltv, ltvCac, payback, be, projectionData, t, lang }: any) {
  const COLORS = ["#0F5132", "#D4AF37", "#F97316", "#6B7280", "#1a7a4c", "#b8962e", "#dc2626", "#3b82f6"];
  return (
    <div className="space-y-8">
      <SectionHeader icon={Wallet} title={t.financials.title} subtitle={t.financials.subtitle} />
      <Card className="p-8 overflow-hidden relative" hover={false}>
        <div className="absolute inset-0 bg-dark-bg dark:bg-black opacity-50" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 text-white">
          <div className="space-y-6">
            {[
              { label: lang === "ar" ? "ARPU / Setup Value" : "ARPU / Setup Value", value: fin.arpu, min: 500, max: 5000, step: 100, unit: "SAR", key: "arpu" },
              { label: lang === "ar" ? "نسبة التسرب (Churn)" : "Churn Rate", value: fin.churn, min: 1, max: 20, step: 1, unit: "%", key: "churn" },
              { label: "CAC", value: fin.cac, min: 500, max: 5000, step: 100, unit: "SAR", key: "cac" },
              { label: lang === "ar" ? "عملاء جدد / شهر" : "New Customers / month", value: fin.newCust, min: 1, max: 10, step: 0.1, unit: "", key: "newCust" },
              { label: lang === "ar" ? "هامش الربح (Margin)" : "Margin", value: fin.margin, min: 50, max: 90, step: 5, unit: "%", key: "margin" },
              { label: lang === "ar" ? "التكاليف الثابتة" : "Fixed Costs", value: fin.fixed, min: 1000, max: 10000, step: 500, unit: "SAR", key: "fixed" },
            ].map((slider, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300 group-hover:text-gold transition-colors">{slider.label}</span>
                  <span className="text-sm font-bold text-gold tabular-nums">{typeof slider.value === "number" ? slider.value.toLocaleString() : slider.value} {slider.unit}</span>
                </div>
                <input type="range" min={slider.min} max={slider.max} step={slider.step} value={slider.value} onChange={(e) => setFin({ ...fin, [slider.key]: parseFloat(e.target.value) })} className="w-full accent-gold cursor-pointer" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 content-start">
            {[
              { label: "LTV", value: `${Math.round(ltv).toLocaleString()} SAR`, highlight: false },
              { label: "LTV:CAC", value: `${ltvCac.toFixed(1)}x`, highlight: true },
              { label: lang === "ar" ? "استرداد CAC" : "CAC Payback", value: `${payback.toFixed(1)} ${lang === "ar" ? "شهر" : "mo"}`, highlight: false },
              { label: lang === "ar" ? "نقطة التعادل" : "Break-even", value: `${lang === "ar" ? "شهر" : "Mo"} ${be > 0 && be < 36 ? be : ">36"}`, highlight: true },
              { label: lang === "ar" ? "MRR الشهر 12" : "MRR Month 12", value: `${Math.round(fin.arpu * (fin.newCust * 12 * 0.8)).toLocaleString()} SAR`, highlight: false },
              { label: lang === "ar" ? "MRR الشهر 36" : "MRR Month 36", value: `${Math.round(fin.arpu * (fin.newCust * 36 * 0.6)).toLocaleString()} SAR`, highlight: true },
            ].map((metric, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03 }} className={cn("p-4 rounded-xl text-center transition-all duration-300", metric.highlight ? "bg-gradient-to-br from-gold/20 to-accent/10 border border-gold/30" : "bg-white/5 border border-white/10 hover:border-white/20")}>
                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{metric.label}</div>
                <div className={cn("text-xl font-bold tabular-nums", metric.highlight ? "text-gold" : "text-white")}>{metric.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={18} className="text-emerald dark:text-gold" />
            <h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? `توزيع الأموال ($${DATA.financials.useOfFunds.total.toLocaleString()})` : `Use of Funds ($${DATA.financials.useOfFunds.total.toLocaleString()})`}</h3>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={DATA.financials.useOfFunds.breakdown.map((b: any) => ({ name: lang === "ar" ? b.category_ar : b.category_en, value: b.percentage }))} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                    {DATA.financials.useOfFunds.breakdown.map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <RechartsTooltip formatter={(v: any) => [`${v}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2">
              {DATA.financials.useOfFunds.breakdown.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs p-3 bg-muted/30 dark:bg-dark-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center g
