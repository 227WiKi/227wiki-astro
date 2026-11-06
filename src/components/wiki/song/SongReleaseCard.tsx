// One Release per card, with two title lines and fixed metadata rows.
// Covers use equal outer insets and concentric corners.
// Follows docs/ui-rules.md; listed in RULED_FILES in tests/ui-rules.test.mjs.
import type { CollectionEntry } from "astro:content";
import { CalendarDays, Disc3 } from "lucide-react";
import { Card, CardPanel } from "@/components/ui/card";
import { resourceUrl } from "@/lib/assets";
import { formatReleaseDate, releaseCoverPath, releaseHref, releaseLabel } from "@/lib/releases";
import { cn } from "@/lib/utils";

const iconClass = "size-4 shrink-0 text-muted-foreground";

export function SongReleaseCard({ release }: { release: Pick<CollectionEntry<"releases">, "id" | "data"> }) {
  const { data } = release;
  const cover = releaseCoverPath(data);
  const label = releaseLabel(data);
  return <Card
    render={<a href={releaseHref(release.id)} data-song-release-link="" />}
    className="song-release-card group h-full w-full min-w-0 rounded-xl before:rounded-[calc(var(--radius-xl)-1px)] transition-[border-color] motion-reduce:transition-none hover:border-foreground/20"
  >
    <CardPanel className={cn("flex items-center gap-3 p-2 pe-4", !cover && "ps-4")}>
      {cover && <img
        src={resourceUrl(cover)}
        alt=""
        width={88}
        height={88}
        loading="lazy"
        decoding="async"
        className="size-22 shrink-0 rounded-[max(0px,calc(var(--radius-xl)-var(--spacing)*2-1px))] border bg-muted object-cover"
      />}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          lang="ja"
          title={data.titleJa}
          className="song-release-title line-clamp-2 font-medium text-(--wiki-brand) text-base leading-5 underline-offset-[0.2em] group-hover:underline"
        >{data.titleJa}</span>
        <span className="flex min-w-0 items-center gap-2 text-muted-foreground text-sm leading-5">
          <Disc3 aria-hidden="true" className={iconClass} />
          <span className="truncate" title={label}>{label}</span>
        </span>
        <span className="flex min-w-0 items-center gap-2 text-muted-foreground text-sm leading-5">
          <CalendarDays aria-hidden="true" className={iconClass} />
          <time dateTime={data.releaseDate} className="truncate tabular-nums">{formatReleaseDate(data.releaseDate)}</time>
        </span>
      </div>
    </CardPanel>
  </Card>;
}
