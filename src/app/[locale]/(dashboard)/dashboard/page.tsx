"use client";

import { useSession } from "next-auth/react";
import {
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { PageHeader } from "@/ui/molecules";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
};

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {trend && <span className="text-green-600 mr-1">{trend}</span>}
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

type QuickActionProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
};

function QuickAction({ title, description, icon, onClick }: QuickActionProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const t = useTranslations();
  const router = useRouter();
  const { data: session } = useSession();
  const displayName =
    session?.user?.name && session?.user?.lastName
      ? `${session.user.name} ${session.user.lastName}`.trim()
      : session?.user?.name ?? null;
  const welcomeText = displayName
    ? t("dashboard.welcomeUser", { name: displayName })
    : t("dashboard.welcome");

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <p className="text-lg font-medium text-foreground">{welcomeText}</p>
        </CardContent>
      </Card>
      <PageHeader
        title={t("navigation.dashboard")}
        description={t("common.appName")}
        actions={
          <Button onClick={() => router.push("/patients/new")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("patients.newPatient")}
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("navigation.patients")}
          value="128"
          description={t("dashboard.registeredPatients")}
          icon={<Users className="h-4 w-4" />}
          trend="+12%"
        />
        <StatCard
          title={t("navigation.appointments")}
          value="24"
          description={t("dashboard.appointmentsThisWeek")}
          icon={<Calendar className="h-4 w-4" />}
          trend="+8%"
        />
        <StatCard
          title={t("navigation.clinicalHistories")}
          value="342"
          description={t("dashboard.totalHistories")}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatCard
          title={t("dashboard.consultationsToday")}
          value="8"
          description={t("dashboard.completedConsultations")}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.quickActions")}</CardTitle>
            <CardDescription>
              {t("dashboard.quickActionsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <QuickAction
              title={t("patients.newPatient")}
              description={t("dashboard.registerNewPatient")}
              icon={<Users className="h-5 w-5" />}
              onClick={() => router.push("/patients/new")}
            />
            <QuickAction
              title={t("clinicalHistories.newHistory")}
              description={t("dashboard.createNewHistory")}
              icon={<FileText className="h-5 w-5" />}
              onClick={() => router.push("/clinical-histories/new")}
            />
            <QuickAction
              title={t("patients.title")}
              description={t("dashboard.viewPatientsList")}
              icon={<Users className="h-5 w-5" />}
              onClick={() => router.push("/patients")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentConsultations")}</CardTitle>
            <CardDescription>
              {t("dashboard.recentConsultationsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => router.push("/clinical-histories/1")}
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  JP
                </div>
                <div className="flex-1">
                  <p className="font-medium">Juan Pérez</p>
                  <p className="text-sm text-muted-foreground">
                    Gastritis aguda
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t("common.today")}
                </span>
              </div>
              <div
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => router.push("/clinical-histories/2")}
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  MG
                </div>
                <div className="flex-1">
                  <p className="font-medium">María González</p>
                  <p className="text-sm text-muted-foreground">
                    Control rutinario
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t("common.yesterday")}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => router.push("/clinical-histories")}
            >
              {t("dashboard.viewAllHistories")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
