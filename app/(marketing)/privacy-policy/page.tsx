export const metadata = { title: "Privacy Policy — S.Religious Tours" };

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-bg py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl text-ink">Privacy Policy</h1>
        <p className="mt-2 text-sm text-ink-soft">Last updated: 2026</p>

        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink-soft">
          <p>
            S.Religious Tours (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your privacy. This
            policy explains what information we collect when you use our website or book a tour with us, and how
            we use it.
          </p>

          <div>
            <h2 className="font-heading text-xl text-ink">Information we collect</h2>
            <p className="mt-2">
              When you make an inquiry or booking, we collect your name, phone/WhatsApp number, email, and travel
              document details (passport number, expiry, and similar) needed to process visas, air tickets, and
              group registrations. Payment proofs you upload are stored securely and reviewed by our accounts team.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl text-ink">How we use it</h2>
            <p className="mt-2">
              Your information is used to process bookings, coordinate visas and travel documents, send booking and
              payment updates over WhatsApp/email, and respond to your inquiries — including through our AI
              assistant, which only answers using our own tour and policy information.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl text-ink">Sharing</h2>
            <p className="mt-2">
              We share traveler details only with parties necessary to deliver your trip — airlines, hotels, visa
              processing offices, and government authorities where legally required. We do not sell your data.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl text-ink">Contact us</h2>
            <p className="mt-2">
              For any privacy questions or to request your data be corrected or removed, contact us at{" "}
              <a href="mailto:sreligioustours2022@gmail.com" className="text-primary hover:underline">
                sreligioustours2022@gmail.com
              </a>{" "}
              or WhatsApp 0336-0816469.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
