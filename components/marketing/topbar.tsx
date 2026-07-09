export function Topbar({ announcement }: { announcement: string }) {
  return (
    <div className="bg-primary-dark py-2 text-[13px] text-on-primary">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <span>{announcement}</span>
      </div>
    </div>
  );
}
