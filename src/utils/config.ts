const PAPERLESS_URL = process.env["PAPERLESS_URL"];
const PAPERLESS_TOKEN = process.env["PAPERLESS_TOKEN"];
const PAPERLESS_FRONTEND_URL = process.env["PAPERLESS_FRONTEND_URL"];

if (!PAPERLESS_URL) {
  console.error("Missing PAPERLESS_URL environment variable");
  process.exit(1);
}

if (!PAPERLESS_TOKEN) {
  console.error("Missing PAPERLESS_TOKEN environment variable");
  process.exit(1);
}

export const config = {
  url: PAPERLESS_URL.replace(/\/+$/, ""),
  frontendUrl: (PAPERLESS_FRONTEND_URL ?? PAPERLESS_URL).replace(/\/+$/, ""),
  token: PAPERLESS_TOKEN,
} as const;
