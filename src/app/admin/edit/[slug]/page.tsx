import { getAllSlugs, getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import EditPageClient from './EditPageClient';

export function generateStaticParams() {
    const slugs = getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function EditPage({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <EditPageClient
            initialData={{
                title: post.title,
                content: post.content,
                tags: post.tags,
                categories: post.categories,
                date: post.date,
            }}
        />
    );
}
