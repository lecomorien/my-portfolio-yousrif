"use client";

import { Switch } from "./switch";
import { Label } from "./label";

interface SwitchFieldProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  id?: string;
}

export function SwitchField({
  label,
  checked,
  onChange,
  id,
}: SwitchFieldProps) {
  return (
    <div className="flex items-center justify-between border rounded-lg px-3 py-2">
      <Label htmlFor={id}>{label}</Label>

      <Switch
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );
}