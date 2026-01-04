import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/components/LanguageProvider';

export const metadata: Metadata = {
    title: {
        default: '多做多说',
        template: '%s | 多做多说',
    },
    description: '技术与随笔的个人博客',
    keywords: ['Blog', 'Engineering', 'Algorithm', '技术', '随笔'],
    authors: [{ name: 'Hu Sun' }],
    openGraph: {
        title: '多做多说',
        description: '技术与随笔的个人博客',
        type: 'website',
        locale: 'zh_CN',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-CN" suppressHydrationWarning>
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
                />
            </head>
            <body>
                <ThemeProvider>
                    <LanguageProvider>
                        <div className="site-wrapper">
                            <Header />
                            <main className="main-content">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
