# V1.0 发布与 GitHub Pages

## 发布配置

- 版本：`1.0.0`，首页展示 V1.0；本地存储键保持原有 `v1` 数据格式，保留用户已确认结果。
- 工具链：Node.js 24、pnpm 11.25.0。先安装此版本 pnpm，然后运行 `pnpm install --frozen-lockfile`。
- 构建：`pnpm test`、`pnpm build`、`node tests/build.test.mjs`。
- 输出：`dist/`，全站为静态 HTML、CSS、JS，不需要开发服务器、API 或数据库。
- 资源：Vite `base: './'`；hash 路由适配 `/仓库名/#/category/color`，无需 SPA 回退规则。
- 工作流：`.github/workflows/deploy-pages.yml`，推送 `main` 自动部署，也可手动运行；其他分支不发布。
- 部署权限仅授予 deploy job 的 `pages: write`、`id-token: write`，无需个人访问令牌。

## 首次关联仓库

当前交付目录尚未初始化 Git，也未绑定远程仓库。建议在 GitHub 创建空的公开仓库，例如 `nikki-outfit-roulette`，然后在项目目录执行（替换用户名和仓库名）：

```sh
git init -b main
git add .
git commit -m "Prepare V1.0 and GitHub Pages deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

`.gitignore` 会排除 `node_modules`、`dist`、本地 pnpm 缓存和测试截图。源码、配置、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、工作流和文档需要提交。若采用现有仓库，请按其当前 Git 状态提交，不重复初始化。

## GitHub 仓库设置

1. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**，不要选择 Deploy from a branch。
2. 若 Actions 被禁用，在 **Settings → Actions → General** 启用 GitHub Actions，并允许本工作流使用的 GitHub 官方及 pnpm actions。
3. 推送 `git push -u origin main`。如果第一次推送发生在启用 Pages 之前，完成设置后可在 **Actions → Deploy GitHub Pages → Run workflow** 选择 `main` 重跑。
4. 在 **Actions** 查看 build 和 deploy 两个任务都成功。若 `github-pages` 环境设置了人工审核，需要在该环境批准部署。
5. 最终访问地址见 **Settings → Pages → Visit site**，或成功工作流的 **deploy / github-pages** 环境链接。部署输出使用官方 `page_url`，以该地址为准。

普通仓库的地址格式：`https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`。例如仓库名为 `nikki-outfit-roulette` 时，路径为 `/nikki-outfit-roulette/`。用户/组织站点仓库及自定义域名的 URL 可能不同。当前未创建远程仓库、推送或执行线上部署，因此尚无真实线上地址。

## 本地生产验收

```sh
pnpm test
pnpm build
node tests/build.test.mjs
node tests/static-server.mjs
```

最后一条命令仅读取 `dist`，挂载在 `http://127.0.0.1:4173/nikki-outfit-roulette/`，用于真实仓库子路径验证；不使用 Vite 开发服务或源文件。普通本地生产预览也可使用 `pnpm preview`。

浏览器验收脚本为 `tests/browser.mjs` 和 `tests/reset-browser.mjs`，使用外部可用的 Playwright 和浏览器，不增加应用运行依赖。设置 `NIKKI_TEST_RUNTIME` 为包含 Playwright 的 node_modules 目录、`NIKKI_TEST_BROWSER` 为浏览器可执行文件、`NIKKI_TEST_URL` 为上述生产子路径后，分别用 Node 执行这两个脚本。工作流自动执行单元测试与静态产物检查，浏览器验收为本地发布检查。

覆盖：手机/桌面布局、单色/双色、单/双风格及单槽重抽、场景和游戏标签入口、确认与未确认返回、刷新及重新打开缓存、首页单项/全部重置、分类页重置及动画中重置、完成后结果恢复，以及结果页返回后的全轮清理和前进防恢复。生产检查还确认 JS/CSS 资源在仓库子路径内加载，不请求开发入口或外部服务。

GitHub Pages 设置参考：[GitHub 官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
