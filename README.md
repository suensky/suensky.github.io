# Modern Blog with Admin Portal

A minimalist, modern blog built with Next.js featuring:

- 🎨 **Minimalist Design** - Clean, modern UI with dark/light mode
- ✍️ **Admin Portal** - Built-in content management with Markdown editor (development only)
- 📱 **Responsive** - Works on all devices
- ⚡ **Fast** - Static export for optimal performance
- 🔍 **SEO Optimized** - Proper meta tags and semantic HTML

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000 for the blog, http://localhost:3000/admin for the admin portal.

> **Note:** The admin portal is only available during local development. It is disabled in production builds for security.

## Writing Posts

1. Run `npm run dev` to start the development server
2. Go to http://localhost:3000/admin
3. Click "新建文章" to create a new post
4. Write in Markdown with live preview
5. Click "下载保存" to download the .md file
6. Save it to `content/posts/` and commit to Git

Posts are stored in `content/posts/` as Markdown files with frontmatter.

## Deployment

The blog auto-deploys to GitHub Pages on push to the `hugo` branch.

```bash
# Build for production
npm run build
```

## License

MIT
