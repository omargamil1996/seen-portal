"use client";
import { DATA } from "@/lib/data";
import { DATA_ROOM_FILES } from "@/components/DataRoomVault";

export default function BriefcasePage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 print:bg-white">
      <style>{`
        @page { size: A4; margin: 14mm; }
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-break { page-break-before: always; }
        }
        .sheet { max-width: 980px; margin: 0 auto; padding: 32px; font-family: Cairo, system-ui, sans-serif; }
        .brand { color: #0F5132; }
        .gold { color: #B8962E; }
        .box { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin: 10px 0; background: #fafafa; }
        .grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        .grid3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        .tiny { font-size: 10px; color: #6b7280; }
        .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; margin: 8px 0; }
        th, td { border: 1px solid #e5e7eb; padding: 6px 8px; text-align: left; vertical-align: top; }
        th { background: #0F5132; color: white; }
        ul { padding-right: 16px; margin: 6px 0; }
        li { margin: 3px 0; font-size: 11px; }
        h1 { font-size: 28px; }
        h2 { font-size: 20px; margin-top: 20px; color: #0F5132; border-bottom: 2px solid #D4AF37; padding-bottom: 4px; }
        h3 { font-size: 14px; color: #0F5132; margin: 8px 0 4px; }
        p { font-size: 11px; line-height: 1.55; }
      `}</style>

      <div className="sheet">
        <div className="no-print flex justify-between items-center mb-6 p-4 rounded-xl bg-neutral-100 border border-neutral-200">
          <a href="/" className="text-sm font-bold brand">← Return to live briefcase</a>
          <button onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-[#0F5132] text-white text-sm font-bold">
            Save as PDF / Print
          </button>
        </div>

        <header className="border-b-2 border-[#0F5132] pb-6 mb-8">
          <div className="flex justify-between items-start gap-6">
            <div>
              <h1 className="brand">{DATA.company.name_ar}</h1>
              <p className="text-xl text-neutral-600 mt-1">{DATA.company.name_en}</p>
              <p className="mt-3 text-sm gold font-bold">{DATA.company.tagline_ar} | {DATA.company.tagline_en}</p>
            </div>
            <div className="text-left tiny">
              <div className="mono">2026-10-09</div>
              <div>Confidential Investor Briefcase</div>
              <div>Static Edition v5.1</div>
            </div>
          </div>
        </header>

        <h2>1. Executive Summary | الملخص التنفيذي</h2>
        <div className="box">
          <p>{DATA.businessPlan[0].content_ar.replace(/\n/g, ' ')}</p>
          <p className="mt-2 text-neutral-600">{DATA.businessPlan[0].content_en.replace(/\n/g, ' ')}</p>
        </div>

        <div className="page-break"></div>

        <h2>2. Market Opportunity | فرصة السوق</h2>
        <div className="grid3">
          <div className="box text-center">
            <div className="tiny">TAM</div>
            <div className="text-2xl font-bold brand">${DATA.market.tam.value}B</div>
            <div className="tiny">{DATA.market.tam.label_en}</div>
          </div>
          <div className="box text-center">
            <div className="tiny">SAM</div>
            <div className="text-2xl font-bold gold">${DATA.market.sam.value}B</div>
            <div className="tiny">{DATA.market.sam.label_en}</div>
          </div>
          <div className="box text-center">
            <div className="tiny">SOM Y1</div>
            <div className="text-2xl font-bold" style={{ color: '#F97316' }}>${DATA.market.som.value}K</div>
            <div className="tiny">{DATA.market.som.label_en}</div>
          </div>
        </div>
        <div className="box">
          <p>This briefcase uses conservative market framing. Public reports indicate a large and growing Saudi AI/automation market, while Malaysia offers a secondary expansion market with lower specialized competition.</p>
        </div>

        <div className="page-break"></div>

        <h2>3. Financial Model | النموذج المالي</h2>
        <div className="grid2">
          <div className="box">
            <h3>Unit Economics</h3>
            <table>
              <tbody>
                <tr><th>ARPU</th><td>SAR {DATA.financials.arpu.toLocaleString()}</td></tr>
                <tr><th>Churn</th><td>{DATA.financials.churn}%</td></tr>
                <tr><th>CAC</th><td>SAR {DATA.financials.cac.toLocaleString()}</td></tr>
                <tr><th>Margin</th><td>{DATA.financials.margin}%</td></tr>
                <tr><th>Fixed costs</th><td>SAR {DATA.financials.fixedCosts.toLocaleString()}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="box">
            <h3>3-Year Projection</h3>
            <table>
              <thead><tr><th>Year</th><th>Revenue</th><th>Costs</th><th>Profit</th></tr></thead>
              <tbody>
                <tr><td>Y1</td><td>SAR {DATA.financials.projections.y1.revenue.toLocaleString()}</td><td>SAR {DATA.financials.projections.y1.costs.toLocaleString()}</td><td>SAR {DATA.financials.projections.y1.profit.toLocaleString()}</td></tr>
                <tr><td>Y2</td><td>SAR {DATA.financials.projections.y2.revenue.toLocaleString()}</td><td>SAR {DATA.financials.projections.y2.costs.toLocaleString()}</td><td>SAR {DATA.financials.projections.y2.profit.toLocaleString()}</td></tr>
                <tr><td>Y3</td><td>SAR {DATA.financials.projections.y3.revenue.toLocaleString()}</td><td>SAR {DATA.financials.projections.y3.costs.toLocaleString()}</td><td>SAR {DATA.financials.projections.y3.profit.toLocaleString()}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="box">
          <h3>Use of Funds | توزيع الأموال (USD 15,000)</h3>
          <table>
            <thead><tr><th>Category</th><th>%</th><th>Amount</th><th>Description</th></tr></thead>
            <tbody>
              {DATA.financials.useOfFunds.breakdown.map((item: any, i: number) => (
                <tr key={i}>
                  <td>{item.category_en}<br /><span className="tiny">{item.category_ar}</span></td>
                  <td>{item.percentage}%</td>
                  <td>${item.amount.toLocaleString()}</td>
                  <td className="text-xs">{item.description_en}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="tiny mt-2">Note: No employee salaries at current stage. Monthly operating costs are covered from revenue or reserve when needed.</p>
        </div>

        <div className="page-break"></div>

        <h2>4. Roadmap | خريطة الطريق</h2>
        <table>
          <thead><tr><th>Phase</th><th>Date</th><th>Description</th></tr></thead>
          <tbody>
            {DATA.roadmap.map((item: any, i: number) => (
              <tr key={i}>
                <td>{item.phase_en}<br /><span className="tiny">{item.phase_ar}</span></td>
                <td>{item.date_en}</td>
                <td className="text-xs">{item.desc_en}<br /><span className="tiny">{item.desc_ar}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="tiny mt-2">First paid client milestone moved to Q4 2026 to allow full product validation before commercial scale.</p>

        <div className="page-break"></div>

        <h2>5. Sectors | القطاعات</h2>
        {DATA.sectors.map((s: any) => (
          <div key={s.id} className="box">
            <div className="flex justify-between">
              <h3>{s.icon} {s.name_en} | {s.name_ar}</h3>
              <span className="tiny">{s.status.toUpperCase()} · {s.timeline}</span>
            </div>
            <p className="mt-2">{s.justification_en}</p>
            <p className="text-neutral-600 mt-1">{s.justification_ar}</p>
            <div className="grid3 mt-2">
              <div className="tiny">Workflows: <b>{s.readiness.workflows}</b></div>
              <div className="tiny">SOPs: <b>{s.readiness.sops}</b></div>
              <div className="tiny">Readiness: <b>{s.readiness.percentage}%</b></div>
            </div>
          </div>
        ))}

        <div className="page-break"></div>

        <h2>6. Risk Register | سجل المخاطر</h2>
        <table>
          <thead><tr><th>Risk</th><th>Category</th><th>Prob.</th><th>Impact</th><th>Mitigation</th></tr></thead>
          <tbody>
            {DATA.risks.map((r: any, i: number) => (
              <tr key={i}>
                <td>{r.name_en}<br /><span className="tiny">{r.name_ar}</span></td>
                <td>{r.category_en}</td>
                <td>{r.prob}</td>
                <td>{r.impact}</td>
                <td className="text-xs">{r.mitigation_en}<br /><span className="tiny">{r.mitigation_ar}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="page-break"></div>

        <h2>7. Business Plan | خطة العمل</h2>
        {DATA.businessPlan.map((sec: any, i: number) => (
          <details key={i} className="box" open={i < 3}>
            <summary className="font-bold cursor-pointer">{i + 1}. {sec.title_en} | {sec.title_ar}</summary>
            <p className="whitespace-pre-line mt-2">{sec.content_en.replace(/\n/g, '
')}</p>
            <p className="whitespace-pre-line mt-2 text-neutral-600">{sec.content_ar.replace(/\n/g, '
')}</p>
          </details>
        ))}

        <div className="page-break"></div>

        <h2>8. Data Room Index | فهرس غرفة البيانات</h2>
        <p>The following is an index of 49 documented files. Content is withheld from the public static edition and can be provided under NDA or direct investor review.</p>
        <div className="grid2">
          {DATA_ROOM_FILES.map((f: any) => (
            <div key={f.id} className="box !py-2 !px-3">
              <div className="font-bold text-xs mono">{f.id} · {f.name}</div>
              <div className="tiny">{f.category} · {f.summary}</div>
            </div>
          ))}
        </div>

        <div className="page-break"></div>

        <h2>9. The Ask | طلب الاستثمار</h2>
        <div className="box text-center">
          <div className="text-4xl font-bold brand">SAR {DATA.ask.amount.toLocaleString()}</div>
          <div className="text-xl gold font-bold mt-1">USD {DATA.ask.amount_usd.toLocaleString()}</div>
          <p className="text-sm mt-3">{DATA.ask.structure_en} | {DATA.ask.structure_ar}</p>
          <div className="grid3 mt-4 text-sm">
            <div>Phase 1: {DATA.ask.phase1}% until capital recovery</div>
            <div>Phase 2: {DATA.ask.phase2}% for {DATA.ask.phase2_months} months</div>
            <div>Buyout: {DATA.ask.buyout_months} months × {DATA.ask.buyout_multiple}</div>
          </div>
        </div>

        <h2>10. Sources | المصادر</h2>
        <ul>
          {DATA.dataSources.map((s: any, i: number) => (
            <li key={i}>
              <b>{s.publisher}</b> — {s.title}. Accessed {s.accessed}. {s.note}
            </li>
          ))}
        </ul>

        <footer className="mt-10 pt-6 border-t border-neutral-200 text-center tiny">
          © 2026 {DATA.company.name_en}. Confidential investor briefcase. Static edition generated from verified project documentation.
        </footer>
      </div>
    </main>
  );
}
