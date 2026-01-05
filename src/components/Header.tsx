'use client';

import Link from 'next/link';
import { Sun, Moon, Globe, Settings } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import { useState } from 'react';
import styles from './Header.module.css';

// Only show admin link in development
const isDev = process.env.NODE_ENV === 'development';

export default function Header() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const { language, setLanguage, t } = useLanguage();

    // Use theme from context if available
    let themeContext: { theme: 'light' | 'dark'; toggleTheme: () => void } | null = null;
    try {
        themeContext = useTheme();
    } catch {
        // ThemeProvider not available during SSR
    }

    const currentTheme = themeContext?.theme || theme;
    const toggleTheme = themeContext?.toggleTheme || (() => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    });

    const toggleLanguage = () => {
        setLanguage(language === 'zh' ? 'en' : 'zh');
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerInner}`}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoText}>多做多说</span>
                </Link>

                <div className={styles.actions}>
                    <button
                        onClick={toggleLanguage}
                        className={styles.langToggle}
                        aria-label="Toggle language"
                        title={language === 'zh' ? 'Switch to English' : '切换到中文'}
                    >
                        <Globe size={18} />
                        <span className={styles.langLabel}>{language === 'zh' ? 'EN' : '中'}</span>
                    </button>

                    <button
                        onClick={toggleTheme}
                        className={styles.themeToggle}
                        aria-label="Toggle theme"
                    >
                        {currentTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    {isDev && (
                        <Link
                            href="/admin"
                            className={styles.themeToggle}
                            aria-label="Admin"
                            title={t('admin')}
                        >
                            <Settings size={18} />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
