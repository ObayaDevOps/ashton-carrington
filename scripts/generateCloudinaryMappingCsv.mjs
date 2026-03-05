import fs from "node:fs/promises";
import path from "node:path";
import { CLOUDINARY_REFERENCES } from "./cloudinaryMigrationData.mjs";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || "").replace(/"/g, "");
const mode = process.argv.includes("--migrated") ? "migrated" : "uploaded";

const artifactsDir = path.join(process.cwd(), "migration-artifacts");
const uploadResultsPath = path.join(artifactsDir, "cloudinary-upload-results.json");
const outputCsvPath = path.join(process.cwd(), "CloudinaryToSanityAssetMapping.csv");

const header = [
  "mapping_id",
  "status",
  "route_or_component",
  "source_file",
  "source_line",
  "cloudinary_url",
  "cloudinary_public_id",
  "local_file_path",
  "sanity_project_id",
  "sanity_dataset",
  "sanity_document_type",
  "sanity_document_id",
  "sanity_field_path",
  "sanity_asset_id",
  "sanity_url",
  "width",
  "height",
  "notes",
  "verified_before_migration",
  "verified_after_migration"
];

function escapeCsv(value) {
  const stringValue = String(value ?? "");
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

async function readResults() {
  try {
    const content = await fs.readFile(uploadResultsPath, "utf8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

function resultByCloudinaryUrl(uploadResults) {
  const byUrl = {};
  for (const value of Object.values(uploadResults)) {
    if (value?.cloudinary_url) {
      byUrl[value.cloudinary_url] = value;
    }
  }
  return byUrl;
}

async function run() {
  const uploadResults = await readResults();
  const byUrl = resultByCloudinaryUrl(uploadResults);

  const rows = CLOUDINARY_REFERENCES.map((row) => {
    const upload = row.cloudinary_url ? byUrl[row.cloudinary_url] : undefined;
    const hasUpload = Boolean(upload?.sanity_asset_id);
    const isHelperRow = row.source_file.includes("cloudinaryImageRetreival");

    let status = "TODO";
    if (isHelperRow) {
      status = mode === "migrated" ? "MIGRATED" : "TODO";
    } else if (hasUpload) {
      status = mode === "migrated" ? "MIGRATED" : "UPLOADED";
    } else if (row.cloudinary_url) {
      status = "BLOCKED";
    }

    return {
      mapping_id: row.mapping_id,
      status,
      route_or_component: row.route_or_component,
      source_file: row.source_file,
      source_line: row.source_line,
      cloudinary_url: row.cloudinary_url,
      cloudinary_public_id: row.cloudinary_public_id,
      local_file_path: "",
      sanity_project_id: projectId,
      sanity_dataset: dataset,
      sanity_document_type: row.sanity_document_type,
      sanity_document_id: row.sanity_document_id,
      sanity_field_path: row.sanity_field_path,
      sanity_asset_id: upload?.sanity_asset_id || "",
      sanity_url: upload?.sanity_url || "",
      width: upload?.width || "",
      height: upload?.height || "",
      notes: row.notes,
      verified_before_migration: "",
      verified_after_migration: ""
    };
  });

  const csvLines = [header.join(",")];
  for (const row of rows) {
    csvLines.push(header.map((col) => escapeCsv(row[col])).join(","));
  }

  await fs.writeFile(outputCsvPath, `${csvLines.join("\n")}\n`, "utf8");
  console.log(`Wrote mapping CSV: ${outputCsvPath}`);
}

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
