'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Patient } from '../types/patient.types';

type PatientTabsProps = {
  patient: Patient;
};

export function PatientTabs({ patient }: PatientTabsProps) {
  const t = useTranslations();

  const genderLabel = {
    male: t('patients.male'),
    female: t('patients.female'),
    other: t('patients.other'),
  };

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList>
        <TabsTrigger value="info">{t('patients.tabInfo')}</TabsTrigger>
        <TabsTrigger value="antecedents">{t('patients.tabAntecedents')}</TabsTrigger>
        <TabsTrigger value="history">{t('patients.tabHistory')}</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="mt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('patients.personalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('patients.firstName')}</p>
                  <p className="font-medium">{patient.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('patients.lastName')}</p>
                  <p className="font-medium">{patient.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('patients.document')}</p>
                  <p className="font-medium">{patient.document}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('patients.birthDate')}</p>
                  <p className="font-medium">{patient.birthDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('patients.gender')}</p>
                  <Badge variant="secondary">{genderLabel[patient.gender]}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('patients.contactInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('patients.phone')}</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('patients.email')}</p>
                <p className="font-medium">{patient.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('patients.address')}</p>
                <p className="font-medium">{patient.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="antecedents" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('patients.antecedents')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('common.noResults')}</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('patients.clinicalHistory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('common.noResults')}</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
