"use client";
import { useState, useEffect, useRef, useContext, createContext } from "react";
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
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { SankeyChart, TreemapChart, SunburstChart, RadarChart, BubbleChart, GanttChart, ChordDiagram } from "@/components/AdvancedCharts";

function SeenLogo({ size = 48 }: any) {
  return (
    <svg viewBox="0 0 160 140" width={size} height={size * 0.875} role="img" aria-label="Seen Agentic logo">
      <defs>
        <linearGradient id="sa-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0F5132" />
          <stop offset="0.6" stopColor="#1a7a4c" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <text x="80" y="92" textAnchor="middle" fontSize="92" fontWeight="800" fill="url(#sa-grad)" style={{ fontFamily: "Cairo, sans-serif" }}>س</text>
      <path d="M18,104 C52,124 108,124 142,104" fill="none" stroke="#F97316" strokeWidth="6" strokeLinecap="round" />
      <text x="80" y="136" textAnchor="middle" fontSize="15" fontWeight="700" fill="currentColor" style={{ fontFamily: "Cairo, sans-serif" }}>seen</text>
    </svg>
  );
}

const AppContext = createContext<any>({});
const PALETTE_CSS = `
:root { --background-rgb: 250 250 248; --emerald-rgb: 15 81 50; --emerald-light-rgb: 26 122 76; --emerald-dark-rgb: 10 61 37; --gold-rgb: 212 175 55; --gold-light-rgb: 232 201 74; --gold-dark-rgb: 184 150 46; }
:root[data-palette="warm"] { --background-rgb: 245 245 245; --emerald-rgb: 251 146 60; --emerald-light-rgb: 253 186 116; --emerald-dark-rgb: 234 88 12; }
`;

const CurrencyContext = createContext<any>({ cur: "SAR", setCur: () => {} });

// أسعار تقريبية للتحويل — حدّثها دورياً
const FX = {
  SAR: { symbol: "SAR ", perSAR: 1 },
  USD: { symbol: "$", perSAR: 1 / 3.75 },
  MYR: { symbol: "RM ", perSAR: 1.12 },
} as const;

// أسعار السوق 2026 (مصادر: Liliputing، Slickdeals، HP، Plugable) — مع تحديث الفئات أعلاه
const MARKET = {
  minipc: DATA.hardware.minipc.map((r: any) => (r.category === "High-End" ? { ...r, price: "$2,400-3,800" } : r)),
  laptops: DATA.hardware.laptops.map((r: any) => (r.category.includes("Unified") ? { ...r, price: "$2,700-3,250" } : r)),
};

const ACCESSORIES_EXTRA = [
  { name_ar: "Thunderbolt 4 Dock (مثال: Plugable)", name_en: "Thunderbolt 4 Dock (e.g. Plugable)", price: "$200-320" },
  { name_ar: "شاشة 27 بوصة 4K (تقدير)", name_en: "27in 4K Monitor (estimate)", price: "$300-500" },
  { name_ar: "UPS 1500VA (تقدير)", name_en: "UPS 1500VA (estimate)", price: "$120-200" },
];

function useMoney() {
  const { cur } = useContext(CurrencyContext);
  const c = (FX as any)[cur] ?? FX.SAR;
  const fmt = (n: number) => `${c.symbol}${Math.round(n).toLocaleString()}`;
  const fxSAR = (n: number) => n * c.perSAR;
  const fxUSD = (n: number) => n * 3.75 * c.perSAR;
  return {
    fmtSAR: (n: number) => fmt(fxSAR(n)),
    fmtUSD: (n: number) => fmt(fxUSD(n)),
    fmtRange: (s: string) => {
      const lo = fxUSD(parseLow(s)), hi = fxUSD(parseHigh(s));
      return `${c.symbol}${Math.round(lo).toLocaleString()}–${Math.round(hi).toLocaleString()}`;
    },
    fxSAR, fxUSD,
  };
}

