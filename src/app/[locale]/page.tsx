import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function HomePage() {
  const t = useTranslations('common');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">{t('appName')}</h1>
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t('appName')}
        </Link>
      </div>
      <div className="flex gap-2 text-sm text-muted-foreground">
        <Link href="/" locale="es" className="hover:underline">
          Español
        </Link>
        <span>|</span>
        <Link href="/" locale="en" className="hover:underline">
          English
        </Link>
      </div>
    </div>
  );
}
