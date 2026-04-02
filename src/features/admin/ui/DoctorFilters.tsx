"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

type DoctorFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  isActive?: boolean;
  onIsActiveChange: (value: boolean | undefined) => void;
};

export function DoctorFilters({
  search,
  onSearchChange,
  isActive,
  onIsActiveChange,
}: DoctorFiltersProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("doctors.searchPlaceholder")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="w-[180px]">
        <Select
          value={isActive === undefined ? "all" : isActive ? "active" : "inactive"}
          onValueChange={(v) => {
            if (v === "all") onIsActiveChange(undefined);
            else if (v === "active") onIsActiveChange(true);
            else onIsActiveChange(false);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("doctors.filterByStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("doctors.allStatuses")}</SelectItem>
            <SelectItem value="active">{t("doctors.active")}</SelectItem>
            <SelectItem value="inactive">{t("doctors.inactive")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
