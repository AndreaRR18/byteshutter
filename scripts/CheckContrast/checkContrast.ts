/* Verifies WCAG contrast for the colour tokens in css/tokens.css.
 * Run with: npm run check:contrast
 * The dark theme is the :root block; the light theme is [data-theme="light"]
 * and is merged over the dark one.
 */
import * as fs from "fs";
import * as path from "path";

type Tokens = Record<string, string>;

interface Pair {
  fg: string;
  bg: string;
  min: number;
  label: string;
}

const css = fs.readFileSync(path.join(process.cwd(), "css", "tokens.css"), "utf8");

function readBlock(selector: string): Tokens {
  const start = css.indexOf(selector + " {");
  if (start === -1) {
    throw new Error("Block not found in css/tokens.css: " + selector);
  }
  const end = css.indexOf("}", start);
  const tokens: Tokens = {};
  for (const match of css.slice(start, end).matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}

function channel(value: number): number {
  const s = value / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort(function (x, y) { return y - x; });
  return (hi + 0.05) / (lo + 0.05);
}

const PAIRS: Pair[] = [
  { fg: "--text-primary", bg: "--bg-primary", min: 4.5, label: "body text on page" },
  { fg: "--text-primary", bg: "--bg-secondary", min: 4.5, label: "body text on surface" },
  { fg: "--text-secondary", bg: "--bg-primary", min: 4.5, label: "secondary text on page" },
  { fg: "--text-secondary", bg: "--bg-secondary", min: 4.5, label: "secondary text on surface" },
  { fg: "--text-muted", bg: "--bg-primary", min: 4.5, label: "muted text on page" },
  { fg: "--text-muted", bg: "--bg-secondary", min: 4.5, label: "muted text on surface" },
  { fg: "--accent", bg: "--bg-primary", min: 4.5, label: "accent text on page" },
  { fg: "--accent", bg: "--bg-secondary", min: 4.5, label: "accent text on surface" },
  { fg: "--accent-contrast", bg: "--accent", min: 4.5, label: "text on accent fill" },
  { fg: "--border-strong", bg: "--bg-primary", min: 3, label: "UI boundary on page" }
];

const dark = readBlock(":root");
const themes: Record<string, Tokens> = {
  dark: dark,
  light: Object.assign({}, dark, readBlock('[data-theme="light"]'))
};

let failures = 0;
for (const name of Object.keys(themes)) {
  console.log("\n" + name.toUpperCase());
  for (const pair of PAIRS) {
    const fg = themes[name][pair.fg];
    const bg = themes[name][pair.bg];
    if (!fg || !bg) {
      throw new Error("Missing token for " + pair.label + " in " + name + " theme");
    }
    const value = ratio(fg, bg);
    const ok = value >= pair.min;
    if (!ok) failures += 1;
    console.log(
      (ok ? "  ok   " : "  FAIL ") + value.toFixed(2).padStart(5) + ":1 (min " + pair.min + ")  " + pair.label
    );
  }
}

if (failures > 0) {
  console.error("\n" + failures + " contrast check(s) failed");
  process.exit(1);
}
console.log("\nAll contrast checks passed");
