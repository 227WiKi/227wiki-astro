export interface MemberAvatarConfig {
  activeSet: string;
  overrides: Readonly<Record<string, string>>;
}

/** Update after the new set of square avatars has been uploaded to R2. */
export const memberAvatars: MemberAvatarConfig = {
  activeSet: "16th",
  // R2-relative paths for members whose image does not follow the default rule.
  overrides: {},
};
