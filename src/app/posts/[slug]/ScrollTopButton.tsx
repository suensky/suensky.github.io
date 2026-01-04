'use client';

import { ChevronUp } from 'lucide-react';
import styles from './page.module.css';

export default function ScrollTopButton() {
    return (
        <button
            className={styles.scrollTop}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="回到顶部"
        >
            <ChevronUp size={20} />
        </button>
    );
}
