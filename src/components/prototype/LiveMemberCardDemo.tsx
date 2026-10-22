import { Card, CardFrame, CardFrameHeader, CardFrameTitle } from "@/components/ui/card";
import { MemberAvatar } from "@/components/wiki/member/MemberAvatar";

export interface DemoMember {
  name: string;
  href: string;
  avatar?: string;
}

export function LiveMemberCardDemo({ members }: { members: DemoMember[] }) {
  return <CardFrame className="min-w-0 border-0 bg-muted/72 p-1 shadow-none before:hidden">
    <CardFrameHeader className="px-4 py-3">
      <CardFrameTitle render={<h2 />} className="self-start text-base">出演成员</CardFrameTitle>
    </CardFrameHeader>
    <div className="rounded-[calc(var(--radius-2xl)-4px)] border bg-card p-3 sm:p-4">
      <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3" aria-label="成员卡片样式示例">
        {members.map((member) => <li key={member.href} className="min-w-0">
          <Card render={<a href={member.href} />} className="flex h-full flex-row items-center gap-2.5 rounded-xl p-2 shadow-none before:hidden hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <MemberAvatar src={member.avatar} name={member.name} className="rounded-[max(0px,calc(var(--radius-xl)-9px))]" />
            <span className="min-w-0 text-sm font-semibold leading-snug [overflow-wrap:anywhere]">{member.name}</span>
          </Card>
        </li>)}
      </ul>
    </div>
  </CardFrame>;
}
