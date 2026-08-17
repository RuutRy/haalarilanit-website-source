export function GlassLogo({ className }: { className?: string }) {
  return (
    <span className={`glass-panel inline-block px-6 py-5 sm:px-10 sm:py-7 ${className ?? ""}`}>
      <img
        src="/assets/logotext.svg"
        alt="Haalarilanit"
        width={438}
        height={256}
        className="block h-auto w-[min(70vw,480px)] [filter:var(--white-filter)]"
      />
    </span>
  );
}
