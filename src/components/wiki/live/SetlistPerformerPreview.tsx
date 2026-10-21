import { Popover } from "@base-ui/react/popover";
import { UsersRound } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PerformerView } from "@/lib/live-detail";

export function SetlistPerformerPreview({ performers, title }: { performers: PerformerView[]; title: string }) {
  const [open, setOpen] = useState(false);
  const triggerId = useId();
  const dismissed = useRef(false);
  if (!performers.length) return null;
  return (
    <Popover.Root triggerId={triggerId} open={open} onOpenChange={(next) => { if (!next) dismissed.current = true; setOpen(next); }}>
      <Popover.Trigger id={triggerId} openOnHover delay={200} closeDelay={200}
        onFocus={(event) => { if (!dismissed.current && event.target.matches(":focus-visible")) setOpen(true); }}
        onBlur={() => { dismissed.current = false; }}
        render={<Button variant="ghost" size="icon-sm" className="text-muted-foreground" />}
        aria-label={`${title} 的演唱者`}>
        <UsersRound aria-hidden="true" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="end" sideOffset={6} collisionPadding={12} className="z-50 max-w-[calc(100vw-1.5rem)]">
          <Popover.Popup className="w-60 max-w-full rounded-lg border bg-popover p-4 text-sm text-popover-foreground shadow-lg/5 outline-none">
            <Popover.Title className="mb-3 font-medium">演唱者</Popover.Title>
            <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto">
              {performers.map((person, index) => <li key={index} className="[overflow-wrap:anywhere]">
                {person.href ? <a href={person.href} className="text-(--wiki-brand) underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring">{person.name}</a> : person.name}
              </li>)}
            </ul>
            <Popover.Close render={<Button variant="ghost" size="xs" className="mt-3" />}>关闭</Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
