import { getAllPosts } from '@/lib/posts';
import { Metadata } from 'next';
import AdminClient from './AdminClient';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: '内容管理',
    description: '管理博客文章',
};

// In production, redirect away from admin
const isProduction = process.env.NODE_ENV === 'production';

export default function AdminPage() {
    // In production build, show a "not available" message
    if (isProduction) {
        return (
            <div className="container" style={{
                textAlign: 'center',
                paddingTop: '4rem',
                paddingBottom: '4rem'
            }}>
                <h1 style={{ marginBottom: '1rem' }}>Admin Portal</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>
                    The admin portal is only available in development mode.
                </p>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem' }}>
                    Run <code style={{
                        backgroundColor: 'var(--color-bg-tertiary)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px'
                    }}>npm run dev</code> locally to access the admin portal.
                </p>
            </div>
        );
    }

    const posts = getAllPosts().map((post) => ({
        slug: post.slug,
        title: post.title,
        date: post.date,
        tags: post.tags,
    }));

    return <AdminClient posts={posts} />;
}
