'use client';

import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { formatDate, formatPostCount, formatReadingTime } from '@/lib/i18n';
import { useLanguage } from '@/components/LanguageProvider';
import styles from './page.module.css';

interface PostMeta {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    excerpt: string;
    readingTime: number;
}

interface HomePostsProps {
    posts: PostMeta[];
}

export default function HomePosts({ posts }: HomePostsProps) {
    const { language, t } = useLanguage();

    return (
        <div className="container">
            <header className={styles.intro}>
                <p className={styles.tagline}>{t('siteTagline')}</p>
                <p className={styles.introText}>{t('siteIntro')}</p>
            </header>

            <section className={styles.posts}>
                <div className={styles.postList}>
                    {posts.slice(0, 10).map((post, index) => (
                        <article
                            key={post.slug}
                            className={styles.postCard}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <Link href={`/posts/${post.slug}`} className={styles.postLink}>
                                <h3 className={styles.postTitle}>{post.title}</h3>
                                <p className={styles.postExcerpt}>{post.excerpt}</p>
                                <div className={styles.postMeta}>
                                    <span className={styles.metaItem}>
                                        <Calendar size={14} />
                                        {formatDate(post.date, language, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                    <span className={styles.metaItem}>
                                        <Clock size={14} />
                                        {formatReadingTime(post.readingTime, language)}
                                    </span>
                                </div>
                                {post.tags.length > 0 && (
                                    <div className={styles.postTags}>
                                        {post.tags.slice(0, 3).map((tag) => (
                                            <span key={tag} className="tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </Link>
                        </article>
                    ))}
                </div>

                {posts.length > 10 && (
                    <div className={styles.bottomAction}>
                        <Link href="/archive" className={styles.viewAllBottom}>
                            {t('viewAll')} ({formatPostCount(posts.length, language)}) <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}
