# Backup Log

Every backup and change is recorded here. Backups live in `backups/<stamp>/`.

## Backup 2026-10-10_1912-UTC (2026-10-10 19:11 UTC)
- Source commit before this change: `c0793ae6bcd66a661a1d4d02c25d29db05b20dbc`
- Folder: `backups/2026-10-10_1912-UTC/` (20 files)
- Changes in this commit: robot redesign (multiple robots), security headers in vercel.json (CSP, HSTS, X-Frame-Options, etc.), output dir set to `out` to match next.config export.
- Rollback: copy the folder back over the repo root, or `git revert` this commit.

| File | Bytes | SHA-256 (12) |
|---|---|---|
| `.github/workflows/deploy.yml` | 1820 | `4e4bf62f431d` |
| `CHANGELOG.md` | 3282 | `f4c99b33d637` |
| `Changelog` | 437 | `8bb5753944da` |
| `PROMPT.md` | 2139 | `eb3438a8c985` |
| `_backup_v4_2026-10-09_0527/MANIFEST.md` | 236 | `4b05f1cabcdd` |
| `next.config.mjs` | 176 | `8cda1ff4b55f` |
| `package.json` | 838 | `0ccac1eadecf` |
| `postcss.config.mjs` | 66 | `dc57c825141a` |
| `src/app/globals.css` | 2566 | `1e30f47248ac` |
| `src/app/layout.tsx` | 1015 | `6ca0b5ed3c90` |
| `src/app/page.tsx` | 115053 | `051dc5f3d350` |
| `src/components/AdvancedCharts.tsx` | 6218 | `4bfc2da32ed6` |
| `src/components/DataRoomVault.tsx` | 36585 | `a2a52fb422da` |
| `src/components/SectorModal.tsx` | 6894 | `25ecc8db9c1e` |
| `src/lib/data.ts` | 61741 | `9910e581d485` |
| `src/lib/translations.ts` | 3837 | `e1dcbb4307a6` |
| `src/lib/utils.ts` | 403 | `a98b66c07365` |
| `tailwind.config.ts` | 1617 | `f71a8d6e252e` |
| `tsconfig.json` | 645 | `5d86f206997c` |
| `vercel.json` | 280 | `cc2fe8762a6b` |

## Backup 2026-10-10_2021-UTC (2026-10-10 20:21 UTC)
- **Reason:** backup before the logo update and before the roadmap/data room changes were confirmed. Previous backup: `2026-10-10_1912-UTC`.
- **Source commit before this backup:** `d477df2625f28642d137f831fe513bc9c70f8c46`
- **Folder:** `backups/2026-10-10_2021-UTC/` (21 files, full copy of the repo before this change)
- **Changes since the previous backup (all pushed to main):**
  - Brand renamed to Seen Agentic (سين إيجنتك) across data, translations, layout and page.
  - New logo: Arabic letter س with the word seen and a swoosh; header and hero use it.
  - Robots: redesigned bot; placed around the business plan visuals, sectors, risks, workstation, team, data room and security. Robots hidden on phones in data room and placed beside visuals on larger screens.
  - Security: radar behind the security section; security robot removed.
  - Team: constellation and hexagonal radar removed; gear workshop visual added.
  - Business plan: stat changed to 49; bot pair around page visuals; visual areas made transparent.
  - Sectors: chord chart removed; bubble chart kept.
  - Risks: donut (sunburst) chart removed.
  - Header: hides on scroll down, returns immediately on scroll up (fixed header with spacer).
  - Data room: 49 cards in three tabs (مسموح green, مشدد amber, ممنوع red), each card opens a detailed popup; cards are two columns on phones.
  - Roadmap: 15 milestones from Q1 2026 to Q4 2028 with icons, lit on scroll; the old Gantt removed.
  - Vercel config: security headers (CSP, HSTS, X-Frame-Options, etc.), outputDirectory restored to .next.
- **Rollback:** copy `backups/2026-10-10_2021-UTC/` over the repo root, or revert this commit.

| File | Bytes | SHA-256 (12) |
|---|---|---|
| `.github/workflows/deploy.yml` | 1820 | `4e4bf62f431d` |
| `BACKUP_LOG.md` | 1587 | `58e0ee28880d` |
| `CHANGELOG.md` | 3282 | `f4c99b33d637` |
| `Changelog` | 437 | `8bb5753944da` |
| `PROMPT.md` | 2139 | `eb3438a8c985` |
| `_backup_v4_2026-10-09_0527/MANIFEST.md` | 236 | `4b05f1cabcdd` |
| `next.config.mjs` | 176 | `8cda1ff4b55f` |
| `package.json` | 838 | `0ccac1eadecf` |
| `postcss.config.mjs` | 66 | `dc57c825141a` |
| `src/app/globals.css` | 2566 | `1e30f47248ac` |
| `src/app/layout.tsx` | 1012 | `78d813b0c6f4` |
| `src/app/page.tsx` | 136307 | `6d347d6c15c2` |
| `src/components/AdvancedCharts.tsx` | 6218 | `4bfc2da32ed6` |
| `src/components/DataRoomVault.tsx` | 36585 | `a2a52fb422da` |
| `src/components/SectorModal.tsx` | 6894 | `25ecc8db9c1e` |
| `src/lib/data.ts` | 61722 | `899a5dc8ce42` |
| `src/lib/translations.ts` | 3837 | `e1dcbb4307a6` |
| `src/lib/utils.ts` | 403 | `a98b66c07365` |
| `tailwind.config.ts` | 1617 | `f71a8d6e252e` |
| `tsconfig.json` | 645 | `5d86f206997c` |
| `vercel.json` | 1509 | `8bd955ff56ff` |
