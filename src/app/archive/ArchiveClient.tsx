'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { formatDate, formatPostCount } from '@/lib/i18n';
import { useLanguage } from '@/components/LanguageProvider';
import styles from './page.module.css';

interface PostMeta {
    slug: string;
    title: string;
    date: string;
    tags: string[];
}

interface TagInfo {
    name: string;
    count: number;
}

interface YearGroup {
    year: string;
    posts: PostMeta[];
}

interface ArchiveClientProps {
    postsByYear: YearGroup[];
    tags: TagInfo[];
}

export default function ArchiveClient({ postsByYear, tags }: ArchiveClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { language, t } = useLanguage();

    // Get initial tag from URL query parameter
    const initialTag = searchParams.get('tag');
    const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);

    // Update selected tag when URL changes
    useEffect(() => {
        const tagFromUrl = searchParams.get('tag');
        setSelectedTag(tagFromUrl);
    }, [searchParams]);

    // Handle tag selection
    const handleTagClick = (tagName: string) => {
        if (selectedTag === tagName) {
            // Deselect - remove query param
            router.push('/archive', { scroll: false });
            setSelectedTag(null);
        } else {
            // Select - add query param
            router.push(`/archive?tag=${encodeURIComponent(tagName)}`, { scroll: false });
            setSelectedTag(tagName);
        }
    };

    // Clear filter
    const clearFilter = () => {
        router.push('/archive', { scroll: false });
        setSelectedTag(null);
    };

    // Filter posts by selected tag
    const filteredPostsByYear = selectedTag
        ? postsByYear
            .map(({ year, posts }) => ({
                year,
                posts: posts.filter((post) => post.tags.includes(selectedTag)),
            }))
            .filter(({ posts }) => posts.length > 0)
        : postsByYear;

    const filteredCount = filteredPostsByYear.reduce(
        (acc, { posts }) => acc + posts.length,
        0
    );

    return (
        <div className={`container ${styles.archiveLayout}`}>
            <div className={styles.mainContent}>
                {selectedTag && (
                    <div className={styles.filterBanner}>
                        <span>
                            {t('tagFilterLabel')}:{' '}
                            <strong>{selectedTag}</strong>
                            {' '}({formatPostCount(filteredCount, language)})
                        </span>
                        <button
                            onClick={clearFilter}
                            className={styles.clearFilter}
                            aria-label={t('clearFilter')}
                        >
                            <X size={16} />
                            {t('clearFilter')}
                        </button>
                    </div>
                )}

                <div className={styles.timeline}>
                    {filteredPostsByYear.map(({ year, posts }) => (
                        <section key={year} className={styles.yearSection}>
                            <h2 className={styles.yearTitle}>{year}</h2>
                            <div className={styles.postList}>
                                {posts.map((post) => (
                                    <article key={post.slug} className={styles.postItem}>
                                        <time className={styles.postDate}>
                                            {formatDate(post.date, language, {
                                                month: '2-digit',
                                                day: '2-digit',
                                            })}
                                        </time>
                                        <Link href={`/posts/${post.slug}`} className={styles.postTitle}>
                                            {post.title}
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            <aside className={styles.sidebar}>
                <div className={styles.tagsSection}>
                    <h3 className={styles.sidebarTitle}>{t('tags')}</h3>
                    <div className={styles.tagCloud}>
                        {tags.map((tag) => (
                            <button
                                key={tag.name}
                                onClick={() => handleTagClick(tag.name)}
                                className={`${styles.tagItem} ${selectedTag === tag.name ? styles.tagActive : ''}`}
                            >
                                {tag.name}
                                <span className={styles.tagCount}>{tag.count}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    );
}
