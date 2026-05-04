'use client';

import { ChevronUp } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import styles from './page.module.css';

export default function ScrollTopButton() {
    const { t } = useLanguage();

    return (
        <button
            className={styles.scrollTop}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={t('scrollTop')}
            title={t('scrollTop')}
        >
            <ChevronUp size={20} />
        </button>
    );
}
