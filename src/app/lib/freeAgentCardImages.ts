type ImageModule = { default: string };

type GlobResult = Record<string, ImageModule>;

export const normalizeNameKey = (name: string) =>
  name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const imageModules = import.meta.glob("../../../Free Agent Cards/*.png", {
  eager: true,
}) as GlobResult;

const imageByKey = new Map<string, string>();
for (const [modulePath, mod] of Object.entries(imageModules)) {
  const fileName = modulePath.split("/").pop() ?? modulePath;
  const baseName = fileName.replace(/\.[^.]+$/, "");
  imageByKey.set(normalizeNameKey(baseName), mod.default);
}

const nameAliases: Record<string, string> = {
  // A few files are not "surname-only" and need explicit mapping
  [normalizeNameKey("Rafa Silva")]: normalizeNameKey("Rafa"),
};

export function getFreeAgentCardImage(playerName: string): string | undefined {
  const key = normalizeNameKey(playerName);
  const aliased = nameAliases[key] ?? key;

  // 1) Exact (or aliased) match
  const exact = imageByKey.get(aliased);
  if (exact) return exact;

  // 2) Suffix matches: progressively drop leading tokens.
  //    This maps names like "Virgil van Dijk" -> "van dijk".
  const parts = aliased.split(" ").filter(Boolean);
  for (let i = 1; i < parts.length; i += 1) {
    const suffix = parts.slice(i).join(" ");
    const hit = imageByKey.get(suffix);
    if (hit) return hit;
  }

  // 3) Prefix matches: progressively drop trailing tokens.
  //    This maps names like "Alisson Becker" -> "alisson".
  for (let i = parts.length - 1; i >= 1; i -= 1) {
    const prefix = parts.slice(0, i).join(" ");
    const hit = imageByKey.get(prefix);
    if (hit) return hit;
  }

  return undefined;
}

export function warnOnMissingFreeAgentCardImages(playerNames: string[]): void {
  if (!import.meta.env.DEV) return;

  const missing: string[] = [];
  for (const name of playerNames) {
    if (!getFreeAgentCardImage(name)) missing.push(name);
  }

  if (missing.length > 0) {
    console.warn(
      `[free-agent-cards] Missing images for ${missing.length} player(s). ` +
        `Either add PNGs to "Free Agent Cards/" or add an alias in freeAgentCardImages.ts.`,
      missing,
    );
  }
}
