"use client";

import { DATA } from "@/lib/data";
import { DATA_ROOM_FILES } from "@/components/DataRoomVault";

export default function BriefcasePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <style jsx global>{`
        @page { size: A4; margin: 14mm; }
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-break { page-break-before: always; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto p-8 print:p-0">
        <div className="no-print flex justify-between items-center mb-6 p-4 rounded-xl bg-neutral-100 border border-neutral-200">
          <a href="/" className="text-sm font-bold text-emerald-800">← Return to live briefcase</a>
          <button onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-emerald-800 text-white text-sm font-bold">
            Save as PDF / Print
          </button>
        </div>

        <header className="border-b-2 border-emerald-800 pb-6 mb-8">
          <div className="flex justify-between items-start gap-6">
            <div>
              <h1 className="text-3xl font-bold text-emerald-800">{DATA.company.name_ar}</h1>
              <p className="text-xl text-neutral-600 mt-1">{DATA.company.name_en}</p>
              <p className="mt-3 text-sm font-bold text-amber-700">{DATA.company.tagline_ar} | {DATA.company.tagline_en}</p>
            </div>
            <div className="text-left text-xs text-neutral-500">
              <div className="font-mono">2026-10-09</div>
              <div>Confidential Investor Briefcase</div>
              <div>Static Edition v5.1</div>
            </div>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            1. Executive Summary
          </h2>
          <div className="border border-neutral-200 rounded-xl p-5 bg-neutral-50">
            <p className="text-sm leading-relaxed">{DATA.businessPlan[0].content_en.replace(/\n/g, ' ')}</p>
          </div>
        </section>

        <section className="mb-8 page-break">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            2. Market Opportunity
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-neutral-200 rounded-xl p-4 text-center bg-neutral-50">
              <div className="text-xs text-neutral-500">TAM</div>
              <div className="text-2xl font-bold text-emerald-800">${DATA.market.tam.value}B</div>
              <div className="text-xs text-neutral-500 mt-1">{DATA.market.tam.label_en}</div>
            </div>
            <div className="border border-neutral-200 rounded-xl p-4 text-center bg-neutral-50">
              <div className="text-xs text-neutral-500">SAM</div>
              <div className="text-2xl font-bold text-amber-700">${DATA.market.sam.value}B</div>
              <div className="text-xs text-neutral-500 mt-1">{DATA.market.sam.label_en}</div>
            </div>
            <div className="border border-neutral-200 rounded-xl p-4 text-center bg-neutral-50">
              <div className="text-xs text-neutral-500">SOM Y1</div>
              <div className="text-2xl font-bold text-orange-600">${DATA.market.som.value}K</div>
              <div className="text-xs text-neutral-500 mt-1">{DATA.market.som.label_en}</div>
            </div>
          </div>
        </section>

        <section className="mb-8 page-break">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            3. Financial Model
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
              <h3 className="font-bold text-sm text-emerald-800 mb-2">Unit Economics</h3>
              <table className="w-full text-xs">
                <tbody>
                  <tr><td className="py-1 font-semibold">ARPU</td><td>SAR {DATA.financials.arpu.toLocaleString()}</td></tr>
                  <tr><td className="py-1 font-semibold">Churn</td><td>{DATA.financials.churn}%</td></tr>
                  <tr><td className="py-1 font-semibold">CAC</td><td>SAR {DATA.financials.cac.toLocaleString()}</td></tr>
                  <tr><td className="py-1 font-semibold">Margin</td><td>{DATA.financials.margin}%</td></tr>
                </tbody>
              </table>
            </div>
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
              <h3 className="font-bold text-sm text-emerald-800 mb-2">3-Year Projection</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b"><th className="text-left py-1">Year</th><th>Revenue</th><th>Profit</th></tr></thead>
                <tbody>
                  <tr><td className="py-1">Y1</td><td>SAR {DATA.financials.projections.y1.revenue.toLocaleString()}</td><td>SAR {DATA.financials.projections.y1.profit.toLocaleString()}</td></tr>
                  <tr><td className="py-1">Y2</td><td>SAR {DATA.financials.projections.y2.revenue.toLocaleString()}</td><td>SAR {DATA.financials.projections.y2.profit.toLocaleString()}</td></tr>
                  <tr><td className="py-1">Y3</td><td>SAR {DATA.financials.projections.y3.revenue.toLocaleString()}</td><td>SAR {DATA.financials.projections.y3.profit.toLocaleString()}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
            <h3 className="font-bold text-sm text-emerald-800 mb-2">Use of Funds (USD 15,000)</h3>
            <table className="w-full text-xs">
              <thead><tr className="border-b"><th className="text-left py-1">Category</th><th>%</th><th>Amount</th><th className="text-left">Description</th></tr></thead>
              <tbody>
                {DATA.financials.useOfFunds.breakdown.map((item: any, i: number) => (
                  <tr key={i} className="border-b border-neutral-200">
                    <td className="py-1">{item.category_en}</td>
                    <td>{item.percentage}%</td>
                    <td>${item.amount.toLocaleString()}</td>
                    <td className="text-xs text-neutral-600">{item.description_en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-neutral-500 mt-2">Note: No employee salaries at current stage. Monthly operating costs are covered from revenue or reserve.</p>
          </div>
        </section>

        <section className="mb-8 page-break">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            4. Roadmap
          </h2>
          <table className="w-full text-xs border border-neutral-200">
            <thead className="bg-emerald-800 text-white"><tr><th className="p-2 text-left">Phase</th><th>Date</th><th className="text-left">Description</th></tr></thead>
            <tbody>
              {DATA.roadmap.map((item: any, i: number) => (
                <tr key={i} className="border-b border-neutral-200">
                  <td className="p-2 font-semibold">{item.phase_en}</td>
                  <td className="p-2">{item.date_en}</td>
                  <td className="p-2">{item.desc_en}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-neutral-500 mt-2">First paid client milestone moved to Q4 2026 to allow full product validation before commercial scale.</p>
        </section>

        <section className="mb-8 page-break">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            5. Sectors
          </h2>
          {DATA.sectors.map((s: any) => (
            <div key={s.id} className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 mb-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-emerald-800">{s.icon} {s.name_en}</h3>
                <span className="text-xs text-neutral-500">{s.status.toUpperCase()} · {s.timeline}</span>
              </div>
              <p className="text-xs mt-2">{s.justification_en}</p>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div>Workflows: <b>{s.readiness.workflows}</b></div>
                <div>SOPs: <b>{s.readiness.sops}</b></div>
                <div>Readiness: <b>{s.readiness.percentage}%</b></div>
              </div>
            </div>
          ))}
        </section>

        <section className="mb-8 page-break">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            6. Risk Register
          </h2>
          <table className="w-full text-xs border border-neutral-200">
            <thead className="bg-emerald-800 text-white"><tr><th className="p-2 text-left">Risk</th><th>Category</th><th>Prob.</th><th>Impact</th><th className="text-left">Mitigation</th></tr></thead>
            <tbody>
              {DATA.risks.map((r: any, i: number) => (
                <tr key={i} className="border-b border-neutral-200">
                  <td className="p-2 font-semibold">{r.name_en}</td>
                  <td className="p-2">{r.category_en}</td>
                  <td className="p-2">{r.prob}</td>
                  <td className="p-2">{r.impact}</td>
                  <td className="p-2">{r.mitigation_en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mb-8 page-break">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            7. Business Plan (20 Sections)
          </h2>
          {DATA.businessPlan.map((sec: any, i: number) => (
            <details key={i} className="border border-neutral-200 rounded-xl p-3 bg-neutral-50 mb-2" open={i < 3}>
              <summary className="font-bold text-sm cursor-pointer text-emerald-800">{i + 1}. {sec.title_en}</summary>
              <p className="text-xs mt-2 whitespace-pre-line">{sec.content_en.replace(/\n/g, '
')}</p>
            </details>
          ))}
        </section>

        <section className="mb-8 page-break">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            8. Data Room Index (49 Files)
          </h2>
          <p className="text-xs mb-3">The following is an index of 49 documented files. Full content available under NDA or direct investor review.</p>
          <div className="grid grid-cols-2 gap-2">
            {DATA_ROOM_FILES.map((f: any) => (
              <div key={f.id} className="border border-neutral-200 rounded-lg p-2 bg-neutral-50">
                <div className="font-bold text-xs font-mono">{f.id} · {f.name}</div>
                <div className="text-xs text-neutral-500">{f.category} · {f.summary}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 page-break">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            9. The Ask
          </h2>
          <div className="border border-neutral-200 rounded-xl p-8 bg-neutral-50 text-center">
            <div className="text-5xl font-bold text-emerald-800">SAR {DATA.ask.amount.toLocaleString()}</div>
            <div className="text-2xl font-bold text-amber-700 mt-2">USD {DATA.ask.amount_usd.toLocaleString()}</div>
            <p className="text-sm mt-3">{DATA.ask.structure_en}</p>
            <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
              <div className="border border-neutral-200 rounded-lg p-3">
                <div className="font-bold">Phase 1</div>
                <div className="text-xs text-neutral-600 mt-1">{DATA.ask.phase1}% until capital recovery</div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-3">
                <div className="font-bold">Phase 2</div>
                <div className="text-xs text-neutral-600 mt-1">{DATA.ask.phase2}% for {DATA.ask.phase2_months} months</div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-3">
                <div className="font-bold">Buyout</div>
                <div className="text-xs text-neutral-600 mt-1">{DATA.ask.buyout_months} months × {DATA.ask.buyout_multiple}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            10. Sources
          </h2>
          <ul className="text-xs space-y-1">
            {DATA.dataSources.map((s: any, i: number) => (
              <li key={i}>
                <b>{s.publisher}</b> — {s.title}. Accessed {s.accessed}. {s.note}
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-10 pt-6 border-t border-neutral-200 text-center text-xs text-neutral-500">
          © 2026 {DATA.company.name_en}. Confidential investor briefcase. Static edition generated from verified project documentation.
        </footer>
      </div>
    </div>
  );
}
