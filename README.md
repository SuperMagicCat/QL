# 骑龙 QILONG · 冒险者资料库

一个零依赖的静态资料站，适合直接部署到 Netlify 或 GitHub Pages。

骑龙内部信息汇总。

## 本地预览

```bash
npm run dev
```

打开 <http://127.0.0.1:4173>。

服务器默认只绑定本机，因为写入接口可以修改资料并执行 Git 推送。

```text
http://127.0.0.1:4173
```

## 使用资料写入器

打开：

<http://127.0.0.1:4173/writer>

在写入器里选择分类，填写名称和详细内容，然后：

- 点击“保存到本地”：只更新 `data/entries.json`
- 点击“保存并推送 Git”：更新资料、创建 Git 提交并推送到 `origin/main`

推送成功后，已连接 GitHub 仓库的静态托管平台会自动重新部署。写入器只允许本机访问，不应把本地服务器暴露到公网。

正式条目放在 `data/entries.json` 中。每条数据包含：

- `category`：武器、特殊效果词条、装备、书籍、法术、祷告、道具、战斗技巧、地图、机制或挑战
- `name`：条目名称
- `subtitle`：副标题和类型
- `meta`：卡片底部信息
- `tags`：搜索标签
- `description`：详情描述

## 发布到公网

### Netlify

1. 将项目推送到 GitHub。
2. 在 Netlify 中选择 `Add new project` → `Import an existing project`。
3. Build command 留空，Publish directory 填 `.`。
4. 点击 Deploy。

### GitHub Pages

这个项目的 `index.html` 已经可以直接作为静态入口。把仓库推送到 GitHub 后，在仓库的 `Settings` → `Pages` 中选择从主分支根目录发布即可。
