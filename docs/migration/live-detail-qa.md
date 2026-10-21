# Live Detail 验收记录

本轮仅修改 Live Detail、其组件与数据结构、120 篇当前 Astro Live 内容，以及迁移和校验工具。原有 Live Index / LiveEventCard / live.ts 的未提交修改未在本轮改写；Member、Release、Song、共享布局和全站 Tokens 同样未改写。

## 页面与数据

- 使用 BaseLayout wide、WikiArticleLayout infoboxWidth="wide"、Breadcrumbs、PageHeader、WikiArticle、FloatingTOC。
- 介绍正文 → 公演日程与曲目 → 已确认的活动出演阵容 → 参考资料。补充发行资料保留在介绍后；不重复渲染已迁移曲目表。
- LiveInfobox 海报复用 resourceUrl，原始比例、object-fit: contain、6px 图片圆角；无海报时没有占位或缩放交互。
- Live / Event 与可选 format: tour 分离。只有六篇正文明确写明巡演的活动加入 format。
- Setlist 的 song / section / note 判别联合，以及 member / character 判别联合独立校验。Show ID 唯一、真实日期、空内容和空演唱者列表均验证。
- Song/member 引用在生成路由前验证。Song 标题使用 NFC/去首尾空白后的精确校验；不存在或名称不符时构建报错。没有引用时保留纯文本。
- 不推断 cast，不把角色 CV 变成 Member ref。角色没有链接或虚构头像。

## egolite 浏览器验收

仅使用 egolite，TaskSpace 2；未使用其他浏览器或 runner。实际访问本机静态预览，未打开或请求演出音视频。

### 响应式矩阵

下列七种状态分别检查 390、768、1024、1280、1440px，以及 Light / Dark，共 70 次尺寸与主题检查，页面宽度均无水平溢出：

| 路由 / 状态 | 结果 |
| --- | --- |
| 2018/2018-warikirenai-live-shampoo，有海报、单场、Virtual / Real、Encore、Song 链接 | 通过；图片完整、6px 圆角、曲目分段与编号保留 |
| 2024/2024-character-live-red-or-white，同日两部、不同曲目 | 通过；仅当前场次面板显示 |
| 2022/2022-live-tour-14，六场巡演、同日昼夜、多会场 | 通过；全部默认关闭，可同时展开多个 |
| 2025/2025-anata-de-nakucha-release-events，跨日期非 Tour | 通过；各日期/部次独立，不标记 Tour |
| 2026/2026-anniversary-live，无海报、单场、缺失 Setlist | 通过；日程保留，无多余 Tabs / Accordion |
| 2026/2026-japan-festa，明确角色演唱者 | 通过；角色按原注显示，无 Member 推断 |
| 临时交互 QA 页，超长日文标题、三个同日面板、独立 cast / performers / 缺失曲目 | 通过；验收后已从源码与构建产物删除 |

另外检查 Star Travelers 的两张未分配原表：仍可读，三个既有 Show 保留，均没有强行填入 Episode 曲目。台北 7/24 Fan Meeting 未分配到 7/25 Live。

### 键盘、触摸与内容隔离

- Coss Tabs：鼠标切换、方向键移动焦点并按 Enter 激活均通过；不同场次的曲目和演唱者独立。
- 缺失曲目面板：显示“Setlist 尚未整理”，无演唱者按钮或空浮层。
- Performer Popover：鼠标 Hover、键盘聚焦打开、链接键盘可达、Escape/关闭按钮关闭均通过。关闭后不会立刻因焦点返回而重新打开。
- 390px 实际 CDP touchStart / touchEnd 验证点击打开角色浮层；只有角色文字，0 个角色详情链接。
- 临时 Member 浮层使用现存 /member/aina/ 和 /member/alice/ 验证，第二场不包含第一场的演唱者。
- 紧凑出演卡：390px 为 175px / 175px 两列；Member 显示已有头像及链接，Character 只有文字；活动 cast 与场次 cast 分开显示。
- prefers-reduced-motion: reduce 实测 matches=true，TabsPanel 无位移动画，过渡时长受现有全局规则限制为 0.01ms。
- 768px Tabs 栏发现额外纵向滚动条，已限定 overflow-y: hidden，复查 scrollHeight 与 clientHeight 同为 34px。
- Accordion 展开区不重复 summary 已有日期和会场信息。
- 捕获的 Runtime 异常与 Log 错误为空。

已人工查看实际 egolite 截图：390px 海报详情和触摸浮层、768px 两部详情、1280px 海报详情、1440px 深色巡演、390px 待核实活动。截图只作为本地 QA 临时输出，未加入生产图片目录。

### 回归与 DOM

- Live Index：仍有 120 张卡；按类别显示 Live 60 / Event 60。切换后节点仍是原对象，没有 clone 或第二套卡片；切回按时间恢复正常。1280px 维持四列。
- 实际从演唱者浮层跳转 /member/alice/，Member 资料及原有头像正常。
- 实际点击 Setlist 的 /discography/songs/chikatetsu-teikou-shugi/，Song 页面正常。
- /discography/releases/1st-single/ 原有 TrackList 的 12 行正常，无页面水平溢出。
- 单场没有 Tabs；同日面板只显示选中的 Show；巡演/跨日期每个 Show 一个原生 details，可多开，默认关闭。
- 全量原始非曲目表与事实正文块保留；已迁移表删除，未迁移表完整保留。迁移脚本独立逐行核对原始曲名、编号、Encore、演出形式以及角色/CV 原注。

## 最终自动验证

临时 QA 页删除后重新执行：

| 检查 | 结果 |
| --- | --- |
| npm run check | 0 errors / 0 warnings / 0 hints |
| npm run build | 183 pages；120 个 Live Detail |
| node --test tests/live-detail.test.mjs | 5 / 5 通过 |
| node scripts/check-live-output.mjs | 183 页、4501 个内部 URL/锚点检查，0 失败 |
| git diff --check | 通过 |
| 原表/结构化曲目比对 | 225 表转换，224 场有 Setlist；5 表保留待核实 |
| iframe / 重复 H1 / QA 页面残留 | 0 / 0 / 0 |

kill-ai-slop 扫描产生 4 个命中，人工判断均为有意设计：Index 链接下划线、同一元素的外边框/圆角裁切，以及官方外链的 ↗ 指示。没有为本轮添加渐变、品牌色块、装饰徽章或卡片悬浮动画。

详细迁移统计、四个待核实文件、全部逐表映射、未关联的 194 个不同标题（2096 条曲目）见 [迁移报告](live-setlist-report.md)，机器审计数据见 [audit JSON](live-setlist-audit.json)。无新增依赖、Character 模块、媒体处理功能、生产测试资料或自动提交。
