import { cn } from "@/lib/utils";

interface Props {
  src?: string;
  name: string;
  size?: "sm" | "md";
  className?: string;
}

/** The adjacent member name labels these non-interactive identity images. */
export function MemberAvatar({ src, name, size = "md", className }: Props) {
  const pixels = size === "sm" ? 32 : 48;
  const classes = cn("aspect-square shrink-0 rounded-sm object-contain", size === "sm" ? "size-8" : "size-12", className);
  return src
    ? <img src={src} alt="" width={pixels} height={pixels} loading="lazy" decoding="async" className={classes} />
    : <span aria-hidden="true" className={cn(classes, "flex items-center justify-center bg-muted text-sm text-muted-foreground")}>{name.slice(0, 1)}</span>;
}
