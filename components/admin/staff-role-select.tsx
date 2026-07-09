"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateStaffRole } from "@/lib/actions/admin-settings";
import type { Role } from "@/types/database";

const ROLES: Role[] = ["super_admin", "admin", "accountant", "sales_staff", "guide", "staff", "customer"];

export function StaffRoleSelect({ userId, role }: { userId: string; role: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={role}
      disabled={pending}
      onValueChange={(value) => {
        if (!value) return;
        startTransition(async () => {
          await updateStaffRole(userId, value);
          toast.success(`Role updated to ${value}`);
        });
      }}
    >
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((r) => (
          <SelectItem key={r} value={r}>
            {r}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
