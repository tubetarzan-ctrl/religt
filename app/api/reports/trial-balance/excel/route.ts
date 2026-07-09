import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getTrialBalance } from "@/lib/accounting/reports";
import { fromSmallestUnit } from "@/lib/money";

export async function GET(request: NextRequest) {
  const asOf = request.nextUrl.searchParams.get("asOf") ?? undefined;
  const { balances, totalDebit, totalCredit } = await getTrialBalance(asOf);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Trial Balance");
  sheet.columns = [
    { header: "Code", key: "code", width: 12 },
    { header: "Account", key: "name", width: 40 },
    { header: "Debit", key: "debit", width: 16 },
    { header: "Credit", key: "credit", width: 16 },
  ];

  for (const b of balances.filter((b) => b.debitTotal !== 0 || b.creditTotal !== 0)) {
    sheet.addRow({
      code: b.code,
      name: b.name,
      debit: fromSmallestUnit(b.debitTotal),
      credit: fromSmallestUnit(b.creditTotal),
    });
  }
  sheet.addRow({});
  sheet.addRow({ name: "Total", debit: fromSmallestUnit(totalDebit), credit: fromSmallestUnit(totalCredit) });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="trial-balance.xlsx"`,
    },
  });
}
