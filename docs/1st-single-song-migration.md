# 首张单曲歌曲迁移与验收

核对日期：2026-11-06。只迁移三首正式歌曲，保留原 ID、URL、Release Track 与 Live Setlist。没有 commit、push 或 deploy。

## 字段核对

状态：**迁移** = 已核实并迁移；**原有正确** = 原有数据已正确、无需修改；**缺来源** = 暂缺可靠来源；**待授权** = 有资料但尚无足够使用授权。冲突已在下节说明，不静默覆盖。

| 字段 | 不曾存在的我 | 地下铁抵抗主义 | 11人聚集的理由 |
| --- | --- | --- | --- |
| ID、日文名、中文名 | 原有正确：boku-wa-sonzai-shiteinakatta；僕は存在していなかった；不曾存在的我 | 原有正确：chikatetsu-teikou-shugi；地下鉄抵抗主義；地下铁抵抗主义 | 原有正确：11nin-ga-atsumatta-riyuu；11人が集まった理由；11人聚集的理由 |
| 时长 | 原有正确：4:15 | 原有正确：4:31；纠正旧正文的 4:15 说法 | 原有正确：4:00 |
| 分类 | 迁移：原创、group、member；平台演唱者署名为 22/7 | 迁移：原创、group、member；平台署名及旧页八人演唱记载 | 迁移：原创、group、member；平台署名及旧页十一人演唱记载 |
| 作词 | 迁移：秋元康 | 迁移：秋元康 | 迁移：秋元康 |
| 作曲 | 迁移：目黒良子 | 迁移：大塚剛毅 | 迁移：キタムラタケシ、田上陽一 |
| 编曲 | 迁移：野中雄一 | 迁移：野中"まさ"雄一 | 迁移：田上陽一 |
| 首次发行 | 原有正确：由 1st-single 曲目推导 2017-09-20 | 原有正确：同左 | 原有正确：同左 |
| 首发收录 | 原有正确：1st-single，两种 Edition | 原有正确：同左 | 原有正确：同左 |
| 录音版本 | 迁移：仅 original | 迁移：仅 original | 迁移：仅 original |
| Spotify | 原有正确：0ODazogcZ3sl4HDik07Fax | 原有正确：6V05ghJgBPWduHEimGigbQ | 原有正确：3Vb9y6HhksDA7A4iY4nZgV |
| Apple Music | 迁移：日本区 song/1537751448，专辑 1537751447 | 迁移：日本区 song/1537751449，同专辑 | 迁移：日本区 song/1537751450，同专辑 |
| 视频 | 迁移：官方 YouTube MV；应援站中文字幕 Lyric Video；移除失效 Bilibili MV | 缺来源：未确认独立正式 MV 或 Lyric Video，保持空数组 | 缺来源：同左 |
| 日文歌词 | 待授权：旧页有全文，保留原始页来源 | 待授权：同左 | 待授权：同左 |
| 中文译文 | 待授权：旧页有全文，保留 22/7中文应援站署名及原链接 | 待授权：同左 | 待授权：同左 |
| 收录作品 | 原有正确：1st-single、1st-album，各显示一次 | 原有正确：1st-single，未推测专辑收录 | 原有正确：1st-single、1st-album，各显示一次 |
| Live | 原有正确：自动生成 43 场 Show | 原有正确：自动生成 69 场 Show | 原有正确：自动生成 15 场 Show |

`group` 表示以组合名义发行的群体演唱，并不表示历代所有成员参加。八人和十一人的阵容不同，不构成同一首歌的额外录音版本。没有填写猜测的个人 Performer Reference、Unit 名或角色演唱身份。阵容人数依据目前止于旧 Wiki，官方发行页说明当时有十一名成员、八个角色，但没有提供逐曲完整演唱者表；进一步核实应查原始唱片内页。

## 来源、差异与采用规则

已读取本地 `/Users/astral/Desktop/Projects/227WiKi/docs/songs/single/1st/song-1.md`、`song-2.md`、`song-3.md`，不是仅凭用户摘要迁移。来源版本 HEAD：`96d00675cd54f55eab99cedfbfeb2a4f5ec90fe4`。未修改旧仓库。

