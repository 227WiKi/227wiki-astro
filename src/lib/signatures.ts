/**
 * Member signature SVG loader.
 * Loads raw SVG content for member signatures at build time via Vite's import.meta.glob.
 */
const signatureModules = import.meta.glob<string>(
  "/src/assets/members/*.svg",
  { query: "?raw", import: "default", eager: true },
);

export function getMemberSignatureSvg(signatureFileName?: string): string | undefined {
  if (!signatureFileName) return undefined;
  const key = `/src/assets/members/${signatureFileName}`;
  return signatureModules[key];
}
