import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const SRC_DIR = path.resolve(__dirname, "..", "src");
const LOCALES_DIR = path.join(SRC_DIR, "i18n", "locales");
const DOMAINS = ["default", "errors", "email", "pdf"] as const;
type Domain = (typeof DOMAINS)[number];

function isDomain(value: string): value is Domain {
  return (DOMAINS as readonly string[]).includes(value);
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "locales" || entry === "generated") continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else if (/\.(ts|tsx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

// Domain is resolved once per file/component via getTranslations(domain) /
// useTranslations(domain) / a local translate(locale, domain, ...) wrapper,
// then reused for every t(key) call in that file — mirrors how the app code
// is structured, so we only need to detect it once per file.
function detectDomain(source: string): Domain {
  const viaHelper = source.match(/(?:get|use)Translations\(\s*["'`](\w+)["'`]/);
  if (viaHelper && isDomain(viaHelper[1])) return viaHelper[1];

  const viaTranslate = source.match(/translate\(\s*\w+\s*,\s*["'`](\w+)["'`]/);
  if (viaTranslate && isDomain(viaTranslate[1])) return viaTranslate[1];

  return "default";
}

// Matches the first string-literal argument of a bare `t(...)` call.
// Dynamic/computed keys aren't supported — same constraint gettext itself
// imposes, since extraction is purely static.
function extractKeys(source: string): string[] {
  const keys: string[] = [];
  const regex = /\bt\(\s*(["'`])((?:\\.|(?!\1).)*)\1/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(source))) {
    keys.push(match[2].replace(/\\(.)/g, "$1"));
  }
  return keys;
}

function loadJson(file: string): Record<string, string> {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function sorted(obj: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of Object.keys(obj).sort()) out[key] = obj[key];
  return out;
}

function main() {
  const foundByDomain: Record<Domain, Set<string>> = {
    default: new Set(),
    errors: new Set(),
    email: new Set(),
    pdf: new Set(),
  };

  for (const file of walk(SRC_DIR)) {
    const source = readFileSync(file, "utf8");
    if (!/\bt\(/.test(source)) continue;
    const domain = detectDomain(source);
    for (const key of extractKeys(source)) {
      foundByDomain[domain].add(key);
    }
  }

  let addedCount = 0;
  const missing: string[] = [];

  for (const domain of DOMAINS) {
    const daFile = path.join(LOCALES_DIR, "da", `${domain}.json`);
    const enFile = path.join(LOCALES_DIR, "en", `${domain}.json`);
    const da = loadJson(daFile);
    const en = loadJson(enFile);

    let domainAdded = 0;
    for (const key of foundByDomain[domain]) {
      if (!(key in da)) {
        da[key] = key;
        domainAdded++;
      }
      if (!(key in en)) {
        missing.push(`[${domain}] ${key}`);
      }
    }

    if (domainAdded > 0) {
      writeFileSync(daFile, JSON.stringify(sorted(da), null, 2) + "\n");
      addedCount += domainAdded;
    }
  }

  if (addedCount > 0) {
    console.log(`Added ${addedCount} new key(s) to src/i18n/locales/da/*.json.`);
  } else {
    console.log("No new keys found — da/*.json is already up to date.");
  }

  if (missing.length > 0) {
    console.log(`\n${missing.length} key(s) missing an English translation:`);
    for (const line of missing) console.log(`  ${line}`);
    process.exitCode = 1;
  } else {
    console.log("All keys have an English translation.");
  }
}

main();
