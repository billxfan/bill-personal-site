# bill personal site

一个更纯粹的个人站首版，展示简介、标签、当前关注、项目、过往经历、阅读和联系方式

## 页面

- `index.html`：首页总览

## 本地预览

直接打开 `index.html` 即可，也可以启动本地服务器：

```bash
python3 -m http.server 8000
```

## 部署

推荐直接用 `Vercel` 或 `Netlify` 部署这个静态站：

1. 把整个目录推到 GitHub。
2. 在 Vercel/Netlify 导入仓库。
3. 构建命令留空，发布目录用仓库根目录。
4. `robots.txt` 和 `sitemap.xml` 会根据实际域名动态生成，不用手工改。

当前仓库已经补好了基础部署配置：

- `vercel.json`
- `netlify.toml`
- 动态 `robots.txt`
- 动态 `sitemap.xml`

## 后续替换

当前内容是结构化占位，等待替换为真实资料：

- 真实联系方式
- 微信读书完整书架和笔记数据
- 项目上线链接
