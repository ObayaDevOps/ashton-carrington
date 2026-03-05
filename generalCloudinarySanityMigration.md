# General Cloudinary -> Sanity Migration Playbook

This document is a reusable, repo-agnostic playbook for migrating from Cloudinary to Sanity with high confidence and traceability.

It is based on a full migration workflow already executed in a real repo and generalized for repeat use across other repositories.

---

## 1) Objectives

1. Remove all runtime dependency on Cloudinary (`res.cloudinary.com`, Cloudinary SDK/helpers, Cloudinary env vars where applicable).
2. Migrate assets into Sanity (Content Lake dataset assets).
3. Keep strict auditability through a CSV mapping table.
4. Preserve visual parity before/after migration using structured QA.
5. Support phased rollout, rollback, and multi-repo reuse.

---

## 2) Migration Principles

1. Asset-first: upload and map assets before code changes.
2. Deterministic mapping: every Cloudinary URL maps to a specific Sanity asset URL/reference.
3. Deduplicate aggressively: multiple source references should reuse one Sanity asset.
4. Preserve behavior first, optimize later.
5. Verify with strict automation and manual spot checks.

---

## 3) Standard Inputs Required

For each repo, collect:

1. Repo path and target branch name (for example: `cloudinaryImageMigration`).
2. Sanity target:
- `projectId`
- `dataset`
3. Local Cloudinary asset export path (folder containing downloaded media).
4. Production URL (for baseline validation).
5. Preferred preview URL/local URL for post-migration validation.
6. Write-capable `SANITY_API_TOKEN` in shell environment (do not share in chat or commit to git).

---

## 4) One-Time Per-Repo Setup

1. Create migration branch:
```bash
git checkout -b cloudinaryImageMigration
```

2. If uncommitted local changes exist, stash first:
```bash
git stash push -u -m "pre-cloudinary-migration"
```

3. Scan for Cloudinary usage:
```bash
rg -n -i "cloudinary|res\\.cloudinary\\.com|cloudinary-build-url|cloudinaryImageRetreival|getCloudinaryImage" --glob '!**/node_modules/**'
```

4. Categorize references:
- direct URLs in source
- helper function usage
- package dependency usage
- Next image allowlist usage
- SEO/meta tags (`og:image`, favicon)
- comments (optional cleanup)

---

## 5) CSV Mapping Table Pattern

Create a canonical CSV in repo root, e.g. `CloudinaryToSanityAssetMapping.csv`.

Recommended columns:

1. `mapping_id`
2. `status` (`TODO`, `UPLOADED`, `MIGRATED`, `VERIFIED`, `BLOCKED`)
3. `route_or_component`
4. `source_file`
5. `source_line`
6. `cloudinary_url`
7. `cloudinary_public_id`
8. `local_file_path`
9. `sanity_project_id`
10. `sanity_dataset`
11. `sanity_document_type`
12. `sanity_document_id`
13. `sanity_field_path`
14. `sanity_asset_id`
15. `sanity_url`
16. `width`
17. `height`
18. `notes`
19. `verified_before_migration`
20. `verified_after_migration`

Important:
1. Seed rows programmatically from code scan.
2. Keep one row per source reference for auditability.
3. Deduplicate uploads by Cloudinary URL, but preserve all source rows.

---

## 6) Sanity Schema Strategy

Use two schema layers:

1. Existing page/document schemas:
- prefer mapping assets directly into actual content fields where feasible.

2. `siteSettings` singleton (recommended):
- central shared assets (`primaryLogo`, `lightLogo`, `favicon`, `defaultOgImage`)
- `legacyAssetMappings[]` object array for migration ledger and fallback mapping metadata

Suggested `legacyAssetMappings` object fields:
1. `legacyUrl`
2. `publicId`
3. `mappedAsset` (image reference)
4. `routeOrComponent`
5. `targetDocumentType`
6. `targetDocumentId`
7. `targetFieldPath`
8. `sourceFile`
9. `sourceLine`
10. `notes`

Why this helps:
1. Shared asset management is centralized.
2. Mapping metadata lives inside Sanity for future maintenance.
3. You can migrate incrementally without losing traceability.

---

## 7) Upload Workflow (Programmatic)

Preferred mode for this migration: Content Lake dataset assets (`client.assets.upload`), not Media Library-first.

Steps:

1. Build/find local file candidates from `cloudinary_public_id` and URL filename.
2. Upload unique assets to Sanity.
3. Write back to CSV:
- `sanity_asset_id`
- `sanity_url`
- `width`, `height`
- `status=UPLOADED`
4. Reuse uploaded asset metadata for duplicate URL rows.
5. Mark unresolved rows as `BLOCKED` with explicit notes.

Safety:
1. Create CSV backups before write.
2. Support dry-run mode to test candidate matching.

Environment note:
1. Ensure `SANITY_API_TOKEN` is present in runtime shell.
2. `.env.local` does not automatically load in all script invocations unless explicitly sourced.

---

## 8) Sync Mapping Into Sanity

