'use client';

import Link from 'next/link';
import { Languages, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import styles from './Header.module.css';

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const { toggleLanguage, t } = useLanguage();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.headerInner}`}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoText}>{t('siteName')}</span>
                </Link>

                <div className={styles.actions}>
                    <button
                        onClick={toggleLanguage}
                        className={styles.iconButton}
                        aria-label={t('toggleLanguage')}
                        title={t('toggleLanguage')}
                    >
                        <Languages size={18} />
                    </button>
                    <button
                        onClick={toggleTheme}
                        className={styles.iconButton}
                        aria-label={t('toggleTheme')}
                        title={t('toggleTheme')}
                    >
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                </div>
            </div>
        </header>
    );
}
