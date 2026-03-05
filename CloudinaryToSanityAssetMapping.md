# Cloudinary to Sanity Asset Mapping Summary

Generated on 2026-03-05 for repo `ashton-carrington`.

## Migration Totals

1. Source references mapped: 14
2. Unique Cloudinary assets uploaded: 5
3. Rows marked `MIGRATED`: 14
4. Rows marked `BLOCKED`: 0
5. Rows marked `VERIFIED`: 0 (manual QA pending)

## Uploaded Asset Keys

1. `graphic_waves` -> `image-a85b19a75d625e4ccd0c5c469dc046888df5f017-150x85-svg`
2. `logo_gradient` -> `image-3e91dbe1161b0925402f57a91bce00b18b4ba682-100x41-svg`
3. `nav_vector` -> `image-bc6784732857c165a4c89ac0b5c76de93364afbf-28x24-svg`
4. `who_we_are_overlay` -> `image-8b1fcddeb158c2d6913fc590aabdf46c390e76c2-150x85-svg`
5. `hero_overlay` -> `image-05d0bece18e869859a549f47ef15ae4c2217289c-150x85-svg`

## Legal Page Background Backfill

From `migration-artifacts/sanity-backfill-report.json`:

1. `privacyPolicyPage`: `UPDATED`
2. `termsPage`: `UPDATED`
3. `accountsnFilingPage`: `UNCHANGED` (already set)
4. `capitalAllowancePage`: `UNCHANGED` (already set)
5. `rndTaxCreditsPage`: `UPDATED`

## Runtime Cloudinary Gate

Command:

```bash
rg -n -i "res\\.cloudinary\\.com|cloudinary-build-url|cloudinaryImageRetreival|getCloudinaryImage" src package.json next.config.mjs --glob '!**/node_modules/**'
```

Result: no matches.
