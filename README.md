# 22/7 WiKi

Phase 0 Architecture Spike 已验证基础技术路线，Phase 1–2 已验证 Member 静态内容链路与 optional field handling，Phase 3 建立正式的全站框架。

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

`wiki/common/SectionCard.astro → Coss Card → static HTML`，没有 `client:*`。尚未迁移内容的栏目共用正式 `wiki/common/SectionLanding.astro`，各入口使用独立 `index.astro`。

| 构建路由 | Hydration |
| --- | --- |
| `/` | 0 scripts、0 islands；6 个信息架构分组 Card |
| `/member/`、`/member/sally/`、`/member/nagomi/`、`/character/`、`/songs/`、`/discography/` | 0 scripts、0 islands |
| `/live/`、`/anime/`、`/tv/`、`/radio/`、`/web/` | 0 scripts、0 islands |
| `/game/`、`/archive/blog/`、`/404.html` | 0 scripts、0 islands |
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

## Phase 2: Graduated Member Hardening

Phase 2 使用同一个 Member schema 和同一组页面组件验证两种资料形态：Sally 是 `active` 且 metadata 较完整，Nagomi 是 `graduated` 且 metadata 有意保持精简。

本阶段验证了 status variation、optional avatar fallback、部分 ProfileFacts 渲染，以及缺少 profile/social links 时整个 SocialLinks section 不输出。两位成员的页面都由 collection 静态生成且没有 hydration。

## Phase 3: Global Site Framework

Phase 3 加入正式的 global header/footer、由 `src/config/site.ts` 集中驱动的导航、无 JavaScript 的响应式 desktop/mobile navigation、共享 Breadcrumbs 与 PageHeader、按信息架构分组的首页，以及带 `noindex` 的 404 页面。所有正式站点框架组件均为 Astro，普通页面继续保持 zero hydration。

已执行 `npm install`、`npm run check`、`npm run build`，并检查生成的 HTML 与 canonical URL。锁文件中没有 Radix 包。

Phase 3 使用 ego-lite 在 1280×900 与 390×844 复核 Header、响应式导航、首页、Member index/detail、Breadcrumbs、Footer 与 404；页面没有横向溢出，原生 `<details>` 菜单可通过键盘操作。当前构建共 16 个静态页面，其中只有 `/lab/ui/` 包含 hydration。

Phase 3 未实现 Character、CMS、relations、搜索、动画或其他 Member 迁移。
