---
description: Write a teaching-style blog article about a topic into the Obsidian vault for learning
argument-hint: '<topic> [ai|aws|dev]'
---

把「$1」写成一篇教程风格的博客文章，存入本项目 Obsidian vault（content/，vault id `blog`）。

## 写作要求（教学最佳实践）

- **结构**：为什么重要（动机）→ 核心概念 → 最小可运行示例 → 常见误区 → 延伸阅读。用动机开头，不要罗列定义。
- **风格**（对齐本站）：实用模板优先、不写空泛概念；明确写出工程取舍；从想法到实现走最短路径；信息密度高，不注水。
- **准确**：技术细节必须正确；延伸阅读只放广为人知的官方文档链接（如 MDN、GNU/Open Group、GitHub 官方仓库），不要编造 URL。
- **语言**：中文正文，代码/命令/术语保留英文。
- **篇幅**：按主题深度适中（可学习、可发布级别），若质量不足以发布则主动说明缺什么。

## 存放规则

- **section 选择**：目录参数 = 「${2:-auto}」。若为 `auto`（未指定）：按主题判断——AI/提示词 → `ai/`，AWS/云 → `aws/`，其他（CSS、工具、语言、工程实践…）→ `dev/`（CSS 教程是手写交互区，不以 vault 内容存放）；若为具体名字：把它作为**任意 vault 目录名**直接使用（`content/<参数>/`，例如 `content/kubernetes/`；目录不存在时由 MCP `create_note` 自动创建）。
- **文件名**：kebab-case slug：`content/<section>/<slug>.md`（无日期前缀）。
- **frontmatter**（notes skill 契约）：
  ```yaml
  ---
  title: <中文标题>
  description: <一句话摘要，用于 meta 与 TOC>
  order: 99
  draft: true
  tags: [<3-5 个主题标签>]
  created: <今天 YYYY-MM-DD>
  updated: <今天 YYYY-MM-DD>
  ---
  ```
- **写入方式**：用 `obsidian` MCP（`obsidian_create_note`，vault `blog`，路径如 `dev/xxx.md`），不要用本地 write 绕过。

## 完成后

- 汇报：文件路径 + 3 行以内的学习要点导读 + 该主题若发布建议的 section；若使用了非 ai/aws/dev 的目录，额外提醒：它将成为新的站点 section，发布时需同步首页目录与终端 profile（见 AGENTS.md 的目录/路由契约）。
- 提醒用户：满意后去掉 `draft: true` → 运行 `npm run content:sync` → 走 content-update/review 流程发布；在用户明确确认前不要改 draft、不要提交、不要 sync。
