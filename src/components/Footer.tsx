import Link from 'next/link';
import { Github } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerInner}`}>
                <p className={styles.copyright}>
                    © {new Date().getFullYear()} 多做多说. All rights reserved.
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
