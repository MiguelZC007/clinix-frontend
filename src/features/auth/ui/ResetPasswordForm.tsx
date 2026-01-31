'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/login.schema';
import { resetPassword } from '../api/auth.api';
import { LoadingSpinner } from '@/ui/atoms';
import toast from 'react-hot-toast';

export function ResetPasswordForm() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneFromQuery = searchParams.get('phone') ?? '';

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      phone: phoneFromQuery,
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (phoneFromQuery && !form.getValues('phone')) {
      form.setValue('phone', phoneFromQuery);
    }
  }, [phoneFromQuery, form]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword({
        phone: data.phone.trim(),
        code: data.code,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success(t('auth.resetPasswordSuccess'));
      router.push(`/${locale}/login`);
    } catch {
      toast.error(t('auth.resetPasswordError'));
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{t('auth.resetPassword')}</CardTitle>
        <CardDescription className="text-center">
          {t('auth.resetPasswordDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.phone')}</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+584241234567"
                      readOnly={!!phoneFromQuery}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.otpCode')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.newPassword')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.confirmPassword')}</FormLabel>
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
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              {t('auth.resetPassword')}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link
          href="/login"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('auth.backToLogin')}
        </Link>
      </CardFooter>
    </Card>
  );
}
