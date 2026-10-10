"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DATA } from "@/lib/data";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

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
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

type Lang = "ar" | "en";

export default function Home() {
  const [lang, setLang] = useState<Lang>("ar");
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

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
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-gold flex items-center justify-center text-white font-bold">S</div>
            <div>
              <h1 className="text-lg font-bold text-emerald dark:text-gold">Seen Automation</h1>
              <p className="text-xs text-gray-500">{t.common.investorBriefcase}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-muted dark:hover:bg-dark-muted">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="px-3 py-2 rounded-lg hover:bg-muted dark:hover:bg-dark-muted text-sm font-semibold">
              <Globe size={14} className="inline mr-1" />
              {lang === "ar" ? "EN" : "عربي"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 pb-2 overflow-x-auto">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                  activeTab === tab.id
                    ? "bg-emerald text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:bg-muted dark:hover:bg-dark-muted"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "dashboard" && <DashboardView t={t} lang={lang} />}
            {activeTab === "financials" && <FinancialsView t={t} lang={lang} />}
            {activeTab === "business-plan" && <BusinessPlanView t={t} lang={lang} />}
            {activeTab === "sectors" && <SectorsView t={t} lang={lang} />}
            {activeTab === "roadmap" && <RoadmapView t={t} lang={lang} />}
            {activeTab === "risks" && <RisksView t={t} lang={lang} />}
            {activeTab === "hardware" && <HardwareView t={t} lang={lang} />}
            {activeTab === "the-ask" && <TheAskView t={t} lang={lang} />}
            {activeTab === "data-room" && <DataRoomView t={t} lang={lang} />}
            {activeTab === "team" && <TeamView t={t} lang={lang} />}
            {activeTab === "security" && <SecurityView t={t} lang={lang} />}
            {activeTab === "settings" && <SettingsView t={t} lang={lang} dark={dark} setDark={setDark} setLang={setLang} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// Simple Card component
function Card({ children, className, hover = true }: any) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      className={cn(
        "bg-card dark:bg-dark-card rounded-2xl border border-border dark:border-dark-border shadow-card p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// Section Header
function SectionHeader({ icon: Icon, title, subtitle }: any) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-emerald/10 dark:bg-emerald/20 flex items-center justify-center">
          <Icon size={20} className="text-emerald dark:text-gold" />
        </div>
        <h2 className="text-3xl font-bold text-emerald dark:text-gold font-amiri">{title}</h2>
      </div>
      {subtitle && <p className="text-gray-600 dark:text-gray-400 text-sm">{subtitle}</p>}
    </div>
  );
}

// Badge
function Badge({ children, color = "emerald" }: any) {
  const colors = {
    emerald: "bg-emerald/10 text-emerald border-emerald/20",
    gold: "bg-gold/10 text-gold-dark dark:text-gold border-gold/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    red: "bg-red-100 text-red-600 border-red-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    green: "bg-green-100 text-green-700 border-green-200",
  };
  
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", colors[color as keyof typeof colors])}>
      {children}
    </span>
  );
}

// Views
function DashboardView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={LayoutDashboard} title={t.dashboard.title} subtitle={t.dashboard.subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DATA.kpis.map((kpi, i) => (
          <Card key={i} className="text-center">
            <div className="text-4xl font-bold text-emerald dark:text-gold font-amiri mb-2">
              {kpi.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {lang === "ar" ? kpi.label_ar : kpi.label_en}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FinancialsView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Wallet} title={t.financials.title} subtitle={t.financials.subtitle} />
      <Card>
        <h3 className="text-xl font-bold mb-4">{lang === "ar" ? "توزيع الأموال" : "Use of Funds"}</h3>
        <div className="space-y-3">
          {DATA.financials.useOfFunds.breakdown.map((item: any, i: number) => (
            <div key={i} className="flex justify-between items-center p-3 bg-muted/50 dark:bg-dark-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span className="font-semibold">{lang === "ar" ? item.category_ar : item.category_en}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald dark:text-gold">{item.percentage}%</div>
                <div className="text-xs text-gray-500">${item.amount.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function BusinessPlanView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={FileText} title={t.businessPlan.title} subtitle={t.businessPlan.subtitle} />
      <div className="space-y-4">
        {DATA.businessPlan.map((section: any, i: number) => (
          <Card key={i}>
            <h3 className="text-xl font-bold mb-3 text-emerald dark:text-gold">
              {i + 1}. {lang === "ar" ? section.title_ar : section.title_en}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {lang === "ar" ? section.content_ar : section.content_en}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SectorsView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Target} title={t.sectors.title} subtitle={t.sectors.subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DATA.sectors.map((sector: any, i: number) => (
          <Card key={i}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{sector.icon}</span>
              <h3 className="text-xl font-bold text-emerald dark:text-gold">
                {lang === "ar" ? sector.name_ar : sector.name_en}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {lang === "ar" ? sector.desc_ar : sector.desc_en}
            </p>
            <Badge color={sector.status === "active" ? "green" : "yellow"}>
              {sector.status === "active" ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "قادم" : "Upcoming")}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RoadmapView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={MapIcon} title={t.roadmap.title} subtitle={t.roadmap.subtitle} />
      <div className="space-y-4">
        {DATA.roadmap.map((item: any, i: number) => (
          <Card key={i}>
            <div className="flex items-center gap-3 mb-2">
              <Badge color="gold">{lang === "ar" ? item.date_ar : item.date_en}</Badge>
              <h3 className="text-lg font-bold text-emerald dark:text-gold">
                {lang === "ar" ? item.phase_ar : item.phase_en}
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              {lang === "ar" ? item.desc_ar : item.desc_en}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RisksView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={AlertTriangle} title={t.risks.title} subtitle={t.risks.subtitle} />
      <div className="space-y-4">
        {DATA.risks.map((risk: any, i: number) => (
          <Card key={i}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-emerald dark:text-gold">
                {lang === "ar" ? risk.name_ar : risk.name_en}
              </h3>
              <div className="flex gap-2">
                <Badge color={risk.prob === "high" ? "red" : risk.prob === "medium" ? "yellow" : "green"}>
                  {risk.prob}
                </Badge>
                <Badge color={risk.impact === "high" ? "red" : risk.impact === "medium" ? "yellow" : "green"}>
                  {risk.impact}
                </Badge>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              {lang === "ar" ? risk.desc_ar : risk.desc_en}
            </p>
            <div className="mt-3 p-3 bg-emerald/5 dark:bg-emerald/10 rounded-lg">
              <strong className="text-emerald dark:text-gold">{lang === "ar" ? "التخفيف:" : "Mitigation:"}</strong>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {lang === "ar" ? risk.mitigation_ar : risk.mitigation_en}
              </p>
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
      <Card>
        <h3 className="text-xl font-bold mb-4 text-emerald dark:text-gold">
          {lang === "ar" ? DATA.hardware.scenario.name_ar : DATA.hardware.scenario.name_en}
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-muted/50 dark:bg-dark-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-emerald">${DATA.hardware.scenario.laptop_price.toLocaleString()}</div>
            <div className="text-xs text-gray-500">{lang === "ar" ? "لابتوب" : "Laptop"}</div>
          </div>
          <div className="text-center p-4 bg-muted/50 dark:bg-dark-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-gold">${DATA.hardware.scenario.minipc_price.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Mini PC</div>
          </div>
          <div className="text-center p-4 bg-muted/50 dark:bg-dark-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-accent">${DATA.hardware.scenario.accessories_price.toLocaleString()}</div>
            <div className="text-xs text-gray-500">{lang === "ar" ? "إكسسوارات" : "Accessories"}</div>
          </div>
        </div>
        <div className="text-center p-4 bg-emerald/10 dark:bg-emerald/20 rounded-lg">
          <div className="text-3xl font-bold text-emerald dark:text-gold">${DATA.hardware.scenario.total.toLocaleString()}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{lang === "ar" ? "الإجمالي" : "Total"}</div>
        </div>
      </Card>
    </div>
  );
}

function TheAskView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={FileCheck} title={t.theAsk.title} subtitle={t.theAsk.subtitle} />
      <Card className="text-center">
        <div className="text-6xl font-bold text-emerald dark:text-gold font-amiri mb-4">
          SAR {DATA.ask.amount.toLocaleString()}
        </div>
        <div className="text-xl text-gray-600 dark:text-gray-400 mb-6">
          ≈ USD {DATA.ask.amount_usd.toLocaleString()}
        </div>
        <Badge color="gold">{lang === "ar" ? DATA.ask.structure_ar : DATA.ask.structure_en}</Badge>
      </Card>
    </div>
  );
}

function DataRoomView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Briefcase} title={t.dataRoom.title} subtitle={t.dataRoom.subtitle} />
      <Card>
        <p className="text-gray-700 dark:text-gray-300">
          {lang === "ar" 
            ? "غرفة البيانات تحتوي على 49 ملفاً استراتيجياً. يرجى التواصل للحصول على الوصول الكامل."
            : "The data room contains 49 strategic files. Please contact us for full access."}
        </p>
      </Card>
    </div>
  );
}

function TeamView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Users} title={t.team.title} subtitle={t.team.subtitle} />
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald to-gold flex items-center justify-center text-white text-3xl font-bold">
            {DATA.company.founder.name[0]}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald dark:text-gold">
              {lang === "ar" ? DATA.company.founder.name : DATA.company.founder.name_en}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {lang === "ar" ? DATA.company.founder.role_ar : DATA.company.founder.role_en}
            </p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {lang === "ar" ? DATA.company.founder.bio_ar : DATA.company.founder.bio_en}
        </p>
      </Card>
    </div>
  );
}

function SecurityView({ t, lang }: any) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Shield} title={t.security.title} subtitle={t.security.subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="text-4xl font-bold text-emerald dark:text-gold mb-2">25</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{lang === "ar" ? "هجمات محاكاة" : "Simulated Attacks"}</div>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-gold mb-2">100</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{lang === "ar" ? "اختبار هلوسة" : "Hallucination Tests"}</div>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-bold text-accent mb-2">AES-256</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{lang === "ar" ? "تشفير" : "Encryption"}</div>
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
        <Card>
          <h3 className="text-lg font-bold mb-4">{lang === "ar" ? "اللغة" : "Language"}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setLang("ar")}
              className={cn(
                "flex-1 py-3 rounded-lg font-bold transition-all",
                lang === "ar" ? "bg-emerald text-white" : "bg-muted dark:bg-dark-muted"
              )}
            >
              العربية
            </button>
            <button
              onClick={() => setLang("en")}
              className={cn(
                "flex-1 py-3 rounded-lg font-bold transition-all",
                lang === "en" ? "bg-emerald text-white" : "bg-muted dark:bg-dark-muted"
              )}
            >
              English
            </button>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-bold mb-4">{lang === "ar" ? "المظهر" : "Theme"}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setDark(false)}
              className={cn(
                "flex-1 py-3 rounded-lg font-bold transition-all",
                !dark ? "bg-emerald text-white" : "bg-muted dark:bg-dark-muted"
              )}
            >
              <Sun size={18} className="inline mr-2" />
              {lang === "ar" ? "فاتح" : "Light"}
            </button>
            <button
              onClick={() => setDark(true)}
              className={cn(
                "flex-1 py-3 rounded-lg font-bold transition-all",
                dark ? "bg-emerald text-white" : "bg-muted dark:bg-dark-muted"
              )}
            >
              <Moon size={18} className="inline mr-2" />
              {lang === "ar" ? "داكن" : "Dark"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