- [官方 Type-A](https://nanabunnonijyuuni-mobile.com/s/n110/page/official_discography_detail?item=SRCL-9520) 与 [官方 Type-B](https://nanabunnonijyuuni-mobile.com/s/n110/page/official_discography_detail?item=SRCL-9522)：核对发行日期、目录号、两版相同的六条音轨，以及 Type-A 的 MV DVD。旧官网路径已迁址，页面参考资料使用实际可读的新地址。
- [Apple 主打曲署名](https://music.apple.com/jp/song/1537751448)、[地下鉄抵抗主義署名](https://music.apple.com/jp/song/1537751449)、[11人が集まった理由署名](https://music.apple.com/jp/song/1537751450)：核对曲名、22/7 演唱署名、首单专辑、词曲编曲。没有复制网络歌词全文。
- [JOYSOUND 作品资料](https://www.joysound.com/web/search/song/642025)：确认共同作曲者日文为田上陽一。Apple 将其共同作曲及编曲署名显示为 `yo-ichi tanoue`，旧 Wiki 写作简体“田上阳一”；采用核实后的日文汉字名，别名差异仅记录于本文。
- 主打曲旧页“目黑凉子”采用 Apple 的正式日文“目黒良子”。Apple 对两曲编曲分别显示“野中雄一”与 `野中"まさ"雄一`，按曲保留平台署名，不把别名当成两个共同编曲者，也不凭空补充其他人员。
- Apple iTunes Lookup：`https://itunes.apple.com/lookup?id=1537751447&entity=song&country=jp` 返回三首原版的毫秒时长为 255373、271053、240667；与现有 4:15、4:31、4:00 的秒精度显示相符。中国区查询只返回专辑条目，未返回歌曲；日本区及美国区返回同样的 Track ID。改用日本区单曲页面及单曲 embed 地址，不换录音、不换 Track ID。时长按既有展示习惯保留整数秒，不以四舍五入把第三首改成 4:01。
- Spotify 三条原有 ID 的 oEmbed 均 HTTP 200 且曲名对应；实际 embed 可显示歌曲与 22/7。未仅通过模糊搜索选择同名录音。
- [YouTube MV](https://www.youtube.com/watch?v=lKGDCoRjlCk)：可访问，发布者显示 22/7 官方频道，说明为 Sony Music Labels 的 Music Video。
- Bilibili `BV1vZ4y1g7uS`：页面跳转错误页，公开 view API 返回 `code: -404`，从正式视频列表移除，不当成第二支 MV。
- [Bilibili Lyric Video](https://www.bilibili.com/video/BV1Xx411i7Wb)：公开 view API 返回视频标题包含 Lyric Video 与中文字幕，上传者为 `227中文应援站`。作为字幕版本链接保留，不声称是官方上传或新增正式 MV。
- 旧页关于动作捕捉制作的说法本轮未取得足够交叉来源，未加入简介。另两首没有可靠的独立 MV 来源；搜索中出现的 Live 视频没有当成 MV 迁入。

## 旧页与新结构对应

| 旧内容 | 新归属 |
| --- | --- |
| 歌名、中文名、时长 | 三首 Song Markdown 的 titleJa、titleZh、duration |
| 作词、作曲、补核的编曲 | credits.lyricists / composers / arrangers |
| “类型：歌曲” | 不直接作为分类依据；另按作品及演唱署名填写 origin、versions |
| 发行日期、收录单曲 | Release Track 引用推导首发信息，不复制日期进 Song |
| 制作人、发行公司、Oricon 周榜 | 已有 Release 层级数据，未迁入 Song Schema，未改写 Release |
| Music Video / Lyric Video | videos，保留视频类型及平台，不复制旧 iframe 和脚本 |
| 网易云 meting 试听 | 不迁旧脚本，使用原有 Spotify 与 Apple 逻辑 |
| 日文歌词、译文、译者署名 | 独立 songLyrics 内容集合；当前为待授权记录，非全文 |
| Live 记录 | 仍由 Setlist 的 song 自动推导，不在 Song Markdown 手工维护 |
| 原页来源与差异 | 正式链接存入 references；迁移差异仅记录于本文，不在页面展示 |

已读旧站 `docs/license.md` 的 CC BY-SA 4.0 说明及三首原页的第三方译文出处。该站点级说明不能证明原作歌词及外部应援站译文的权利链。没有把“本地可读”当成“第三方全文已授权”。原译文署名链接均为 `https://www.bilibili.com/read/cv5603214`；本轮只确认它在旧页中的署名位置，未确认外站文章当前可读性及授权条件。三首的日文、中文条目均标为 `permission-pending`，正文保持空白，不生成、改写或补全歌词。

## 本次文件

- 修改三个 `src/content/songs/{原有 ID}.md`：制作署名、简介、分类、唯一原版、试听地址、视频及来源。页面只显示来源链接和必要署名，迁移 note 已移除。
- 新增 `src/content/song-lyrics/{原有 ID}/ja.md` 与 `zh-Hans.md`，共六份状态和署名记录。
- 新增 `src/lib/song-lyrics.ts`：内容契约、授权记录约束、孤立歌曲与重复语言检测、未授权正文和空已授权正文检测。
- 小范围增补 `src/content.config.ts`：songLyrics 集合与歌曲来源字段。
- 增补 `LyricsSection.astro` 与歌曲详情路由：按语言读取独立 Markdown，保留换行，展示准确状态与来源，保持旧 named slots 可用。
- 新增 `tests/song-migration.test.mjs`；调整 `tests/song-index.test.mjs` 生产数据断言以接受真实分类；在 `tests/ui-rules.test.mjs` 中纳入改动页面和歌词组件。
- 新增本文作为来源审计、字段核对、模板和验收记录。

开发前工作区已有大量未提交的导航、Infobox、索引与模型修改。本次保留这些改动；没有修改 SongInfobox、SongReleaseList、SongLiveHistory、SongVideos、ListeningLinks、Release TrackList 或 Live 内容。本文文件清单是本次增量，不是整个工作区 diff 的归属声明。

## 验收与限制

- `npm run check`：132 个文件，0 errors / warnings / hints。
- `npm run test`：57 项通过，0 失败。
- `npm run build`：生成 184 页，三条原有歌曲 URL 均生成。
- `npm run check:links`：8371 条内部链接，0 failures。首发、收录作品去重及全部 127 条歌曲 Show 深链接与源数据一致。
- `git diff --check`：通过。
- ego-browser：检查三页 1440px 桌面与 390px 手机的亮暗主题，共 12 种页面状态，无横向滚动；检查 Header、Infobox、简介、试听、视频有无、两种歌词状态、收录、Live、ContextNav 与 FloatingTOC。
- 实测歌词目录跳转，目标标题位于导航下方；实测首发链接进入首单；实测 Live 链接进入 2022 Anniversary Live 的有效 Show 锚点。三首歌曲均可切换到相应 Spotify Track iframe。
- Apple 三首日本区单曲 embed 均能显示对应曲名、22/7 和播放入口。观察到主打曲一次加载超过 20 秒才显示完整界面；Spotify 主打曲也曾短暂返回 upstream timeout，随后加载正常。不能把 URL 格式合法或一次 HTTP 200 等同于始终可播放。
- 未登录、未购买订阅、未做完整音频播放测试；不能保证不同地区或账户的音频许可。播放器实现未改写。
- 歌词待授权条目与缺视频空状态已实测。因为没有可确认的全文授权，真实日文全文、译文全文、逐行翻译对应与真实长篇歌词排版尚未验收；已实现可复用 Markdown 渲染与软换行保留，不把此状态宣称为全文迁移完成。

三页可以作为真实元数据、来源、单一原版、试听、视频及 Release / Live 自动关系的正式样板；歌词全文样板仍待原作及译文授权。无需为追求样板“全满”虚构视频、版本或演唱者。

## 后续复用模板

直接复用三首 Song 的字段结构：`titleJa`、`titleZh`、`duration`、`origin`、`credits`、`versions`、`listeningLinks`、`videos`、`references`。只填写有来源的值，缺少制作人员可留空数组，不加“未知”。日期、封面、收录、Live 始终从关系推导。

独立歌词文件格式：

```yaml
---
song: boku-wa-sonzai-shiteinakatta
language: ja
status: permission-pending
sourceUrl: https://example.com/source
sourceLabel: 原始来源
attribution: 作者或译者的署名
---
```

以上 `example.com` 只是文档中的位置示意，不可写入正式资料。每首每种语言最多一个文件，中文使用 `zh-Hans`。得到明确授权后，将状态改为 `available`，填写 `permission` 记录授权者、凭据或适用许可证，并把获准使用的全文放在 Markdown 正文；按原稿保留段落与换行。正文使用普通文本行，组件通过 `white-space: pre-line` 保留 Markdown 软换行。`missing` 表示来源中仍无可迁移全文，`permission-pending` 表示已有文本但权限未确认，二者不能混用。

构建会拒绝不存在的 Song、同歌同语言重复记录、缺授权记录的 available、空的 available，以及 pending / missing 条目意外包含正文。后续应按相同来源优先级核实每首歌，按同一套检查验证关系；不得把这三首的人员、阵容或分类批量复制给其他歌曲。
