import { getAllPosts } from '@/lib/posts';
import HomePosts from './HomePosts';

export default function HomePage() {
    const posts = getAllPosts().map((post) => ({
        slug: post.slug,
        title: post.title,
        date: post.date,
        tags: post.tags,
        excerpt: post.excerpt,
        readingTime: post.readingTime,
    }));

    return <HomePosts posts={posts} />;
}
