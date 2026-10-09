# Changelog

## [5.1.0] - 2026-10-09

### Added
- **Static printable investor briefcase** at `/briefcase` with A4-optimized layout and "Save as PDF" button.
- **Interactive sector modals** (`SectorModal.tsx`) with strategic justification, sub-sectors, persona, and operational readiness indicators.
- **Data Room vault** (`DataRoomVault.tsx`) listing all 49 indexed documents without exposing sensitive content.
- **20-section expanded business plan** with detailed Arabic and English content.
- **Expanded risk register** across 8 categories: operational, technical, market, regulatory, financial, legal, quality, security.
- **Verified 2024-2026 data sources** with access dates (IMARC, Grand View, MarketsandMarkets, Richmond Fed, UiPath IR, etc.).

### Changed
- **Use of funds updated to USD 15,000** with no employee salaries: 67% hardware/CapEx, 20% R&D/infrastructure, 13% marketing, 0% salaries.
- **Roadmap updated**: first paid client moved from Q3 2026 to Q4 2026.
- **Dashboard briefcase cards now perform real actions** instead of dead buttons (navigate to Financials, Data Room, or /briefcase).
- **Header now exposes direct link** to static briefcase route.
- **Sectors page** opens full interactive modal on click with strategy, persona, and readiness.
- **Data Room page** now uses dedicated vault component showing 49 indexed files.

### Security
- No sensitive content from 05_security or 07_migration is exposed in public site data.
- Data Room shows only filenames, dates, categories, and abstract 2-3 word summaries.
- Full document access requires direct contact and NDA where applicable.

---


## [5.0.0] - 2026-10-09

### Major Release: Investor Briefcase v5.0

#### Added
- Framer Motion 11 integration for premium animations
- Recharts 2.12 for interactive data visualization (Area, Line, Pie charts)
- Complete Dark Mode with theme toggle
- Full i18n (Arabic/English) with RTL/LTR support
- 12-Tab Navigation system:
  1. Dashboard with 3 interactive investor briefcases
  2. Financials with 6 sliders + real-time charts + P&L table
  3. Business Plan (10 full sections, not summarized)
  4. Sectors (5 sectors with interactive cards)
  5. Roadmap (Timeline from idea inception)
  6. Risks (Color-coded table with mitigation)
  7. Hardware (Complete workstation build)
  8. The Ask (SAR 82,500 + 14-slide pitch deck)
  9. Data Room (Due Diligence checklist)
  10. Team (Founder profile)
  11. Security (High-level highlights)
  12. Settings (Language + theme)
- 3 Interactive Investor Briefcases
- Bundled TAM/SAM/SOM card with animated counters
- Interactive Checklists with progress tracking
- Glass morphism + noise textures
- Gold-themed scrollbars and accents
- Animated counters on scroll
- Staggered fade-up animations

#### Security Compliance
- NO sensitive content from 05_security exposed
- NO internal content from 07_migration exposed
- Only investor-safe public data included
- High-level security claims only

#### Technical Stack
- Next.js 14.2.0 (App Router)
- React 18.2.0
- TypeScript 5.3.3 (strict)
- Tailwind CSS 3.4.1 with dark mode
- Framer Motion 11.0.8
- Recharts 2.12.2
- Lucide React icons
- Google Fonts (Amiri, Cairo, Inter)

## [4.0.0] - Previous
- Initial SPA with 8 tabs

## [3.0.0] - Legacy
- Multi-page HTML structure
