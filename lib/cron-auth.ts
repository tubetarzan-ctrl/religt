import { NextRequest, NextResponse } from "next/server";

/** Vercel Cron sends this header automatically when CRON_SECRET is set as an env var. */
export function requireCronAuth(request: NextRequest): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) return null; // not configured yet in dev — allow through
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
