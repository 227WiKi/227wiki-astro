import type { CollectionEntry } from "astro:content";

export type ReleaseData = CollectionEntry<"releases">["data"];
export type ReleaseEdition = ReleaseData["editions"][number];
export type AudioDisc = ReleaseEdition["audioDiscs"][number];

export function releaseLabel(data: Pick<ReleaseData, "releaseNumber" | "releaseType">): string {
  const number = data.releaseNumber;
  const suffix = number % 100 >= 11 && number % 100 <= 13
    ? "th"
    : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[number % 10] ?? "th";
  return `${number}${suffix} ${data.releaseType === "single" ? "Single" : "Album"}`;
}

export const editionAnchor = (id: string): string => `edition-${id}`;
