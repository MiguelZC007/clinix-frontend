import { redirect } from '@/i18n/navigation';

export default function NotFound() {
  redirect({ href: '/', locale: 'es' });
}
