export function ComicBurst({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`comic-burst-shape ${className}`}>{children}</span>;
}

export function HalftonePattern({ className = "" }: { className?: string }) {
  return (
    <span className={`halftone-pattern ${className}`} aria-hidden="true" />
  );
}

export function Sticker({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`comic-sticker ${className}`}>{children}</span>;
}
