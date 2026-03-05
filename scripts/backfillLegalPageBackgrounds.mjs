import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || "").replace(/"/g, "");
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-03-27";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing required env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token
});

const artifactsDir = path.join(process.cwd(), "migration-artifacts");
const uploadResultsPath = path.join(artifactsDir, "cloudinary-upload-results.json");
const reportPath = path.join(artifactsDir, "sanity-backfill-report.json");

const targetDocumentTypes = [
  "privacyPolicyPage",
  "termsPage",
  "accountsnFilingPage",
  "capitalAllowancePage",
  "rndTaxCreditsPage"
];

async function readUploadResults() {
  const content = await fs.readFile(uploadResultsPath, "utf8");
  return JSON.parse(content);
}

function getBackgroundAssetId(uploadResults) {
  return uploadResults?.graphic_waves?.sanity_asset_id || "";
}

async function patchIfMissingBackground(documentType, backgroundAssetId) {
  const query = `*[_type == $type][0]{ _id, _type, backgroundImage }`;
  const doc = await client.fetch(query, { type: documentType });

  if (!doc?._id) {
    return {
      documentType,
      documentId: "",
      action: "SKIPPED",
      reason: "No document found for type"
    };
  }

  if (doc.backgroundImage?.asset?._ref) {
    return {
      documentType,
      documentId: doc._id,
      action: "UNCHANGED",
      reason: "backgroundImage already set"
    };
  }

  await client
    .patch(doc._id)
    .set({
      backgroundImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: backgroundAssetId
        }
      }
    })
    .commit();

  return {
    documentType,
    documentId: doc._id,
    action: "UPDATED",
    reason: "backgroundImage was missing and has been set"
  };
}

async function run() {
  const uploadResults = await readUploadResults();
  const backgroundAssetId = getBackgroundAssetId(uploadResults);
  if (!backgroundAssetId) {
    throw new Error("No migrated background asset found (graphic_waves). Run upload script first.");
  }

  await fs.mkdir(artifactsDir, { recursive: true });
  const report = [];

  for (const docType of targetDocumentTypes) {
    const result = await patchIfMissingBackground(docType, backgroundAssetId);
    report.push(result);
    console.log(`${docType}: ${result.action} (${result.reason})`);
  }

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`Wrote backfill report: ${reportPath}`);
}

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
