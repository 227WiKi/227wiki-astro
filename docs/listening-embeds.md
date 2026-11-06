# 歌曲试听

`listeningLinks` 保留必填的 `provider`、`label`、`url`，新增可选字符串 `embedUrl`。`url` 始终是原始外链；不要粘贴 iframe HTML，也不要根据歌名猜测歌曲 ID。

Apple Music：在 [官方营销工具](https://artists.apple.com/support/1117-apple-music-marketing-tools) 生成歌曲播放器，只将 iframe 的 `src` URL 填入 `embedUrl`。支持 HTTPS `embed.music.apple.com/{两位地区}/song/{可选名称}/{数字ID}`，以及 `/{地区}/album/{可选名称}/{数字专辑ID}?i={数字歌曲ID}`。不自动转换普通 Apple Music 分享链接，也不嵌入整张专辑或播放列表。单曲播放器高度为 175px。

Spotify：支持 HTTPS `open.spotify.com/track/{22位字母数字ID}` 和 `open.spotify.com/embed/track/{ID}`，允许末尾斜杠及分享参数，统一生成官方 Track Embed 地址。显式 `embedUrl` 必须是后者。播放器使用 [官方建议的 152px 紧凑布局](https://developer.spotify.com/documentation/embeds/tutorials/creating-an-embed)。`spotify.link`、`spoti.fi`、地区前缀路径及其他不支持的格式保留外链，不请求重定向。

其他平台只显示外链。无效或不支持的 `embedUrl` 不会创建 iframe；即使 Spotify 的普通链接可解析，也以显式配置为准并回退外链，便于发现并更正错误配置。Schema 接受字符串以保留该降级行为，服务端和客户端均通过同一个 Helper 严格验证。只允许 HTTPS、精确官方主机、无凭据和默认端口的已知歌曲路径；重建 URL 时去掉跟踪、自动播放及其他查询参数，Apple 的歌曲定位参数 `i` 除外。

相同平台和原始 URL 的重复记录合并，优先保留可用 Embed；同平台的不同 URL 均保留，编辑者应使用能区分版本或地区的 `label`。

组件采用 Astro 服务端 HTML 和自定义元素，不新增 React Island、SDK、API、依赖或预连接。默认在 HTML 中提供 Apple Music 播放器；没有可用 Apple Music 时使用第一个可嵌入的平台。播放器会随页面加载，使用 lazy loading，不自动播放。多个平台以 coss 分段 switcher 展示，使用原生单选组，支持 Tab 进入及方向键切换。切换与 Astro 站内导航移除旧 iframe，同一时间只保留一个播放器，不保存播放状态。

页面不提供额外打开、关闭按钮，也不显示播放器下方的说明。只有外链的平台继续显示平台链接；禁用 JavaScript 时，通过 noscript 提供可嵌入平台的原始链接，默认播放器仍可使用。允许加密媒体、全屏和画中画，不授予自动播放权限。默认播放器进入可视区域时会请求第三方资源；播放范围、地区、登录和订阅要求由平台决定。

Switcher 的选中背景在切换时以 200ms 滑动并适应标签宽度；快速连续切换从当前可见位置继续移动。尺寸变化时重新对齐，启用减少动态效果时直接切换，不播放滑动动画。浏览器已验证运动中间位置、终点对齐和减少动态效果下动画数为零。

项目当前未配置 CSP。如果以后添加 CSP，播放器所需 `frame-src` 为 `https://embed.music.apple.com https://open.spotify.com`，无需通配第三方域名。

隔离 fixture 位于 `tests/fixtures/listening.ts`；开发服务的 `/lab/listening/{apple,spotify,both,external,others,empty,invalid,duplicates}/` 可用于真实浏览器检查，生产构建不生成这些页面。正式歌曲数据未添加测试链接。

## 验证记录

默认加载与 switcher 已通过以下验证；此前 click-to-load、打开与关闭按钮相关的验证已被新的交互取代。

- `npm run check`：118 个文件，0 errors / warnings / hints。
- `npm run test`：32 项通过，包括默认平台优先级和无法嵌入时的回退。
- `npm run build`：183 个静态页面；`npm run check:links` 无失败；`git diff --check` 通过。
- Ego Lite 在正式歌曲页确认默认选中 Apple Music 并显示官方播放器；点击及方向键切换到另一平台时旧 iframe 被移除，只保留一个 iframe。Tab 焦点环可见，原生 radio 提供选中语义。
- 手机 390px 宽无横向溢出，亮暗主题及无 JavaScript 降级已检查；禁用 JavaScript 时默认播放器和两个原始平台链接仍存在。
- 通过 Astro ClientRouter 跳转到另一首歌曲时旧播放器卸载，新页面恢复默认 Apple Music。未重新验证平台的完整播放或各地区订阅限制。
