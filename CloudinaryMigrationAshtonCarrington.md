# Cloudinary Migration Plan: Ashton & Carrington

## 1) Repo Snapshot

- Repo: `ashton-carrington`
- Plan created: 2026-03-05
- Target branch: `cloudinaryImageMigration` (recommended)
- Sanity target from `.env.local`:
  - `projectId`: `y9d33xfx`
  - `dataset`: `production`
- Playbook source: `generalCloudinarySanityMigration.md`

## 2) Objectives (Repo-Specific)

1. Remove all runtime Cloudinary usage from app code and config.
2. Store all currently hardcoded Cloudinary assets in Sanity and source them from Sanity fields/URLs.
3. Preserve current visual output (logos, decorative backgrounds, legal page backgrounds).
4. Track every source reference in a mapping CSV for auditability.

## 3) Current Cloudinary Inventory

## Summary

- Runtime `res.cloudinary.com` references: 14
- Cloudinary helper references in codebase: helper file only, no consumers
- Cloudinary package dependency: `cloudinary-build-url`
- Unique Cloudinary asset URLs: 5

## Runtime References by File

- `next.config.mjs:5` (Next image domain allowlist includes `res.cloudinary.com`)
- `src/pages/index.js:94`
- `src/pages/index.js:124`
- `src/pages/index.js:132`
- `src/components/Navbar.js:74`
- `src/components/Navbar.js:114`
- `src/components/Footer.js:36`
- `src/components/WhoWeAreSection.js:119`
- `src/pages/privacy-policy.js:166`
- `src/pages/terms-and-conditions.js:166`
- `src/pages/accounts-filing.js:166`
- `src/pages/capital-allowances.js:166`
- `src/pages/research-and-development-tax-credits.js:168`

## Cloudinary-Specific Code/Deps

- `src/util/cloudinaryImageRetreival.js` (unused helper module)
- `package.json` dependency: `cloudinary-build-url`
- `package-lock.json` lock entries for `cloudinary-build-url`

## 4) Unique Asset Set and Proposed Targets

## Asset A

- Cloudinary URL:
  - `https://res.cloudinary.com/medoptics-image-cloud/image/upload/v1744286028/Graphic_waves_qtvac7.svg`
- Current use count: 5 (fallback page background across legal/tax pages)
- Proposed Sanity target:
  - Keep existing per-page `backgroundImage` fields populated so fallback is no longer needed.
  - Optional shared fallback field in `siteSettings.defaultPageBackground`.

## Asset B

- Cloudinary URL:
  - `https://res.cloudinary.com/medoptics-image-cloud/image/upload/v1744125894/Type_Default_Colour_Gradient_on_Blue_lgi2ha.svg`
- Current use count: 4 (homepage hero logo + footer logo + blurDataURL duplicate)
- Proposed Sanity target:
  - `landingPage.hero.logo` for homepage hero
  - shared branding field for footer logo (recommended `siteSettings.primaryLogo`)
  - remove explicit `blurDataURL` hardcoded URL and rely on Sanity image metadata or no blur placeholder for SVG

## Asset C

- Cloudinary URL:
  - `https://res.cloudinary.com/medoptics-image-cloud/image/upload/v1744279814/Vector_rdxjfp.svg`
- Current use count: 2 (navbar desktop + mobile)
- Proposed Sanity target:
  - shared branding field (recommended `siteSettings.navLogo` or `siteSettings.primaryMark`)

## Asset D

- Cloudinary URL:
  - `https://res.cloudinary.com/medoptics-image-cloud/image/upload/v1745050251/Graphic-1-Transparent_1_y95aqf.svg`
- Current use count: 1 (`WhoWeAreSection` decorative overlay)
- Proposed Sanity target:
  - `landingPage.whoWeAreSection` new optional decorative image field, or shared field in `siteSettings`

## Asset E

- Cloudinary URL:
  - `https://res.cloudinary.com/medoptics-image-cloud/image/upload/v1744124528/Graphic-2-Transparent_xw68uq.svg`
- Current use count: 1 (`index.js` top decorative overlay)
- Proposed Sanity target:
  - `landingPage.hero` new optional decorative background field, or shared field in `siteSettings`

## 5) Schema/Data Strategy

## Existing Fields Already Suitable

- `landingPage.hero.logo` (image)
- `landingPage.servicesSection.services[].iconImage` and `.backgroundImage` (already Sanity-driven)
- `privacyPolicyPage.backgroundImage`
- `termsPage.backgroundImage`
- `accountsFilingPage.backgroundImage`
- `capitalAllowancePage.backgroundImage`
- `rndTaxCreditsPage.backgroundImage`

## Recommended Addition

Create `siteSettings` singleton to centralize shared assets and migration ledger.

Suggested fields:
1. `primaryLogo` (image)
2. `navLogo` (image)
3. `defaultPageBackground` (image, optional fallback)
4. `heroDecorativeBackground` (image)
5. `whoWeAreDecorativeBackground` (image)
6. `favicon` (image or file, optional future-proofing)
7. `defaultOgImage` (image, optional future-proofing)
8. `legacyAssetMappings[]` object array for CSV sync traceability

