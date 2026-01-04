'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Eye, Edit2, Download } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import styles from '../../editor.module.css';

interface PostData {
    title: string;
    content: string;
    tags: string[];
    categories: string[];
    date: string;
}

interface EditPageClientProps {
    initialData: PostData;
}

export default function EditPageClient({ initialData }: EditPageClientProps) {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;
    const [title, setTitle] = useState(initialData.title);
    const [content, setContent] = useState(initialData.content);
    const [tags, setTags] = useState(initialData.tags.join(', '));
    const [categories, setCategories] = useState(initialData.categories.join(', '));
    const [date] = useState(initialData.date);
    const [showPreview, setShowPreview] = useState(false);

    const generateFrontmatter = useCallback(() => {
        const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
        const catsArray = categories.split(',').map((c) => c.trim()).filter(Boolean);
        const dateStr = date || new Date().toISOString().replace('T', ' ').slice(0, 19);

        return `---
title: ${title}
tags:
${tagsArray.map((t) => `- ${t}`).join('\n') || '- 未分类'}
categories:
${catsArray.map((c) => `- ${c}`).join('\n') || '- 未分类'}
date: ${dateStr}
---

${content}`;
    }, [title, tags, categories, date, content]);

    const handleDownload = useCallback(() => {
        const markdown = generateFrontmatter();
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slug}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('文件已下载！请将其保存到 content/posts 目录替换原文件，然后提交到 Git。');
    }, [generateFrontmatter, slug]);

    return (
        <div className={styles.editor}>
            <header className={styles.header}>
                <Link href="/admin" className={styles.backLink}>
                    <ArrowLeft size={16} />
                    返回管理
                </Link>
                <div className={styles.headerActions}>
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="btn btn-secondary"
                    >
                        {showPreview ? <Edit2 size={16} /> : <Eye size={16} />}
                        {showPreview ? '编辑' : '预览'}
                    </button>
                    <button onClick={handleDownload} className="btn btn-primary">
                        <Download size={16} />
                        下载保存
                    </button>
                </div>
            </header>

            <div className={styles.content}>
                <div className={styles.sidebar}>
                    <div className={styles.field}>
                        <label className={styles.label}>标题</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="输入文章标题..."
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>标签（逗号分隔）</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="技术, 随笔"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>分类（逗号分隔）</label>
                        <input
                            type="text"
                            value={categories}
                            onChange={(e) => setCategories(e.target.value)}
                            placeholder="技术文章"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>文件名</label>
                        <code className={styles.slug}>{slug}.md</code>
                    </div>
                </div>

                <div className={styles.main}>
                    {showPreview ? (
                        <div className={`prose ${styles.preview}`}>
                            <h1>{title || '无标题'}</h1>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="使用 Markdown 编写文章内容..."
                            className={styles.textarea}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
