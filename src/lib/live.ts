import type { CollectionEntry } from "astro:content";

export type LiveEventData = CollectionEntry<"liveEvents">["data"];
export type LiveShow = LiveEventData["shows"][number];

export interface LiveEventSummary {
  startDate: string;
  endDate: string;
  venues: string[];
  venueCount: number;
  showCount: number;
}

export function sortShows(shows: readonly LiveShow[]): LiveShow[] {
  return [...shows].sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
}

export function deriveLiveEvent(shows: readonly LiveShow[]): LiveEventSummary {
  const sortedShows = sortShows(shows);
  if (sortedShows.length === 0) throw new Error("A LiveEvent must contain at least one show");
  const venues = [...new Set(sortedShows.map(({ venue }) => venue))];

  return {
    startDate: sortedShows[0].date,
    endDate: sortedShows[sortedShows.length - 1].date,
    venues,
    venueCount: venues.length,
    showCount: sortedShows.length,
  };
}

export function liveKindLabel(kind: LiveEventData["kind"]): string {
  return {
    live: "Live",
    event: "Event",
  }[kind];
}

const dateOnlyUTC = (date: string): Date => new Date(`${date}T00:00:00Z`);
const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  timeZone: "UTC",
});
const monthDay = (date: string): string => date.slice(5).replace("-", ".");

export function formatLiveDateRange(startDate: string, endDate: string): string {
  const start = startDate.replaceAll("-", ".");
  if (startDate === endDate) return start;
  const end = startDate.slice(0, 4) === endDate.slice(0, 4)
    ? monthDay(endDate)
    : endDate.replaceAll("-", ".");
  return `${start} – ${end}`;
}

export function formatTicketDate(
  { startDate, endDate }: Pick<LiveEventSummary, "startDate" | "endDate">,
) {
  const startYear = startDate.slice(0, 4);
  const endYear = endDate.slice(0, 4);
  const isSingleDay = startDate === endDate;
  const spanDays = (dateOnlyUTC(endDate).getTime() - dateOnlyUTC(startDate).getTime()) / 86_400_000;
  return {
    year: startYear === endYear ? startYear : `${startYear}–${endYear.slice(2)}`,
    primary: monthDay(startDate),
    secondary: !isSingleDay ? `–${monthDay(endDate)}` : undefined,
    weekday: isSingleDay ? weekdayFormatter.format(dateOnlyUTC(startDate)).toUpperCase() : undefined,
    rangeLabel: formatLiveDateRange(startDate, endDate),
    showRangeInBody: spanDays >= 28 || startYear !== endYear,
  };
}

export function liveVenueMetadata({ venues, venueCount }: LiveEventSummary): string {
  return venueCount === 1 ? venues[0] : `${venueCount}会場`;
}

function sortLiveEventsByDate(events: readonly CollectionEntry<"liveEvents">[]) {
  return events.map((event) => ({
    event,
    startDate: deriveLiveEvent(event.data.shows).startDate,
  })).sort((a, b) => a.startDate > b.startDate ? -1 : a.startDate < b.startDate ? 1 : 0);
}

export function groupLiveEventsByYear(events: readonly CollectionEntry<"liveEvents">[]) {
  const sortedEvents = sortLiveEventsByDate(events);
  const groups = new Map<string, CollectionEntry<"liveEvents">[]>();

  for (const { event, startDate } of sortedEvents) {
    const year = startDate.slice(0, 4);
    const group = groups.get(year) ?? [];
    group.push(event);
    groups.set(year, group);
  }

  return [...groups].map(([year, events]) => ({ year, events }));
}

export function groupLiveEventsByKind(events: readonly CollectionEntry<"liveEvents">[]) {
  const groups = new Map<LiveEventData["kind"], CollectionEntry<"liveEvents">[]>();

  for (const { event } of sortLiveEventsByDate(events)) {
    const kind = event.data.kind;
    const group = groups.get(kind) ?? [];
    group.push(event);
    groups.set(kind, group);
  }

  // Stable taxonomy order; the newest event should not reorder the headings.
  return (["live", "event"] as const)
    .filter((kind) => groups.has(kind))
    .map((kind) => ({ kind, title: liveKindLabel(kind), events: groups.get(kind)! }));
}
