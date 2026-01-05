'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
}

// Generate a URL-friendly ID from heading text
function generateId(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff\s-]/g, '') // Keep Chinese characters, alphanumeric, spaces, hyphens
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Strip markdown syntax from text (links, bold, italic, code)
function stripMarkdown(text: string): string {
    return text
        // Remove markdown links: [text](url) -> text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove inline code: `code` -> code
        .replace(/`([^`]+)`/g, '$1')
        // Remove bold: **text** or __text__ -> text
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        // Remove italic: *text* or _text_ -> text
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/_([^_]+)_/g, '$1')
        .trim();
}

// Extract headings from markdown content
function extractHeadings(content: string): TocItem[] {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const rawText = match[2].trim();
        const text = stripMarkdown(rawText);
        const id = generateId(text);

        if (id && text) {
            headings.push({ id, text, level });
        }
    }

    return headings;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');
    const headings = extractHeadings(content);

    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-80px 0px -80% 0px',
                threshold: 0,
            }
        );

        // Observe all heading elements
        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            headings.forEach(({ id }) => {
                const element = document.getElementById(id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [headings]);

    if (headings.length === 0) {
        return null;
    }

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Account for any fixed headers
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
            setActiveId(id);
        }
    };

    return (
        <nav className={styles.toc}>
            <h4 className={styles.tocTitle}>目录</h4>
            <ul className={styles.tocList}>
                {headings.map(({ id, text, level }) => (
                    <li key={id} className={styles.tocItem} data-level={level}>
                        <a
                            href={`#${id}`}
                            className={`${styles.tocLink} ${activeId === id ? styles.tocLinkActive : ''}`}
                            onClick={(e) => handleClick(e, id)}
                        >
                            {text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