function AutomationNeural({ lang }: any) {
  const hub = { x: 300, y: 140 };
  const nodes = [
    { x: 300, y: 40, l: lang === "ar" ? "البريد" : "Email" },
    { x: 421, y: 90, l: lang === "ar" ? "واتساب" : "WhatsApp" },
    { x: 421, y: 190, l: lang === "ar" ? "المستندات" : "Docs" },
    { x: 300, y: 240, l: "n8n" },
    { x: 179, y: 190, l: "Supabase" },
    { x: 179, y: 90, l: lang === "ar" ? "الذكاء الاصطناعي" : "AI Models" },
  ];
  return (
    <div className="w-full flex justify-center py-2">
      <svg viewBox="0 0 600 290" className="w-full max-w-3xl h-auto" role="img" aria-label="automation neural link">
        {nodes.map((n, i) => (
          <g key={`line-${i}`}>
            <line x1={hub.x} y1={hub.y} x2={n.x} y2={n.y} stroke="#D4AF37" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="6 6" />
            <circle r="4" fill="#D4AF37">
              <animateMotion dur={`${2 + (i % 3) * 0.6}s`} repeatCount="indefinite" path={`M${hub.x},${hub.y} L${n.x},${n.y}`} />
            </circle>
          </g>
        ))}
        <circle cx={hub.x} cy={hub.y} r="34" fill="#D4AF37" fillOpacity="0.15">
          <animate attributeName="r" values="34;44;34" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.15;0.4;0.15" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx={hub.x} cy={hub.y} r="26" fill="#0F5132" stroke="#D4AF37" strokeWidth="3" />
        <text x={hub.x} y={hub.y + 5} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#D4AF37">SEEN</text>
        {nodes.map((n, i) => (
          <g key={`node-${i}`}>
            <circle cx={n.x} cy={n.y} r="24" fill="#0F5132" stroke="#D4AF37" strokeWidth="2">
              <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur={`${1.6 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
            <text x={n.x} y={n.y + 42} textAnchor="middle" fontSize="12" fill="#6B7280">{n.l}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

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

// نموذج مالي مُصحَّح:
// - الرسوم التأسيسية تُحسب مرة واحدة، والاشتراك الشهري متكرر
// - التسرب شهري: العملاء النشطون = السابقون × (1 - churn) + الجدد
// - تكلفة الاستحواذ CAC تُصرف عند كل عميل جديد
// - الربح الشهري = الإيراد × هامش الربح - (التكاليف الثابتة + الجدد × CAC)
function runModel(f: any) {
  const c = Math.max(f.churn, 0.01) / 100;
  const m = f.margin / 100;
  const ltv = f.setup * m + (f.sub * m) / c;
  const ltvCac = f.cac > 0 ? ltv / f.cac : 0;
  const payback = f.sub * m > 0 ? f.cac / (f.sub * m) : 0;
  let active = 0, cum = f.capital, breakEven: number | null = null, cashOutMonth: number | null = null, minCash = f.capital;
  const proj: any[] = [];
  for (let k = 1; k <= 36; k++) {
    active = active * (1 - c) + f.newCust;
    const mrr = active * f.sub;
    const revenue = mrr + f.newCust * f.setup;
    const costs = f.fixed + f.newCust * f.cac;
    const profit = revenue * m - costs;
    cum += profit;
    minCash = Math.min(minCash, cum);
    if (breakEven === null && profit >= 0) breakEven = k;
    if (cashOutMonth === null && cum < 0) cashOutMonth = k;
    proj.push({ month: `M${k}`, customers: Math.round(active * 10) / 10, mrr: Math.round(mrr), revenue: Math.round(revenue), costs: Math.round(costs), profit: Math.round(profit), cash: Math.round(cum) });
  }
  return { ltv, ltvCac, payback, breakEven, cashOutMonth, minCash: Math.round(minCash), proj, mrr12: proj[11].mrr, mrr36: proj[35].mrr };
}

// توزيع طلب الاستثمار 15,000 دولار حسب الخطة
const USE_OF_FUNDS_TOTAL = 15000;
const USE_OF_FUNDS = {
  total: USE_OF_FUNDS_TOTAL,
  currency: "USD",
  breakdown: [
    { category_ar: "العتاد والأجهزة (فيزيائي)", category_en: "Hardware & Physical Equipment", amount: 9097, icon: "💻", description_ar: "لابتوب HP ZBook Ultra + Mini PC + الشاشات والدوكينق واليو بي إس", description_en: "HP ZBook Ultra laptop + Mini PC + displays, dock and UPS" },
    { category_ar: "الـ APIs والبنية السحابية", category_en: "APIs & Cloud", amount: 1000, icon: "☁️", description_ar: "نماذج الذكاء الاصطناعي، Supabase، n8n، Vercel، Doppler", description_en: "AI model APIs, Supabase, n8n, Vercel, Doppler" },
    { category_ar: "التسويق والوصول للعملاء", category_en: "Marketing & Outreach", amount: 2000, icon: "📣", description_ar: "المحتوى، الإعلانات، والتواصل المباشر مع القطاعات المستهدفة", description_en: "Content, ads and direct outreach to target sectors" },
    { category_ar: "التأسيس القانوني والتشغيل", category_en: "Legal & Operations", amount: 1000, icon: "🏛️", description_ar: "تسجيل الكيان وأعمال تشغيلية أخرى (تقدير)", description_en: "Entity registration and other operations (estimate)" },
    { category_ar: "احتياطي", category_en: "Reserve", amount: 1903, icon: "🛟", description_ar: "احتياطي مالي للطوارئ والفجوات التشغيلية", description_en: "Financial buffer for emergencies and operational gaps" },
  ].map((b) => ({ ...b, percentage: Math.round((b.amount / USE_OF_FUNDS_TOTAL) * 100) })),
};

// أرقام الإدارة المعتمدة للعرض (مخصصة يدوياً)
const TARGETS = { mrr12: 30000, mrr36: 30000 * 3, breakEven: 3, customers12: 20, customers36: 50 };

function kpisFromModel(model: any) {
  return [
    { label_ar: "الإيراد الشهري (شهر 12)", label_en: "MRR Month 12", value: String(TARGETS.mrr12), unit: "SAR", decimals: 0 },
    { label_ar: "الإيراد الشهري (شهر 36)", label_en: "MRR Month 36", value: String(TARGETS.mrr36), unit: "SAR", decimals: 0 },
    { label_ar: "LTV:CAC", label_en: "LTV:CAC", value: model.ltvCac.toFixed(2), unit: "x", decimals: 1 },
    { label_ar: "نقطة التعادل", label_en: "Break-even", value: String(TARGETS.breakEven), unit: "شهر", decimals: 0 },
    { label_ar: "عملاء (شهر 12)", label_en: "Customers M12", value: String(TARGETS.customers12), unit: "", decimals: 0 },
    { label_ar: "عملاء (شهر 36)", label_en: "Customers M36", value: String(TARGETS.customers36), unit: "", decimals: 0 },
  ];
}

function SiteBackground() {
  const blobs = [
    { c: "bg-emerald/15", s: 420, x: "-10%", y: "-5%", d: 22 },
    { c: "bg-gold/20", s: 360, x: "70%", y: "10%", d: 28 },
    { c: "bg-emerald/10", s: 300, x: "30%", y: "60%", d: 25 },
    { c: "bg-gold/15", s: 240, x: "85%", y: "70%", d: 18 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <style>{`
        @keyframes siteDrift{0%{transform:translate(0,0) scale(1)}33%{transform:translate(40px,-30px) scale(1.06)}66%{transform:translate(-30px,25px) scale(.96)}100%{transform:translate(0,0) scale(1)}}
        @keyframes siteGrid{0%{background-position:0 0}100%{background-position:48px 48px}}
      `}</style>
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" style={{ backgroundImage: "linear-gradient(#0F5132 1px, transparent 1px), linear-gradient(90deg, #0F5132 1px, transparent 1px)", backgroundSize: "48px 48px", animation: "siteGrid 20s linear infinite" }} />
      {blobs.map((b, i) => (
        <div key={i} className={`absolute rounded-full blur-3xl ${b.c}`} style={{ width: b.s, height: b.s, left: b.x, top: b.y, animation: `siteDrift ${b.d}s ease-in-out infinite` }} />
      ))}
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("ar");
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [slideIdx, setSlideIdx] = useState(0);
  const [fin, setFin] = useState<any>({
    setup: 1500,
    sub: 2800,
    churn: DATA.financials.churn,
    cac: DATA.financials.cac,
    margin: DATA.financials.margin,
    fixed: DATA.financials.fixedCosts,
    newCust: DATA.financials.newCustomers,
    capital: 15000 * 3.75,
  });
  const [cur, setCur] = useState<"SAR" | "USD" | "MYR">("SAR");
  const [palette, setPalette] = useState<"green" | "warm">("green");
  useEffect(() => {
    document.documentElement.dataset.palette = palette === "warm" ? "warm" : "green";
  }, [palette]);
  const t: any = translations[lang];
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "auto" }); setShowHeader(true); }, [activeTab]);
  const [showHeader, setShowHeader] = useState(true);
  const [hdrH, setHdrH] = useState(0);
  const hdrRef = useRef<HTMLElement>(null);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const d = y - last;
      last = y;
      if (y < 80 || d < 0) setShowHeader(true);
      else if (d > 0) setShowHeader(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const measure = () => setHdrH(hdrRef.current?.offsetHeight ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  const model = runModel(fin);
  const tabs = [
    { id: "dashboard", label: t.menu.dashboard, icon: LayoutDashboard },
    { id: "financials", label: t.menu.financials, icon: Wallet },
    { id: "business-plan", label: t.menu.businessPlan, icon: FileText },
    { id: "sectors", label: t.menu.sectors, icon: Target },
    { id: "roadmap", label: t.menu.roadmap, icon: MapIcon },
    { id: "risks", label: t.menu.risks, icon: AlertTriangle },
    { id: "hardware", label: t.menu.hardware, icon: Cpu },
    { id: "the-ask", label: t.menu.theAsk, icon: FileCheck },
    { id: "data-room", label: t.menu.dataRoom, icon: Briefcase },
    { id: "team", label: t.menu.team, icon: Users },
    { id: "security", label: t.menu.security, icon: Shield },
    { id: "settings", label: t.menu.settings, icon: Settings },
  ];
  return (
    <CurrencyContext.Provider value={{ cur, setCur, palette, setPalette }}>
    <style>{PALETTE_CSS}</style>
    <AppContext.Provider value={{ lang, setLang, dark, setDark }}>
      <div className="relative min-h-screen bg-background dark:bg-dark-bg text-foreground dark:text-white font-cairo transition-colors duration-300 overflow-hidden">
        <SiteBackground />
        <header ref={hdrRef} className={cn("fixed top-0 inset-x-0 z-50 transition-transform duration-300 bg-card/90 dark:bg-dark-card/90 backdrop-blur-xl border-b border-border dark:border-dark-border shadow-lg", showHeader ? "translate-y-0" : "-translate-y-full")}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-gold flex items-center justify-center text-white font-bold shadow-lg overflow-hidden p-1"><SeenLogo size={36} /></div>
              <div>
                <h1 className="text-lg font-bold text-emerald dark:text-gold font-amiri">
                  {lang === "ar" ? DATA.company.name_ar : DATA.company.name_en}
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
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 shadow-sm", activeTab === tab.id ? "bg-gradient-to-l from-emerald to-emerald-dark text-white shadow-md scale-105 border border-emerald/50" : "bg-card dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-muted dark:hover:bg-dark-muted border border-border dark:border-dark-border hover:border-emerald/30")}>
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>
        <div style={{ height: hdrH }} aria-hidden="true" />
        <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: "easeOut" }}>
              {activeTab === "dashboard" && <DashboardView t={t} lang={lang} model={model} />}
              {activeTab === "financials" && <FinancialsView fin={fin} setFin={setFin} model={model} t={t} lang={lang} />}
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
    </CurrencyContext.Provider>
  );
}

const Card = ({ children, className, delay = 0, hover = true }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: delay / 1000, ease: "easeOut" }} whileHover={hover ? { y: -6, scale: 1.01 } : {}} className={cn("bg-card dark:bg-dark-card rounded-2xl border border-border dark:border-dark-border shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden", className)}>
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

function AutomationFlow({ stages, title, lang }: any) {
  const n = stages.length;
  const xs = stages.map((_: any, i: number) => 60 + (i * 480) / (n - 1));
  const path = xs.map((x: number, i: number) => `${i === 0 ? "M" : "L"}${x},60`).join(" ");
  return (
    <div className="w-full">
      {title && <div className="text-sm font-bold text-emerald dark:text-gold mb-1">{title}</div>}
      <svg viewBox="0 0 600 110" className="w-full h-auto" role="img">
        <path d={path} fill="none" stroke="#D4AF37" strokeOpacity="0.35" strokeWidth="3" strokeDasharray="8 6" />
        {[0, 1].map((k) => (
          <circle key={k} r="6" fill="#D4AF37">
            <animateMotion dur="3.2s" begin={`${k * 1.6}s`} repeatCount="indefinite" path={path} />
          </circle>
        ))}
        {stages.map((s: string, i: number) => (
          <g key={i}>
            <circle cx={xs[i]} cy={60} r="20" fill="#0F5132" stroke="#D4AF37" strokeWidth="2">
              <animate attributeName="r" values="20;23;20" dur={`${1.8 + i * 0.2}s`} repeatCount="indefinite" />
            </circle>
            <text x={xs[i]} y={100} textAnchor="middle" fontSize="11" fill="#6B7280">{s}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function AutomationOrbit({ lang }: any) {
  const orbits = [
    { r: 60, dur: "9s", label: lang === "ar" ? "البريد" : "Email", color: "#D4AF37" },
    { r: 100, dur: "14s", label: "WhatsApp", color: "#0F5132" },
    { r: 140, dur: "20s", label: lang === "ar" ? "الذكاء الاصطناعي" : "AI", color: "#D4AF37" },
  ];
  return (
    <div className="w-full flex justify-center">
      <svg viewBox="0 0 600 300" className="w-full max-w-md h-auto" role="img">
        {orbits.map((o, i) => (
          <circle key={`ring-${i}`} cx="300" cy="150" r={o.r} fill="none" stroke="#D4AF37" strokeOpacity="0.25" strokeDasharray="4 6" />
        ))}
        <circle cx="300" cy="150" r="28" fill="#0F5132" stroke="#D4AF37" strokeWidth="3" />
        <text x="300" y="155" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#D4AF37">SEEN</text>
        {orbits.map((o, i) => (
          <g key={`orb-${i}`}>
            <animateTransform attributeName="transform" type="rotate" from="0 300 150" to="360 300 150" dur={o.dur} repeatCount="indefinite" />
            <circle cx={300 + o.r} cy="150" r="12" fill={o.color} />
            <text x={300 + o.r} y="130" textAnchor="middle" fontSize="11" fill="#6B7280">{o.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ScanRing({ lang }: any) {
  return (
    <div className="w-full flex justify-center">
      <svg viewBox="0 0 300 300" className="w-full max-w-xs h-auto" role="img">
        {[40, 80, 120].map((r, i) => (
          <circle key={i} cx="150" cy="150" r={r} fill="none" stroke="#0F5132" strokeOpacity="0.3" strokeWidth="2" />
        ))}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="4s" repeatCount="indefinite" />
          <line x1="150" y1="150" x2="150" y2="30" stroke="#D4AF37" strokeWidth="3" />
          <path d="M150,150 L150,30 A120,120 0 0,1 234,66 Z" fill="#D4AF37" fillOpacity="0.2" />
        </g>
        <circle cx="150" cy="150" r="22" fill="#0F5132" stroke="#D4AF37" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="150" y="155" textAnchor="middle" fontSize="11" fill="#D4AF37">Error</text>
        <text x="150" y="290" textAnchor="middle" fontSize="12" fill="#6B7280">{lang === "ar" ? "مراقبة مستمرة" : "Continuous monitoring"}</text>
      </svg>
    </div>
  );
}

function CircuitPulse({ lang }: any) {
  const lines = [
    "M20,60 L180,60 L180,120 L320,120",
    "M20,180 L120,180 L120,240 L280,240",
    "M320,120 L320,60 L580,60",
    "M280,240 L460,240 L460,180 L580,180",
  ];
  return (
    <div className="w-full flex justify-center">
      <svg viewBox="0 0 600 300" className="w-full h-auto" role="img">
        {lines.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="#0F5132" strokeOpacity="0.25" strokeWidth="3" />
            <path d={d} fill="none" stroke="#D4AF37" strokeWidth="3" strokeDasharray="14 10">
              <animate attributeName="stroke-dashoffset" from="0" to="-48" dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite" />
            </path>
          </g>
        ))}
        {[[180, 60], [320, 120], [460, 240], [280, 240]].map(([x, y], i) => (
          <circle key={`n-${i}`} cx={x} cy={y} r="6" fill="#0F5132">
            <animate attributeName="r" values="6;10;6" dur="1.6s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
          </circle>
        ))}
        <text x="300" y="295" textAnchor="middle" fontSize="12" fill="#6B7280">{lang === "ar" ? "مسارات البيانات" : "Data paths"}</text>
      </svg>
    </div>
  );
}


function BotAvatar({ mode = "typing", size = 150 }: any) {
  const icon = mode === "guard" ? "🛡️" : mode === "archive" ? "🗂️" : mode === "present" ? "📊" : "⚡";
  const id = `bot-${mode}`;
  return (
    <svg viewBox="0 0 200 220" width={size} height={size * 1.1} role="img" aria-label="AI assistant">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E7E5E4" /></linearGradient>
        <linearGradient id={`${id}-visor`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0F5132" /><stop offset="1" stopColor="#0a3d25" /></linearGradient>
        <radialGradient id={`${id}-halo`}><stop offset="0" stopColor="#F97316" stopOpacity="0.35" /><stop offset="1" stopColor="#F97316" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="100" cy="112" r="92" fill={`url(#${id}-halo)`}><animate attributeName="r" values="88;96;88" dur="4s" repeatCount="indefinite" /></circle>
      <ellipse cx="100" cy="206" rx="54" ry="7" fill="#000" opacity="0.15" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="3.2s" repeatCount="indefinite" />
        <line x1="100" y1="30" x2="100" y2="14" stroke="#6b7280" strokeWidth="3" />
        <circle cx="100" cy="11" r="6" fill="#F97316"><animate attributeName="r" values="5;8;5" dur="1.4s" repeatCount="indefinite" /></circle>
        <rect x="56" y="30" width="88" height="68" rx="24" fill={`url(#${id}-body)`} stroke="#D4AF37" strokeWidth="2.5" />
        <rect x="46" y="52" width="9" height="26" rx="4.5" fill="#D4AF37" />
        <rect x="145" y="52" width="9" height="26" rx="4.5" fill="#D4AF37" />
        <rect x="66" y="46" width="68" height="34" rx="14" fill={`url(#${id}-visor)`} />
        <circle cx="84" cy="63" r="6" fill="#F97316"><animate attributeName="ry" values="6;1;6" dur="4s" repeatCount="indefinite" /></circle>
        <circle cx="116" cy="63" r="6" fill="#F97316"><animate attributeName="ry" values="6;1;6" dur="4s" repeatCount="indefinite" /></circle>
        <circle cx="86" cy="61" r="1.8" fill="#fff" /><circle cx="118" cy="61" r="1.8" fill="#fff" />
        <rect x="84" y="86" width="32" height="4" rx="2" fill="#D4AF37"><animate attributeName="opacity" values="0.35;1;0.35" dur="1.2s" repeatCount="indefinite" /></rect>
        <rect x="90" y="98" width="20" height="8" fill="#6b7280" />
        <rect x="64" y="106" width="72" height="64" rx="20" fill={`url(#${id}-body)`} stroke="#D4AF37" strokeWidth="2.5" />
        <circle cx="100" cy="136" r="15" fill="#0F5132" />
        <text x="100" y="142" textAnchor="middle" fontSize="15">{icon}</text>
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-5 66 118;5 66 118;-5 66 118" dur={mode === "typing" ? "0.7s" : "3s"} repeatCount="indefinite" />
          <rect x="46" y="116" width="16" height="50" rx="8" fill="#0F5132" />
          <circle cx="54" cy="170" r="7" fill="#D4AF37" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="rotate" values="5 134 118;-5 134 118;5 134 118" dur={mode === "typing" ? "0.7s" : "3s"} begin="0.35s" repeatCount="indefinite" />
          <rect x="138" y="116" width="16" height="50" rx="8" fill="#0F5132" />
          <circle cx="146" cy="170" r="7" fill="#D4AF37" />
        </g>
        <rect x="80" y="170" width="40" height="18" rx="7" fill="#6b7280" />
      </g>
    </svg>
  );
}

function BotsAround({ children, leftMode = "typing", rightMode = "guard", size = 84 }: any) {
  return (
    <div className="relative">
      <style>{`@keyframes netFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes netDash{to{stroke-dashoffset:-40}}`}</style>
      <div className="flex items-center justify-center gap-3 md:gap-6">
        <div className="shrink-0 relative hidden md:block">
          <BotAvatar mode={leftMode} size={size} />
          <span className="absolute -top-2 -right-4 text-lg" style={{ animation: "netFloat 3s ease-in-out infinite" }}>📄</span>
          <span className="absolute bottom-2 -left-4 text-lg" style={{ animation: "netFloat 4s ease-in-out 0.8s infinite" }}>📊</span>
        </div>
        <div className="flex-1 min-w-0 relative z-10">{children}</div>
        <div className="shrink-0 relative hidden md:block">
          <BotAvatar mode={rightMode} size={size} />
          <span className="absolute -top-2 -left-4 text-lg" style={{ animation: "netFloat 3.5s ease-in-out 0.4s infinite" }}>⚙️</span>
          <span className="absolute bottom-2 -right-4 text-lg" style={{ animation: "netFloat 4.2s ease-in-out 1.2s infinite" }}>🔗</span>
        </div>
      </div>
    </div>
  );
}

function GearWorkshop({ lang }: any) {
  const gear = (cx: number, cy: number, r: number, teeth: number) => {
    const pts: string[] = [];
    for (let i = 0; i < teeth * 2; i++) {
      const a = (i * Math.PI) / teeth; const rr = i % 2 === 0 ? r : r - 10;
      pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
    }
    return pts.join(" ");
  };
  return (
    <svg viewBox="0 0 360 200" className="w-full h-auto" role="img">
      <defs>
        <pattern id="bp-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0 L0 0 0 20" fill="none" stroke="#0F5132" strokeOpacity="0.12" /></pattern>
      </defs>
      <rect x="0" y="0" width="360" height="200" fill="url(#bp-grid)" />
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 120 100" to="360 120 100" dur="12s" repeatCount="indefinite" />
        <polygon points={gear(120, 100, 52, 12)} fill="#0F5132" />
        <circle cx="120" cy="100" r="16" fill="#F5F5F4" />
      </g>
      <g>
        <animateTransform attributeName="transform" type="rotate" from="360 230 100" to="0 230 100" dur="12s" repeatCount="indefinite" />
        <polygon points={gear(230, 100, 40, 10)} fill="#F97316" />
        <circle cx="230" cy="100" r="12" fill="#F5F5F4" />
      </g>
      <text x="180" y="186" textAnchor="middle" fontSize="11" fill="#6B7280">{lang === "ar" ? "أتمتة مترابطة كالتروس" : "Interlocking automation"}</text>
    </svg>
  );
}

function RadarSweep({ size = 320, lang }: any) {
  return (
    <svg viewBox="0 0 300 300" width={size} height={size} role="img">
      {[40, 80, 120, 140].map((r, i) => (<circle key={i} cx="150" cy="150" r={r} fill="none" stroke="#0F5132" strokeOpacity="0.35" strokeWidth="1.5" />))}
      <line x1="150" y1="0" x2="150" y2="300" stroke="#0F5132" strokeOpacity="0.2" />
      <line x1="0" y1="150" x2="300" y2="150" stroke="#0F5132" strokeOpacity="0.2" />
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="4s" repeatCount="indefinite" />
        <path d="M150,150 L150,10 A140,140 0 0,1 249,51 Z" fill="#F97316" fillOpacity="0.25" />
        <line x1="150" y1="150" x2="150" y2="10" stroke="#F97316" strokeWidth="2" />
      </g>
      {[[200, 90], [95, 175], [185, 210]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="#F97316"><animate attributeName="r" values="3;7;3" dur={`${1.4 + i * 0.5}s`} repeatCount="indefinite" /></circle>
      ))}
      <text x="150" y="296" textAnchor="middle" fontSize="11" fill="#6B7280">{lang === "ar" ? "مسح مستمر" : "Continuous scan"}</text>
    </svg>
  );
}

function OfficeBot({ lang }: any) {
  const msgs = lang === "ar"
    ? ["✅ تم إرسال الرسالة", "📊 تم تحديث الشيت", "🗂️ تمت أرشفة الفاتورة"]
    : ["✅ Message sent", "📊 Sheet updated", "🗂️ Invoice archived"];
  return (
    <div className="w-full mt-4 flex items-center justify-center gap-6 flex-wrap">
      <style>{`@keyframes botMsg{0%,100%{opacity:0;transform:translateY(8px)}10%,40%{opacity:1;transform:translateY(0)}50%{opacity:0}}`}</style>
      <div className="relative w-64 h-24">
        {msgs.map((m, i) => (
          <div key={i} className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white dark:bg-dark-card border border-gold/40 shadow-md text-sm font-semibold text-emerald dark:text-gold" style={{ animation: `botMsg 6s ease-in-out ${i * 2}s infinite`, opacity: 0 }}>{m}</div>
        ))}
      </div>
      <BotAvatar mode="typing" size={130} />
    </div>
  );
}

function TickerRail({ lang }: any) {
  const items = lang === "ar" ? ["واتساب", "n8n", "AI", "Supabase", "بريد", "Notion", "Sheets"] : ["WhatsApp", "n8n", "AI", "Supabase", "Email", "Notion", "Sheets"];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden w-full" dir="ltr">
      <style>{`@keyframes seenTicker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      <div className="flex gap-4 w-max" style={{ animation: "seenTicker 18s linear infinite" }}>
        {row.map((s, i) => (
          <div key={i} className="px-5 py-3 rounded-xl bg-emerald text-white font-bold text-sm border border-gold/40 whitespace-nowrap">{s}</div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-2 text-center">{lang === "ar" ? "أدوات التشغيل المتصلة" : "Connected operating tools"}</div>
      <OfficeBot lang={lang} />
    </div>
  );
}

function Constellation({ lang }: any) {
  const pts = [[80, 60], [200, 40], [320, 90], [450, 50], [520, 150], [380, 180], [230, 160], [120, 170]];
  const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [6, 0], [6, 7], [7, 0]];
  return (
    <svg viewBox="0 0 600 220" className="w-full h-auto" role="img">
      {edges.map(([a, b], i) => (
        <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="#D4AF37" strokeOpacity="0.35" strokeWidth="1.5">
          <animate attributeName="stroke-opacity" values="0.15;0.6;0.15" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </line>
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 2 ? 9 : 6} fill={i % 2 ? "#D4AF37" : "#0F5132"} stroke="#D4AF37">
          <animate attributeName="r" values={`${i === 2 ? 9 : 6};${i === 2 ? 12 : 8};${i === 2 ? 9 : 6}`} dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="300" y="212" textAnchor="middle" fontSize="12" fill="#6B7280">{lang === "ar" ? "شبكة الفريق والمهارات" : "Team & skills network"}</text>
    </svg>
  );
}

function Heartbeat({ lang }: any) {
  const d = "M0,110 L120,110 L140,110 L155,60 L170,160 L185,90 L200,110 L340,110 L355,40 L372,180 L390,110 L600,110";
  return (
    <svg viewBox="0 0 600 220" className="w-full h-auto" role="img">
      <path d={d} fill="none" stroke="#0F5132" strokeOpacity="0.2" strokeWidth="3" />
      <path d={d} fill="none" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" strokeDasharray="60 600">
        <animate attributeName="stroke-dashoffset" from="660" to="0" dur="2.6s" repeatCount="indefinite" />
      </path>
      <text x="300" y="212" textAnchor="middle" fontSize="12" fill="#6B7280">{lang === "ar" ? "نبض النظام: مراقبة مستمرة" : "System heartbeat: continuous monitoring"}</text>
    </svg>
  );
}

function PagesStack({ lang }: any) {
  const rots = [-12, 0, 12];
  return (
    <svg viewBox="0 0 600 240" className="w-full h-auto" role="img">
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <animateTransform attributeName="transform" type="rotate" values={`${rots[i]} 300 120;${rots[(i + 1) % 3]} 300 120;${rots[i]} 300 120`} dur={`${3 + i}s`} repeatCount="indefinite" />
          <rect x="200" y="30" width="200" height="170" rx="12" fill={i === 1 ? "#0F5132" : "#F5F5F4"} stroke="#D4AF37" strokeWidth="2" />
          <line x1="225" y1="70" x2="375" y2="70" stroke="#D4AF37" strokeOpacity="0.8" strokeWidth="3" />
          <line x1="225" y1="98" x2="355" y2="98" stroke="#6B7280" strokeOpacity="0.4" />
          <line x1="225" y1="118" x2="365" y2="118" stroke="#6B7280" strokeOpacity="0.4" />
        </g>
      ))}
      <text x="300" y="232" textAnchor="middle" fontSize="12" fill="#6B7280">{lang === "ar" ? "الملفات الاستراتيجية (49 ملف)" : "Strategic files (49)"}</text>
    </svg>
  );
}

function wedge(a0: number, a1: number, r = 110) {
  const p = (a: number) => [150 + r * Math.cos((a * Math.PI) / 180), 150 + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M150,150 L${x0},${y0} A${r},${r} 0 0,1 ${x1},${y1} Z`;
}

function SectorWheel({ lang }: any) {
  const colors = ["#0F5132", "#D4AF37", "#1a7a4c", "#b8962e", "#6B7280"];
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-xs h-auto mx-auto" role="img">
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="30s" repeatCount="indefinite" />
        {colors.map((c, i) => (
          <path key={i} d={wedge(i * 72, i * 72 + 68)} fill={c} fillOpacity="0.85" />
        ))}
      </g>
      <circle cx="150" cy="150" r="42" fill="#F5F5F4" />
      <text x="150" y="155" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0F5132">{lang === "ar" ? "5 قطاعات" : "5 sectors"}</text>
    </svg>
  );
}

function TimelineWave({ stages, lang }: any) {
  const n = stages.length;
  const xs = stages.map((_: any, i: number) => 60 + (i * 480) / (n - 1));
  return (
    <svg viewBox="0 0 600 160" className="w-full h-auto" role="img">
      <path d="M0,80 Q75,20 150,80 T300,80 T450,80 T600,80" fill="none" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" strokeDasharray="800">
        <animate attributeName="stroke-dashoffset" from="800" to="0" dur="3s" repeatCount="indefinite" />
      </path>
      {xs.map((x: number, i: number) => (
        <g key={i}>
          <circle cx={x} cy={80} r="9" fill="#0F5132" stroke="#D4AF37" strokeWidth="2">
            <animate attributeName="r" values="9;13;9" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
          <text x={x} y={122} textAnchor="middle" fontSize="11" fill="#6B7280">{stages[i]}</text>
        </g>
      ))}
    </svg>
  );
}

function RiskHeatmap({ lang }: any) {
  const colors = [["#16a34a", "#eab308", "#dc2626"], ["#eab308", "#f97316", "#dc2626"], ["#f97316", "#dc2626", "#dc2626"]];
  return (
    <svg viewBox="0 0 360 330" className="w-full max-w-sm h-auto mx-auto" role="img">
      {colors.map((row, r) =>
        row.map((c, k) => (
          <rect key={`${r}-${k}`} x={60 + k * 95} y={20 + r * 95} width="88" height="88" rx="10" fill={c} fillOpacity="0.5">
            <animate attributeName="fill-opacity" values="0.25;0.75;0.25" dur={`${1.5 + (r + k) * 0.3}s`} repeatCount="indefinite" />
          </rect>
        ))
      )}
      <text x="180" y="325" textAnchor="middle" fontSize="12" fill="#6B7280">{lang === "ar" ? "مصفوفة الاحتمال × الأثر" : "Probability × Impact matrix"}</text>
    </svg>
  );
}

function IsoBox({ x, y, color, delay }: any) {
  const top = `${x},${y} ${x + 40},${y - 20} ${x + 80},${y} ${x + 40},${y + 20}`;
  const left = `${x},${y} ${x + 40},${y + 20} ${x + 40},${y + 60} ${x},${y + 40}`;
  const right = `${x + 80},${y} ${x + 40},${y + 20} ${x + 40},${y + 60} ${x + 80},${y + 40}`;
  return (
    <g>
      <animateTransform attributeName="transform" type="translate" values="0 0;0 -10;0 0" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
      <polygon points={top} fill="#F5F5F4" />
      <polygon points={left} fill={color} />
      <polygon points={right} fill="#6B7280" />
    </g>
  );
}

function IsoBlocks({ lang }: any) {
  return (
    <svg viewBox="0 0 400 200" className="w-full h-auto" role="img">
      <IsoBox x={60} y={80} color="#0F5132" delay={0} />
      <IsoBox x={160} y={60} color="#D4AF37" delay={0.5} />
      <IsoBox x={260} y={100} color="#1a7a4c" delay={1} />
      <text x="200" y="195" textAnchor="middle" fontSize="12" fill="#6B7280">{lang === "ar" ? "العتاد: لابتوب + Mini PC + ملحقات" : "Hardware: laptop + Mini PC + accessories"}</text>
    </svg>
  );
}

function GrowthBars({ lang }: any) {
  const base = 170;
  const hs = [40, 70, 100, 135, 170];
  const labels = ["Q1", "Q2", "Q3", "Q4", "Q5"];
  return (
    <svg viewBox="0 0 400 210" className="w-full h-auto" role="img">
      {hs.map((h, i) => (
        <g key={i}>
          <rect x={40 + i * 70} width="44" rx="6" fill={i % 2 ? "#D4AF37" : "#0F5132"} y={base - h} height={h}>
            <animate attributeName="height" values={`${h};${h * 0.7};${h}`} dur="3s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
            <animate attributeName="y" values={`${base - h};${base - h * 0.7};${base - h}`} dur="3s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
          </rect>
          <text x={62 + i * 70} y="200" textAnchor="middle" fontSize="11" fill="#6B7280">{labels[i]}</text>
        </g>
      ))}
      <text x="200" y="20" textAnchor="middle" fontSize="12" fill="#6B7280">{lang === "ar" ? "مسار النمو المتوقع" : "Projected growth path"}</text>
    </svg>
  );
}

function FileCards({ lang }: any) {
  const files = lang === "ar" ? ["NDA", "النموذج المالي", "خطة العمل"] : ["NDA", "Financial Model", "Business Plan"];
  return (
    <svg viewBox="0 0 600 200" className="w-full h-auto" role="img">
      {files.map((f, i) => (
        <g key={i}>
          <animateTransform attributeName="transform" type="translate" values="-6 0;0 0;0 0;6 0" keyTimes="0;0.3;0.7;1" dur="4s" begin={`${i}s`} repeatCount="indefinite" />
          <rect x={60 + i * 170} y="50" width="150" height="100" rx="12" fill="#0F5132" stroke="#D4AF37" strokeWidth="2" />
          <text x={135 + i * 170} y="108" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#F5F5F4">{f}</text>
        </g>
      ))}
    </svg>
  );
}

function wedgeDummy() { return null; }

function ConveyorLane({ title, items }: any) {
  return (
    <div className="w-full">
      <div className="text-sm font-bold text-emerald dark:text-gold mb-1">{title}</div>
      <svg viewBox="0 0 600 110" className="w-full h-auto" role="img">
        <rect x="0" y="60" width="600" height="20" rx="10" fill="#6B7280" fillOpacity="0.2" />
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <animateTransform attributeName="transform" type="translate" from="-80 0" to="680 0" dur="6s" begin={`${-k * 2}s`} repeatCount="indefinite" />
            <rect x="0" y="36" width="70" height="40" rx="6" fill="#D4AF37" />
            <text x="35" y="61" textAnchor="middle" fontSize="11" fill="#0F5132">{items[k % items.length]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function BranchFlow({ title, items }: any) {
  const paths = ["M60,60 C200,60 220,25 340,25", "M60,60 L340,60", "M60,60 C200,60 220,95 340,95"];
  const ry = [10, 45, 80];
  return (
    <div className="w-full">
      <div className="text-sm font-bold text-emerald dark:text-gold mb-1">{title}</div>
      <svg viewBox="0 0 600 120" className="w-full h-auto" role="img">
        <circle cx="60" cy="60" r="24" fill="#0F5132" stroke="#D4AF37" strokeWidth="2" />
        <text x="60" y="64" textAnchor="middle" fontSize="10" fill="#F5F5F4">{items[0]}</text>
        {paths.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="#D4AF37" strokeOpacity="0.4" strokeWidth="3" />
            <circle r="5" fill="#D4AF37">
              <animateMotion dur="2.4s" begin={`${i * 0.5}s`} repeatCount="indefinite" path={d} />
            </circle>
            <rect x="340" y={ry[i]} width="200" height="30" rx="8" fill="#0F5132" />
            <text x="440" y={ry[i] + 20} textAnchor="middle" fontSize="12" fill="#F5F5F4">{items[i + 1]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function TimerLoop({ title, items }: any) {
  return (
    <div className="w-full">
      <div className="text-sm font-bold text-emerald dark:text-gold mb-1">{title}</div>
      <svg viewBox="0 0 600 130" className="w-full h-auto" role="img">
        {items.map((s: string, i: number) => (
          <g key={i}>
            <circle cx={60 + i * 120} cy="60" r="28" fill={i === 0 ? "#0F5132" : "#F5F5F4"} stroke="#D4AF37" strokeWidth="2" />
            <text x={60 + i * 120} y="65" textAnchor="middle" fontSize="11" fill={i === 0 ? "#F5F5F4" : "#0F5132"}>{s}</text>
            {i < items.length - 1 && <line x1={88 + i * 120} y1="60" x2={132 + i * 120} y2="60" stroke="#D4AF37" strokeWidth="2" strokeDasharray="4 4" />}
          </g>
        ))}
        <circle cx="60" cy="60" r="34" fill="none" stroke="#D4AF37" strokeOpacity="0.5">
          <animate attributeName="r" values="34;40;34" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

const SECTOR_LANES = [
  { kind: "conveyor", ar: "استقبال الطلبات من واتساب", en: "WhatsApp intake", itemsAr: ["طلب", "رسالة", "صورة", "موعد"], itemsEn: ["Order", "Message", "Photo", "Booking"] },
  { kind: "branch", ar: "توزيع المستندات بالذكاء الاصطناعي", en: "AI document routing", itemsAr: ["مستند", "استخراج", "تقرير", "أرشيف"], itemsEn: ["Document", "Extract", "Report", "Archive"] },
  { kind: "timer", ar: "متابعة وتذكيرات تلقائية", en: "Automated follow-ups", itemsAr: ["موعد", "تذكير", "رد", "إغلاق"], itemsEn: ["Schedule", "Reminder", "Reply", "Close"] },
];

function SectorAutomationPanel({ sector, lang }: any) {
  return (
    <Card className="p-6 space-y-4 [&_svg]:max-h-24 [&_svg]:w-auto" hover={false}>
      <div className="flex items-center justify-between gap-4"><h3 className="text-xl font-bold text-emerald dark:text-gold">{lang === "ar" ? `أتمتة قطاع: ${sector.name_ar}` : `Automation for: ${sector.name_en}`}</h3><BotAvatar mode="typing" size={80} /></div>
      {SECTOR_LANES.map((lane, i) => {
        const title = lang === "ar" ? lane.ar : lane.en;
        const items = lang === "ar" ? lane.itemsAr : lane.itemsEn;
        if (lane.kind === "conveyor") return <ConveyorLane key={i} title={title} items={items} />;
        if (lane.kind === "branch") return <BranchFlow key={i} title={title} items={items} />;
        return <TimerLoop key={i} title={title} items={items} />;
      })}
    </Card>
  );
}

function KpiCard({ kpi, lang, delay }: any) {
  const scale = /K$/i.test(String(kpi.value)) ? 1000 : 1;
  const dec = kpi.decimals ?? 0;
  const { count, ref } = useCounter(parseFloat(kpi.value) * scale, 1500, dec);
  const { fmtSAR } = useMoney();
  const unitLabel = kpi.unit === "شهر" ? (lang === "ar" ? "شهر" : "mo") : kpi.unit;
  const display = kpi.unit === "SAR" ? fmtSAR(count) : `${count.toFixed(dec)}${kpi.unit === "x" ? "x" : unitLabel ? " " + unitLabel : ""}`;
  return (
    <Card delay={delay} className="p-6 text-center">
      <div ref={ref} className="text-3xl md:text-4xl font-bold text-emerald dark:text-gold font-amiri mb-2">
        {display}
      </div>
      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">{lang === "ar" ? kpi.label_ar : kpi.label_en}</div>
    </Card>
  );
}

function AnimatedHero({ t, lang }: any) {
  const tags = lang === "ar" ? ["🕌 حلال 100%", "⚡ Zero-Friction", "🏰 قلعة + رماح", "🔒 بروتوكول أمني"] : ["🕌 100% Halal", "⚡ Zero-Friction", "🏰 Fortress + Spears", "🔒 Security Protocol"];
  const floats = [
    { x: 6, y: 18, s: 44, d: 0 }, { x: 78, y: 12, s: 26, d: 1.2 }, { x: 66, y: 68, s: 56, d: 0.6 },
    { x: 18, y: 72, s: 22, d: 1.8 }, { x: 90, y: 52, s: 34, d: 2.4 },
  ];
  return (
    <Card className="relative p-10 md:p-14 overflow-hidden" hover={false}>
      <style>{`
        @keyframes heroFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes heroPulse{0%{transform:scale(.6);opacity:.7}100%{transform:scale(2.2);opacity:0}}
        @keyframes heroFade{0%,100%{opacity:.35;transform:translateY(6px)}20%,80%{opacity:1;transform:translateY(0)}}
        @keyframes heroSpin{to{transform:rotate(360deg)}}
        @keyframes heroGlow{0%,100%{box-shadow:0 0 0 rgba(212,175,55,0)}50%{box-shadow:0 0 40px rgba(212,175,55,.5)}}
      `}</style>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald via-emerald-dark to-slate-900" />
      {floats.map((f, i) => (
        <div key={i} className="absolute rounded-full bg-gold/15" style={{ left: `${f.x}%`, top: `${f.y}%`, width: f.s, height: f.s, animation: `heroFloat ${4 + i}s ease-in-out ${f.d}s infinite` }} />
      ))}
      <div className="relative mx-auto mb-6 w-32 h-32 md:w-40 md:h-40">
        {[0, 1, 2].map((i) => (
          <span key={i} className="absolute inset-0 rounded-full border-2 border-gold/50" style={{ animation: `heroPulse 2.4s ease-out ${i * 0.8}s infinite` }} />
        ))}
        <div className="absolute inset-6 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-2xl" style={{ animation: "heroGlow 2.4s ease-in-out infinite" }}><SeenLogo size={56} /></div>
        <div className="absolute inset-0" style={{ animation: "heroSpin 12s linear infinite" }}>
          <span className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full bg-gold" />
        </div>
      </div>
      <div className="relative z-20 max-w-3xl mx-auto text-white drop-shadow-md text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold border border-white/20 mb-6">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />{t.common.preSeed} • {t.common.investmentReady}
        </div>
        <h1 className="text-4xl md:text-6xl font-amiri font-bold leading-tight mb-4">{lang === "ar" ? DATA.company.name_ar : DATA.company.name_en}</h1>
        <p className="text-xl text-gold font-semibold mb-4 font-amiri">{lang === "ar" ? DATA.company.tagline_ar : DATA.company.tagline_en}</p>
        <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-6">{lang === "ar" ? DATA.company.vision_ar : DATA.company.vision_en}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {tags.map((tag, i) => (
            <span key={i} className="rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm" style={{ animation: `heroFade 6s ease-in-out ${i * 1.5}s infinite` }}>{tag}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function DashboardView({ t, lang, model }: any) {
  return (
    <div className="space-y-8">
      <AnimatedHero t={t} lang={lang} />
      <Card className="p-4 text-sm text-gray-600 dark:text-gray-400" hover={false}>
        {lang === "ar"
          ? "هذه الأرقام تمثل السيناريو المحافظ (الأدنى المتوقع). العوائد الفعلية قد تكون أعلى مع العملاء ذوي رسوم التأسيس الأكبر، والنمذجة المالية مفتوحة لتعديل كل المدخلات."
          : "These figures represent the conservative scenario (the floor). Actual returns may be higher with clients paying larger setup fees. The financial model is fully open for adjusting every input."}
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5 bg-transparent border-transparent shadow-none hover:shadow-none [&_svg]:max-h-60 [&_svg]:w-auto [&_svg]:mx-auto"><TickerRail lang={lang} /></Card>
        <Card className="p-5 bg-transparent border-transparent shadow-none hover:shadow-none [&_svg]:max-h-48 [&_svg]:w-auto [&_svg]:mx-auto"><Heartbeat lang={lang} /></Card>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpisFromModel(model).map((kpi: any, i: number) => (
          <KpiCard key={i} kpi={kpi} lang={lang} delay={i * 100} />
        ))}
      </div>
      <Card className="p-8 relative overflow-hidden" hover={false}>
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 w-56 h-56 rounded-full bg-emerald/15 blur-3xl" />
        <style>{`@keyframes marketGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-emerald dark:text-gold flex items-center gap-2"><Target size={20} /> {lang === "ar" ? "حجم السوق" : "Market Size"}</h3>
            <span className="text-xs font-mono text-gray-500">TAM → SAM → SOM</span>
          </div>
          <div className="space-y-4">
            {[{ key: "tam", color: "#0F5132", fill: 100 }, { key: "sam", color: "#D4AF37", fill: 70 }, { key: "som", color: "#F97316", fill: 40 }].map(({ key, color, fill }, i) => {
              const d = DATA.market[key as keyof typeof DATA.market];
              return (
                <div key={key} className="relative flex items-center gap-4 p-4 rounded-2xl bg-muted/40 dark:bg-dark-muted/40 border border-border dark:border-dark-border overflow-hidden">
                  <div className="absolute inset-y-0 left-0 rounded-2xl opacity-20" style={{ width: `${fill}%`, background: color, transformOrigin: "left", animation: `marketGrow 1.4s ease-out ${i * 0.2}s both` }} />
                  <div className="relative z-10 w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md" style={{ background: color }}>{key.toUpperCase()}</div>
                  <div className="relative z-10 flex-1">
                    <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">{lang === "ar" ? d.label_ar : d.label_en}</div>
                  </div>
                  <div className="relative z-10 text-3xl font-bold font-amiri" style={{ color }}>{d.value}<span className="text-base ms-1">{d.unit}</span></div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

function FinancialsView({ fin, setFin, model, t, lang }: any) {
  const { ltv, ltvCac, payback, breakEven: be, proj: projectionData } = model;
  const sumYear = (y: number, key: string) => model.proj.slice((y - 1) * 12, y * 12).reduce((s: number, r: any) => s + r[key], 0);
  const yearly: any = {
    y1: { revenue: sumYear(1, "revenue"), costs: sumYear(1, "costs"), profit: sumYear(1, "profit") },
    y2: { revenue: sumYear(2, "revenue"), costs: sumYear(2, "costs"), profit: sumYear(2, "profit") },
    y3: { revenue: sumYear(3, "revenue"), costs: sumYear(3, "costs"), profit: sumYear(3, "profit") },
  };
  const { fmtSAR, fmtUSD, fxSAR } = useMoney();
  const { cur } = useContext(CurrencyContext);
  const COLORS = ["#0F5132", "#D4AF37", "#F97316", "#6B7280", "#1a7a4c", "#b8962e", "#dc2626", "#3b82f6"];
  return (
    <div className="space-y-8">
      <SectionHeader icon={Wallet} title={t.menu.financials} subtitle={""} />
      <AutomationScene kind="orbit" lang={lang} />
      <Card className="p-8 overflow-hidden relative" hover={false}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 text-white">
          <div className="space-y-6">
            {[
              { label: lang === "ar" ? "رسوم التأسيس (لمرة واحدة)" : "Setup Fee (one-time)", value: fin.setup, min: 0, max: 5000, step: 100, unit: "SAR", key: "setup" },
              { label: lang === "ar" ? "الاشتراك الشهري" : "Monthly Subscription", value: fin.sub, min: 0, max: 5000, step: 10, unit: "SAR", key: "sub" },
              { label: lang === "ar" ? "نسبة التسرب الشهري (Churn)" : "Monthly Churn", value: fin.churn, min: 0.1, max: 20, step: 1, unit: "%", key: "churn" },
              { label: "CAC", value: fin.cac, min: 0, max: 5000, step: 100, unit: "SAR", key: "cac" },
              { label: lang === "ar" ? "عملاء جدد / شهر" : "New Customers / month", value: fin.newCust, min: 0, max: 10, step: 0.1, unit: "", key: "newCust" },
              { label: lang === "ar" ? "هامش الربح الإجمالي" : "Gross Margin", value: fin.margin, min: 0, max: 100, step: 5, unit: "%", key: "margin" },
              { label: lang === "ar" ? "التكاليف الثابتة / شهر" : "Fixed Costs / month", value: fin.fixed, min: 0, max: 10000, step: 500, unit: "SAR", key: "fixed" },
                        ].map((slider, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300 group-hover:text-gold transition-colors">{slider.label}</span>
                  <span className="text-sm font-bold text-gold tabular-nums">{slider.unit === "SAR" ? fmtSAR(slider.value) : `${slider.value} ${slider.unit}`}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <input type="range" min={0} max={Math.max(slider.max, slider.value * 2)} step={slider.step} value={slider.value} onChange={(e) => setFin({ ...fin, [slider.key]: parseFloat(e.target.value) })} className="flex-1 accent-gold cursor-pointer" />
                  <input type="number" min={0} step={slider.step} value={slider.value} onChange={(e) => setFin({ ...fin, [slider.key]: parseFloat(e.target.value) || 0 })} className="w-32 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm tabular-nums" />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 content-start">
            {[
              { label: "LTV", value: fmtSAR(Math.round(ltv)), highlight: false },
              { label: "LTV:CAC", value: `${ltvCac.toFixed(1)}x`, highlight: true },
              { label: lang === "ar" ? "استرداد CAC (شهر)" : "CAC Payback (mo)", value: `${payback.toFixed(1)} ${lang === "ar" ? "شهر" : "mo"}`, highlight: false },
              { label: lang === "ar" ? "نقطة التعادل" : "Break-even", value: be ? `${lang === "ar" ? "شهر" : "Mo"} ${be}` : ">36", highlight: true },
              { label: lang === "ar" ? "MRR الشهر 12" : "MRR Month 12", value: fmtSAR(model.mrr12), highlight: false },
              { label: lang === "ar" ? "MRR الشهر 36" : "MRR Month 36", value: fmtSAR(model.mrr36), highlight: true },
              { label: lang === "ar" ? "أدنى رصيد نقدي" : "Lowest Cash Balance", value: fmtSAR(model.minCash), highlight: false },
              { label: lang === "ar" ? "نفاد النقد" : "Cash-out Month", value: model.cashOutMonth ? `${lang === "ar" ? "شهر" : "Mo"} ${model.cashOutMonth}` : (lang === "ar" ? "لا يوجد" : "None"), highlight: true },
            ].map((metric, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03 }} className={cn("p-4 rounded-xl text-center transition-all duration-300", metric.highlight ? "bg-gradient-to-br from-gold/20 to-accent/10 border border-gold/30" : "bg-white/5 border border-white/10 hover:border-white/20")}>
                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{metric.label}</div>
                <div className={cn("text-xl font-bold tabular-nums", metric.highlight ? "text-gold" : "text-white")}>{metric.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
      <Card className="p-4 text-sm text-gray-600 dark:text-gray-400">
        {lang === "ar"
          ? "الافتراضات: رصيد البداية = 15,000 دولار (طلب الاستثمار). LTV = رسوم التأسيس × الهامش + (الاشتراك × الهامش ÷ التسرب الشهري). CAC يُصرف عند كل عميل جديد. الأرقام تتغير مباشرة بتحريك الشرائح."
          : "Assumptions: starting cash = $15,000 (the ask). LTV = setup × margin + (subscription × margin ÷ monthly churn). CAC is paid per new customer. All values update live with the sliders."}
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={18} className="text-emerald dark:text-gold" />
            <h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? `توزيع الأموال (${fmtUSD(USE_OF_FUNDS.total)})` : `Use of Funds (${fmtUSD(USE_OF_FUNDS.total)})`}</h3>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={USE_OF_FUNDS.breakdown.map((b: any) => ({ name: lang === "ar" ? b.category_ar : b.category_en, value: b.percentage }))} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                    {USE_OF_FUNDS.breakdown.map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <RechartsTooltip formatter={(v: any) => [`${v}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2">
              {USE_OF_FUNDS.breakdown.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs p-3 bg-muted/30 dark:bg-dark-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-semibold">{lang === "ar" ? item.category_ar : item.category_en}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{item.percentage}%</span>
                    <span className="font-bold text-emerald dark:text-gold">{fmtUSD(item.amount)}</span>
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
                  <RechartsTooltip formatter={(v: any) => [`${v}%`, ""]} />
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
                    <span className="font-bold text-emerald dark:text-gold">{fmtSAR(item.amount)}</span>
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
          <h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? "التدفق النقدي والأرباح (36 شهراً)" : "36-Month Cash Flow & Profit"}</h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0F5132" stopOpacity={0.4} /><stop offset="95%" stopColor="#0F5132" stopOpacity={0} /></linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F97316" stopOpacity={0.4} /><stop offset="95%" stopColor="#F97316" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
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
                { label: lang === "ar" ? "الإيراد" : "Revenue", y1: yearly.y1.revenue, y2: yearly.y2.revenue, y3: yearly.y3.revenue },
                { label: lang === "ar" ? "التكاليف" : "Costs", y1: yearly.y1.costs, y2: yearly.y2.costs, y3: yearly.y3.costs },
                { label: lang === "ar" ? "صافي الربح" : "Net Profit", y1: yearly.y1.profit, y2: yearly.y2.profit, y3: yearly.y3.profit, highlight: true },
              ].map((row, i) => (
                <tr key={i} className={cn("border-b border-border/50 dark:border-dark-border/50 hover:bg-muted/20 transition-colors", row.highlight && "bg-emerald/5 dark:bg-emerald/10 font-bold")}>
                  <td className="p-4">{row.label}</td>
                  <td className={cn("p-4", row.highlight && "text-emerald dark:text-gold")}>{fmtSAR(row.y1)}</td>
                  <td className={cn("p-4", row.highlight && "text-emerald dark:text-gold")}>{fmtSAR(row.y2)}</td>
                  <td className={cn("p-4", row.highlight && "text-emerald dark:text-gold")}>{fmtSAR(row.y3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-emerald dark:text-gold" />
            <h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? "الإيراد والتكاليف والربح (Y1–Y3)" : "Revenue, Costs & Profit (Y1–Y3)"}</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={["y1", "y2", "y3"].map((k) => ({ year: k.toUpperCase(), revenue: fxSAR(yearly[k].revenue), costs: fxSAR(yearly[k].costs), profit: fxSAR(yearly[k].profit) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="revenue" name={lang === "ar" ? "الإيراد" : "Revenue"} fill="#0F5132" radius={[6, 6, 0, 0]} />
                <Bar dataKey="costs" name={lang === "ar" ? "التكاليف" : "Costs"} fill="#6B7280" radius={[6, 6, 0, 0]} />
                <Bar dataKey="profit" name={lang === "ar" ? "صافي الربح" : "Net Profit"} fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-emerald dark:text-gold" />
            <h3 className="text-lg font-bold text-emerald dark:text-gold">{lang === "ar" ? "تدفق الإيرادات (Sankey)" : "Revenue Flow (Sankey)"}</h3>
          </div>
          <SankeyChart lang={lang} />
        </Card>
      </div>
    </div>
  );
}

function BusinessPlanView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={FileText} title={t.menu.businessPlan} subtitle={""} />
      <AutomationScene kind="flow" lang={lang} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center bg-emerald/5 border-emerald/20"><div className="text-3xl font-bold text-emerald font-amiri">{DATA.businessPlan.length}</div><div className="text-xs text-gray-500 mt-1">{lang === "ar" ? "قسم شامل" : "Full Sections"}</div></Card>
        <Card className="p-4 text-center bg-gold/5 border-gold/20"><div className="text-3xl font-bold text-gold font-amiri">AR + EN</div><div className="text-xs text-gray-500 mt-1">{lang === "ar" ? "ثنائي اللغة" : "Bilingual"}</div></Card>
        <Card className="p-4 text-center bg-accent/5 border-accent/20"><div className="text-3xl font-bold text-accent font-amiri">49</div><div className="text-xs text-gray-500 mt-1">{lang === "ar" ? "ملف استراتيجي" : "Strategic Files"}</div></Card>
        <Card className="p-4 text-center bg-emerald/5 border-emerald/20"><div className="text-3xl font-bold text-emerald font-amiri">100%</div><div className="text-xs text-gray-500 mt-1">{lang === "ar" ? "جاهز للتنفيذ" : "Ready to Execute"}</div></Card>
      </div>
      <div className="space-y-4">
        {DATA.businessPlan.map((section: any, i: number) => (
          <motion.details key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} open={false} className="group bg-card dark:bg-dark-card rounded-2xl border border-border dark:border-dark-border shadow-card overflow-hidden open:shadow-elevated open:border-emerald/30">
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

function MiniAutomation({ seed, lang }: any) {
  const palettes = [["#0F5132", "#D4AF37"], ["#D4AF37", "#1a7a4c"], ["#1a7a4c", "#b8962e"], ["#b8962e", "#0F5132"], ["#6B7280", "#D4AF37"]];
  const [a, b] = palettes[seed % palettes.length];
  const path = "M20,30 L140,30 L180,12 L280,12 M140,30 L180,48 L280,48";
  return (
    <svg viewBox="0 0 300 60" className="w-full h-auto" role="img">
      <path d={path} fill="none" stroke={a} strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 5" />
      {[0, 1, 2].map((k) => (
        <circle key={k} r="4" fill={b}>
          <animateMotion dur={`${2.2 + k * 0.4}s`} begin={`${k * 0.7}s`} repeatCount="indefinite" path={k === 1 ? "M140,30 L180,48 L280,48" : "M20,30 L140,30 L180,12 L280,12"} />
        </circle>
      ))}
      <circle cx="20" cy="30" r="7" fill={a}><animate attributeName="r" values="6;9;6" dur="1.8s" repeatCount="indefinite" /></circle>
      <circle cx="280" cy="12" r="6" fill={b}><animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" /></circle>
      <circle cx="280" cy="48" r="6" fill={b}><animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" /></circle>
    </svg>
  );
}

function SectorsView({ t, lang }: any) {
  const [selected, setSelected] = useState<any>(null);
  return (
    <div className="space-y-6">
      <SectionHeader icon={Target} title={t.menu.sectors} subtitle={""} />
      <BotsAround leftMode="typing" rightMode="guard" size={84}><Card className="p-5 bg-transparent border-transparent shadow-none hover:shadow-none [&_svg]:max-h-48 [&_svg]:w-auto [&_svg]:mx-auto"><SectorWheel lang={lang} /></Card></BotsAround>
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
              <MiniAutomation seed={i} lang={lang} />
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      </div>
      {selected && <SectorAutomationPanel sector={selected} lang={lang} />}
      {selected && <SectorModal sector={selected} lang={lang} onClose={() => setSelected(null)} />}
    </div>
  );
}

function RoadmapGantt({ lang }: any) {
  const rows = [
    { ar: "الفكرة والتحقق", en: "Idea & validation", s: 0, e: 6, c: "#0F5132" },
    { ar: "التأسيس والعتاد", en: "Legal & hardware", s: 6, e: 9, c: "#1a7a4c" },
    { ar: "الإطلاق التجريبي", en: "Beta launch", s: 9, e: 10, c: "#D4AF37" },
    { ar: "أول عميل مدفوع", en: "First paid client", s: 9, e: 12, c: "#F97316" },
    { ar: "التوسع الأول", en: "First expansion", s: 12, e: 18, c: "#b8962e" },
    { ar: "القيادة الإقليمية", en: "Regional leadership", s: 24, e: 36, c: "#6B7280" },
  ];
  const ticks = [[0, "Q1 26"], [6, "Q3 26"], [12, "Q1 27"], [18, "Q3 27"], [24, "Q1 28"], [30, "Q3 28"], [36, "End 28"]];
  const left = 150, width = 420, rowH = 40, top = 14;
  const x = (m: number) => left + (m / 36) * width;
  const H = top + rows.length * rowH + 30;
  return (
    <svg viewBox={`0 0 600 ${H}`} className="w-full h-auto" role="img">
      {ticks.map(([m, l]: any) => (
        <g key={m}>
          <line x1={x(m)} y1={top} x2={x(m)} y2={H - 28} stroke="#6B7280" strokeOpacity="0.25" />
          <text x={x(m)} y={H - 8} textAnchor="middle" fontSize="10" fill="#6B7280">{l}</text>
        </g>
      ))}
      {rows.map((r, i) => {
        const y = top + i * rowH;
        const w = Math.max(6, x(r.e) - x(r.s));
        return (
          <g key={i}>
            <text x={left - 8} y={y + 20} textAnchor="end" fontSize="11" fill="#1A1A1A">{lang === "ar" ? r.ar : r.en}</text>
            <rect x={x(r.s)} y={y + 8} width={w} height={18} rx={9} fill={r.c}>
              <animate attributeName="width" from="0" to={w} dur="1.2s" fill="freeze" />
            </rect>
            <circle cx={x(r.s)} cy={y + 17} r="4" fill="#fff" />
          </g>
        );
      })}
    </svg>
  );
}

const RM_YEARS = [
  { y: "2026", q: [
    { t: "Q1 — الفكرة والتحقق", en: "Q1 — Idea & validation", i: "💡", items: ["دراسة السوق وتحليل المنافسين", "بناء الـ 49 ملفاً الاستراتيجي"], ie: ["Market study and competitor analysis", "Building the 49 strategic files"] },
    { t: "Q2 — اختبار الطلب والتسعير", en: "Q2 — Demand & pricing tests", i: "🔎", items: ["اختبار القطاعات المستهدفة", "صياغة الباقات والتسعير"], ie: ["Testing target sectors", "Shaping packages and pricing"] },
    { t: "Q3 — التأسيس القانوني والعتاد", en: "Q3 — Legal setup & hardware", i: "🏛️", items: ["تسجيل الكيان في ماليزيا", "شراء العتاد وإعداد البنية التحتية"], ie: ["Entity registration in Malaysia", "Hardware purchase and infrastructure setup"] },
    { t: "Q4 — الإطلاق وأول عميل", en: "Q4 — Launch & first client", i: "⭐", items: ["أكتوبر: الإطلاق التجريبي", "نوفمبر: تشغيل مع مختبرين", "Q4: أول عميل مدفوع", "ديسمبر: مراجعة نهاية السنة"], ie: ["October: beta launch", "November: pilot with testers", "Q4: first paid client", "December: year-end review"] },
  ]},
  { y: "2027", q: [
    { t: "Q1 — التوسع الأول", en: "Q1 — First expansion", i: "📈", items: ["الوصول إلى 20 عميل", "إطلاق رمح الطب"], ie: ["Reaching 20 clients", "Launching the medical spear"] },
    { t: "Q2 — تثبيت التوسع", en: "Q2 — Consolidating growth", i: "🧱", items: ["رفع الاحتفاظ بالعملاء", "توحيد قوالب المسارات"], ie: ["Improving client retention", "Standardizing workflow templates"] },
    { t: "Q3 — قوالب قابلة للتكرار", en: "Q3 — Repeatable templates", i: "🧩", items: ["تحويل المسارات المتكررة إلى قوالب", "قوالب حسب نوع العميل"], ie: ["Turning repeated workflows into templates", "Templates by client type"] },
    { t: "Q4 — مؤشرات الأداء", en: "Q4 — Performance metrics", i: "📊", items: ["متابعة الاحتفاظ", "متابعة الإيراد الشهري كأساس للتوسع"], ie: ["Tracking retention", "Tracking monthly revenue as the basis for scaling"] },
  ]},
  { y: "2028", q: [
    { t: "Q1 — بداية القيادة الإقليمية", en: "Q1 — Regional leadership begins", i: "🌱", items: ["التوسع إلى قطاعات أوسع", "بعد إثبات النموذج"], ie: ["Expanding to wider sectors", "After proving the model"] },
    { t: "Q2 — القيادة الإقليمية", en: "Q2 — Regional leadership", i: "🌍", items: ["80+ عميل", "MRR: SAR 250K"], ie: ["80+ clients", "MRR: SAR 250K"] },
    { t: "Q3 — منتجات الاشتراك", en: "Q3 — Subscription products", i: "📦", items: ["تحويل الخطوط الجاهزة إلى منتجات برمجية", "منتجات Micro-SaaS للاشتراك"], ie: ["Turning ready pipelines into software products", "Micro-SaaS subscription products"] },
    { t: "Q4 — تقييم وتوسيع", en: "Q4 — Review & scale", i: "🏁", items: ["مراجعة الأداء", "خطة التوسع للسنوات التالية"], ie: ["Performance review", "Scaling plan for the following years"] },
  ]},
];

function RoadmapView({ t, lang }: any) {
  const [active, setActive] = useState(0);
  const rmRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const onScroll = () => {
      let idx = 0;
      rmRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.6) idx = i;
      });
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  let n = -1;
  return (
    <div className="space-y-10">
      <SectionHeader icon={MapIcon} title={t.menu.roadmap} subtitle="" />
      {RM_YEARS.map((yr) => (
        <div key={yr.y} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-emerald text-white font-bold text-lg">{yr.y}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-gold/60 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {yr.q.map((q) => {
              n += 1;
              const idx = n;
              const lit = idx <= active;
              return (
                <motion.div key={idx} ref={(el) => { rmRefs.current[idx] = el; }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: lit ? 1 : 0.2, y: 0, scale: idx === active ? 1.03 : 1, filter: lit ? "none" : "grayscale(1) brightness(0.55)" }}
                  transition={{ duration: 0.5 }}>
                  <Card className={cn("h-full transition-shadow duration-500", idx === active && "ring-2 ring-gold shadow-glow-gold")}>
                    <div className="p-5">
                      <div className="text-3xl mb-2">{q.i}</div>
                      <h3 className="text-base font-bold text-emerald dark:text-gold mb-3">{lang === "ar" ? q.t : q.en}</h3>
                      <ul className="space-y-2">
                        {(lang === "ar" ? q.items : q.ie).map((it, k) => (
                          <li key={k} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex gap-2"><span className="text-gold">•</span><span>{it}</span></li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function HangingWeight({ lang }: any) {
  return (
    <div className="w-full flex justify-center">
      <svg viewBox="0 0 400 140" className="w-full max-w-md h-auto" role="img">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-14 200 0;14 200 0;-14 200 0" dur="3.6s" repeatCount="indefinite" />
          <line x1="200" y1="0" x2="200" y2="90" stroke="#6B7280" strokeWidth="2" />
          <circle cx="200" cy="102" r="16" fill="#dc2626"><animate attributeName="r" values="16;19;16" dur="1.8s" repeatCount="indefinite" /></circle>
        </g>
        <text x="200" y="136" textAnchor="middle" fontSize="12" fill="#6B7280">{lang === "ar" ? "المخاطر المعلّقة تحت المراقبة" : "Risks under watch"}</text>
      </svg>
    </div>
  );
}

function RiskBars({ prob, impact }: any) {
  const v = (x: string) => (x === "high" ? 90 : x === "medium" ? 55 : 25);
  return (
    <div className="space-y-2 mt-3">
      {[["P", v(prob), "#eab308"], ["I", v(impact), "#dc2626"]].map(([k, w, c]: any) => (
        <div key={k} className="flex items-center gap-2 text-xs">
          <span className="w-4 font-bold">{k}</span>
          <div className="flex-1 h-2 rounded-full bg-muted dark:bg-dark-muted overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${w}%`, background: c, transition: "width 1.2s ease" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RisksView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={AlertTriangle} title={t.menu.risks} subtitle={""} />
      <AutomationScene kind="alarm" lang={lang} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {DATA.risks.map((risk: any, i: number) => (
          <Card key={i} delay={i * 50} className="p-8 min-h-[260px] border-2 hover:border-gold/60">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-bold text-emerald dark:text-gold leading-snug">{lang === "ar" ? risk.name_ar : risk.name_en}</h3>
              <div className="flex gap-1 shrink-0">
                <Badge color={risk.prob === "high" ? "red" : risk.prob === "medium" ? "yellow" : "green"}>{risk.prob}</Badge>
                <Badge color={risk.impact === "high" ? "red" : risk.impact === "medium" ? "yellow" : "green"}>{risk.impact}</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{lang === "ar" ? risk.category_ar : risk.category_en}</p>
            <RiskBars prob={risk.prob} impact={risk.impact} />
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
  const { fmtUSD, fmtRange, fxUSD } = useMoney();
  return (
    <div className="space-y-6">
      <SectionHeader icon={Cpu} title={t.menu.hardware} subtitle={""} />
      <AutomationScene kind="chip" lang={lang} />
      <div className="flex justify-center"><BotAvatar mode="typing" size={120} /></div>
      <Card className="p-8 overflow-hidden relative" hover={false}>
        <div className="absolute inset-0 bg-gradient-to-l from-emerald via-emerald-dark to-emerald opacity-90" />
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
              <div className="text-gold font-bold text-xl">{fmtUSD(DATA.hardware.scenario.laptop_price)}</div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="text-xs text-gray-300 mb-2 uppercase tracking-wider">🖥️ Mini PC</div>
              <div className="font-bold text-sm mb-2 leading-relaxed">{DATA.hardware.scenario.minipc}</div>
              <div className="text-gold font-bold text-xl">{fmtUSD(DATA.hardware.scenario.minipc_price)}</div>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div className="text-xs text-gray-300 mb-2 uppercase tracking-wider">🔌 {lang === "ar" ? "الإكسسوارات" : "Accessories"}</div>
              <div className="font-bold text-sm mb-2 leading-relaxed">{lang === "ar" ? DATA.hardware.scenario.accessories : DATA.hardware.scenario.accessories_en}</div>
              <div className="text-gold font-bold text-xl">{fmtUSD(DATA.hardware.scenario.accessories_price)}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 bg-gold/20 border border-gold/30 rounded-xl p-5">
            <div className="text-center"><div className="text-xs text-gold-light uppercase tracking-wider">{lang === "ar" ? "الإجمالي" : "Total"}</div><div className="text-3xl font-bold text-gold font-amiri">{fmtUSD(DATA.hardware.scenario.total)}</div></div>
            <div className="text-center"><div className="text-xs text-gray-300 uppercase tracking-wider">{lang === "ar" ? "المتبقي" : "Remaining"}</div><div className="text-xl font-bold text-white">{fmtUSD(DATA.hardware.scenario.remaining)}</div></div>
            <div className="text-center"><div className="text-xs text-gray-300 uppercase tracking-wider">{lang === "ar" ? "الميزانية" : "Budget"}</div><div className="text-xl font-bold text-white/70">{fmtUSD(DATA.hardware.scenario.budget)}</div></div>
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
              {MARKET.minipc.map((l: any, i: number) => (
                <tr key={i} className="border-b border-border/50 dark:border-dark-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-semibold text-emerald dark:text-gold">{l.category}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{l.specs}</td>
                  <td className="p-4 text-accent font-bold">{fmtRange(l.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="font-bold text-emerald dark:text-gold mb-4">{lang === "ar" ? "مقارنة أسعار Mini PC" : "Mini PC Price Range"}</h3>
        <PriceRangeChart items={MARKET.minipc} />
        <div className="mt-6"><TreemapChart lang={lang} /></div>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border dark:border-dark-border bg-gradient-to-l from-emerald/5 to-transparent">
          <h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2"><Cpu size={18} /> {lang === "ar" ? "اللابتوبات: المنافسون والفئات" : "Laptops: Competitors & Categories"}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 dark:bg-dark-muted/50">
              <tr><th className="p-4 text-right">{lang === "ar" ? "الفئة" : "Category"}</th><th className="p-4 text-right">{lang === "ar" ? "المواصفات" : "Specs"}</th><th className="p-4 text-right">{lang === "ar" ? "السعر" : "Price"}</th><th className="p-4 text-right">AI</th></tr>
            </thead>
            <tbody>
              {MARKET.laptops.map((l: any, i: number) => {
                const isSelected = l.category.includes("Unified");
                return (
                  <tr key={i} className={cn("border-b border-border/50 dark:border-dark-border/50 hover:bg-muted/20 transition-colors", isSelected && "bg-gold/10 font-bold")}>
                    <td className="p-4 font-semibold text-emerald dark:text-gold">{l.category}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{l.specs}</td>
                    <td className="p-4 text-accent font-bold">{fmtRange(l.price)}</td>
                    <td className="p-4">{l.ai}</td>
                  </tr>
                );
              })}
              <tr className="bg-gold/10 font-bold">
                <td className="p-4 text-gold-dark dark:text-gold">{lang === "ar" ? "المختار" : "Selected"}</td>
                <td className="p-4">{DATA.hardware.scenario.laptop}</td>
                <td className="p-4 text-accent">{fmtUSD(DATA.hardware.scenario.laptop_price)}</td>
                <td className="p-4">70B-120B</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-6">
          <PriceRangeChart items={MARKET.laptops} />
          <div className="mt-6"><RadarChart lang={lang} /></div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border dark:border-dark-border bg-gradient-to-l from-emerald/5 to-transparent">
          <h3 className="font-bold text-emerald dark:text-gold flex items-center gap-2"><Layers size={18} /> {lang === "ar" ? "الشاشات والإكسسوارات" : "Displays & Accessories"}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 dark:bg-dark-muted/50">
              <tr><th className="p-4 text-right">{lang === "ar" ? "البند" : "Item"}</th><th className="p-4 text-right">{lang === "ar" ? "السعر" : "Price"}</th></tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50 dark:border-dark-border/50">
                <td className="p-4 font-semibold text-emerald dark:text-gold">{lang === "ar" ? DATA.hardware.scenario.accessories : DATA.hardware.scenario.accessories_en}</td>
                <td className="p-4 text-accent font-bold">{fmtUSD(DATA.hardware.scenario.accessories_price)}</td>
              </tr>
              {ACCESSORIES_EXTRA.map((a, i) => (
                <tr key={i} className="border-b border-border/50 dark:border-dark-border/50">
                  <td className="p-4">{lang === "ar" ? a.name_ar : a.name_en}</td>
                  <td className="p-4 text-accent font-bold">{fmtRange(a.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: lang === "ar" ? "اللابتوب" : "Laptop", value: fxUSD(DATA.hardware.scenario.laptop_price) },
                { name: "Mini PC", value: fxUSD(DATA.hardware.scenario.minipc_price) },
                { name: lang === "ar" ? "الإكسسوارات" : "Accessories", value: fxUSD(DATA.hardware.scenario.accessories_price) },
                { name: lang === "ar" ? "المتبقي" : "Remaining", value: fxUSD(DATA.hardware.scenario.remaining) },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip />
                <Bar dataKey="value" name="USD" fill="#0F5132" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
}

const parseLow = (s: string) => parseFloat(s.split("-")[0].replace(/[^0-9.]/g, "")) || 0;
const parseHigh = (s: string) => { const p = s.split("-"); return parseFloat((p[1] ?? p[0]).replace(/[^0-9.]/g, "")) || 0; };

function PriceRangeChart({ items }: any) {
  const { fxUSD } = useMoney();
  const data = items.map((i: any) => ({ name: String(i.category).replace(/⭐/g, "").trim(), min: fxUSD(parseLow(i.price)), max: fxUSD(parseHigh(i.price)) }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <RechartsTooltip />
          <Legend />
          <Bar dataKey="min" name="Min USD" fill="#0F5132" radius={[6, 6, 0, 0]} />
          <Bar dataKey="max" name="Max USD" fill="#D4AF37" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const slideDesigns = [
  { bg: "from-emerald via-emerald-dark to-emerald", icon: "🏢", accent: "gold" },
  { bg: "from-red-900 via-red-800 to-red-900", icon: "⚠️", accent: "white" },
  { bg: "from-emerald via-emerald-dark to-gold", icon: "💡", accent: "gold" },
  { bg: "from-blue-900 via-blue-800 to-blue-900", icon: "🚀", accent: "gold" },
  { bg: "from-purple-900 via-purple-800 to-emerald", icon: "📊", accent: "gold" },
  { bg: "from-gold-dark via-gold to-amber-600", icon: "", accent: "white" },
  { bg: "from-emerald-dark via-emerald to-gold", icon: "✅", accent: "white" },
  { bg: "from-slate-900 via-slate-800 to-emerald", icon: "🎯", accent: "gold" },
  { bg: "from-gold via-amber-500 to-emerald", icon: "⭐", accent: "white" },
  { bg: "from-blue-900 via-indigo-800 to-purple-900", icon: "📈", accent: "gold" },
  { bg: "from-emerald via-emerald-dark to-slate-900", icon: "", accent: "gold" },
  { bg: "from-gold-dark via-gold to-emerald", icon: "📊", accent: "white" },
  { bg: "from-emerald via-emerald-dark to-gold", icon: "", accent: "gold" },
  { bg: "from-slate-900 via-emerald-dark to-gold", icon: "🌟", accent: "gold" },
];

function SlideFlow({ idx }: any) {
  const base = 6 + (idx % 4);
  const paths = [
    "M-20,300 C160,180 300,380 460,240 S760,120 840,200",
    "M-20,120 C180,220 340,40 520,140 S760,300 840,260",
    "M-20,420 C200,330 380,460 560,360 S760,400 840,340",
  ];
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none opacity-60" aria-hidden="true">
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p} fill="none" stroke="#D4AF37" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="8 10">
            <animate attributeName="stroke-dashoffset" from="0" to="-72" dur={`${base + i}s`} repeatCount="indefinite" />
          </path>
          <circle r="6" fill={i === 1 ? "#F97316" : "#FFFFFF"}>
            <animateMotion dur={`${base + i * 1.5}s`} repeatCount="indefinite" path={p} />
          </circle>
          <circle r="4" fill="#D4AF37">
            <animateMotion dur={`${base + i * 1.5}s`} begin={`${base / 2}s`} repeatCount="indefinite" path={p} />
          </circle>
        </g>
      ))}
      {[[120, 90], [640, 110], [400, 430]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="9" fill="#0F5132" stroke="#D4AF37" strokeWidth="2">
          <animate attributeName="r" values="8;13;8" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

function TheAskView({ slideIdx, setSlideIdx, t, lang }: any) {
  const currentSlide = DATA.pitchSlides[slideIdx];
  const currentDesign = slideDesigns[slideIdx];
  const lines = (lang === "ar" ? currentSlide.content_ar : currentSlide.content_en).split("\n").filter((l: string) => l.trim());
  return (
    <div className="space-y-6">
      <SectionHeader icon={FileCheck} title={t.menu.theAsk} subtitle={""} />
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
          <div className="absolute top-4 left-4 text-gold text-xs font-mono bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-gold/30">SLIDE {slideIdx + 1} / {DATA.pitchSlides.length}</div>
          <SlideFlow idx={slideIdx} />
          <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-gold/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-28 -left-16 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
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
      <Card className="p-6 bg-transparent dark:bg-transparent border-transparent shadow-none"><GrowthBars lang={lang} /></Card>
    </div>
  );
}

const DR_GROUPS = [
  { key: "shared", ar: "ملفات مشتركة", en: "Shared documents", color: "#2563eb", count: 19, items: ["ONE PAGER", "PITCH DECK", "MARKET SIZING", "MARKET POSITIONING", "COMPETITOR INTELLIGENCE", "CUSTOMER PERSONAS", "SERVICES OFFERS", "PRICING VALIDATION", "FOUNDER PROFILE", "BRAND IDENTITY", "LANDING PAGE COPY", "GLOSSARY", "DATA ROOM INDEX", "PROJECT TRUTH", "HARDWARE SPECIFICATIONS", "DELIVERY PROCESS", "SALES PROCESS", "SOURCE REGISTER", "MAIN WEBSITE SPECIFICATION"] },
  { key: "nda", ar: "قانوني ومالي (بعد NDA)", en: "Legal & financial (after NDA)", color: "#dc2626", count: 20, items: [] },
  { key: "internal", ar: "داخلي غير مشترك", en: "Internal, not shared", color: "#6b7280", count: 10, items: [] },
];
const DR_CATS = [
  { ar: "مستندات المستثمر", en: "Investor Documents", color: "#16a34a", icon: "📂" },
  { ar: "القانوني والمالي", en: "Legal & Finance", color: "#dc2626", icon: "⚖️" },
  { ar: "العمليات والجودة", en: "Operations & Quality", color: "#2563eb", icon: "⚙️" },
  { ar: "الأمن (مقيّد)", en: "Security (Restricted)", color: "#7c3aed", icon: "🛡️" },
  { ar: "التسويق والمبيعات", en: "Sales & Marketing", color: "#f97316", icon: "📣" },
  { ar: "مواد داخلية", en: "Internal Materials", color: "#6b7280", icon: "🗂️" },
];

const DR_DOCS: [string, string, string, string][] = [
  ["ONE PAGER", "shared", "ملخص تنفيذي من صفحة واحدة", "One-page executive summary"],
  ["PITCH DECK", "shared", "عرض الشرائح الرئيسي للمشروع", "Main project pitch deck"],
  ["MARKET SIZING", "shared", "احتساب حجم السوق (TAM وSAM وSOM)", "Market size calculation (TAM, SAM, SOM)"],
  ["MARKET POSITIONING", "shared", "موقع المشروع في السوق", "Project positioning in the market"],
  ["COMPETITOR INTELLIGENCE", "shared", "تحليل المنافسين وأسعارهم", "Competitor and pricing analysis"],
  ["CUSTOMER PERSONAS", "shared", "نماذج العملاء المستهدفين", "Target customer personas"],
  ["SERVICES OFFERS", "shared", "عروض الخدمات والباقات", "Service offers and packages"],
  ["PRICING VALIDATION", "shared", "التحقق من التسعير والباقات", "Pricing and package validation"],
  ["FOUNDER PROFILE", "shared", "ملف المؤسس وخبرته", "Founder profile and experience"],
  ["BRAND IDENTITY", "shared", "الهوية البصرية والشعار", "Visual identity and logo"],
  ["LANDING PAGE COPY", "shared", "نصوص صفحة الهبوط", "Landing page copy"],
  ["GLOSSARY", "shared", "مسرد المصطلحات المستخدمة", "Glossary of terms used"],
  ["DATA ROOM INDEX", "shared", "فهرس غرفة البيانات", "Data room index"],
  ["PROJECT TRUTH", "shared", "الحقائق الأساسية للمشروع", "Core project facts"],
  ["HARDWARE SPECIFICATIONS", "shared", "مواصفات العتاد المعتمدة", "Approved hardware specifications"],
  ["DELIVERY PROCESS", "shared", "مسار التسليم للعميل", "Client delivery process"],
  ["SALES PROCESS", "shared", "مسار البيع من أول تواصل إلى التوقيع", "Sales process from first contact to signing"],
  ["SOURCE REGISTER", "shared", "سجل المصادر المعتمدة", "Approved source register"],
  ["MAIN WEBSITE SPECIFICATION", "shared", "مواصفات الموقع الرئيسي", "Main website specification"],
  ["CAP TABLE", "nda", "جدول توزيع الملكية", "Ownership cap table"],
  ["INVESTOR STRUCTURE", "nda", "هيكل المستثمرين والشروط", "Investor structure and terms"],
  ["MUDARABAH AGREEMENT", "nda", "نموذج عقد المضاربة", "Mudarabah agreement template"],
  ["NDA TEMPLATE", "nda", "نموذج اتفاقية عدم الإفصاح", "Non-disclosure agreement template"],
  ["MSA TEMPLATE", "nda", "نموذج اتفاقية الخدمات الرئيسية", "Master services agreement template"],
  ["SOW TEMPLATE", "nda", "نموذج نطاق العمل", "Statement of work template"],
  ["SLA TEMPLATE", "nda", "نموذج اتفاقية مستوى الخدمة", "Service level agreement template"],
  ["DPA TEMPLATE", "nda", "نموذج معالجة البيانات الشخصية", "Data processing agreement template"],
  ["PARTNER AGREEMENT", "nda", "نموذج اتفاقية الشركاء", "Partner agreement"],
  ["SUPPORT SLA", "nda", "مستوى خدمة الدعم الفني", "Technical support SLA"],
  ["SECURITY PROTOCOL", "nda", "بروتوكول الأمن التشغيلي", "Operational security protocol"],
  ["ATTACK SIMULATIONS", "nda", "نتائج محاكاة الهجمات", "Attack simulation results"],
  ["HALLUCINATION TESTS", "nda", "اختبارات دقة نماذج الذكاء الاصطناعي", "AI model accuracy tests"],
  ["QUALITY CONTROL", "nda", "إجراءات ضبط الجودة", "Quality control procedures"],
  ["TEST CASES", "nda", "حالات الاختبار", "Test cases"],
  ["SOPS LIBRARY", "nda", "مكتبة إجراءات التشغيل", "SOP library"],
  ["SALES SCRIPTS", "nda", "نصوص المبيعات الداخلية", "Internal sales scripts"],
  ["EMAIL TEMPLATES", "nda", "قوالب البريد الإلكتروني", "Email templates"],
  ["INTERVIEW PROTOCOL", "nda", "بروتوكول المقابلات مع العملاء", "Client interview protocol"],
  ["DR SEEN IDENTITY", "nda", "هوية غرفة البيانات", "Data room identity"],
  ["CHANGELOG", "internal", "سجل التغييرات الداخلي", "Internal change log"],
  ["LATEST SESSION", "internal", "ملخص آخر جلسة عمل داخلية", "Latest internal work session summary"],
  ["NEW AGENT SYSTEM PROMPT", "internal", "تعليمات النظام الداخلية للوكيل", "Internal agent system instructions"],
  ["SESSION MEMORY ARCHIVE", "internal", "أرشيف ذاكرة الجلسات", "Session memory archive"],
  ["HANDOVER SUMMARY", "internal", "ملخص تسليم العمل الداخلي", "Internal handover summary"],
  ["OPERATIONAL COMMANDS", "internal", "أوامر التشغيل الداخلية", "Internal operational commands"],
  ["ASSUMPTIONS AND GAPS", "internal", "الافتراضات والفجوات الداخلية", "Internal assumptions and gaps"],
  ["DECISION LOG", "internal", "سجل القرارات الداخلية", "Internal decision log"],
  ["MASTER INDEX", "internal", "الفهرس الرئيسي الداخلي", "Internal master index"],
  ["FIRST FIVE CLIENTS", "internal", "متابعة أول خمسة عملاء", "Tracking of the first five clients"]
];


const DR_CAT: any = {
  shared: { text: "text-white", badge_ar: "مسموح", badge_en: "Allowed", label_ar: "مشترك مع المستثمر", label_en: "Shared with investors", color: "rgba(22,163,74,0.9)",
    rule_ar: "مسموح للمستثمر الاطلاع عليه مباشرة.", rule_en: "Investors may view it directly.",
    why_ar: "لا يحتوي تفاصيل حساسة، ولذلك يُعرض بدون شروط إضافية.", why_en: "It contains no sensitive details, so it is shown without extra conditions.",
    how_ar: "يُعرض مباشرة من غرفة البيانات.", how_en: "Shown directly from the data room." },
  nda: { text: "text-gray-900", badge_ar: "مشدد", badge_en: "Restricted", label_ar: "سري: يُتاح بعد NDA", label_en: "Restricted: after NDA", color: "rgba(234,179,8,0.92)",
    rule_ar: "مشدد: لا يُعرض إلا بعد توقيع اتفاقية عدم الإفصاح.", rule_en: "Restricted: shown only after a signed NDA.",
    why_ar: "يحتوي تفاصيل قانونية أو مالية أو أمنية تحتاج حماية.", why_en: "It holds legal, financial or security details that need protection.",
    how_ar: "اطلب الوصول من المؤسس، ووقّع NDA ثم يُتاح الملف.", how_en: "Request access from the founder, sign the NDA, then the file is shared." },
  internal: { text: "text-white", badge_ar: "ممنوع", badge_en: "Not shared", label_ar: "داخلي: غير مشترك", label_en: "Internal: not shared", color: "rgba(220,38,38,0.92)",
    rule_ar: "ممنوع: لا يُعرض على أي مستثمر.", rule_en: "Not allowed: never shown to investors.",
    why_ar: "مادة تشغيلية أو ذاكرة عمل داخلية، ولا علاقة لها بالمستثمر مباشرة.", why_en: "Operational or internal working material, not directly relevant to investors.",
    how_ar: "لا يُتاح ولا يُشارك خارج الفريق الداخلي.", how_en: "Not available and not shared outside the internal team." },
};

function DataRoomCards({ lang }: any) {
  const [group, setGroup] = useState<string>("shared");
  const [open, setOpen] = useState<number | null>(null);
  const groups = [
    { k: "shared", ar: "مسموح", en: "Allowed" },
    { k: "nda", ar: "مشدد", en: "Restricted" },
    { k: "internal", ar: "ممنوع", en: "Forbidden" },
  ];
  const items = DR_DOCS.map((d, idx) => ({ d, idx })).filter((x) => x.d[1] === group);
  const sel: any = open !== null ? DR_DOCS[open] : null;
  const c: any = sel ? DR_CAT[sel[1]] : null;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-center gap-3">
        {groups.map((g) => (
          <button key={g.k} onClick={() => setGroup(g.k)} className={cn("px-5 py-2.5 rounded-2xl font-bold text-sm border transition-all", group === g.k ? "text-white shadow-lg scale-105 border-white/40" : "bg-white dark:bg-dark-card border-border text-gray-600 dark:text-gray-300")}
            style={group === g.k ? { background: DR_CAT[g.k].color } : undefined}>
            {lang === "ar" ? g.ar : g.en} <span className="opacity-80">({DR_DOCS.filter((x) => x[1] === g.k).length})</span>
          </button>
        ))}
      </div>
      <BotsAround leftMode="archive" rightMode="typing" size={84}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {items.map(({ d, idx }) => {
            const [name, cat] = d;
            const col = DR_CAT[cat];
            return (
              <motion.button key={idx} onClick={() => setOpen(idx)} whileHover={{ y: -5, scale: 1.04 }} whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (idx % 8) * 0.03 }}
                className={cn("relative p-3 md:p-4 min-h-[120px] rounded-2xl shadow-lg overflow-hidden backdrop-blur-md border border-white/30 text-right", col.text)}
                style={{ background: col.color }}>
                <div className="flex items-center justify-between gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-black/20 text-[10px] font-bold">{lang === "ar" ? col.badge_ar : col.badge_en}</span>
                  <span className="text-[10px] opacity-85">{idx + 1}/49</span>
                </div>
                <div className="text-xs md:text-sm font-bold leading-snug mt-3 break-words">{name}</div>
                <svg viewBox="0 0 120 24" className="absolute bottom-1.5 left-1.5 w-16 h-4 opacity-80">
                  <path d="M0,12 L30,12 L38,4 L46,20 L54,12 L120,12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4">
                    <animate attributeName="stroke-dashoffset" from="0" to="-16" dur={`${1.2 + (idx % 5) * 0.3}s`} repeatCount="indefinite" />
                  </path>
                  <circle r="2.5" fill="currentColor"><animateMotion dur={`${2 + (idx % 4) * 0.4}s`} repeatCount="indefinite" path="M0,12 L30,12 L38,4 L46,20 L54,12 L120,12" /></circle>
                </svg>
              </motion.button>
            );
          })}
        </div>
      </BotsAround>
      <AnimatePresence>
        {sel && c && (
          <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setOpen(null)}>
            <motion.div initial={{ scale: 0.85, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.85, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()} className={cn("w-full max-w-lg rounded-3xl p-7 shadow-2xl border border-white/30", c.text)} style={{ background: c.color }}>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-black/25 text-xs font-bold">{lang === "ar" ? c.badge_ar : c.badge_en}</span>
                <span className="text-xs opacity-85">{lang === "ar" ? c.label_ar : c.label_en}</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 break-words">{sel[0]}</h3>
              <p className="text-base leading-relaxed mb-4">{lang === "ar" ? sel[2] : sel[3]}</p>
              <div className="space-y-3 text-sm leading-relaxed border-t border-current/30 pt-4">
                <p><span className="font-bold">{lang === "ar" ? "القاعدة: " : "Rule: "}</span>{lang === "ar" ? c.rule_ar : c.rule_en}</p>
                <p><span className="font-bold">{lang === "ar" ? "السبب: " : "Why: "}</span>{lang === "ar" ? c.why_ar : c.why_en}</p>
                <p><span className="font-bold">{lang === "ar" ? "طريقة الوصول: " : "How to access: "}</span>{lang === "ar" ? c.how_ar : c.how_en}</p>
              </div>
              <button onClick={() => setOpen(null)} className="mt-6 px-6 py-2.5 rounded-xl bg-white text-black font-bold text-sm">{lang === "ar" ? "إغلاق" : "Close"}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DataVaultScene({ lang }: any) {
  const path = "M40,130 C120,60 200,200 262,130";
  return (
    <svg viewBox="0 0 600 270" className="w-full max-w-2xl h-auto mx-auto" role="img" aria-label="data vault automation">
      <defs>
        <radialGradient id="vault-glow"><stop offset="0" stopColor="#D4AF37" stopOpacity="0.35" /><stop offset="1" stopColor="#D4AF37" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="300" cy="130" r="120" fill="url(#vault-glow)"><animate attributeName="r" values="110;124;110" dur="3s" repeatCount="indefinite" /></circle>
      <circle cx="300" cy="130" r="100" fill="none" stroke="#D4AF37" strokeOpacity="0.5" strokeDasharray="6 8">
        <animateTransform attributeName="transform" type="rotate" from="0 300 130" to="360 300 130" dur="14s" repeatCount="indefinite" />
      </circle>
      <rect x="236" y="92" width="128" height="100" rx="16" fill="#0F5132" stroke="#D4AF37" strokeWidth="3" />
      <path d="M264,92 L264,72 A36,36 0 0 1 336,72 L336,92" fill="none" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round" />
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 300 142" to="360 300 142" dur="6s" repeatCount="indefinite" />
        <circle cx="300" cy="142" r="16" fill="none" stroke="#F97316" strokeWidth="3" />
        <line x1="300" y1="142" x2="300" y2="128" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
      </g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x="-11" y="-14" width="22" height="28" rx="3" fill={i % 3 === 0 ? "#16a34a" : i % 3 === 1 ? "#eab308" : "#dc2626"}>
          <animateMotion dur="3.6s" begin={`${i * 0.6}s`} repeatCount="indefinite" path={path} />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur="3.6s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <rect x="0" y="20" width="3" height="230" fill="#D4AF37" opacity="0.7">
        <animate attributeName="x" values="20;560;20" dur="5s" repeatCount="indefinite" />
      </rect>
      <g>
        <circle cx="90" cy="40" r="6" fill="#16a34a" /><text x="104" y="45" fontSize="13" fill="#16a34a">{lang === "ar" ? "مسموح" : "Allowed"}</text>
        <circle cx="90" cy="66" r="6" fill="#eab308" /><text x="104" y="71" fontSize="13" fill="#eab308">{lang === "ar" ? "مشدد" : "Restricted"}</text>
        <circle cx="90" cy="92" r="6" fill="#dc2626" /><text x="104" y="97" fontSize="13" fill="#dc2626">{lang === "ar" ? "ممنوع" : "Forbidden"}</text>
      </g>
      <text x="300" y="258" textAnchor="middle" fontSize="13" fill="#D4AF37">{lang === "ar" ? "خزنة الوصول: 49 ملفاً مصنّفة" : "Access vault: 49 classified files"}</text>
    </svg>
  );
}

function AutomationScene({ kind, lang }: any) {
  const ar = lang === "ar";
  if (kind === "flow") {
    const nodes = ar ? ["استقبال", "RFI", "مستند", "معالجة", "AI", "تقرير", "فاتورة", "تسليم"] : ["Intake", "RFI", "Document", "Process", "AI", "Report", "Invoice", "Delivery"];
    const xs = nodes.map((_, i) => 50 + (i * 500) / (nodes.length - 1));
    const ys = nodes.map((_, i) => (i % 2 ? 60 : 140));
    const p = xs.map((x, i) => `${i ? "L" : "M"}${x},${ys[i]}`).join(" ");
    return (
      <svg viewBox="0 0 600 220" className="w-full max-w-3xl h-auto mx-auto" role="img">
        <path d={p} fill="none" stroke="#D4AF37" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 8" />
        {[0, 1, 2].map((i) => (
          <circle key={i} r="6" fill={i % 2 ? "#F97316" : "#0F5132"}>
            <animateMotion dur="5s" begin={`${i * 1.6}s`} repeatCount="indefinite" path={p} />
          </circle>
        ))}
        {xs.map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={ys[i]} r="18" fill="#0F5132" stroke="#D4AF37" strokeWidth="2">
              <animate attributeName="r" values="16;20;16" dur={`${1.6 + i * 0.2}s`} repeatCount="indefinite" />
            </circle>
            <text x={x} y={ys[i] + 40} textAnchor="middle" fontSize="11" fill="#6B7280">{nodes[i]}</text>
          </g>
        ))}
      </svg>
    );
  }
  if (kind === "orbit") {
    return (
      <svg viewBox="0 0 600 240" className="w-full max-w-2xl h-auto mx-auto" role="img">
        {[80, 120].map((r) => (<circle key={r} cx="300" cy="120" r={r} fill="none" stroke="#D4AF37" strokeOpacity="0.35" strokeDasharray="4 6" />))}
        <circle cx="300" cy="120" r="34" fill="#0F5132" stroke="#D4AF37" strokeWidth="3" />
        <text x="300" y="125" textAnchor="middle" fontSize="13" fontWeight="700" fill="#D4AF37">SEEN</text>
        <g><animateTransform attributeName="transform" type="rotate" from="0 300 120" to="360 300 120" dur="10s" repeatCount="indefinite" /><circle cx="380" cy="120" r="12" fill="#F97316" /></g>
        <g><animateTransform attributeName="transform" type="rotate" from="360 300 120" to="0 300 120" dur="16s" repeatCount="indefinite" /><circle cx="300" cy="0" r="10" fill="#16a34a" transform="translate(0,0)" /><circle cx="180" cy="120" r="10" fill="#D4AF37" /></g>
        <text x="300" y="232" textAnchor="middle" fontSize="12" fill="#6B7280">{ar ? "الأرقام تدور حول المركز" : "Figures orbit the core"}</text>
      </svg>
    );
  }
  if (kind === "network") {
    const pts = [[90, 60], [220, 30], [380, 50], [510, 70], [150, 150], [300, 130], [450, 160]];
    const edges = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 2], [5, 6], [6, 3]];
    return (
      <svg viewBox="0 0 600 200" className="w-full max-w-3xl h-auto mx-auto" role="img">
        {edges.map(([a, b], i) => (<line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="#D4AF37" strokeOpacity="0.4" strokeWidth="1.5"><animate attributeName="stroke-opacity" values="0.15;0.7;0.15" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></line>))}
        {pts.map(([x, y], i) => (<circle key={i} cx={x} cy={y} r={i === 5 ? 10 : 7} fill={i % 2 ? "#D4AF37" : "#0F5132"}><animate attributeName="r" values={`${i === 5 ? 10 : 7};${i === 5 ? 14 : 10};${i === 5 ? 10 : 7}`} dur={`${1.6 + i * 0.2}s`} repeatCount="indefinite" /></circle>))}
      </svg>
    );
  }
  if (kind === "chip") {
    const pins = [0, 1, 2, 3, 4, 5, 6, 7];
    return (
      <svg viewBox="0 0 400 260" className="w-full max-w-md h-auto mx-auto" role="img">
        {pins.map((i) => (
          <g key={i}>
            <line x1={90 + i * 30} y1="30" x2={90 + i * 30} y2="60" stroke="#D4AF37" strokeWidth="3" />
            <line x1={90 + i * 30} y1="200" x2={90 + i * 30} y2="230" stroke="#D4AF37" strokeWidth="3" />
            <circle cx={90 + i * 30} cy="30" r="4" fill="#F97316"><animate attributeName="cy" values="30;60;30" dur={`${1.2 + i * 0.1}s`} repeatCount="indefinite" /></circle>
          </g>
        ))}
        <rect x="120" y="60" width="160" height="140" rx="16" fill="#0F5132" stroke="#D4AF37" strokeWidth="3" />
        <text x="200" y="135" textAnchor="middle" fontSize="22" fontWeight="700" fill="#D4AF37">AI</text>
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="200" cy="130" r={44 + i * 18} fill="none" stroke="#F97316" strokeOpacity="0.5">
            <animate attributeName="r" values={`${44 + i * 18};${56 + i * 18};${44 + i * 18}`} dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    );
  }
  // alarm: radar pulse with a warning ring, transparent
  return (
    <svg viewBox="0 0 600 220" className="w-full max-w-2xl h-auto mx-auto" role="img">
      {[0, 1, 2].map((i) => (<circle key={i} cx="300" cy="110" r="40" fill="none" stroke="#dc2626" strokeWidth="2"><animate attributeName="r" from="40" to="110" dur="3s" begin={`${i}s`} repeatCount="indefinite" /><animate attributeName="stroke-opacity" from="0.8" to="0" dur="3s" begin={`${i}s`} repeatCount="indefinite" /></circle>))}
      <circle cx="300" cy="110" r="26" fill="#dc2626" fillOpacity="0.85"><animate attributeName="r" values="24;28;24" dur="1.4s" repeatCount="indefinite" /></circle>
      <text x="300" y="117" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff">!</text>
      <text x="300" y="206" textAnchor="middle" fontSize="12" fill="#6B7280">{ar ? "رصد مستمر للمخاطر" : "Continuous risk watch"}</text>
    </svg>
  );
}

function DataRoomView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Briefcase} title={t.menu.dataRoom} subtitle={""} />
      <div className="flex justify-center"><BotAvatar mode="archive" size={120} /></div>
      <DataVaultScene lang={lang} />
      <DataRoomCards lang={lang} />
    </div>
  );
}

function TeamView({ t, lang }: any) {
  const stats = [
    { key: "years", label: lang === "ar" ? "سنوات خبرة" : "Years Exp", value: 5 },
    { key: "files", label: lang === "ar" ? "ملف" : "Files", value: 49 },
    { key: "attacks", label: lang === "ar" ? "هجمة" : "Attacks", value: 25 },
    { key: "sectors", label: lang === "ar" ? "قطاعات" : "Sectors", value: 5 },
  ];
  const [active, setActive] = useState<string>("files");
  const activeStat = stats.find((s) => s.key === active) ?? stats[0];
  return (
    <div className="space-y-6">
      <SectionHeader icon={Users} title={t.menu.team} subtitle="" />
            <Card className="p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald/20 to-gold/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
          <div className="shrink-0 relative">
            <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-emerald via-emerald-dark to-gold flex items-center justify-center text-white text-6xl font-amiri font-bold shadow-2xl relative overflow-hidden">
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
              {stats.map((s) => (
                <button key={s.key} onClick={() => setActive(s.key)} className={cn("p-3 rounded-xl text-center transition-all border", active === s.key ? "bg-emerald text-white border-gold shadow-md scale-105" : "bg-muted/50 dark:bg-dark-muted/50 border-transparent hover:border-emerald/40")}>
                  <div className="text-2xl font-bold font-amiri">{s.value}{s.key === "years" ? "+" : ""}</div>
                  <div className="text-xs opacity-80">{s.label}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">{activeStat.label}: <span className="font-bold text-emerald dark:text-gold">{activeStat.value}</span></div>
          </div>
        </div>
      </Card>
      <BotsAround leftMode="typing" rightMode="archive" size={84}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-emerald dark:text-gold mb-4">{lang === "ar" ? "أرقام المؤسس" : "Founder Metrics"}</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.map((s) => ({ name: s.label, value: s.value }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#0F5132" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5"><GearWorkshop lang={lang} /></Card>
      </div>
    </BotsAround>
    </div>
  );
}

function SecurityView({ t, lang }: any) {
  return (
    <div className="space-y-6 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 overflow-hidden"><RadarSweep size={620} lang={lang} /></div>
      <div className="relative z-10 space-y-6">
      <SectionHeader icon={Shield} title={t.menu.security} subtitle={""} />
      <Card className="p-5 bg-transparent dark:bg-transparent border-transparent shadow-none hover:shadow-none [&_svg]:max-h-48 [&_svg]:w-auto [&_svg]:mx-auto"><Heartbeat lang={lang} /></Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center dark:bg-black/40 bg-white/40 border-emerald/30">
          <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-4"><Shield size={32} className="text-emerald" /></div>
          <div className="text-5xl font-bold text-emerald dark:text-gold font-amiri mb-2">{DATA.securityHighlights.attacks}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">{lang === "ar" ? "هجمة محاكاة" : "Simulated Attacks"}</div>
        </Card>
        <Card className="p-6 text-center dark:bg-black/40 bg-white/40 border-gold/30">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4"><Activity size={32} className="text-gold" /></div>
          <div className="text-5xl font-bold text-gold-dark dark:text-gold font-amiri mb-2">{DATA.securityHighlights.hallucinationTests}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">{lang === "ar" ? "سؤال هلوسة مُختبر" : "Hallucination Tests"}</div>
        </Card>
        <Card className="p-6 text-center dark:bg-black/40 bg-white/40 border-accent/30">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4"><Lock size={32} className="text-accent" /></div>
          <div className="text-3xl font-bold text-accent font-amiri mb-2">{DATA.securityHighlights.encryption}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">{lang === "ar" ? "تشفير البيانات" : "Data Encryption"}</div>
        </Card>
      </div>
    </div>
    </div>
  );
}

function SettingsView({ t, lang, dark, setDark, setLang }: any) {
  const { cur, setCur, palette, setPalette } = useContext(CurrencyContext);
  return (
    <div className="space-y-6">
      <SectionHeader icon={Settings} title={t.menu.settings} subtitle={""} />
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
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Sparkles size={18} className="text-accent" /> {lang === "ar" ? "لوحة الألوان" : "Color Palette"}</h3>
        <div className="flex gap-2">
          <button onClick={() => setPalette("green")} className={cn("flex-1 py-3 rounded-lg font-bold transition-all", palette === "green" ? "bg-emerald text-white shadow-md" : "bg-muted dark:bg-dark-muted hover:bg-muted/80")}>{lang === "ar" ? "أخضر (الأصلي)" : "Green (Original)"}</button>
          <button onClick={() => setPalette("warm")} className={cn("flex-1 py-3 rounded-lg font-bold transition-all", palette === "warm" ? "bg-emerald text-white shadow-md" : "bg-muted dark:bg-dark-muted hover:bg-muted/80")}>{lang === "ar" ? "برتقالي فاتح" : "Light Orange"}</button>
        </div>
        <p className="text-xs text-gray-500 mt-3">{lang === "ar" ? "يغيّر الألوان الرئيسية في كل الموقع. الوضع الداكن يبقى كما هو." : "Changes the main colors across the site. Dark mode stays as is."}</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Wallet size={18} className="text-emerald" /> {lang === "ar" ? "العملة" : "Currency"}</h3>
        <div className="flex gap-2">
          {(["SAR", "USD", "MYR"] as const).map((c) => (
            <button key={c} onClick={() => setCur(c)} className={cn("flex-1 py-3 rounded-lg font-bold transition-all", cur === c ? "bg-emerald text-white shadow-md" : "bg-muted dark:bg-dark-muted hover:bg-muted/80")}>{c === "SAR" ? (lang === "ar" ? "ريال سعودي (SAR)" : "Saudi Riyal (SAR)") : c === "USD" ? (lang === "ar" ? "دولار (USD)" : "US Dollar (USD)") : (lang === "ar" ? "رنجت (MYR)" : "Malaysian Ringgit (MYR)")}</button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">{lang === "ar" ? "أسعار التحويل تقريبية وتُحدَّث في الكود." : "Conversion rates are approximate and set in code."}</p>
      </Card>
    </div>
  );
}

function AdvancedAnalyticsView({ t, lang }: any) {
  const [activeChart, setActiveChart] = useState("sankey");
  const charts = [
    { id: "sankey", name: lang === "ar" ? "مخطط سانكي" : "Sankey", icon: "" },
    { id: "treemap", name: lang === "ar" ? "المخطط المربعي" : "Treemap", icon: "📊" },
    { id: "sunburst", name: lang === "ar" ? "انفجار الشمس" : "Sunburst", icon: "☀️" },
    { id: "radar", name: lang === "ar" ? "المخطط الراداري" : "Radar", icon: "🎯" },
    { id: "bubble", name: lang === "ar" ? "المخطط الفقاعي" : "Bubble", icon: "" },
    { id: "gantt", name: lang === "ar" ? "مخطط جانت" : "Gantt", icon: "" },
    { id: "chord", name: lang === "ar" ? "المخطط الوتري" : "Chord", icon: "🎻" },
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
