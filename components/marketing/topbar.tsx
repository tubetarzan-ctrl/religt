export function Topbar({ announcement }: { announcement: string }) {
  return (
    <div className="bg-primary-dark py-2 text-[13px] text-hero-text">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <span>{announcement}</span>
        <span>
          📞 +92 3XX XXXXXXX &nbsp;·&nbsp; ✉ inquiries@religioustours.com
        </span>
      </div>
    </div>
  );
}
