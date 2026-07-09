// All money is stored as integers in the smallest currency unit (paisa) to avoid float rounding errors.
// Section 3, rule 6 of the master brief.

export function toSmallestUnit(displayAmount: number): number {
  return Math.round(displayAmount * 100);
}

export function fromSmallestUnit(smallestUnit: number): number {
  return smallestUnit / 100;
}

export function formatMoney(smallestUnit: number, currency = "PKR"): string {
  const amount = fromSmallestUnit(smallestUnit);
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
