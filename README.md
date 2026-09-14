# 骑龙 QILONG · 冒险者资料库

一个零依赖的静态资料站首版，适合直接部署到 Vercel、Netlify 或 GitHub Pages。

骑龙内部信息汇总。

## 本地预览

```bash
npm run dev
```

打开 <http://localhost:4173>。

服务器绑定在 `0.0.0.0`，同一局域网内的其他设备也可以通过你的电脑局域网地址访问，例如：

```text
http://你的局域网IP:4173
```

## 发布到公网

### Vercel

1. 将项目推送到 GitHub。
2. 在 Vercel 中导入这个仓库。
3. Framework 选择 `Other`。
4. Build Command 留空，Output Directory 填 `/` 或留空。
5. 点击 Deploy。

### Netlify

1. 将项目推送到 GitHub。
2. 在 Netlify 中选择 `Add new project` → `Import an existing project`。
3. Build command 留空，Publish directory 填 `.`。
4. 点击 Deploy。

### GitHub Pages

这个项目的 `index.html` 已经可以直接作为静态入口。把仓库推送到 GitHub 后，在仓库的 `Settings` → `Pages` 中选择从主分支根目录发布即可。

## 编辑正式资料

正式条目放在 `app.js` 顶部的 `entries` 数组中。每条数据包含：

- `category`：武器、特殊效果词条、装备、书籍、法术、祷告、道具、战斗技巧或地图
- `name`：条目名称
- `subtitle`：副标题和类型
- `rarity`：传说、史诗、稀有或普通
- `meta`：基础数值或使用条件
- `tags`：搜索标签
- `description`：详情描述

首屏背景使用公开可访问的 Unsplash 图片地址，正式发布时也可以替换成你自己的世界观插画或游戏截图。
