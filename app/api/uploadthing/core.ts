import { createUploadthing, type FileRouter } from "uploadthing/next";
import { createClient } from "@/lib/supabase/server";

const f = createUploadthing();

async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const staffRoles = ["super_admin", "admin", "accountant", "sales_staff", "staff", "guide"];
  if (!profile || !staffRoles.includes(profile.role)) throw new Error("Unauthorized");

  return { userId: user.id };
}

export const ourFileRouter = {
  // Customer-uploaded bank transfer proof — no auth required (public checkout flow),
  // but scoped tightly to image/pdf and small size to control abuse.
  paymentProof: f({ image: { maxFileSize: "8MB" }, pdf: { maxFileSize: "8MB" } })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  // Customer review photo/video uploads — public, no login required per Section 5.2.
  reviewMedia: f({
    image: { maxFileSize: "8MB", maxFileCount: 6 },
    video: { maxFileSize: "128MB" },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),

  // Gallery + hotel images — staff only.
  galleryImage: f({ image: { maxFileSize: "8MB", maxFileCount: 20 } })
    .middleware(async () => requireStaff())
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
