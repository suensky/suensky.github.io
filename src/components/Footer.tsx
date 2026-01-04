'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import styles from './Footer.module.css';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerInner}`}>
                <p className={styles.copyright}>
                    {t('copyright', { year: new Date().getFullYear() })}
                </p>
                <div className={styles.links}>
                    <Link
                        href="https://github.com/suensky"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                        aria-label="GitHub"
                    >
                        <Github size={18} />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
