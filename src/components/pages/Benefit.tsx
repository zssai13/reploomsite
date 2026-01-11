// Benefit section component
interface BenefitProps {
  title: string;
  description: string;
  index: number;
}

export function Benefit({ title, description, index }: BenefitProps) {
  // Alternate between light and dark backgrounds
  const isDark = index % 2 === 0;

  return (
    <section
      className={`py-12 md:py-16 px-5 md:px-8 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}
    >
      <div className="max-w-3xl mx-auto">
        <h3
          className={`text-xl md:text-2xl font-semibold tracking-tight mb-4 ${
            isDark ? 'text-white' : 'text-[var(--hyros-text-dark)]'
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-base md:text-lg leading-relaxed ${
            isDark ? 'text-[var(--hyros-text-muted)]' : 'text-[var(--hyros-text-gray)]'
          }`}
        >
          {description}
        </p>
      </div>
    </section>
  );
}
