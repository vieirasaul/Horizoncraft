import "./section-heading.css";

export function SectionHeading({
  eyebrow,
  title,
  description,
  inverted = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  inverted?: boolean;
}) {
  return (
    <div
      className={`section-heading ${inverted ? "section-heading-inverted" : ""}`}
    >
      <div>
        <p className="section-kicker">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
