import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllSlugs, getAdjacentPosts } from '@/lib/posts';
import { Metadata } from 'next';
import { Calendar, Clock, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from './page.module.css';
import ScrollTopButton from './ScrollTopButton';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            tags: post.tags,
        },
    };
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    const { prev, next } = getAdjacentPosts(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="container">
            <article className={styles.article}>
                <header className={styles.header}>
                    <Link href="/" className={styles.backLink}>
                        <ArrowLeft size={16} />
                        返回首页
                    </Link>

                    <h1 className={styles.title}>{post.title}</h1>

                    <div className={styles.meta}>
                        <span className={styles.metaItem}>
                            <Calendar size={16} />
                            {new Date(post.date).toLocaleDateString('zh-CN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                        <span className={styles.metaItem}>
                            <Clock size={16} />
                            {post.readingTime} 分钟阅读
                        </span>
                    </div>

                    {post.tags.length > 0 && (
                        <div className={styles.tags}>
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/archive?tag=${encodeURIComponent(tag)}`}
                                    className="tag"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    )}
                </header>

                <div className={`prose ${styles.content}`}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight, rehypeRaw]}
                        components={{
                            img: ({ src, alt }) => {
                                // Handle relative image paths
                                const imgSrc = src?.startsWith('/') ? src : `/${src}`;
                                return (
                                    <img
                                        src={imgSrc}
                                        alt={alt || ''}
                                        loading="lazy"
                                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '0.5rem' }}
                                    />
                                );
                            },
                            a: ({ href, children }) => {
                                const isExternal = href?.startsWith('http');
                                return (
                                    <a
                                        href={href}
                                        target={isExternal ? '_blank' : undefined}
                                        rel={isExternal ? 'noopener noreferrer' : undefined}
                                    >
                                        {children}
                                    </a>
                                );
                            },
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

                <footer className={styles.footer}>
                    <nav className={styles.postNav}>
                        {prev ? (
                            <Link href={`/posts/${prev.slug}`} className={styles.navPrev}>
                                <ChevronLeft size={20} />
                                <div className={styles.navContent}>
                                    <span className={styles.navLabel}>上一篇</span>
                                    <span className={styles.navTitle}>{prev.title}</span>
                                </div>
                            </Link>
                        ) : (
                            <div className={styles.navPlaceholder} />
                        )}

                        {next ? (
                            <Link href={`/posts/${next.slug}`} className={styles.navNext}>
                                <div className={styles.navContent}>
                                    <span className={styles.navLabel}>下一篇</span>
                                    <span className={styles.navTitle}>{next.title}</span>
                                </div>
                                <ChevronRight size={20} />
                            </Link>
                        ) : (
                            <div className={styles.navPlaceholder} />
                        )}
                    </nav>

                    <div className={styles.footerActions}>
                        <Link href="/" className={styles.footerLink}>
                            <ArrowLeft size={16} />
                            返回首页
                        </Link>
                        <ScrollTopButton />
                    </div>
                </footer>
            </article>
        </div>
    );
}
