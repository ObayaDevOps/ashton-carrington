import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";
import { UNIQUE_CLOUDINARY_ASSETS } from "./cloudinaryMigrationData.mjs";

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
const uploadCachePath = path.join(artifactsDir, "cloudinary-upload-cache.json");
const uploadResultsPath = path.join(artifactsDir, "cloudinary-upload-results.json");

async function ensureArtifactsDir() {
  await fs.mkdir(artifactsDir, { recursive: true });
}

async function readJsonIfExists(filePath, fallback) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch {
    return fallback;
  }
}

function inferContentType(url, headerType) {
  if (headerType && headerType.startsWith("image/")) {
    return headerType;
  }
  if (url.toLowerCase().endsWith(".svg")) {
    return "image/svg+xml";
  }
  if (url.toLowerCase().endsWith(".png")) {
    return "image/png";
  }
  if (url.toLowerCase().endsWith(".jpg") || url.toLowerCase().endsWith(".jpeg")) {
    return "image/jpeg";
  }
  if (url.toLowerCase().endsWith(".webp")) {
    return "image/webp";
  }
  return "application/octet-stream";
}

function inferFileName(publicId, contentType) {
  const hasExt = /\.[a-zA-Z0-9]+$/.test(publicId);
  if (hasExt) {
    return publicId;
  }
  if (contentType === "image/svg+xml") {
    return `${publicId}.svg`;
  }
  if (contentType === "image/png") {
    return `${publicId}.png`;
  }
  if (contentType === "image/jpeg") {
    return `${publicId}.jpg`;
  }
  if (contentType === "image/webp") {
    return `${publicId}.webp`;
  }
  return `${publicId}.bin`;
}

async function validateCachedAsset(assetId) {
  try {
    const doc = await client.getDocument(assetId);
    return Boolean(doc?._id);
  } catch {
    return false;
  }
}

function slimAsset(asset, key, cloudinaryUrl, publicId) {
  return {
    key,
    cloudinary_url: cloudinaryUrl,
    cloudinary_public_id: publicId,
    sanity_asset_id: asset?._id || "",
    sanity_url: asset?.url || "",
    width: asset?.metadata?.dimensions?.width || "",
    height: asset?.metadata?.dimensions?.height || "",
    originalFilename: asset?.originalFilename || ""
  };
}

async function run() {
  await ensureArtifactsDir();

  const cache = await readJsonIfExists(uploadCachePath, {});
  const results = {};

  for (const assetDef of UNIQUE_CLOUDINARY_ASSETS) {
    const { key, cloudinary_url: cloudinaryUrl, cloudinary_public_id: publicId } = assetDef;
    const cached = cache[cloudinaryUrl];

    if (cached?.sanity_asset_id) {
      const exists = await validateCachedAsset(cached.sanity_asset_id);
      if (exists) {
        results[key] = cached;
        console.log(`Reused cached asset: ${key} -> ${cached.sanity_asset_id}`);
        continue;
      }
    }

    console.log(`Uploading: ${key} (${cloudinaryUrl})`);
    const response = await fetch(cloudinaryUrl);
    if (!response.ok) {
      throw new Error(`Failed to download ${cloudinaryUrl}: ${response.status} ${response.statusText}`);
    }

    const headerType = response.headers.get("content-type") || "";
    const contentType = inferContentType(cloudinaryUrl, headerType.split(";")[0]?.trim());
    const fileName = inferFileName(publicId, contentType);
    const arrayBuffer = await response.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);

    const uploaded = await client.assets.upload("image", bytes, {
      filename: fileName,
      contentType,
      source: {
        name: "cloudinary-migration",
        id: cloudinaryUrl
      }
    });

    const mapped = slimAsset(uploaded, key, cloudinaryUrl, publicId);
    cache[cloudinaryUrl] = mapped;
    results[key] = mapped;

    await fs.writeFile(uploadCachePath, JSON.stringify(cache, null, 2));
  }

  await fs.writeFile(uploadResultsPath, JSON.stringify(results, null, 2));
  console.log(`Wrote upload results: ${uploadResultsPath}`);
}

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
