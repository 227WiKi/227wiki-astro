export function getMemberThemeStyle(themeColor?: string): string | undefined {
  if (!themeColor) return undefined;

  return [
    `--member-accent: ${themeColor}`,
    "--member-frame-bg: color-mix(in oklab, var(--member-accent) 4%, var(--card))",
    "--member-header-bg: color-mix(in oklab, var(--member-accent) 8%, var(--card))",
    "--member-frame-border: color-mix(in oklab, var(--member-accent) 35%, var(--border))",
    "--member-inner-border: color-mix(in oklab, var(--member-accent) 20%, var(--border))",
    "--member-chronology-node: color-mix(in oklab, var(--member-accent) 35%, var(--foreground))",
  ].join(";");
}
