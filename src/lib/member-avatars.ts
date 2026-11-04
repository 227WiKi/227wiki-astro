import { memberAvatars, type MemberAvatarConfig } from "../config/member-avatars.ts";

interface AvatarMember {
  id: string;
  data: { status: "active" | "graduated" };
}

/** Dedicated square avatars only; official portrait photos are not a fallback. */
export function memberAvatarPath(member: AvatarMember, config: MemberAvatarConfig = memberAvatars): string {
  const override = config.overrides[member.id];
  if (override) return override;
  const folder = member.data.status === "graduated" ? "graduated" : config.activeSet;
  return `photo/avatar/${folder}/${member.id}.jpg`;
}
