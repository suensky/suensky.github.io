import { getPostsByYear, getAllTags } from '@/lib/posts';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ArchiveClient from './ArchiveClient';

export const metadata: Metadata = {
    title: '归档',
    description: '所有文章按时间归档',
};

export default function ArchivePage() {
    const postsByYear = getPostsByYear().map(({ year, posts }) => ({
        year,
        posts: posts.map((p) => ({
            slug: p.slug,
            title: p.title,
            date: p.date,
            tags: p.tags,
        })),
    }));

    const tags = getAllTags();
    const totalPosts = postsByYear.reduce((acc, { posts }) => acc + posts.length, 0);

    return (
        <Suspense fallback={<div className="container" style={{ padding: '2rem 0' }}>Loading...</div>}>
            <ArchiveClient postsByYear={postsByYear} tags={tags} totalPosts={totalPosts} />
        </Suspense>
    );
}
