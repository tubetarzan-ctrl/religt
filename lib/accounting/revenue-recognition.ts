import type { Vertical } from "@/types/database";

export type RevenuePolicy = "immediate" | "on_completion";

export interface VerticalAccountConfig {
  revenueAccountCode: string;
  unearnedRevenueAccountCode: string | null;
  policy: RevenuePolicy;
}

// Section 7.4 / Day 1 checklist: recognize immediately for Air Tickets & Visas
// (service delivered at/near time of sale), recognize on trip completion for
// Ziarat/Umrah/Sunni Group (service delivered later, after a multi-week gap).
export const VERTICAL_ACCOUNTS: Record<Vertical, VerticalAccountConfig> = {
  iraq_ziarat: { revenueAccountCode: "41000", unearnedRevenueAccountCode: "21100", policy: "on_completion" },
  iran_ziarat: { revenueAccountCode: "42000", unearnedRevenueAccountCode: "21200", policy: "on_completion" },
  umrah: { revenueAccountCode: "43000", unearnedRevenueAccountCode: "21300", policy: "on_completion" },
  air_ticket: { revenueAccountCode: "44000", unearnedRevenueAccountCode: null, policy: "immediate" },
  visa: { revenueAccountCode: "45000", unearnedRevenueAccountCode: null, policy: "immediate" },
  sunni_group: { revenueAccountCode: "46000", unearnedRevenueAccountCode: "21400", policy: "on_completion" },
};

export const CASH_ACCOUNT_CODE = "10200"; // Bank Account — PKR
export const AR_ACCOUNT_CODE = "11000";
