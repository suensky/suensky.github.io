'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import {
    CopyKey,
    Language,
    defaultLanguage,
    getCopy,
    getLocale,
    isLanguage,
    languageMeta,
} from '@/lib/i18n';

interface LanguageContextType {
    language: Language;
    locale: string;
    setLanguage: (language: Language) => void;
    toggleLanguage: () => void;
    t: (key: CopyKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(defaultLanguage);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('language');
        if (isLanguage(saved)) {
            setLanguage(saved);
        }

        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        localStorage.setItem('language', language);
        document.documentElement.lang = languageMeta[language].htmlLang;
    }, [language, mounted]);

    const value = useMemo(
        () => ({
            language,
            locale: getLocale(language),
            setLanguage,
            toggleLanguage: () => {
                setLanguage((current) => (current === 'zh' ? 'en' : 'zh'));
            },
            t: (key: CopyKey) => getCopy(key, language),
        }),
        [language]
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }

    return context;
}
