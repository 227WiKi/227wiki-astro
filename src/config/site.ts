export const siteName = "22/7 WiKi";
export const siteUrl = "https://227wiki.eu.org";
export const githubUrl = "https://github.com/227WiKi/227WiKi";
export const resourceBaseUrl = "https://res.227wiki.eu.org";

export const sectionPages = {
  member: { title: "Member", path: "/member/", description: "22/7 成员索引。" },
  character: { title: "Character", path: "/character/", description: "22/7 角色索引。" },
  songs: { title: "Songs", path: "/songs/", description: "22/7 歌曲索引。" },
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
export type SectionDefinition = {
  title: string;
  description: string;
  links: readonly { title: string; path: string }[];
};

const singleSection = (key: SectionKey): SectionDefinition => ({
  title: sectionPages[key].title,
  description: sectionPages[key].description,
  links: [sectionPages[key]],
});

export const sections: readonly SectionDefinition[] = [
  singleSection("member"),
  singleSection("character"),
  { title: "Music", description: "歌曲与音乐发行。", links: [sectionPages.songs, sectionPages.discography] },
  singleSection("live"),
  singleSection("anime"),
  singleSection("tv"),
  singleSection("radio"),
  singleSection("web"),
  singleSection("game"),
  singleSection("blog"),
];
