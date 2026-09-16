"use client";

import {
  Menu,
  MenuLinkItem,
  MenuPopup,
  MenuTrigger,
} from "@/components/ui/menu";
import type { NavigationGroup } from "@/config/site";
import { cn } from "@/lib/utils";

const navLinkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors duration-(--duration-fast,130ms) ease-(--ease-out-subtle) hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

interface DesktopNavProps {
  groups: readonly NavigationGroup[];
  currentPath: string;
}

export function DesktopNav({ groups, currentPath }: DesktopNavProps) {
  const isPathActive = (path: string) =>
    currentPath === path || currentPath.startsWith(path);
  const isGroupActive = (paths: readonly string[]) =>
    paths.some(isPathActive);

  return (
    <nav aria-label="主导航">
      <ul className="flex items-center gap-1">
        {groups.map((group) => {
          const active = isGroupActive(group.links.map((link) => link.path));

          return (
            <li key={group.key}>
              {group.links.length > 1 ? (
                <Menu modal={false}>
                  <MenuTrigger
                    openOnHover
                    delay={80}
                    closeDelay={140}
                    className={cn(
                      navLinkClass,
                      "flex cursor-pointer list-none items-center gap-1.5 [&[data-popup-open]>span]:rotate-180",
                      active && "bg-accent text-foreground",
                    )}
                    aria-current={active ? "true" : undefined}
                  >
                    {group.label}
                    <span
                      aria-hidden="true"
                      className="text-xs transition-transform duration-(--duration-normal,170ms) ease-(--ease-out-subtle)"
                    >
                      ⌄
                    </span>
                  </MenuTrigger>
                  <MenuPopup
                    align="start"
                    side="bottom"
                    sideOffset={8}
                    className="w-56 p-2"
                  >
                    <ul className="flex flex-col gap-1">
                      {group.links.map((link) => (
                        <li key={link.path}>
                          <MenuLinkItem
                            href={link.path}
                            className={cn(
                              navLinkClass,
                              "block w-full text-start",
                              isPathActive(link.path) &&
                                "bg-accent text-foreground",
                            )}
                            aria-current={
                              isPathActive(link.path) ? "page" : undefined
                            }
                          >
                            {link.title}
                          </MenuLinkItem>
                        </li>
                      ))}
                    </ul>
                  </MenuPopup>
                </Menu>
              ) : (
                <a
                  href={group.links[0].path}
                  className={cn(
                    navLinkClass,
                    active && "bg-accent text-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {group.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface MobileNavProps {
  groups: readonly NavigationGroup[];
  currentPath: string;
  githubUrl: string;
}

export function MobileNav({ groups, currentPath, githubUrl }: MobileNavProps) {
  const isPathActive = (path: string) =>
    currentPath === path || currentPath.startsWith(path);

  return (
    <div className="md:hidden">
      <Menu modal={false}>
        <MenuTrigger
          aria-label="打开导航菜单"
          className="flex min-h-11 cursor-pointer list-none items-center rounded-lg border px-3 text-sm font-medium outline-none transition-colors duration-(--duration-fast,130ms) ease-(--ease-out-subtle) hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring [&[data-popup-open]]:bg-accent"
        >
          Menu
        </MenuTrigger>
        <MenuPopup
          align="end"
          side="bottom"
          sideOffset={8}
          className="max-h-[calc(100vh-5rem)] w-[min(calc(100vw-2rem),20rem)] overflow-y-auto p-3"
        >
          <nav aria-label="移动端主导航">
            <ul className="flex flex-col gap-2">
              {groups.map((group) => (
                <li key={group.key}>
                  {group.links.length > 1 ? (
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                        {group.label}
                      </p>
                      <ul className="flex flex-col gap-1">
                        {group.links.map((link) => (
                          <li key={link.path}>
                            <MenuLinkItem
                              href={link.path}
                              className={cn(
                                navLinkClass,
                                "block min-h-11 py-3 w-full text-start",
                                isPathActive(link.path) &&
                                  "bg-accent text-foreground",
                              )}
                              aria-current={
                                isPathActive(link.path) ? "page" : undefined
                              }
                            >
                              {link.title}
                            </MenuLinkItem>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <MenuLinkItem
                      href={group.links[0].path}
                      className={cn(
                        navLinkClass,
                        "block min-h-11 py-3 w-full text-start",
                        isPathActive(group.links[0].path) &&
                          "bg-accent text-foreground",
                      )}
                      aria-current={
                        isPathActive(group.links[0].path) ? "page" : undefined
                      }
                    >
                      {group.label}
                    </MenuLinkItem>
                  )}
                </li>
              ))}
            </ul>

            <MenuLinkItem
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block min-h-11 rounded-lg border px-3 py-3 text-sm font-medium outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              GitHub
            </MenuLinkItem>
          </nav>
        </MenuPopup>
      </Menu>
    </div>
  );
}
