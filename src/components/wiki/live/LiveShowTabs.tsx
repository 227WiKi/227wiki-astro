import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";
import { showDisplayLabels, type ShowView } from "@/lib/live-detail";
import { LiveSetlist } from "./LiveSetlist";

export function LiveShowTabs({ shows }: { shows: ShowView[] }) {
  const labels = showDisplayLabels(shows);
  return <Tabs defaultValue={shows[0].id}>
    <div className="mb-4 overflow-x-auto overflow-y-hidden border-b">
      <TabsList variant="underline" size="sm" aria-label="公演场次">
        {shows.map((show, index) => <TabsTab key={show.id} value={show.id}>{labels[index]}</TabsTab>)}
      </TabsList>
    </div>
    {shows.map((show) => <TabsPanel key={show.id} value={show.id} className="live-show-panel">
      <LiveSetlist show={show} />
    </TabsPanel>)}
  </Tabs>;
}
