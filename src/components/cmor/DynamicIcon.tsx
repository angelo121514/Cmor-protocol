"use client";

import { type ReactNode } from "react";
import {
  Headphones,
  Target,
  Phone,
  BookOpen,
  BarChart3,
  Database,
  RefreshCcw,
  Filter,
  Search,
  CalendarCheck,
  Zap,
  GraduationCap,
  Settings,
  LineChart,
  Microscope,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Headphones,
  Target,
  Phone,
  BookOpen,
  BarChart3,
  Database,
  RefreshCcw,
  Filter,
  Search,
  CalendarCheck,
  Zap,
  GraduationCap,
  Settings,
  LineChart,
  Microscope,
};

export function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}): ReactNode {
  const Icon = iconMap[name] || Headphones;
  return <Icon className={className} />;
}
