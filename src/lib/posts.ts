import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostMeta {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    categories: string[];
    image?: string;
    excerpt: string;
    readingTime: number;
}

export interface Post extends PostMeta {
    content: string;
}

function calculateReadingTime(content: string): number {
    // Average reading speed: 200 words/min for English, 300 chars/min for Chinese
    const words = content.split(/\s+/).length;
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = words - Math.floor(chineseChars / 2);

    const time = Math.ceil((englishWords / 200) + (chineseChars / 300));
    return Math.max(1, time);
}

function extractExcerpt(content: string, length: number = 150): string {
    // Remove markdown formatting
    const plainText = content
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
        .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/[*_`]/g, '') // Remove bold/italic/code
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .trim();

    if (plainText.length <= length) return plainText;
    return plainText.slice(0, length).trim() + '...';
}

export function getAllPosts(): PostMeta[] {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPosts = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                title: data.title || slug,
                date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
                tags: data.tags || [],
                categories: data.categories || [],
                image: data.image,
                excerpt: extractExcerpt(content),
                readingTime: calculateReadingTime(content),
            };
        });

    // Sort by date descending
    return allPosts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export function getPostBySlug(slug: string): Post | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            title: data.title || slug,
            date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
            tags: data.tags || [],
            categories: data.categories || [],
            image: data.image,
            excerpt: extractExcerpt(content),
            readingTime: calculateReadingTime(content),
            content,
        };
    } catch {
        return null;
    }
}

export function getAllTags(): { name: string; count: number }[] {
    const posts = getAllPosts();
    const tagCounts: Record<string, number> = {};

    posts.forEach((post) => {
        post.tags.forEach((tag) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    return Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): PostMeta[] {
    return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getPostsByYear(): { year: string; posts: PostMeta[] }[] {
    const posts = getAllPosts();
    const grouped: Record<string, PostMeta[]> = {};

    posts.forEach((post) => {
        const year = new Date(post.date).getFullYear().toString();
        if (!grouped[year]) {
            grouped[year] = [];
        }
        grouped[year].push(post);
    });

    return Object.entries(grouped)
        .map(([year, posts]) => ({ year, posts }))
        .sort((a, b) => parseInt(b.year) - parseInt(a.year));
}

export function getAllSlugs(): string[] {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    return fs.readdirSync(postsDirectory)
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => fileName.replace(/\.md$/, ''));
}

export interface AdjacentPosts {
    prev: { slug: string; title: string } | null;
    next: { slug: string; title: string } | null;
}

export function getAdjacentPosts(currentSlug: string): AdjacentPosts {
    const posts = getAllPosts();
    const currentIndex = posts.findIndex((post) => post.slug === currentSlug);

    if (currentIndex === -1) {
        return { prev: null, next: null };
    }

    // Posts are sorted by date descending, so:
    // prev = newer post (index - 1)
    // next = older post (index + 1)
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    return {
        prev: prevPost ? { slug: prevPost.slug, title: prevPost.title } : null,
        next: nextPost ? { slug: nextPost.slug, title: nextPost.title } : null,
    };
}
