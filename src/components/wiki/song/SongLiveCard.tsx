// One LiveEvent within a year. Every card has the same fixed structure (title
// reserved at two lines, one date row, one venue row) so cards align in height.
// Single-Show cards render static; multi-Show cards hydrate for the "+N 场" menu.
// Follows docs/ui-rules.md; listed in RULED_FILES in tests/ui-rules.test.mjs.
import { CalendarDays, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import { Menu, MenuLinkItem, MenuPopup, MenuTrigger } from "@/components/ui/menu";
import type { SongLiveAppearance, SongLiveEventGroup } from "@/lib/songs";
import { cn } from "@/lib/utils";

const monthDay = (date: string) => date.slice(5).replace("-", ".");
const iconClass = "size-4 shrink-0 text-muted-foreground";

function ShowText({ show, venue }: { show: SongLiveAppearance; venue: boolean }) {
  return <>
    <time dateTime={show.date} className="shrink-0 text-foreground tabular-nums">{monthDay(show.date)}</time>
    {show.showLabel && <span className="min-w-0 truncate">{show.showLabel}</span>}
    {show.occurrences > 1 && <span className="shrink-0">{show.occurrences} 次</span>}
    {venue && <span className="sr-only">{show.venue}</span>}
  </>;
}

function MoreShows({ shows, title, venue }: { shows: SongLiveAppearance[]; title: string; venue: boolean }) {
  return <Menu
    modal={false}
    // A hover-opened menu would otherwise close on a "patient" click (>500ms after
    // opening), so a click looks like it does nothing. Clicking the trigger only opens;
    // Escape, an outside press or moving away still close it.
    onOpenChange={(open, details) => {
      if (!open && details.reason === "trigger-press") details.cancel();
    }}
  >
    <MenuTrigger
      openOnHover
      delay={80}
      closeDelay={160}
      className={cn(buttonVariants({ variant: "secondary", size: "xs" }), "ms-auto shrink-0 font-normal tabular-nums")}
    >
      +{shows.length} 场<span className="sr-only">，{title} 的其余公演</span>
    </MenuTrigger>
    <MenuPopup align="end" className="max-w-[calc(100vw-2rem)]">
      {shows.map((show) => <MenuLinkItem key={show.showId} href={show.href} className="items-start text-muted-foreground">
        <time dateTime={show.date} className="shrink-0 text-foreground tabular-nums">{monthDay(show.date)}</time>
        {(show.showLabel || venue || show.occurrences > 1) && <span className="flex min-w-0 flex-col">
          {show.showLabel && <span>{show.showLabel}</span>}
          {venue && <span>{show.venue}</span>}
          {show.occurrences > 1 && <span>{show.occurrences} 次</span>}
        </span>}
      </MenuLinkItem>)}
    </MenuPopup>
  </Menu>;
}

export function SongLiveCard({ live }: { live: SongLiveEventGroup }) {
  const [first, ...rest] = live.appearances;
  const perShowVenue = live.venues.length > 1;
  const venueText = perShowVenue ? `${live.venues.length} 个会场` : live.venues[0];
  return <Card className="h-full w-full min-w-0 rounded-xl before:rounded-[calc(var(--radius-xl)-1px)]">
    <CardPanel className="flex flex-col gap-2 p-3">
      {/* A single-Show title is the deep link; a multi-Show title opens the Live page. */}
      <a
        href={live.href}
        {...(rest.length === 0 ? { "data-live-show-link": "" } : {})}
        lang="ja"
        title={live.liveTitle}
        className="live-card-title line-clamp-2 font-medium leading-snug"
      >{live.liveTitle}</a>
      <p className="live-card-dates flex min-w-0 items-center gap-2 text-muted-foreground text-sm">
        <CalendarDays aria-hidden="true" className={iconClass} />
        {rest.length === 0
          ? <span className="flex min-w-0 items-center gap-2"><ShowText show={first} venue={false} /></span>
          : <a href={first.href} data-live-show-link="" title={perShowVenue ? first.venue : undefined} className="live-card-date flex min-w-0 items-center gap-2">
              <ShowText show={first} venue={perShowVenue} />
            </a>}
        {rest.length > 0 && <MoreShows shows={rest} title={live.liveTitle} venue={perShowVenue} />}
      </p>
      <p className="flex min-w-0 items-center gap-2 text-muted-foreground text-sm">
        <MapPin aria-hidden="true" className={iconClass} />
        <span className="truncate" title={venueText}>{venueText}</span>
      </p>
    </CardPanel>
  </Card>;
}
