// Fails CI when translations drift:
//  1. every namespace must have the same key tree (and array lengths) in every language
//  2. every literal t("…") key used by the official site must exist
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const LOCALES = "src/locales";
const LANGS = ["my", "en"];
const problems = [];

const load = (lang, ns) => JSON.parse(readFileSync(join(LOCALES, lang, `${ns}.json`), "utf8"));

function shape(value, prefix = "", out = new Map()) {
  if (Array.isArray(value)) {
    out.set(prefix, `array(${value.length})`);
    value.forEach((item, i) => shape(item, `${prefix}[${i}]`, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) shape(v, prefix ? `${prefix}.${k}` : k, out);
  } else {
    out.set(prefix, typeof value);
  }
  return out;
}

const namespaces = readdirSync(join(LOCALES, LANGS[0])).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5));
for (const ns of namespaces) {
  const [base, ...others] = LANGS.map((lang) => ({ lang, keys: shape(load(lang, ns)) }));
  for (const other of others) {
    for (const [key, type] of base.keys) {
      if (!other.keys.has(key)) problems.push(`${ns}: "${key}" missing in ${other.lang}`);
      else if (other.keys.get(key) !== type) problems.push(`${ns}: "${key}" is ${type} in ${base.lang} but ${other.keys.get(key)} in ${other.lang}`);
    }
    for (const key of other.keys.keys()) if (!base.keys.has(key)) problems.push(`${ns}: "${key}" only in ${other.lang}`);
  }
}

// Literal keys used in the official site's source.
function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(tsx?|jsx?)$/.test(name) && !/\.test\./.test(name)) yield p;
  }
}
const official = LANGS.map((lang) => shape(load(lang, "official")));
const hasKey = (keys, k) => keys.has(k) || [...keys.keys()].some((x) => x.startsWith(`${k}.`) || x.startsWith(`${k}[`));
for (const file of walk("src/features/official")) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/\bt\(\s*["']([\w.]+)["']/g)) {
    const key = m[1];
    official.forEach((keys, i) => {
      if (!hasKey(keys, key)) problems.push(`${file}: t("${key}") has no "${LANGS[i]}" translation`);
    });
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} locale problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`✓ locales consistent: ${namespaces.length} namespaces × ${LANGS.length} languages; all literal keys resolve`);
