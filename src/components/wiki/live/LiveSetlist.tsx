import type { ShowView } from "@/lib/live-detail";
import { LiveSetlistRow } from "./LiveSetlistRow";
import { LiveCastList } from "./LiveCastList";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Card, CardPanel, CardFrame, CardFrameAction, CardFrameDescription,
  CardFrameFooter, CardFrameHeader, CardFrameTitle,
} from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import "./LiveSetlist.css";

export function LiveSetlist({ show, collapsible = false }: { show: ShowView; collapsible?: boolean }) {
  const hasPerformers = show.setlist?.some((entry) => entry.type === "song" && entry.performers?.length) ?? false;
  const date = <time dateTime={show.date}>{show.date.replaceAll("-", ".")}</time>;
  return <CardFrame
    className="live-show-frame live-show-content min-w-0 border-0 bg-muted/72 p-1 shadow-none before:hidden *:data-[slot=card]:m-0 *:data-[slot=card]:rounded-xl *:data-[slot=table-container]:m-0 *:data-[slot=table-container]:w-full"
    render={collapsible ? <details id={`show-${show.id}`} className="live-show group" /> : undefined}
  >
    <CardFrameHeader
      className={cn("relative min-w-0 content-start items-start px-4 pt-0", collapsible && "cursor-pointer list-none py-2 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden")}
      render={collapsible ? <summary /> : undefined}
    >
      <CardFrameTitle render={<h3 />} className="col-start-1 row-start-1 min-w-0 self-start">
        {collapsible ? <span className="flex flex-wrap gap-x-3 gap-y-1"><span className="tabular-nums">{date}</span>{show.label && <span>{show.label}</span>}</span> : "Setlist"}
      </CardFrameTitle>
      <CardFrameDescription className="col-start-1 row-start-2 flex min-w-0 flex-wrap gap-x-3 gap-y-1 self-start">
        {!collapsible && <span className="tabular-nums">{date}</span>}
        <span>{show.venue}</span>
      </CardFrameDescription>
      {collapsible && <CardFrameAction><ChevronDown aria-hidden="true" className="size-4 text-muted-foreground group-open:rotate-180" /></CardFrameAction>}
    </CardFrameHeader>
    {show.setlist?.length ? <Table variant="card" className="live-setlist table-fixed">
      <caption className="sr-only">{show.date} {show.label ?? show.venue} Setlist</caption>
      <colgroup>
        <col className="w-12" />
        <col />
        {hasPerformers && <col className="w-16" />}
      </colgroup>
      <TableHeader>
        <TableRow>
          <TableHead scope="col" className="text-right">No.</TableHead>
          <TableHead scope="col">曲目</TableHead>
          {hasPerformers && <TableHead scope="col" className="text-right">演唱者</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {show.setlist.map((entry, index) => <LiveSetlistRow key={index} entry={entry} hasPerformers={hasPerformers} />)}
      </TableBody>
    </Table> : <Card><CardPanel className="p-4 text-sm text-muted-foreground">Setlist 尚未整理</CardPanel></Card>}
    {show.cast?.length ? <CardFrameFooter className="relative p-4">
      <section aria-label="本场出演成员">
        <h4 className="mb-3 text-sm font-medium">本场出演成员</h4>
        <LiveCastList cast={show.cast} />
      </section>
    </CardFrameFooter> : null}
  </CardFrame>;
}
