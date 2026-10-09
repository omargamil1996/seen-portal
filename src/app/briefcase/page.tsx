"use client";

export default function BriefcasePage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 p-4 rounded-xl bg-neutral-100">
          <a href="/" className="text-sm font-bold text-emerald-800">← Back to Live Briefcase</a>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-emerald-800 text-white rounded-lg font-bold hover:bg-emerald-900"
          >
            🖨️ Print / Save as PDF
          </button>
        </div>

        <header className="border-b-2 border-emerald-800 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-emerald-800">سين أوتوميشن</h1>
          <p className="text-2xl text-neutral-600 mt-1">Seen Automation</p>
          <p className="mt-3 text-lg font-bold text-amber-700">أتمتة. ارتقاء. حلال. | Automate. Elevate. Halal.</p>
          <p className="mt-4 text-sm text-neutral-500">Confidential Investor Briefcase - Static Edition v5.1</p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            1. Executive Summary
          </h2>
          <div className="border border-neutral-200 rounded-xl p-5 bg-neutral-50">
            <p className="text-sm leading-relaxed">
              Seen Automation AI Agency is an AI automation agency specialized first in engineering, then expanding horizontally to other sectors after proving the model. We operate a Zero-Friction model: automation works inside the client's daily tools, without imposing a new platform or complex training.
            </p>
            <p className="text-sm leading-relaxed mt-3 text-neutral-600">
              وكالة أتمتة ذكاء اصطناعي متخصصة في القطاع الهندسي أولاً، ثم التوسع الأفقي إلى قطاعات أخرى بعد إثبات النموذج. نعمل بنموذج Zero-Friction: الأتمتة تعمل داخل الأدوات اليومية للعميل.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            2. Market Opportunity
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-neutral-200 rounded-xl p-4 text-center bg-neutral-50">
              <div className="text-xs text-neutral-500">TAM</div>
              <div className="text-3xl font-bold text-emerald-800">$3.5B</div>
              <div className="text-xs text-neutral-500 mt-1">Total Addressable Market</div>
            </div>
            <div className="border border-neutral-200 rounded-xl p-4 text-center bg-neutral-50">
              <div className="text-xs text-neutral-500">SAM</div>
              <div className="text-3xl font-bold text-amber-700">$1.95B</div>
              <div className="text-xs text-neutral-500 mt-1">Serviceable Available Market</div>
            </div>
            <div className="border border-neutral-200 rounded-xl p-4 text-center bg-neutral-50">
              <div className="text-xs text-neutral-500">SOM Y1</div>
              <div className="text-3xl font-bold text-orange-600">$320K</div>
              <div className="text-xs text-neutral-500 mt-1">Serviceable Obtainable (Y1)</div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            3. Financial Model
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
              <h3 className="font-bold text-sm text-emerald-800 mb-2">Unit Economics</h3>
              <table className="w-full text-xs">
                <tbody>
                  <tr><td className="py-1 font-semibold">ARPU</td><td>SAR 1,600</td></tr>
                  <tr><td className="py-1 font-semibold">Churn</td><td>6%</td></tr>
                  <tr><td className="py-1 font-semibold">CAC</td><td>SAR 1,500</td></tr>
                  <tr><td className="py-1 font-semibold">Margin</td><td>70%</td></tr>
                </tbody>
              </table>
            </div>
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
              <h3 className="font-bold text-sm text-emerald-800 mb-2">3-Year Projection</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b"><th className="text-left py-1">Year</th><th>Revenue</th><th>Profit</th></tr></thead>
                <tbody>
                  <tr><td className="py-1">Y1</td><td>SAR 384,000</td><td>SAR 277,200</td></tr>
                  <tr><td className="py-1">Y2</td><td>SAR 600,000</td><td>SAR 456,000</td></tr>
                  <tr><td className="py-1">Y3</td><td>SAR 936,000</td><td>SAR 741,000</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 mt-4">
            <h3 className="font-bold text-sm text-emerald-800 mb-2">Use of Funds (USD 15,000)</h3>
            <table className="w-full text-xs">
              <thead><tr className="border-b"><th className="text-left py-1">Category</th><th>%</th><th>Amount</th></tr></thead>
              <tbody>
                <tr><td className="py-1">Hardware & Equipment (CapEx)</td><td>67%</td><td>$10,000</td></tr>
                <tr><td className="py-1">R&D & Infrastructure</td><td>20%</td><td>$3,000</td></tr>
                <tr><td className="py-1">Marketing & Acquisition</td><td>13%</td><td>$2,000</td></tr>
                <tr><td className="py-1">Employee Salaries</td><td>0%</td><td>$0</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-neutral-500 mt-2">Note: No employee salaries at current stage.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            4. Roadmap
          </h2>
          <table className="w-full text-xs border border-neutral-200">
            <thead className="bg-emerald-800 text-white">
              <tr><th className="p-2 text-left">Phase</th><th>Date</th><th className="text-left">Description</th></tr>
            </thead>
            <tbody>
              <tr className="border-b"><td className="p-2 font-semibold">Idea & Validation</td><td>Q1-Q2 2026</td><td>Market study, competitor analysis, 49 strategic files</td></tr>
              <tr className="border-b"><td className="p-2 font-semibold">Legal & Hardware</td><td>Q3 2026</td><td>Malaysia registration, $10K hardware, infrastructure</td></tr>
              <tr className="border-b"><td className="p-2 font-semibold">Beta Launch</td><td>October 2026</td><td>Investor portal, Landing Bot testing</td></tr>
              <tr className="border-b bg-amber-50"><td className="p-2 font-semibold">⭐ First Paid Client</td><td>Q4 2026</td><td>First engineering contract with Error Node</td></tr>
              <tr className="border-b"><td className="p-2 font-semibold">First Expansion</td><td>Q1-Q2 2027</td><td>20 clients, medical spear, MRR: SAR 32K</td></tr>
              <tr className="border-b"><td className="p-2 font-semibold">Regional Leadership</td><td>2028</td><td>80+ clients, Micro-SaaS, MRR: SAR 250K</td></tr>
            </tbody>
          </table>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-800 border-b-2 border-amber-600 pb-2 mb-4">
            5. The Ask
          </h2>
          <div className="border border-neutral-200 rounded-xl p-8 bg-neutral-50 text-center">
            <div className="text-5xl font-bold text-emerald-800">SAR 82,500</div>
            <div className="text-2xl font-bold text-amber-700 mt-2">USD 22,000</div>
            <p className="text-sm mt-3">Sharia-compliant Mudarabah (AAOIFI)</p>
            <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
              <div className="border border-neutral-200 rounded-lg p-3">
                <div className="font-bold">Phase 1</div>
                <div className="text-xs text-neutral-600 mt-1">15% until capital recovery</div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-3">
                <div className="font-bold">Phase 2</div>
                <div className="text-xs text-neutral-600 mt-1">15% for 36 months</div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-3">
                <div className="font-bold">Buyout</div>
                <div className="text-xs text-neutral-600 mt-1">24 months × 1.5</div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 pt-6 border-t border-neutral-200 text-center text-xs text-neutral-500">
          © 2026 Seen Automation. Confidential investor briefcase.
        </footer>
      </div>
    </div>
  );
}
