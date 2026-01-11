// What You Get section component
interface WhatYouGetProps {
  intro: string;
}

const features = [
  'Full access to HYROS tracking platform',
  'Cross-device and cross-channel attribution',
  'Real-time ad performance dashboard',
  'Direct data feeds to Meta, Google, TikTok',
  'Dedicated onboarding specialist',
  'Priority support',
];

export function WhatYouGet({ intro }: WhatYouGetProps) {
  return (
    <section className="py-12 md:py-16 px-5 md:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl md:text-2xl font-semibold text-[var(--hyros-text-dark)] tracking-tight text-center mb-4">
          What You Get When You Join
        </h3>

        <p className="text-[var(--hyros-text-gray)] text-center mb-8">
          {intro}
        </p>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-[var(--hyros-blue)] flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-[var(--hyros-text-dark)]">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
