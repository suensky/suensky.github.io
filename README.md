# 多做多说 Blog

A minimalist personal blog built with Next.js and Markdown.

- **Markdown-first writing** - Posts live in `content/posts/`
- **Static export** - GitHub Pages serves the generated `out/` directory
- **Responsive design** - Works on desktop and mobile
- **Dark/light theme** - Includes a manual theme toggle
- **SEO metadata** - Blog and post pages include basic metadata

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000 for the blog.

## Writing Posts

Create a Markdown file in `content/posts/` with frontmatter:

```markdown
---
title: 文章标题
tags:
  - 随笔
date: 2026-05-03 10:00:00
---

正文内容
```

Posts are stored in `content/posts/` as Markdown files with frontmatter.
Post images should live under `public/img/` and be referenced from Markdown as `/img/example.png`.

## Deployment

The blog auto-deploys to GitHub Pages on push to the `blog` branch.

```bash
# Build for production
npm run build
```

## License

MIT
