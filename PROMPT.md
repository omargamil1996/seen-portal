# Investor Briefcase - Build Prompt v5.0

## Purpose
Build a world-class Investor Briefcase for Seen Automation AI Agency.

## Stack
- Framework: Next.js 14.2.0 (App Router)
- Styling: Tailwind CSS 3.4.1 + custom design system
- Animations: Framer Motion 11
- Charts: Recharts 2.12
- Icons: Lucide React
- Language: TypeScript (strict mode)

## Design System

### Colors
- Emerald (Primary): #0F5132
- Gold (Accent): #D4AF37
- Orange (Accent): #F97316
- Background Light: #FAFAF8
- Background Dark: #0A0A0A

### Typography
- Arabic Headings: Amiri (serif)
- Arabic Body: Cairo (sans-serif)
- English: Inter (sans-serif)

## 12 Tabs
1. Dashboard - 3 briefcases + TAM/SAM/SOM + KPIs + checklists
2. Financials - 6 sliders + Recharts + P&L
3. Business Plan - 10 full sections
4. Sectors - 5 cards
5. Roadmap - Timeline
6. Risks - Table
7. Hardware - Workstation
8. The Ask - Pitch deck
9. Data Room - Checklist
10. Team - Founder
11. Security - Highlights
12. Settings - Lang + theme

## Security Rules (CRITICAL)
### ALLOWED
- Public business data, market analysis, financial projections
- Team info (founder only), high-level security claims
- Hardware specifications, business plan (public sections)

### FORBIDDEN
- 05_security detailed attack vectors, vulnerability specifics
- 07_migration system prompts, internal configs
- Proprietary competitive intelligence
- Internal operational details competitors could exploit

## i18n System
- All UI text supports Arabic and English
- translations.ts for UI strings
- data.ts for content with _ar and _en suffixes
- RTL for Arabic, LTR for English
- Automatic dir attribute switching

## Bundling Rule
When 3+ similar elements, bundle them into attractive cards.

## Animation Guidelines
- Framer Motion for all entrance animations
- Stagger delays for lists (0.05s increments)
- whileInView for scroll-triggered animations
- viewport once: true to avoid re-animation
- Smooth transitions (0.3-0.5s)
- Hover effects with scale and lift

## Quality Standards
World-class agency-level design. Reference standard.

## How to Resume
Say: "Dr. Seen, read 08_sessions/LATEST_SESSION.md and resume"
