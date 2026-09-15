"use client";

import { Check, Home, Users } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Menu,
  MenuLinkItem,
  MenuPopup,
  MenuTrigger,
} from "@/components/ui/menu";
import { cn } from "@/lib/utils";

export interface MemberBreadcrumbItem {
  label: string;
  href: string;
  current: boolean;
}

export interface MemberBreadcrumbsProps {
  currentName: string;
  members: MemberBreadcrumbItem[];
  signatureSvg?: string;
  className?: string;
}

export function MemberBreadcrumbs({
  currentName,
  members,
  signatureSvg,
  className,
}: MemberBreadcrumbsProps) {
  return (
    <Breadcrumb className={cn("min-w-0 text-sm", className)}>
      <BreadcrumbList className="flex-nowrap">
        {/* Home */}
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink
            aria-label="首页"
            href="/"
            className="inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Home aria-hidden="true" className="size-4 shrink-0 pointer-events-none" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator className="shrink-0" />

        {/* Member Menu Trigger */}
        <BreadcrumbItem className="shrink-0">
          <Menu>
            <MenuTrigger
              aria-label="切换成员"
              className="inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Users aria-hidden="true" className="size-4 shrink-0 pointer-events-none" />
            </MenuTrigger>
            <MenuPopup align="start" sideOffset={4} className="max-h-72 w-48 overflow-y-auto">
              {members.map((member) => (
                <MenuLinkItem
                  key={member.href}
                  href={member.href}
                  className={cn(
                    "flex items-center justify-between gap-3 text-sm",
                    member.current && "font-medium text-foreground",
                  )}
                >
                  <span className="truncate">{member.label}</span>
                  {member.current && (
                    <Check
                      aria-hidden="true"
                      className="size-4 shrink-0 text-foreground opacity-90"
                    />
                  )}
                </MenuLinkItem>
              ))}
            </MenuPopup>
          </Menu>
        </BreadcrumbItem>

        <BreadcrumbSeparator className="shrink-0" />

        {/* Current member name or signature */}
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage className="inline-flex items-center min-w-0">
            {signatureSvg ? (
              <>
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center text-foreground [&>svg]:h-[18px] [&>svg]:w-auto [&>svg]:max-w-[56px] [&>svg]:fill-current shrink-0 pointer-events-none select-none"
                  dangerouslySetInnerHTML={{ __html: signatureSvg }}
                />
                <span className="sr-only">{currentName}</span>
              </>
            ) : (
              <span className="max-w-[200px] truncate sm:max-w-none">
                {currentName}
              </span>
            )}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
