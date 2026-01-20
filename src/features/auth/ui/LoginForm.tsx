'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { loginSchema, type LoginFormData } from '../schemas/login.schema';
import { LoadingSpinner } from '@/ui/atoms';
import { toast } from 'sonner';

export function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        phone: data.phone,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(t('auth.invalidCredentials') || 'Credenciales inválidas');
      } else if (result?.ok) {
        toast.success(t('auth.loginSuccess') || 'Inicio de sesión exitoso');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error(t('auth.loginError') || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{t('auth.login')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.phone') || 'Teléfono'}</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+584241234567"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.password')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || form.formState.isSubmitting}
            >
              {(isLoading || form.formState.isSubmitting) ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              {t('auth.login')}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link
          href="/forgot-password"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          {t('auth.forgotPassword')}
        </Link>
      </CardFooter>
    </Card>
  );
}
