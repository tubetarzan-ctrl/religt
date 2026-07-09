export const metadata = { title: "Terms & Conditions — S.Religious Tours" };

export default function TermsPage() {
  return (
    <section className="bg-bg py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl text-ink">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-ink-soft">Last updated: 2026</p>

        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink-soft">
          <p>
            S.Religious Tours is a licensed travel operator (Govt. License GL#5635, NTN 8259868-1) registered with
            the Department of Tourist Services and the Karachi Chamber of Commerce &amp; Industry. By booking a
            tour, air ticket, or visa service with us, you agree to the terms below.
          </p>

          <div>
            <h2 className="font-heading text-xl text-ink">Bookings</h2>
            <p className="mt-2">
              A booking is confirmed once your registration form and advance payment are received and verified by
              our team. Seat availability shown on this website is updated in real time but is not guaranteed until
              confirmed.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl text-ink">Documents</h2>
            <p className="mt-2">
              Travelers are responsible for providing valid passports (minimum 6 months validity) and any documents
              requested for visa processing. Delays caused by incomplete or incorrect documents are the
              traveler&rsquo;s responsibility.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl text-ink">Itinerary changes</h2>
            <p className="mt-2">
              Itineraries, hotels, and guides are arranged in good faith but may change due to circumstances beyond
              our control (visa authority decisions, flight schedules, security situations). We will inform
              travelers of material changes as soon as possible.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl text-ink">Refunds &amp; cancellations</h2>
            <p className="mt-2">
              See our{" "}
              <a href="/refund-policy" className="text-primary hover:underline">
                Refund Policy
              </a>{" "}
              for cancellation terms.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl text-ink">Contact</h2>
            <p className="mt-2">
              S.Religious Tours — Office #1, Subuk Arcade, Near Hashmanis Hospital, M.A. Jinnah Road, Karachi ·{" "}
              <a href="mailto:sreligioustours2022@gmail.com" className="text-primary hover:underline">
                sreligioustours2022@gmail.com
              </a>{" "}
              · 021-32790110
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
