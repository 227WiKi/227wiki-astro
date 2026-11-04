import type { PerformerView } from "@/lib/live-detail";
import { MemberAvatar } from "@/components/wiki/member/MemberAvatar";

export function LiveCastList({ cast }: { cast: PerformerView[] }) {
  return <ul className="live-cast grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]">
    {cast.map((person, index) => {
      const Tag = person.href ? "a" : "div";
      return <li key={index} className="min-w-0">
        <Tag href={person.href} className="flex h-full min-w-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring">
          {person.type === "member" && person.avatar && <MemberAvatar src={person.avatar} name={person.name} size="sm" />}
          <span className="[overflow-wrap:anywhere]">{person.name}</span>
        </Tag>
      </li>;
    })}
  </ul>;
}
