"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MemberChronologyScrollerProps {
  title?: string;
  children: ReactNode;
}

export function MemberChronologyScroller({
  title = "时间线",
  children,
}: MemberChronologyScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const getViewport = useCallback(() => {
    return containerRef.current?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );
  }, []);

  const updateScrollControls = useCallback(() => {
    const scroller = getViewport();
    if (!scroller) return;

    const tolerance = 3;
    const overflow = scroller.scrollWidth - scroller.clientWidth > tolerance;
    setHasOverflow(overflow);
    setCanScrollLeft(scroller.scrollLeft > tolerance);
    setCanScrollRight(
      scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - tolerance,
    );
  }, [getViewport]);

  useEffect(() => {
    const scroller = getViewport();
    if (!scroller) return;

    updateScrollControls();
    scroller.addEventListener("scroll", updateScrollControls, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollControls);
    resizeObserver.observe(scroller);
    const content = scroller.firstElementChild;
    if (content) {
      resizeObserver.observe(content);
    }

    return () => {
      scroller.removeEventListener("scroll", updateScrollControls);
      resizeObserver.disconnect();
    };
  }, [getViewport, updateScrollControls]);

  const handleScroll = (direction: -1 | 1) => {
    const scroller = getViewport();
    if (!scroller) return;

    scroller.scrollBy({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      left: direction * scroller.clientWidth * 0.75,
    });
  };

  return (
    <div ref={containerRef} className="flex min-w-0 max-w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2
          id="timeline"
          className="font-heading text-xl font-semibold tracking-tight !my-0 text-foreground sm:text-2xl"
        >
          {title}
        </h2>
        {hasOverflow && (
          <div className="flex items-center gap-0.5" aria-label="时间线导航">
            <button
              type="button"
              onClick={() => handleScroll(-1)}
              disabled={!canScrollLeft}
              aria-label="向左滚动时间线"
              className="grid size-8 place-items-center rounded-md border-transparent bg-transparent text-muted-foreground outline-none transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-25 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="size-4.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll(1)}
              disabled={!canScrollRight}
              aria-label="向右滚动时间线"
              className="grid size-8 place-items-center rounded-md border-transparent bg-transparent text-muted-foreground outline-none transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-25 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="size-4.5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <ScrollArea
        scrollFade
        clampContentMinWidth={false}
        className="w-full min-w-0 max-w-full [&_[data-slot=scroll-area-viewport]]:scroll-smooth [&_[data-slot=scroll-area-viewport]]:[scroll-snap-type:x_proximity]"
      >
        {children}
      </ScrollArea>
    </div>
  );
}
