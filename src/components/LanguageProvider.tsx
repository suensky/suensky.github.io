'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'zh' | 'en';

interface Translations {
    // Navigation
    home: string;
    archive: string;
    tags: string;
    admin: string;

    // Homepage
    latestPosts: string;
    viewAll: string;
    viewAllPosts: string;
    minRead: string;

    // Archive
    archiveTitle: string;
    totalPosts: string;

    // Tags
    tagsTitle: string;
    totalTags: string;

    // Post
    backToHome: string;
    scrollToTop: string;

    // Footer
    copyright: string;

    // Tag page
    tagLabel: string;
    postsCount: string;
    allTags: string;
}

const translations: Record<Language, Translations> = {
    zh: {
        home: '主页',
        archive: '归档',
        tags: '标签',
        admin: '管理',
        latestPosts: '最新文章',
        viewAll: '查看全部',
        viewAllPosts: '查看全部 ({count} 篇文章)',
        minRead: '{time} 分钟阅读',
        archiveTitle: '归档',
        totalPosts: '共 {count} 篇文章',
        tagsTitle: '标签',
        totalTags: '共 {count} 个标签',
        backToHome: '返回首页',
        scrollToTop: '回到顶部',
        copyright: '© {year} 多做多说. All rights reserved.',
        tagLabel: '标签:',
        postsCount: '共 {count} 篇文章',
        allTags: '所有标签',
    },
    en: {
        home: 'Home',
        archive: 'Archive',
        tags: 'Tags',
        admin: 'Admin',
        latestPosts: 'Latest Posts',
        viewAll: 'View All',
        viewAllPosts: 'View All ({count} posts)',
        minRead: '{time} min read',
        archiveTitle: 'Archive',
        totalPosts: '{count} posts total',
        tagsTitle: 'Tags',
        totalTags: '{count} tags',
        backToHome: 'Back to Home',
        scrollToTop: 'Scroll to Top',
        copyright: '© {year} Duozuoduoshuo. All rights reserved.',
        tagLabel: 'Tag:',
        postsCount: '{count} posts',
        allTags: 'All Tags',
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof Translations, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('zh');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('language') as Language;
        if (saved && (saved === 'zh' || saved === 'en')) {
            setLanguageState(saved);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('language', language);
        }
    }, [language, mounted]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = (key: keyof Translations, vars?: Record<string, string | number>): string => {
        let text = translations[language][key];
        if (vars) {
            Object.entries(vars).forEach(([k, v]) => {
                text = text.replace(`{${k}}`, String(v));
            });
        }
        return text;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        // Return default values for SSR
        return {
            language: 'zh' as Language,
            setLanguage: () => { },
            t: (key: keyof Translations, vars?: Record<string, string | number>): string => {
                let text = translations.zh[key];
                if (vars) {
                    Object.entries(vars).forEach(([k, v]) => {
                        text = text.replace(`{${k}}`, String(v));
                    });
                }
                return text;
            },
        };
    }
    return context;
}
