import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {};

for (const [key, value] of Object.entries(Icons)) {
  if (typeof value === "function") {
    iconMap[key] = value as LucideIcon;
  }
}

export const getIcon = (name?: string): LucideIcon => {
  if (!name) return iconMap["HelpCircle"];
  return iconMap[name] || iconMap["HelpCircle"];
};