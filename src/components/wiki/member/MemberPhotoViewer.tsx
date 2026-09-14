import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import { Zoom } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";

interface MemberPhoto {
  id: string;
  label: string;
  url: string;
}

interface MemberPhotoViewerProps {
  name: string;
  photos: MemberPhoto[];
}

export function MemberPhotoViewer({ name, photos }: MemberPhotoViewerProps) {
  const [selectedId, setSelectedId] = useState(photos[0]?.id ?? "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsScrollerRef = useRef<HTMLDivElement>(null);
  const selectedIndex = Math.max(
    0,
    photos.findIndex(({ id }) => id === selectedId),
  );
  const selected = photos[selectedIndex];

  const updateScrollControls = useCallback(() => {
    const scroller = tabsScrollerRef.current;
    if (!scroller) return;

    const tolerance = 2;
    setCanScrollLeft(scroller.scrollLeft > tolerance);
    setCanScrollRight(
      scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - tolerance,
    );
  }, []);

  useEffect(() => {
    const scroller = tabsScrollerRef.current;
    if (!scroller) return;

    updateScrollControls();
    scroller.addEventListener("scroll", updateScrollControls, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollControls);
    resizeObserver.observe(scroller);
    const tabsList = scroller.firstElementChild;
    if (tabsList) resizeObserver.observe(tabsList);

    return () => {
      scroller.removeEventListener("scroll", updateScrollControls);
      resizeObserver.disconnect();
    };
  }, [photos.length, updateScrollControls]);

  useEffect(() => {
    const activeTab =
      tabsScrollerRef.current?.querySelector<HTMLElement>("[data-active]");

    activeTab?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [selectedId]);

  const scrollTabs = (direction: -1 | 1) => {
    const scroller = tabsScrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      left: direction * scroller.clientWidth * 0.7,
    });
  };

  if (!selected) return null;

  const imageAlt = `${name} ${selected.label} 公式照`;
  const slides = photos.map((photo) => ({
    alt: `${name} ${photo.label} 公式照`,
    src: photo.url,
  }));

  const photoTrigger = (
    <button
      aria-label={`放大查看 ${imageAlt}`}
      className="group relative block h-auto w-full overflow-hidden rounded-lg border border-border/60 bg-transparent p-0 text-start outline-none transition-[border-color,opacity] duration-150 hover:border-foreground/30 hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
      onClick={() => setLightboxOpen(true)}
      type="button"
    >
      <img
        alt={imageAlt}
        className="block h-auto w-full rounded-lg object-contain transition-opacity duration-150 motion-reduce:transition-none"
        decoding="async"
        height="960"
        src={selected.url}
        width="640"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2 bottom-2 grid size-8 place-items-center rounded-lg bg-black/45 text-white opacity-80 shadow-sm backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100 motion-reduce:transition-none"
      >
        <ZoomIn className="size-4" />
      </span>
    </button>
  );

  return (
    <div className="flex min-w-0 flex-col gap-3">
      {photos.length > 1 ? (
        <Tabs
          className="min-w-0 gap-3"
          onValueChange={setSelectedId}
          value={selected.id}
        >
          <div className="relative min-w-0 border-b border-border">
            {canScrollLeft && (
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-20 flex w-10 items-center justify-start"
                style={{
                  background:
                    "linear-gradient(to right, var(--card) 45%, transparent)",
                }}
              >
                <Button
                  aria-label="向左浏览公式照版本"
                  className="pointer-events-auto size-8 rounded-none border-transparent bg-transparent text-muted-foreground shadow-none before:shadow-none hover:bg-transparent hover:text-foreground data-pressed:bg-transparent sm:size-8"
                  onClick={() => scrollTabs(-1)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <ChevronLeft aria-hidden="true" className="size-4.5" />
                </Button>
              </div>
            )}
            <div
              className="min-w-0 overflow-x-auto overflow-y-hidden scroll-px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              ref={tabsScrollerRef}
            >
              <TabsList
                aria-label="公式照版本"
                className="min-w-max flex-nowrap px-2"
                size="sm"
                variant="underline"
              >
                {photos.map((photo) => (
                  <TabsTab
                    className="rounded-none bg-transparent data-active:font-semibold"
                    key={photo.id}
                    style={{ backgroundColor: "transparent" }}
                    value={photo.id}
                  >
                    {photo.label}
                  </TabsTab>
                ))}
              </TabsList>
            </div>
            {canScrollRight && (
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-20 flex w-10 items-center justify-end"
                style={{
                  background:
                    "linear-gradient(to left, var(--card) 45%, transparent)",
                }}
              >
                <Button
                  aria-label="向右浏览公式照版本"
                  className="pointer-events-auto size-8 rounded-none border-transparent bg-transparent text-muted-foreground shadow-none before:shadow-none hover:bg-transparent hover:text-foreground data-pressed:bg-transparent sm:size-8"
                  onClick={() => scrollTabs(1)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <ChevronRight aria-hidden="true" className="size-4.5" />
                </Button>
              </div>
            )}
          </div>
          <TabsPanel className="min-w-0" value={selected.id}>
            {photoTrigger}
          </TabsPanel>
        </Tabs>
      ) : (
        photoTrigger
      )}

      <Lightbox
        close={() => setLightboxOpen(false)}
        index={selectedIndex}
        labels={{
          Close: "关闭",
          Next: "下一张",
          Previous: "上一张",
          "Zoom in": "放大",
          "Zoom out": "缩小",
        }}
        on={{
          view: ({ index }) => {
            const viewedPhoto = photos[index];
            if (viewedPhoto) setSelectedId(viewedPhoto.id);
          },
        }}
        open={lightboxOpen}
        plugins={[Zoom]}
        render={
          photos.length === 1
            ? { buttonNext: () => null, buttonPrev: () => null }
            : undefined
        }
        slides={slides}
      />
    </div>
  );
}
