'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
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
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/login.schema';
import { forgotPassword } from '../api/auth.api';
import { LoadingSpinner } from '@/ui/atoms';
import toast from 'react-hot-toast';

export function ForgotPasswordForm() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      phone: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword({ phone: data.phone.trim() });
      toast.success(t('auth.forgotPasswordSuccess'));
      router.push(`/${locale}/reset-password?phone=${encodeURIComponent(data.phone.trim())}`);
    } catch {
      toast.error(t('auth.forgotPasswordError'));
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{t('auth.forgotPassword')}</CardTitle>
        <CardDescription className="text-center">
          {t('auth.forgotPasswordDescription')}
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
                      {...field}
                    />
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
              {t('auth.sendOtpByWhatsApp')}
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
