export const metadata = { title: "Refund Policy — S.Religious Tours" };

export default function RefundPolicyPage() {
  return (
    <section className="bg-bg py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl text-ink">Refund Policy</h1>
        <p className="mt-2 text-sm text-ink-soft">Last updated: 2026</p>

        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink-soft">
          <p>
            We understand travel plans can change. This policy explains how cancellations and refunds are handled
            for S.Religious Tours group departures, air tickets, and visa services.
          </p>

          <div>
            <h2 className="font-heading text-xl text-ink">Cancellations by the traveler</h2>
            <p className="mt-2">
              Refund amounts depend on how far in advance you cancel before departure, and whether airline tickets,
              visas, or hotel bookings have already been issued on your behalf — those third-party costs are
              non-refundable once processed. Contact our team as early as possible so we can minimize deductions.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl text-ink">Cancellations by us</h2>
            <p className="mt-2">
              If a departure is cancelled by S.Religious Tours (for example due to insufficient group size or
              circumstances beyond our control), you will receive a full refund of amounts paid to us, or the
              option to transfer to another departure.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl text-ink">How refunds are processed</h2>
            <p className="mt-2">
              Approved refunds are processed to the original payment/bank account within a reasonable time after
              approval. Our accounts team will confirm the amount and timeline with you directly over WhatsApp or
              email once your cancellation request is reviewed.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl text-ink">Requesting a refund</h2>
            <p className="mt-2">
              To request a cancellation or refund, contact us on WhatsApp at 0336-0816469 (Sunni Group Tours:
              0334-0035233) or email{" "}
              <a href="mailto:sreligioustours2022@gmail.com" className="text-primary hover:underline">
                sreligioustours2022@gmail.com
              </a>{" "}
              with your booking details.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
