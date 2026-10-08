"use client";
import { useState } from "react";
import { DATA } from "@/lib/data";
import { LayoutDashboard, Wallet, FileText, Target, Map, AlertTriangle, Cpu, FileCheck, Globe, SkipBack, SkipForward } from "lucide-react";

type Tab = 'dashboard' | 'financials' | 'business-plan' | 'sectors' | 'roadmap' | 'risks' | 'hardware' | 'the-ask';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [fin, setFin] = useState({ arpu: DATA.arpu, churn: DATA.churn, cac: DATA.cac, newCust: DATA.newCustomers, margin: DATA.margin, fixed: DATA.fixedCosts });
  
  const ltv = (fin.arpu * (fin.margin / 100)) / (fin.churn / 100);
  const ltvCac = ltv / fin.cac;
  const payback = fin.cac / (fin.arpu * (fin.margin / 100));
  const mrr12 = Math.round(fin.arpu * (fin.newCust * 12 * 0.8));
  const mrr36 = Math.round(fin.arpu * (fin.newCust * 36 * 0.6));
  const be = Math.max(1, Math.ceil(fin.fixed / (fin.newCust * fin.arpu * (fin.margin/100) - fin.newCust * fin.cac)));

  const menuItems = [
    { id: 'dashboard', label: '📊 لوحة التحكم', en: 'Dashboard', icon: LayoutDashboard },
    { id: 'financials', label: '💰 المالية', en: 'Financials', icon: Wallet },
    { id: 'business-plan', label: '📋 خطة العمل', en: 'Business Plan', icon: FileText },
    { id: 'sectors', label: '🎯 القطاعات', en: 'Sectors', icon: Target },
    { id: 'roadmap', label: '🗺️ خريطة الطريق', en: 'Roadmap', icon: Map },
    { id: 'risks', label: '⚠️ المخاطر', en: 'Risks', icon: AlertTriangle },
    { id: 'hardware', label: '🏗️ العتاد', en: 'Hardware', icon: Cpu },
    { id: 'the-ask', label: '📄 الطلب', en: 'The Ask', icon: FileCheck },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-in">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[{l:'TAM',v:`$${DATA.tam}`},{l:'SAM',v:`$${DATA.sam}`},{l:'SOM',v:`$${DATA.som}`},{l:'MRR Y1',v:`SAR ${DATA.mrrY1.toLocaleString()}`},{l:'LTV:CAC',v:`${ltvCac.toFixed(1)}x`},{l:'الطلب',v:`SAR ${DATA.ask.toLocaleString()}`}].map((k,i)=>(
                <div key={i} className="bg-white p-4 rounded-xl border border-sand shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="text-xs text-gray-500 mb-1">{k.l}</div>
                  <div className="text-xl font-bold text-emerald">{k.v}</div>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-xl border border-sand shadow-sm">
              <h3 className="text-xl font-amiri font-bold text-emerald mb-4">بطاقة المؤسس</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald text-white flex items-center justify-center text-2xl font-bold">ع</div>
                <div>
                  <h4 className="font-bold text-lg">{DATA.company.founder}</h4>
                  <p className="text-gray-600 text-sm">المؤسس التشغيلي ومعمار الأنظمة | مهندس ميكانيكي بخبرة في تحسين العمليات وسلاسل الإمداد.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl border border-sand shadow-sm text-center">
                <div className="text-3xl font-bold text-accent">{DATA.customersY1}</div>
                <div className="text-sm text-gray-600 mt-1">عملاء السنة الأولى</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-sand shadow-sm text-center">
                <div className="text-3xl font-bold text-accent">{DATA.customersY3}</div>
                <div className="text-sm text-gray-600 mt-1">عملاء السنة الثالثة</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-sand shadow-sm text-center">
                <div className="text-3xl font-bold text-accent">شهر {DATA.breakEven}</div>
                <div className="text-sm text-gray-600 mt-1">نقطة التعادل</div>
              </div>
            </div>
          </div>
        );

      case 'financials':
        return (
          <div className="bg-dark text-white p-8 rounded-xl shadow-lg animate-in">
            <h3 className="text-2xl font-amiri font-bold text-gold mb-6">النمذجة المالية التفاعلية</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-5">
                {[
                  { label: 'Setup Fees (تأسيس)', key: 'arpu', min: 500, max: 5000, step: 100, unit: 'SAR' },
                  { label: 'Churn Rate (نسبة التسرب)', key: 'churn', min: 1, max: 20, step: 1, unit: '%' },
                  { label: 'CAC (تكلفة الاكتساب)', key: 'cac', min: 500, max: 5000, step: 100, unit: 'SAR' },
                  { label: 'New Customers (عملاء جدد/شهر)', key: 'newCust', min: 1, max: 10, step: 0.1, unit: '' },
                  { label: 'Margin (هامش الربح)', key: 'margin', min: 50, max: 90, step: 5, unit: '%' },
                  { label: 'Fixed Costs (تكاليف ثابتة)', key: 'fixed', min: 1000, max: 10000, step: 500, unit: 'SAR' }
                ].map((s) => (
                  <div key={s.key}>
                    <div className="flex justify-between mb-2 text-sm font-semibold">
                      <span>{s.label}</span>
                      <span className="text-gold">{fin[s.key as keyof typeof fin]} {s.unit}</span>
                    </div>
                    <input type="range" min={s.min} max={s.max} step={s.step} value={fin[s.key as keyof typeof fin]} 
                      onChange={(e) => setFin({...fin, [s.key]: parseFloat(e.target.value)})}
                      className="w-full accent-accent cursor-pointer" />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 p-4 rounded-lg text-center"><div className="text-gray-400 text-xs">LTV</div><div className="text-xl font-bold text-gold">{Math.round(ltv).toLocaleString()} SAR</div></div>
                  <div className="bg-gray-800 p-4 rounded-lg text-center"><div className="text-gray-400 text-xs">LTV:CAC</div><div className="text-xl font-bold text-gold">{ltvCac.toFixed(1)}x</div></div>
                  <div className="bg-gray-800 p-4 rounded-lg text-center"><div className="text-gray-400 text-xs">استرداد CAC</div><div className="text-xl font-bold text-gold">{payback.toFixed(1)} شهر</div></div>
                  <div className="bg-gray-800 p-4 rounded-lg text-center"><div className="text-gray-400 text-xs">نقطة التعادل</div><div className="text-xl font-bold text-gold">شهر {be}</div></div>
                  <div className="bg-gray-800 p-4 rounded-lg text-center"><div className="text-gray-400 text-xs">MRR شهر 12</div><div className="text-xl font-bold text-gold">{mrr12.toLocaleString()} SAR</div></div>
                  <div className="bg-gray-800 p-4 rounded-lg text-center"><div className="text-gray-400 text-xs">MRR شهر 36</div><div className="text-xl font-bold text-gold">{mrr36.toLocaleString()} SAR</div></div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-bold mb-3 text-center text-sm">توزيع استخدام الأموال (SAR 82,500)</h4>
                  <div className="flex h-10 rounded-full overflow-hidden">
                    <div className="bg-emerald w-[60%] flex items-center justify-center text-xs font-bold">60% عمليات</div>
                    <div className="bg-accent w-[40%] flex items-center justify-center text-xs font-bold">40% تسويق</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'business-plan':
        const sections = [
          { title: "الملخص التنفيذي", content: "Seen Automation وكالة أتمتة AI حلال 100%، تبدأ بالهندسة كبوابة ذهبية. تطلب SAR 82,500 عبر مضاربة شرعية." },
          { title: "وصف الشركة", content: "الكيان: Malaysian Sdn Bhd. المقر: Online/Worldwide. الرؤية: قيادة سوق الأتمتة في العالم العربي." },
          { title: "تحليل السوق", content: "TAM: $3.5B | SAM: $1.95B | SOM Y1: $320K. CAGR 14.9-28.4%." },
          { title: "تحليل المنافسين", content: "10 منافسين رئيسيين. التفوق في: السعر (10x أقل)، التخصص الهندسي، الامتثال الشرعي." },
          { title: "المنتج/الخدمة", content: "4 باقات: Starter, Growth, Enterprise, Lead-Gen. نظام Error Node + Container معزول." },
          { title: "التسويق والمبيعات", content: "Landing Bot ذكي + Confirmation Call (15-20 دقيقة). Close Rate: 25-35%." },
          { title: "العمليات", content: "دورة تسليم 2-4 أسابيع. 25 هجمة أمنية + 100 سؤال هلوسة قبل كل تسليم." },
          { title: "الفريق", content: "عمر محمد جميل باعبدالله — مهندس ميكانيكي، خبرة في SABIC وتحسين العمليات." },
          { title: "النموذج المالي", content: "هامش ربح 70%+. نقطة تعادل في الشهر 2. LTV:CAC = 19.3x." },
          { title: "المخاطر", content: "10 مخاطر موثقة مع خطط تخفيف. (راجع تبويب المخاطر للتفاصيل)." }
        ];
        return (
          <div className="space-y-4 animate-in">
            {sections.map((sec, i) => (
              <details key={i} className="bg-white rounded-xl border border-sand shadow-sm overflow-hidden group">
                <summary className="p-5 cursor-pointer font-bold text-emerald hover:bg-background/50 flex justify-between items-center">
                  <span>{i+1}. {sec.title}</span>
                  <span className="text-accent group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-5 pt-0 text-gray-700 border-t border-sand">{sec.content}</div>
              </details>
            ))}
          </div>
        );

      case 'sectors':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in">
            {DATA.sectors.map((s) => (
              <div key={s.id} className="bg-white p-6 rounded-xl border border-sand shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-emerald">{s.ar}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${s.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {s.status === 'active' ? 'نشط' : 'لاحقاً'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 text-sm">{s.desc}</p>
                <button className="w-full py-2 bg-background border border-emerald text-emerald rounded-lg hover:bg-emerald hover:text-white transition-colors text-sm font-semibold">
                  عرض الخطة والعتاد
                </button>
              </div>
            ))}
          </div>
        );

      case 'roadmap':
        return (
          <div className="space-y-6 animate-in">
            <div className="bg-white p-6 rounded-xl border border-sand shadow-sm">
              <h3 className="text-xl font-bold text-emerald mb-6">خريطة الطريق — 36 شهراً</h3>
              <div className="space-y-4">
                {DATA.roadmap.map((r, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-emerald text-white flex items-center justify-center font-bold text-sm">{r.quarter}</div>
                      {i < DATA.roadmap.length - 1 && <div className="w-0.5 h-12 bg-sand"></div>}
                    </div>
                    <div className="flex-1 bg-background p-4 rounded-lg border border-sand">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-emerald">{r.title}</h4>
                        <span className="text-xs text-gray-500">السنة {r.year}</span>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {r.tasks.map((t, j) => <li key={j}>• {t}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'risks':
        const colorMap: Record<string, string> = { red: "bg-red-100 text-red-800", yellow: "bg-yellow-100 text-yellow-800", green: "bg-green-100 text-green-800" };
        return (
          <div className="bg-white rounded-xl border border-sand shadow-sm overflow-hidden animate-in">
            <table className="w-full text-sm text-right">
              <thead className="bg-emerald text-white">
                <tr><th className="p-4">المخاطرة</th><th className="p-4">الاحتمال</th><th className="p-4">الأثر</th><th className="p-4">خطة التخفيف</th></tr>
              </thead>
              <tbody>
                {DATA.risks.map((r) => (
                  <tr key={r.id} className="border-b border-sand hover:bg-background/50">
                    <td className="p-4 font-semibold">{r.name}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${colorMap[r.color]}`}>{r.prob}</span></td>
                    <td className="p-4">{r.impact}</td>
                    <td className="p-4 text-gray-600">{r.mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'hardware':
        return (
          <div className="space-y-6 animate-in">
            <div className="bg-white p-6 rounded-xl border border-sand shadow-sm">
              <h3 className="text-xl font-bold text-emerald mb-4">فئات اللابتوب (5 فئات)</h3>
              <table className="w-full text-sm text-right">
                <thead className="bg-background"><tr><th className="p-3">الفئة</th><th className="p-3">المواصفات</th><th className="p-3">السعر</th><th className="p-3">قدرة AI</th></tr></thead>
                <tbody>{DATA.hardware.laptops.map((l, i) => (
                  <tr key={i} className="border-b border-sand"><td className="p-3 font-semibold">{l.category}</td><td className="p-3">{l.specs}</td><td className="p-3 text-accent font-bold">{l.price}</td><td className="p-3">{l.ai}</td></tr>
                ))}</tbody>
              </table>
            </div>
            <div className="bg-white p-6 rounded-xl border border-sand shadow-sm">
              <h3 className="text-xl font-bold text-emerald mb-4">فئات Mini PC (5 فئات)</h3>
              <table className="w-full text-sm text-right">
                <thead className="bg-background"><tr><th className="p-3">الفئة</th><th className="p-3">المواصفات</th><th className="p-3">السعر</th></tr></thead>
                <tbody>{DATA.hardware.minipc.map((l, i) => (
                  <tr key={i} className="border-b border-sand"><td className="p-3 font-semibold">{l.category}</td><td className="p-3">{l.specs}</td><td className="p-3 text-accent font-bold">{l.price}</td></tr>
                ))}</tbody>
              </table>
            </div>
            <div className="bg-emerald text-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gold mb-4">✅ السيناريو المختار: {DATA.hardware.scenario.name}</h3>
              <div className="space-y-2 text-sm">
                <p><strong>اللابتوب:</strong> {DATA.hardware.scenario.laptop}</p>
                <p><strong>Mini PC:</strong> {DATA.hardware.scenario.minipc}</p>
                <p><strong>الإجمالي:</strong> <span className="text-gold font-bold text-lg">{DATA.hardware.scenario.total}</span></p>
                <p><strong>المتبقي:</strong> <span className="text-gold">{DATA.hardware.scenario.remaining}</span></p>
              </div>
            </div>
          </div>
        );

      case 'the-ask':
        return (
          <div className="space-y-6 animate-in">
            <div className="bg-emerald text-white p-8 rounded-xl text-center shadow-lg">
              <h2 className="text-2xl font-amiri font-bold mb-2">طلب الاستثمار</h2>
              <div className="text-5xl font-bold text-gold mb-4">SAR {DATA.ask.toLocaleString()}</div>
              <p className="text-lg opacity-90">هيكل مضاربة شرعي: {DATA.mudarabah.phase1}% حتى استرداد رأس المال، ثم {DATA.mudarabah.phase2}% لمدة {DATA.mudarabah.phase2} شهراً.</p>
              <p className="mt-2 text-sm opacity-75">Buyout: بعد {DATA.mudarabah.buyoutMonths} شهر × {DATA.mudarabah.buyoutMultiple} | المدة القصوى: {DATA.mudarabah.maxYears} سنة</p>
            </div>
            <PitchDeck />
            <div className="bg-white p-6 rounded-xl border border-sand shadow-sm">
              <h3 className="text-xl font-bold text-emerald mb-4">غرفة البيانات (Data Room)</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-background rounded-lg border border-sand">
                  <span>📄 NDA & MSA Templates</span>
                  <span className="text-green-600 font-bold text-sm">🟢 عام</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-lg border border-sand">
                  <span>📜 Partner & Mudarabah Agreements</span>
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm font-bold hover:bg-yellow-600">🟡 طلب وصول (NDA)</button>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-lg border border-sand opacity-50">
                  <span>🔒 System Prompts & Source Code</span>
                  <span className="text-red-600 font-bold text-sm">🔴 مقيد</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-center py-20 text-gray-500">جاري بناء هذا القسم...</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-white border-l border-sand flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-sand">
          <h1 className="text-2xl font-amiri font-bold text-emerald flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald rounded-lg flex items-center justify-center text-gold font-bold text-sm">S</div>
            Seen
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === item.id ? 'bg-emerald text-white shadow-md' : 'text-gray-600 hover:bg-background'}`}>
              <item.icon size={18} />
              {lang === 'ar' ? item.label : item.en}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sand">
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-sand rounded-lg hover:bg-background text-sm font-semibold">
            <Globe size={16} /> {lang === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-background p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-amiri font-bold text-emerald">{menuItems.find(m => m.id === activeTab)?.label}</h2>
          <p className="text-gray-500 mt-1 text-sm">Interactive Visual Reference</p>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

function PitchDeck() {
  const [slide, setSlide] = useState(0);
  return (
    <div className="bg-white p-6 rounded-xl border border-sand shadow-sm">
      <h3 className="text-xl font-bold text-emerald mb-4">Pitch Deck (14 شريحة)</h3>
      <div className="relative bg-dark text-white rounded-lg overflow-hidden min-h-[250px] flex flex-col items-center justify-center p-8 text-center">
        <div className="absolute top-4 left-4 text-gold text-xs font-mono">Slide {slide + 1} / 14</div>
        <h3 className="text-2xl font-amiri font-bold mb-4">{DATA.pitchSlides[slide]}</h3>
        <div className="flex items-center gap-4 mt-8">
          <button onClick={() => setSlide(s => Math.max(0, s - 1))} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"><SkipBack size={20} /></button>
          <button onClick={() => setSlide(s => Math.min(13, s + 1))} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"><SkipForward size={20} /></button>
        </div>
        <div className="flex gap-1 mt-6">
          {DATA.pitchSlides.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === slide ? 'bg-gold' : 'bg-gray-600'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}