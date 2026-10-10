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
import { SankeyChart, TreemapChart, SunburstChart, RadarChart, BubbleChart, GanttChart, ChordDiagram } 
  from "@/components/AdvancedCharts";

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
    return { month: \`M\${m}\`, customers: cust, mrr: Math.round(mrr), profit: Math.round(mrr - costs) };
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
                <h1 className="text-lg font-bold text-emerald dark:text-gold font-amiri">{DATA.company.name_ar}</h1>
                <span className="text-xs bg-emerald/10 text-emerald px-2 py-1 rounded-full ml-2">V5.2.0</span>
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
        <div className="absolute inset-0 bg-gradient-to-l from-emerald via-emerald-dark to-emerald noise opacity-90" />
        <div className="relative z-10 max-w-3xl text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm border border-white/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />{t.common.preSeed} • {t.common.investmentReady}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-amiri font-bold leading-tight mb-4">{DATA.company.name_ar}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gold font-semibold mb-4 font-amiri">{DATA.company.tagline_ar}</motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg text-white/80 leading-relaxed max-w-2xl mb-6">{DATA.company.vision_ar}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-3">
            {["🕌 حلال 100%", "⚡ Zero-Friction", "🏰 قلعة + رماح", "🔒 بروتوكول أمني"].map((tag, i) => (
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
        <div className="absolute inset-0 bg-dark-bg dark:bg-black noise opacity-50" />
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
              { label: "LTV", value: \`\${Math.round(ltv).toLocaleString()} SAR\`, highlight: false },
              { label: "LTV:CAC", value: \`\${ltvCac.toFixed(1)}x\`, highlight: true },
              { label: lang === "ar" ? "استرداد CAC" : "CAC Payback", value: \`\${payback.toFixed(1)} \${lang === "ar" ? "شهر" : "mo"}\`, highlight: false },
              { label: lang === "ar" ? "نقطة التعادل" : "Break-even", value: \`\${lang === "ar" ? "شهر" : "Mo"} \${be > 0 && be < 36 ? be : ">36"}\`, highlight: true },
              { label: lang === "ar" ? "MRR الشهر 12" : "MRR Month 12", value: \`\${Math.round(fin.arpu * (fin.newCust * 12 * 0.8)).toLocaleString()} SAR\`, highlight: false },
              { label: lang === "ar" ? "MRR الشهر 36" : "MRR Month 36", value: \`\${Math.round(fin.arpu * (fin.newCust * 36 * 0.6)).toLocaleString()} SAR\`, highlight: true },
            ].map((metric, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03 }} className={cn("p-4 rounded-xl text-center transition-all duration-300", metric.highlight ? "bg-gradient-to-br from-gold/20 to-accent/10 border border-gold/30 shadow-glow-gold" : "bg-white/5 border border-white/10 hover:border-white/20")}>
                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{metric.label}</div>
                <div className={cn("text-xl font-bold tabular-nums", metric.highlight ? "text-gradient-gold" : "text-white")}>{metric.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={18} className="text-emerald dark:text-gold" />
            <h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? \`توزيع الأموال (\$\${DATA.financials.useOfFunds.total.toLocaleString()})\` : \`Use of Funds (\$\${DATA.financials.useOfFunds.total.toLocaleString()})\`}</h3>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={DATA.financials.useOfFunds.breakdown.map((b: any) => ({ name: lang === "ar" ? b.category_ar : b.category_en, value: b.percentage }))} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                    {DATA.financials.useOfFunds.breakdown.map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <RechartsTooltip formatter={(v: any) => [\`\${v}%\`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2">
              {DATA.financials.useOfFunds.breakdown.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs p-3 bg-muted/30 dark:bg-dark-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-semibold">{lang === "ar" ? item.category_ar : item.category_en}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{item.percentage}%</span>
                    <span className="font-bold text-emerald dark:text-gold">\${item.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-emerald dark:text-gold" />
            <h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? "توزيع مصادر الإيراد (Y1)" : "Revenue Streams (Y1)"}</h3>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={DATA.financials.revenueStreams.map((r: any) => ({ name: lang === "ar" ? r.name_ar : r.name_en, value: r.percentage }))} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {DATA.financials.revenueStreams.map((r: any, i: number) => (<Cell key={i} fill={r.color} />))}
                  </Pie>
                  <RechartsTooltip formatter={(v: any) => [\`\${v}%\`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2">
              {DATA.financials.revenueStreams.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs p-3 bg-muted/30 dark:bg-dark-muted/30 rounded-lg border border-border/50">
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
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={18} className="text-emerald dark:text-gold" />
          <h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? "التدفق النقدي والأرباح (12 شهراً)" : "12-Month Cash Flow & Profit"}</h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0F5132" stopOpacity={0.4} /><stop offset="95%" stopColor="#0F5132" stopOpacity={0} /></linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F97316" stopOpacity={0.4} /><stop offset="95%" stopColor="#F97316" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" className="dark:opacity-20" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartsTooltip />
              <Area type="monotone" dataKey="mrr" name="MRR" stroke="#0F5132" strokeWidth={2} fillOpacity={1} fill="url(#colorMrr)" />
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#F97316" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border dark:border-dark-border bg-muted/30 dark:bg-dark-muted/30">
          <h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2"><FileText size={16} /> {lang === "ar" ? "قائمة الأرباح والخسائر (P&L)" : "P&L Statement"}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-emerald text-white">
              <tr><th className="p-4 text-right">{lang === "ar" ? "البند" : "Item"}</th><th className="p-4 text-right">Y1</th><th className="p-4 text-right">Y2</th><th className="p-4 text-right">Y3</th></tr>
            </thead>
            <tbody>
              {[
                { label: lang === "ar" ? "الإيراد" : "Revenue", y1: DATA.financials.projections.y1.revenue, y2: DATA.financials.projections.y2.revenue, y3: DATA.financials.projections.y3.revenue },
                { label: lang === "ar" ? "التكاليف" : "Costs", y1: DATA.financials.projections.y1.costs, y2: DATA.financials.projections.y2.costs, y3: DATA.financials.projections.y3.costs },
                { label: lang === "ar" ? "صافي الربح" : "Net Profit", y1: DATA.financials.projections.y1.profit, y2: DATA.financials.projections.y2.profit, y3: DATA.financials.projections.y3.profit, highlight: true },
              ].map((row, i) => (
                <tr key={i} className={cn("border-b border-border/50 dark:border-dark-border/50 hover:bg-muted/20 transition-colors", row.highlight && "bg-emerald/5 dark:bg-emerald/10 font-bold")}>
                  <td className="p-4">{row.label}</td>
                  <td className={cn("p-4", row.highlight && "text-emerald dark:text-gold")}>SAR {row.y1.toLocaleString()}</td>
                  <td className={cn("p-4", row.highlight && "text-emerald dark:text-gold")}>SAR {row.y2.toLocaleString()}</td>
                  <td className={cn("p-4", row.highlight && "text-emerald dark:text-gold")}>SAR {row.y3.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function BusinessPlanView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={FileText} title={t.businessPlan.title} subtitle={t.businessPlan.subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center bg-emerald/5 border-emerald/20"><div className="text-3xl font-bold text-emerald font-amiri">{DATA.businessPlan.length}</div><div className="text-xs text-gray-500 mt-1">{lang === "ar" ? "قسم شامل" : "Full Sections"}</div></Card>
        <Card className="p-4 text-center bg-gold/5 border-gold/20"><div className="text-3xl font-bold text-gold font-amiri">AR + EN</div><div className="text-xs text-gray-500 mt-1">{lang === "ar" ? "ثنائي اللغة" : "Bilingual"}</div></Card>
        <Card className="p-4 text-center bg-accent/5 border-accent/20"><div className="text-3xl font-bold text-accent font-amiri">49+</div><div className="text-xs text-gray-500 mt-1">{lang === "ar" ? "ملف استراتيجي" : "Strategic Files"}</div></Card>
        <Card className="p-4 text-center bg-emerald/5 border-emerald/20"><div className="text-3xl font-bold text-emerald font-amiri">100%</div><div className="text-xs text-gray-500 mt-1">{lang === "ar" ? "جاهز للتنفيذ" : "Ready to Execute"}</div></Card>
      </div>
      <div className="space-y-4">
        {DATA.businessPlan.map((section: any, i: number) => (
          <motion.details key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} open={i < 3} className="group bg-card dark:bg-dark-card rounded-2xl border border-border dark:border-dark-border shadow-card overflow-hidden open:shadow-elevated open:border-emerald/30">
            <summary className="p-6 cursor-pointer flex justify-between items-center select-none hover:bg-muted/50 dark:hover:bg-dark-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald to-emerald-dark text-gold flex items-center justify-center text-sm font-bold font-amiri shadow-md">{i + 1}</span>
                <div>
                  <span className="text-lg font-bold text-emerald dark:text-gold block">{lang === "ar" ? section.title_ar : section.title_en}</span>
                  <span className="text-xs text-gray-500">{lang === "ar" ? section.title_en : section.title_ar}</span>
                </div>
              </div>
              <ChevronDown size={20} className="text-gray-400 transition-transform duration-300 group-open:rotate-180 text-accent" />
            </summary>
            <div className="px-6 pb-6 pt-0">
              <div className="border-t border-border/50 dark:border-dark-border/50 pt-4 text-gray-700 dark:text-gray-300 leading-[1.9] text-sm whitespace-pre-line">
                {lang === "ar" ? section.content_ar : section.content_en}
              </div>
            </div>
          </motion.details>
        ))}
      </div>
    </div>
  );
}

function SectorsView({ t, lang }: any) {
  const [selected, setSelected] = useState<any>(null);
  return (
    <div className="space-y-6">
      <SectionHeader icon={Target} title={t.sectors.title} subtitle={t.sectors.subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DATA.sectors.map((s: any, i: number) => (
          <motion.button key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6, scale: 1.01 }} onClick={() => setSelected(s)} className={cn("text-right bg-card dark:bg-dark-card rounded-2xl border shadow-card overflow-hidden transition-all", s.status === "active" ? "border-emerald/40 dark:border-emerald/60 shadow-glow" : "border-border dark:border-dark-border")}>
            <div className={cn("p-4 flex justify-between items-center", s.status === "active" ? "bg-gradient-to-l from-emerald to-emerald-dark text-white" : "bg-muted dark:bg-dark-muted")}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{s.icon}</span>
                <div>
                  <h3 className="font-bold text-xl">{lang === "ar" ? s.name_ar : s.name_en}</h3>
                  <p className="text-xs opacity-80">{s.name_en}</p>
                </div>
              </div>
              <Badge color={s.status === "active" ? "green" : "yellow"}>{s.status === "active" ? (lang === "ar" ? "🟢 نشط" : "🟢 Active") : (lang === "ar" ? "🟡 قريباً" : "🟡 Coming")}</Badge>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{lang === "ar" ? s.desc_ar : s.desc_en}</p>
              <div className="bg-emerald/5 dark:bg-emerald/10 p-3 rounded-lg border-r-4 border-emerald">
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 italic">"{lang === "ar" ? s.justification_ar : s.justification_en}"</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-muted/50 dark:bg-dark-muted/50 p-3 rounded-lg text-center"><div className="text-[10px] text-gray-500 uppercase">{lang === "ar" ? "الإطلاق" : "Launch"}</div><div className="font-bold text-emerald dark:text-gold text-sm">{s.timeline}</div></div>
                <div className="bg-muted/50 dark:bg-dark-muted/50 p-3 rounded-lg text-center"><div className="text-[10px] text-gray-500 uppercase">{lang === "ar" ? "العملاء" : "Clients"}</div><div className="font-bold text-accent text-sm">{s.target_clients}</div></div>
                <div className="bg-muted/50 dark:bg-dark-muted/50 p-3 rounded-lg text-center"><div className="text-[10px] text-gray-500 uppercase">{lang === "ar" ? "الجاهزية" : "Ready"}</div><div className="font-bold text-gold-dark dark:text-gold text-sm">{s.readiness.percentage}%</div></div>
              </div>
              <div className="w-full py-2.5 bg-gradient-to-l from-emerald/10 to-gold/10 text-emerald dark:text-gold rounded-xl text-sm font-bold text-center border border-emerald/20 hover:border-emerald/40 transition-colors">{lang === "ar" ? "عرض التحليل الكامل ←" : "View Full Analysis →"}</div>
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
      <SectionHeader icon={MapIcon} title={t.roadmap.title} subtitle={t.roadmap.subtitle} />
      <div className="relative">
        <div className="absolute right-6 top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-emerald to-accent hidden md:block rounded-full" />
        <div className="space-y-6">
          {DATA.roadmap.map((item: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, x: lang === "ar" ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.1 }} className="relative flex gap-6 items-start">
              <div className="hidden md:flex flex-col items-center shrink-0">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-lg border-4 z-10 bg-emerald text-white border-background dark:border-dark-bg">{item.phase_ar.slice(0, 2)}</div>
                {i < DATA.roadmap.length - 1 && <div className="w-0.5 h-4 bg-emerald/30 mt-1" />}
              </div>
              <Card className="flex-1">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? item.phase_ar : item.phase_en}</h3>
                    <Badge color="gold">{lang === "ar" ? item.date_ar : item.date_en}</Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{lang === "ar" ? item.desc_ar : item.desc_en}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RisksView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={AlertTriangle} title={t.risks.title} subtitle={t.risks.subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DATA.risks.map((risk: any, i: number) => (
          <Card key={i} delay={i * 50}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-bold text-emerald dark:text-gold leading-snug">{lang === "ar" ? risk.name_ar : risk.name_en}</h3>
              <div className="flex gap-1 shrink-0">
                <Badge color={risk.prob === "high" ? "red" : risk.prob === "medium" ? "yellow" : "green"}>{risk.prob}</Badge>
                <Badge color={risk.impact === "high" ? "red" : risk.impact === "medium" ? "yellow" : "green"}>{risk.impact}</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{lang === "ar" ? risk.category_ar : risk.category_en}</p>
            <div className="mt-3 p-3 bg-emerald/5 dark:bg-emerald/10 rounded-lg border border-emerald/20">
              <strong className="text-emerald dark:text-gold text-xs uppercase tracking-wider block mb-1">{lang === "ar" ? "خطة التخفيف" : "Mitigation"}</strong>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{lang === "ar" ? risk.mitigation_ar : risk.mitigation_en}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function HardwareView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Cpu} title={t.hardware.title} subtitle={t.hardware.subtitle} />
      <Card className="p-8 overflow-hidden relative" hover={false}>
        <div className="absolute inset-0 bg-gradient-to-l from-emerald via-emerald-dark to-emerald noise opacity-90" />
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gold/20 backdrop-blur-sm flex items-center justify-center border border-gold/30"><Server size={28} className="text-gold" /></div>
            <div>
              <div className="text-xs text-gold-light uppercase tracking-widest">✅ {lang === "ar" ? "التجميعة المختارة" : "Selected Build"}</div>
              <h3 className="text-2xl font-bold text-gold font-amiri">{lang === "ar" ? DATA.hardware.scenario.name_ar : DATA.hardware.scenario.name_en}</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="text-xs text-gray-300 mb-2 uppercase tracking-wider">💻 {lang === "ar" ? "اللابتوب" : "Laptop"}</div>
              <div className="font-bold text-sm mb-2 leading-relaxed">{DATA.hardware.scenario.laptop}</div>
              <div className="text-gold font-bold text-xl">\${DATA.hardware.scenario.laptop_price.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="text-xs text-gray-300 mb-2 uppercase tracking-wider">🖥️ Mini PC</div>
              <div className="font-bold text-sm mb-2 leading-relaxed">{DATA.hardware.scenario.minipc}</div>
              <div className="text-gold font-bold text-xl">\${DATA.hardware.scenario.minipc_price.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="text-xs text-gray-300 mb-2 uppercase tracking-wider">🔌 {lang === "ar" ? "الإكسسوارات" : "Accessories"}</div>
              <div className="font-bold text-sm mb-2 leading-relaxed">{lang === "ar" ? DATA.hardware.scenario.accessories : DATA.hardware.scenario.accessories_en}</div>
              <div className="text-gold font-bold text-xl">\${DATA.hardware.scenario.accessories_price.toLocaleString()}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 bg-gold/20 border border-gold/30 rounded-xl p-5">
            <div className="text-center"><div className="text-xs text-gold-light uppercase tracking-wider">{lang === "ar" ? "الإجمالي" : "Total"}</div><div className="text-3xl font-bold text-gold font-amiri">\${DATA.hardware.scenario.total.toLocaleString()}</div></div>
            <div className="text-center"><div className="text-xs text-gray-300 uppercase tracking-wider">{lang === "ar" ? "المتبقي" : "Remaining"}</div><div className="text-xl font-bold text-white">\${DATA.hardware.scenario.remaining.toLocaleString()}</div></div>
            <div className="text-center"><div className="text-xs text-gray-300 uppercase tracking-wider">{lang === "ar" ? "الميزانية" : "Budget"}</div><div className="text-xl font-bold text-white/70">\${DATA.hardware.scenario.budget.toLocaleString()}</div></div>
          </div>
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border dark:border-dark-border bg-gradient-to-l from-emerald/5 to-transparent">
          <h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2"><Layers size={18} /> {lang === "ar" ? "فئات Mini PC" : "Mini PC Categories"}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 dark:bg-dark-muted/50">
              <tr><th className="p-4 text-right">{lang === "ar" ? "الفئة" : "Category"}</th><th className="p-4 text-right">{lang === "ar" ? "المواصفات" : "Specs"}</th><th className="p-4 text-right">{lang === "ar" ? "السعر" : "Price"}</th></tr>
            </thead>
            <tbody>
              {DATA.hardware.minipc.map((l: any, i: number) => (
                <tr key={i} className="border-b border-border/50 dark:border-dark-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-semibold text-emerald dark:text-gold">{l.category}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{l.specs}</td>
                  <td className="p-4 text-accent font-bold">{l.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

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
  const lines = (lang === "ar" ? currentSlide.content_ar : currentSlide.content_en).split("\n").filter((l: string) => l.trim());

  return (
    <div className="space-y-6">
      <SectionHeader icon={FileCheck} title={t.theAsk.title} subtitle={t.theAsk.subtitle} />
      <Card className="overflow-hidden" hover={false}>
        <div className="p-4 border-b border-border dark:border-dark-border flex justify-between items-center bg-muted/30 dark:bg-dark-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald font-bold text-sm">{slideIdx + 1}</div>
            <div><h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2"><Eye size={16} /> Pitch Deck</h3><p className="text-xs text-gray-500">{DATA.pitchSlides.length} {lang === "ar" ? "شريحة" : "slides"}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSlideIdx(Math.max(0, slideIdx - 1))} disabled={slideIdx === 0} className="p-2 rounded-lg hover:bg-muted dark:hover:bg-dark-muted disabled:opacity-30 transition-all"><SkipBack size={16} /></button>
            <span className="text-xs font-mono text-gray-500 min-w-[50px] text-center">{slideIdx + 1}/{DATA.pitchSlides.length}</span>
            <button onClick={() => setSlideIdx(Math.min(DATA.pitchSlides.length - 1, slideIdx + 1))} disabled={slideIdx === DATA.pitchSlides.length - 1} className="p-2 rounded-lg hover:bg-muted dark:hover:bg-dark-muted disabled:opacity-30 transition-all"><SkipForward size={16} /></button>
          </div>
        </div>
        <div className={cn("relative min-h-[400px] flex flex-col items-center justify-center p-10 overflow-hidden bg-gradient-to-br", currentDesign.bg)}>
          <div className="absolute inset-0 opacity-10"><div className="absolute top-10 left-10 text-[200px] leading-none">{currentDesign.icon}</div><div className="absolute bottom-10 right-10 text-[150px] leading-none opacity-50">{currentDesign.icon}</div></div>
          <div className="absolute inset-0 noise opacity-20" />
          <div className="absolute top-4 left-4 text-gold text-xs font-mono bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-gold/30">SLIDE {slideIdx + 1} / {DATA.pitchSlides.length}</div>
          <motion.div key={slideIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 text-center max-w-3xl">
            <div className="text-6xl mb-6">{currentDesign.icon}</div>
            <h2 className={cn("text-3xl md:text-5xl font-amiri font-bold mb-6", currentDesign.accent === "gold" ? "text-gold" : "text-white")}>{lang === "ar" ? currentSlide.title_ar : currentSlide.title_en}</h2>
            <div className="space-y-4">
              {lines.map((line: string, i: number) => (
                <motion.p key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }} className={cn("text-lg md:text-2xl font-semibold", currentDesign.accent === "gold" ? "text-white/90" : "text-gold/90")}>{line}</motion.p>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="p-4 bg-muted/20 dark:bg-dark-muted/20 border-t border-border">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {DATA.pitchSlides.map((_: any, i: number) => (
              <button key={i} onClick={() => setSlideIdx(i)} className={cn("shrink-0 w-16 h-12 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all border", i === slideIdx ? "bg-emerald text-white border-gold shadow-lg scale-110" : "bg-card dark:bg-dark-card border-border hover:border-emerald text-gray-500")}>
                <span className="text-base">{slideDesigns[i].icon}</span><span>{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function DataRoomView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Briefcase} title={t.dataRoom.title} subtitle={t.dataRoom.subtitle} />
      <DataRoomVault lang={lang} />
    </div>
  );
}

function TeamView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Users} title={t.team.title} subtitle={t.team.subtitle} />
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
    </div>
  );
}

function SecurityView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Shield} title={t.security.title} subtitle={t.security.subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center border-emerald/30">
          <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-4"><Shield size={32} className="text-emerald" /></div>
          <div className="text-5xl font-bold text-emerald dark:text-gold font-amiri mb-2">{DATA.securityHighlights.attacks}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">{lang === "ar" ? "هجمة محاكاة" : "Simulated Attacks"}</div>
        </Card>
        <Card className="p-6 text-center border-gold/30">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4"><Activity size={32} className="text-gold" /></div>
          <div className="text-5xl font-bold text-gold-dark dark:text-gold font-amiri mb-2">{DATA.securityHighlights.hallucinationTests}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">{lang === "ar" ? "سؤال هلوسة مُختبر" : "Hallucination Tests"}</div>
        </Card>
        <Card className="p-6 text-center border-accent/30">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4"><Lock size={32} className="text-accent" /></div>
          <div className="text-3xl font-bold text-accent font-amiri mb-2">{DATA.securityHighlights.encryption}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">{lang === "ar" ? "تشفير البيانات" : "Data Encryption"}</div>
        </Card>
      </div>
    </div>
  );
}

function SettingsView({ t, lang, dark, setDark, setLang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Settings} title={t.settings.title} subtitle={t.settings.subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Globe size={18} className="text-emerald" /> {lang === "ar" ? "اللغة" : "Language"}</h3>
          <div className="flex gap-2">
            <button onClick={() => setLang("ar")} className={cn("flex-1 py-3 rounded-lg font-bold transition-all", lang === "ar" ? "bg-emerald text-white shadow-md" : "bg-muted dark:bg-dark-muted hover:bg-muted/80")}>العربية</button>
            <button onClick={() => setLang("en")} className={cn("flex-1 py-3 rounded-lg font-bold transition-all", lang === "en" ? "bg-emerald text-white shadow-md" : "bg-muted dark:bg-dark-muted hover:bg-muted/80")}>English</button>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">{dark ? <Moon size={18} className="text-gold" /> : <Sun size={18} className="text-amber-500" />} {lang === "ar" ? "المظهر" : "Theme"}</h3>
          <div className="flex gap-2">
            <button onClick={() => setDark(false)} className={cn("flex-1 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2", !dark ? "bg-emerald text-white shadow-md" : "bg-muted dark:bg-dark-muted hover:bg-muted/80")}><Sun size={18} /> {lang === "ar" ? "فاتح" : "Light"}</button>
            <button onClick={() => setDark(true)} className={cn("flex-1 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2", dark ? "bg-emerald text-white shadow-md" : "bg-muted dark:bg-dark-muted hover:bg-muted/80")}><Moon size={18} /> {lang === "ar" ? "داكن" : "Dark"}</button>
          </div>
        </Card>
      </div>
    </div>
  );
  function AdvancedAnalyticsView({ t, lang }: any) {
  const [activeChart, setActiveChart] = useState("sankey");
  const charts = [
    { id: "sankey", name: lang === "ar" ? "مخطط سانكي" : "Sankey", icon: "🌊" },
    { id: "treemap", name: lang === "ar" ? "المخطط المربعي" : "Treemap", icon: "📊" },
    { id: "sunburst", name: lang === "ar" ? "انفجار الشمس" : "Sunburst", icon: "☀️" },
    { id: "radar", name: lang === "ar" ? "المخطط الراداري" : "Radar", icon: "🎯" },
    { id: "bubble", name: lang === "ar" ? "المخطط الفقاعي" : "Bubble", icon: "🫧" },
    { id: "gantt", name: lang === "ar" ? "مخطط جانت" : "Gantt", icon: "📅" },
    { id: "chord", name: lang === "ar" ? "المخطط الوتري" : "Chord", icon: "" },
  ];
  return (
    <div className="space-y-6">
      <SectionHeader icon={BarChart3} title={lang === "ar" ? "التحليلات المتقدمة" : "Advanced Analytics"} subtitle={lang === "ar" ? "مرئيات بيانات تفاعلية متقدمة" : "Advanced Interactive Data Visualizations"} />
      <div className="flex gap-2 overflow-x-auto pb-2">
        {charts.map((chart) => (
          <button key={chart.id} onClick={() => setActiveChart(chart.id)} className={cn("flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border", activeChart === chart.id ? "bg-emerald text-white border-emerald shadow-md" : "bg-card dark:bg-dark-card text-gray-600 dark:text-gray-400 border-border hover:border-emerald/40")}>
            <span className="text-xl">{chart.icon}</span>{chart.name}
          </button>
        ))}
      </div>
      <Card className="p-6">
        <AnimatePresence mode="wait">
          <motion.div key={activeChart} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
            {activeChart === "sankey" && <SankeyChart lang={lang} />}
            {activeChart === "treemap" && <TreemapChart lang={lang} />}
            {activeChart === "sunburst" && <SunburstChart lang={lang} />}
            {activeChart === "radar" && <RadarChart lang={lang} />}
            {activeChart === "bubble" && <BubbleChart lang={lang} />}
            {activeChart === "gantt" && <GanttChart lang={lang} />}
            {activeChart === "chord" && <ChordDiagram lang={lang} />}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
}
