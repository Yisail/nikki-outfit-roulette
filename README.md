# Nikki Outfit Roulette / 暖暖换装轮盘

面向《无限暖暖》玩家的移动端换装灵感工具。V1.0 纯前端，无 API、后端或用户系统。

## 启动

发布工具链固定使用 Node.js 24 与 pnpm 11.25.0，依赖由 `pnpm-lock.yaml` 锁定。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
pnpm preview
```

构建输出为 `dist/`，可以直接托管在静态服务器。页面采用 hash 路由，例如 `/#/category/color`，静态托管无需配置路由回退。Vite 默认使用 `base: './'`，构建后的资源使用相对路径，可直接部署到 GitHub Pages 仓库子目录，无需修改仓库名称配置。

GitHub Pages 发布步骤见 [RELEASING.md](RELEASING.md)。推送到 `main` 后，工作流将安装锁定依赖、运行测试和构建、检查静态资源并部署 `dist`。

## 核心模块

- `src/config/categories.ts`：分类和稳定词条 ID，颜色附带可选色块。
- `src/core/random.ts`：通用随机引擎，支持抽取 N 项和禁止重复，非重复模式使用部分 Fisher–Yates 洗牌。
- `src/storage/selectionStorage.ts`：版本化本地存储、无效数据清理及保存失败处理。
- `src/App.tsx`：draft/final 状态及轻量 hash 路由。
- `src/pages/`：Home、通用 CategoryPage 和 Result。
- `src/components/SlotMachine.tsx`：通用 CSS transform 槽位动画，展示引擎预先确定的结果，多槽错开停止。

进入分类后，随机结果为页面内临时状态。只有“使用这个结果”才更新 draft；普通返回不会覆盖已确认结果。抽取数量立即保存。完成时深复制 draft 为 final，结果页刷新可恢复；从结果页离开时（包括浏览器返回）清空本轮，开始新一轮。draft、final、模式结果和各分类数量均持久化；损坏或过时 ID 会被过滤。

首页支持单分类重置和全部重置。单分类重置删除该分类的确认结果与全部模式缓存，保留其他分类和抽取数量；分类页的“重置”执行相同清理，同时停止槽位动画、清空临时结果并留在分类页。全部重置及从结果页返回会清空 draft、final、全部模式缓存，恢复默认抽取数量，并移除本轮 localStorage 条目。状态与缓存通过统一提交函数同步更新，保存失败时页面会提示。

## 添加分类与词条

在 `src/config/categories.ts` 的 `categories` 数组增加配置即可。为分类和词条使用稳定且唯一的 ID，配置名称、说明、图标、默认/最小/最大数量、是否允许重复及 options。无需增加页面或路由。

给现有分类增加词条，只需在对应 `options` 中增加 `{ id: 'stable-id', label: '显示名称' }`；可选 `swatch` 用于色块。游戏标签已按用户提供的图片录入 30 个词条。删除词条后，下次读取本地存储会清理失效选择。修改展示 label 不影响保存的 ID。

请确保非空词池、数量范围为正整数，默认数量在范围内；禁止重复时最大数量不超过词池长度。

## 后续版本

风格现包含 31 个词，支持单风格与双风格。两种模式的已确认结果保存在 `modeSelections` 中，切换模式仅恢复该模式的确认结果；点击“使用这个结果”后才更新首页的 draft。双风格不区分主次，可整体重抽或单槽重抽，单槽重抽排除另一槽的词。重置分类会同时清除它的模式保存数据。场景包含 14 个词，可独立确认并参与最终挑战。

finalSelection 为 `Record<string, string[]>`，仅包含分类 ID 和词条 ID，可作为后续衣服查询条件。当前未实现衣服数据库、自动 Outfit、后端、登录、云同步、AI、兼容规则、权重、历史、收藏、分享或管理后台。结果页仅展示未来随机搭配功能的说明。