If schema change is not desired now, use existing page fields plus `landingPage` additions for decorative assets.

## 6) Execution Plan

## Phase 0: Branch and Baseline

1. Create branch `cloudinaryImageMigration`.
2. Capture baseline screenshots for:
   - homepage
   - navbar/logo/footer
   - who-we-are panel
   - each legal/tax page background
3. Run and save baseline scan output.

Exit criteria:
- Baseline artifacts stored in repo (for example `migration-artifacts/baseline/`).

## Phase 1: Mapping CSV

1. Create `CloudinaryToSanityAssetMapping.csv` with playbook columns.
2. Seed one row per source reference from current inventory (14 rows).
3. Set initial `status=TODO`.
4. Fill `cloudinary_public_id` values inferred from URL path.

Exit criteria:
- CSV committed with complete source-file/line coverage.

## Phase 2: Upload to Sanity

1. Obtain or verify local media files for the 5 unique URLs.
2. Upload unique files to Sanity Content Lake dataset assets.
3. Write back `sanity_asset_id`, `sanity_url`, dimensions.
4. Mark duplicate reference rows using same asset ID/URL.
5. Set uploaded rows to `UPLOADED`.

Exit criteria:
- All 5 unique assets uploaded or explicitly marked `BLOCKED` with notes.

## Phase 3: Sanity Content Backfill

1. Populate legal/tax page `backgroundImage` fields where missing.
2. Populate shared logo/decorative fields (`siteSettings` or chosen model).
3. Sync `legacyAssetMappings[]` (if `siteSettings` is implemented).

Exit criteria:
- CMS content is ready to serve all assets without Cloudinary hardcoded fallbacks.

## Phase 4: Code Cutover

1. Replace hardcoded Cloudinary URLs with Sanity-driven values.
2. Remove Cloudinary fallback literals once Sanity content is confirmed.
3. Remove `src/util/cloudinaryImageRetreival.js` if still unused.
4. Remove `cloudinary-build-url` from dependencies/lockfile.
5. Remove `res.cloudinary.com` from `next.config.mjs` image domains.

Exit criteria:
- App renders with Sanity-backed assets only.

## Phase 5: Verification

Automated gate:

```bash
rg -n -i "res\\.cloudinary\\.com|cloudinary-build-url|cloudinaryImageRetreival|getCloudinaryImage" src package.json next.config.mjs --glob '!**/node_modules/**'
```

Expected result: zero runtime matches.

Manual QA:
1. Homepage: hero logo and decorative background.
2. Navbar and footer logos (desktop + mobile).
3. Who We Are decorative overlay.
4. All five legal/tax pages background rendering.
5. Mobile spot checks.

Exit criteria:
- CSV rows updated to `MIGRATED` then `VERIFIED`.

## Phase 6: Deploy and Monitor

1. Deploy after verification passes.
2. Monitor for missing/broken assets.
3. Keep rollback option to previous deployment until soak window passes.
4. Do not decommission Cloudinary account until confirmed stable.

## 7) Risks and Mitigations

1. Missing local source files for uploaded assets.
   - Mitigation: export/download assets by public ID before Phase 2.
2. Hardcoded fallback removal before CMS content is complete.
   - Mitigation: enforce Phase 3 complete before Phase 4.
3. Shared branding spread across components.
   - Mitigation: centralize in `siteSettings` to avoid drift.
4. SVG handling differences for placeholders.
   - Mitigation: avoid forced blur placeholders for SVG; verify visually.

## 8) Deliverables for This Repo

1. `CloudinaryMigrationAshtonCarrington.md` (this plan)
2. `CloudinaryToSanityAssetMapping.csv`
3. Optional `CloudinaryToSanityAssetMapping.md` summary
4. Upload/sync scripts if automation is added
5. Baseline and post-migration validation artifacts
6. Final migration summary with counts (`uploaded`, `deduped`, `blocked`, `migrated`, `verified`)

## 9) Definition of Done

1. All intended mapping rows are `MIGRATED` and `VERIFIED`.
2. No runtime Cloudinary references remain in app source/config.
3. Cloudinary dependency removed from runtime package set.
4. Visual parity checks pass on key pages/components.
5. Production deployment is stable through agreed soak period.

## 10) Implementation Status (2026-03-05)

1. Completed: Phase 1 mapping CSV created (`CloudinaryToSanityAssetMapping.csv`).
2. Completed: Phase 2 upload of 5 unique assets to Sanity (`migration-artifacts/cloudinary-upload-results.json`).
3. Completed: Phase 3 legal-page background backfill where missing (`migration-artifacts/sanity-backfill-report.json`).
4. Completed: Phase 4 code cutover, dependency removal, and Next image allowlist cleanup.
5. Completed: Automated runtime Cloudinary scan gate returns no matches in `src`, `package.json`, and `next.config.mjs`.
6. Pending: Phase 5 manual QA and setting CSV rows to `VERIFIED`.
