"use client";

import { useRef, useState } from "react";
import {
  Menu,
  MenuLinkItem,
  MenuPopup,
  MenuTrigger,
} from "@/components/ui/menu";
import type { MenuPrimitive } from "@/components/ui/menu";
import { cn } from "@/lib/utils";

export interface TOCItem {
  slug: string;
  text: string;
  depth: number;
}

export interface FloatingTOCMenuProps {
  headings: readonly TOCItem[];
}

export function FloatingTOCMenu({ headings }: FloatingTOCMenuProps) {
  const [open, setOpen] = useState(false);
  const actionsRef = useRef<MenuPrimitive.Root.Actions | null>(null);
  const filteredHeadings = headings.filter(
    ({ depth }) => depth === 2 || depth === 3,
  );

  if (filteredHeadings.length === 0) return null;

  return (
    <div className="floating-toc fixed z-30">
      <Menu modal={false} actionsRef={actionsRef} open={open} onOpenChange={setOpen}>
        <MenuTrigger
          openOnHover
          delay={80}
          closeDelay={160}
          aria-label="展开本页目录"
          className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border bg-popover px-4 py-2.5 text-sm font-medium text-popover-foreground shadow-md outline-none transition-colors duration-(--duration-fast,130ms) ease-(--ease-out-subtle) hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&[data-popup-open]]:bg-accent"
        >
          <span aria-hidden="true">≡</span> 本页目录
        </MenuTrigger>
        <MenuPopup
          align="end"
          className="toc-panel w-72 max-w-[calc(100vw-3rem)] overflow-y-auto overscroll-contain p-2"
          side="top"
          sideOffset={12}
        >
          <nav aria-label="本页目录">
            <ol className="flex flex-col gap-1">
              {filteredHeadings.map(({ slug, text, depth }) => (
                <li key={slug}>
                  <MenuLinkItem
                    href={`#${slug}`}
                    onClick={() => {
                      setOpen(false);
                      actionsRef.current?.close();
                    }}
                    className={cn(
                      "block w-full cursor-pointer rounded-lg px-3 py-2.5 text-start text-sm [overflow-wrap:anywhere] outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                      depth === 3 && "ps-6 text-muted-foreground",
                    )}
                  >
                    {text}
                  </MenuLinkItem>
                </li>
              ))}
            </ol>
          </nav>
        </MenuPopup>
      </Menu>
    </div>
  );
}
