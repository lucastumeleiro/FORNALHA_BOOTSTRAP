// Verificador determinístico de DS-01 e DS-02 (skill design-system).
// Varre src/**/*.{ts,tsx,css}; src/index.css é a folha de tokens e src/components/ui/ é do CLI.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

const ignoredFiles = [/^src\/index\.css$/, /^src\/components\/ui\//];
// Uma âncora como "#cafe" em texto ou dado não é cor.
const hexIgnoredFiles = [/^src\/content\//, /^src\/data\//];

const rules = [
  {
    id: "DS-01",
    hex: true,
    pattern: /(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/,
  },
  { id: "DS-01", pattern: /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/ },
  {
    id: "DS-02",
    pattern:
      /\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|decoration|divide|shadow|accent|caret|placeholder)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/,
  },
  { id: "DS-02", pattern: /\b(?:bg|text|border|ring|fill|stroke)-(?:black|white)\b/ },
  { id: "DS-02", pattern: /-\[(?:#|rgb|hsl|oklch|color:)/ },
];

const files = readdirSync(join(root, "src"), { recursive: true })
  .map((entry) => `src/${String(entry).replaceAll("\\", "/")}`)
  .filter((file) => /\.(?:ts|tsx|css)$/.test(file))
  .filter((file) => !ignoredFiles.some((re) => re.test(file)))
  .sort();

const violations = [];

for (const file of files) {
  const skipHex = hexIgnoredFiles.some((re) => re.test(file));
  const lines = readFileSync(join(root, file), "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const rule of rules) {
      if (rule.hex && skipHex) continue;
      const match = line.match(rule.pattern);
      if (match) violations.push(`${file}:${index + 1} — ${rule.id} — ${match[0]}`);
    }
  });
}

for (const violation of violations) console.log(violation);
console.log(`check:cores: ${violations.length} violações`);
process.exit(violations.length > 0 ? 1 : 0);
