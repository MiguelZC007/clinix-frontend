import { AuthLayout } from '@/ui/templates';

type AuthLayoutPageProps = {
  children: React.ReactNode;
};

export default function AuthLayoutPage({ children }: AuthLayoutPageProps) {
  return <AuthLayout>{children}</AuthLayout>;
}
