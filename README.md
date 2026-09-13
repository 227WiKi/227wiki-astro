# 22/7 WiKi v2

Phase 0 Architecture Spike 已验证基础技术路线。Phase 1 加入第一条真实 Member content，用于验证完整的静态内容链路。

- Astro static-first：页面、Layout、Header / Footer 和业务 wrapper 都是 Astro；不使用服务端 adapter 或 SPA router。
- Coss UI 是视觉基线，Base UI 是 primitive base；Tailwind CSS v4 通过官方 Vite 插件接入。
- shadcn-compatible registry workflow 将 Coss 组件加入源码。React 仅为必要交互提供客户端 islands；普通 Coss Card 在构建时渲染为静态 HTML。
- TypeScript strict；`@/*` 对应 `src/*`。站点、栏目和资源配置集中于 `src/config/site.ts`，资源地址由 `resourceUrl(path)` 生成。

## 本地运行

Node.js >= 22.12.0，npm（本次验证：Node 24.15.0、npm 11.12.1）。

```sh
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## Coss workflow

遵循 [Astro + shadcn 官方流程](https://ui.shadcn.com/docs/installation/astro)。初始化命令：

```sh
npm create astro@latest -- . --template with-tailwindcss --install --add react --no-git --no-ai --yes
npx shadcn@latest init --base base --preset nova --yes
npx shadcn@latest add @coss/button @coss/card @coss/dialog @coss/colors-neutral --yes
```

组件来自 [Coss registry](https://coss.com/ui/)，没有手写仿制或 GitHub raw 下载。Spinner 和 ScrollArea 是当前 Button / Dialog registry 的必要传递依赖，没有额外功能入口。`components.json` 的 `base-nova` 记录 Base UI CLI 工作流；实际 UI 文件和视觉 tokens 来自 Coss。

`global.css` 保留经 `npx shadcn@latest view @coss/style` 核对的完整官方语义颜色、base rules 和官方初始化的 radius mappings。未直接安装完整 style preset，因为它会引入全部 UI 与字体配置。使用简单的自托管 Inter + 系统 CJK fallback，未引入 Next.js；唯一品牌变量是 `--wiki-brand: #008cd2`。保留官方暗色 tokens，但没有主题切换功能。

## 路由与 hydration 验证

`SectionCard.astro → Coss Card → static HTML`，没有 `client:*`。全部栏目共用 `SectionLanding.astro`，各入口使用独立 `index.astro`，可自然扩展未来的内容详情路由。

| 构建路由 | Hydration |
| --- | --- |
| `/` | 0 scripts、0 islands；10 张静态 Coss Card |
| `/member/`、`/member/sally/`、`/character/`、`/songs/`、`/discography/` | 0 scripts、0 islands |
| `/live/`、`/anime/`、`/tv/`、`/radio/`、`/web/` | 0 scripts、0 islands |
| `/game/`、`/archive/blog/` | 0 scripts、0 islands |
| `/lab/ui/` | 1 个 `CossDialogProbe` React island，`client:idle` |

`/lab/ui/` 不在主导航中，专门验证 Coss Button + Dialog 的客户端交互。它在构建时仍生成 HTML，浏览器空闲后仅激活 probe。`dist/_astro/` 中存在 React / Dialog bundle 不代表普通页面加载它：普通路由没有脚本或 hydration 入口。

## Phase 1: Member vertical slice

```text
src/content/members/
→ Astro Content Collection
→ /member/
→ /member/[slug]/
```

Member 使用 structured metadata + Markdown body。Markdown 文件名是稳定的 entry ID，因此 `sally.md` 对应 `member.id === "sally"` 和 `/member/sally/`；frontmatter 不重复保存 `id` 或 `slug`。

`/member/` 通过 `getCollection("members")` 自动生成卡片，`/member/[slug]/` 通过 `getStaticPaths()` 构建详情页并渲染 Markdown。Member 页面完全静态且没有 hydration。当前没有 Character collection 或 Character relation。

已执行 `npm install`、`npm run check`、`npm run build`，并检查全部 14 个生成的 HTML 文件及 canonical URL。锁文件中没有 Radix 包。

浏览器验证：Playwright + 已安装 Chrome（1280×900、390×844）。13 个路由均返回 200，普通页面没有 JS 网络请求；禁用 JS 后首页卡片和 Songs 跳转正常。Dialog 键盘打开、焦点限制、Escape / 按钮关闭与焦点恢复通过，控制台无错误或警告。已核对 Coss Card 的 border、radius、shadow、字体和分区 spacing；另按要求使用 ego-lite 复核：首页 0 scripts / islands、Member 导航、Dialog hydration、Escape / 按钮关闭与焦点恢复均通过。ego-lite 截图接口返回超时 / Unable to capture screenshot，视觉截图来自此前的 Chrome 验证。未测试 Firefox / Safari。

下一阶段将单独讨论 Character；本阶段未实现 Character、CMS、relations、搜索或其他 Member 迁移。
