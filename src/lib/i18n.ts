export type Language = 'zh' | 'en';

export const defaultLanguage: Language = 'zh';

export const languageMeta: Record<
    Language,
    { htmlLang: string; locale: string; label: string; nextLabel: string }
> = {
    zh: {
        htmlLang: 'zh-CN',
        locale: 'zh-CN',
        label: '中文',
        nextLabel: 'English',
    },
    en: {
        htmlLang: 'en',
        locale: 'en-US',
        label: 'English',
        nextLabel: '中文',
    },
};

export const copy = {
    siteName: {
        zh: '多做多说',
        en: 'Do More Say More',
    },
    siteDescription: {
        zh: '技术与随笔的个人博客',
        en: 'A personal blog about technology and essays',
    },
    siteTagline: {
        zh: '文如其人，看文章就够了。',
        en: 'The person lives in the prose; the essays are enough.',
    },
    siteIntro: {
        zh: '写AI、系统、算法、诗、远方与日常。',
        en: 'On AI, systems, algorithms, poetry, the elsewhere, and the everyday.',
    },
    viewAll: {
        zh: '查看全部',
        en: 'View all',
    },
    archiveTitle: {
        zh: '归档',
        en: 'Archive',
    },
    archiveDescription: {
        zh: '所有文章按时间归档',
        en: 'All posts archived by date',
    },
    tagFilterLabel: {
        zh: '筛选标签',
        en: 'Filtered by tag',
    },
    clearFilter: {
        zh: '清除',
        en: 'Clear',
    },
    tags: {
        zh: '标签',
        en: 'Tags',
    },
    backHome: {
        zh: '返回首页',
        en: 'Back home',
    },
    previousPost: {
        zh: '上一篇',
        en: 'Previous',
    },
    nextPost: {
        zh: '下一篇',
        en: 'Next',
    },
    tableOfContents: {
        zh: '目录',
        en: 'Contents',
    },
    scrollTop: {
        zh: '回到顶部',
        en: 'Back to top',
    },
    toggleTheme: {
        zh: '切换明暗主题',
        en: 'Toggle color theme',
    },
    toggleLanguage: {
        zh: '切换到英文',
        en: 'Switch to Chinese',
    },
    copyrightSuffix: {
        zh: '保留所有权利。',
        en: 'All rights reserved.',
    },
    loading: {
        zh: '加载中...',
        en: 'Loading...',
    },
    postNotFound: {
        zh: '文章不存在',
        en: 'Post Not Found',
    },
} as const;

export type CopyKey = keyof typeof copy;

export function isLanguage(value: string | null): value is Language {
    return value === 'zh' || value === 'en';
}

export function getCopy(key: CopyKey, language: Language): string {
    return copy[key][language];
}

export function getLocale(language: Language): string {
    return languageMeta[language].locale;
}

export function formatDate(
    date: string,
    language: Language,
    options: Intl.DateTimeFormatOptions
): string {
    return new Date(date).toLocaleDateString(getLocale(language), options);
}

export function formatReadingTime(minutes: number, language: Language): string {
    if (language === 'zh') {
        return `${minutes} 分钟阅读`;
    }

    return `${minutes} min read`;
}

export function formatPostCount(count: number, language: Language): string {
    if (language === 'zh') {
        return `${count} 篇文章`;
    }

    return `${count} ${count === 1 ? 'post' : 'posts'}`;
}
