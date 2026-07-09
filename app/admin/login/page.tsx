import Image from "next/image";
import { signInWithPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <Card className="w-full max-w-[420px] border-white/10 bg-brand-bg-elevated shadow-2xl">
        <CardHeader className="pb-2 text-center">
          <span className="mx-auto mb-2 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-md">
            <Image src="/logo.jpg" alt="S.Religious Tours logo" width={56} height={56} className="h-full w-full object-cover" priority />
          </span>
          <CardTitle className="font-heading text-2xl text-brand-text">
            S.Religious Tours
          </CardTitle>
          <p className="text-sm text-brand-text-muted">Admin &amp; Staff Sign In</p>
        </CardHeader>
        <CardContent className="pt-4">
          {params.error && (
            <p className="mb-4 rounded-md bg-destructive/15 px-3 py-2.5 text-sm text-destructive">
              {params.error}
            </p>
          )}
          <form action={signInWithPassword} className="space-y-5">
            <input type="hidden" name="redirect" value={params.redirect ?? "/admin/dashboard"} />
            <div className="space-y-2">
              <Label htmlFor="email" className="text-brand-text-muted">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="h-11 w-full border-white/15 bg-brand-bg px-3.5 text-brand-text placeholder:text-brand-text-muted/60 focus-visible:border-brand-primary focus-visible:ring-brand-primary/30"
                placeholder="you@religioustours.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-brand-text-muted">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="h-11 w-full border-white/15 bg-brand-bg px-3.5 text-brand-text focus-visible:border-brand-primary focus-visible:ring-brand-primary/30"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="h-11 w-full bg-brand-primary text-base font-semibold hover:bg-brand-primary/90">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
