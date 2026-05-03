import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
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
    return (
        <div className="container">
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
                                        {new Date(post.date).toLocaleDateString(
                                            'zh-CN',
                                            {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            }
                                        )}
                                    </span>
                                    <span className={styles.metaItem}>
                                        <Clock size={14} />
                                        {post.readingTime} 分钟阅读
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
                            查看全部 ({posts.length} 篇文章) <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}
