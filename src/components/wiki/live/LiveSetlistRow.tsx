import type { SetlistEntryView } from "@/lib/live-detail";
import { SetlistPerformerPreview } from "./SetlistPerformerPreview";
import { TableCell, TableRow } from "@/components/ui/table";

export function LiveSetlistRow({ entry, hasPerformers }: { entry: SetlistEntryView; hasPerformers: boolean }) {
  const columns = hasPerformers ? 3 : 2;
  if (entry.type === "section") return <TableRow>
    <TableCell colSpan={columns} className="py-3 font-semibold text-muted-foreground">{entry.label}</TableCell>
  </TableRow>;
  if (entry.type === "note") return <TableRow>
    <TableCell colSpan={columns} className="text-muted-foreground">{entry.text}</TableCell>
  </TableRow>;
  return <TableRow>
    <TableCell className="text-right text-xs text-muted-foreground tabular-nums">{entry.number}</TableCell>
    <TableCell className="[overflow-wrap:anywhere]">
      {entry.href ? <a href={entry.href} className="text-(--wiki-brand) underline-offset-4 hover:underline">{entry.titleJa}</a> : entry.titleJa}
    </TableCell>
    {hasPerformers && <TableCell className="text-right">
      {entry.performers?.length ? <SetlistPerformerPreview performers={entry.performers} title={entry.titleJa} /> : null}
    </TableCell>}
  </TableRow>;
}
