'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Edit, Search, Calendar, FileText } from 'lucide-react';
import styles from './page.module.css';

interface PostMeta {
    slug: string;
    title: string;
    date: string;
    tags: string[];
}

// Posts data is embedded at build time via the parent page
interface AdminClientProps {
    posts: PostMeta[];
}

export default function AdminClient({ posts }: AdminClientProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = useMemo(() => {
        if (!searchQuery) return posts;
        const query = searchQuery.toLowerCase();
        return posts.filter(
            (post) =>
                post.title.toLowerCase().includes(query) ||
                post.tags.some((tag) => tag.toLowerCase().includes(query))
        );
    }, [posts, searchQuery]);

    return (
        <div className={`container ${styles.admin}`}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>内容管理</h1>
                    <p className={styles.subtitle}>管理您的博客文章</p>
                </div>
                <Link href="/admin/new" className="btn btn-primary">
                    <Plus size={18} />
                    新建文章
                </Link>
            </div>

            <div className={styles.searchBar}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="搜索文章标题或标签..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <FileText size={24} />
                    <div>
                        <span className={styles.statNumber}>{posts.length}</span>
                        <span className={styles.statLabel}>篇文章</span>
                    </div>
                </div>
            </div>

            <div className={styles.postList}>
                {filteredPosts.length === 0 ? (
                    <div className={styles.empty}>
                        <p>没有找到匹配的文章</p>
                    </div>
                ) : (
                    filteredPosts.map((post) => (
                        <div key={post.slug} className={styles.postItem}>
                            <div className={styles.postInfo}>
                                <h3 className={styles.postTitle}>{post.title}</h3>
                                <div className={styles.postMeta}>
                                    <span className={styles.metaItem}>
                                        <Calendar size={14} />
                                        {new Date(post.date).toLocaleDateString('zh-CN')}
                                    </span>
                                    {post.tags.length > 0 && (
                                        <span className={styles.tags}>
                                            {post.tags.slice(0, 3).join(', ')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className={styles.postActions}>
                                <Link
                                    href={`/admin/edit/${post.slug}`}
                                    className="btn btn-secondary"
                                >
                                    <Edit size={16} />
                                    编辑
                                </Link>
                                <Link
                                    href={`/posts/${post.slug}`}
                                    className="btn btn-ghost"
                                    target="_blank"
                                >
                                    预览
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className={styles.note}>
                <p>
                    <strong>提示：</strong> 在编辑器中修改文章后，点击下载按钮保存 .md 文件，然后手动替换 content/posts 目录中的文件并提交到 Git。
                </p>
            </div>
        </div>
    );
}
