// Section paths that breadcrumbs show as an icon instead of a word. The word stays
// as the accessible name and tooltip; entity titles (songs, Releases, Lives) stay text.
import {
  Archive, Clapperboard, Disc3, Drama, Gamepad2, Globe, Music, Radio, Ticket, Tv, Users, type LucideIcon,
} from "lucide-react";

export const breadcrumbIcons: Readonly<Record<string, LucideIcon>> = {
  "/member/": Users,
  "/character/": Drama,
  "/discography/": Disc3,
  "/discography/songs/": Music,
  "/live/": Ticket,
  "/anime/": Clapperboard,
  "/tv/": Tv,
  "/radio/": Radio,
  "/web/": Globe,
  "/game/": Gamepad2,
  "/archive/blog/": Archive,
};
