'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Edit2, Download } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import styles from '../editor.module.css';

export default function NewPostPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [categories, setCategories] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const generateSlug = useCallback(() => {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const titleSlug = title
            .toLowerCase()
            .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .slice(0, 50);
        return `${dateStr}-${titleSlug || 'untitled'}`;
    }, [title]);

    const generateFrontmatter = useCallback(() => {
        const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
        const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
        const catsArray = categories.split(',').map((c) => c.trim()).filter(Boolean);

        return `---
title: ${title}
tags:
${tagsArray.map((t) => `- ${t}`).join('\n') || '- 未分类'}
categories:
${catsArray.map((c) => `- ${c}`).join('\n') || '- 未分类'}
date: ${now}
---

${content}`;
    }, [title, tags, categories, content]);

    const handleDownload = useCallback(() => {
        const markdown = generateFrontmatter();
        const slug = generateSlug();
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slug}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('文件已下载！请将其保存到 content/posts 目录，然后提交到 Git。');
    }, [generateFrontmatter, generateSlug]);

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
                        <code className={styles.slug}>{generateSlug()}.md</code>
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
