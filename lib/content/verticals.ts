import type { Vertical } from "@/types/database";

export interface ProblemSolutionItem {
  problem: string;
  solution: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface WhyUsItem {
  title: string;
  description: string;
}

export interface VerticalContent {
  vertical: Vertical;
  slug: string;
  sect: "sunni" | "shia" | "general";
  navLabel: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  moodQuote: string;
  /** YouTube video ID (the part after ?v=) for the mood-break background — unset falls back to SceneArt. */
  moodVideoYoutubeId?: string;
  trustBar: { label: string; value: string }[];
  problemSolution: ProblemSolutionItem[];
  whyUs: WhyUsItem[];
  faq: FaqItem[];
}

export const verticals: Record<string, VerticalContent> = {
  "iraq-ziarat": {
    vertical: "iraq_ziarat",
    slug: "iraq-ziarat",
    sect: "shia",
    navLabel: "Iraq Ziarat",
    heroEyebrow: "Karbala · Najaf · Kadhimiya · Samarra",
    heroTitle: "Verified Iraq Ziarat Group Departures",
    heroSubtitle:
      "Walk the path of Karbala and Najaf with a fully organized, transparent group — verified departures, trusted guides, no hidden costs.",
    heroCtaPrimary: "Book This Group",
    heroCtaSecondary: "View Past Trips",
    moodQuote: "Every step in Karbala and Najaf, walked together, guided with care.",
    moodVideoYoutubeId: "1-zjmRaeZM8",
    trustBar: [
      { label: "Departures completed", value: "60+" },
      { label: "Years active", value: "9" },
      { label: "WhatsApp response time", value: "< 15 min" },
    ],
    problemSolution: [
      {
        problem: "Fear of visa rejection with no clear guidance.",
        solution: "Document checklist + staff-reviewed application before submission.",
      },
      {
        problem: "Hidden costs revealed only after booking.",
        solution: "Transparent, all-inclusive pricing shown upfront on every departure.",
      },
      {
        problem: "Disorganized groups with no on-ground support.",
        solution: "Dedicated guide, structured itinerary, and 24/7 WhatsApp support throughout.",
      },
    ],
    whyUs: [
      { title: "WhatsApp AI Support", description: "Instant answers on pricing, visas, and departure dates — day or night." },
      { title: "Verified Payment Tracking", description: "Every bank transfer is verified and confirmed with a receipt, no ambiguity." },
      { title: "Transparent Pricing", description: "What you see is what you pay — no hidden add-ons at departure." },
      { title: "Video-Verified Reviews", description: "Real, unedited reviews from past Ziarat groups — not just text testimonials." },
    ],
    faq: [
      { question: "How long does the Iraq visa take to process?", answer: "Typically 7–10 business days once all documents are submitted correctly." },
      { question: "What hotel star rating should I expect?", answer: "3–4 star hotels close to the shrines in Karbala and Najaf, detailed per departure." },
      { question: "What is your refund policy?", answer: "100% refund if cancelled 60+ days before departure, 50% for 30–60 days, non-refundable under 14 days." },
      { question: "What's included in the package price?", answer: "Hotel accommodation, ground transport, guide fees, and visa processing. Airfare is quoted separately unless noted." },
      { question: "Can elderly or wheelchair-using travelers join?", answer: "Yes — flag this during booking so we can arrange suitable accommodation and transport." },
      { question: "Is the itinerary fixed or can it be customized?", answer: "The group itinerary is fixed for logistics, but private customized trips can be arranged on request." },
      { question: "How many people are in each group?", answer: "Group sizes vary by departure — check the seats-remaining counter on each upcoming departure card." },
      { question: "What documents do I need to travel?", answer: "A valid passport (6+ months validity), passport photos, and CNIC copy — full checklist provided after booking." },
    ],
  },
  "iran-ziarat": {
    vertical: "iran_ziarat",
    slug: "iran-ziarat",
    sect: "shia",
    navLabel: "Iran Ziarat",
    heroEyebrow: "Mashhad · Qom · Shiraz",
    heroTitle: "Iran Ziarat — Mashhad & Qom Group Departures",
    heroSubtitle:
      "Visit Imam Reza's shrine in Mashhad and the sacred city of Qom with a fully-managed group and fast, reliable visa processing.",
    heroCtaPrimary: "Book This Group",
    heroCtaSecondary: "View Past Trips",
    moodQuote: "A journey to Mashhad and Qom, carried by faith and careful planning.",
    moodVideoYoutubeId: "p4sbcJFeQRs",
    trustBar: [
      { label: "Departures completed", value: "45+" },
      { label: "Years active", value: "9" },
      { label: "WhatsApp response time", value: "< 15 min" },
    ],
    problemSolution: [
      {
        problem: "Uncertainty over Iran visa processing time.",
        solution: "Dedicated visa tracking with clear day-by-day status updates.",
      },
      {
        problem: "Hidden costs revealed only after booking.",
        solution: "Transparent, all-inclusive pricing shown upfront on every departure.",
      },
      {
        problem: "Disorganized groups with no on-ground support.",
        solution: "Farsi-speaking guide, structured itinerary, 24/7 WhatsApp support.",
      },
    ],
    whyUs: [
      { title: "WhatsApp AI Support", description: "Instant answers on visa timelines, pricing, and departure dates." },
      { title: "Verified Payment Tracking", description: "Every bank transfer is verified and confirmed with a receipt." },
      { title: "Transparent Pricing", description: "No hidden add-ons — price shown is the price you pay." },
      { title: "Video-Verified Reviews", description: "Real, unedited reviews from past Mashhad and Qom groups." },
    ],
    faq: [
      { question: "How long does the Iran visa take to process?", answer: "Usually 10–15 business days — this is the most time-sensitive step, so apply early." },
      { question: "What hotel star rating should I expect?", answer: "3–4 star hotels within walking distance of Haram-e Razavi in Mashhad." },
      { question: "What is your refund policy?", answer: "100% refund if cancelled 60+ days before departure, 50% for 30–60 days, non-refundable under 14 days." },
      { question: "What's included in the package price?", answer: "Hotel accommodation, ground transport, guide fees, and visa processing." },
      { question: "Is Shiraz included in every departure?", answer: "Shiraz is an optional extension on select departures — check the itinerary per group." },
      { question: "Do I need a Farsi-speaking guide?", answer: "Every group is accompanied by a guide fluent in Farsi and Urdu/English." },
      { question: "How many people are in each group?", answer: "Check the seats-remaining counter on each upcoming departure card." },
      { question: "What documents do I need to travel?", answer: "A valid passport (6+ months validity), passport photos, and CNIC copy." },
    ],
  },
  umrah: {
    vertical: "umrah",
    slug: "umrah",
    sect: "general",
    navLabel: "Umrah",
    heroEyebrow: "Standard · Premium · Luxury",
    heroTitle: "Umrah Packages — Choose Your Tier",
    heroSubtitle:
      "14, 21, or 28-day Umrah packages with hotels steps from the Haram. Transparent tier pricing, no surprises at checkout.",
    heroCtaPrimary: "Get a Quote",
    heroCtaSecondary: "View Past Trips",
    moodQuote: "Steps from the Haram, every detail arranged so you can simply be present.",
    moodVideoYoutubeId: "W5Qw07Eruzk",
    trustBar: [
      { label: "Departures completed", value: "120+" },
      { label: "Years active", value: "9" },
      { label: "WhatsApp response time", value: "< 15 min" },
    ],
    problemSolution: [
      {
        problem: "Confusing package tiers with unclear inclusions.",
        solution: "Standard, Premium, and Luxury tiers with a clear inclusions comparison table.",
      },
      {
        problem: "Hidden costs revealed only after booking.",
        solution: "Transparent, all-inclusive pricing shown upfront per tier.",
      },
      {
        problem: "Uncertainty over hotel distance from Haram.",
        solution: "Exact hotel names and walking distance listed per package.",
      },
    ],
    whyUs: [
      { title: "WhatsApp AI Support", description: "Instant answers on tier pricing, hotels, and departure dates." },
      { title: "Verified Payment Tracking", description: "Every bank transfer is verified and confirmed with a receipt." },
      { title: "Transparent Pricing", description: "What you see is what you pay — no hidden add-ons." },
      { title: "Video-Verified Reviews", description: "Real, unedited reviews from past Umrah groups." },
    ],
    faq: [
      { question: "What's the difference between Standard, Premium, and Luxury?", answer: "Hotel star rating and distance from Haram — Luxury hotels are steps from the entrance, Standard are a short shuttle ride away." },
      { question: "How long does an Umrah visa take?", answer: "Typically 5–7 business days once documents are submitted." },
      { question: "What is your refund policy?", answer: "100% refund if cancelled 60+ days before departure, 50% for 30–60 days, non-refundable under 14 days." },
      { question: "What's included in the package price?", answer: "Hotel accommodation, ground transport, guide fees, and Umrah visa processing." },
      { question: "Can I do 14, 21, or 28 days?", answer: "Yes — all three durations are available on every tier, priced accordingly." },
      { question: "Is airfare included?", answer: "Airfare is quoted separately and can be added at checkout." },
      { question: "How many people are in each group?", answer: "Check the seats-remaining counter on each upcoming departure card." },
      { question: "What documents do I need to travel?", answer: "A valid passport (6+ months validity), passport photos, CNIC copy, and vaccination certificate." },
    ],
  },
  "air-tickets": {
    vertical: "air_ticket",
    slug: "air-tickets",
    sect: "general",
    navLabel: "Air Tickets",
    heroEyebrow: "Domestic & International",
    heroTitle: "Where Are You Flying?",
    heroSubtitle:
      "Standalone air ticketing for Ziarat, Umrah, and general travel — competitive fares, fast confirmation.",
    heroCtaPrimary: "Search Flights",
    heroCtaSecondary: "Contact Us",
    moodQuote: "Wherever the journey leads, booked simply and confirmed fast.",
    moodVideoYoutubeId: "nlujlQxAhLM",
    trustBar: [
      { label: "Tickets issued", value: "2,000+" },
      { label: "Years active", value: "9" },
      { label: "WhatsApp response time", value: "< 15 min" },
    ],
    problemSolution: [
      {
        problem: "Unclear fare breakdowns with surprise fees.",
        solution: "Full fare breakdown shown before payment — base fare, taxes, service fee.",
      },
      {
        problem: "Slow ticket confirmation.",
        solution: "Confirmed e-tickets issued within hours of payment verification.",
      },
      {
        problem: "No support after booking.",
        solution: "WhatsApp support for date changes, cancellations, and rebooking.",
      },
    ],
    whyUs: [
      { title: "WhatsApp AI Support", description: "Instant fare quotes and booking status updates." },
      { title: "Verified Payment Tracking", description: "Every bank transfer is verified and confirmed with a receipt." },
      { title: "Transparent Pricing", description: "Full fare breakdown, no surprise fees." },
      { title: "Fast Ticketing", description: "E-tickets issued within hours of payment verification." },
    ],
    faq: [
      { question: "How far in advance should I book?", answer: "For the best fares, book 3–4 weeks ahead, especially around Ramadan and Hajj season." },
      { question: "Can I change my travel dates after booking?", answer: "Yes, subject to airline change fees — contact us on WhatsApp for the current fare difference." },
      { question: "What is your refund policy?", answer: "Refunds follow the issuing airline's fare rules; we do not add extra cancellation fees beyond the airline's." },
      { question: "Do you handle group ticketing for Ziarat/Umrah groups?", answer: "Yes — group fares are available for Ziarat and Umrah bookings made through our other verticals." },
      { question: "What payment methods do you accept?", answer: "Bank transfer with proof-of-payment upload — see the checkout page for account details." },
      { question: "Do you issue international tickets only?", answer: "No, we issue both domestic and international tickets." },
      { question: "How do I receive my e-ticket?", answer: "Your e-ticket is emailed and sent via WhatsApp once payment is verified." },
      { question: "Can I get a fare quote without booking?", answer: "Yes — message us on WhatsApp with your route and dates for a free quote." },
    ],
  },
  visas: {
    vertical: "visa",
    slug: "visas",
    sect: "general",
    navLabel: "Visas",
    heroEyebrow: "Umrah · Iran · Iraq/Syria · Visit Visas",
    heroTitle: "Visa in X Days — Document Checklist Included",
    heroSubtitle:
      "Umrah visa, Iran visa, Iraq/Syria visa, and general visit visa processing — clear timelines, no guesswork.",
    heroCtaPrimary: "Start My Visa",
    heroCtaSecondary: "View Document Checklist",
    moodQuote: "Clear timelines, careful paperwork, one less thing to worry about.",
    moodVideoYoutubeId: "m3BkKFHHNbs",
    trustBar: [
      { label: "Visas processed", value: "3,000+" },
      { label: "Years active", value: "9" },
      { label: "WhatsApp response time", value: "< 15 min" },
    ],
    problemSolution: [
      {
        problem: "Confusing, ever-changing document requirements.",
        solution: "Up-to-date checklist per visa type, reviewed by our staff before submission.",
      },
      {
        problem: "No visibility into application status.",
        solution: "Status tracking shared directly on WhatsApp at every stage.",
      },
      {
        problem: "Rejections due to avoidable paperwork errors.",
        solution: "Every application staff-reviewed before submission to catch errors early.",
      },
    ],
    whyUs: [
      { title: "WhatsApp AI Support", description: "Instant answers on document requirements and processing time." },
      { title: "Verified Payment Tracking", description: "Every bank transfer is verified and confirmed with a receipt." },
      { title: "Transparent Pricing", description: "Visa fee and service fee shown separately, no hidden charges." },
      { title: "Staff-Reviewed Applications", description: "Every application checked for errors before submission." },
    ],
    faq: [
      { question: "How long does visa processing take?", answer: "Varies by visa type: Umrah 5–7 days, Iraq 7–10 days, Iran 10–15 days, general visit visas vary by country." },
      { question: "What documents do I need?", answer: "A visa-specific checklist is provided once you select your visa type — typically passport, photos, and CNIC copy at minimum." },
      { question: "What is your refund policy on visa fees?", answer: "Government/embassy visa fees are non-refundable once submitted; our service fee is refundable if we haven't started processing." },
      { question: "Can you expedite my visa?", answer: "Some visa types offer expedited processing for an additional embassy fee — ask on WhatsApp." },
      { question: "Do you handle group visa applications?", answer: "Yes, for Ziarat and Umrah groups we handle the full group's visa applications together." },
      { question: "What if my visa is rejected?", answer: "We review every application before submission to minimize this risk; in the rare case of rejection we help you understand the reason and reapply if possible." },
      { question: "Can I apply for a visa without booking a tour package?", answer: "Yes, visa services are available as a standalone service." },
      { question: "How do I submit my documents?", answer: "Upload via our website or send directly on WhatsApp — both are accepted." },
    ],
  },
};

export const sunniGroupTours: VerticalContent = {
  vertical: "sunni_group",
  slug: "sunni-group-tours",
  sect: "sunni",
  navLabel: "Sunni Group Tours",
  heroEyebrow: "Iraq Ziarat + Umrah — One Combined Sunni Journey",
  heroTitle: "Iraq Ziarat + Umrah — One Sunni Group Journey",
  heroSubtitle:
    "A single combined journey curated for Sunni travelers — historical and Companion-era sites in Iraq plus a full Umrah, led by an accompanying Sunni scholar.",
  heroCtaPrimary: "Book This Group",
  heroCtaSecondary: "View Past Trips",
  moodQuote: "One journey, Iraq and Umrah together, guided by a scholar who walks it with you.",
  moodVideoYoutubeId: "_2AzplxN_9I",
  trustBar: [
    { label: "Departures completed", value: "18+" },
    { label: "Years active", value: "9" },
    { label: "WhatsApp response time", value: "< 15 min" },
  ],
  problemSolution: [
    {
      problem: "No Sunni-curated itinerary for Iraq's historical/Companion-era sites.",
      solution: "Itinerary built specifically around Sunni-appropriate sites and scholarship, distinct from Shia-oriented Ziarat.",
    },
    {
      problem: "Booking Iraq and Umrah separately means two visas, two flights, two funnels.",
      solution: "One combined package: single price, single itinerary, one visa-and-flight journey where possible.",
    },
    {
      problem: "No accompanying Sunni scholar on generic group tours.",
      solution: "A dedicated Sunni religious scholar/guide travels with the group for the full journey.",
    },
  ],
  whyUs: [
    { title: "Sunni Scholar-Led", description: "An accompanying Sunni scholar with credentials shared before you book." },
    { title: "One Combined Journey", description: "Iraq + Umrah as a single itinerary and price — not two separate bookings." },
    { title: "Verified Payment Tracking", description: "Every bank transfer is verified and confirmed with a receipt." },
    { title: "Video-Verified Reviews", description: "Reviews filtered strictly to this group — never mixed with the Shia-oriented Iraq Ziarat page." },
  ],
  faq: [
    { question: "Is this itinerary Sunni-appropriate?", answer: "Yes — every site, guide, and itinerary detail on this page is curated specifically for a Sunni audience, separate from our Shia-oriented Iraq Ziarat page." },
    { question: "Will there be a Sunni scholar with the group?", answer: "Yes, an accompanying Sunni religious scholar travels with the group for the entire journey — see their profile below." },
    { question: "Can I do Iraq and Umrah as one visa-and-flight itinerary, or do I need two trips?", answer: "This combined package is built to minimize separate visas/flights where possible — ask our team for the current routing on your departure." },
    { question: "Can I book Iraq-only or Umrah-only instead of the combined package?", answer: "Yes — use the package builder above to choose Iraq-only, Umrah-only, or Combined pricing." },
    { question: "What is your refund policy?", answer: "100% refund if cancelled 60+ days before departure, 50% for 30–60 days, non-refundable under 14 days." },
    { question: "What hotel star rating should I expect?", answer: "3–4 star hotels in Iraq and Umrah-tier hotels near the Haram, detailed per departure." },
    { question: "How many people are in each group?", answer: "Check the seats-remaining counter on the departure card above." },
    { question: "What documents do I need to travel?", answer: "A valid passport (6+ months validity), passport photos, and CNIC copy — full checklist provided after booking." },
  ],
};

export function getVerticalBySlug(slug: string): VerticalContent | undefined {
  if (slug === "sunni-group-tours") return sunniGroupTours;
  return verticals[slug];
}

export const allLandingSlugs = [...Object.keys(verticals), "sunni-group-tours"];
