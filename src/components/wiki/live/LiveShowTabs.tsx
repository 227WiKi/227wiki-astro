import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";
import { showAnchorId, showDisplayLabels, showIdFromHash, type ShowView } from "@/lib/live-detail";
import { LiveSetlist } from "./LiveSetlist";

export function LiveShowTabs({ shows }: { shows: ShowView[] }) {
  const labels = showDisplayLabels(shows);
  // First render matches the server HTML; the hash is applied after hydration.
  const [value, setValue] = useState(shows[0].id);

  useEffect(() => {
    const showIds = shows.map(({ id }) => id);
    // Fires on direct links, refreshes, and back/forward between hash entries.
    const sync = () => {
      const target = showIdFromHash(window.location.hash, showIds);
      if (target) setValue(target);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [shows]);

  function handleValueChange(next: string) {
    setValue(next);
    // Keep an existing Show deep link truthful without adding history entries or scrolling.
    if (showIdFromHash(window.location.hash, shows.map(({ id }) => id))) {
      window.history.replaceState(window.history.state, "", `#${showAnchorId(next)}`);
    }
  }

  return <Tabs value={value} onValueChange={(next) => handleValueChange(String(next))}>
    <div className="mb-4 overflow-x-auto overflow-y-hidden border-b">
      <TabsList variant="underline" size="sm" aria-label="公演场次">
        {/* The Tab carries the anchor; Base UI points the panel's aria-labelledby at this ID. */}
        {shows.map((show, index) => <TabsTab key={show.id} id={showAnchorId(show.id)} value={show.id}>{labels[index]}</TabsTab>)}
      </TabsList>
    </div>
    {shows.map((show) => <TabsPanel key={show.id} value={show.id} className="live-show-panel">
      <LiveSetlist show={show} />
    </TabsPanel>)}
  </Tabs>;
}
