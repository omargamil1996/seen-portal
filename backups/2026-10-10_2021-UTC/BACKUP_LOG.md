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
