import { getPostsByYear, getAllTags } from '@/lib/posts';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ArchiveClient from './ArchiveClient';
import { copy } from '@/lib/i18n';

export const metadata: Metadata = {
    title: `${copy.archiveTitle.zh} / ${copy.archiveTitle.en}`,
    description: `${copy.archiveDescription.zh} / ${copy.archiveDescription.en}`,
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

    return (
        <Suspense fallback={<div className="container" style={{ padding: '2rem 0' }}>{copy.loading.zh}</div>}>
            <ArchiveClient postsByYear={postsByYear} tags={tags} />
        </Suspense>
    );
}