After upload, sync CSV rows into `siteSettings.legacyAssetMappings[]`.

Recommended behavior:
1. `createIfNotExists` singleton `siteSettings`.
2. `set` full mapping array from current CSV state.
3. Auto-set shared image fields (`primaryLogo`, `lightLogo`, `favicon`, `defaultOgImage`) from mapped rows.

This gives a live migration inventory in Sanity, not only in local CSV.

---

## 9) Code Migration Workflow

Order:

1. Replace direct Cloudinary URLs in source with mapped `sanity_url` values.
2. Migrate shared branding/meta references to `siteSettings` usage where practical.
3. Remove helper imports/functions if no longer needed.
4. Remove Cloudinary dependencies from `package.json` and lockfile.
5. Remove `res.cloudinary.com` from Next image allowlist.
6. Re-scan source to enforce zero runtime Cloudinary references.

Recommended scan gate:
```bash
rg -n -i "res\\.cloudinary\\.com|cloudinary-build-url|cloudinaryImageRetreival|getCloudinaryImage" src package.json next.config.js --glob '!**/node_modules/**'
```
Expected result: no matches.

---

## 10) Hydration/Third-Party Widget Caveat

If pages use third-party custom elements/scripts (for example booking widgets), migration changes can expose hydration issues.

Symptom:
- `Hydration failed because the initial UI does not match...`

Mitigation pattern:
1. Render widget in a client-only boundary (`dynamic(..., { ssr: false })` or mounted-only pattern).
2. Load third-party scripts after client mount and in deterministic order.
3. Avoid script-driven DOM mutations before React hydration completes.

Apply this independently from asset migration if needed.

---

## 11) Manual Verification Checklist

After automated checks:

1. Open homepage and major media pages.
2. Confirm logos/icons/hero backgrounds render.
3. Confirm social metadata:
- `og:image`
- `og:image:secure_url`
4. Confirm widget flows (booking, embeds) still function.
5. Confirm no obvious mobile regressions.

## 12) Status Tracking Lifecycle

Use `status` column progression:

1. `TODO` -> discovered
2. `UPLOADED` -> in Sanity with ID/URL
3. `MIGRATED` -> code/content now uses Sanity source
4. `VERIFIED` -> passed validation + manual checks
5. `BLOCKED` -> unresolved, must include reason in `notes`

Completion criteria per repo:
1. `MIGRATED` for all intended rows.
2. zero runtime Cloudinary scan hits.
3. validation checks completed and signed off.

---

## 13) Rollback Plan

If migration causes regressions:

1. Roll back deployment to previous known-good version.
2. Keep mapping CSV and Sanity uploads intact.
3. Fix mapping errors and retry in smaller batches.
4. Do not decommission Cloudinary account until all repos are stable.

## 14) Multi-Repo Execution Pattern

For many repos, run in waves:

1. Wave 1: high-impact repos with most Cloudinary hits.
2. Wave 2: medium/low impact active repos.
3. Wave 3: archive repos only if still deployed.

Per-wave routine:
1. inventory
2. upload+mapping
3. code cutover
4. validation checks
5. deploy
6. monitor

---

## 15) Recommended Deliverables Per Repo

1. `CloudinaryMigration<RepoName>.md` (repo-specific plan)
2. `CloudinaryToSanityAssetMapping.csv`
3. `CloudinaryToSanityAssetMapping.md`
4. Upload/sync scripts (if automated)
5. Validation artifacts/checklists
6. Final migration summary with counts:
- uploaded unique assets
- deduped references
- blocked rows
- migrated rows
- verified rows

## 16) Quick Command Template (Adapt Per Repo)

1. Scan:
```bash
rg -n -i "cloudinary|res\\.cloudinary\\.com|cloudinary-build-url" --glob '!**/node_modules/**'
```

2. Upload mapping:
```bash
npm run sanity:upload:mapping
```

3. Sync mapping to Sanity:
```bash
npm run sanity:sync:mapping
```

4. Verify no runtime references:
```bash
rg -n -i "res\\.cloudinary\\.com|cloudinary-build-url|cloudinaryImageRetreival|getCloudinaryImage" src package.json next.config.js --glob '!**/node_modules/**'
```

## 17) Common Pitfalls

1. Token not loaded in current shell.
2. Assuming `.env.local` is automatically sourced.
3. Confusing Media Library upload flow with Content Lake asset upload flow.
4. Not deduping identical Cloudinary URLs.
5. Updating code before asset mapping is complete.
6. Hydration breakages from third-party widgets/scripts.
7. Forgetting to remove `res.cloudinary.com` from image allowlist.
8. Forgetting to clean or ignore stale mapping backup files before commit.

---

## 18) Final Definition of Done

A repo is complete when all are true:

1. Assets uploaded and mapped in CSV.
2. Mapping synced to Sanity singleton (if used).
3. Runtime code uses Sanity assets only.
4. No Cloudinary runtime references remain.
5. Before/after validation executed and reviewed.
6. Manual smoke tests passed.
7. Deployment is stable for agreed soak window.
