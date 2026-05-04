'use client';

import {
    CopyKey,
    formatDate,
    formatPostCount,
    formatReadingTime,
} from '@/lib/i18n';
import { useLanguage } from './LanguageProvider';

export function LocalizedText({ id }: { id: CopyKey }) {
    const { t } = useLanguage();

    return <>{t(id)}</>;
}

export function LocalizedDate({
    date,
    options,
}: {
    date: string;
    options: Intl.DateTimeFormatOptions;
}) {
    const { language } = useLanguage();

    return <>{formatDate(date, language, options)}</>;
}

export function LocalizedReadingTime({ minutes }: { minutes: number }) {
    const { language } = useLanguage();

    return <>{formatReadingTime(minutes, language)}</>;
}

export function LocalizedPostCount({ count }: { count: number }) {
    const { language } = useLanguage();

    return <>{formatPostCount(count, language)}</>;
}
