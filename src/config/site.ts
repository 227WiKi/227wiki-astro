export const siteName = "22/7 WiKi";
export const siteUrl = "https://227wiki.eu.org";
export const githubUrl = "https://github.com/227WiKi/227WiKi";
export const resourceBaseUrl = "https://res.227wiki.eu.org";

export const sectionPages = {
  member: { title: "Member", path: "/member/", description: "22/7 成员索引。" },
  character: { title: "Character", path: "/character/", description: "22/7 角色索引。" },
  discography: { title: "Discography", path: "/discography/", description: "22/7 单曲与专辑发行索引。" },
  live: { title: "Live", path: "/live/", description: "22/7 演唱会与现场活动索引。" },
  anime: { title: "Anime", path: "/anime/", description: "22/7 动画入口。" },
  tv: { title: "TV", path: "/tv/", description: "22/7 电视节目索引。" },
  radio: { title: "Radio", path: "/radio/", description: "22/7 广播节目索引。" },
  web: { title: "Web", path: "/web/", description: "22/7 网络节目与直播索引。" },
  game: { title: "Game", path: "/game/", description: "22/7 游戏档案入口。" },
  blog: { title: "Archive", path: "/archive/blog/", description: "22/7 成员博客档案入口。" },
} as const;

export type SectionKey = keyof typeof sectionPages;
export type NavigationLink = {
  key: SectionKey;
  title: string;
  path: string;
  description: string;
};

export type NavigationGroup = {
  key: string;
  label: string;
  description: string;
  links: readonly NavigationLink[];
};

const navigationLink = (key: SectionKey): NavigationLink => ({
  key,
  ...sectionPages[key],
});

export const navigationGroups: readonly NavigationGroup[] = [
  {
    key: "people",
    label: "人物",
    description: "22/7 的成员与角色资料。",
    links: [navigationLink("member"), navigationLink("character")],
  },
  {
    key: "music",
    label: "音乐",
    description: "22/7 的单曲、专辑与歌曲资料。",
    links: [navigationLink("discography")],
  },
  {
    key: "live",
    label: "Live",
    description: "演唱会与现场活动档案。",
    links: [navigationLink("live")],
  },
  {
    key: "media",
    label: "媒体",
    description: "动画、电视、广播与网络节目。",
    links: [
      navigationLink("anime"),
      navigationLink("tv"),
      navigationLink("radio"),
      navigationLink("web"),
    ],
  },
  {
    key: "game",
    label: "Game",
    description: "22/7 游戏相关档案。",
    links: [navigationLink("game")],
  },
  {
    key: "archive",
    label: "Archive",
    description: "成员博客等历史资料。",
    links: [navigationLink("blog")],
  },
];
