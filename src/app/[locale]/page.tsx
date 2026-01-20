import { redirect } from '@/i18n/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Redirigir a pacientes que es una ruta que definitivamente existe
    redirect('/patients');
  } else {
    redirect('/login');
  }
}
